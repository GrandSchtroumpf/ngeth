/// <reference types="node" />
export declare class EncryptOptions {
    salt: Buffer | string;
    iv: Buffer;
    kdf: 'pbkdf2' | 'scrypt';
    c: number;
    prf: 'hmac-sha256';
    dklen: number;
    n: 2048 | 4096 | 8192 | 16384;
    r: number;
    p: number;
    cipher: 'aes-128-ctr' | string;
    uuid: Buffer;
    constructor(options?: Partial<EncryptOptions>);
}
export interface Keystore {
    version: 3;
    id: string;
    address: string;
    crypto: {
        ciphertext: string;
        cipherparams: {
            iv: string;
        };
        cipher: string;
        kdf: string;
        kdfparams: {
            dklen: number;
            salt: string;
            n?: number;
            p?: number;
            r?: number;
            c?: number;
            prf?: 'hmac-sha256';
        };
        mac: string;
    };
}
