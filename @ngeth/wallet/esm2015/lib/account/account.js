/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Ressources
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 */
import { Injectable } from '@angular/core';
import { WalletModule } from './../wallet.module';
import { v4 } from 'uuid';
import { toChecksumAddress, keccak256 } from '@ngeth/utils';
import { privateKeyVerify, publicKeyCreate } from 'secp256k1';
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'crypto-browserify';
import { EncryptOptions } from './encryption';
import scryptsy from 'scrypt.js';
import * as i0 from "@angular/core";
import * as i1 from "../wallet.module";
/**
 * @record
 */
export function EthAccount() { }
function EthAccount_tsickle_Closure_declarations() {
    /** @type {?} */
    EthAccount.prototype.privateKey;
    /** @type {?} */
    EthAccount.prototype.address;
}
export class Accounts {
    constructor() { }
    /**
     * Create an Ethereum keypair
     * @return {?}
     */
    create() {
        let /** @type {?} */ privKey;
        do {
            privKey = randomBytes(32);
        } while (!privateKeyVerify(privKey));
        return this.fromPrivate(privKey);
    }
    /**
     * Create an account from a private key
     * @param {?} privateKey The private key without the prefix '0x'
     * @return {?}
     */
    fromPrivate(privateKey) {
        if (typeof privateKey === 'string') {
            privateKey = Buffer.from([privateKey.replace('0x', '')]);
        }
        // Slice(1) is to drop type byte which is hardcoded as 04 ethereum.
        const /** @type {?} */ pubKey = publicKeyCreate(privateKey, false).slice(1);
        const /** @type {?} */ address = '0x' + keccak256(pubKey).substring(26);
        return {
            privateKey: '0x' + privateKey.toString('hex'),
            address: toChecksumAddress(address)
        };
    }
    /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} encryptOptions A list of options to encrypt the private key
     * Code from : https://github.com/ethereum/web3.js/blob/1.0/packages/web3-eth-accounts/src/index.js
     * @return {?}
     */
    encrypt(privateKey, password, encryptOptions) {
        const /** @type {?} */ pwd = Buffer.from(password);
        const /** @type {?} */ privKey = Buffer.from(privateKey.replace('0x', ''), 'hex');
        const /** @type {?} */ options = new EncryptOptions(encryptOptions);
        const { salt, iv, kdf, c, n, r, p, dklen, cipher, uuid } = options;
        const /** @type {?} */ kdfParams = {
            dklen: dklen,
            salt: (/** @type {?} */ (salt)).toString('hex')
        };
        let /** @type {?} */ derivedKey;
        if (kdf === 'pbkdf2') {
            kdfParams.c = c;
            kdfParams.prf = 'hmac-sha256';
            derivedKey = pbkdf2Sync(pwd, salt, c, dklen, 'sha256');
        }
        else if (kdf === 'scrypt') {
            kdfParams.n = n;
            kdfParams.r = r;
            kdfParams.p = p;
            derivedKey = scryptsy(pwd, salt, n, r, p, dklen);
        }
        else {
            throw new Error('Unsupported Key Derivation Function' + kdf);
        }
        const /** @type {?} */ cipherAlg = createCipheriv(cipher, derivedKey.slice(0, 16), iv);
        if (!cipherAlg) {
            throw new Error('Unsupported cipher ' + cipher);
        }
        const /** @type {?} */ cipherText = Buffer.concat([cipherAlg.update(privKey), cipherAlg.final()]);
        const /** @type {?} */ toMac = Buffer.concat([derivedKey.slice(16, 32), cipherText]);
        const /** @type {?} */ mac = keccak256(toMac).replace('0x', '');
        return {
            version: 3,
            id: v4({ random: /** @type {?} */ (uuid) }),
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
        };
    }
    /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * Code from : https://github.com/ethereumjs/ethereumjs-wallet/blob/master/index.js
     * @return {?}
     */
    decrypt(keystore, password) {
        if (typeof password !== 'string') {
            throw new Error('No password provided');
        }
        if (typeof keystore !== 'object') {
            throw new Error('keystore should be an object');
        }
        if (keystore.version !== 3) {
            throw new Error('Not a V3 wallet');
        }
        let /** @type {?} */ derivedKey;
        const { kdf, kdfparams, cipherparams, cipher } = keystore.crypto;
        const /** @type {?} */ pwd = Buffer.from(password, 'utf8');
        const /** @type {?} */ salt = Buffer.from(kdfparams.salt, 'hex');
        const /** @type {?} */ iv = Buffer.from(cipherparams.iv, 'hex');
        // Scrypt encryption
        if (kdf === 'scrypt') {
            const { n, r, p, dklen } = kdfparams;
            derivedKey = scryptsy(pwd, salt, n, r, p, dklen);
        }
        else if (kdf === 'pbkdf2') {
            if (kdfparams.prf !== 'hmac-sha256') {
                throw new Error('Unsupported parameters to PBKDF2');
            }
            const { c, dklen } = kdfparams;
            derivedKey = pbkdf2Sync(pwd, salt, c, dklen, 'sha256');
        }
        else {
            throw new Error('Unsupported key derivation scheme');
        }
        const /** @type {?} */ cipherText = Buffer.from(keystore.crypto.ciphertext, 'hex');
        const /** @type {?} */ mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), cipherText]))
            .replace('0x', '');
        if (mac !== keystore.crypto.mac) {
            throw new Error('Key derivation failed - possibly wrong password');
        }
        const /** @type {?} */ decipher = createDecipheriv(cipher, derivedKey.slice(0, 16), iv);
        const /** @type {?} */ seed = Buffer.concat([decipher.update(cipherText), decipher.final()]);
        return this.fromPrivate(seed);
    }
}
Accounts.decorators = [
    { type: Injectable, args: [{ providedIn: WalletModule },] },
];
/** @nocollapse */
Accounts.ctorParameters = () => [];
/** @nocollapse */ Accounts.ngInjectableDef = i0.defineInjectable({ factory: function Accounts_Factory() { return new Accounts(); }, token: Accounts, providedIn: i1.WalletModule });
function Accounts_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    Accounts.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    Accounts.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC93YWxsZXQvIiwic291cmNlcyI6WyJsaWIvYWNjb3VudC9hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFbEQsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzVELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUYsT0FBTyxFQUFFLGNBQWMsRUFBWSxNQUFNLGNBQWMsQ0FBQztBQUN4RCxPQUFPLFFBQVEsTUFBTSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFTakMsTUFBTTtJQUVKLGlCQUFnQjs7Ozs7SUFLVCxNQUFNO1FBQ1gscUJBQUksT0FBZSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQztZQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7U0FBRSxRQUMxQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7O0lBTzVCLFdBQVcsQ0FBQyxVQUEyQjtRQUM1QyxFQUFFLENBQUMsQ0FBQyxPQUFPLFVBQVUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ25DLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENB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Q0FBQyxDQUFBO1NBQ3JEO1FBRUQsdUJBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEUsdUJBQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFFLENBQUMsQ0FBQzthQUMvRCxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFBO1NBQ25FO1FBRUQsdUJBQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RSx1QkFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFFLENBQUMsQ0FBQztRQUU5RSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7OztZQWxJakMsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLFlBQVksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBSZXNzb3VyY2VzXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ldGhlcmV1bS93aWtpL3dpa2kvV2ViMy1TZWNyZXQtU3RvcmFnZS1EZWZpbml0aW9uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLy4uL3dhbGxldC5tb2R1bGUnO1xyXG5cclxuaW1wb3J0IHsgdjQgfSBmcm9tICd1dWlkJztcclxuaW1wb3J0IHsgdG9DaGVja3N1bUFkZHJlc3MsIGtlY2NhazI1NiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IHByaXZhdGVLZXlWZXJpZnksIHB1YmxpY0tleUNyZWF0ZSB9IGZyb20gJ3NlY3AyNTZrMSc7XHJcbmltcG9ydCB7IHJhbmRvbUJ5dGVzLCBwYmtkZjJTeW5jLCBjcmVhdGVDaXBoZXJpdiwgY3JlYXRlRGVjaXBoZXJpdiB9IGZyb20gJ2NyeXB0by1icm93c2VyaWZ5JztcclxuaW1wb3J0IHsgRW5jcnlwdE9wdGlvbnMsIEtleXN0b3JlIH0gZnJvbSAnLi9lbmNyeXB0aW9uJztcclxuaW1wb3J0IHNjcnlwdHN5IGZyb20gJ3NjcnlwdC5qcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV0aEFjY291bnQge1xyXG4gIHByaXZhdGVLZXk6IHN0cmluZztcclxuICBhZGRyZXNzOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogV2FsbGV0TW9kdWxlfSlcclxuZXhwb3J0IGNsYXNzIEFjY291bnRzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYW4gRXRoZXJldW0ga2V5cGFpclxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGUoKTogRXRoQWNjb3VudCB7XHJcbiAgICBsZXQgcHJpdktleTogQnVmZmVyO1xyXG4gICAgZG8geyBwcml2S2V5ID0gcmFuZG9tQnl0ZXMoMzIpOyB9XHJcbiAgICB3aGlsZSAoIXByaXZhdGVLZXlWZXJpZnkocHJpdktleSkpO1xyXG4gICAgcmV0dXJuIHRoaXMuZnJvbVByaXZhdGUocHJpdktleSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYW4gYWNjb3VudCBmcm9tIGEgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgd2l0aG91dCB0aGUgcHJlZml4ICcweCdcclxuICAgKi9cclxuICBwdWJsaWMgZnJvbVByaXZhdGUocHJpdmF0ZUtleTogc3RyaW5nIHwgQnVmZmVyKTogRXRoQWNjb3VudCB7XHJcbiAgICBpZiAodHlwZW9mIHByaXZhdGVLZXkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHByaXZhdGVLZXkgPSBCdWZmZXIuZnJvbShbcHJpdmF0ZUtleS5yZXBsYWNlKCcweCcsICcnKV0pO1xyXG4gICAgfVxyXG4gICAgLy8gU2xpY2UoMSkgaXMgdG8gZHJvcCB0eXBlIGJ5dGUgd2hpY2ggaXMgaGFyZGNvZGVkIGFzIDA0IGV0aGVyZXVtLlxyXG4gICAgY29uc3QgcHViS2V5ID0gcHVibGljS2V5Q3JlYXRlKHByaXZhdGVLZXksIGZhbHNlKS5zbGljZSgxKTtcclxuICAgIGNvbnN0IGFkZHJlc3MgPSAnMHgnICsga2VjY2FrMjU2KHB1YktleSkuc3Vic3RyaW5nKDI2KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHByaXZhdGVLZXk6ICcweCcgKyBwcml2YXRlS2V5LnRvU3RyaW5nKCdoZXgnKSxcclxuICAgICAgYWRkcmVzczogdG9DaGVja3N1bUFkZHJlc3MoYWRkcmVzcylcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNyeXB0IGFuIHByaXZhdGUga2V5IGludG8gYSBrZXlzdG9yZVxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBlbmNyeXB0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBlbmNyeXB0IHRoZSBwcml2YXRlIGtleSB3aXRoXHJcbiAgICogQHBhcmFtIGVuY3J5cHRPcHRpb25zIEEgbGlzdCBvZiBvcHRpb25zIHRvIGVuY3J5cHQgdGhlIHByaXZhdGUga2V5XHJcbiAgICogQ29kZSBmcm9tIDogaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dlYjMuanMvYmxvYi8xLjAvcGFja2FnZXMvd2ViMy1ldGgtYWNjb3VudHMvc3JjL2luZGV4LmpzXHJcbiAgICovXHJcbiAgcHVibGljIGVuY3J5cHQoXHJcbiAgICBwcml2YXRlS2V5OiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgZW5jcnlwdE9wdGlvbnM/OiBQYXJ0aWFsPEVuY3J5cHRPcHRpb25zPik6IEtleXN0b3JlXHJcbiAge1xyXG4gICAgY29uc3QgcHdkID0gQnVmZmVyLmZyb20ocGFzc3dvcmQpO1xyXG4gICAgY29uc3QgcHJpdktleSA9IEJ1ZmZlci5mcm9tKHByaXZhdGVLZXkucmVwbGFjZSgnMHgnLCAnJyksICdoZXgnKTtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBuZXcgRW5jcnlwdE9wdGlvbnMoZW5jcnlwdE9wdGlvbnMpO1xyXG4gICAgY29uc3QgeyBzYWx0LCBpdiwga2RmLCBjLCBuLCByLCBwLCBka2xlbiwgY2lwaGVyLCB1dWlkIH0gPSBvcHRpb25zO1xyXG4gICAgY29uc3Qga2RmUGFyYW1zOiBLZXlzdG9yZVsnY3J5cHRvJ11bJ2tkZnBhcmFtcyddID0ge1xyXG4gICAgICBka2xlbjogZGtsZW4sXHJcbiAgICAgIHNhbHQ6IChzYWx0IGFzIEJ1ZmZlcikudG9TdHJpbmcoJ2hleCcpXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBkZXJpdmVkS2V5O1xyXG4gICAgaWYgKGtkZiA9PT0gJ3Bia2RmMicpIHtcclxuICAgICAga2RmUGFyYW1zLmMgPSBjO1xyXG4gICAgICBrZGZQYXJhbXMucHJmID0gJ2htYWMtc2hhMjU2JztcclxuICAgICAgZGVyaXZlZEtleSA9IHBia2RmMlN5bmMocHdkLCBzYWx0LCBjLCBka2xlbiwgJ3NoYTI1NicpO1xyXG4gICAgfSBlbHNlIGlmIChrZGYgPT09ICdzY3J5cHQnKSB7XHJcbiAgICAgIGtkZlBhcmFtcy5uID0gbjtcclxuICAgICAga2RmUGFyYW1zLnIgPSByO1xyXG4gICAgICBrZGZQYXJhbXMucCA9IHA7XHJcbiAgICAgIGRlcml2ZWRLZXkgPSBzY3J5cHRzeShwd2QsIHNhbHQsIG4sIHIsIHAsIGRrbGVuKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgS2V5IERlcml2YXRpb24gRnVuY3Rpb24nICsga2RmKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXBoZXJBbGcgPSBjcmVhdGVDaXBoZXJpdihjaXBoZXIsIGRlcml2ZWRLZXkuc2xpY2UoMCwgMTYpLCBpdik7XHJcbiAgICBpZiAoIWNpcGhlckFsZykgeyB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGNpcGhlciAnICsgY2lwaGVyKX1cclxuICAgIGNvbnN0IGNpcGhlclRleHQgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXJBbGcudXBkYXRlKHByaXZLZXkpLCBjaXBoZXJBbGcuZmluYWwoKV0pO1xyXG4gICAgY29uc3QgdG9NYWMgPSBCdWZmZXIuY29uY2F0KFtkZXJpdmVkS2V5LnNsaWNlKDE2LCAzMiksIGNpcGhlclRleHRdKTtcclxuICAgIGNvbnN0IG1hYyA9IGtlY2NhazI1Nih0b01hYykucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2ZXJzaW9uOiAzLFxyXG4gICAgICBpZDogdjQoeyByYW5kb206IHV1aWQgYXMgYW55IH0pLFxyXG4gICAgICBhZGRyZXNzOiB0aGlzLmZyb21Qcml2YXRlKHByaXZLZXkpLmFkZHJlc3MudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcweCcsICcnKSxcclxuICAgICAgY3J5cHRvOiB7XHJcbiAgICAgICAgY2lwaGVydGV4dDogY2lwaGVyVGV4dC50b1N0cmluZygnaGV4JyksXHJcbiAgICAgICAgY2lwaGVycGFyYW1zOiB7XHJcbiAgICAgICAgICAgIGl2OiBpdi50b1N0cmluZygnaGV4JylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNpcGhlcjogb3B0aW9ucy5jaXBoZXIsXHJcbiAgICAgICAga2RmOiBrZGYsXHJcbiAgICAgICAga2RmcGFyYW1zOiBrZGZQYXJhbXMsXHJcbiAgICAgICAgbWFjOiBtYWNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjcnlwdCBhIGtleXN0b3JlIG9iamVjdFxyXG4gICAqIEBwYXJhbSBrZXlzdG9yZSBUaGUga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBkZWNyeXB0IHRoZSBrZXlzdG9yZSB3aXRoXHJcbiAgICogQ29kZSBmcm9tIDogaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtanMvZXRoZXJldW1qcy13YWxsZXQvYmxvYi9tYXN0ZXIvaW5kZXguanNcclxuICAgKi9cclxuICBwdWJsaWMgZGVjcnlwdChrZXlzdG9yZTogS2V5c3RvcmUsIHBhc3N3b3JkOiBzdHJpbmcpOiBFdGhBY2NvdW50IHtcclxuICAgIGlmICh0eXBlb2YgcGFzc3dvcmQgIT09ICdzdHJpbmcnKSB7IHRocm93IG5ldyBFcnJvcignTm8gcGFzc3dvcmQgcHJvdmlkZWQnKTsgfVxyXG4gICAgaWYgKHR5cGVvZiBrZXlzdG9yZSAhPT0gJ29iamVjdCcpIHsgdGhyb3cgbmV3IEVycm9yKCdrZXlzdG9yZSBzaG91bGQgYmUgYW4gb2JqZWN0Jyk7IH1cclxuICAgIGlmIChrZXlzdG9yZS52ZXJzaW9uICE9PSAzKSB7IHRocm93IG5ldyBFcnJvcignTm90IGEgVjMgd2FsbGV0Jyk7IH1cclxuXHJcbiAgICBsZXQgZGVyaXZlZEtleTtcclxuICAgIGNvbnN0IHsga2RmLCBrZGZwYXJhbXMsIGNpcGhlcnBhcmFtcywgY2lwaGVyIH0gPSBrZXlzdG9yZS5jcnlwdG87XHJcbiAgICBjb25zdCBwd2QgPSBCdWZmZXIuZnJvbShwYXNzd29yZCwgJ3V0ZjgnKTtcclxuICAgIGNvbnN0IHNhbHQgPSBCdWZmZXIuZnJvbShrZGZwYXJhbXMuc2FsdCwgJ2hleCcpO1xyXG4gICAgY29uc3QgaXYgPSBCdWZmZXIuZnJvbShjaXBoZXJwYXJhbXMuaXYsICdoZXgnKTtcclxuICAgIC8vIFNjcnlwdCBlbmNyeXB0aW9uXHJcbiAgICBpZiAoa2RmID09PSAnc2NyeXB0Jykge1xyXG4gICAgICBjb25zdCB7IG4sIHIsIHAsIGRrbGVuIH0gPSBrZGZwYXJhbXM7XHJcbiAgICAgIGRlcml2ZWRLZXkgPSBzY3J5cHRzeShwd2QsIHNhbHQsIG4sIHIsIHAsIGRrbGVuKVxyXG4gICAgfVxyXG4gICAgLy8gcGJrZGYyIGVuY3J5cHRpb25cclxuICAgIGVsc2UgaWYgKGtkZiA9PT0gJ3Bia2RmMicpIHtcclxuICAgICAgaWYgKGtkZnBhcmFtcy5wcmYgIT09ICdobWFjLXNoYTI1NicpIHsgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBwYXJhbWV0ZXJzIHRvIFBCS0RGMicpOyB9XHJcbiAgICAgIGNvbnN0IHsgYywgZGtsZW4gfSA9IGtkZnBhcmFtcztcclxuICAgICAgZGVyaXZlZEtleSA9IHBia2RmMlN5bmMocHdkLCBzYWx0LCBjLCBka2xlbiwgJ3NoYTI1NicpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGtleSBkZXJpdmF0aW9uIHNjaGVtZScpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2lwaGVyVGV4dCA9IEJ1ZmZlci5mcm9tKGtleXN0b3JlLmNyeXB0by5jaXBoZXJ0ZXh0LCAnaGV4Jyk7XHJcbiAgICBjb25zdCBtYWMgPSBrZWNjYWsyNTYoQnVmZmVyLmNvbmNhdChbIGRlcml2ZWRLZXkuc2xpY2UoMTYsIDMyKSwgY2lwaGVyVGV4dCBdKSlcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJzB4JywgJycpO1xyXG5cclxuICAgIGlmIChtYWMgIT09IGtleXN0b3JlLmNyeXB0by5tYWMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXkgZGVyaXZhdGlvbiBmYWlsZWQgLSBwb3NzaWJseSB3cm9uZyBwYXNzd29yZCcpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlcml2KGNpcGhlciwgZGVyaXZlZEtleS5zbGljZSgwLCAxNiksIGl2KTtcclxuICAgIGNvbnN0IHNlZWQgPSBCdWZmZXIuY29uY2F0KFsgZGVjaXBoZXIudXBkYXRlKGNpcGhlclRleHQpLCBkZWNpcGhlci5maW5hbCgpIF0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZyb21Qcml2YXRlKHNlZWQpO1xyXG4gIH1cclxufVxyXG4iXX0=