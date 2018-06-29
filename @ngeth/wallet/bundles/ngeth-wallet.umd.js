(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('assert'), require('buffer'), require('@ngeth/utils'), require('secp256k1'), require('crypto-browserify'), require('uuid'), require('scrypt.js'), require('@ngeth/provider'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ngeth/wallet', ['exports', '@angular/core', 'assert', 'buffer', '@ngeth/utils', 'secp256k1', 'crypto-browserify', 'uuid', 'scrypt.js', '@ngeth/provider', 'rxjs', 'rxjs/operators'], factory) :
    (factory((global.ngeth = global.ngeth || {}, global.ngeth.wallet = {}),global.ng.core,null,null,null,null,null,null,null,null,global.rxjs,global.rxjs.operators));
}(this, (function (exports,i0,assert,buffer,utils,secp256k1,cryptoBrowserify,uuid,scryptsy,i1,rxjs,operators) { 'use strict';

    scryptsy = scryptsy && scryptsy.hasOwnProperty('default') ? scryptsy['default'] : scryptsy;

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var WalletModule = (function () {
        function WalletModule() {
        }
        WalletModule.decorators = [
            { type: i0.NgModule },
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
    var RLP = (function () {
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
                    var /** @type {?} */ buf = buffer.Buffer.concat(output);
                    return buffer.Buffer.concat([this.encodeLength(buf.length, 192), buf]);
                }
                else {
                    input = this.toBuffer(input);
                    if (input.length === 1 && input[0] < 128) {
                        return input;
                    }
                    else {
                        return buffer.Buffer.concat([this.encodeLength(input.length, 128), input]);
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
                    return buffer.Buffer.from([len + offset]);
                }
                else {
                    var /** @type {?} */ hexLength = this.intToHex(len);
                    var /** @type {?} */ lLength = hexLength.length / 2;
                    var /** @type {?} */ firstByte = this.intToHex(offset + 55 + lLength);
                    return buffer.Buffer.from(firstByte + hexLength, 'hex');
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
                    return buffer.Buffer.from([]);
                }
                input = this.toBuffer(input);
                var /** @type {?} */ decoded = this._decode(input);
                if (stream) {
                    return /** @type {?} */ (decoded);
                }
                assert.equal(decoded.remainder.length, 0, 'invalid remainder');
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
                    return buffer.Buffer.from([]);
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
                        data = buffer.Buffer.from([]);
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
                return buffer.Buffer.from(hex, 'hex');
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
                if (!buffer.Buffer.isBuffer(v)) {
                    if (typeof v === 'string') {
                        if (this.isHexPrefixed(v)) {
                            v = buffer.Buffer.from(this.padToEven(this.stripHexPrefix(v)), 'hex');
                        }
                        else {
                            v = buffer.Buffer.from(v);
                        }
                    }
                    else if (typeof v === 'number') {
                        if (!v) {
                            v = buffer.Buffer.from([]);
                        }
                        else {
                            v = this.intToBuffer(v);
                        }
                    }
                    else if (v === null || v === undefined) {
                        v = buffer.Buffer.from([]);
                    }
                    else if (v.toArray) {
                        // converts a BN to a Buffer
                        v = buffer.Buffer.from(v.toArray());
                    }
                    else {
                        throw new Error('invalid type');
                    }
                }
                return v;
            };
        RLP.decorators = [
            { type: i0.Injectable, args: [{ providedIn: WalletModule },] },
        ];
        /** @nocollapse */ RLP.ngInjectableDef = i0.defineInjectable({ factory: function RLP_Factory() { return new RLP(); }, token: RLP, providedIn: WalletModule });
        return RLP;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var Signer = (function () {
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
                var /** @type {?} */ messageHash = utils.keccak256(rlpEncoded);
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
                var /** @type {?} */ privKey = buffer.Buffer.from(privateKey.replace('0x', ''), 'hex');
                var /** @type {?} */ data = buffer.Buffer.from(hash.replace('0x', ''), 'hex');
                var /** @type {?} */ addToV = (chainId && chainId > 0) ? chainId * 2 + 8 : 0;
                var _a = secp256k1.sign(data, privKey), signature = _a.signature, recovery = _a.recovery;
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
                var /** @type {?} */ msg = utils.isHexStrict(message) ? message : utils.hexToBytes(message);
                var /** @type {?} */ msgBuffer = buffer.Buffer.from(/** @type {?} */ (msg));
                var /** @type {?} */ preamble = '\x19Ethereum Signed Message:\n' + msg.length;
                var /** @type {?} */ preambleBuffer = buffer.Buffer.from(preamble);
                var /** @type {?} */ ethMsg = buffer.Buffer.concat([preambleBuffer, msgBuffer]);
                return utils.keccak256(ethMsg);
            };
        Signer.decorators = [
            { type: i0.Injectable, args: [{ providedIn: WalletModule },] },
        ];
        /** @nocollapse */
        Signer.ctorParameters = function () {
            return [
                { type: RLP, },
            ];
        };
        /** @nocollapse */ Signer.ngInjectableDef = i0.defineInjectable({ factory: function Signer_Factory() { return new Signer(i0.inject(RLP)); }, token: Signer, providedIn: WalletModule });
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
    var EncryptOptions = (function () {
        function EncryptOptions(options) {
            this.salt = cryptoBrowserify.randomBytes(32);
            this.iv = cryptoBrowserify.randomBytes(16);
            this.kdf = 'scrypt';
            this.c = 262144;
            this.dklen = 32;
            this.n = 8192;
            this.r = 8;
            this.p = 1;
            this.cipher = 'aes-128-ctr';
            this.uuid = cryptoBrowserify.randomBytes(16);
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
    var Accounts = (function () {
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
                    privKey = cryptoBrowserify.randomBytes(32);
                } while (!secp256k1.privateKeyVerify(privKey));
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
                var /** @type {?} */ pubKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
                var /** @type {?} */ address = '0x' + utils.keccak256(pubKey).substring(26);
                return {
                    privateKey: '0x' + privateKey.toString('hex'),
                    address: utils.toChecksumAddress(address)
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
                var salt = options.salt, iv = options.iv, kdf = options.kdf, c = options.c, n = options.n, r = options.r, p = options.p, dklen = options.dklen, cipher = options.cipher, uuid$$1 = options.uuid;
                var /** @type {?} */ kdfParams = {
                    dklen: dklen,
                    salt: ((salt)).toString('hex')
                };
                var /** @type {?} */ derivedKey;
                if (kdf === 'pbkdf2') {
                    kdfParams.c = c;
                    kdfParams.prf = 'hmac-sha256';
                    derivedKey = cryptoBrowserify.pbkdf2Sync(pwd, salt, c, dklen, 'sha256');
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
                var /** @type {?} */ cipherAlg = cryptoBrowserify.createCipheriv(cipher, derivedKey.slice(0, 16), iv);
                if (!cipherAlg) {
                    throw new Error('Unsupported cipher ' + cipher);
                }
                var /** @type {?} */ cipherText = Buffer.concat([cipherAlg.update(privKey), cipherAlg.final()]);
                var /** @type {?} */ toMac = Buffer.concat([derivedKey.slice(16, 32), cipherText]);
                var /** @type {?} */ mac = utils.keccak256(toMac).replace('0x', '');
                return {
                    version: 3,
                    id: uuid.v4({ random: /** @type {?} */ (uuid$$1) }),
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
                    derivedKey = cryptoBrowserify.pbkdf2Sync(pwd, salt, c, dklen, 'sha256');
                }
                else {
                    throw new Error('Unsupported key derivation scheme');
                }
                var /** @type {?} */ cipherText = Buffer.from(keystore.crypto.ciphertext, 'hex');
                var /** @type {?} */ mac = utils.keccak256(Buffer.concat([derivedKey.slice(16, 32), cipherText]))
                    .replace('0x', '');
                if (mac !== keystore.crypto.mac) {
                    throw new Error('Key derivation failed - possibly wrong password');
                }
                var /** @type {?} */ decipher = cryptoBrowserify.createDecipheriv(cipher, derivedKey.slice(0, 16), iv);
                var /** @type {?} */ seed = Buffer.concat([decipher.update(cipherText), decipher.final()]);
                return this.fromPrivate(seed);
            };
        Accounts.decorators = [
            { type: i0.Injectable, args: [{ providedIn: WalletModule },] },
        ];
        /** @nocollapse */
        Accounts.ctorParameters = function () { return []; };
        /** @nocollapse */ Accounts.ngInjectableDef = i0.defineInjectable({ factory: function Accounts_Factory() { return new Accounts(); }, token: Accounts, providedIn: WalletModule });
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
    var Wallet = (function () {
        function Wallet(provider, signer, accounts) {
            this.provider = provider;
            this.signer = signer;
            this.accounts = accounts;
            this.localKeystore = new rxjs.BehaviorSubject(null);
            this.currentAccount = new rxjs.BehaviorSubject(null);
            this.keystores$ = this.localKeystore.asObservable();
            this.account$ = this.currentAccount.asObservable();
            this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
        }
        Object.defineProperty(Wallet.prototype, "defaultAccount", {
            /** Get the default account */
            get: /**
             * Get the default account
             * @return {?}
             */ function () {
                return this.currentAccount.getValue();
            },
            /** Set the default account */
            set: /**
             * Set the default account
             * @param {?} account
             * @return {?}
             */ function (account) {
                this.currentAccount.next(utils.toChecksumAddress(account));
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
                    return utils.checkAddressChecksum(key)
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
                var /** @type {?} */ checkSum = utils.toChecksumAddress(address);
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
                return this.keystores$.pipe(operators.map(function (keyMap) { return Object.keys(keyMap); }));
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
                return this.keystores$.pipe(operators.map(function (keystores) { return keystores[address]; }), operators.map(function (keystore) { return _this.decrypt(keystore, password); }), operators.map(function (ethAccount) { return _this.signMessage(message, ethAccount.privateKey); }));
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
            { type: i0.Injectable, args: [{ providedIn: i1.ProvidersModule },] },
        ];
        /** @nocollapse */
        Wallet.ctorParameters = function () {
            return [
                { type: i1.MainProvider, },
                { type: Signer, },
                { type: Accounts, },
            ];
        };
        /** @nocollapse */ Wallet.ngInjectableDef = i0.defineInjectable({ factory: function Wallet_Factory() { return new Wallet(i0.inject(i1.MainProvider), i0.inject(Signer), i0.inject(Accounts)); }, token: Wallet, providedIn: i1.ProvidersModule });
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

    exports.WalletModule = WalletModule;
    exports.RLP = RLP;
    exports.Signer = Signer;
    exports.Wallet = Wallet;
    exports.ɵc = Accounts;
    exports.ɵb = RLP;
    exports.ɵa = Signer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtd2FsbGV0LnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQG5nZXRoL3dhbGxldC9saWIvd2FsbGV0Lm1vZHVsZS50cyIsIm5nOi8vQG5nZXRoL3dhbGxldC9saWIvc2lnbmF0dXJlL3JscC50cyIsbnVsbCwibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi9zaWduYXR1cmUvc2lnbmVyLnRzIiwibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi9hY2NvdW50L2VuY3J5cHRpb24udHMiLCJuZzovL0BuZ2V0aC93YWxsZXQvbGliL2FjY291bnQvYWNjb3VudC50cyIsIm5nOi8vQG5nZXRoL3dhbGxldC9saWIvd2FsbGV0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5ATmdNb2R1bGUoKVxuZXhwb3J0IGNsYXNzIFdhbGxldE1vZHVsZSB7fVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLi93YWxsZXQubW9kdWxlJztcclxuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XHJcblxyXG4vKipcclxuICogUkxQIEVuY29kaW5nIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2lraS93aWtpLyU1QkVuZ2xpc2glNUQtUkxQXHJcbiAqIFRoaXMgcHJpdmF0ZSB0YWtlcyBpbiBhIGRhdGEsIGNvbnZlcnQgaXQgdG8gYnVmZmVyIGlmIG5vdCwgYW5kIGEgbGVuZ3RoIGZvciByZWN1cnNpb25cclxuICpcclxuICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICogQHJldHVybnMgIC0gcmV0dXJucyBidWZmZXIgb2YgZW5jb2RlZCBkYXRhXHJcbiAqKi9cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBXYWxsZXRNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIFJMUCB7XHJcbiAgcHVibGljIGVuY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nIHwgbnVtYmVyIHwgQXJyYXk8YW55Pikge1xyXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgY29uc3Qgb3V0cHV0ID0gW11cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG91dHB1dC5wdXNoKHRoaXMuZW5jb2RlKGlucHV0W2ldKSlcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBidWYgPSBCdWZmZXIuY29uY2F0KG91dHB1dClcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGJ1Zi5sZW5ndGgsIDE5MiksIGJ1Zl0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbnB1dCA9IHRoaXMudG9CdWZmZXIoaW5wdXQpO1xyXG4gICAgICBpZiAoaW5wdXQubGVuZ3RoID09PSAxICYmIGlucHV0WzBdIDwgMTI4KSB7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGlucHV0Lmxlbmd0aCwgMTI4KSwgaW5wdXRdKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNhZmVQYXJzZUludCAodiwgYmFzZSkge1xyXG4gICAgaWYgKHYuc2xpY2UoMCwgMikgPT09ICcwMCcpIHtcclxuICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFA6IGV4dHJhIHplcm9zJykpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyc2VJbnQodiwgYmFzZSlcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW5jb2RlTGVuZ3RoIChsZW4sIG9mZnNldCkge1xyXG4gICAgaWYgKGxlbiA8IDU2KSB7XHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShbbGVuICsgb2Zmc2V0XSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGhleExlbmd0aCA9IHRoaXMuaW50VG9IZXgobGVuKVxyXG4gICAgICBjb25zdCBsTGVuZ3RoID0gaGV4TGVuZ3RoLmxlbmd0aCAvIDJcclxuICAgICAgY29uc3QgZmlyc3RCeXRlID0gdGhpcy5pbnRUb0hleChvZmZzZXQgKyA1NSArIGxMZW5ndGgpXHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShmaXJzdEJ5dGUgKyBoZXhMZW5ndGgsICdoZXgnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUkxQIERlY29kaW5nIGJhc2VkIG9uOiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dpa2kvd2lraS9STFB9XHJcbiAgICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICAgKiBAcmV0dXJucyAtIHJldHVybnMgZGVjb2RlIEFycmF5IG9mIEJ1ZmZlcnMgY29udGFpbmcgdGhlIG9yaWdpbmFsIG1lc3NhZ2VcclxuICAgKiovXHJcbiAgcHVibGljIGRlY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nLCBzdHJlYW0/OiBib29sZWFuKTogQnVmZmVyIHwgQXJyYXk8YW55PiB7XHJcbiAgICBpZiAoIWlucHV0IHx8IGlucHV0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gQnVmZmVyLmZyb20oW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dCk7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy5fZGVjb2RlKGlucHV0KTtcclxuXHJcbiAgICBpZiAoc3RyZWFtKSB7XHJcbiAgICAgIHJldHVybiBkZWNvZGVkIGFzIGFueTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NlcnQuZXF1YWwoZGVjb2RlZC5yZW1haW5kZXIubGVuZ3RoLCAwLCAnaW52YWxpZCByZW1haW5kZXInKTtcclxuICAgIHJldHVybiBkZWNvZGVkLmRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0TGVuZ3RoKGlucHV0OiBzdHJpbmcgfCBCdWZmZXIpOiBudW1iZXIgfCBCdWZmZXIge1xyXG4gICAgaWYgKCFpbnB1dCB8fCBpbnB1dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dClcclxuICAgIGNvbnN0IGZpcnN0Qnl0ZSA9IGlucHV0WzBdXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgcmV0dXJuIGlucHV0Lmxlbmd0aFxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiNykge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHg3ZlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIHJldHVybiBmaXJzdEJ5dGUgLSAweGJmXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBhIGxpc3QgIG92ZXIgNTUgYnl0ZXMgbG9uZ1xyXG4gICAgICBjb25zdCBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhmNlxyXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICByZXR1cm4gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZGVjb2RlIChpbnB1dDogQnVmZmVyKSB7XHJcbiAgICBsZXQgbGVuZ3RoLCBsbGVuZ3RoLCBkYXRhLCBpbm5lclJlbWFpbmRlciwgZDtcclxuICAgIGNvbnN0IGRlY29kZWQgPSBbXVxyXG4gICAgY29uc3QgZmlyc3RCeXRlID0gaW5wdXRbMF1cclxuXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgLy8gYSBzaW5nbGUgYnl0ZSB3aG9zZSB2YWx1ZSBpcyBpbiB0aGUgWzB4MDAsIDB4N2ZdIHJhbmdlLCB0aGF0IGJ5dGUgaXMgaXRzIG93biBSTFAgZW5jb2RpbmcuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogaW5wdXQuc2xpY2UoMCwgMSksXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZSgxKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGZpcnN0Qnl0ZSA8PSAweGI3KSB7XHJcbiAgICAgIC8vIHN0cmluZyBpcyAwLTU1IGJ5dGVzIGxvbmcuIEEgc2luZ2xlIGJ5dGUgd2l0aCB2YWx1ZSAweDgwIHBsdXMgdGhlIGxlbmd0aCBvZiB0aGUgc3RyaW5nIGZvbGxvd2VkIGJ5IHRoZSBzdHJpbmdcclxuICAgICAgLy8gVGhlIHJhbmdlIG9mIHRoZSBmaXJzdCBieXRlIGlzIFsweDgwLCAweGI3XVxyXG4gICAgICBsZW5ndGggPSBmaXJzdEJ5dGUgLSAweDdmXHJcblxyXG4gICAgICAvLyBzZXQgMHg4MCBudWxsIHRvIDBcclxuICAgICAgaWYgKGZpcnN0Qnl0ZSA9PT0gMHg4MCkge1xyXG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhID0gaW5wdXQuc2xpY2UoMSwgbGVuZ3RoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobGVuZ3RoID09PSAyICYmIGRhdGFbMF0gPCAweDgwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCBlbmNvZGluZzogYnl0ZSBtdXN0IGJlIGxlc3MgMHg4MCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgICBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICBkYXRhID0gaW5wdXQuc2xpY2UobGxlbmd0aCwgbGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgaWYgKGRhdGEubGVuZ3RoIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFAnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHJlbWFpbmRlcjogaW5wdXQuc2xpY2UobGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIGxlbmd0aCA9IGZpcnN0Qnl0ZSAtIDB4YmZcclxuICAgICAgaW5uZXJSZW1haW5kZXIgPSBpbnB1dC5zbGljZSgxLCBsZW5ndGgpXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhdGE6IGRlY29kZWQsXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZShsZW5ndGgpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGEgbGlzdCAgb3ZlciA1NSBieXRlcyBsb25nXHJcbiAgICAgIGxsZW5ndGggPSBmaXJzdEJ5dGUgLSAweGY2XHJcbiAgICAgIGxlbmd0aCA9IHRoaXMuc2FmZVBhcnNlSW50KGlucHV0LnNsaWNlKDEsIGxsZW5ndGgpLnRvU3RyaW5nKCdoZXgnKSwgMTYpXHJcbiAgICAgIGNvbnN0IHRvdGFsTGVuZ3RoID0gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgICBpZiAodG90YWxMZW5ndGggPiBpbnB1dC5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcmxwOiB0b3RhbCBsZW5ndGggaXMgbGFyZ2VyIHRoYW4gdGhlIGRhdGEnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpbm5lclJlbWFpbmRlciA9IGlucHV0LnNsaWNlKGxsZW5ndGgsIHRvdGFsTGVuZ3RoKVxyXG4gICAgICBpZiAoaW5uZXJSZW1haW5kZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCwgTGlzdCBoYXMgYSBpbnZhbGlkIGxlbmd0aCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGVjb2RlZCxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKHRvdGFsTGVuZ3RoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogSEVMUEVSUyA6IFRPIFJFTU9WRVxyXG4gICAqL1xyXG5cclxuICBwcml2YXRlIGlzSGV4UHJlZml4ZWQoc3RyKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnXHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmVzIDB4IGZyb20gYSBnaXZlbiBTdHJpbmdcclxuICBwcml2YXRlIHN0cmlwSGV4UHJlZml4KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gc3RyXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5pc0hleFByZWZpeGVkKHN0cikgPyBzdHIuc2xpY2UoMikgOiBzdHJcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW50VG9IZXgoaTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGxldCBoZXggPSBpLnRvU3RyaW5nKDE2KVxyXG4gICAgaWYgKGhleC5sZW5ndGggJSAyKSB7XHJcbiAgICAgIGhleCA9ICcwJyArIGhleFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhleFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYWRUb0V2ZW4oYTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmIChhLmxlbmd0aCAlIDIpIGEgPSAnMCcgKyBhXHJcbiAgICByZXR1cm4gYVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnRUb0J1ZmZlcihpOiBudW1iZXIpOiBCdWZmZXIge1xyXG4gICAgY29uc3QgaGV4ID0gdGhpcy5pbnRUb0hleChpKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGhleCwgJ2hleCcpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvQnVmZmVyKHY6IGFueSk6IEJ1ZmZlciB7XHJcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih2KSkge1xyXG4gICAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNIZXhQcmVmaXhlZCh2KSkge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHRoaXMucGFkVG9FdmVuKHRoaXMuc3RyaXBIZXhQcmVmaXgodikpLCAnaGV4JylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGlmICghdikge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2ID0gdGhpcy5pbnRUb0J1ZmZlcih2KVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHYgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIGlmICh2LnRvQXJyYXkpIHtcclxuICAgICAgICAvLyBjb252ZXJ0cyBhIEJOIHRvIGEgQnVmZmVyXHJcbiAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYudG9BcnJheSgpKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0eXBlJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0geVtvcFswXSAmIDIgPyBcInJldHVyblwiIDogb3BbMF0gPyBcInRocm93XCIgOiBcIm5leHRcIl0pICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gWzAsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7ICB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAob1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFR4T2JqZWN0LCBrZWNjYWsyNTYsIGlzSGV4U3RyaWN0LCBoZXhUb0J5dGVzIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgV2FsbGV0TW9kdWxlIH0gZnJvbSAnLi8uLi93YWxsZXQubW9kdWxlJztcclxuaW1wb3J0IHsgUkxQIH0gZnJvbSAnLi9ybHAnO1xyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tICdidWZmZXInO1xyXG5pbXBvcnQgeyBzaWduIH0gZnJvbSAnc2VjcDI1NmsxJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IFdhbGxldE1vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmVyIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBybHA6IFJMUCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIHJhdyB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBzaWduIHRoZSB0cmFuc2FjdGlvbiB3aXRoXHJcbiAgICogQHBhcmFtIHR4IFRoZSB0cmFuc2FjdGlvbiB0byBzaWduXHJcbiAgICogQHBhcmFtIGNoYWluSWQgVGhlIGlkIG9mIHRoZSBjaGFpblxyXG4gICAqL1xyXG4gIHB1YmxpYyBzaWduVHgocHJpdmF0ZUtleTogc3RyaW5nLCB0eDogVHhPYmplY3QsIGNoYWluSWQ/OiBudW1iZXIpIHtcclxuICAgIC8vIEZvcm1hdCBUWFxyXG4gICAgY29uc3QgcmF3VHggPSB0aGlzLnJhd1R4KHR4KTtcclxuICAgIGNvbnN0IHJhd0NoYWluID0gWyAnMHgnICsgKGNoYWluSWQgfHwgMSkudG9TdHJpbmcoMTYpLCAnMHgnLCAnMHgnIF07XHJcblxyXG4gICAgLy8gUkxQIGVuY29kZSB3aXRoIGNoYWluSWQgKEVJUDE1NTogcHJldmVudCByZXBsYXkgYXR0YWNrKVxyXG4gICAgY29uc3QgcmxwRW5jb2RlZCA9IHRoaXMucmxwLmVuY29kZShbLi4ucmF3VHgsIC4uLnJhd0NoYWluXSk7XHJcblxyXG4gICAgLy8gSGFzaFxyXG4gICAgY29uc3QgbWVzc2FnZUhhc2ggPSBrZWNjYWsyNTYocmxwRW5jb2RlZCk7XHJcblxyXG4gICAgLy8gU2lnblxyXG4gICAgY29uc3QgeyByLCBzLCB2IH0gPSB0aGlzLnNpZ24ocHJpdmF0ZUtleSwgbWVzc2FnZUhhc2gsIGNoYWluSWQpO1xyXG5cclxuICAgIC8vIFJMUCBFbmNvZGUgd2l0aCBzaWduYXR1cmVcclxuICAgIGNvbnN0IHJscFR4ID0gdGhpcy5ybHAuZW5jb2RlKFsuLi5yYXdUeCwgLi4uW3YsIHIsIHNdXSk7XHJcbiAgICBjb25zdCByYXdUcmFuc2FjdGlvbiA9ICcweCcgKyAgcmxwVHgudG9TdHJpbmcoJ2hleCcpO1xyXG5cclxuICAgIHJldHVybiB7IG1lc3NhZ2VIYXNoLCByLCBzLCB2LCByYXdUcmFuc2FjdGlvbiB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVjb3ZlciBhIHRyYW5zYWN0aW9uIGJhc2VkIG9uIGl0cyByYXcgdmFsdWVcclxuICAgKiBAcGFyYW0gcmF3VHggVGhlIHJhdyB0cmFuc2FjdGlvbiBmb3JtYXRcclxuICAgKi9cclxuICBwdWJsaWMgcmVjb3ZlclR4KHJhd1R4OiBzdHJpbmcpIHtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGb3JtYXQgdGhlIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHR4IFRoZSBUcmFuc2FjdGlvbiB0byBlbmNvZGVcclxuICAgKi9cclxuICBwcml2YXRlIHJhd1R4KHR4OiBUeE9iamVjdCk6IGFueVtdIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICcweCcgKyAodHgubm9uY2UgfHwgJycpLFxyXG4gICAgICAnMHgnICsgKHR4Lmdhc1ByaWNlIHx8ICcnKSxcclxuICAgICAgJzB4JyArICh0eC5nYXMgfHwgJycpLFxyXG4gICAgICAnMHgnICsgdHgudG8udG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcweCcsICcnKSB8fCAnJyxcclxuICAgICAgJzB4JyArICh0eC52YWx1ZSB8fCAnJyksXHJcbiAgICAgICcweCcgKyAodHguZGF0YSB8fCAnJylcclxuICAgIF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgaGFzaFxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSBuZWVkZWQgdG8gc2lnbiB0aGUgaGFzaFxyXG4gICAqIEBwYXJhbSBoYXNoIFRoZSBoYXNoIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gY2hhaW5JZCBUaGUgSWQgb2YgdGhlIGNoYWluXHJcbiAgICAqL1xyXG4gIHB1YmxpYyBzaWduKHByaXZhdGVLZXk6IHN0cmluZywgaGFzaDogc3RyaW5nLCBjaGFpbklkPzogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBwcml2S2V5ID0gQnVmZmVyLmZyb20ocHJpdmF0ZUtleS5yZXBsYWNlKCcweCcsICcnKSwgJ2hleCcpO1xyXG4gICAgY29uc3QgZGF0YSA9IEJ1ZmZlci5mcm9tKGhhc2gucmVwbGFjZSgnMHgnLCAnJyksICdoZXgnKTtcclxuICAgIGNvbnN0IGFkZFRvViA9IChjaGFpbklkICYmIGNoYWluSWQgPiAwKSA/IGNoYWluSWQgKiAyICsgOCA6IDA7XHJcbiAgICBjb25zdCB7IHNpZ25hdHVyZSwgcmVjb3ZlcnkgfSA9IHNpZ24oZGF0YSwgcHJpdktleSk7XHJcbiAgICBjb25zdCByID0gc2lnbmF0dXJlLnRvU3RyaW5nKCdoZXgnLCAwLCAzMik7XHJcbiAgICBjb25zdCBzID0gc2lnbmF0dXJlLnRvU3RyaW5nKCdoZXgnLCAzMiwgNjQpO1xyXG4gICAgY29uc3QgdiA9IChyZWNvdmVyeSArIDI3ICsgYWRkVG9WKS50b1N0cmluZygxNik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByOiAnMHgnK3IsXHJcbiAgICAgIHM6ICcweCcrcyxcclxuICAgICAgdjogJzB4Jyt2LFxyXG4gICAgICBzaWduYXR1cmU6IGAweCR7cn0ke3N9JHt2fWBcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYXNoIGEgbWVzc2FnZSB3aXRoIHRoZSBwcmVhbWJsZSBcIlxceDE5RXRoZXJldW0gU2lnbmVkIE1lc3NhZ2U6XFxuXCJcclxuICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBzaWduXHJcbiAgICovXHJcbiAgcHVibGljIGhhc2hNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBtc2cgPSBpc0hleFN0cmljdChtZXNzYWdlKSA/IG1lc3NhZ2UgOiBoZXhUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgY29uc3QgbXNnQnVmZmVyID0gQnVmZmVyLmZyb20obXNnIGFzIHN0cmluZyk7XHJcbiAgICBjb25zdCBwcmVhbWJsZSA9ICdcXHgxOUV0aGVyZXVtIFNpZ25lZCBNZXNzYWdlOlxcbicgKyBtc2cubGVuZ3RoO1xyXG4gICAgY29uc3QgcHJlYW1ibGVCdWZmZXIgPSBCdWZmZXIuZnJvbShwcmVhbWJsZSk7XHJcbiAgICBjb25zdCBldGhNc2cgPSBCdWZmZXIuY29uY2F0KFtwcmVhbWJsZUJ1ZmZlciwgbXNnQnVmZmVyXSk7XHJcbiAgICByZXR1cm4ga2VjY2FrMjU2KGV0aE1zZyk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvLWJyb3dzZXJpZnknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVuY3J5cHRPcHRpb25zIHtcclxuICBwdWJsaWMgc2FsdDogQnVmZmVyIHwgc3RyaW5nID0gcmFuZG9tQnl0ZXMoMzIpO1xyXG4gIHB1YmxpYyBpdjogQnVmZmVyID0gcmFuZG9tQnl0ZXMoMTYpO1xyXG4gIHB1YmxpYyBrZGY6ICdwYmtkZjInIHwgJ3NjcnlwdCcgPSAnc2NyeXB0JztcclxuICBwdWJsaWMgYyA9IDI2MjE0NDtcclxuICBwdWJsaWMgcHJmOiAnaG1hYy1zaGEyNTYnO1xyXG4gIHB1YmxpYyBka2xlbiA9IDMyO1xyXG4gIHB1YmxpYyBuOiAyMDQ4IHwgNDA5NiB8IDgxOTIgfCAxNjM4NCA9IDgxOTI7XHJcbiAgcHVibGljIHIgPSA4O1xyXG4gIHB1YmxpYyBwID0gMTtcclxuICBwdWJsaWMgY2lwaGVyOiAnYWVzLTEyOC1jdHInIHwgc3RyaW5nID0gJ2Flcy0xMjgtY3RyJztcclxuICBwdWJsaWMgdXVpZDogQnVmZmVyID0gcmFuZG9tQnl0ZXMoMTYpO1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBQYXJ0aWFsPEVuY3J5cHRPcHRpb25zPikge1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xyXG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBUcmFuc2Zvcm0gc2FsdCB0byBiZSBhIEJ1ZmZlclxyXG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuc2FsdCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5zYWx0ID0gQnVmZmVyLmZyb20ob3B0aW9ucy5zYWx0LnJlcGxhY2UoJzB4JywgJycpLCAnaGV4JylcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2V5c3RvcmUge1xyXG4gIHZlcnNpb246IDM7XHJcbiAgaWQ6IHN0cmluZztcclxuICBhZGRyZXNzOiBzdHJpbmc7XHJcbiAgY3J5cHRvOiB7XHJcbiAgICBjaXBoZXJ0ZXh0OiBzdHJpbmc7XHJcbiAgICBjaXBoZXJwYXJhbXM6IHtcclxuICAgICAgICBpdjogc3RyaW5nO1xyXG4gICAgfSxcclxuICAgIGNpcGhlcjogc3RyaW5nO1xyXG4gICAga2RmOiBzdHJpbmc7XHJcbiAgICBrZGZwYXJhbXM6IHtcclxuICAgICAgZGtsZW46IG51bWJlcjtcclxuICAgICAgc2FsdDogc3RyaW5nO1xyXG4gICAgICAvLyBGb3Igc2NyeXB0IGVuY3J5cHRpb25cclxuICAgICAgbj86IG51bWJlcjtcclxuICAgICAgcD86IG51bWJlcjtcclxuICAgICAgcj86IG51bWJlcjtcclxuICAgICAgLy8gRm9yIHBia2RmMiBlbmNyeXB0aW9uXHJcbiAgICAgIGM/OiBudW1iZXI7XHJcbiAgICAgIHByZj86ICdobWFjLXNoYTI1Nic7XHJcbiAgICB9O1xyXG4gICAgbWFjOiBzdHJpbmc7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBSZXNzb3VyY2VzXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ldGhlcmV1bS93aWtpL3dpa2kvV2ViMy1TZWNyZXQtU3RvcmFnZS1EZWZpbml0aW9uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLy4uL3dhbGxldC5tb2R1bGUnO1xyXG5cclxuaW1wb3J0IHsgdjQgfSBmcm9tICd1dWlkJztcclxuaW1wb3J0IHsgdG9DaGVja3N1bUFkZHJlc3MsIGtlY2NhazI1NiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IHByaXZhdGVLZXlWZXJpZnksIHB1YmxpY0tleUNyZWF0ZSB9IGZyb20gJ3NlY3AyNTZrMSc7XHJcbmltcG9ydCB7IHJhbmRvbUJ5dGVzLCBwYmtkZjJTeW5jLCBjcmVhdGVDaXBoZXJpdiwgY3JlYXRlRGVjaXBoZXJpdiB9IGZyb20gJ2NyeXB0by1icm93c2VyaWZ5JztcclxuaW1wb3J0IHsgRW5jcnlwdE9wdGlvbnMsIEtleXN0b3JlIH0gZnJvbSAnLi9lbmNyeXB0aW9uJztcclxuaW1wb3J0IHNjcnlwdHN5IGZyb20gJ3NjcnlwdC5qcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV0aEFjY291bnQge1xyXG4gIHByaXZhdGVLZXk6IHN0cmluZztcclxuICBhZGRyZXNzOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogV2FsbGV0TW9kdWxlfSlcclxuZXhwb3J0IGNsYXNzIEFjY291bnRzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYW4gRXRoZXJldW0ga2V5cGFpclxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGUoKTogRXRoQWNjb3VudCB7XHJcbiAgICBsZXQgcHJpdktleTogQnVmZmVyO1xyXG4gICAgZG8geyBwcml2S2V5ID0gcmFuZG9tQnl0ZXMoMzIpOyB9XHJcbiAgICB3aGlsZSAoIXByaXZhdGVLZXlWZXJpZnkocHJpdktleSkpO1xyXG4gICAgcmV0dXJuIHRoaXMuZnJvbVByaXZhdGUocHJpdktleSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYW4gYWNjb3VudCBmcm9tIGEgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgd2l0aG91dCB0aGUgcHJlZml4ICcweCdcclxuICAgKi9cclxuICBwdWJsaWMgZnJvbVByaXZhdGUocHJpdmF0ZUtleTogc3RyaW5nIHwgQnVmZmVyKTogRXRoQWNjb3VudCB7XHJcbiAgICBpZiAodHlwZW9mIHByaXZhdGVLZXkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHByaXZhdGVLZXkgPSBCdWZmZXIuZnJvbShbcHJpdmF0ZUtleS5yZXBsYWNlKCcweCcsICcnKV0pO1xyXG4gICAgfVxyXG4gICAgLy8gU2xpY2UoMSkgaXMgdG8gZHJvcCB0eXBlIGJ5dGUgd2hpY2ggaXMgaGFyZGNvZGVkIGFzIDA0IGV0aGVyZXVtLlxyXG4gICAgY29uc3QgcHViS2V5ID0gcHVibGljS2V5Q3JlYXRlKHByaXZhdGVLZXksIGZhbHNlKS5zbGljZSgxKTtcclxuICAgIGNvbnN0IGFkZHJlc3MgPSAnMHgnICsga2VjY2FrMjU2KHB1YktleSkuc3Vic3RyaW5nKDI2KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHByaXZhdGVLZXk6ICcweCcgKyBwcml2YXRlS2V5LnRvU3RyaW5nKCdoZXgnKSxcclxuICAgICAgYWRkcmVzczogdG9DaGVja3N1bUFkZHJlc3MoYWRkcmVzcylcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNyeXB0IGFuIHByaXZhdGUga2V5IGludG8gYSBrZXlzdG9yZVxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBlbmNyeXB0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBlbmNyeXB0IHRoZSBwcml2YXRlIGtleSB3aXRoXHJcbiAgICogQHBhcmFtIGVuY3J5cHRPcHRpb25zIEEgbGlzdCBvZiBvcHRpb25zIHRvIGVuY3J5cHQgdGhlIHByaXZhdGUga2V5XHJcbiAgICogQ29kZSBmcm9tIDogaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dlYjMuanMvYmxvYi8xLjAvcGFja2FnZXMvd2ViMy1ldGgtYWNjb3VudHMvc3JjL2luZGV4LmpzXHJcbiAgICovXHJcbiAgcHVibGljIGVuY3J5cHQoXHJcbiAgICBwcml2YXRlS2V5OiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgZW5jcnlwdE9wdGlvbnM/OiBQYXJ0aWFsPEVuY3J5cHRPcHRpb25zPik6IEtleXN0b3JlXHJcbiAge1xyXG4gICAgY29uc3QgcHdkID0gQnVmZmVyLmZyb20ocGFzc3dvcmQpO1xyXG4gICAgY29uc3QgcHJpdktleSA9IEJ1ZmZlci5mcm9tKHByaXZhdGVLZXkucmVwbGFjZSgnMHgnLCAnJyksICdoZXgnKTtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBuZXcgRW5jcnlwdE9wdGlvbnMoZW5jcnlwdE9wdGlvbnMpO1xyXG4gICAgY29uc3QgeyBzYWx0LCBpdiwga2RmLCBjLCBuLCByLCBwLCBka2xlbiwgY2lwaGVyLCB1dWlkIH0gPSBvcHRpb25zO1xyXG4gICAgY29uc3Qga2RmUGFyYW1zOiBLZXlzdG9yZVsnY3J5cHRvJ11bJ2tkZnBhcmFtcyddID0ge1xyXG4gICAgICBka2xlbjogZGtsZW4sXHJcbiAgICAgIHNhbHQ6IChzYWx0IGFzIEJ1ZmZlcikudG9TdHJpbmcoJ2hleCcpXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBkZXJpdmVkS2V5O1xyXG4gICAgaWYgKGtkZiA9PT0gJ3Bia2RmMicpIHtcclxuICAgICAga2RmUGFyYW1zLmMgPSBjO1xyXG4gICAgICBrZGZQYXJhbXMucHJmID0gJ2htYWMtc2hhMjU2JztcclxuICAgICAgZGVyaXZlZEtleSA9IHBia2RmMlN5bmMocHdkLCBzYWx0LCBjLCBka2xlbiwgJ3NoYTI1NicpO1xyXG4gICAgfSBlbHNlIGlmIChrZGYgPT09ICdzY3J5cHQnKSB7XHJcbiAgICAgIGtkZlBhcmFtcy5uID0gbjtcclxuICAgICAga2RmUGFyYW1zLnIgPSByO1xyXG4gICAgICBrZGZQYXJhbXMucCA9IHA7XHJcbiAgICAgIGRlcml2ZWRLZXkgPSBzY3J5cHRzeShwd2QsIHNhbHQsIG4sIHIsIHAsIGRrbGVuKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgS2V5IERlcml2YXRpb24gRnVuY3Rpb24nICsga2RmKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXBoZXJBbGcgPSBjcmVhdGVDaXBoZXJpdihjaXBoZXIsIGRlcml2ZWRLZXkuc2xpY2UoMCwgMTYpLCBpdik7XHJcbiAgICBpZiAoIWNpcGhlckFsZykgeyB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGNpcGhlciAnICsgY2lwaGVyKX1cclxuICAgIGNvbnN0IGNpcGhlclRleHQgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXJBbGcudXBkYXRlKHByaXZLZXkpLCBjaXBoZXJBbGcuZmluYWwoKV0pO1xyXG4gICAgY29uc3QgdG9NYWMgPSBCdWZmZXIuY29uY2F0KFtkZXJpdmVkS2V5LnNsaWNlKDE2LCAzMiksIGNpcGhlclRleHRdKTtcclxuICAgIGNvbnN0IG1hYyA9IGtlY2NhazI1Nih0b01hYykucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2ZXJzaW9uOiAzLFxyXG4gICAgICBpZDogdjQoeyByYW5kb206IHV1aWQgYXMgYW55IH0pLFxyXG4gICAgICBhZGRyZXNzOiB0aGlzLmZyb21Qcml2YXRlKHByaXZLZXkpLmFkZHJlc3MudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcweCcsICcnKSxcclxuICAgICAgY3J5cHRvOiB7XHJcbiAgICAgICAgY2lwaGVydGV4dDogY2lwaGVyVGV4dC50b1N0cmluZygnaGV4JyksXHJcbiAgICAgICAgY2lwaGVycGFyYW1zOiB7XHJcbiAgICAgICAgICAgIGl2OiBpdi50b1N0cmluZygnaGV4JylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNpcGhlcjogb3B0aW9ucy5jaXBoZXIsXHJcbiAgICAgICAga2RmOiBrZGYsXHJcbiAgICAgICAga2RmcGFyYW1zOiBrZGZQYXJhbXMsXHJcbiAgICAgICAgbWFjOiBtYWNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjcnlwdCBhIGtleXN0b3JlIG9iamVjdFxyXG4gICAqIEBwYXJhbSBrZXlzdG9yZSBUaGUga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBkZWNyeXB0IHRoZSBrZXlzdG9yZSB3aXRoXHJcbiAgICogQ29kZSBmcm9tIDogaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtanMvZXRoZXJldW1qcy13YWxsZXQvYmxvYi9tYXN0ZXIvaW5kZXguanNcclxuICAgKi9cclxuICBwdWJsaWMgZGVjcnlwdChrZXlzdG9yZTogS2V5c3RvcmUsIHBhc3N3b3JkOiBzdHJpbmcpOiBFdGhBY2NvdW50IHtcclxuICAgIGlmICh0eXBlb2YgcGFzc3dvcmQgIT09ICdzdHJpbmcnKSB7IHRocm93IG5ldyBFcnJvcignTm8gcGFzc3dvcmQgcHJvdmlkZWQnKTsgfVxyXG4gICAgaWYgKHR5cGVvZiBrZXlzdG9yZSAhPT0gJ29iamVjdCcpIHsgdGhyb3cgbmV3IEVycm9yKCdrZXlzdG9yZSBzaG91bGQgYmUgYW4gb2JqZWN0Jyk7IH1cclxuICAgIGlmIChrZXlzdG9yZS52ZXJzaW9uICE9PSAzKSB7IHRocm93IG5ldyBFcnJvcignTm90IGEgVjMgd2FsbGV0Jyk7IH1cclxuXHJcbiAgICBsZXQgZGVyaXZlZEtleTtcclxuICAgIGNvbnN0IHsga2RmLCBrZGZwYXJhbXMsIGNpcGhlcnBhcmFtcywgY2lwaGVyIH0gPSBrZXlzdG9yZS5jcnlwdG87XHJcbiAgICBjb25zdCBwd2QgPSBCdWZmZXIuZnJvbShwYXNzd29yZCwgJ3V0ZjgnKTtcclxuICAgIGNvbnN0IHNhbHQgPSBCdWZmZXIuZnJvbShrZGZwYXJhbXMuc2FsdCwgJ2hleCcpO1xyXG4gICAgY29uc3QgaXYgPSBCdWZmZXIuZnJvbShjaXBoZXJwYXJhbXMuaXYsICdoZXgnKTtcclxuICAgIC8vIFNjcnlwdCBlbmNyeXB0aW9uXHJcbiAgICBpZiAoa2RmID09PSAnc2NyeXB0Jykge1xyXG4gICAgICBjb25zdCB7IG4sIHIsIHAsIGRrbGVuIH0gPSBrZGZwYXJhbXM7XHJcbiAgICAgIGRlcml2ZWRLZXkgPSBzY3J5cHRzeShwd2QsIHNhbHQsIG4sIHIsIHAsIGRrbGVuKVxyXG4gICAgfVxyXG4gICAgLy8gcGJrZGYyIGVuY3J5cHRpb25cclxuICAgIGVsc2UgaWYgKGtkZiA9PT0gJ3Bia2RmMicpIHtcclxuICAgICAgaWYgKGtkZnBhcmFtcy5wcmYgIT09ICdobWFjLXNoYTI1NicpIHsgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBwYXJhbWV0ZXJzIHRvIFBCS0RGMicpOyB9XHJcbiAgICAgIGNvbnN0IHsgYywgZGtsZW4gfSA9IGtkZnBhcmFtcztcclxuICAgICAgZGVyaXZlZEtleSA9IHBia2RmMlN5bmMocHdkLCBzYWx0LCBjLCBka2xlbiwgJ3NoYTI1NicpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGtleSBkZXJpdmF0aW9uIHNjaGVtZScpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2lwaGVyVGV4dCA9IEJ1ZmZlci5mcm9tKGtleXN0b3JlLmNyeXB0by5jaXBoZXJ0ZXh0LCAnaGV4Jyk7XHJcbiAgICBjb25zdCBtYWMgPSBrZWNjYWsyNTYoQnVmZmVyLmNvbmNhdChbIGRlcml2ZWRLZXkuc2xpY2UoMTYsIDMyKSwgY2lwaGVyVGV4dCBdKSlcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJzB4JywgJycpO1xyXG5cclxuICAgIGlmIChtYWMgIT09IGtleXN0b3JlLmNyeXB0by5tYWMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXkgZGVyaXZhdGlvbiBmYWlsZWQgLSBwb3NzaWJseSB3cm9uZyBwYXNzd29yZCcpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlcml2KGNpcGhlciwgZGVyaXZlZEtleS5zbGljZSgwLCAxNiksIGl2KTtcclxuICAgIGNvbnN0IHNlZWQgPSBCdWZmZXIuY29uY2F0KFsgZGVjaXBoZXIudXBkYXRlKGNpcGhlclRleHQpLCBkZWNpcGhlci5maW5hbCgpIF0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZyb21Qcml2YXRlKHNlZWQpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSwgTWFpblByb3ZpZGVyLCBBdXRoIH0gZnJvbSAnQG5nZXRoL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgVHhPYmplY3QsIHRvQ2hlY2tzdW1BZGRyZXNzLCBjaGVja0FkZHJlc3NDaGVja3N1bSB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcblxyXG5pbXBvcnQgeyBBY2NvdW50cywgRW5jcnlwdE9wdGlvbnMsIEtleXN0b3JlLCBFdGhBY2NvdW50IH0gZnJvbSAnLi9hY2NvdW50JztcclxuaW1wb3J0IHsgU2lnbmVyIH0gZnJvbSAnLi9zaWduYXR1cmUvc2lnbmVyJztcclxuXHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEtleXN0b3JlTWFwIHtcclxuICBbYWRkcmVzczogc3RyaW5nXTogS2V5c3RvcmU7XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogUHJvdmlkZXJzTW9kdWxlfSlcclxuZXhwb3J0IGNsYXNzIFdhbGxldCBpbXBsZW1lbnRzIEF1dGgge1xyXG4gIHByaXZhdGUgbG9jYWxLZXlzdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8S2V5c3RvcmVNYXA+KG51bGwpO1xyXG4gIHByaXZhdGUgY3VycmVudEFjY291bnQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4obnVsbCk7XHJcbiAgcHVibGljIGtleXN0b3JlcyQgPSB0aGlzLmxvY2FsS2V5c3RvcmUuYXNPYnNlcnZhYmxlKCk7XHJcbiAgcHVibGljIGFjY291bnQkID0gdGhpcy5jdXJyZW50QWNjb3VudC5hc09ic2VydmFibGUoKTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHByb3ZpZGVyOiBNYWluUHJvdmlkZXIsXHJcbiAgICBwcml2YXRlIHNpZ25lcjogU2lnbmVyLFxyXG4gICAgcHJpdmF0ZSBhY2NvdW50czogQWNjb3VudHNcclxuICApIHtcclxuICAgIHRoaXMubG9jYWxLZXlzdG9yZS5uZXh0KHRoaXMuZ2V0S2V5c3RvcmVNYXBGcm9tTG9jYWxTdG9yYWdlKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCB0aGUgZGVmYXVsdCBhY2NvdW50ICovXHJcbiAgZ2V0IGRlZmF1bHRBY2NvdW50KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50QWNjb3VudC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNldCB0aGUgZGVmYXVsdCBhY2NvdW50ICovXHJcbiAgc2V0IGRlZmF1bHRBY2NvdW50KGFjY291bnQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5jdXJyZW50QWNjb3VudC5uZXh0KHRvQ2hlY2tzdW1BZGRyZXNzKGFjY291bnQpKTtcclxuICB9XHJcblxyXG4gIC8qKiBSZXR1cm4gdGhlIGtleXN0b3JlIG1hcCBmcm9tIHRoZSBsb2NhbHN0b3JlICovXHJcbiAgcHJpdmF0ZSBnZXRLZXlzdG9yZU1hcEZyb21Mb2NhbFN0b3JhZ2UoKTogS2V5c3RvcmVNYXAge1xyXG4gICAgcmV0dXJuIG5ldyBBcnJheShsb2NhbFN0b3JhZ2UubGVuZ3RoKS5maWxsKG51bGwpXHJcbiAgICAgIC5yZWR1Y2UoKGtleU1hcDogS2V5c3RvcmVNYXAsIG5vbmU6IG51bGwsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGxvY2FsU3RvcmFnZS5rZXkoaSk7XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrQWRkcmVzc0NoZWNrc3VtKGtleSlcclxuICAgICAgICAgID8gey4uLmtleU1hcCwgW2tleV06IHRoaXMuZ2V0S2V5c3RvcmUoa2V5KSB9XHJcbiAgICAgICAgICA6IHsuLi5rZXlNYXB9O1xyXG4gICAgICB9LCB7fSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYSBzcGVjaWZpYyBrZXlzdG9yZSBkZXBlbmRpbmcgb24gaXRzIGFkZHJlc3NcclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyBvZiB0aGUga2V5c3RvcmVcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0S2V5c3RvcmUoYWRkcmVzczogc3RyaW5nKTogS2V5c3RvcmUge1xyXG4gICAgY29uc3QgY2hlY2tTdW0gPSB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzKTtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGNoZWNrU3VtKSk7XHJcbiAgfVxyXG5cclxuICAvKiogUmV0dXJuIHRoZSBsaXN0IG9mIGFkZHJlc3NlcyBhdmFpbGFibGUgaW4gdGhlIGxvY2FsU3RvcmFnZSAqL1xyXG4gIHB1YmxpYyBnZXRBY2NvdW50cygpOiBPYnNlcnZhYmxlPHN0cmluZ1tdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5rZXlzdG9yZXMkLnBpcGUobWFwKGtleU1hcCA9PiBPYmplY3Qua2V5cyhrZXlNYXApKSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGFuIGFjY291bnRcclxuICAgKi9cclxuICBwdWJsaWMgY3JlYXRlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudHMuY3JlYXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTYXZlIGFuIGFjY291bnQgaW50byB0aGUgbG9jYWxzdG9yYWdlXHJcbiAgICogQHBhcmFtIGFjY291bnQgVGhlIGtleSBwYWlyIGFjY291bnRcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGVuY3J5cHQgdGhlIGFjY291bnQgd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzYXZlKGFjY291bnQ6IEV0aEFjY291bnQsIHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHsgYWRkcmVzcywgcHJpdmF0ZUtleSB9ID0gYWNjb3VudDtcclxuICAgIGNvbnN0IGtleXN0b3JlID0gdGhpcy5lbmNyeXB0KHByaXZhdGVLZXksIHBhc3N3b3JkKTtcclxuICAgIC8vIFVwZGF0ZSBhbGxLZXlzdG9yZVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYWRkcmVzcywgSlNPTi5zdHJpbmdpZnkoa2V5c3RvcmUpKTtcclxuICAgIHRoaXMubG9jYWxLZXlzdG9yZS5uZXh0KHRoaXMuZ2V0S2V5c3RvcmVNYXBGcm9tTG9jYWxTdG9yYWdlKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jcnlwdCBhbiBwcml2YXRlIGtleSBpbnRvIGEga2V5c3RvcmVcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gZW5jcnlwdFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdG8gZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXkgd2l0aFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIEEgbGlzdCBvZiBvcHRpb25zIHRvIGVuY3J5cHQgdGhlIHByaXZhdGUga2V5XHJcbiAgICovXHJcbiAgcHVibGljIGVuY3J5cHQocHJpdmF0ZUtleTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBvcHRpb25zPzogUGFydGlhbDxFbmNyeXB0T3B0aW9ucz4pIHtcclxuICAgIHJldHVybiB0aGlzLmFjY291bnRzLmVuY3J5cHQocHJpdmF0ZUtleSwgcGFzc3dvcmQsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjcnlwdCBhIGtleXN0b3JlIG9iamVjdFxyXG4gICAqIEBwYXJhbSBrZXlzdG9yZSBUaGUga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBkZWNyeXB0IHRoZSBrZXlzdG9yZSB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIGRlY3J5cHQoa2V5c3RvcmU6IEtleXN0b3JlLCBwYXNzd29yZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50cy5kZWNyeXB0KGtleXN0b3JlLCBwYXNzd29yZCk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKlxyXG4gICAqIFRSQU5TQUNUSU9OXHJcbiAgICoqKioqKioqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgYSB0cmFuc2FjdGlvbiBieSBzaWduaW5nIGl0XHJcbiAgICogQHBhcmFtIHR4IFRoZSB0cmFuc2FjdGlvbiB0byBzZW5kXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIHNpZ24gdGhlIHRyYW5zYWN0aW9uIHdpdGhcclxuICAgKi9cclxuICBwdWJsaWMgc2VuZFRyYW5zYWN0aW9uKHR4OiBUeE9iamVjdCwgcHJpdmF0ZUtleTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB7IHJhd1RyYW5zYWN0aW9uIH0gPSB0aGlzLnNpZ25UeCh0eCwgcHJpdmF0ZUtleSk7XHJcbiAgICByZXR1cm4gdGhpcy5zZW5kUmF3VHJhbnNhY3Rpb24ocmF3VHJhbnNhY3Rpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhIHRyYW5zYWN0aW9uIHRvIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHJhd1R4IFRoZSBzaWduZWQgdHJhbnNhY3Rpb24gZGF0YS5cclxuICAgKi9cclxuICBwdWJsaWMgc2VuZFJhd1RyYW5zYWN0aW9uKHJhd1R4OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4oJ2V0aF9zZW5kUmF3VHJhbnNhY3Rpb24nLCBbcmF3VHhdKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSB0cmFuc2FjdGlvbiB3aXRoIGEgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgdHJhbnNhY3Rpb24gd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzaWduVHgodHg6IFR4T2JqZWN0LCBwcml2YXRlS2V5OiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLnNpZ25lci5zaWduVHgocHJpdmF0ZUtleSwgdHgsIHRoaXMucHJvdmlkZXIuaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqXHJcbiAgICogU0lHTkFUVVJFXHJcbiAgICovXHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSBtZXNzYWdlXHJcbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gc2lnblxyXG4gICAqIEBwYXJhbSBhZGRyZXNzIHRoZSBhZGRyZXNzIHRvIHNpZ24gdGhlIG1lc3NhZ2Ugd2l0aFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCB0aGUgcGFzc3dvcmQgbmVlZGVkIHRvIGRlY3J5cHQgdGhlIHByaXZhdGUga2V5XHJcbiAgICovXHJcbiAgcHVibGljIHNpZ24obWVzc2FnZTogc3RyaW5nLCBhZGRyZXNzOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLmtleXN0b3JlcyQucGlwZShcclxuICAgICAgbWFwKGtleXN0b3JlcyA9PiBrZXlzdG9yZXNbYWRkcmVzc10pLFxyXG4gICAgICBtYXAoa2V5c3RvcmUgPT4gdGhpcy5kZWNyeXB0KGtleXN0b3JlLCBwYXNzd29yZCkpLFxyXG4gICAgICBtYXAoZXRoQWNjb3VudCA9PiB0aGlzLnNpZ25NZXNzYWdlKG1lc3NhZ2UsIGV0aEFjY291bnQucHJpdmF0ZUtleSkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIG1lc3NhZ2Ugd2l0aCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBzaWduXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIHNpZ24gdGhlIG1lc3NhZ2Ugd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzaWduTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHByaXZhdGVLZXk6IHN0cmluZykge1xyXG4gICAgY29uc3QgbWVzc2FnZUhhc2ggPSB0aGlzLnNpZ25lci5oYXNoTWVzc2FnZShtZXNzYWdlKTtcclxuICAgIGNvbnN0IHtyLCBzLCB2LCBzaWduYXR1cmV9ID0gdGhpcy5zaWduZXIuc2lnbihwcml2YXRlS2V5LCBtZXNzYWdlSGFzaCk7XHJcbiAgICByZXR1cm4ge21lc3NhZ2UsIG1lc3NhZ2VIYXNoLCB2LCByLCBzLCBzaWduYXR1cmV9O1xyXG4gIH1cclxuXHJcbn1cclxuIl0sIm5hbWVzIjpbIk5nTW9kdWxlIiwiQnVmZmVyIiwiYXNzZXJ0LmVxdWFsIiwiSW5qZWN0YWJsZSIsImtlY2NhazI1NiIsImlzSGV4U3RyaWN0IiwiaGV4VG9CeXRlcyIsInJhbmRvbUJ5dGVzIiwicHJpdmF0ZUtleVZlcmlmeSIsInB1YmxpY0tleUNyZWF0ZSIsInRvQ2hlY2tzdW1BZGRyZXNzIiwidXVpZCIsInBia2RmMlN5bmMiLCJjcmVhdGVDaXBoZXJpdiIsInY0IiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJlaGF2aW9yU3ViamVjdCIsImNoZWNrQWRkcmVzc0NoZWNrc3VtIiwibWFwIiwiUHJvdmlkZXJzTW9kdWxlIiwiTWFpblByb3ZpZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztvQkFDQ0EsV0FBUTs7MkJBRFQ7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7O1FBY1Msb0JBQU07Ozs7c0JBQUMsS0FBNEM7Z0JBQ3hELElBQUksS0FBSyxZQUFZLEtB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