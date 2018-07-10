import { Injectable } from '@angular/core';
import { Provider } from '@ngeth/provider';
import { TxObject, toChecksumAddress, checkAddressChecksum } from '@ngeth/utils';

import { Auth } from './auth';
import { Accounts, EncryptOptions, Keystore, EthAccount } from './account';
import { Signer } from './signature/signer';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface KeystoreMap {
  [address: string]: Keystore;
}

@Injectable({ providedIn: 'root'})
export class AuthWallet implements Auth {
  private localKeystore = new BehaviorSubject<KeystoreMap>(null);
  private currentAccount = new BehaviorSubject<string>(null);
  public keystores$ = this.localKeystore.asObservable();
  public account$ = this.currentAccount.asObservable();

  constructor(
    private provider: Provider,
    private signer: Signer,
    private accounts: Accounts
  ) {
    this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
  }

  /** Get the default account */
  get defaultAccount(): string {
    return this.currentAccount.getValue();
  }

  /** Set the default account */
  set defaultAccount(account: string) {
    this.currentAccount.next(toChecksumAddress(account));
  }

  /** Return the keystore map from the localstore */
  private getKeystoreMapFromLocalStorage(): KeystoreMap {
    return new Array(localStorage.length).fill(null)
      .reduce((keyMap: KeystoreMap, none: null, i: number) => {
        const key = localStorage.key(i);
        return checkAddressChecksum(key)
          ? {...keyMap, [key]: this.getKeystore(key) }
          : {...keyMap};
      }, {});
  }

  /**
   * Get a specific keystore depending on its address
   * @param address The address of the keystore
   */
  public getKeystore(address: string): Keystore {
    const checkSum = toChecksumAddress(address);
    return JSON.parse(localStorage.getItem(checkSum));
  }

  /** Return the list of addresses available in the localStorage */
  public getAccounts(): Observable<string[]> {
    return this.keystores$.pipe(map(keyMap => Object.keys(keyMap)));
  }


  /**
   * Create an account
   */
  public create() {
    return this.accounts.create();
  }

  /**
   * Save an account into the localstorage
   * @param account The key pair account
   * @param password The password to encrypt the account with
   */
  public save(account: EthAccount, password: string) {
    const { address, privateKey } = account;
    const keystore = this.encrypt(privateKey, password);
    // Update allKeystore
    localStorage.setItem(address, JSON.stringify(keystore));
    this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
  }

  /**
   * Encrypt an private key into a keystore
   * @param privateKey The private key to encrypt
   * @param password The password to encrypt the private key with
   * @param options A list of options to encrypt the private key
   */
  public encrypt(privateKey: string, password: string, options?: Partial<EncryptOptions>) {
    return this.accounts.encrypt(privateKey, password, options);
  }

  /**
   * Decrypt a keystore object
   * @param keystore The keystore object
   * @param password The password to decrypt the keystore with
   */
  public decrypt(keystore: Keystore, password: string) {
    return this.accounts.decrypt(keystore, password);
  }

  /*************
   * TRANSACTION
   *************/

  /**
   * Send a transaction by signing it
   * @param tx The transaction to send
   * @param privateKey The private key to sign the transaction with
   */
  public sendTransaction(tx: TxObject, privateKey: string) {
    const { rawTransaction } = this.signTx(tx, privateKey);
    return this.sendRawTransaction(rawTransaction);
  }

  /**
   * Send a transaction to the node
   * @param rawTx The signed transaction data.
   */
  public sendRawTransaction(rawTx: string): Observable<string> {
    return this.provider.rpc<string>('eth_sendRawTransaction', [rawTx]);
  }

  /**
   * Sign a transaction with a private key
   * @param tx The transaction to sign
   * @param privateKey The private key to sign the transaction with
   */
  public signTx(tx: TxObject, privateKey: string) {
    return this.signer.signTx(privateKey, tx, this.provider.id);
  }

  /***********
   * SIGNATURE
   */

  /**
   * Sign a message
   * @param message the message to sign
   * @param address the address to sign the message with
   * @param password the password needed to decrypt the private key
   */
  public sign(message: string, address: string, password: string) {
    return this.keystores$.pipe(
      map(keystores => keystores[address]),
      map(keystore => this.decrypt(keystore, password)),
      map(ethAccount => this.signMessage(message, ethAccount.privateKey))
    );
  }

  /**
   * Sign a message with the private key
   * @param message The message to sign
   * @param privateKey The private key to sign the message with
   */
  public signMessage(message: string, privateKey: string) {
    const messageHash = this.signer.hashMessage(message);
    const {r, s, v, signature} = this.signer.sign(privateKey, messageHash);
    return {message, messageHash, v, r, s, signature};
  }

}
