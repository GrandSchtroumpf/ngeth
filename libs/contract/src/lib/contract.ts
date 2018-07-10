import { ABIDefinition, toChecksumAddress, ContractModel, ITxObject } from '@ngeth/utils';
import { ContractProvider } from './contract.provider';
import { ABIEncoder, ABIDecoder } from './abi';

import { Observable, forkJoin } from 'rxjs';
import { map,  switchMap } from 'rxjs/operators';

export class ContractClass<T extends ContractModel> {
  public calls: { [P in keyof T['calls']]: T['calls'][P]; } = {} as any;
  public sends: { [P in keyof T['sends']]: T['sends'][P]; } = {} as any;
  public events: { [P in keyof T['events']]: T['events'][P]; } = {} as any;

  constructor(
    protected encoder: ABIEncoder,
    protected decoder: ABIDecoder,
    protected provider: ContractProvider,
    private abi: ABIDefinition[],
    public address?: string
  ) {
    if (!this.abi) { throw new Error('Please add an abi to the contract'); }
    if (this.address) { this.address = toChecksumAddress(address); }
    const calls: any[] = [];
    const sends: any[] = [];
    const events: any[] = [];
    for (const def of this.abi) {
      if (def.type === 'function' && def.constant === true) {
        calls.push(def);
      }
      if (def.type === 'function' && def.constant === false) {
        sends.push(def);
      }
      if (def.type === 'event') {
        events.push(def);
      }
    }
    calls.forEach(def => (this.calls[def.name] = this.callMethod.bind(this, def)));
    sends.forEach(def => (this.sends[def.name] = this.sendMethod.bind(this, def)));
    events.forEach(def => (this.events[def.name] = this.eventMethod.bind(this, def)));
  }

  /**
   * Deploy the contract on the blockchain
   * @param bytes The bytes of the contract
   * @param params Params to pass into the constructor
   */
  public deploy(bytes: string, ...params: any[]) {
    const constructor = this.abi.find(def => def.type === 'constructor');
    const noParam = params.length === 0;
    const data = noParam ? bytes : this.encoder.encodeConstructor(constructor, bytes, params);
    return this.fillGas({ ...this.provider.defaultTx, data })
      .pipe(switchMap(tx => this.provider.sendTransaction(tx)));
  }

  /**
   * Used for 'call' methods
   * @param method The method to call
   * @param params The params given by the user
   */
  private callMethod(method: ABIDefinition, ...params: any[]) {
    const data = this.encoder.encodeMethod(method, params);
    return this.provider
      .call<string>(this.address, data)
      .pipe(
        map(result => this.decoder.decodeOutputs(result, method.outputs)),
        map(result => result[Object.keys(result)[0]])
      );
  }

  /**
   * Used for 'send' methods
   * @param method The method to send
   * @param params The params given by the user
   */
  private sendMethod(method: ABIDefinition, ...params: any[]) {
    const { to, data } = { to: this.address, data: this.encoder.encodeMethod(method, params) };
    return this.fillGas({ ...this.provider.defaultTx, to, data })
      .pipe(switchMap(tx => this.provider.sendTransaction(tx)));
  }

  /**
   * Used for 'event' definition
   * @param event The event definition in the ABI
   */
  private eventMethod(event: ABIDefinition) {
    const topics = this.encoder.encodeEvent(event);
    return this.provider.event(this.address, [topics]).pipe(
      map(logs => this.decoder.decodeEvent(logs.topics, logs.data, event.inputs))
    );
  }

  /**
   * Fill the estimated amount of gas and gasPrice to use for a transaction
   * @param tx The raw transaction to estimate the gas from
   */
  private fillGas(tx: Partial<ITxObject>): Observable<Partial<ITxObject>> {
    return forkJoin(
      this.provider.estimateGas(tx),
      this.provider.gasPrice()
    ).pipe(map(([gas, gasPrice]) => {
        return { ...tx, gas, gasPrice }
      })
    );
  }

}
