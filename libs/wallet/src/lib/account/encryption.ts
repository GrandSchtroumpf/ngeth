import { randomBytes } from 'crypto-browserify';

export class EncryptOptions {
  public salt: Buffer | string = randomBytes(32);
  public iv: Buffer = randomBytes(16);
  public kdf: 'pbkdf2' | 'scrypt' = 'scrypt';
  public c = 262144;
  public prf: 'hmac-sha256';
  public dklen = 32;
  public n: 2048 | 4096 | 8192 | 16384 = 8192;
  public r = 8;
  public p = 1;
  public cipher: 'aes-128-ctr' | string = 'aes-128-ctr';
  public uuid: Buffer = randomBytes(16);
  constructor(options?: Partial<EncryptOptions>) {
    for (const key in options) {
      if (this.hasOwnProperty(key)) {
        this[key] = options[key];
      }
    }
    // Transform salt to be a Buffer
    if (options && typeof options.salt === 'string') {
      this.salt = Buffer.from(options.salt.replace('0x', ''), 'hex')
    }
  }
}

export interface Keystore {
  version: 3;
  id: string;
  address: string;
  crypto: {
    ciphertext: string;
    cipherparams: {
        iv: string;
    },
    cipher: string;
    kdf: string;
    kdfparams: {
      dklen: number;
      salt: string;
      // For scrypt encryption
      n?: number;
      p?: number;
      r?: number;
      // For pbkdf2 encryption
      c?: number;
      prf?: 'hmac-sha256';
    };
    mac: string;
  }
}
