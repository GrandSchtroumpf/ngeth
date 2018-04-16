import { Account } from 'web3/types';

export interface JSONHDKey {
    xpriv: string;
    xpub: string;
}

export interface HDKey {
    fromMasterSeed(seedBuffer: Buffer, versions?: any): hdkey;
    fromExtendedKey(extentedKey: string, versions?: any): hdkey;
    fromJSON(jsonHDKey: JSONHDKey): hdkey;
}

export interface hdkey {
    derive(path: string): HDAccount;
    sign(hash: Buffer): Buffer;     // Return a signature
    verify(hash: Buffer, signature: Buffer): boolean;
    toJSON(): JSONHDKey;
    privateKey: string;
    publicKey: string;
    privateExtendedKey: string;
    publicExtendedKey: string;
}

export interface HDAccount {
    _privateKey: Buffer;
    _publicKey: Buffer;
}

export interface Wallet {
    [address: string]: Account | any;
    length: number;
}