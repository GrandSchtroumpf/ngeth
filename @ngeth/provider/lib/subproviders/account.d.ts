import { TxObject, BlockTag } from '@ngeth/utils';
import { MainProvider } from '../provider';
import { Auth } from '../auth';
import { Observable } from 'rxjs';
export declare class Account implements Auth {
    private provider;
    private currentAccount;
    account$: Observable<string>;
    constructor(provider: MainProvider);
    /** Get the default account */
    /** Set the default account */
    defaultAccount: string;
    /** Get the list of accounts available on the node */
    getAccounts(): Observable<string[]>;
    /**
     * Send a transaction to the node
     * @param tx The transaction to pass to the node
     * @param blockTag The block to target
     */
    sendTransaction<T>(tx: TxObject, blockTag?: BlockTag): Observable<T>;
    getBalance(address: string, blockTag?: BlockTag | number): Observable<string>;
    getTransactionCount(address: string, blockTag?: BlockTag | number): Observable<string>;
    sign(message: string, address: string, pwd: string): Observable<string>;
}
