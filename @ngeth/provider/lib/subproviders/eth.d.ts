import { Block } from '@ngeth/utils';
import { MainProvider } from '../provider';
import { Observable } from 'rxjs';
export declare class Eth {
    private provider;
    constructor(provider: MainProvider);
    getBlockNumber(): Observable<string>;
    getGasPrice(): Observable<number>;
    /******
     * BLOCK
     */
    getBlockByNumber(blockNumber: any): Observable<any>;
    getBlockByHash(blockHash: string): Observable<any>;
    /*************
     * TRANSACTION
     */
    getTransaction(transactionHash: string): Observable<any>;
    getTransactionReceipt(transactionHash: string): Observable<any>;
    /***************
     * SUBSCRIPTIONS
     */
    onNewBlock(): Observable<Block>;
    isSyncing(): Observable<{}>;
}
