import { MainProvider, Auth } from '@ngeth/provider';
import { TxObject } from '@ngeth/utils';
import { Accounts, EncryptOptions, Keystore, EthAccount } from './account';
import { Signer } from './signature/signer';
import { Observable } from 'rxjs';
export interface KeystoreMap {
    [address: string]: Keystore;
}
export declare class Wallet implements Auth {
    private provider;
    private signer;
    private accounts;
    private localKeystore;
    private currentAccount;
    keystores$: Observable<KeystoreMap>;
    account$: Observable<string>;
    constructor(provider: MainProvider, signer: Signer, accounts: Accounts);
    /** Get the default account */
    /** Set the default account */
    defaultAccount: string;
    /** Return the keystore map from the localstore */
    private getKeystoreMapFromLocalStorage();
    /**
     * Get a specific keystore depending on its address
     * @param address The address of the keystore
     */
    getKeystore(address: string): Keystore;
    /** Return the list of addresses available in the localStorage */
    getAccounts(): Observable<string[]>;
    /**
     * Create an account
     */
    create(): EthAccount;
    /**
     * Save an account into the localstorage
     * @param account The key pair account
     * @param password The password to encrypt the account with
     */
    save(account: EthAccount, password: string): void;
    /**
     * Encrypt an private key into a keystore
     * @param privateKey The private key to encrypt
     * @param password The password to encrypt the private key with
     * @param options A list of options to encrypt the private key
     */
    encrypt(privateKey: string, password: string, options?: Partial<EncryptOptions>): Keystore;
    /**
     * Decrypt a keystore object
     * @param keystore The keystore object
     * @param password The password to decrypt the keystore with
     */
    decrypt(keystore: Keystore, password: string): EthAccount;
    /*************
     * TRANSACTION
     *************/
    /**
     * Send a transaction by signing it
     * @param tx The transaction to send
     * @param privateKey The private key to sign the transaction with
     */
    sendTransaction(tx: TxObject, privateKey: string): Observable<string>;
    /**
     * Send a transaction to the node
     * @param rawTx The signed transaction data.
     */
    sendRawTransaction(rawTx: string): Observable<string>;
    /**
     * Sign a transaction with a private key
     * @param tx The transaction to sign
     * @param privateKey The private key to sign the transaction with
     */
    signTx(tx: TxObject, privateKey: string): {
        messageHash: string;
        r: string;
        s: string;
        v: string;
        rawTransaction: string;
    };
    /***********
     * SIGNATURE
     */
    /**
     * Sign a message
     * @param message the message to sign
     * @param address the address to sign the message with
     * @param password the password needed to decrypt the private key
     */
    sign(message: string, address: string, password: string): Observable<{
        message: string;
        messageHash: string;
        v: string;
        r: string;
        s: string;
        signature: string;
    }>;
    /**
     * Sign a message with the private key
     * @param message The message to sign
     * @param privateKey The private key to sign the message with
     */
    signMessage(message: string, privateKey: string): {
        message: string;
        messageHash: string;
        v: string;
        r: string;
        s: string;
        signature: string;
    };
}
