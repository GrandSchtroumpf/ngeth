import { Inject, Injectable } from '@angular/core';
import { BlockTag, TxLogs, ITxObject, TxObject, hexToNumber, hexToNumberString } from '@ngeth/utils';
import { ProvidersModule, AUTH } from '@ngeth/provider/src/lib/providers.module';
import { Auth } from '@ngeth/provider/src/lib/auth';
import { MainProvider } from '@ngeth/provider/src/lib/main-provider';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn : ProvidersModule })
export class ContractProvider {
  private currentTx = new BehaviorSubject<Partial<ITxObject>>(null);
  public tx$ = this.currentTx.asObservable();
  public id: number;

  constructor(@Inject(AUTH) private auth: Auth, private provider: MainProvider) {
    this.auth.account$
        .subscribe(from => this.defaultTx = { ...this.defaultTx, from });
    this.id = this.provider.id;
  }

  get defaultTx(): Partial<ITxObject> {
    return this.currentTx.getValue();
  }

  set defaultTx(transaction: Partial<ITxObject>) {
    const tx = {...this.currentTx.getValue(), ...transaction };
    this.currentTx.next(tx);
  }

  /**
   * Make a call to the node
   * @param to The address of the contract to contact
   * @param data The data of the call as bytecode
   * @param blockTag The block to target
   */
  public call<T>(
    to: string,
    data: string,
    blockTag: BlockTag = 'latest'
  ): Observable<T> {
    return this.provider.rpc<T>('eth_call', [{ to, data }, blockTag]);
  }

  /**
   * Send a transaction to the node
   * @param tx The transaction to pass to the node
   * @param blockTag The block to target
   */
  public sendTransaction<T>(
    transaction: Partial<ITxObject>,
    ...rest: any[]
  ): Observable<T> {
    const tx = new TxObject(transaction);
    return this.auth.sendTransaction(tx, rest);
  }


  /**
   * Create a RPC request for a subscription
   * @param address The address of the contract
   * @param topics The signature of the event
   */
  public event(
    address: string,
    topics: string[]
  ): Observable<TxLogs> {
    return this.provider.rpcSub<TxLogs>(['logs', {address, topics}]).pipe(
      map(logs => new TxLogs(logs))
    );
  }

  /**
   * Estimate the amount of gas needed for transaction
   * @param transaction The transaction to estimate the gas from
   */
  public estimateGas(transaction: Partial<ITxObject>): Observable<number> {
    const tx = new TxObject(transaction);
    return this.provider.rpc<string>('eth_estimateGas', [tx]).pipe(
      map(gas => hexToNumber(gas.replace('0x', '')))
    );
  }

  /**
   * Returns the current price per gas in wei
   */
  public gasPrice(): Observable<string> {
    return this.provider.rpc<string>('eth_gasPrice', []).pipe(
      map(price => hexToNumberString(price.replace('0x', '')))
    );
  }
}
