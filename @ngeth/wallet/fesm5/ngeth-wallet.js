import { NgModule, Injectable, defineInjectable, inject } from '@angular/core';
import { equal } from 'assert';
import { Buffer as Buffer$1 } from 'buffer';
import { __spread, __assign } from 'tslib';
import { keccak256, isHexStrict, hexToBytes, toChecksumAddress, checkAddressChecksum } from '@ngeth/utils';
import { sign, privateKeyVerify, publicKeyCreate } from 'secp256k1';
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'crypto-browserify';
import { v4 } from 'uuid';
import scryptsy from 'scrypt.js';
import { ProvidersModule, MainProvider } from '@ngeth/provider';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var WalletModule = /** @class */ (function () {
    function WalletModule() {
    }
    WalletModule.decorators = [
        { type: NgModule },
    ];
    return WalletModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * This private takes in a data, convert it to buffer if not, and a length for recursion
 *
 * @param data - will be converted to buffer
 * @return - returns buffer of encoded data
 *
 */
var RLP = /** @class */ (function () {
    function RLP() {
    }
    /**
     * @param {?} input
     * @return {?}
     */
    RLP.prototype.encode = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        if (input instanceof Array) {
            var /** @type {?} */ output = [];
            for (var /** @type {?} */ i = 0; i < input.length; i++) {
                output.push(this.encode(input[i]));
            }
            var /** @type {?} */ buf = Buffer$1.concat(output);
            return Buffer$1.concat([this.encodeLength(buf.length, 192), buf]);
        }
        else {
            input = this.toBuffer(input);
            if (input.length === 1 && input[0] < 128) {
                return input;
            }
            else {
                return Buffer$1.concat([this.encodeLength(input.length, 128), input]);
            }
        }
    };
    /**
     * @param {?} v
     * @param {?} base
     * @return {?}
     */
    RLP.prototype.safeParseInt = /**
     * @param {?} v
     * @param {?} base
     * @return {?}
     */
    function (v, base) {
        if (v.slice(0, 2) === '00') {
            throw (new Error('invalid RLP: extra zeros'));
        }
        return parseInt(v, base);
    };
    /**
     * @param {?} len
     * @param {?} offset
     * @return {?}
     */
    RLP.prototype.encodeLength = /**
     * @param {?} len
     * @param {?} offset
     * @return {?}
     */
    function (len, offset) {
        if (len < 56) {
            return Buffer$1.from([len + offset]);
        }
        else {
            var /** @type {?} */ hexLength = this.intToHex(len);
            var /** @type {?} */ lLength = hexLength.length / 2;
            var /** @type {?} */ firstByte = this.intToHex(offset + 55 + lLength);
            return Buffer$1.from(firstByte + hexLength, 'hex');
        }
    };
    /**
     * RLP Decoding based on: {\@link https://github.com/ethereum/wiki/wiki/RLP}
     * @param {?} input
     * @param {?=} stream
     * @return {?} - returns decode Array of Buffers containg the original message
     *
     */
    RLP.prototype.decode = /**
     * RLP Decoding based on: {\@link https://github.com/ethereum/wiki/wiki/RLP}
     * @param {?} input
     * @param {?=} stream
     * @return {?} - returns decode Array of Buffers containg the original message
     *
     */
    function (input, stream) {
        if (!input || input.length === 0) {
            return Buffer$1.from([]);
        }
        input = this.toBuffer(input);
        var /** @type {?} */ decoded = this._decode(input);
        if (stream) {
            return /** @type {?} */ (decoded);
        }
        equal(decoded.remainder.length, 0, 'invalid remainder');
        return decoded.data;
    };
    /**
     * @param {?} input
     * @return {?}
     */
    RLP.prototype.getLength = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        if (!input || input.length === 0) {
            return Buffer$1.from([]);
        }
        input = this.toBuffer(input);
        var /** @type {?} */ firstByte = input[0];
        if (firstByte <= 0x7f) {
            return input.length;
        }
        else if (firstByte <= 0xb7) {
            return firstByte - 0x7f;
        }
        else if (firstByte <= 0xbf) {
            return firstByte - 0xb6;
        }
        else if (firstByte <= 0xf7) {
            // a list between  0-55 bytes long
            return firstByte - 0xbf;
        }
        else {
            // a list  over 55 bytes long
            var /** @type {?} */ llength = firstByte - 0xf6;
            var /** @type {?} */ length_1 = this.safeParseInt(input.slice(1, llength).toString('hex'), 16);
            return llength + length_1;
        }
    };
    /**
     * @param {?} input
     * @return {?}
     */
    RLP.prototype._decode = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        var /** @type {?} */ length, /** @type {?} */ llength, /** @type {?} */ data, /** @type {?} */ innerRemainder, /** @type {?} */ d;
        var /** @type {?} */ decoded = [];
        var /** @type {?} */ firstByte = input[0];
        if (firstByte <= 0x7f) {
            // a single byte whose value is in the [0x00, 0x7f] range, that byte is its own RLP encoding.
            return {
                data: input.slice(0, 1),
                remainder: input.slice(1)
            };
        }
        else if (firstByte <= 0xb7) {
            // string is 0-55 bytes long. A single byte with value 0x80 plus the length of the string followed by the string
            // The range of the first byte is [0x80, 0xb7]
            length = firstByte - 0x7f;
            // set 0x80 null to 0
            if (firstByte === 0x80) {
                data = Buffer$1.from([]);
            }
            else {
                data = input.slice(1, length);
            }
            if (length === 2 && data[0] < 0x80) {
                throw new Error('invalid rlp encoding: byte must be less 0x80');
            }
            return {
                data: data,
                remainder: input.slice(length)
            };
        }
        else if (firstByte <= 0xbf) {
            llength = firstByte - 0xb6;
            length = this.safeParseInt(input.slice(1, llength).toString('hex'), 16);
            data = input.slice(llength, length + llength);
            if (data.length < length) {
                throw (new Error('invalid RLP'));
            }
            return {
                data: data,
                remainder: input.slice(length + llength)
            };
        }
        else if (firstByte <= 0xf7) {
            // a list between  0-55 bytes long
            length = firstByte - 0xbf;
            innerRemainder = input.slice(1, length);
            while (innerRemainder.length) {
                d = this._decode(innerRemainder);
                decoded.push(d.data);
                innerRemainder = d.remainder;
            }
            return {
                data: decoded,
                remainder: input.slice(length)
            };
        }
        else {
            // a list  over 55 bytes long
            llength = firstByte - 0xf6;
            length = this.safeParseInt(input.slice(1, llength).toString('hex'), 16);
            var /** @type {?} */ totalLength = llength + length;
            if (totalLength > input.length) {
                throw new Error('invalid rlp: total length is larger than the data');
            }
            innerRemainder = input.slice(llength, totalLength);
            if (innerRemainder.length === 0) {
                throw new Error('invalid rlp, List has a invalid length');
            }
            while (innerRemainder.length) {
                d = this._decode(innerRemainder);
                decoded.push(d.data);
                innerRemainder = d.remainder;
            }
            return {
                data: decoded,
                remainder: input.slice(totalLength)
            };
        }
    };
    /**
     * HELPERS : TO REMOVE
     * @param {?} str
     * @return {?}
     */
    RLP.prototype.isHexPrefixed = /**
     * HELPERS : TO REMOVE
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return str.slice(0, 2) === '0x';
    };
    /**
     * @param {?} str
     * @return {?}
     */
    RLP.prototype.stripHexPrefix = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        if (typeof str !== 'string') {
            return str;
        }
        return this.isHexPrefixed(str) ? str.slice(2) : str;
    };
    /**
     * @param {?} i
     * @return {?}
     */
    RLP.prototype.intToHex = /**
     * @param {?} i
     * @return {?}
     */
    function (i) {
        var /** @type {?} */ hex = i.toString(16);
        if (hex.length % 2) {
            hex = '0' + hex;
        }
        return hex;
    };
    /**
     * @param {?} a
     * @return {?}
     */
    RLP.prototype.padToEven = /**
     * @param {?} a
     * @return {?}
     */
    function (a) {
        if (a.length % 2)
            a = '0' + a;
        return a;
    };
    /**
     * @param {?} i
     * @return {?}
     */
    RLP.prototype.intToBuffer = /**
     * @param {?} i
     * @return {?}
     */
    function (i) {
        var /** @type {?} */ hex = this.intToHex(i);
        return Buffer$1.from(hex, 'hex');
    };
    /**
     * @param {?} v
     * @return {?}
     */
    RLP.prototype.toBuffer = /**
     * @param {?} v
     * @return {?}
     */
    function (v) {
        if (!Buffer$1.isBuffer(v)) {
            if (typeof v === 'string') {
                if (this.isHexPrefixed(v)) {
                    v = Buffer$1.from(this.padToEven(this.stripHexPrefix(v)), 'hex');
                }
                else {
                    v = Buffer$1.from(v);
                }
            }
            else if (typeof v === 'number') {
                if (!v) {
                    v = Buffer$1.from([]);
                }
                else {
                    v = this.intToBuffer(v);
                }
            }
            else if (v === null || v === undefined) {
                v = Buffer$1.from([]);
            }
            else if (v.toArray) {
                // converts a BN to a Buffer
                v = Buffer$1.from(v.toArray());
            }
            else {
                throw new Error('invalid type');
            }
        }
        return v;
    };
    RLP.decorators = [
        { type: Injectable, args: [{ providedIn: WalletModule },] },
    ];
    /** @nocollapse */ RLP.ngInjectableDef = defineInjectable({ factory: function RLP_Factory() { return new RLP(); }, token: RLP, providedIn: WalletModule });
    return RLP;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Signer = /** @class */ (function () {
    function Signer(rlp) {
        this.rlp = rlp;
    }
    /**
     * Sign a raw transaction
     * @param {?} privateKey The private key to sign the transaction with
     * @param {?} tx The transaction to sign
     * @param {?=} chainId The id of the chain
     * @return {?}
     */
    Signer.prototype.signTx = /**
     * Sign a raw transaction
     * @param {?} privateKey The private key to sign the transaction with
     * @param {?} tx The transaction to sign
     * @param {?=} chainId The id of the chain
     * @return {?}
     */
    function (privateKey, tx, chainId) {
        // Format TX
        var /** @type {?} */ rawTx = this.rawTx(tx);
        var /** @type {?} */ rawChain = ['0x' + (chainId || 1).toString(16), '0x', '0x'];
        // RLP encode with chainId (EIP155: prevent replay attack)
        var /** @type {?} */ rlpEncoded = this.rlp.encode(__spread(rawTx, rawChain));
        // Hash
        var /** @type {?} */ messageHash = keccak256(rlpEncoded);
        // Sign
        var _a = this.sign(privateKey, messageHash, chainId), r = _a.r, s = _a.s, v = _a.v;
        // RLP Encode with signature
        var /** @type {?} */ rlpTx = this.rlp.encode(__spread(rawTx, [v, r, s]));
        var /** @type {?} */ rawTransaction = '0x' + rlpTx.toString('hex');
        return { messageHash: messageHash, r: r, s: s, v: v, rawTransaction: rawTransaction };
    };
    /**
     * Recover a transaction based on its raw value
     * @param {?} rawTx The raw transaction format
     * @return {?}
     */
    Signer.prototype.recoverTx = /**
     * Recover a transaction based on its raw value
     * @param {?} rawTx The raw transaction format
     * @return {?}
     */
    function (rawTx) {
    };
    /**
     * Format the transaction
     * @param {?} tx The Transaction to encode
     * @return {?}
     */
    Signer.prototype.rawTx = /**
     * Format the transaction
     * @param {?} tx The Transaction to encode
     * @return {?}
     */
    function (tx) {
        return [
            '0x' + (tx.nonce || ''),
            '0x' + (tx.gasPrice || ''),
            '0x' + (tx.gas || ''),
            '0x' + tx.to.toLowerCase().replace('0x', '') || '',
            '0x' + (tx.value || ''),
            '0x' + (tx.data || '')
        ];
    };
    /**
     * Sign a hash
     * @param {?} privateKey The private key needed to sign the hash
     * @param {?} hash The hash to sign
     * @param {?=} chainId The Id of the chain
     * @return {?}
     */
    Signer.prototype.sign = /**
     * Sign a hash
     * @param {?} privateKey The private key needed to sign the hash
     * @param {?} hash The hash to sign
     * @param {?=} chainId The Id of the chain
     * @return {?}
     */
    function (privateKey, hash, chainId) {
        var /** @type {?} */ privKey = Buffer$1.from(privateKey.replace('0x', ''), 'hex');
        var /** @type {?} */ data = Buffer$1.from(hash.replace('0x', ''), 'hex');
        var /** @type {?} */ addToV = (chainId && chainId > 0) ? chainId * 2 + 8 : 0;
        var _a = sign(data, privKey), signature = _a.signature, recovery = _a.recovery;
        var /** @type {?} */ r = signature.toString('hex', 0, 32);
        var /** @type {?} */ s = signature.toString('hex', 32, 64);
        var /** @type {?} */ v = (recovery + 27 + addToV).toString(16);
        return {
            r: '0x' + r,
            s: '0x' + s,
            v: '0x' + v,
            signature: "0x" + r + s + v
        };
    };
    /**
     * Hash a message with the preamble "\x19Ethereum Signed Message:\n"
     * @param {?} message The message to sign
     * @return {?}
     */
    Signer.prototype.hashMessage = /**
     * Hash a message with the preamble "\x19Ethereum Signed Message:\n"
     * @param {?} message The message to sign
     * @return {?}
     */
    function (message) {
        var /** @type {?} */ msg = isHexStrict(message) ? message : hexToBytes(message);
        var /** @type {?} */ msgBuffer = Buffer$1.from(/** @type {?} */ (msg));
        var /** @type {?} */ preamble = '\x19Ethereum Signed Message:\n' + msg.length;
        var /** @type {?} */ preambleBuffer = Buffer$1.from(preamble);
        var /** @type {?} */ ethMsg = Buffer$1.concat([preambleBuffer, msgBuffer]);
        return keccak256(ethMsg);
    };
    Signer.decorators = [
        { type: Injectable, args: [{ providedIn: WalletModule },] },
    ];
    /** @nocollapse */
    Signer.ctorParameters = function () { return [
        { type: RLP, },
    ]; };
    /** @nocollapse */ Signer.ngInjectableDef = defineInjectable({ factory: function Signer_Factory() { return new Signer(inject(RLP)); }, token: Signer, providedIn: WalletModule });
    return Signer;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var EncryptOptions = /** @class */ (function () {
    function EncryptOptions(options) {
        this.salt = randomBytes(32);
        this.iv = randomBytes(16);
        this.kdf = 'scrypt';
        this.c = 262144;
        this.dklen = 32;
        this.n = 8192;
        this.r = 8;
        this.p = 1;
        this.cipher = 'aes-128-ctr';
        this.uuid = randomBytes(16);
        for (var /** @type {?} */ key in options) {
            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
        // Transform salt to be a Buffer
        if (options && typeof options.salt === 'string') {
            this.salt = Buffer.from(options.salt.replace('0x', ''), 'hex');
        }
    }
    return EncryptOptions;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
    /** @nocollapse */ Accounts.ngInjectableDef = defineInjectable({ factory: function Accounts_Factory() { return new Accounts(); }, token: Accounts, providedIn: WalletModule });
    return Accounts;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Wallet = /** @class */ (function () {
    function Wallet(provider, signer, accounts) {
        this.provider = provider;
        this.signer = signer;
        this.accounts = accounts;
        this.localKeystore = new BehaviorSubject(null);
        this.currentAccount = new BehaviorSubject(null);
        this.keystores$ = this.localKeystore.asObservable();
        this.account$ = this.currentAccount.asObservable();
        this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
    }
    Object.defineProperty(Wallet.prototype, "defaultAccount", {
        /** Get the default account */
        get: /**
         * Get the default account
         * @return {?}
         */
        function () {
            return this.currentAccount.getValue();
        },
        /** Set the default account */
        set: /**
         * Set the default account
         * @param {?} account
         * @return {?}
         */
        function (account) {
            this.currentAccount.next(toChecksumAddress(account));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return the keystore map from the localstore
     * @return {?}
     */
    Wallet.prototype.getKeystoreMapFromLocalStorage = /**
     * Return the keystore map from the localstore
     * @return {?}
     */
    function () {
        var _this = this;
        return new Array(localStorage.length).fill(null)
            .reduce(function (keyMap, none, i) {
            var /** @type {?} */ key = localStorage.key(i);
            return checkAddressChecksum(key)
                ? __assign({}, keyMap, (_a = {}, _a[key] = _this.getKeystore(key), _a)) : __assign({}, keyMap);
            var _a;
        }, {});
    };
    /**
     * Get a specific keystore depending on its address
     * @param {?} address The address of the keystore
     * @return {?}
     */
    Wallet.prototype.getKeystore = /**
     * Get a specific keystore depending on its address
     * @param {?} address The address of the keystore
     * @return {?}
     */
    function (address) {
        var /** @type {?} */ checkSum = toChecksumAddress(address);
        return JSON.parse(localStorage.getItem(checkSum));
    };
    /**
     * Return the list of addresses available in the localStorage
     * @return {?}
     */
    Wallet.prototype.getAccounts = /**
     * Return the list of addresses available in the localStorage
     * @return {?}
     */
    function () {
        return this.keystores$.pipe(map(function (keyMap) { return Object.keys(keyMap); }));
    };
    /**
     * Create an account
     * @return {?}
     */
    Wallet.prototype.create = /**
     * Create an account
     * @return {?}
     */
    function () {
        return this.accounts.create();
    };
    /**
     * Save an account into the localstorage
     * @param {?} account The key pair account
     * @param {?} password The password to encrypt the account with
     * @return {?}
     */
    Wallet.prototype.save = /**
     * Save an account into the localstorage
     * @param {?} account The key pair account
     * @param {?} password The password to encrypt the account with
     * @return {?}
     */
    function (account, password) {
        var address = account.address, privateKey = account.privateKey;
        var /** @type {?} */ keystore = this.encrypt(privateKey, password);
        // Update allKeystore
        localStorage.setItem(address, JSON.stringify(keystore));
        this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
    };
    /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} options A list of options to encrypt the private key
     * @return {?}
     */
    Wallet.prototype.encrypt = /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} options A list of options to encrypt the private key
     * @return {?}
     */
    function (privateKey, password, options) {
        return this.accounts.encrypt(privateKey, password, options);
    };
    /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * @return {?}
     */
    Wallet.prototype.decrypt = /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * @return {?}
     */
    function (keystore, password) {
        return this.accounts.decrypt(keystore, password);
    };
    /**
     * Send a transaction by signing it
     * @param {?} tx The transaction to send
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    Wallet.prototype.sendTransaction = /**
     * Send a transaction by signing it
     * @param {?} tx The transaction to send
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    function (tx, privateKey) {
        var rawTransaction = this.signTx(tx, privateKey).rawTransaction;
        return this.sendRawTransaction(rawTransaction);
    };
    /**
     * Send a transaction to the node
     * @param {?} rawTx The signed transaction data.
     * @return {?}
     */
    Wallet.prototype.sendRawTransaction = /**
     * Send a transaction to the node
     * @param {?} rawTx The signed transaction data.
     * @return {?}
     */
    function (rawTx) {
        return this.provider.rpc('eth_sendRawTransaction', [rawTx]);
    };
    /**
     * Sign a transaction with a private key
     * @param {?} tx The transaction to sign
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    Wallet.prototype.signTx = /**
     * Sign a transaction with a private key
     * @param {?} tx The transaction to sign
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    function (tx, privateKey) {
        return this.signer.signTx(privateKey, tx, this.provider.id);
    };
    /**
     * Sign a message
     * @param {?} message the message to sign
     * @param {?} address the address to sign the message with
     * @param {?} password the password needed to decrypt the private key
     * @return {?}
     */
    Wallet.prototype.sign = /**
     * Sign a message
     * @param {?} message the message to sign
     * @param {?} address the address to sign the message with
     * @param {?} password the password needed to decrypt the private key
     * @return {?}
     */
    function (message, address, password) {
        var _this = this;
        return this.keystores$.pipe(map(function (keystores) { return keystores[address]; }), map(function (keystore) { return _this.decrypt(keystore, password); }), map(function (ethAccount) { return _this.signMessage(message, ethAccount.privateKey); }));
    };
    /**
     * Sign a message with the private key
     * @param {?} message The message to sign
     * @param {?} privateKey The private key to sign the message with
     * @return {?}
     */
    Wallet.prototype.signMessage = /**
     * Sign a message with the private key
     * @param {?} message The message to sign
     * @param {?} privateKey The private key to sign the message with
     * @return {?}
     */
    function (message, privateKey) {
        var /** @type {?} */ messageHash = this.signer.hashMessage(message);
        var _a = this.signer.sign(privateKey, messageHash), r = _a.r, s = _a.s, v = _a.v, signature = _a.signature;
        return { message: message, messageHash: messageHash, v: v, r: r, s: s, signature: signature };
    };
    Wallet.decorators = [
        { type: Injectable, args: [{ providedIn: ProvidersModule },] },
    ];
    /** @nocollapse */
    Wallet.ctorParameters = function () { return [
        { type: MainProvider, },
        { type: Signer, },
        { type: Accounts, },
    ]; };
    /** @nocollapse */ Wallet.ngInjectableDef = defineInjectable({ factory: function Wallet_Factory() { return new Wallet(inject(MainProvider), inject(Signer), inject(Accounts)); }, token: Wallet, providedIn: ProvidersModule });
    return Wallet;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { WalletModule, RLP, Signer, Wallet, Accounts as ɵc, RLP as ɵb, Signer as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtd2FsbGV0LmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi93YWxsZXQubW9kdWxlLnRzIiwibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi9zaWduYXR1cmUvcmxwLnRzIiwibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi9zaWduYXR1cmUvc2lnbmVyLnRzIiwibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi9hY2NvdW50L2VuY3J5cHRpb24udHMiLCJuZzovL0BuZ2V0aC93YWxsZXQvbGliL2FjY291bnQvYWNjb3VudC50cyIsIm5nOi8vQG5nZXRoL3dhbGxldC9saWIvd2FsbGV0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5ATmdNb2R1bGUoKVxuZXhwb3J0IGNsYXNzIFdhbGxldE1vZHVsZSB7fVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLi93YWxsZXQubW9kdWxlJztcclxuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XHJcblxyXG4vKipcclxuICogUkxQIEVuY29kaW5nIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2lraS93aWtpLyU1QkVuZ2xpc2glNUQtUkxQXHJcbiAqIFRoaXMgcHJpdmF0ZSB0YWtlcyBpbiBhIGRhdGEsIGNvbnZlcnQgaXQgdG8gYnVmZmVyIGlmIG5vdCwgYW5kIGEgbGVuZ3RoIGZvciByZWN1cnNpb25cclxuICpcclxuICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICogQHJldHVybnMgIC0gcmV0dXJucyBidWZmZXIgb2YgZW5jb2RlZCBkYXRhXHJcbiAqKi9cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBXYWxsZXRNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIFJMUCB7XHJcbiAgcHVibGljIGVuY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nIHwgbnVtYmVyIHwgQXJyYXk8YW55Pikge1xyXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgY29uc3Qgb3V0cHV0ID0gW11cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG91dHB1dC5wdXNoKHRoaXMuZW5jb2RlKGlucHV0W2ldKSlcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBidWYgPSBCdWZmZXIuY29uY2F0KG91dHB1dClcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGJ1Zi5sZW5ndGgsIDE5MiksIGJ1Zl0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbnB1dCA9IHRoaXMudG9CdWZmZXIoaW5wdXQpO1xyXG4gICAgICBpZiAoaW5wdXQubGVuZ3RoID09PSAxICYmIGlucHV0WzBdIDwgMTI4KSB7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGlucHV0Lmxlbmd0aCwgMTI4KSwgaW5wdXRdKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNhZmVQYXJzZUludCAodiwgYmFzZSkge1xyXG4gICAgaWYgKHYuc2xpY2UoMCwgMikgPT09ICcwMCcpIHtcclxuICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFA6IGV4dHJhIHplcm9zJykpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyc2VJbnQodiwgYmFzZSlcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW5jb2RlTGVuZ3RoIChsZW4sIG9mZnNldCkge1xyXG4gICAgaWYgKGxlbiA8IDU2KSB7XHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShbbGVuICsgb2Zmc2V0XSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGhleExlbmd0aCA9IHRoaXMuaW50VG9IZXgobGVuKVxyXG4gICAgICBjb25zdCBsTGVuZ3RoID0gaGV4TGVuZ3RoLmxlbmd0aCAvIDJcclxuICAgICAgY29uc3QgZmlyc3RCeXRlID0gdGhpcy5pbnRUb0hleChvZmZzZXQgKyA1NSArIGxMZW5ndGgpXHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShmaXJzdEJ5dGUgKyBoZXhMZW5ndGgsICdoZXgnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUkxQIERlY29kaW5nIGJhc2VkIG9uOiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dpa2kvd2lraS9STFB9XHJcbiAgICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICAgKiBAcmV0dXJucyAtIHJldHVybnMgZGVjb2RlIEFycmF5IG9mIEJ1ZmZlcnMgY29udGFpbmcgdGhlIG9yaWdpbmFsIG1lc3NhZ2VcclxuICAgKiovXHJcbiAgcHVibGljIGRlY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nLCBzdHJlYW0/OiBib29sZWFuKTogQnVmZmVyIHwgQXJyYXk8YW55PiB7XHJcbiAgICBpZiAoIWlucHV0IHx8IGlucHV0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gQnVmZmVyLmZyb20oW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dCk7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy5fZGVjb2RlKGlucHV0KTtcclxuXHJcbiAgICBpZiAoc3RyZWFtKSB7XHJcbiAgICAgIHJldHVybiBkZWNvZGVkIGFzIGFueTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NlcnQuZXF1YWwoZGVjb2RlZC5yZW1haW5kZXIubGVuZ3RoLCAwLCAnaW52YWxpZCByZW1haW5kZXInKTtcclxuICAgIHJldHVybiBkZWNvZGVkLmRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0TGVuZ3RoKGlucHV0OiBzdHJpbmcgfCBCdWZmZXIpOiBudW1iZXIgfCBCdWZmZXIge1xyXG4gICAgaWYgKCFpbnB1dCB8fCBpbnB1dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dClcclxuICAgIGNvbnN0IGZpcnN0Qnl0ZSA9IGlucHV0WzBdXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgcmV0dXJuIGlucHV0Lmxlbmd0aFxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiNykge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHg3ZlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIHJldHVybiBmaXJzdEJ5dGUgLSAweGJmXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBhIGxpc3QgIG92ZXIgNTUgYnl0ZXMgbG9uZ1xyXG4gICAgICBjb25zdCBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhmNlxyXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICByZXR1cm4gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZGVjb2RlIChpbnB1dDogQnVmZmVyKSB7XHJcbiAgICBsZXQgbGVuZ3RoLCBsbGVuZ3RoLCBkYXRhLCBpbm5lclJlbWFpbmRlciwgZDtcclxuICAgIGNvbnN0IGRlY29kZWQgPSBbXVxyXG4gICAgY29uc3QgZmlyc3RCeXRlID0gaW5wdXRbMF1cclxuXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgLy8gYSBzaW5nbGUgYnl0ZSB3aG9zZSB2YWx1ZSBpcyBpbiB0aGUgWzB4MDAsIDB4N2ZdIHJhbmdlLCB0aGF0IGJ5dGUgaXMgaXRzIG93biBSTFAgZW5jb2RpbmcuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogaW5wdXQuc2xpY2UoMCwgMSksXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZSgxKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGZpcnN0Qnl0ZSA8PSAweGI3KSB7XHJcbiAgICAgIC8vIHN0cmluZyBpcyAwLTU1IGJ5dGVzIGxvbmcuIEEgc2luZ2xlIGJ5dGUgd2l0aCB2YWx1ZSAweDgwIHBsdXMgdGhlIGxlbmd0aCBvZiB0aGUgc3RyaW5nIGZvbGxvd2VkIGJ5IHRoZSBzdHJpbmdcclxuICAgICAgLy8gVGhlIHJhbmdlIG9mIHRoZSBmaXJzdCBieXRlIGlzIFsweDgwLCAweGI3XVxyXG4gICAgICBsZW5ndGggPSBmaXJzdEJ5dGUgLSAweDdmXHJcblxyXG4gICAgICAvLyBzZXQgMHg4MCBudWxsIHRvIDBcclxuICAgICAgaWYgKGZpcnN0Qnl0ZSA9PT0gMHg4MCkge1xyXG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhID0gaW5wdXQuc2xpY2UoMSwgbGVuZ3RoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobGVuZ3RoID09PSAyICYmIGRhdGFbMF0gPCAweDgwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCBlbmNvZGluZzogYnl0ZSBtdXN0IGJlIGxlc3MgMHg4MCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgICBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICBkYXRhID0gaW5wdXQuc2xpY2UobGxlbmd0aCwgbGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgaWYgKGRhdGEubGVuZ3RoIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFAnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHJlbWFpbmRlcjogaW5wdXQuc2xpY2UobGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIGxlbmd0aCA9IGZpcnN0Qnl0ZSAtIDB4YmZcclxuICAgICAgaW5uZXJSZW1haW5kZXIgPSBpbnB1dC5zbGljZSgxLCBsZW5ndGgpXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhdGE6IGRlY29kZWQsXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZShsZW5ndGgpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGEgbGlzdCAgb3ZlciA1NSBieXRlcyBsb25nXHJcbiAgICAgIGxsZW5ndGggPSBmaXJzdEJ5dGUgLSAweGY2XHJcbiAgICAgIGxlbmd0aCA9IHRoaXMuc2FmZVBhcnNlSW50KGlucHV0LnNsaWNlKDEsIGxsZW5ndGgpLnRvU3RyaW5nKCdoZXgnKSwgMTYpXHJcbiAgICAgIGNvbnN0IHRvdGFsTGVuZ3RoID0gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgICBpZiAodG90YWxMZW5ndGggPiBpbnB1dC5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcmxwOiB0b3RhbCBsZW5ndGggaXMgbGFyZ2VyIHRoYW4gdGhlIGRhdGEnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpbm5lclJlbWFpbmRlciA9IGlucHV0LnNsaWNlKGxsZW5ndGgsIHRvdGFsTGVuZ3RoKVxyXG4gICAgICBpZiAoaW5uZXJSZW1haW5kZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCwgTGlzdCBoYXMgYSBpbnZhbGlkIGxlbmd0aCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGVjb2RlZCxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKHRvdGFsTGVuZ3RoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogSEVMUEVSUyA6IFRPIFJFTU9WRVxyXG4gICAqL1xyXG5cclxuICBwcml2YXRlIGlzSGV4UHJlZml4ZWQoc3RyKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnXHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmVzIDB4IGZyb20gYSBnaXZlbiBTdHJpbmdcclxuICBwcml2YXRlIHN0cmlwSGV4UHJlZml4KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gc3RyXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5pc0hleFByZWZpeGVkKHN0cikgPyBzdHIuc2xpY2UoMikgOiBzdHJcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW50VG9IZXgoaTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGxldCBoZXggPSBpLnRvU3RyaW5nKDE2KVxyXG4gICAgaWYgKGhleC5sZW5ndGggJSAyKSB7XHJcbiAgICAgIGhleCA9ICcwJyArIGhleFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhleFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYWRUb0V2ZW4oYTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmIChhLmxlbmd0aCAlIDIpIGEgPSAnMCcgKyBhXHJcbiAgICByZXR1cm4gYVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnRUb0J1ZmZlcihpOiBudW1iZXIpOiBCdWZmZXIge1xyXG4gICAgY29uc3QgaGV4ID0gdGhpcy5pbnRUb0hleChpKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGhleCwgJ2hleCcpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvQnVmZmVyKHY6IGFueSk6IEJ1ZmZlciB7XHJcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih2KSkge1xyXG4gICAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNIZXhQcmVmaXhlZCh2KSkge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHRoaXMucGFkVG9FdmVuKHRoaXMuc3RyaXBIZXhQcmVmaXgodikpLCAnaGV4JylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGlmICghdikge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2ID0gdGhpcy5pbnRUb0J1ZmZlcih2KVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHYgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIGlmICh2LnRvQXJyYXkpIHtcclxuICAgICAgICAvLyBjb252ZXJ0cyBhIEJOIHRvIGEgQnVmZmVyXHJcbiAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYudG9BcnJheSgpKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0eXBlJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgVHhPYmplY3QsIGtlY2NhazI1NiwgaXNIZXhTdHJpY3QsIGhleFRvQnl0ZXMgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLy4uL3dhbGxldC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBSTFAgfSBmcm9tICcuL3JscCc7XHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XHJcbmltcG9ydCB7IHNpZ24gfSBmcm9tICdzZWNwMjU2azEnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogV2FsbGV0TW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduZXIge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJscDogUkxQKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgcmF3IHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIHNpZ24gdGhlIHRyYW5zYWN0aW9uIHdpdGhcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gY2hhaW5JZCBUaGUgaWQgb2YgdGhlIGNoYWluXHJcbiAgICovXHJcbiAgcHVibGljIHNpZ25UeChwcml2YXRlS2V5OiBzdHJpbmcsIHR4OiBUeE9iamVjdCwgY2hhaW5JZD86IG51bWJlcikge1xyXG4gICAgLy8gRm9ybWF0IFRYXHJcbiAgICBjb25zdCByYXdUeCA9IHRoaXMucmF3VHgodHgpO1xyXG4gICAgY29uc3QgcmF3Q2hhaW4gPSBbICcweCcgKyAoY2hhaW5JZCB8fCAxKS50b1N0cmluZygxNiksICcweCcsICcweCcgXTtcclxuXHJcbiAgICAvLyBSTFAgZW5jb2RlIHdpdGggY2hhaW5JZCAoRUlQMTU1OiBwcmV2ZW50IHJlcGxheSBhdHRhY2spXHJcbiAgICBjb25zdCBybHBFbmNvZGVkID0gdGhpcy5ybHAuZW5jb2RlKFsuLi5yYXdUeCwgLi4ucmF3Q2hhaW5dKTtcclxuXHJcbiAgICAvLyBIYXNoXHJcbiAgICBjb25zdCBtZXNzYWdlSGFzaCA9IGtlY2NhazI1NihybHBFbmNvZGVkKTtcclxuXHJcbiAgICAvLyBTaWduXHJcbiAgICBjb25zdCB7IHIsIHMsIHYgfSA9IHRoaXMuc2lnbihwcml2YXRlS2V5LCBtZXNzYWdlSGFzaCwgY2hhaW5JZCk7XHJcblxyXG4gICAgLy8gUkxQIEVuY29kZSB3aXRoIHNpZ25hdHVyZVxyXG4gICAgY29uc3QgcmxwVHggPSB0aGlzLnJscC5lbmNvZGUoWy4uLnJhd1R4LCAuLi5bdiwgciwgc11dKTtcclxuICAgIGNvbnN0IHJhd1RyYW5zYWN0aW9uID0gJzB4JyArICBybHBUeC50b1N0cmluZygnaGV4Jyk7XHJcblxyXG4gICAgcmV0dXJuIHsgbWVzc2FnZUhhc2gsIHIsIHMsIHYsIHJhd1RyYW5zYWN0aW9uIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWNvdmVyIGEgdHJhbnNhY3Rpb24gYmFzZWQgb24gaXRzIHJhdyB2YWx1ZVxyXG4gICAqIEBwYXJhbSByYXdUeCBUaGUgcmF3IHRyYW5zYWN0aW9uIGZvcm1hdFxyXG4gICAqL1xyXG4gIHB1YmxpYyByZWNvdmVyVHgocmF3VHg6IHN0cmluZykge1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZvcm1hdCB0aGUgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gdHggVGhlIFRyYW5zYWN0aW9uIHRvIGVuY29kZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmF3VHgodHg6IFR4T2JqZWN0KTogYW55W10ge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgJzB4JyArICh0eC5ub25jZSB8fCAnJyksXHJcbiAgICAgICcweCcgKyAodHguZ2FzUHJpY2UgfHwgJycpLFxyXG4gICAgICAnMHgnICsgKHR4LmdhcyB8fCAnJyksXHJcbiAgICAgICcweCcgKyB0eC50by50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJzB4JywgJycpIHx8ICcnLFxyXG4gICAgICAnMHgnICsgKHR4LnZhbHVlIHx8ICcnKSxcclxuICAgICAgJzB4JyArICh0eC5kYXRhIHx8ICcnKVxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSBoYXNoXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IG5lZWRlZCB0byBzaWduIHRoZSBoYXNoXHJcbiAgICogQHBhcmFtIGhhc2ggVGhlIGhhc2ggdG8gc2lnblxyXG4gICAqIEBwYXJhbSBjaGFpbklkIFRoZSBJZCBvZiB0aGUgY2hhaW5cclxuICAgICovXHJcbiAgcHVibGljIHNpZ24ocHJpdmF0ZUtleTogc3RyaW5nLCBoYXNoOiBzdHJpbmcsIGNoYWluSWQ/OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHByaXZLZXkgPSBCdWZmZXIuZnJvbShwcml2YXRlS2V5LnJlcGxhY2UoJzB4JywgJycpLCAnaGV4Jyk7XHJcbiAgICBjb25zdCBkYXRhID0gQnVmZmVyLmZyb20oaGFzaC5yZXBsYWNlKCcweCcsICcnKSwgJ2hleCcpO1xyXG4gICAgY29uc3QgYWRkVG9WID0gKGNoYWluSWQgJiYgY2hhaW5JZCA+IDApID8gY2hhaW5JZCAqIDIgKyA4IDogMDtcclxuICAgIGNvbnN0IHsgc2lnbmF0dXJlLCByZWNvdmVyeSB9ID0gc2lnbihkYXRhLCBwcml2S2V5KTtcclxuICAgIGNvbnN0IHIgPSBzaWduYXR1cmUudG9TdHJpbmcoJ2hleCcsIDAsIDMyKTtcclxuICAgIGNvbnN0IHMgPSBzaWduYXR1cmUudG9TdHJpbmcoJ2hleCcsIDMyLCA2NCk7XHJcbiAgICBjb25zdCB2ID0gKHJlY292ZXJ5ICsgMjcgKyBhZGRUb1YpLnRvU3RyaW5nKDE2KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHI6ICcweCcrcixcclxuICAgICAgczogJzB4JytzLFxyXG4gICAgICB2OiAnMHgnK3YsXHJcbiAgICAgIHNpZ25hdHVyZTogYDB4JHtyfSR7c30ke3Z9YFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhhc2ggYSBtZXNzYWdlIHdpdGggdGhlIHByZWFtYmxlIFwiXFx4MTlFdGhlcmV1bSBTaWduZWQgTWVzc2FnZTpcXG5cIlxyXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHNpZ25cclxuICAgKi9cclxuICBwdWJsaWMgaGFzaE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IG1zZyA9IGlzSGV4U3RyaWN0KG1lc3NhZ2UpID8gbWVzc2FnZSA6IGhleFRvQnl0ZXMobWVzc2FnZSk7XHJcbiAgICBjb25zdCBtc2dCdWZmZXIgPSBCdWZmZXIuZnJvbShtc2cgYXMgc3RyaW5nKTtcclxuICAgIGNvbnN0IHByZWFtYmxlID0gJ1xceDE5RXRoZXJldW0gU2lnbmVkIE1lc3NhZ2U6XFxuJyArIG1zZy5sZW5ndGg7XHJcbiAgICBjb25zdCBwcmVhbWJsZUJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHByZWFtYmxlKTtcclxuICAgIGNvbnN0IGV0aE1zZyA9IEJ1ZmZlci5jb25jYXQoW3ByZWFtYmxlQnVmZmVyLCBtc2dCdWZmZXJdKTtcclxuICAgIHJldHVybiBrZWNjYWsyNTYoZXRoTXNnKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8tYnJvd3NlcmlmeSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRW5jcnlwdE9wdGlvbnMge1xyXG4gIHB1YmxpYyBzYWx0OiBCdWZmZXIgfCBzdHJpbmcgPSByYW5kb21CeXRlcygzMik7XHJcbiAgcHVibGljIGl2OiBCdWZmZXIgPSByYW5kb21CeXRlcygxNik7XHJcbiAgcHVibGljIGtkZjogJ3Bia2RmMicgfCAnc2NyeXB0JyA9ICdzY3J5cHQnO1xyXG4gIHB1YmxpYyBjID0gMjYyMTQ0O1xyXG4gIHB1YmxpYyBwcmY6ICdobWFjLXNoYTI1Nic7XHJcbiAgcHVibGljIGRrbGVuID0gMzI7XHJcbiAgcHVibGljIG46IDIwNDggfCA0MDk2IHwgODE5MiB8IDE2Mzg0ID0gODE5MjtcclxuICBwdWJsaWMgciA9IDg7XHJcbiAgcHVibGljIHAgPSAxO1xyXG4gIHB1YmxpYyBjaXBoZXI6ICdhZXMtMTI4LWN0cicgfCBzdHJpbmcgPSAnYWVzLTEyOC1jdHInO1xyXG4gIHB1YmxpYyB1dWlkOiBCdWZmZXIgPSByYW5kb21CeXRlcygxNik7XHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IFBhcnRpYWw8RW5jcnlwdE9wdGlvbnM+KSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFRyYW5zZm9ybSBzYWx0IHRvIGJlIGEgQnVmZmVyXHJcbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5zYWx0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLnNhbHQgPSBCdWZmZXIuZnJvbShvcHRpb25zLnNhbHQucmVwbGFjZSgnMHgnLCAnJyksICdoZXgnKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXlzdG9yZSB7XHJcbiAgdmVyc2lvbjogMztcclxuICBpZDogc3RyaW5nO1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxuICBjcnlwdG86IHtcclxuICAgIGNpcGhlcnRleHQ6IHN0cmluZztcclxuICAgIGNpcGhlcnBhcmFtczoge1xyXG4gICAgICAgIGl2OiBzdHJpbmc7XHJcbiAgICB9LFxyXG4gICAgY2lwaGVyOiBzdHJpbmc7XHJcbiAgICBrZGY6IHN0cmluZztcclxuICAgIGtkZnBhcmFtczoge1xyXG4gICAgICBka2xlbjogbnVtYmVyO1xyXG4gICAgICBzYWx0OiBzdHJpbmc7XHJcbiAgICAgIC8vIEZvciBzY3J5cHQgZW5jcnlwdGlvblxyXG4gICAgICBuPzogbnVtYmVyO1xyXG4gICAgICBwPzogbnVtYmVyO1xyXG4gICAgICByPzogbnVtYmVyO1xyXG4gICAgICAvLyBGb3IgcGJrZGYyIGVuY3J5cHRpb25cclxuICAgICAgYz86IG51bWJlcjtcclxuICAgICAgcHJmPzogJ2htYWMtc2hhMjU2JztcclxuICAgIH07XHJcbiAgICBtYWM6IHN0cmluZztcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIFJlc3NvdXJjZXNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dpa2kvd2lraS9XZWIzLVNlY3JldC1TdG9yYWdlLURlZmluaXRpb25cclxuICovXHJcblxyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFdhbGxldE1vZHVsZSB9IGZyb20gJy4vLi4vd2FsbGV0Lm1vZHVsZSc7XHJcblxyXG5pbXBvcnQgeyB2NCB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyB0b0NoZWNrc3VtQWRkcmVzcywga2VjY2FrMjU2IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgcHJpdmF0ZUtleVZlcmlmeSwgcHVibGljS2V5Q3JlYXRlIH0gZnJvbSAnc2VjcDI1NmsxJztcclxuaW1wb3J0IHsgcmFuZG9tQnl0ZXMsIHBia2RmMlN5bmMsIGNyZWF0ZUNpcGhlcml2LCBjcmVhdGVEZWNpcGhlcml2IH0gZnJvbSAnY3J5cHRvLWJyb3dzZXJpZnknO1xyXG5pbXBvcnQgeyBFbmNyeXB0T3B0aW9ucywgS2V5c3RvcmUgfSBmcm9tICcuL2VuY3J5cHRpb24nO1xyXG5pbXBvcnQgc2NyeXB0c3kgZnJvbSAnc2NyeXB0LmpzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXRoQWNjb3VudCB7XHJcbiAgcHJpdmF0ZUtleTogc3RyaW5nO1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxufVxyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBXYWxsZXRNb2R1bGV9KVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudHMge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhbiBFdGhlcmV1bSBrZXlwYWlyXHJcbiAgICovXHJcbiAgcHVibGljIGNyZWF0ZSgpOiBFdGhBY2NvdW50IHtcclxuICAgIGxldCBwcml2S2V5OiBCdWZmZXI7XHJcbiAgICBkbyB7IHByaXZLZXkgPSByYW5kb21CeXRlcygzMik7IH1cclxuICAgIHdoaWxlICghcHJpdmF0ZUtleVZlcmlmeShwcml2S2V5KSk7XHJcbiAgICByZXR1cm4gdGhpcy5mcm9tUHJpdmF0ZShwcml2S2V5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhbiBhY2NvdW50IGZyb20gYSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB3aXRob3V0IHRoZSBwcmVmaXggJzB4J1xyXG4gICAqL1xyXG4gIHB1YmxpYyBmcm9tUHJpdmF0ZShwcml2YXRlS2V5OiBzdHJpbmcgfCBCdWZmZXIpOiBFdGhBY2NvdW50IHtcclxuICAgIGlmICh0eXBlb2YgcHJpdmF0ZUtleSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcHJpdmF0ZUtleSA9IEJ1ZmZlci5mcm9tKFtwcml2YXRlS2V5LnJlcGxhY2UoJzB4JywgJycpXSk7XHJcbiAgICB9XHJcbiAgICAvLyBTbGljZSgxKSBpcyB0byBkcm9wIHR5cGUgYnl0ZSB3aGljaCBpcyBoYXJkY29kZWQgYXMgMDQgZXRoZXJldW0uXHJcbiAgICBjb25zdCBwdWJLZXkgPSBwdWJsaWNLZXlDcmVhdGUocHJpdmF0ZUtleSwgZmFsc2UpLnNsaWNlKDEpO1xyXG4gICAgY29uc3QgYWRkcmVzcyA9ICcweCcgKyBrZWNjYWsyNTYocHViS2V5KS5zdWJzdHJpbmcoMjYpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcHJpdmF0ZUtleTogJzB4JyArIHByaXZhdGVLZXkudG9TdHJpbmcoJ2hleCcpLFxyXG4gICAgICBhZGRyZXNzOiB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY3J5cHQgYW4gcHJpdmF0ZSBrZXkgaW50byBhIGtleXN0b3JlXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIGVuY3J5cHRcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGVuY3J5cHQgdGhlIHByaXZhdGUga2V5IHdpdGhcclxuICAgKiBAcGFyYW0gZW5jcnlwdE9wdGlvbnMgQSBsaXN0IG9mIG9wdGlvbnMgdG8gZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBDb2RlIGZyb20gOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2ViMy5qcy9ibG9iLzEuMC9wYWNrYWdlcy93ZWIzLWV0aC1hY2NvdW50cy9zcmMvaW5kZXguanNcclxuICAgKi9cclxuICBwdWJsaWMgZW5jcnlwdChcclxuICAgIHByaXZhdGVLZXk6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBlbmNyeXB0T3B0aW9ucz86IFBhcnRpYWw8RW5jcnlwdE9wdGlvbnM+KTogS2V5c3RvcmVcclxuICB7XHJcbiAgICBjb25zdCBwd2QgPSBCdWZmZXIuZnJvbShwYXNzd29yZCk7XHJcbiAgICBjb25zdCBwcml2S2V5ID0gQnVmZmVyLmZyb20ocHJpdmF0ZUtleS5yZXBsYWNlKCcweCcsICcnKSwgJ2hleCcpO1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IG5ldyBFbmNyeXB0T3B0aW9ucyhlbmNyeXB0T3B0aW9ucyk7XHJcbiAgICBjb25zdCB7IHNhbHQsIGl2LCBrZGYsIGMsIG4sIHIsIHAsIGRrbGVuLCBjaXBoZXIsIHV1aWQgfSA9IG9wdGlvbnM7XHJcbiAgICBjb25zdCBrZGZQYXJhbXM6IEtleXN0b3JlWydjcnlwdG8nXVsna2RmcGFyYW1zJ10gPSB7XHJcbiAgICAgIGRrbGVuOiBka2xlbixcclxuICAgICAgc2FsdDogKHNhbHQgYXMgQnVmZmVyKS50b1N0cmluZygnaGV4JylcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGRlcml2ZWRLZXk7XHJcbiAgICBpZiAoa2RmID09PSAncGJrZGYyJykge1xyXG4gICAgICBrZGZQYXJhbXMuYyA9IGM7XHJcbiAgICAgIGtkZlBhcmFtcy5wcmYgPSAnaG1hYy1zaGEyNTYnO1xyXG4gICAgICBkZXJpdmVkS2V5ID0gcGJrZGYyU3luYyhwd2QsIHNhbHQsIGMsIGRrbGVuLCAnc2hhMjU2Jyk7XHJcbiAgICB9IGVsc2UgaWYgKGtkZiA9PT0gJ3NjcnlwdCcpIHtcclxuICAgICAga2RmUGFyYW1zLm4gPSBuO1xyXG4gICAgICBrZGZQYXJhbXMuciA9IHI7XHJcbiAgICAgIGtkZlBhcmFtcy5wID0gcDtcclxuICAgICAgZGVyaXZlZEtleSA9IHNjcnlwdHN5KHB3ZCwgc2FsdCwgbiwgciwgcCwgZGtsZW4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBLZXkgRGVyaXZhdGlvbiBGdW5jdGlvbicgKyBrZGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNpcGhlckFsZyA9IGNyZWF0ZUNpcGhlcml2KGNpcGhlciwgZGVyaXZlZEtleS5zbGljZSgwLCAxNiksIGl2KTtcclxuICAgIGlmICghY2lwaGVyQWxnKSB7IHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgY2lwaGVyICcgKyBjaXBoZXIpfVxyXG4gICAgY29uc3QgY2lwaGVyVGV4dCA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlckFsZy51cGRhdGUocHJpdktleSksIGNpcGhlckFsZy5maW5hbCgpXSk7XHJcbiAgICBjb25zdCB0b01hYyA9IEJ1ZmZlci5jb25jYXQoW2Rlcml2ZWRLZXkuc2xpY2UoMTYsIDMyKSwgY2lwaGVyVGV4dF0pO1xyXG4gICAgY29uc3QgbWFjID0ga2VjY2FrMjU2KHRvTWFjKS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZlcnNpb246IDMsXHJcbiAgICAgIGlkOiB2NCh7IHJhbmRvbTogdXVpZCBhcyBhbnkgfSksXHJcbiAgICAgIGFkZHJlc3M6IHRoaXMuZnJvbVByaXZhdGUocHJpdktleSkuYWRkcmVzcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJzB4JywgJycpLFxyXG4gICAgICBjcnlwdG86IHtcclxuICAgICAgICBjaXBoZXJ0ZXh0OiBjaXBoZXJUZXh0LnRvU3RyaW5nKCdoZXgnKSxcclxuICAgICAgICBjaXBoZXJwYXJhbXM6IHtcclxuICAgICAgICAgICAgaXY6IGl2LnRvU3RyaW5nKCdoZXgnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2lwaGVyOiBvcHRpb25zLmNpcGhlcixcclxuICAgICAgICBrZGY6IGtkZixcclxuICAgICAgICBrZGZwYXJhbXM6IGtkZlBhcmFtcyxcclxuICAgICAgICBtYWM6IG1hY1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNyeXB0IGEga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIGtleXN0b3JlIFRoZSBrZXlzdG9yZSBvYmplY3RcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGRlY3J5cHQgdGhlIGtleXN0b3JlIHdpdGhcclxuICAgKiBDb2RlIGZyb20gOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW1qcy9ldGhlcmV1bWpzLXdhbGxldC9ibG9iL21hc3Rlci9pbmRleC5qc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNyeXB0KGtleXN0b3JlOiBLZXlzdG9yZSwgcGFzc3dvcmQ6IHN0cmluZyk6IEV0aEFjY291bnQge1xyXG4gICAgaWYgKHR5cGVvZiBwYXNzd29yZCAhPT0gJ3N0cmluZycpIHsgdGhyb3cgbmV3IEVycm9yKCdObyBwYXNzd29yZCBwcm92aWRlZCcpOyB9XHJcbiAgICBpZiAodHlwZW9mIGtleXN0b3JlICE9PSAnb2JqZWN0JykgeyB0aHJvdyBuZXcgRXJyb3IoJ2tleXN0b3JlIHNob3VsZCBiZSBhbiBvYmplY3QnKTsgfVxyXG4gICAgaWYgKGtleXN0b3JlLnZlcnNpb24gIT09IDMpIHsgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSBWMyB3YWxsZXQnKTsgfVxyXG5cclxuICAgIGxldCBkZXJpdmVkS2V5O1xyXG4gICAgY29uc3QgeyBrZGYsIGtkZnBhcmFtcywgY2lwaGVycGFyYW1zLCBjaXBoZXIgfSA9IGtleXN0b3JlLmNyeXB0bztcclxuICAgIGNvbnN0IHB3ZCA9IEJ1ZmZlci5mcm9tKHBhc3N3b3JkLCAndXRmOCcpO1xyXG4gICAgY29uc3Qgc2FsdCA9IEJ1ZmZlci5mcm9tKGtkZnBhcmFtcy5zYWx0LCAnaGV4Jyk7XHJcbiAgICBjb25zdCBpdiA9IEJ1ZmZlci5mcm9tKGNpcGhlcnBhcmFtcy5pdiwgJ2hleCcpO1xyXG4gICAgLy8gU2NyeXB0IGVuY3J5cHRpb25cclxuICAgIGlmIChrZGYgPT09ICdzY3J5cHQnKSB7XHJcbiAgICAgIGNvbnN0IHsgbiwgciwgcCwgZGtsZW4gfSA9IGtkZnBhcmFtcztcclxuICAgICAgZGVyaXZlZEtleSA9IHNjcnlwdHN5KHB3ZCwgc2FsdCwgbiwgciwgcCwgZGtsZW4pXHJcbiAgICB9XHJcbiAgICAvLyBwYmtkZjIgZW5jcnlwdGlvblxyXG4gICAgZWxzZSBpZiAoa2RmID09PSAncGJrZGYyJykge1xyXG4gICAgICBpZiAoa2RmcGFyYW1zLnByZiAhPT0gJ2htYWMtc2hhMjU2JykgeyB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHBhcmFtZXRlcnMgdG8gUEJLREYyJyk7IH1cclxuICAgICAgY29uc3QgeyBjLCBka2xlbiB9ID0ga2RmcGFyYW1zO1xyXG4gICAgICBkZXJpdmVkS2V5ID0gcGJrZGYyU3luYyhwd2QsIHNhbHQsIGMsIGRrbGVuLCAnc2hhMjU2JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQga2V5IGRlcml2YXRpb24gc2NoZW1lJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXBoZXJUZXh0ID0gQnVmZmVyLmZyb20oa2V5c3RvcmUuY3J5cHRvLmNpcGhlcnRleHQsICdoZXgnKTtcclxuICAgIGNvbnN0IG1hYyA9IGtlY2NhazI1NihCdWZmZXIuY29uY2F0KFsgZGVyaXZlZEtleS5zbGljZSgxNiwgMzIpLCBjaXBoZXJUZXh0IF0pKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgnMHgnLCAnJyk7XHJcblxyXG4gICAgaWYgKG1hYyAhPT0ga2V5c3RvcmUuY3J5cHRvLm1hYykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleSBkZXJpdmF0aW9uIGZhaWxlZCAtIHBvc3NpYmx5IHdyb25nIHBhc3N3b3JkJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkZWNpcGhlciA9IGNyZWF0ZURlY2lwaGVyaXYoY2lwaGVyLCBkZXJpdmVkS2V5LnNsaWNlKDAsIDE2KSwgaXYpO1xyXG4gICAgY29uc3Qgc2VlZCA9IEJ1ZmZlci5jb25jYXQoWyBkZWNpcGhlci51cGRhdGUoY2lwaGVyVGV4dCksIGRlY2lwaGVyLmZpbmFsKCkgXSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZnJvbVByaXZhdGUoc2VlZCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlLCBNYWluUHJvdmlkZXIsIEF1dGggfSBmcm9tICdAbmdldGgvcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBUeE9iamVjdCwgdG9DaGVja3N1bUFkZHJlc3MsIGNoZWNrQWRkcmVzc0NoZWNrc3VtIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuXHJcbmltcG9ydCB7IEFjY291bnRzLCBFbmNyeXB0T3B0aW9ucywgS2V5c3RvcmUsIEV0aEFjY291bnQgfSBmcm9tICcuL2FjY291bnQnO1xyXG5pbXBvcnQgeyBTaWduZXIgfSBmcm9tICcuL3NpZ25hdHVyZS9zaWduZXInO1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2V5c3RvcmVNYXAge1xyXG4gIFthZGRyZXNzOiBzdHJpbmddOiBLZXlzdG9yZTtcclxufVxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBQcm92aWRlcnNNb2R1bGV9KVxyXG5leHBvcnQgY2xhc3MgV2FsbGV0IGltcGxlbWVudHMgQXV0aCB7XHJcbiAgcHJpdmF0ZSBsb2NhbEtleXN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxLZXlzdG9yZU1hcD4obnVsbCk7XHJcbiAgcHJpdmF0ZSBjdXJyZW50QWNjb3VudCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPihudWxsKTtcclxuICBwdWJsaWMga2V5c3RvcmVzJCA9IHRoaXMubG9jYWxLZXlzdG9yZS5hc09ic2VydmFibGUoKTtcclxuICBwdWJsaWMgYWNjb3VudCQgPSB0aGlzLmN1cnJlbnRBY2NvdW50LmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcixcclxuICAgIHByaXZhdGUgc2lnbmVyOiBTaWduZXIsXHJcbiAgICBwcml2YXRlIGFjY291bnRzOiBBY2NvdW50c1xyXG4gICkge1xyXG4gICAgdGhpcy5sb2NhbEtleXN0b3JlLm5leHQodGhpcy5nZXRLZXlzdG9yZU1hcEZyb21Mb2NhbFN0b3JhZ2UoKSk7XHJcbiAgfVxyXG5cclxuICAvKiogR2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBnZXQgZGVmYXVsdEFjY291bnQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRBY2NvdW50LmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogU2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBzZXQgZGVmYXVsdEFjY291bnQoYWNjb3VudDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRBY2NvdW50Lm5leHQodG9DaGVja3N1bUFkZHJlc3MoYWNjb3VudCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFJldHVybiB0aGUga2V5c3RvcmUgbWFwIGZyb20gdGhlIGxvY2Fsc3RvcmUgKi9cclxuICBwcml2YXRlIGdldEtleXN0b3JlTWFwRnJvbUxvY2FsU3RvcmFnZSgpOiBLZXlzdG9yZU1hcCB7XHJcbiAgICByZXR1cm4gbmV3IEFycmF5KGxvY2FsU3RvcmFnZS5sZW5ndGgpLmZpbGwobnVsbClcclxuICAgICAgLnJlZHVjZSgoa2V5TWFwOiBLZXlzdG9yZU1hcCwgbm9uZTogbnVsbCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgICByZXR1cm4gY2hlY2tBZGRyZXNzQ2hlY2tzdW0oa2V5KVxyXG4gICAgICAgICAgPyB7Li4ua2V5TWFwLCBba2V5XTogdGhpcy5nZXRLZXlzdG9yZShrZXkpIH1cclxuICAgICAgICAgIDogey4uLmtleU1hcH07XHJcbiAgICAgIH0sIHt9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIHNwZWNpZmljIGtleXN0b3JlIGRlcGVuZGluZyBvbiBpdHMgYWRkcmVzc1xyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIG9mIHRoZSBrZXlzdG9yZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRLZXlzdG9yZShhZGRyZXNzOiBzdHJpbmcpOiBLZXlzdG9yZSB7XHJcbiAgICBjb25zdCBjaGVja1N1bSA9IHRvQ2hlY2tzdW1BZGRyZXNzKGFkZHJlc3MpO1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY2hlY2tTdW0pKTtcclxuICB9XHJcblxyXG4gIC8qKiBSZXR1cm4gdGhlIGxpc3Qgb2YgYWRkcmVzc2VzIGF2YWlsYWJsZSBpbiB0aGUgbG9jYWxTdG9yYWdlICovXHJcbiAgcHVibGljIGdldEFjY291bnRzKCk6IE9ic2VydmFibGU8c3RyaW5nW10+IHtcclxuICAgIHJldHVybiB0aGlzLmtleXN0b3JlcyQucGlwZShtYXAoa2V5TWFwID0+IE9iamVjdC5rZXlzKGtleU1hcCkpKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYW4gYWNjb3VudFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50cy5jcmVhdGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNhdmUgYW4gYWNjb3VudCBpbnRvIHRoZSBsb2NhbHN0b3JhZ2VcclxuICAgKiBAcGFyYW0gYWNjb3VudCBUaGUga2V5IHBhaXIgYWNjb3VudFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdG8gZW5jcnlwdCB0aGUgYWNjb3VudCB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNhdmUoYWNjb3VudDogRXRoQWNjb3VudCwgcGFzc3dvcmQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgeyBhZGRyZXNzLCBwcml2YXRlS2V5IH0gPSBhY2NvdW50O1xyXG4gICAgY29uc3Qga2V5c3RvcmUgPSB0aGlzLmVuY3J5cHQocHJpdmF0ZUtleSwgcGFzc3dvcmQpO1xyXG4gICAgLy8gVXBkYXRlIGFsbEtleXN0b3JlXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShhZGRyZXNzLCBKU09OLnN0cmluZ2lmeShrZXlzdG9yZSkpO1xyXG4gICAgdGhpcy5sb2NhbEtleXN0b3JlLm5leHQodGhpcy5nZXRLZXlzdG9yZU1hcEZyb21Mb2NhbFN0b3JhZ2UoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNyeXB0IGFuIHByaXZhdGUga2V5IGludG8gYSBrZXlzdG9yZVxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBlbmNyeXB0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBlbmNyeXB0IHRoZSBwcml2YXRlIGtleSB3aXRoXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgQSBsaXN0IG9mIG9wdGlvbnMgdG8gZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKi9cclxuICBwdWJsaWMgZW5jcnlwdChwcml2YXRlS2V5OiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYXJ0aWFsPEVuY3J5cHRPcHRpb25zPikge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudHMuZW5jcnlwdChwcml2YXRlS2V5LCBwYXNzd29yZCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNyeXB0IGEga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIGtleXN0b3JlIFRoZSBrZXlzdG9yZSBvYmplY3RcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGRlY3J5cHQgdGhlIGtleXN0b3JlIHdpdGhcclxuICAgKi9cclxuICBwdWJsaWMgZGVjcnlwdChrZXlzdG9yZTogS2V5c3RvcmUsIHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLmFjY291bnRzLmRlY3J5cHQoa2V5c3RvcmUsIHBhc3N3b3JkKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqXHJcbiAgICogVFJBTlNBQ1RJT05cclxuICAgKioqKioqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhIHRyYW5zYWN0aW9uIGJ5IHNpZ25pbmcgaXRcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHNlbmRcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgdHJhbnNhY3Rpb24gd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVHJhbnNhY3Rpb24odHg6IFR4T2JqZWN0LCBwcml2YXRlS2V5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHsgcmF3VHJhbnNhY3Rpb24gfSA9IHRoaXMuc2lnblR4KHR4LCBwcml2YXRlS2V5KTtcclxuICAgIHJldHVybiB0aGlzLnNlbmRSYXdUcmFuc2FjdGlvbihyYXdUcmFuc2FjdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGEgdHJhbnNhY3Rpb24gdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gcmF3VHggVGhlIHNpZ25lZCB0cmFuc2FjdGlvbiBkYXRhLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kUmF3VHJhbnNhY3Rpb24ocmF3VHg6IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX3NlbmRSYXdUcmFuc2FjdGlvbicsIFtyYXdUeF0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIHRyYW5zYWN0aW9uIHdpdGggYSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSB0eCBUaGUgdHJhbnNhY3Rpb24gdG8gc2lnblxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBzaWduIHRoZSB0cmFuc2FjdGlvbiB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNpZ25UeCh0eDogVHhPYmplY3QsIHByaXZhdGVLZXk6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMuc2lnbmVyLnNpZ25UeChwcml2YXRlS2V5LCB0eCwgdGhpcy5wcm92aWRlci5pZCk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKipcclxuICAgKiBTSUdOQVRVUkVcclxuICAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIG1lc3NhZ2VcclxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byBzaWduXHJcbiAgICogQHBhcmFtIGFkZHJlc3MgdGhlIGFkZHJlc3MgdG8gc2lnbiB0aGUgbWVzc2FnZSB3aXRoXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIHRoZSBwYXNzd29yZCBuZWVkZWQgdG8gZGVjcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKi9cclxuICBwdWJsaWMgc2lnbihtZXNzYWdlOiBzdHJpbmcsIGFkZHJlc3M6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMua2V5c3RvcmVzJC5waXBlKFxyXG4gICAgICBtYXAoa2V5c3RvcmVzID0+IGtleXN0b3Jlc1thZGRyZXNzXSksXHJcbiAgICAgIG1hcChrZXlzdG9yZSA9PiB0aGlzLmRlY3J5cHQoa2V5c3RvcmUsIHBhc3N3b3JkKSksXHJcbiAgICAgIG1hcChldGhBY2NvdW50ID0+IHRoaXMuc2lnbk1lc3NhZ2UobWVzc2FnZSwgZXRoQWNjb3VudC5wcml2YXRlS2V5KSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgbWVzc2FnZSB3aXRoIHRoZSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgbWVzc2FnZSB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNpZ25NZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgcHJpdmF0ZUtleTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBtZXNzYWdlSGFzaCA9IHRoaXMuc2lnbmVyLmhhc2hNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgY29uc3Qge3IsIHMsIHYsIHNpZ25hdHVyZX0gPSB0aGlzLnNpZ25lci5zaWduKHByaXZhdGVLZXksIG1lc3NhZ2VIYXNoKTtcclxuICAgIHJldHVybiB7bWVzc2FnZSwgbWVzc2FnZUhhc2gsIHYsIHIsIHMsIHNpZ25hdHVyZX07XHJcbiAgfVxyXG5cclxufVxyXG4iXSwibmFtZXMiOlsiQnVmZmVyIiwiYXNzZXJ0LmVxdWFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O2dCQUNDLFFBQVE7O3VCQURUOzs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7Ozs7OztJQWNTLG9CQUFNOzs7O2NBQUMsS0FBNEM7UUFDeEQsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO1lBQzFCLHFCQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7WUFDakIsS0FBSyxxQkFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMs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