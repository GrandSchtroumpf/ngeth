import { NgModule, Injectable, defineInjectable, inject } from '@angular/core';
import { equal } from 'assert';
import { Buffer as Buffer$1 } from 'buffer';
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
class WalletModule {
}
WalletModule.decorators = [
    { type: NgModule },
];

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
class RLP {
    /**
     * @param {?} input
     * @return {?}
     */
    encode(input) {
        if (input instanceof Array) {
            const /** @type {?} */ output = [];
            for (let /** @type {?} */ i = 0; i < input.length; i++) {
                output.push(this.encode(input[i]));
            }
            const /** @type {?} */ buf = Buffer$1.concat(output);
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
    }
    /**
     * @param {?} v
     * @param {?} base
     * @return {?}
     */
    safeParseInt(v, base) {
        if (v.slice(0, 2) === '00') {
            throw (new Error('invalid RLP: extra zeros'));
        }
        return parseInt(v, base);
    }
    /**
     * @param {?} len
     * @param {?} offset
     * @return {?}
     */
    encodeLength(len, offset) {
        if (len < 56) {
            return Buffer$1.from([len + offset]);
        }
        else {
            const /** @type {?} */ hexLength = this.intToHex(len);
            const /** @type {?} */ lLength = hexLength.length / 2;
            const /** @type {?} */ firstByte = this.intToHex(offset + 55 + lLength);
            return Buffer$1.from(firstByte + hexLength, 'hex');
        }
    }
    /**
     * RLP Decoding based on: {\@link https://github.com/ethereum/wiki/wiki/RLP}
     * @param {?} input
     * @param {?=} stream
     * @return {?} - returns decode Array of Buffers containg the original message
     *
     */
    decode(input, stream) {
        if (!input || input.length === 0) {
            return Buffer$1.from([]);
        }
        input = this.toBuffer(input);
        const /** @type {?} */ decoded = this._decode(input);
        if (stream) {
            return /** @type {?} */ (decoded);
        }
        equal(decoded.remainder.length, 0, 'invalid remainder');
        return decoded.data;
    }
    /**
     * @param {?} input
     * @return {?}
     */
    getLength(input) {
        if (!input || input.length === 0) {
            return Buffer$1.from([]);
        }
        input = this.toBuffer(input);
        const /** @type {?} */ firstByte = input[0];
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
            const /** @type {?} */ llength = firstByte - 0xf6;
            const /** @type {?} */ length = this.safeParseInt(input.slice(1, llength).toString('hex'), 16);
            return llength + length;
        }
    }
    /**
     * @param {?} input
     * @return {?}
     */
    _decode(input) {
        let /** @type {?} */ length, /** @type {?} */ llength, /** @type {?} */ data, /** @type {?} */ innerRemainder, /** @type {?} */ d;
        const /** @type {?} */ decoded = [];
        const /** @type {?} */ firstByte = input[0];
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
            const /** @type {?} */ totalLength = llength + length;
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
    }
    /**
     * HELPERS : TO REMOVE
     * @param {?} str
     * @return {?}
     */
    isHexPrefixed(str) {
        return str.slice(0, 2) === '0x';
    }
    /**
     * @param {?} str
     * @return {?}
     */
    stripHexPrefix(str) {
        if (typeof str !== 'string') {
            return str;
        }
        return this.isHexPrefixed(str) ? str.slice(2) : str;
    }
    /**
     * @param {?} i
     * @return {?}
     */
    intToHex(i) {
        let /** @type {?} */ hex = i.toString(16);
        if (hex.length % 2) {
            hex = '0' + hex;
        }
        return hex;
    }
    /**
     * @param {?} a
     * @return {?}
     */
    padToEven(a) {
        if (a.length % 2)
            a = '0' + a;
        return a;
    }
    /**
     * @param {?} i
     * @return {?}
     */
    intToBuffer(i) {
        const /** @type {?} */ hex = this.intToHex(i);
        return Buffer$1.from(hex, 'hex');
    }
    /**
     * @param {?} v
     * @return {?}
     */
    toBuffer(v) {
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
    }
}
RLP.decorators = [
    { type: Injectable, args: [{ providedIn: WalletModule },] },
];
/** @nocollapse */ RLP.ngInjectableDef = defineInjectable({ factory: function RLP_Factory() { return new RLP(); }, token: RLP, providedIn: WalletModule });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Signer {
    /**
     * @param {?} rlp
     */
    constructor(rlp) {
        this.rlp = rlp;
    }
    /**
     * Sign a raw transaction
     * @param {?} privateKey The private key to sign the transaction with
     * @param {?} tx The transaction to sign
     * @param {?=} chainId The id of the chain
     * @return {?}
     */
    signTx(privateKey, tx, chainId) {
        // Format TX
        const /** @type {?} */ rawTx = this.rawTx(tx);
        const /** @type {?} */ rawChain = ['0x' + (chainId || 1).toString(16), '0x', '0x'];
        // RLP encode with chainId (EIP155: prevent replay attack)
        const /** @type {?} */ rlpEncoded = this.rlp.encode([...rawTx, ...rawChain]);
        // Hash
        const /** @type {?} */ messageHash = keccak256(rlpEncoded);
        // Sign
        const { r, s, v } = this.sign(privateKey, messageHash, chainId);
        // RLP Encode with signature
        const /** @type {?} */ rlpTx = this.rlp.encode([...rawTx, ...[v, r, s]]);
        const /** @type {?} */ rawTransaction = '0x' + rlpTx.toString('hex');
        return { messageHash, r, s, v, rawTransaction };
    }
    /**
     * Recover a transaction based on its raw value
     * @param {?} rawTx The raw transaction format
     * @return {?}
     */
    recoverTx(rawTx) {
    }
    /**
     * Format the transaction
     * @param {?} tx The Transaction to encode
     * @return {?}
     */
    rawTx(tx) {
        return [
            '0x' + (tx.nonce || ''),
            '0x' + (tx.gasPrice || ''),
            '0x' + (tx.gas || ''),
            '0x' + tx.to.toLowerCase().replace('0x', '') || '',
            '0x' + (tx.value || ''),
            '0x' + (tx.data || '')
        ];
    }
    /**
     * Sign a hash
     * @param {?} privateKey The private key needed to sign the hash
     * @param {?} hash The hash to sign
     * @param {?=} chainId The Id of the chain
     * @return {?}
     */
    sign(privateKey, hash, chainId) {
        const /** @type {?} */ privKey = Buffer$1.from(privateKey.replace('0x', ''), 'hex');
        const /** @type {?} */ data = Buffer$1.from(hash.replace('0x', ''), 'hex');
        const /** @type {?} */ addToV = (chainId && chainId > 0) ? chainId * 2 + 8 : 0;
        const { signature, recovery } = sign(data, privKey);
        const /** @type {?} */ r = signature.toString('hex', 0, 32);
        const /** @type {?} */ s = signature.toString('hex', 32, 64);
        const /** @type {?} */ v = (recovery + 27 + addToV).toString(16);
        return {
            r: '0x' + r,
            s: '0x' + s,
            v: '0x' + v,
            signature: `0x${r}${s}${v}`
        };
    }
    /**
     * Hash a message with the preamble "\x19Ethereum Signed Message:\n"
     * @param {?} message The message to sign
     * @return {?}
     */
    hashMessage(message) {
        const /** @type {?} */ msg = isHexStrict(message) ? message : hexToBytes(message);
        const /** @type {?} */ msgBuffer = Buffer$1.from(/** @type {?} */ (msg));
        const /** @type {?} */ preamble = '\x19Ethereum Signed Message:\n' + msg.length;
        const /** @type {?} */ preambleBuffer = Buffer$1.from(preamble);
        const /** @type {?} */ ethMsg = Buffer$1.concat([preambleBuffer, msgBuffer]);
        return keccak256(ethMsg);
    }
}
Signer.decorators = [
    { type: Injectable, args: [{ providedIn: WalletModule },] },
];
/** @nocollapse */
Signer.ctorParameters = () => [
    { type: RLP, },
];
/** @nocollapse */ Signer.ngInjectableDef = defineInjectable({ factory: function Signer_Factory() { return new Signer(inject(RLP)); }, token: Signer, providedIn: WalletModule });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class EncryptOptions {
    /**
     * @param {?=} options
     */
    constructor(options) {
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
        for (const /** @type {?} */ key in options) {
            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
        // Transform salt to be a Buffer
        if (options && typeof options.salt === 'string') {
            this.salt = Buffer.from(options.salt.replace('0x', ''), 'hex');
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Accounts {
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
/** @nocollapse */ Accounts.ngInjectableDef = defineInjectable({ factory: function Accounts_Factory() { return new Accounts(); }, token: Accounts, providedIn: WalletModule });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Wallet {
    /**
     * @param {?} provider
     * @param {?} signer
     * @param {?} accounts
     */
    constructor(provider, signer, accounts) {
        this.provider = provider;
        this.signer = signer;
        this.accounts = accounts;
        this.localKeystore = new BehaviorSubject(null);
        this.currentAccount = new BehaviorSubject(null);
        this.keystores$ = this.localKeystore.asObservable();
        this.account$ = this.currentAccount.asObservable();
        this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
    }
    /**
     * Get the default account
     * @return {?}
     */
    get defaultAccount() {
        return this.currentAccount.getValue();
    }
    /**
     * Set the default account
     * @param {?} account
     * @return {?}
     */
    set defaultAccount(account) {
        this.currentAccount.next(toChecksumAddress(account));
    }
    /**
     * Return the keystore map from the localstore
     * @return {?}
     */
    getKeystoreMapFromLocalStorage() {
        return new Array(localStorage.length).fill(null)
            .reduce((keyMap, none, i) => {
            const /** @type {?} */ key = localStorage.key(i);
            return checkAddressChecksum(key)
                ? Object.assign({}, keyMap, { [key]: this.getKeystore(key) }) : Object.assign({}, keyMap);
        }, {});
    }
    /**
     * Get a specific keystore depending on its address
     * @param {?} address The address of the keystore
     * @return {?}
     */
    getKeystore(address) {
        const /** @type {?} */ checkSum = toChecksumAddress(address);
        return JSON.parse(localStorage.getItem(checkSum));
    }
    /**
     * Return the list of addresses available in the localStorage
     * @return {?}
     */
    getAccounts() {
        return this.keystores$.pipe(map(keyMap => Object.keys(keyMap)));
    }
    /**
     * Create an account
     * @return {?}
     */
    create() {
        return this.accounts.create();
    }
    /**
     * Save an account into the localstorage
     * @param {?} account The key pair account
     * @param {?} password The password to encrypt the account with
     * @return {?}
     */
    save(account, password) {
        const { address, privateKey } = account;
        const /** @type {?} */ keystore = this.encrypt(privateKey, password);
        // Update allKeystore
        localStorage.setItem(address, JSON.stringify(keystore));
        this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
    }
    /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} options A list of options to encrypt the private key
     * @return {?}
     */
    encrypt(privateKey, password, options) {
        return this.accounts.encrypt(privateKey, password, options);
    }
    /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * @return {?}
     */
    decrypt(keystore, password) {
        return this.accounts.decrypt(keystore, password);
    }
    /**
     * Send a transaction by signing it
     * @param {?} tx The transaction to send
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    sendTransaction(tx, privateKey) {
        const { rawTransaction } = this.signTx(tx, privateKey);
        return this.sendRawTransaction(rawTransaction);
    }
    /**
     * Send a transaction to the node
     * @param {?} rawTx The signed transaction data.
     * @return {?}
     */
    sendRawTransaction(rawTx) {
        return this.provider.rpc('eth_sendRawTransaction', [rawTx]);
    }
    /**
     * Sign a transaction with a private key
     * @param {?} tx The transaction to sign
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    signTx(tx, privateKey) {
        return this.signer.signTx(privateKey, tx, this.provider.id);
    }
    /**
     * Sign a message
     * @param {?} message the message to sign
     * @param {?} address the address to sign the message with
     * @param {?} password the password needed to decrypt the private key
     * @return {?}
     */
    sign(message, address, password) {
        return this.keystores$.pipe(map(keystores => keystores[address]), map(keystore => this.decrypt(keystore, password)), map(ethAccount => this.signMessage(message, ethAccount.privateKey)));
    }
    /**
     * Sign a message with the private key
     * @param {?} message The message to sign
     * @param {?} privateKey The private key to sign the message with
     * @return {?}
     */
    signMessage(message, privateKey) {
        const /** @type {?} */ messageHash = this.signer.hashMessage(message);
        const { r, s, v, signature } = this.signer.sign(privateKey, messageHash);
        return { message, messageHash, v, r, s, signature };
    }
}
Wallet.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
Wallet.ctorParameters = () => [
    { type: MainProvider, },
    { type: Signer, },
    { type: Accounts, },
];
/** @nocollapse */ Wallet.ngInjectableDef = defineInjectable({ factory: function Wallet_Factory() { return new Wallet(inject(MainProvider), inject(Signer), inject(Accounts)); }, token: Wallet, providedIn: ProvidersModule });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { WalletModule, RLP, Signer, Wallet, Accounts as ɵc, RLP as ɵb, Signer as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtd2FsbGV0LmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi93YWxsZXQubW9kdWxlLnRzIiwibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi9zaWduYXR1cmUvcmxwLnRzIiwibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi9zaWduYXR1cmUvc2lnbmVyLnRzIiwibmc6Ly9AbmdldGgvd2FsbGV0L2xpYi9hY2NvdW50L2VuY3J5cHRpb24udHMiLCJuZzovL0BuZ2V0aC93YWxsZXQvbGliL2FjY291bnQvYWNjb3VudC50cyIsIm5nOi8vQG5nZXRoL3dhbGxldC9saWIvd2FsbGV0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5ATmdNb2R1bGUoKVxuZXhwb3J0IGNsYXNzIFdhbGxldE1vZHVsZSB7fVxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLi93YWxsZXQubW9kdWxlJztcclxuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XHJcblxyXG4vKipcclxuICogUkxQIEVuY29kaW5nIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2lraS93aWtpLyU1QkVuZ2xpc2glNUQtUkxQXHJcbiAqIFRoaXMgcHJpdmF0ZSB0YWtlcyBpbiBhIGRhdGEsIGNvbnZlcnQgaXQgdG8gYnVmZmVyIGlmIG5vdCwgYW5kIGEgbGVuZ3RoIGZvciByZWN1cnNpb25cclxuICpcclxuICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICogQHJldHVybnMgIC0gcmV0dXJucyBidWZmZXIgb2YgZW5jb2RlZCBkYXRhXHJcbiAqKi9cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBXYWxsZXRNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIFJMUCB7XHJcbiAgcHVibGljIGVuY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nIHwgbnVtYmVyIHwgQXJyYXk8YW55Pikge1xyXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgY29uc3Qgb3V0cHV0ID0gW11cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG91dHB1dC5wdXNoKHRoaXMuZW5jb2RlKGlucHV0W2ldKSlcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBidWYgPSBCdWZmZXIuY29uY2F0KG91dHB1dClcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGJ1Zi5sZW5ndGgsIDE5MiksIGJ1Zl0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbnB1dCA9IHRoaXMudG9CdWZmZXIoaW5wdXQpO1xyXG4gICAgICBpZiAoaW5wdXQubGVuZ3RoID09PSAxICYmIGlucHV0WzBdIDwgMTI4KSB7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3RoaXMuZW5jb2RlTGVuZ3RoKGlucHV0Lmxlbmd0aCwgMTI4KSwgaW5wdXRdKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNhZmVQYXJzZUludCAodiwgYmFzZSkge1xyXG4gICAgaWYgKHYuc2xpY2UoMCwgMikgPT09ICcwMCcpIHtcclxuICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFA6IGV4dHJhIHplcm9zJykpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGFyc2VJbnQodiwgYmFzZSlcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW5jb2RlTGVuZ3RoIChsZW4sIG9mZnNldCkge1xyXG4gICAgaWYgKGxlbiA8IDU2KSB7XHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShbbGVuICsgb2Zmc2V0XSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGhleExlbmd0aCA9IHRoaXMuaW50VG9IZXgobGVuKVxyXG4gICAgICBjb25zdCBsTGVuZ3RoID0gaGV4TGVuZ3RoLmxlbmd0aCAvIDJcclxuICAgICAgY29uc3QgZmlyc3RCeXRlID0gdGhpcy5pbnRUb0hleChvZmZzZXQgKyA1NSArIGxMZW5ndGgpXHJcbiAgICAgIHJldHVybiBCdWZmZXIuZnJvbShmaXJzdEJ5dGUgKyBoZXhMZW5ndGgsICdoZXgnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUkxQIERlY29kaW5nIGJhc2VkIG9uOiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dpa2kvd2lraS9STFB9XHJcbiAgICogQHBhcmFtIGRhdGEgLSB3aWxsIGJlIGNvbnZlcnRlZCB0byBidWZmZXJcclxuICAgKiBAcmV0dXJucyAtIHJldHVybnMgZGVjb2RlIEFycmF5IG9mIEJ1ZmZlcnMgY29udGFpbmcgdGhlIG9yaWdpbmFsIG1lc3NhZ2VcclxuICAgKiovXHJcbiAgcHVibGljIGRlY29kZShpbnB1dDogQnVmZmVyIHwgc3RyaW5nLCBzdHJlYW0/OiBib29sZWFuKTogQnVmZmVyIHwgQXJyYXk8YW55PiB7XHJcbiAgICBpZiAoIWlucHV0IHx8IGlucHV0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gQnVmZmVyLmZyb20oW10pO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dCk7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy5fZGVjb2RlKGlucHV0KTtcclxuXHJcbiAgICBpZiAoc3RyZWFtKSB7XHJcbiAgICAgIHJldHVybiBkZWNvZGVkIGFzIGFueTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NlcnQuZXF1YWwoZGVjb2RlZC5yZW1haW5kZXIubGVuZ3RoLCAwLCAnaW52YWxpZCByZW1haW5kZXInKTtcclxuICAgIHJldHVybiBkZWNvZGVkLmRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0TGVuZ3RoKGlucHV0OiBzdHJpbmcgfCBCdWZmZXIpOiBudW1iZXIgfCBCdWZmZXIge1xyXG4gICAgaWYgKCFpbnB1dCB8fCBpbnB1dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgfVxyXG5cclxuICAgIGlucHV0ID0gdGhpcy50b0J1ZmZlcihpbnB1dClcclxuICAgIGNvbnN0IGZpcnN0Qnl0ZSA9IGlucHV0WzBdXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgcmV0dXJuIGlucHV0Lmxlbmd0aFxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiNykge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHg3ZlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICByZXR1cm4gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIHJldHVybiBmaXJzdEJ5dGUgLSAweGJmXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBhIGxpc3QgIG92ZXIgNTUgYnl0ZXMgbG9uZ1xyXG4gICAgICBjb25zdCBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhmNlxyXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICByZXR1cm4gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZGVjb2RlIChpbnB1dDogQnVmZmVyKSB7XHJcbiAgICBsZXQgbGVuZ3RoLCBsbGVuZ3RoLCBkYXRhLCBpbm5lclJlbWFpbmRlciwgZDtcclxuICAgIGNvbnN0IGRlY29kZWQgPSBbXVxyXG4gICAgY29uc3QgZmlyc3RCeXRlID0gaW5wdXRbMF1cclxuXHJcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcclxuICAgICAgLy8gYSBzaW5nbGUgYnl0ZSB3aG9zZSB2YWx1ZSBpcyBpbiB0aGUgWzB4MDAsIDB4N2ZdIHJhbmdlLCB0aGF0IGJ5dGUgaXMgaXRzIG93biBSTFAgZW5jb2RpbmcuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogaW5wdXQuc2xpY2UoMCwgMSksXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZSgxKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGZpcnN0Qnl0ZSA8PSAweGI3KSB7XHJcbiAgICAgIC8vIHN0cmluZyBpcyAwLTU1IGJ5dGVzIGxvbmcuIEEgc2luZ2xlIGJ5dGUgd2l0aCB2YWx1ZSAweDgwIHBsdXMgdGhlIGxlbmd0aCBvZiB0aGUgc3RyaW5nIGZvbGxvd2VkIGJ5IHRoZSBzdHJpbmdcclxuICAgICAgLy8gVGhlIHJhbmdlIG9mIHRoZSBmaXJzdCBieXRlIGlzIFsweDgwLCAweGI3XVxyXG4gICAgICBsZW5ndGggPSBmaXJzdEJ5dGUgLSAweDdmXHJcblxyXG4gICAgICAvLyBzZXQgMHg4MCBudWxsIHRvIDBcclxuICAgICAgaWYgKGZpcnN0Qnl0ZSA9PT0gMHg4MCkge1xyXG4gICAgICAgIGRhdGEgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhID0gaW5wdXQuc2xpY2UoMSwgbGVuZ3RoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobGVuZ3RoID09PSAyICYmIGRhdGFbMF0gPCAweDgwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCBlbmNvZGluZzogYnl0ZSBtdXN0IGJlIGxlc3MgMHg4MCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xyXG4gICAgICBsbGVuZ3RoID0gZmlyc3RCeXRlIC0gMHhiNlxyXG4gICAgICBsZW5ndGggPSB0aGlzLnNhZmVQYXJzZUludChpbnB1dC5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KVxyXG4gICAgICBkYXRhID0gaW5wdXQuc2xpY2UobGxlbmd0aCwgbGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgaWYgKGRhdGEubGVuZ3RoIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgdGhyb3cgKG5ldyBFcnJvcignaW52YWxpZCBSTFAnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHJlbWFpbmRlcjogaW5wdXQuc2xpY2UobGVuZ3RoICsgbGxlbmd0aClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xyXG4gICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXHJcbiAgICAgIGxlbmd0aCA9IGZpcnN0Qnl0ZSAtIDB4YmZcclxuICAgICAgaW5uZXJSZW1haW5kZXIgPSBpbnB1dC5zbGljZSgxLCBsZW5ndGgpXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhdGE6IGRlY29kZWQsXHJcbiAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZShsZW5ndGgpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGEgbGlzdCAgb3ZlciA1NSBieXRlcyBsb25nXHJcbiAgICAgIGxsZW5ndGggPSBmaXJzdEJ5dGUgLSAweGY2XHJcbiAgICAgIGxlbmd0aCA9IHRoaXMuc2FmZVBhcnNlSW50KGlucHV0LnNsaWNlKDEsIGxsZW5ndGgpLnRvU3RyaW5nKCdoZXgnKSwgMTYpXHJcbiAgICAgIGNvbnN0IHRvdGFsTGVuZ3RoID0gbGxlbmd0aCArIGxlbmd0aFxyXG4gICAgICBpZiAodG90YWxMZW5ndGggPiBpbnB1dC5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcmxwOiB0b3RhbCBsZW5ndGggaXMgbGFyZ2VyIHRoYW4gdGhlIGRhdGEnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpbm5lclJlbWFpbmRlciA9IGlucHV0LnNsaWNlKGxsZW5ndGgsIHRvdGFsTGVuZ3RoKVxyXG4gICAgICBpZiAoaW5uZXJSZW1haW5kZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCwgTGlzdCBoYXMgYSBpbnZhbGlkIGxlbmd0aCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcclxuICAgICAgICBkID0gdGhpcy5fZGVjb2RlKGlubmVyUmVtYWluZGVyKVxyXG4gICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpXHJcbiAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlclxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZGF0YTogZGVjb2RlZCxcclxuICAgICAgICByZW1haW5kZXI6IGlucHV0LnNsaWNlKHRvdGFsTGVuZ3RoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogSEVMUEVSUyA6IFRPIFJFTU9WRVxyXG4gICAqL1xyXG5cclxuICBwcml2YXRlIGlzSGV4UHJlZml4ZWQoc3RyKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnXHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmVzIDB4IGZyb20gYSBnaXZlbiBTdHJpbmdcclxuICBwcml2YXRlIHN0cmlwSGV4UHJlZml4KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gc3RyXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5pc0hleFByZWZpeGVkKHN0cikgPyBzdHIuc2xpY2UoMikgOiBzdHJcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW50VG9IZXgoaTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGxldCBoZXggPSBpLnRvU3RyaW5nKDE2KVxyXG4gICAgaWYgKGhleC5sZW5ndGggJSAyKSB7XHJcbiAgICAgIGhleCA9ICcwJyArIGhleFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhleFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYWRUb0V2ZW4oYTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmIChhLmxlbmd0aCAlIDIpIGEgPSAnMCcgKyBhXHJcbiAgICByZXR1cm4gYVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnRUb0J1ZmZlcihpOiBudW1iZXIpOiBCdWZmZXIge1xyXG4gICAgY29uc3QgaGV4ID0gdGhpcy5pbnRUb0hleChpKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGhleCwgJ2hleCcpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvQnVmZmVyKHY6IGFueSk6IEJ1ZmZlciB7XHJcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih2KSkge1xyXG4gICAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNIZXhQcmVmaXhlZCh2KSkge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHRoaXMucGFkVG9FdmVuKHRoaXMuc3RyaXBIZXhQcmVmaXgodikpLCAnaGV4JylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIGlmICghdikge1xyXG4gICAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKFtdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2ID0gdGhpcy5pbnRUb0J1ZmZlcih2KVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHYgPSBCdWZmZXIuZnJvbShbXSlcclxuICAgICAgfSBlbHNlIGlmICh2LnRvQXJyYXkpIHtcclxuICAgICAgICAvLyBjb252ZXJ0cyBhIEJOIHRvIGEgQnVmZmVyXHJcbiAgICAgICAgdiA9IEJ1ZmZlci5mcm9tKHYudG9BcnJheSgpKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0eXBlJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgVHhPYmplY3QsIGtlY2NhazI1NiwgaXNIZXhTdHJpY3QsIGhleFRvQnl0ZXMgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBXYWxsZXRNb2R1bGUgfSBmcm9tICcuLy4uL3dhbGxldC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBSTFAgfSBmcm9tICcuL3JscCc7XHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XHJcbmltcG9ydCB7IHNpZ24gfSBmcm9tICdzZWNwMjU2azEnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogV2FsbGV0TW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBTaWduZXIge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJscDogUkxQKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgcmF3IHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIHNpZ24gdGhlIHRyYW5zYWN0aW9uIHdpdGhcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gY2hhaW5JZCBUaGUgaWQgb2YgdGhlIGNoYWluXHJcbiAgICovXHJcbiAgcHVibGljIHNpZ25UeChwcml2YXRlS2V5OiBzdHJpbmcsIHR4OiBUeE9iamVjdCwgY2hhaW5JZD86IG51bWJlcikge1xyXG4gICAgLy8gRm9ybWF0IFRYXHJcbiAgICBjb25zdCByYXdUeCA9IHRoaXMucmF3VHgodHgpO1xyXG4gICAgY29uc3QgcmF3Q2hhaW4gPSBbICcweCcgKyAoY2hhaW5JZCB8fCAxKS50b1N0cmluZygxNiksICcweCcsICcweCcgXTtcclxuXHJcbiAgICAvLyBSTFAgZW5jb2RlIHdpdGggY2hhaW5JZCAoRUlQMTU1OiBwcmV2ZW50IHJlcGxheSBhdHRhY2spXHJcbiAgICBjb25zdCBybHBFbmNvZGVkID0gdGhpcy5ybHAuZW5jb2RlKFsuLi5yYXdUeCwgLi4ucmF3Q2hhaW5dKTtcclxuXHJcbiAgICAvLyBIYXNoXHJcbiAgICBjb25zdCBtZXNzYWdlSGFzaCA9IGtlY2NhazI1NihybHBFbmNvZGVkKTtcclxuXHJcbiAgICAvLyBTaWduXHJcbiAgICBjb25zdCB7IHIsIHMsIHYgfSA9IHRoaXMuc2lnbihwcml2YXRlS2V5LCBtZXNzYWdlSGFzaCwgY2hhaW5JZCk7XHJcblxyXG4gICAgLy8gUkxQIEVuY29kZSB3aXRoIHNpZ25hdHVyZVxyXG4gICAgY29uc3QgcmxwVHggPSB0aGlzLnJscC5lbmNvZGUoWy4uLnJhd1R4LCAuLi5bdiwgciwgc11dKTtcclxuICAgIGNvbnN0IHJhd1RyYW5zYWN0aW9uID0gJzB4JyArICBybHBUeC50b1N0cmluZygnaGV4Jyk7XHJcblxyXG4gICAgcmV0dXJuIHsgbWVzc2FnZUhhc2gsIHIsIHMsIHYsIHJhd1RyYW5zYWN0aW9uIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWNvdmVyIGEgdHJhbnNhY3Rpb24gYmFzZWQgb24gaXRzIHJhdyB2YWx1ZVxyXG4gICAqIEBwYXJhbSByYXdUeCBUaGUgcmF3IHRyYW5zYWN0aW9uIGZvcm1hdFxyXG4gICAqL1xyXG4gIHB1YmxpYyByZWNvdmVyVHgocmF3VHg6IHN0cmluZykge1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZvcm1hdCB0aGUgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gdHggVGhlIFRyYW5zYWN0aW9uIHRvIGVuY29kZVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmF3VHgodHg6IFR4T2JqZWN0KTogYW55W10ge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgJzB4JyArICh0eC5ub25jZSB8fCAnJyksXHJcbiAgICAgICcweCcgKyAodHguZ2FzUHJpY2UgfHwgJycpLFxyXG4gICAgICAnMHgnICsgKHR4LmdhcyB8fCAnJyksXHJcbiAgICAgICcweCcgKyB0eC50by50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJzB4JywgJycpIHx8ICcnLFxyXG4gICAgICAnMHgnICsgKHR4LnZhbHVlIHx8ICcnKSxcclxuICAgICAgJzB4JyArICh0eC5kYXRhIHx8ICcnKVxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSBoYXNoXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IG5lZWRlZCB0byBzaWduIHRoZSBoYXNoXHJcbiAgICogQHBhcmFtIGhhc2ggVGhlIGhhc2ggdG8gc2lnblxyXG4gICAqIEBwYXJhbSBjaGFpbklkIFRoZSBJZCBvZiB0aGUgY2hhaW5cclxuICAgICovXHJcbiAgcHVibGljIHNpZ24ocHJpdmF0ZUtleTogc3RyaW5nLCBoYXNoOiBzdHJpbmcsIGNoYWluSWQ/OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHByaXZLZXkgPSBCdWZmZXIuZnJvbShwcml2YXRlS2V5LnJlcGxhY2UoJzB4JywgJycpLCAnaGV4Jyk7XHJcbiAgICBjb25zdCBkYXRhID0gQnVmZmVyLmZyb20oaGFzaC5yZXBsYWNlKCcweCcsICcnKSwgJ2hleCcpO1xyXG4gICAgY29uc3QgYWRkVG9WID0gKGNoYWluSWQgJiYgY2hhaW5JZCA+IDApID8gY2hhaW5JZCAqIDIgKyA4IDogMDtcclxuICAgIGNvbnN0IHsgc2lnbmF0dXJlLCByZWNvdmVyeSB9ID0gc2lnbihkYXRhLCBwcml2S2V5KTtcclxuICAgIGNvbnN0IHIgPSBzaWduYXR1cmUudG9TdHJpbmcoJ2hleCcsIDAsIDMyKTtcclxuICAgIGNvbnN0IHMgPSBzaWduYXR1cmUudG9TdHJpbmcoJ2hleCcsIDMyLCA2NCk7XHJcbiAgICBjb25zdCB2ID0gKHJlY292ZXJ5ICsgMjcgKyBhZGRUb1YpLnRvU3RyaW5nKDE2KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHI6ICcweCcrcixcclxuICAgICAgczogJzB4JytzLFxyXG4gICAgICB2OiAnMHgnK3YsXHJcbiAgICAgIHNpZ25hdHVyZTogYDB4JHtyfSR7c30ke3Z9YFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhhc2ggYSBtZXNzYWdlIHdpdGggdGhlIHByZWFtYmxlIFwiXFx4MTlFdGhlcmV1bSBTaWduZWQgTWVzc2FnZTpcXG5cIlxyXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHNpZ25cclxuICAgKi9cclxuICBwdWJsaWMgaGFzaE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IG1zZyA9IGlzSGV4U3RyaWN0KG1lc3NhZ2UpID8gbWVzc2FnZSA6IGhleFRvQnl0ZXMobWVzc2FnZSk7XHJcbiAgICBjb25zdCBtc2dCdWZmZXIgPSBCdWZmZXIuZnJvbShtc2cgYXMgc3RyaW5nKTtcclxuICAgIGNvbnN0IHByZWFtYmxlID0gJ1xceDE5RXRoZXJldW0gU2lnbmVkIE1lc3NhZ2U6XFxuJyArIG1zZy5sZW5ndGg7XHJcbiAgICBjb25zdCBwcmVhbWJsZUJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHByZWFtYmxlKTtcclxuICAgIGNvbnN0IGV0aE1zZyA9IEJ1ZmZlci5jb25jYXQoW3ByZWFtYmxlQnVmZmVyLCBtc2dCdWZmZXJdKTtcclxuICAgIHJldHVybiBrZWNjYWsyNTYoZXRoTXNnKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8tYnJvd3NlcmlmeSc7XHJcblxyXG5leHBvcnQgY2xhc3MgRW5jcnlwdE9wdGlvbnMge1xyXG4gIHB1YmxpYyBzYWx0OiBCdWZmZXIgfCBzdHJpbmcgPSByYW5kb21CeXRlcygzMik7XHJcbiAgcHVibGljIGl2OiBCdWZmZXIgPSByYW5kb21CeXRlcygxNik7XHJcbiAgcHVibGljIGtkZjogJ3Bia2RmMicgfCAnc2NyeXB0JyA9ICdzY3J5cHQnO1xyXG4gIHB1YmxpYyBjID0gMjYyMTQ0O1xyXG4gIHB1YmxpYyBwcmY6ICdobWFjLXNoYTI1Nic7XHJcbiAgcHVibGljIGRrbGVuID0gMzI7XHJcbiAgcHVibGljIG46IDIwNDggfCA0MDk2IHwgODE5MiB8IDE2Mzg0ID0gODE5MjtcclxuICBwdWJsaWMgciA9IDg7XHJcbiAgcHVibGljIHAgPSAxO1xyXG4gIHB1YmxpYyBjaXBoZXI6ICdhZXMtMTI4LWN0cicgfCBzdHJpbmcgPSAnYWVzLTEyOC1jdHInO1xyXG4gIHB1YmxpYyB1dWlkOiBCdWZmZXIgPSByYW5kb21CeXRlcygxNik7XHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IFBhcnRpYWw8RW5jcnlwdE9wdGlvbnM+KSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFRyYW5zZm9ybSBzYWx0IHRvIGJlIGEgQnVmZmVyXHJcbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5zYWx0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLnNhbHQgPSBCdWZmZXIuZnJvbShvcHRpb25zLnNhbHQucmVwbGFjZSgnMHgnLCAnJyksICdoZXgnKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBLZXlzdG9yZSB7XHJcbiAgdmVyc2lvbjogMztcclxuICBpZDogc3RyaW5nO1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxuICBjcnlwdG86IHtcclxuICAgIGNpcGhlcnRleHQ6IHN0cmluZztcclxuICAgIGNpcGhlcnBhcmFtczoge1xyXG4gICAgICAgIGl2OiBzdHJpbmc7XHJcbiAgICB9LFxyXG4gICAgY2lwaGVyOiBzdHJpbmc7XHJcbiAgICBrZGY6IHN0cmluZztcclxuICAgIGtkZnBhcmFtczoge1xyXG4gICAgICBka2xlbjogbnVtYmVyO1xyXG4gICAgICBzYWx0OiBzdHJpbmc7XHJcbiAgICAgIC8vIEZvciBzY3J5cHQgZW5jcnlwdGlvblxyXG4gICAgICBuPzogbnVtYmVyO1xyXG4gICAgICBwPzogbnVtYmVyO1xyXG4gICAgICByPzogbnVtYmVyO1xyXG4gICAgICAvLyBGb3IgcGJrZGYyIGVuY3J5cHRpb25cclxuICAgICAgYz86IG51bWJlcjtcclxuICAgICAgcHJmPzogJ2htYWMtc2hhMjU2JztcclxuICAgIH07XHJcbiAgICBtYWM6IHN0cmluZztcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIFJlc3NvdXJjZXNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtL3dpa2kvd2lraS9XZWIzLVNlY3JldC1TdG9yYWdlLURlZmluaXRpb25cclxuICovXHJcblxyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFdhbGxldE1vZHVsZSB9IGZyb20gJy4vLi4vd2FsbGV0Lm1vZHVsZSc7XHJcblxyXG5pbXBvcnQgeyB2NCB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyB0b0NoZWNrc3VtQWRkcmVzcywga2VjY2FrMjU2IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgcHJpdmF0ZUtleVZlcmlmeSwgcHVibGljS2V5Q3JlYXRlIH0gZnJvbSAnc2VjcDI1NmsxJztcclxuaW1wb3J0IHsgcmFuZG9tQnl0ZXMsIHBia2RmMlN5bmMsIGNyZWF0ZUNpcGhlcml2LCBjcmVhdGVEZWNpcGhlcml2IH0gZnJvbSAnY3J5cHRvLWJyb3dzZXJpZnknO1xyXG5pbXBvcnQgeyBFbmNyeXB0T3B0aW9ucywgS2V5c3RvcmUgfSBmcm9tICcuL2VuY3J5cHRpb24nO1xyXG5pbXBvcnQgc2NyeXB0c3kgZnJvbSAnc2NyeXB0LmpzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXRoQWNjb3VudCB7XHJcbiAgcHJpdmF0ZUtleTogc3RyaW5nO1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxufVxyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBXYWxsZXRNb2R1bGV9KVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudHMge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhbiBFdGhlcmV1bSBrZXlwYWlyXHJcbiAgICovXHJcbiAgcHVibGljIGNyZWF0ZSgpOiBFdGhBY2NvdW50IHtcclxuICAgIGxldCBwcml2S2V5OiBCdWZmZXI7XHJcbiAgICBkbyB7IHByaXZLZXkgPSByYW5kb21CeXRlcygzMik7IH1cclxuICAgIHdoaWxlICghcHJpdmF0ZUtleVZlcmlmeShwcml2S2V5KSk7XHJcbiAgICByZXR1cm4gdGhpcy5mcm9tUHJpdmF0ZShwcml2S2V5KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhbiBhY2NvdW50IGZyb20gYSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB3aXRob3V0IHRoZSBwcmVmaXggJzB4J1xyXG4gICAqL1xyXG4gIHB1YmxpYyBmcm9tUHJpdmF0ZShwcml2YXRlS2V5OiBzdHJpbmcgfCBCdWZmZXIpOiBFdGhBY2NvdW50IHtcclxuICAgIGlmICh0eXBlb2YgcHJpdmF0ZUtleSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcHJpdmF0ZUtleSA9IEJ1ZmZlci5mcm9tKFtwcml2YXRlS2V5LnJlcGxhY2UoJzB4JywgJycpXSk7XHJcbiAgICB9XHJcbiAgICAvLyBTbGljZSgxKSBpcyB0byBkcm9wIHR5cGUgYnl0ZSB3aGljaCBpcyBoYXJkY29kZWQgYXMgMDQgZXRoZXJldW0uXHJcbiAgICBjb25zdCBwdWJLZXkgPSBwdWJsaWNLZXlDcmVhdGUocHJpdmF0ZUtleSwgZmFsc2UpLnNsaWNlKDEpO1xyXG4gICAgY29uc3QgYWRkcmVzcyA9ICcweCcgKyBrZWNjYWsyNTYocHViS2V5KS5zdWJzdHJpbmcoMjYpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcHJpdmF0ZUtleTogJzB4JyArIHByaXZhdGVLZXkudG9TdHJpbmcoJ2hleCcpLFxyXG4gICAgICBhZGRyZXNzOiB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzKVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY3J5cHQgYW4gcHJpdmF0ZSBrZXkgaW50byBhIGtleXN0b3JlXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIGVuY3J5cHRcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGVuY3J5cHQgdGhlIHByaXZhdGUga2V5IHdpdGhcclxuICAgKiBAcGFyYW0gZW5jcnlwdE9wdGlvbnMgQSBsaXN0IG9mIG9wdGlvbnMgdG8gZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBDb2RlIGZyb20gOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2ViMy5qcy9ibG9iLzEuMC9wYWNrYWdlcy93ZWIzLWV0aC1hY2NvdW50cy9zcmMvaW5kZXguanNcclxuICAgKi9cclxuICBwdWJsaWMgZW5jcnlwdChcclxuICAgIHByaXZhdGVLZXk6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBlbmNyeXB0T3B0aW9ucz86IFBhcnRpYWw8RW5jcnlwdE9wdGlvbnM+KTogS2V5c3RvcmVcclxuICB7XHJcbiAgICBjb25zdCBwd2QgPSBCdWZmZXIuZnJvbShwYXNzd29yZCk7XHJcbiAgICBjb25zdCBwcml2S2V5ID0gQnVmZmVyLmZyb20ocHJpdmF0ZUtleS5yZXBsYWNlKCcweCcsICcnKSwgJ2hleCcpO1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IG5ldyBFbmNyeXB0T3B0aW9ucyhlbmNyeXB0T3B0aW9ucyk7XHJcbiAgICBjb25zdCB7IHNhbHQsIGl2LCBrZGYsIGMsIG4sIHIsIHAsIGRrbGVuLCBjaXBoZXIsIHV1aWQgfSA9IG9wdGlvbnM7XHJcbiAgICBjb25zdCBrZGZQYXJhbXM6IEtleXN0b3JlWydjcnlwdG8nXVsna2RmcGFyYW1zJ10gPSB7XHJcbiAgICAgIGRrbGVuOiBka2xlbixcclxuICAgICAgc2FsdDogKHNhbHQgYXMgQnVmZmVyKS50b1N0cmluZygnaGV4JylcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGRlcml2ZWRLZXk7XHJcbiAgICBpZiAoa2RmID09PSAncGJrZGYyJykge1xyXG4gICAgICBrZGZQYXJhbXMuYyA9IGM7XHJcbiAgICAgIGtkZlBhcmFtcy5wcmYgPSAnaG1hYy1zaGEyNTYnO1xyXG4gICAgICBkZXJpdmVkS2V5ID0gcGJrZGYyU3luYyhwd2QsIHNhbHQsIGMsIGRrbGVuLCAnc2hhMjU2Jyk7XHJcbiAgICB9IGVsc2UgaWYgKGtkZiA9PT0gJ3NjcnlwdCcpIHtcclxuICAgICAga2RmUGFyYW1zLm4gPSBuO1xyXG4gICAgICBrZGZQYXJhbXMuciA9IHI7XHJcbiAgICAgIGtkZlBhcmFtcy5wID0gcDtcclxuICAgICAgZGVyaXZlZEtleSA9IHNjcnlwdHN5KHB3ZCwgc2FsdCwgbiwgciwgcCwgZGtsZW4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBLZXkgRGVyaXZhdGlvbiBGdW5jdGlvbicgKyBrZGYpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNpcGhlckFsZyA9IGNyZWF0ZUNpcGhlcml2KGNpcGhlciwgZGVyaXZlZEtleS5zbGljZSgwLCAxNiksIGl2KTtcclxuICAgIGlmICghY2lwaGVyQWxnKSB7IHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgY2lwaGVyICcgKyBjaXBoZXIpfVxyXG4gICAgY29uc3QgY2lwaGVyVGV4dCA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlckFsZy51cGRhdGUocHJpdktleSksIGNpcGhlckFsZy5maW5hbCgpXSk7XHJcbiAgICBjb25zdCB0b01hYyA9IEJ1ZmZlci5jb25jYXQoW2Rlcml2ZWRLZXkuc2xpY2UoMTYsIDMyKSwgY2lwaGVyVGV4dF0pO1xyXG4gICAgY29uc3QgbWFjID0ga2VjY2FrMjU2KHRvTWFjKS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZlcnNpb246IDMsXHJcbiAgICAgIGlkOiB2NCh7IHJhbmRvbTogdXVpZCBhcyBhbnkgfSksXHJcbiAgICAgIGFkZHJlc3M6IHRoaXMuZnJvbVByaXZhdGUocHJpdktleSkuYWRkcmVzcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJzB4JywgJycpLFxyXG4gICAgICBjcnlwdG86IHtcclxuICAgICAgICBjaXBoZXJ0ZXh0OiBjaXBoZXJUZXh0LnRvU3RyaW5nKCdoZXgnKSxcclxuICAgICAgICBjaXBoZXJwYXJhbXM6IHtcclxuICAgICAgICAgICAgaXY6IGl2LnRvU3RyaW5nKCdoZXgnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2lwaGVyOiBvcHRpb25zLmNpcGhlcixcclxuICAgICAgICBrZGY6IGtkZixcclxuICAgICAgICBrZGZwYXJhbXM6IGtkZlBhcmFtcyxcclxuICAgICAgICBtYWM6IG1hY1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNyeXB0IGEga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIGtleXN0b3JlIFRoZSBrZXlzdG9yZSBvYmplY3RcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGRlY3J5cHQgdGhlIGtleXN0b3JlIHdpdGhcclxuICAgKiBDb2RlIGZyb20gOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW1qcy9ldGhlcmV1bWpzLXdhbGxldC9ibG9iL21hc3Rlci9pbmRleC5qc1xyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNyeXB0KGtleXN0b3JlOiBLZXlzdG9yZSwgcGFzc3dvcmQ6IHN0cmluZyk6IEV0aEFjY291bnQge1xyXG4gICAgaWYgKHR5cGVvZiBwYXNzd29yZCAhPT0gJ3N0cmluZycpIHsgdGhyb3cgbmV3IEVycm9yKCdObyBwYXNzd29yZCBwcm92aWRlZCcpOyB9XHJcbiAgICBpZiAodHlwZW9mIGtleXN0b3JlICE9PSAnb2JqZWN0JykgeyB0aHJvdyBuZXcgRXJyb3IoJ2tleXN0b3JlIHNob3VsZCBiZSBhbiBvYmplY3QnKTsgfVxyXG4gICAgaWYgKGtleXN0b3JlLnZlcnNpb24gIT09IDMpIHsgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSBWMyB3YWxsZXQnKTsgfVxyXG5cclxuICAgIGxldCBkZXJpdmVkS2V5O1xyXG4gICAgY29uc3QgeyBrZGYsIGtkZnBhcmFtcywgY2lwaGVycGFyYW1zLCBjaXBoZXIgfSA9IGtleXN0b3JlLmNyeXB0bztcclxuICAgIGNvbnN0IHB3ZCA9IEJ1ZmZlci5mcm9tKHBhc3N3b3JkLCAndXRmOCcpO1xyXG4gICAgY29uc3Qgc2FsdCA9IEJ1ZmZlci5mcm9tKGtkZnBhcmFtcy5zYWx0LCAnaGV4Jyk7XHJcbiAgICBjb25zdCBpdiA9IEJ1ZmZlci5mcm9tKGNpcGhlcnBhcmFtcy5pdiwgJ2hleCcpO1xyXG4gICAgLy8gU2NyeXB0IGVuY3J5cHRpb25cclxuICAgIGlmIChrZGYgPT09ICdzY3J5cHQnKSB7XHJcbiAgICAgIGNvbnN0IHsgbiwgciwgcCwgZGtsZW4gfSA9IGtkZnBhcmFtcztcclxuICAgICAgZGVyaXZlZEtleSA9IHNjcnlwdHN5KHB3ZCwgc2FsdCwgbiwgciwgcCwgZGtsZW4pXHJcbiAgICB9XHJcbiAgICAvLyBwYmtkZjIgZW5jcnlwdGlvblxyXG4gICAgZWxzZSBpZiAoa2RmID09PSAncGJrZGYyJykge1xyXG4gICAgICBpZiAoa2RmcGFyYW1zLnByZiAhPT0gJ2htYWMtc2hhMjU2JykgeyB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHBhcmFtZXRlcnMgdG8gUEJLREYyJyk7IH1cclxuICAgICAgY29uc3QgeyBjLCBka2xlbiB9ID0ga2RmcGFyYW1zO1xyXG4gICAgICBkZXJpdmVkS2V5ID0gcGJrZGYyU3luYyhwd2QsIHNhbHQsIGMsIGRrbGVuLCAnc2hhMjU2JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQga2V5IGRlcml2YXRpb24gc2NoZW1lJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjaXBoZXJUZXh0ID0gQnVmZmVyLmZyb20oa2V5c3RvcmUuY3J5cHRvLmNpcGhlcnRleHQsICdoZXgnKTtcclxuICAgIGNvbnN0IG1hYyA9IGtlY2NhazI1NihCdWZmZXIuY29uY2F0KFsgZGVyaXZlZEtleS5zbGljZSgxNiwgMzIpLCBjaXBoZXJUZXh0IF0pKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgnMHgnLCAnJyk7XHJcblxyXG4gICAgaWYgKG1hYyAhPT0ga2V5c3RvcmUuY3J5cHRvLm1hYykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleSBkZXJpdmF0aW9uIGZhaWxlZCAtIHBvc3NpYmx5IHdyb25nIHBhc3N3b3JkJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkZWNpcGhlciA9IGNyZWF0ZURlY2lwaGVyaXYoY2lwaGVyLCBkZXJpdmVkS2V5LnNsaWNlKDAsIDE2KSwgaXYpO1xyXG4gICAgY29uc3Qgc2VlZCA9IEJ1ZmZlci5jb25jYXQoWyBkZWNpcGhlci51cGRhdGUoY2lwaGVyVGV4dCksIGRlY2lwaGVyLmZpbmFsKCkgXSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZnJvbVByaXZhdGUoc2VlZCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlLCBNYWluUHJvdmlkZXIsIEF1dGggfSBmcm9tICdAbmdldGgvcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBUeE9iamVjdCwgdG9DaGVja3N1bUFkZHJlc3MsIGNoZWNrQWRkcmVzc0NoZWNrc3VtIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuXHJcbmltcG9ydCB7IEFjY291bnRzLCBFbmNyeXB0T3B0aW9ucywgS2V5c3RvcmUsIEV0aEFjY291bnQgfSBmcm9tICcuL2FjY291bnQnO1xyXG5pbXBvcnQgeyBTaWduZXIgfSBmcm9tICcuL3NpZ25hdHVyZS9zaWduZXInO1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2V5c3RvcmVNYXAge1xyXG4gIFthZGRyZXNzOiBzdHJpbmddOiBLZXlzdG9yZTtcclxufVxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBQcm92aWRlcnNNb2R1bGV9KVxyXG5leHBvcnQgY2xhc3MgV2FsbGV0IGltcGxlbWVudHMgQXV0aCB7XHJcbiAgcHJpdmF0ZSBsb2NhbEtleXN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxLZXlzdG9yZU1hcD4obnVsbCk7XHJcbiAgcHJpdmF0ZSBjdXJyZW50QWNjb3VudCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPihudWxsKTtcclxuICBwdWJsaWMga2V5c3RvcmVzJCA9IHRoaXMubG9jYWxLZXlzdG9yZS5hc09ic2VydmFibGUoKTtcclxuICBwdWJsaWMgYWNjb3VudCQgPSB0aGlzLmN1cnJlbnRBY2NvdW50LmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcixcclxuICAgIHByaXZhdGUgc2lnbmVyOiBTaWduZXIsXHJcbiAgICBwcml2YXRlIGFjY291bnRzOiBBY2NvdW50c1xyXG4gICkge1xyXG4gICAgdGhpcy5sb2NhbEtleXN0b3JlLm5leHQodGhpcy5nZXRLZXlzdG9yZU1hcEZyb21Mb2NhbFN0b3JhZ2UoKSk7XHJcbiAgfVxyXG5cclxuICAvKiogR2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBnZXQgZGVmYXVsdEFjY291bnQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRBY2NvdW50LmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogU2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBzZXQgZGVmYXVsdEFjY291bnQoYWNjb3VudDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRBY2NvdW50Lm5leHQodG9DaGVja3N1bUFkZHJlc3MoYWNjb3VudCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFJldHVybiB0aGUga2V5c3RvcmUgbWFwIGZyb20gdGhlIGxvY2Fsc3RvcmUgKi9cclxuICBwcml2YXRlIGdldEtleXN0b3JlTWFwRnJvbUxvY2FsU3RvcmFnZSgpOiBLZXlzdG9yZU1hcCB7XHJcbiAgICByZXR1cm4gbmV3IEFycmF5KGxvY2FsU3RvcmFnZS5sZW5ndGgpLmZpbGwobnVsbClcclxuICAgICAgLnJlZHVjZSgoa2V5TWFwOiBLZXlzdG9yZU1hcCwgbm9uZTogbnVsbCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgICByZXR1cm4gY2hlY2tBZGRyZXNzQ2hlY2tzdW0oa2V5KVxyXG4gICAgICAgICAgPyB7Li4ua2V5TWFwLCBba2V5XTogdGhpcy5nZXRLZXlzdG9yZShrZXkpIH1cclxuICAgICAgICAgIDogey4uLmtleU1hcH07XHJcbiAgICAgIH0sIHt9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIHNwZWNpZmljIGtleXN0b3JlIGRlcGVuZGluZyBvbiBpdHMgYWRkcmVzc1xyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIG9mIHRoZSBrZXlzdG9yZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRLZXlzdG9yZShhZGRyZXNzOiBzdHJpbmcpOiBLZXlzdG9yZSB7XHJcbiAgICBjb25zdCBjaGVja1N1bSA9IHRvQ2hlY2tzdW1BZGRyZXNzKGFkZHJlc3MpO1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY2hlY2tTdW0pKTtcclxuICB9XHJcblxyXG4gIC8qKiBSZXR1cm4gdGhlIGxpc3Qgb2YgYWRkcmVzc2VzIGF2YWlsYWJsZSBpbiB0aGUgbG9jYWxTdG9yYWdlICovXHJcbiAgcHVibGljIGdldEFjY291bnRzKCk6IE9ic2VydmFibGU8c3RyaW5nW10+IHtcclxuICAgIHJldHVybiB0aGlzLmtleXN0b3JlcyQucGlwZShtYXAoa2V5TWFwID0+IE9iamVjdC5rZXlzKGtleU1hcCkpKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYW4gYWNjb3VudFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50cy5jcmVhdGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNhdmUgYW4gYWNjb3VudCBpbnRvIHRoZSBsb2NhbHN0b3JhZ2VcclxuICAgKiBAcGFyYW0gYWNjb3VudCBUaGUga2V5IHBhaXIgYWNjb3VudFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdG8gZW5jcnlwdCB0aGUgYWNjb3VudCB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNhdmUoYWNjb3VudDogRXRoQWNjb3VudCwgcGFzc3dvcmQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgeyBhZGRyZXNzLCBwcml2YXRlS2V5IH0gPSBhY2NvdW50O1xyXG4gICAgY29uc3Qga2V5c3RvcmUgPSB0aGlzLmVuY3J5cHQocHJpdmF0ZUtleSwgcGFzc3dvcmQpO1xyXG4gICAgLy8gVXBkYXRlIGFsbEtleXN0b3JlXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShhZGRyZXNzLCBKU09OLnN0cmluZ2lmeShrZXlzdG9yZSkpO1xyXG4gICAgdGhpcy5sb2NhbEtleXN0b3JlLm5leHQodGhpcy5nZXRLZXlzdG9yZU1hcEZyb21Mb2NhbFN0b3JhZ2UoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNyeXB0IGFuIHByaXZhdGUga2V5IGludG8gYSBrZXlzdG9yZVxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBlbmNyeXB0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBlbmNyeXB0IHRoZSBwcml2YXRlIGtleSB3aXRoXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgQSBsaXN0IG9mIG9wdGlvbnMgdG8gZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKi9cclxuICBwdWJsaWMgZW5jcnlwdChwcml2YXRlS2V5OiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYXJ0aWFsPEVuY3J5cHRPcHRpb25zPikge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudHMuZW5jcnlwdChwcml2YXRlS2V5LCBwYXNzd29yZCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNyeXB0IGEga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIGtleXN0b3JlIFRoZSBrZXlzdG9yZSBvYmplY3RcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGRlY3J5cHQgdGhlIGtleXN0b3JlIHdpdGhcclxuICAgKi9cclxuICBwdWJsaWMgZGVjcnlwdChrZXlzdG9yZTogS2V5c3RvcmUsIHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLmFjY291bnRzLmRlY3J5cHQoa2V5c3RvcmUsIHBhc3N3b3JkKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqXHJcbiAgICogVFJBTlNBQ1RJT05cclxuICAgKioqKioqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhIHRyYW5zYWN0aW9uIGJ5IHNpZ25pbmcgaXRcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHNlbmRcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgdHJhbnNhY3Rpb24gd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVHJhbnNhY3Rpb24odHg6IFR4T2JqZWN0LCBwcml2YXRlS2V5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHsgcmF3VHJhbnNhY3Rpb24gfSA9IHRoaXMuc2lnblR4KHR4LCBwcml2YXRlS2V5KTtcclxuICAgIHJldHVybiB0aGlzLnNlbmRSYXdUcmFuc2FjdGlvbihyYXdUcmFuc2FjdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGEgdHJhbnNhY3Rpb24gdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gcmF3VHggVGhlIHNpZ25lZCB0cmFuc2FjdGlvbiBkYXRhLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kUmF3VHJhbnNhY3Rpb24ocmF3VHg6IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX3NlbmRSYXdUcmFuc2FjdGlvbicsIFtyYXdUeF0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIHRyYW5zYWN0aW9uIHdpdGggYSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSB0eCBUaGUgdHJhbnNhY3Rpb24gdG8gc2lnblxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBzaWduIHRoZSB0cmFuc2FjdGlvbiB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNpZ25UeCh0eDogVHhPYmplY3QsIHByaXZhdGVLZXk6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMuc2lnbmVyLnNpZ25UeChwcml2YXRlS2V5LCB0eCwgdGhpcy5wcm92aWRlci5pZCk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKipcclxuICAgKiBTSUdOQVRVUkVcclxuICAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIG1lc3NhZ2VcclxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byBzaWduXHJcbiAgICogQHBhcmFtIGFkZHJlc3MgdGhlIGFkZHJlc3MgdG8gc2lnbiB0aGUgbWVzc2FnZSB3aXRoXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIHRoZSBwYXNzd29yZCBuZWVkZWQgdG8gZGVjcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKi9cclxuICBwdWJsaWMgc2lnbihtZXNzYWdlOiBzdHJpbmcsIGFkZHJlc3M6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMua2V5c3RvcmVzJC5waXBlKFxyXG4gICAgICBtYXAoa2V5c3RvcmVzID0+IGtleXN0b3Jlc1thZGRyZXNzXSksXHJcbiAgICAgIG1hcChrZXlzdG9yZSA9PiB0aGlzLmRlY3J5cHQoa2V5c3RvcmUsIHBhc3N3b3JkKSksXHJcbiAgICAgIG1hcChldGhBY2NvdW50ID0+IHRoaXMuc2lnbk1lc3NhZ2UobWVzc2FnZSwgZXRoQWNjb3VudC5wcml2YXRlS2V5KSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgbWVzc2FnZSB3aXRoIHRoZSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgbWVzc2FnZSB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNpZ25NZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgcHJpdmF0ZUtleTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBtZXNzYWdlSGFzaCA9IHRoaXMuc2lnbmVyLmhhc2hNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgY29uc3Qge3IsIHMsIHYsIHNpZ25hdHVyZX0gPSB0aGlzLnNpZ25lci5zaWduKHByaXZhdGVLZXksIG1lc3NhZ2VIYXNoKTtcclxuICAgIHJldHVybiB7bWVzc2FnZSwgbWVzc2FnZUhhc2gsIHYsIHIsIHMsIHNpZ25hdHVyZX07XHJcbiAgfVxyXG5cclxufVxyXG4iXSwibmFtZXMiOlsiQnVmZmVyIiwiYXNzZXJ0LmVxdWFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztZQUNDLFFBQVE7Ozs7Ozs7QUNEVDs7Ozs7Ozs7QUFhQTs7Ozs7SUFDUyxNQUFNLENBQUMsS0FBNEM7UUFDeEQsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO1lBQzFCLHVCQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7WUFDakIsS0FBSyxxQkFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENB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