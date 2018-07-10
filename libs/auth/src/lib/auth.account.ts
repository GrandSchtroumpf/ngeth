import { Injectable } from '@angular/core';
import { TxObject, utf8ToHex, BlockTag, toChecksumAddress } from '@ngeth/utils';
import { Provider } from '@ngeth/provider';
import { Auth } from './auth';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn : 'root' })
export class AuthAccount implements Auth {
  private currentAccount = new BehaviorSubject<string>(null);
  public account$ = this.currentAccount.asObservable();

  constructor(private provider: Provider) {}

  /** Get the default account */
  get defaultAccount(): string {
    return this.currentAccount.getValue();
  }

  /** Set the default account */
  set defaultAccount(account: string) {
    this.currentAccount.next(toChecksumAddress(account));
  }

  /** Get the list of accounts available on the node */
  public getAccounts(): Observable<string[]> {
    return this.provider.rpc<string[]>('eth_accounts');
  }

  /**
   * Send a transaction to the node
   * @param tx The transaction to pass to the node
   * @param blockTag The block to target
   */
  public sendTransaction<T>(
    tx: TxObject,
    blockTag: BlockTag = 'latest'
  ): Observable<T> {
    return this.provider.rpc<T>('eth_sendTransaction', [tx, blockTag]);
  }

  public getBalance(address: string, blockTag?: BlockTag | number) {
    return this.provider.rpc<string>('eth_getBalance', [address, blockTag || 'latest']);
  }

  public getTransactionCount(address: string, blockTag?: BlockTag | number) {
    return this.provider.rpc<string>('eth_getTransactionCount', [
      address,
      blockTag || 'latest'
    ]);
  }

  public sign(message: string, address: string,  pwd: string): Observable<string> {
    const msg = utf8ToHex(message);
    const method = this.provider.type === 'web3' ? 'personal_sign' : 'eth_sign';
    const params = this.provider.type === 'web3' ? [address, msg, pwd] : [msg, address];
    return this.provider.rpc<string>(method, params);
  }
}
