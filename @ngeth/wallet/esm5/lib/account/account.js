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
var Accounts = /** @class */ (function () {
    function Accounts() {
    }
    /**
     * Create an Ethereum keypair
     * @return {?}
     */
    Accounts.prototype.create = /**
     * Create an Ethereum keypair
     * @return {?}
     */
    function () {
        var /** @type {?} */ privKey;
        do {
            privKey = randomBytes(32);
        } while (!privateKeyVerify(privKey));
        return this.fromPrivate(privKey);
    };
    /**
     * Create an account from a private key
     * @param {?} privateKey The private key without the prefix '0x'
     * @return {?}
     */
    Accounts.prototype.fromPrivate = /**
     * Create an account from a private key
     * @param {?} privateKey The private key without the prefix '0x'
     * @return {?}
     */
    function (privateKey) {
        if (typeof privateKey === 'string') {
            privateKey = Buffer.from([privateKey.replace('0x', '')]);
        }
        // Slice(1) is to drop type byte which is hardcoded as 04 ethereum.
        var /** @type {?} */ pubKey = publicKeyCreate(privateKey, false).slice(1);
        var /** @type {?} */ address = '0x' + keccak256(pubKey).substring(26);
        return {
            privateKey: '0x' + privateKey.toString('hex'),
            address: toChecksumAddress(address)
        };
    };
    /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} encryptOptions A list of options to encrypt the private key
     * Code from : https://github.com/ethereum/web3.js/blob/1.0/packages/web3-eth-accounts/src/index.js
     * @return {?}
     */
    Accounts.prototype.encrypt = /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} encryptOptions A list of options to encrypt the private key
     * Code from : https://github.com/ethereum/web3.js/blob/1.0/packages/web3-eth-accounts/src/index.js
     * @return {?}
     */
    function (privateKey, password, encryptOptions) {
        var /** @type {?} */ pwd = Buffer.from(password);
        var /** @type {?} */ privKey = Buffer.from(privateKey.replace('0x', ''), 'hex');
        var /** @type {?} */ options = new EncryptOptions(encryptOptions);
        var salt = options.salt, iv = options.iv, kdf = options.kdf, c = options.c, n = options.n, r = options.r, p = options.p, dklen = options.dklen, cipher = options.cipher, uuid = options.uuid;
        var /** @type {?} */ kdfParams = {
            dklen: dklen,
            salt: (/** @type {?} */ (salt)).toString('hex')
        };
        var /** @type {?} */ derivedKey;
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
        var /** @type {?} */ cipherAlg = createCipheriv(cipher, derivedKey.slice(0, 16), iv);
        if (!cipherAlg) {
            throw new Error('Unsupported cipher ' + cipher);
        }
        var /** @type {?} */ cipherText = Buffer.concat([cipherAlg.update(privKey), cipherAlg.final()]);
        var /** @type {?} */ toMac = Buffer.concat([derivedKey.slice(16, 32), cipherText]);
        var /** @type {?} */ mac = keccak256(toMac).replace('0x', '');
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
    };
    /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * Code from : https://github.com/ethereumjs/ethereumjs-wallet/blob/master/index.js
     * @return {?}
     */
    Accounts.prototype.decrypt = /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * Code from : https://github.com/ethereumjs/ethereumjs-wallet/blob/master/index.js
     * @return {?}
     */
    function (keystore, password) {
        if (typeof password !== 'string') {
            throw new Error('No password provided');
        }
        if (typeof keystore !== 'object') {
            throw new Error('keystore should be an object');
        }
        if (keystore.version !== 3) {
            throw new Error('Not a V3 wallet');
        }
        var /** @type {?} */ derivedKey;
        var _a = keystore.crypto, kdf = _a.kdf, kdfparams = _a.kdfparams, cipherparams = _a.cipherparams, cipher = _a.cipher;
        var /** @type {?} */ pwd = Buffer.from(password, 'utf8');
        var /** @type {?} */ salt = Buffer.from(kdfparams.salt, 'hex');
        var /** @type {?} */ iv = Buffer.from(cipherparams.iv, 'hex');
        // Scrypt encryption
        if (kdf === 'scrypt') {
            var n = kdfparams.n, r = kdfparams.r, p = kdfparams.p, dklen = kdfparams.dklen;
            derivedKey = scryptsy(pwd, salt, n, r, p, dklen);
        }
        else if (kdf === 'pbkdf2') {
            if (kdfparams.prf !== 'hmac-sha256') {
                throw new Error('Unsupported parameters to PBKDF2');
            }
            var c = kdfparams.c, dklen = kdfparams.dklen;
            derivedKey = pbkdf2Sync(pwd, salt, c, dklen, 'sha256');
        }
        else {
            throw new Error('Unsupported key derivation scheme');
        }
        var /** @type {?} */ cipherText = Buffer.from(keystore.crypto.ciphertext, 'hex');
        var /** @type {?} */ mac = keccak256(Buffer.concat([derivedKey.slice(16, 32), cipherText]))
            .replace('0x', '');
        if (mac !== keystore.crypto.mac) {
            throw new Error('Key derivation failed - possibly wrong password');
        }
        var /** @type {?} */ decipher = createDecipheriv(cipher, derivedKey.slice(0, 16), iv);
        var /** @type {?} */ seed = Buffer.concat([decipher.update(cipherText), decipher.final()]);
        return this.fromPrivate(seed);
    };
    Accounts.decorators = [
        { type: Injectable, args: [{ providedIn: WalletModule },] },
    ];
    /** @nocollapse */
    Accounts.ctorParameters = function () { return []; };
    /** @nocollapse */ Accounts.ngInjectableDef = i0.defineInjectable({ factory: function Accounts_Factory() { return new Accounts(); }, token: Accounts, providedIn: i1.WalletModule });
    return Accounts;
}());
export { Accounts };
function Accounts_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    Accounts.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    Accounts.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC93YWxsZXQvIiwic291cmNlcyI6WyJsaWIvYWNjb3VudC9hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFbEQsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzVELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUYsT0FBTyxFQUFFLGNBQWMsRUFBWSxNQUFNLGNBQWMsQ0FBQztBQUN4RCxPQUFPLFFBQVEsTUFBTSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBVy9CO0tBQWdCOzs7OztJQUtULHlCQUFNOzs7OztRQUNYLHFCQUFJLE9BQWUsQ0FBQztRQUNwQixHQUFHLENBQUM7WUFBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQUUsUUFDMUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Ozs7OztJQU81Qiw4QkFBVzs7Ozs7Y0FBQyxVQUEyQjtRQUM1QyxFQUFFLENBQUMsQ0FBQyxPQUFPLFVBQVUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ25DLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFEOztRQUVELHFCQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxxQkFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDO1lBQ0wsVUFBVSxFQUFFLElBQUksR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUM3QyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsT0FBTyxDQUFDO1NBQ3BDLENBQUM7Ozs7Ozs7Ozs7SUFVRywwQkFBTzs7Ozs7Ozs7Y0FDWixVQUFrQixFQUNsQixRQUFnQixFQUNoQixjQUF3QztRQUV4QyxxQkFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxxQkFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRSxxQkFBTSxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0MsSUFBQSxtQkFBSSxFQUFFLGVBQUUsRUFBRSxpQkFBRyxFQUFFLGFBQUMsRUFBRSxhQUFDLEVBQUUsYUFBQyxFQUFFLGFBQUMsRUFBRSxxQkFBSyxFQUFFLHVCQUFNLEVBQUUsbUJBQUksQ0FBYTtRQUNuRSxxQkFBTSxTQUFTLEdBQW9DO1lBQ2pELEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFLG1CQUFDLElBQWMsRUFBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDdkMsQ0FBQztRQUVGLHFCQUFJLFVBQVUsQ0FBQztRQUNmLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLFNBQVMsQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDO1lBQzlCLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3hEO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVCLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsRDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUM5RDtRQUVELHFCQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLENBQUE7U0FBQztRQUNsRSxxQkFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRixxQkFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDcEUscUJBQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxDQUFDO1lBQ1YsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLE1BQU0sb0JBQUUsSUFBVyxDQUFBLEVBQUUsQ0FBQztZQUMvQixPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDMUUsTUFBTSxFQUFFO2dCQUNOLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztnQkFDdEMsWUFBWSxFQUFFO29CQUNWLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztpQkFDekI7Z0JBQ0QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2dCQUN0QixHQUFHLEVBQUUsR0FBRztnQkFDUixTQUFTLEVBQUUsU0FBUztnQkFDcEIsR0FBRyxFQUFFLEdBQUc7YUFDVDtTQUNGLENBQUE7Ozs7Ozs7OztJQVNJLDBCQUFPOzs7Ozs7O2NBQUMsUUFBa0IsRUFBRSxRQUFnQjtRQUNqRCxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQUU7UUFDOUUsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUFFO1FBQ3RGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUFFO1FBRW5FLHFCQUFJLFVBQVUsQ0FBQztRQUNmLDBCQUFRLFlBQUcsRUFBRSx3QkFBUyxFQUFFLDhCQUFZLEVBQUUsa0JBQU0sQ0FBcUI7UUFDakUscUJBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLHFCQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEQscUJBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7UUFFL0MsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFBLGVBQUMsRUFBRSxlQUFDLEVBQUUsZUFBQyxFQUFFLHVCQUFLLENBQWU7WUFDckMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQ2pEO1FBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7YUFBRTtZQUNyRixJQUFBLGVBQUMsRUFBRSx1QkFBSyxDQUFlO1lBQy9CLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1NBQ3ZEO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7U0FDckQ7UUFFRCxxQkFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxxQkFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBRSxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUUsQ0FBQyxDQUFDO2FBQy9ELE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUE7U0FDbkU7UUFFRCxxQkFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLHFCQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUUsQ0FBQyxDQUFDO1FBRTlFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Z0JBbElqQyxVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFDOzs7OzttQkFyQnRDOztTQXNCYSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFJlc3NvdXJjZXNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dpa2kvd2lraS9XZWIzLVNlY3JldC1TdG9yYWdlLURlZmluaXRpb25cclxuICovXHJcblxyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFdhbGxldE1vZHVsZSB9IGZyb20gJy4vLi4vd2FsbGV0Lm1vZHVsZSc7XHJcblxyXG5pbXBvcnQgeyB2NCB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyB0b0NoZWNrc3VtQWRkcmVzcywga2VjY2FrMjU2IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgcHJpdmF0ZUtleVZlcmlmeSwgcHVibGljS2V5Q3JlYXRlIH0gZnJvbSAnc2VjcDI1NmsxJztcclxuaW1wb3J0IHsgcmFuZG9tQnl0ZXMsIHBia2RmMlN5bmMsIGNyZWF0ZUNpcGhlcml2LCBjcmVhdGVEZWNpcGhlcml2IH0gZnJvbSAnY3J5cHRvLWJyb3dzZXJpZnknO1xyXG5pbXBvcnQgeyBFbmNyeXB0T3B0aW9ucywgS2V5c3RvcmUgfSBmcm9tICcuL2VuY3J5cHRpb24nO1xyXG5pbXBvcnQgc2NyeXB0c3kgZnJvbSAnc2NyeXB0LmpzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXRoQWNjb3VudCB7XHJcbiAgcHJpdmF0ZUtleTogc3RyaW5nO1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxufVxyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBXYWxsZXRNb2R1bGV9KVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudHMge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhbiBFdGhlcmV1bSBrZXlwYWlyXHJcbiAgICovXHJcbiAgcHVibGljIGNyZWF0ZSgpOiBFdGhBY2NvdW50IHtcclxuICAgIGxldCBwcml2S2V5OiBCdWZmZXI7XHJcbiAgICBkbyB7IHByaXZLZXkgPSByYW5kb21CeXRlcygzMik7IH1cclxuICAgIHdoaWxlICghcHJpdmF0ZUtleVZlcmlmeShwcml2S2V5KSk7XHJcbiAgICByZXR1cm4gdGhpcy5mcm9tUHJpdmF0ZShwcml2S2V5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhbiBhY2NvdW50IGZyb20gYSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB3aXRob3V0IHRoZSBwcmVmaXggJzB4J1xyXG4gICAqL1xyXG4gIHB1YmxpYyBmcm9tUHJpdmF0ZShwcml2YXRlS2V5OiBzdHJpbmcgfCBCdWZmZXIpOiBFdGhBY2NvdW50IHtcclxuICAgIGlmICh0eXBlb2YgcHJpdmF0ZUtleSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcHJpdmF0ZUtleSA9IEJ1ZmZlci5mcm9tKFtwcml2YXRlS2V5LnJlcGxhY2UoJzB4JywgJycpXSk7XHJcbiAgICB9XHJcbiAgICAvLyBTbGljZSgxKSBpcyB0byBkcm9wIHR5cGUgYnl0ZSB3aGljaCBpcyBoYXJkY29kZWQgYXMgMDQgZXRoZXJldW0uXHJcbiAgICBjb25zdCBwdWJLZXkgPSBwdWJsaWNLZXlDcmVhdGUocHJpdmF0ZUtleSwgZmFsc2UpLnNsaWNlKDEpO1xyXG4gICAgY29uc3QgYWRkcmVzcyA9ICcweCcgKyBrZWNjYWsyNTYocHViS2V5KS5zdWJzdHJpbmcoMjYpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcHJpdmF0ZUtleTogJzB4JyArIHByaXZhdGVLZXkudG9TdHJpbmcoJ2hleCcpLFxyXG4gICAgICBhZGRyZXNzOiB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY3J5cHQgYW4gcHJpdmF0ZSBrZXkgaW50byBhIGtleXN0b3JlXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIGVuY3J5cHRcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGVuY3J5cHQgdGhlIHByaXZhdGUga2V5IHdpdGhcclxuICAgKiBAcGFyYW0gZW5jcnlwdE9wdGlvbnMgQSBsaXN0IG9mIG9wdGlvbnMgdG8gZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBDb2RlIGZyb20gOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2ViMy5qcy9ibG9iLzEuMC9wYWNrYWdlcy93ZWIzLWV0aC1hY2NvdW50cy9zcmMvaW5kZXguanNcclxuICAgKi9cclxuICBwdWJsaWMgZW5jcnlwdChcclxuICAgIHByaXZhdGVLZXk6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBlbmNyeXB0T3B0aW9ucz86IFBhcnRpYWw8RW5jcnlwdE9wdGlvbnM+KTogS2V5c3RvcmVcclxuICB7XHJcbiAgICBjb25zdCBwd2QgPSBCdWZmZXIuZnJvbShwYXNzd29yZCk7XHJcbiAgICBjb25zdCBwcml2S2V5ID0gQnVmZmVyLmZyb20ocHJpdmF0ZUtleS5yZXBsYWNlKCcweCcsICcnKSwgJ2hleCcpO1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IG5ldyBFbmNyeXB0T3B0aW9ucyhlbmNyeXB0T3B0aW9ucyk7XHJcbiAgICBjb25zdCB7IHNhbHQsIGl2LCBrZGYsIGMsIG4sIHIsIHAsIGRrbGVuLCBjaXBoZXIsIHV1aWQgfSA9IG9wdGlvbnM7XHJcbiAgICBjb25zdCBrZGZQYXJhbXM6IEtleXN0b3JlWydjcnlwdG8nXVsna2RmcGFyYW1zJ10gPSB7XHJcbiAgICAgIGRrbGVuOiBka2xlbixcclxuICAgICAgc2FsdDogKHNhbHQgYXMgQnVmZmVyKS50b1N0cmluZygnaGV4JylcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGRlcml2ZWRLZXk7XHJcbiAgICBpZiAoa2RmID09PSAncGJrZGYyJykge1xyXG4gICAgICBrZGZQYXJhbXMuYyA9IGM7XHJcbiAgICAgIGtkZlBhcmFtcy5wcmYgPSAnaG1hYy1zaGEyNTYnO1xyXG4gICAgICBkZXJpdmVkS2V5ID0gcGJrZGYyU3luYyhwd2QsIHNhbHQsIGMsIGRrbGVuLCAnc2hhMjU2Jyk7XHJcbiAgICB9IGVsc2UgaWYgKGtkZiA9PT0gJ3NjcnlwdCcpIHtcclxuICAgICAga2RmUGFyYW1zLm4gPSBuO1xyXG4gICAgICBrZGZQYXJhbXMuciA9IHI7XHJcbiAgICAgIGtkZlBhcmFtcy5wID0gcDtcclxuICAgICAgZGVyaXZlZEtleSA9IHNjcnlwdHN5KHB3ZCwgc2FsdCwgbiwgciwgcCwgZGtsZW4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBLZXkgRGVyaXZhdGlvbiBGdW5jdGlvbicgKyBrZGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNpcGhlckFsZyA9IGNyZWF0ZUNpcGhlcml2KGNpcGhlciwgZGVyaXZlZEtleS5zbGljZSgwLCAxNiksIGl2KTtcclxuICAgIGlmICghY2lwaGVyQWxnKSB7IHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgY2lwaGVyICcgKyBjaXBoZXIpfVxyXG4gICAgY29uc3QgY2lwaGVyVGV4dCA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlckFsZy51cGRhdGUocHJpdktleSksIGNpcGhlckFsZy5maW5hbCgpXSk7XHJcbiAgICBjb25zdCB0b01hYyA9IEJ1ZmZlci5jb25jYXQoW2Rlcml2ZWRLZXkuc2xpY2UoMTYsIDMyKSwgY2lwaGVyVGV4dF0pO1xyXG4gICAgY29uc3QgbWFjID0ga2VjY2FrMjU2KHRvTWFjKS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZlcnNpb246IDMsXHJcbiAgICAgIGlkOiB2NCh7IHJhbmRvbTogdXVpZCBhcyBhbnkgfSksXHJcbiAgICAgIGFkZHJlc3M6IHRoaXMuZnJvbVByaXZhdGUocHJpdktleSkuYWRkcmVzcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJzB4JywgJycpLFxyXG4gICAgICBjcnlwdG86IHtcclxuICAgICAgICBjaXBoZXJ0ZXh0OiBjaXBoZXJUZXh0LnRvU3RyaW5nKCdoZXgnKSxcclxuICAgICAgICBjaXBoZXJwYXJhbXM6IHtcclxuICAgICAgICAgICAgaXY6IGl2LnRvU3RyaW5nKCdoZXgnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2lwaGVyOiBvcHRpb25zLmNpcGhlcixcclxuICAgICAgICBrZGY6IGtkZixcclxuICAgICAgICBrZGZwYXJhbXM6IGtkZlBhcmFtcyxcclxuICAgICAgICBtYWM6IG1hY1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNyeXB0IGEga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIGtleXN0b3JlIFRoZSBrZXlzdG9yZSBvYmplY3RcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGRlY3J5cHQgdGhlIGtleXN0b3JlIHdpdGhcclxuICAgKiBDb2RlIGZyb20gOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW1qcy9ldGhlcmV1bWpzLXdhbGxldC9ibG9iL21hc3Rlci9pbmRleC5qc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNyeXB0KGtleXN0b3JlOiBLZXlzdG9yZSwgcGFzc3dvcmQ6IHN0cmluZyk6IEV0aEFjY291bnQge1xyXG4gICAgaWYgKHR5cGVvZiBwYXNzd29yZCAhPT0gJ3N0cmluZycpIHsgdGhyb3cgbmV3IEVycm9yKCdObyBwYXNzd29yZCBwcm92aWRlZCcpOyB9XHJcbiAgICBpZiAodHlwZW9mIGtleXN0b3JlICE9PSAnb2JqZWN0JykgeyB0aHJvdyBuZXcgRXJyb3IoJ2tleXN0b3JlIHNob3VsZCBiZSBhbiBvYmplY3QnKTsgfVxyXG4gICAgaWYgKGtleXN0b3JlLnZlcnNpb24gIT09IDMpIHsgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSBWMyB3YWxsZXQnKTsgfVxyXG5cclxuICAgIGxldCBkZXJpdmVkS2V5O1xyXG4gICAgY29uc3QgeyBrZGYsIGtkZnBhcmFtcywgY2lwaGVycGFyYW1zLCBjaXBoZXIgfSA9IGtleXN0b3JlLmNyeXB0bztcclxuICAgIGNvbnN0IHB3ZCA9IEJ1ZmZlci5mcm9tKHBhc3N3b3JkLCAndXRmOCcpO1xyXG4gICAgY29uc3Qgc2FsdCA9IEJ1ZmZlci5mcm9tKGtkZnBhcmFtcy5zYWx0LCAnaGV4Jyk7XHJcbiAgICBjb25zdCBpdiA9IEJ1ZmZlci5mcm9tKGNpcGhlcnBhcmFtcy5pdiwgJ2hleCcpO1xyXG4gICAgLy8gU2NyeXB0IGVuY3J5cHRpb25cclxuICAgIGlmIChrZGYgPT09ICdzY3J5cHQnKSB7XHJcbiAgICAgIGNvbnN0IHsgbiwgciwgcCwgZGtsZW4gfSA9IGtkZnBhcmFtcztcclxuICAgICAgZGVyaXZlZEtleSA9IHNjcnlwdHN5KHB3ZCwgc2FsdCwgbiwgciwgcCwgZGtsZW4pXHJcbiAgICB9XHJcbiAgICAvLyBwYmtkZjIgZW5jcnlwdGlvblxyXG4gICAgZWxzZSBpZiAoa2RmID09PSAncGJrZGYyJykge1xyXG4gICAgICBpZiAoa2RmcGFyYW1zLnByZiAhPT0gJ2htYWMtc2hhMjU2JykgeyB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHBhcmFtZXRlcnMgdG8gUEJLREYyJyk7IH1cclxuICAgICAgY29uc3QgeyBjLCBka2xlbiB9ID0ga2RmcGFyYW1zO1xyXG4gICAgICBkZXJpdmVkS2V5ID0gcGJrZGYyU3luYyhwd2QsIHNhbHQsIGMsIGRrbGVuLCAnc2hhMjU2JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQga2V5IGRlcml2YXRpb24gc2NoZW1lJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXBoZXJUZXh0ID0gQnVmZmVyLmZyb20oa2V5c3RvcmUuY3J5cHRvLmNpcGhlcnRleHQsICdoZXgnKTtcclxuICAgIGNvbnN0IG1hYyA9IGtlY2NhazI1NihCdWZmZXIuY29uY2F0KFsgZGVyaXZlZEtleS5zbGljZSgxNiwgMzIpLCBjaXBoZXJUZXh0IF0pKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgnMHgnLCAnJyk7XHJcblxyXG4gICAgaWYgKG1hYyAhPT0ga2V5c3RvcmUuY3J5cHRvLm1hYykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleSBkZXJpdmF0aW9uIGZhaWxlZCAtIHBvc3NpYmx5IHdyb25nIHBhc3N3b3JkJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkZWNpcGhlciA9IGNyZWF0ZURlY2lwaGVyaXYoY2lwaGVyLCBkZXJpdmVkS2V5LnNsaWNlKDAsIDE2KSwgaXYpO1xyXG4gICAgY29uc3Qgc2VlZCA9IEJ1ZmZlci5jb25jYXQoWyBkZWNpcGhlci51cGRhdGUoY2lwaGVyVGV4dCksIGRlY2lwaGVyLmZpbmFsKCkgXSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZnJvbVByaXZhdGUoc2VlZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==