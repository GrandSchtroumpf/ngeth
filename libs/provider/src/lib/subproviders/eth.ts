import { Injectable } from '@angular/core';
import { numberToHex, Block, Transaction, TxReceipt, toBN } from '@ngeth/utils';
import { ProvidersModule } from '../providers.module'
import { MainProvider } from '../main-provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({ providedIn : ProvidersModule })
export class Eth {

  constructor(private provider: MainProvider) {}

  public getBlockNumber(): Observable<string> {
    return this.provider
      .rpc<string>('eth_blockNumber')
      .pipe(map(block => toBN(block).toString(10)));;
  }

  public getGasPrice(): Observable<number> {
    return this.provider
      .rpc<number>('eth_gasPrice')
      .pipe(map(block => toBN(block).toString(10)));
  }

  /******
   * BLOCK
   */
  public getBlockByNumber(blockNumber): Observable<any> {
    const isNumber = typeof blockNumber === 'number';
    const params = isNumber ? numberToHex(blockNumber) : blockNumber;
    return this.provider
      .rpc<any>('eth_getBlockByNumber', [params, true])
      .pipe(map(block => (block ? new Block(block) : null)));
  }

  public getBlockByHash(blockHash: string): Observable<any> {
    return this.provider
      .rpc<any>('eth_getBlockByNumber', [blockHash, true])
      .pipe(map(block => (block ? new Block(block) : null)));
  }

  /*************
   * TRANSACTION
   */
  public getTransaction(transactionHash: string): Observable<any> {
    return this.provider
      .rpc<number>('eth_getTransactionByHash', [transactionHash])
      .pipe(map(tx => (tx ? new Transaction(tx) : null)));
  }

  public getTransactionReceipt(transactionHash: string): Observable<any> {
    return this.provider
      .rpc<number>('eth_getTransactionReceipt', [transactionHash])
      .pipe(map(receipt => (receipt ? new TxReceipt(receipt) : null)));
  }

  /***************
   * SUBSCRIPTIONS
   */
  public onNewBlock() {
    return this.provider.rpcSub(['newHeads']).pipe(
      map(res => new Block(res))
    )
  }

  public isSyncing() {
    return this.provider.rpcSub(['syncing']);
  }
}
