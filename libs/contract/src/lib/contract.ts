import { Injector, InjectionToken, Inject } from '@angular/core';
import { ABIDefinition, ContractModel, ITxObject } from '@ngeth/utils';
import { ContractProvider } from './contract.provider';
import { ABIEncoder, ABIDecoder } from './abi';

import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const CONFIG = new InjectionToken('@ngeth/contract : The config of a contract');

/**
 * TODO : Make it available with decorators
 */

/**
 * @class The abstract class for a contract
 */
export class Contract<T extends ContractModel> {
  private encoder: ABIEncoder;
  private decoder: ABIDecoder;
  private provider: ContractProvider;
  private abi: ABIDefinition[];
  public address: string;
  public calls: { [P in keyof T['calls']]: T['calls'][P]; } = {} as any;
  public sends: { [P in keyof T['sends']]: T['sends'][P]; } = {} as any;
  public events: { [P in keyof T['events']]: T['events'][P]; } = {} as any;

  constructor(
    injector: Injector,
    @Inject(CONFIG) config
  ) {
    this.encoder = injector.get(ABIEncoder);
    this.decoder = injector.get(ABIDecoder);
    this.provider = injector.get(ContractProvider);
    this.init(config.abi, this.getAddress(this.provider.id, config.addresses));
  }

  /**
   * Get the address of the contract for the id network
   * @param id The id of the network
   * @param addresses The list of addresses for the contract
   */
  private getAddress(id: number, addresses): string {
    const net = { 1: 'mainnet', 3: 'ropsten', 4: 'rinkeby', 42: 'kovan' };
    if (!net[id]) { throw new Error(`Network ${id} is not known.`); }
    if (!addresses[net[id]]) { throw new Error('No address provided for ' + net[id]); }
    return addresses[net[id]];
  }

  /**
   * Initialize the contract
   * @param abi The Interface of the contract
   * @param address The address of the contract for the current network
   */
  private init(abi: ABIDefinition[], address?: string) {
    if (!abi) { throw new Error('Please add an abi to the contract'); }
    this.abi = abi;
    if (address) { this.address = address; }
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
