import { BlockTag, TxLogs, ITxObject } from '@ngeth/utils';
import { Auth } from './../auth';
import { MainProvider } from './../provider';
import { Observable } from 'rxjs';
export declare class ContractProvider {
    private auth;
    private provider;
    private currentTx;
    tx$: Observable<Partial<ITxObject>>;
    id: number;
    constructor(auth: Auth, provider: MainProvider);
    defaultTx: Partial<ITxObject>;
    /**
     * Make a call to the node
     * @param to The address of the contract to contact
     * @param data The data of the call as bytecode
     * @param blockTag The block to target
     */
    call<T>(to: string, data: string, blockTag?: BlockTag): Observable<T>;
    /**
     * Send a transaction to the node
     * @param tx The transaction to pass to the node
     * @param blockTag The block to target
     */
    sendTransaction<T>(transaction: Partial<ITxObject>, ...rest: any[]): Observable<T>;
    /**
     * Create a RPC request for a subscription
     * @param address The address of the contract
     * @param topics The signature of the event
     */
    event(address: string, topics: string[]): Observable<TxLogs>;
    /**
     * Estimate the amount of gas needed for transaction
     * @param transaction The transaction to estimate the gas from
     */
    estimateGas(transaction: Partial<ITxObject>): Observable<number>;
    /**
     * Returns the current price per gas in wei
     */
    gasPrice(): Observable<string>;
}
