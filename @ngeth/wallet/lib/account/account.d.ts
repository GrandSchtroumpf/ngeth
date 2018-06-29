/// <reference types="node" />
import { EncryptOptions, Keystore } from './encryption';
export interface EthAccount {
    privateKey: string;
    address: string;
}
export declare class Accounts {
    constructor();
    /**
     * Create an Ethereum keypair
     */
    create(): EthAccount;
    /**
     * Create an account from a private key
     * @param privateKey The private key without the prefix '0x'
     */
    fromPrivate(privateKey: string | Buffer): EthAccount;
    /**
     * Encrypt an private key into a keystore
     * @param privateKey The private key to encrypt
     * @param password The password to encrypt the private key with
     * @param encryptOptions A list of options to encrypt the private key
     * Code from : https://github.com/ethereum/web3.js/blob/1.0/packages/web3-eth-accounts/src/index.js
     */
    encrypt(privateKey: string, password: string, encryptOptions?: Partial<EncryptOptions>): Keystore;
    /**
     * Decrypt a keystore object
     * @param keystore The keystore object
     * @param password The password to decrypt the keystore with
     * Code from : https://github.com/ethereumjs/ethereumjs-wallet/blob/master/index.js
     */
    decrypt(keystore: Keystore, password: string): EthAccount;
}
