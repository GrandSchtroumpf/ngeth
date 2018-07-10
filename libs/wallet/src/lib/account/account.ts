/**
 * Ressources
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 */

import { Injectable } from '@angular/core';
import { WalletModule } from '../wallet.module';

import { v4 } from 'uuid';
import { toChecksumAddress, keccak256 } from '@ngeth/utils';
import { privateKeyVerify, publicKeyCreate } from 'secp256k1';
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'crypto-browserify';
import { EncryptOptions, Keystore } from './encryption';
import scryptsy from 'scrypt.js';

export interface EthAccount {
  privateKey: string;
  address: string;
}


@Injectable({providedIn: WalletModule})
export class Accounts {

  constructor() {}

  /**
   * Create an Ethereum keypair
   */
  public create(): EthAccount {
    let privKey: Buffer;
    do { privKey = randomBytes(32); }
    while (!privateKeyVerify(privKey));
    return this.fromPrivate(privKey);
  }

  /**
   * Create an account from a private key
   * @param privateKey The private key without the prefix '0x'
   */
  public fromPrivate(privateKey: string | Buffer): EthAccount {
    if (typeof privateKey === 'string') {
      privateKey = Buffer.from([privateKey.replace('0x', '')]);
    }
    // Slice(1) is to drop type byte which is hardcoded as 04 ethereum.
    const pubKey = publicKeyCreate(privateKey, false).slice(1);
    const address = '0x' + keccak256(pubKey).substring(26);
    return {
      privateKey: '0x' + privateKey.toString('hex'),
      address: toChecksumAddress(address)
    };
  }

  /**
   * Encrypt an private key into a keystore
   * @param privateKey The private key to encrypt
   * @param password The password to encrypt the private key with
   * @param encryptOptions A list of options to encrypt the private key
   * Code from : https://github.com/ethereum/web3.js/blob/1.0/packages/web3-eth-accounts/src/index.js
   */
  public encrypt(
    privateKey: string,
    password: string,
    encryptOptions?: Partial<EncryptOptions>): Keystore
  {
    const pwd = Buffer.from(password);
    const privKey = Buffer.from(privateKey.replace('0x', ''), 'hex');
    const options = new EncryptOptions(encryptOptions);
    const { salt, iv, kdf, c, n, r, p, dklen, cipher, uuid } = options;
    const kdfParams: Keystore['crypto']['kdfparams'] = {
      dklen: dklen,
      salt: (salt as Buffer).toString('hex')
    };

    let derivedKey;
    if (kdf === 'pbkdf2') {
      kdfParams.c = c;
      kdfParams.prf = 'hmac-sha256';
      derivedKey = pbkdf2Sync(pwd, salt, c, dklen, 'sha256');
    } else if (kdf === 'scrypt') {
      kdfParams.n = n;
      kdfParams.r = r;
      kdfParams.p = p;
      derivedKey = scryptsy(pwd, salt, n, r, p, dklen);
    } else {
      throw new Error('Unsupported Key Derivation Function' + kdf);
    }

    const cipherAlg = createCipheriv(cipher, derivedKey.slice(0, 16), iv);
    if (!cipherAlg) { throw new Error('Unsupported cipher ' + cipher)}
    const cipherText = Buffer.concat([cipherAlg.update(privKey), cipherAlg.final()]);
    const toMac = Buffer.concat([derivedKey.slice(16, 32), cipherText]);
    const mac = keccak256(toMac).replace('0x', '');
    return {
      version: 3,
      id: v4({ random: uuid as any }),
      address: this.fromPrivate(privKey).address.toLowerCase().replace('0x', ''),
      crypto: {
        ciphertext: cipherText.toString('hex'),
        cipherparams: {
            iv: iv.toString('hex')
        },
        cipher: options.cipher,
        kdf: kdf,
        kdfparams: kdfParams,
        mac: mac
      }
    }
  }

  /**
   * Decrypt a keystore object
   * @param keystore The keystore object
   * @param password The password to decrypt the keystore with
   * Code from : https://github.com/ethereumjs/ethereumjs-wallet/blob/master/index.js
   */
  public decrypt(keystore: Keystore, password: string): EthAccount {
    if (typeof password !== 'string') { throw new Error('No password provided'); }
    if (typeof keystore !== 'object') { throw new Error('keystore should be an object'); }
    if (keystore.version !== 3) { throw new Error('Not a V3 wallet'); }

    let derivedKey;
    const { kdf, kdfparams, cipherparams, cipher } = keystore.crypto;
    const pwd = Buffer.from(password, 'utf8');
    const salt = Buffer.from(kdfparams.salt, 'hex');
    const iv = Buffer.from(cipherparams.iv, 'hex');
    // Scrypt encryption
    if (kdf === 'scrypt') {
      const { n, r, p, dklen } = kdfparams;
      derivedKey = scryptsy(pwd, salt, n, r, p, dklen)
    }
    // pbkdf2 encryption
    else if (kdf === 'pbkdf2') {
      if (kdfparams.prf !== 'hmac-sha256') { throw new Error('Unsupported parameters to PBKDF2'); }
      const { c, dklen } = kdfparams;
      derivedKey = pbkdf2Sync(pwd, salt, c, dklen, 'sha256')
    } else {
      throw new Error('Unsupported key derivation scheme')
    }

    const cipherText = Buffer.from(keystore.crypto.ciphertext, 'hex');
    const mac = keccak256(Buffer.concat([ derivedKey.slice(16, 32), cipherText ]))
                  .replace('0x', '');

    if (mac !== keystore.crypto.mac) {
      throw new Error('Key derivation failed - possibly wrong password')
    }

    const decipher = createDecipheriv(cipher, derivedKey.slice(0, 16), iv);
    const seed = Buffer.concat([ decipher.update(cipherText), decipher.final() ]);

    return this.fromPrivate(seed);
  }
}
