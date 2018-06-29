(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('bn.js'), require('utf8')) :
    typeof define === 'function' && define.amd ? define('@ngeth/utils', ['exports', 'bn.js', 'utf8'], factory) :
    (factory((global.ngeth = global.ngeth || {}, global.ngeth.utils = {}),null,null));
}(this, (function (exports,BN,utf8) { 'use strict';

    var BN__default = 'default' in BN ? BN['default'] : BN;

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Returns true if given string is a valid log topic.
     * \@method isTopic
     * @param {?} topic
     * @return {?}
     */
    function isTopic(topic) {
        if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
            return false;
        }
        else if (/^(0x)?[0-9a-f]{64}$/.test(topic) ||
            /^(0x)?[0-9A-F]{64}$/.test(topic)) {
            return true;
        }
        return false;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Returns true if object is BN, otherwise false
     *
     * \@method isBN
     * @param {?} object
     * @return {?}
     */
    function isBN(object) {
        return (object instanceof BN__default ||
            (object && object.constructor && object.constructor.name === 'BN'));
    }
    /**
     * Returns true if object is BigNumber, otherwise false
     *
     * \@method isBigNumber
     * @param {?} object
     * @return {?}
     */
    function isBigNumber(object) {
        return (object && object.constructor && object.constructor.name === 'BigNumber');
    }
    /**
     * Takes an input and transforms it into an BN
     * @param {?} number
     * @return {?}
     */
    function toBN(number) {
        try {
            return numberToBN.apply(null, arguments);
        }
        catch (e) {
            throw new Error(e + " + ' Given value: " + number + " ");
        }
    }
    /**
     * Takes and input transforms it into BN and if it is negative value, into two's complement
     *
     * \@method toTwosComplement
     * @param {?} number
     * @return {?}
     */
    function toTwosComplement(number) {
        return ('0x' +
            toBN(number)
                .toTwos(256)
                .toString(16, 64));
    }
    /**
     * Convert integer or hex integer numbers to BN.js object instances. Does not supprot decimal numbers.
     * @param {?} arg
     * @return {?}
     */
    function numberToBN(arg) {
        if (typeof arg === 'string' || typeof arg === 'number') {
            var /** @type {?} */ multiplier = new BN__default(1);
            var /** @type {?} */ formattedString = String(arg)
                .toLowerCase()
                .trim();
            var /** @type {?} */ isPrefixed = formattedString.substr(0, 2) === '0x' ||
                formattedString.substr(0, 3) === '-0x';
            var /** @type {?} */ stringArg = stripHexPrefix(formattedString);
            if (stringArg.substr(0, 1) === '-') {
                stringArg = stripHexPrefix(stringArg.slice(1));
                multiplier = new BN__default(-1, 10);
            }
            stringArg = stringArg === '' ? '0' : stringArg;
            if ((!stringArg.match(/^-?[0-9]+$/) && stringArg.match(/^[0-9A-Fa-f]+$/)) ||
                stringArg.match(/^[a-fA-F]+$/) ||
                (isPrefixed === true && stringArg.match(/^[0-9A-Fa-f]+$/))) {
                return new BN__default(stringArg, 16).mul(multiplier);
            }
            if ((stringArg.match(/^-?[0-9]+$/) || stringArg === '') &&
                isPrefixed === false) {
                return new BN__default(stringArg, 10).mul(multiplier);
            }
        }
        else if (typeof arg === 'object' &&
            arg.toString &&
            (!arg['pop'] && !arg['push'])) {
            if (arg.toString().match(/^-?[0-9]+$/) &&
                (arg['mul'] || arg['dividedToIntegerBy'])) {
                return new BN__default(arg.toString(), 10);
            }
        }
        throw new Error("\n    [number-to-bn] while converting number " + JSON.stringify(arg) + " to BN.js instance,\n    error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance.\n    Note, decimals are not supported.\n  ");
    }
    /**
     * Removes '0x' from a given `String` if present
     * @param {?=} str the string value
     * @return {?} a string by pass if necessary
     */
    function stripHexPrefix(str) {
        if (typeof str !== 'string') {
            return str;
        }
        return isHexPrefixed(str) ? str.slice(2) : str;
    }
    /**
     * Returns a `Boolean` on whether or not the a `String` starts with '0x'
     * @throws if the str input is not a string
     * @param {?} str the string input value
     * @return {?} a boolean if it is or is not hex prefixed
     */
    function isHexPrefixed(str) {
        if (typeof str !== 'string') {
            throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + typeof str + ", while checking isHexPrefixed.");
        }
        return str.slice(0, 2) === '0x';
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Code from eth-lib/lib/hash
     * https://github.com/MaiaVictor/eth-lib/blob/master/lib/hash.js#L11
     */
    var /** @type {?} */ HEX_CHARS = '0123456789abcdef'.split('');
    var /** @type {?} */ KECCAK_PADDING = [1, 256, 65536, 16777216];
    var /** @type {?} */ SHIFT = [0, 8, 16, 24];
    var /** @type {?} */ RC = [
        1,
        0,
        32898,
        0,
        32906,
        2147483648,
        2147516416,
        2147483648,
        32907,
        0,
        2147483649,
        0,
        2147516545,
        2147483648,
        32777,
        2147483648,
        138,
        0,
        136,
        0,
        2147516425,
        0,
        2147483658,
        0,
        2147516555,
        0,
        139,
        2147483648,
        32905,
        2147483648,
        32771,
        2147483648,
        32770,
        2147483648,
        128,
        2147483648,
        32778,
        0,
        2147483658,
        2147483648,
        2147516545,
        2147483648,
        32896,
        2147483648,
        2147483649,
        0,
        2147516424,
        2147483648
    ];
    var /** @type {?} */ Keccak = function (bits) {
        return ({
            blocks: [],
            reset: true,
            block: 0,
            start: 0,
            blockCount: (1600 - (bits << 1)) >> 5,
            outputBlocks: bits >> 5,
            s: (function (s) { return [].concat(s, s, s, s, s); })([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        });
    };
    var /** @type {?} */ update = function (state, message) {
        var /** @type {?} */ length = message.length, /** @type {?} */ blocks = state.blocks, /** @type {?} */ byteCount = state.blockCount << 2, /** @type {?} */ blockCount = state.blockCount, /** @type {?} */ outputBlocks = state.outputBlocks, /** @type {?} */ s = state.s;
        var /** @type {?} */ index = 0, /** @type {?} */ i, /** @type {?} */ code;
        // update
        while (index < length) {
            if (state.reset) {
                state.reset = false;
                blocks[0] = state.block;
                for (i = 1; i < blockCount + 1; ++i) {
                    blocks[i] = 0;
                }
            }
            if (typeof message !== 'string') {
                for (i = state.start; index < length && i < byteCount; ++index) {
                    blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                }
            }
            else {
                for (i = state.start; index < length && i < byteCount; ++index) {
                    code = message.charCodeAt(index);
                    if (code < 0x80) {
                        blocks[i >> 2] |= code << SHIFT[i++ & 3];
                    }
                    else if (code < 0x800) {
                        blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    }
                    else if (code < 0xd800 || code >= 0xe000) {
                        blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    }
                    else {
                        code =
                            0x10000 +
                                (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                        blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    }
                }
            }
            state.lastByteIndex = i;
            if (i >= byteCount) {
                state.start = i - byteCount;
                state.block = blocks[blockCount];
                for (i = 0; i < blockCount; ++i) {
                    s[i] ^= blocks[i];
                }
                f(s);
                state.reset = true;
            }
            else {
                state.start = i;
            }
        }
        // finalize
        i = state.lastByteIndex;
        blocks[i >> 2] |= KECCAK_PADDING[i & 3];
        if (state.lastByteIndex === byteCount) {
            blocks[0] = blocks[blockCount];
            for (i = 1; i < blockCount + 1; ++i) {
                blocks[i] = 0;
            }
        }
        blocks[blockCount - 1] |= 0x80000000;
        for (i = 0; i < blockCount; ++i) {
            s[i] ^= blocks[i];
        }
        f(s);
        // toString
        var /** @type {?} */ hex = '', /** @type {?} */ j = 0, /** @type {?} */ block;
        while (j < outputBlocks) {
            for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
                block = s[i];
                hex +=
                    HEX_CHARS[(block >> 4) & 0x0f] +
                        HEX_CHARS[block & 0x0f] +
                        HEX_CHARS[(block >> 12) & 0x0f] +
                        HEX_CHARS[(block >> 8) & 0x0f] +
                        HEX_CHARS[(block >> 20) & 0x0f] +
                        HEX_CHARS[(block >> 16) & 0x0f] +
                        HEX_CHARS[(block >> 28) & 0x0f] +
                        HEX_CHARS[(block >> 24) & 0x0f];
            }
            if (j % blockCount === 0) {
                f(s);
                i = 0;
            }
        }
        return '0x' + hex;
    };
    var /** @type {?} */ f = function (s) {
        var /** @type {?} */ h, /** @type {?} */ l, /** @type {?} */ n, /** @type {?} */ c0, /** @type {?} */ c1, /** @type {?} */ c2, /** @type {?} */ c3, /** @type {?} */ c4, /** @type {?} */ c5, /** @type {?} */ c6, /** @type {?} */ c7, /** @type {?} */ c8, /** @type {?} */ c9, /** @type {?} */ b0, /** @type {?} */ b1, /** @type {?} */ b2, /** @type {?} */ b3, /** @type {?} */ b4, /** @type {?} */ b5, /** @type {?} */ b6, /** @type {?} */ b7, /** @type {?} */ b8, /** @type {?} */ b9, /** @type {?} */ b10, /** @type {?} */ b11, /** @type {?} */ b12, /** @type {?} */ b13, /** @type {?} */ b14, /** @type {?} */ b15, /** @type {?} */ b16, /** @type {?} */ b17, /** @type {?} */ b18, /** @type {?} */ b19, /** @type {?} */ b20, /** @type {?} */ b21, /** @type {?} */ b22, /** @type {?} */ b23, /** @type {?} */ b24, /** @type {?} */ b25, /** @type {?} */ b26, /** @type {?} */ b27, /** @type {?} */ b28, /** @type {?} */ b29, /** @type {?} */ b30, /** @type {?} */ b31, /** @type {?} */ b32, /** @type {?} */ b33, /** @type {?} */ b34, /** @type {?} */ b35, /** @type {?} */ b36, /** @type {?} */ b37, /** @type {?} */ b38, /** @type {?} */ b39, /** @type {?} */ b40, /** @type {?} */ b41, /** @type {?} */ b42, /** @type {?} */ b43, /** @type {?} */ b44, /** @type {?} */ b45, /** @type {?} */ b46, /** @type {?} */ b47, /** @type {?} */ b48, /** @type {?} */ b49;
        for (n = 0; n < 48; n += 2) {
            c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
            c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
            c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
            c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
            c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
            c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
            c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
            c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
            c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
            c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
            h = c8 ^ ((c2 << 1) | (c3 >>> 31));
            l = c9 ^ ((c3 << 1) | (c2 >>> 31));
            s[0] ^= h;
            s[1] ^= l;
            s[10] ^= h;
            s[11] ^= l;
            s[20] ^= h;
            s[21] ^= l;
            s[30] ^= h;
            s[31] ^= l;
            s[40] ^= h;
            s[41] ^= l;
            h = c0 ^ ((c4 << 1) | (c5 >>> 31));
            l = c1 ^ ((c5 << 1) | (c4 >>> 31));
            s[2] ^= h;
            s[3] ^= l;
            s[12] ^= h;
            s[13] ^= l;
            s[22] ^= h;
            s[23] ^= l;
            s[32] ^= h;
            s[33] ^= l;
            s[42] ^= h;
            s[43] ^= l;
            h = c2 ^ ((c6 << 1) | (c7 >>> 31));
            l = c3 ^ ((c7 << 1) | (c6 >>> 31));
            s[4] ^= h;
            s[5] ^= l;
            s[14] ^= h;
            s[15] ^= l;
            s[24] ^= h;
            s[25] ^= l;
            s[34] ^= h;
            s[35] ^= l;
            s[44] ^= h;
            s[45] ^= l;
            h = c4 ^ ((c8 << 1) | (c9 >>> 31));
            l = c5 ^ ((c9 << 1) | (c8 >>> 31));
            s[6] ^= h;
            s[7] ^= l;
            s[16] ^= h;
            s[17] ^= l;
            s[26] ^= h;
            s[27] ^= l;
            s[36] ^= h;
            s[37] ^= l;
            s[46] ^= h;
            s[47] ^= l;
            h = c6 ^ ((c0 << 1) | (c1 >>> 31));
            l = c7 ^ ((c1 << 1) | (c0 >>> 31));
            s[8] ^= h;
            s[9] ^= l;
            s[18] ^= h;
            s[19] ^= l;
            s[28] ^= h;
            s[29] ^= l;
            s[38] ^= h;
            s[39] ^= l;
            s[48] ^= h;
            s[49] ^= l;
            b0 = s[0];
            b1 = s[1];
            b32 = (s[11] << 4) | (s[10] >>> 28);
            b33 = (s[10] << 4) | (s[11] >>> 28);
            b14 = (s[20] << 3) | (s[21] >>> 29);
            b15 = (s[21] << 3) | (s[20] >>> 29);
            b46 = (s[31] << 9) | (s[30] >>> 23);
            b47 = (s[30] << 9) | (s[31] >>> 23);
            b28 = (s[40] << 18) | (s[41] >>> 14);
            b29 = (s[41] << 18) | (s[40] >>> 14);
            b20 = (s[2] << 1) | (s[3] >>> 31);
            b21 = (s[3] << 1) | (s[2] >>> 31);
            b2 = (s[13] << 12) | (s[12] >>> 20);
            b3 = (s[12] << 12) | (s[13] >>> 20);
            b34 = (s[22] << 10) | (s[23] >>> 22);
            b35 = (s[23] << 10) | (s[22] >>> 22);
            b16 = (s[33] << 13) | (s[32] >>> 19);
            b17 = (s[32] << 13) | (s[33] >>> 19);
            b48 = (s[42] << 2) | (s[43] >>> 30);
            b49 = (s[43] << 2) | (s[42] >>> 30);
            b40 = (s[5] << 30) | (s[4] >>> 2);
            b41 = (s[4] << 30) | (s[5] >>> 2);
            b22 = (s[14] << 6) | (s[15] >>> 26);
            b23 = (s[15] << 6) | (s[14] >>> 26);
            b4 = (s[25] << 11) | (s[24] >>> 21);
            b5 = (s[24] << 11) | (s[25] >>> 21);
            b36 = (s[34] << 15) | (s[35] >>> 17);
            b37 = (s[35] << 15) | (s[34] >>> 17);
            b18 = (s[45] << 29) | (s[44] >>> 3);
            b19 = (s[44] << 29) | (s[45] >>> 3);
            b10 = (s[6] << 28) | (s[7] >>> 4);
            b11 = (s[7] << 28) | (s[6] >>> 4);
            b42 = (s[17] << 23) | (s[16] >>> 9);
            b43 = (s[16] << 23) | (s[17] >>> 9);
            b24 = (s[26] << 25) | (s[27] >>> 7);
            b25 = (s[27] << 25) | (s[26] >>> 7);
            b6 = (s[36] << 21) | (s[37] >>> 11);
            b7 = (s[37] << 21) | (s[36] >>> 11);
            b38 = (s[47] << 24) | (s[46] >>> 8);
            b39 = (s[46] << 24) | (s[47] >>> 8);
            b30 = (s[8] << 27) | (s[9] >>> 5);
            b31 = (s[9] << 27) | (s[8] >>> 5);
            b12 = (s[18] << 20) | (s[19] >>> 12);
            b13 = (s[19] << 20) | (s[18] >>> 12);
            b44 = (s[29] << 7) | (s[28] >>> 25);
            b45 = (s[28] << 7) | (s[29] >>> 25);
            b26 = (s[38] << 8) | (s[39] >>> 24);
            b27 = (s[39] << 8) | (s[38] >>> 24);
            b8 = (s[48] << 14) | (s[49] >>> 18);
            b9 = (s[49] << 14) | (s[48] >>> 18);
            s[0] = b0 ^ (~b2 & b4);
            s[1] = b1 ^ (~b3 & b5);
            s[10] = b10 ^ (~b12 & b14);
            s[11] = b11 ^ (~b13 & b15);
            s[20] = b20 ^ (~b22 & b24);
            s[21] = b21 ^ (~b23 & b25);
            s[30] = b30 ^ (~b32 & b34);
            s[31] = b31 ^ (~b33 & b35);
            s[40] = b40 ^ (~b42 & b44);
            s[41] = b41 ^ (~b43 & b45);
            s[2] = b2 ^ (~b4 & b6);
            s[3] = b3 ^ (~b5 & b7);
            s[12] = b12 ^ (~b14 & b16);
            s[13] = b13 ^ (~b15 & b17);
            s[22] = b22 ^ (~b24 & b26);
            s[23] = b23 ^ (~b25 & b27);
            s[32] = b32 ^ (~b34 & b36);
            s[33] = b33 ^ (~b35 & b37);
            s[42] = b42 ^ (~b44 & b46);
            s[43] = b43 ^ (~b45 & b47);
            s[4] = b4 ^ (~b6 & b8);
            s[5] = b5 ^ (~b7 & b9);
            s[14] = b14 ^ (~b16 & b18);
            s[15] = b15 ^ (~b17 & b19);
            s[24] = b24 ^ (~b26 & b28);
            s[25] = b25 ^ (~b27 & b29);
            s[34] = b34 ^ (~b36 & b38);
            s[35] = b35 ^ (~b37 & b39);
            s[44] = b44 ^ (~b46 & b48);
            s[45] = b45 ^ (~b47 & b49);
            s[6] = b6 ^ (~b8 & b0);
            s[7] = b7 ^ (~b9 & b1);
            s[16] = b16 ^ (~b18 & b10);
            s[17] = b17 ^ (~b19 & b11);
            s[26] = b26 ^ (~b28 & b20);
            s[27] = b27 ^ (~b29 & b21);
            s[36] = b36 ^ (~b38 & b30);
            s[37] = b37 ^ (~b39 & b31);
            s[46] = b46 ^ (~b48 & b40);
            s[47] = b47 ^ (~b49 & b41);
            s[8] = b8 ^ (~b0 & b2);
            s[9] = b9 ^ (~b1 & b3);
            s[18] = b18 ^ (~b10 & b12);
            s[19] = b19 ^ (~b11 & b13);
            s[28] = b28 ^ (~b20 & b22);
            s[29] = b29 ^ (~b21 & b23);
            s[38] = b38 ^ (~b30 & b32);
            s[39] = b39 ^ (~b31 & b33);
            s[48] = b48 ^ (~b40 & b42);
            s[49] = b49 ^ (~b41 & b43);
            s[0] ^= RC[n];
            s[1] ^= RC[n + 1];
        }
    };
    var /** @type {?} */ keccak = function (bits) {
        /**
           * If str is a string it must have '0x'
           */
        return function (str) {
            var /** @type {?} */ msg;
            if (typeof str === 'string' && str.slice(0, 2) === '0x') {
                msg = [];
                for (var /** @type {?} */ i = 2, /** @type {?} */ l = str.length; i < l; i += 2) {
                    msg.push(parseInt(str.slice(i, i + 2), 16));
                }
            }
            else {
                msg = str;
            }
            return update(Keccak(bits), msg);
        };
    };
    var /** @type {?} */ keccak256 = keccak(256);

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Checks if the given string is an address
     * \@method isAddress
     * @param {?} address the given HEX address
     * @return {?}
     */
    function isAddress(address) {
        // check if it has the basic requirements of an address
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            return false;
            // If it's ALL lowercase or ALL upppercase
        }
        else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
            /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
            return true;
            // Otherwise check each case
        }
        else {
            return checkAddressChecksum(address);
        }
    }
    /**
     * Checks if the given string is a checksummed address
     *
     * \@method checkAddressChecksum
     * @param {?} address the given HEX address
     * @return {?}
     */
    function checkAddressChecksum(address) {
        // Check each case
        address = address.replace(/^0x/i, '');
        var /** @type {?} */ addressHash = sha3(address.toLowerCase()).replace(/^0x/i, '');
        for (var /** @type {?} */ i = 0; i < 40; i++) {
            // the nth letter should be uppercase if the nth digit of casemap is 1
            if ((parseInt(addressHash[i], 16) > 7 &&
                address[i].toUpperCase() !== address[i]) ||
                (parseInt(addressHash[i], 16) <= 7 &&
                    address[i].toLowerCase() !== address[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     * Converts to a checksum address
     *
     * \@method toChecksumAddress
     * @param {?} address the given HEX address
     * @return {?}
     */
    function toChecksumAddress(address) {
        if (typeof address === 'undefined') {
            return '';
        }
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            throw new Error("Given address " + address + " is not a valid Ethereum address.");
        }
        address = address.toLowerCase().replace(/^0x/i, '');
        var /** @type {?} */ addressHash = sha3(address).replace(/^0x/i, '');
        var /** @type {?} */ checksumAddress = '0x';
        for (var /** @type {?} */ i = 0; i < address.length; i++) {
            // If ith character is 9 to f then make it uppercase
            if (parseInt(addressHash[i], 16) > 7) {
                checksumAddress += address[i].toUpperCase();
            }
            else {
                checksumAddress += address[i];
            }
        }
        return checksumAddress;
    }
    /**
     * Should be called to pad string to expected length
     *
     * \@method leftPad
     * @param {?} string to be padded
     * @param {?} chars that result string should have
     * @param {?} sign
     * @return {?} right aligned string
     */
    function leftPad(string, chars, sign) {
        var /** @type {?} */ hasPrefix = /^0x/i.test(string) || typeof string === 'number';
        string = ((string)).toString(16).replace(/^0x/i, '');
        var /** @type {?} */ padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
        return ((hasPrefix ? '0x' : '') +
            new Array(padding).join(sign ? sign : '0') +
            string);
    }
    /**
     * Should be called to pad string to expected length
     *
     * \@method rightPad
     * @param {?} string to be padded
     * @param {?} chars that result string should have
     * @param {?} sign
     * @return {?} right aligned string
     */
    function rightPad(string, chars, sign) {
        var /** @type {?} */ hasPrefix = /^0x/i.test(string) || typeof string === 'number';
        string = ((string)).toString(16).replace(/^0x/i, '');
        var /** @type {?} */ padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
        return ((hasPrefix ? '0x' : '') +
            string +
            new Array(padding).join(sign ? sign : '0'));
    }
    /**
     * *****************************
     * SHA3
     */
    var /** @type {?} */ SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
    /**
     * Hashes values to a sha3 hash using keccak 256
     * To hash a HEX string the hex must have 0x in front.
     * \@method sha3
     * @param {?} value
     * @return {?} the sha3 string
     */
    function sha3(value) {
        if (isHexStrict(value) && /^0x/i.test(value.toString())) {
            value = /** @type {?} */ (hexToBytes(value));
        }
        var /** @type {?} */ returnValue = keccak256(value);
        if (returnValue === SHA3_NULL_S) {
            return null;
        }
        else {
            return returnValue;
        }
    }
    /**
     * Should be called to get hex representation (prefixed by 0x) of utf8 string
     *
     * \@method utf8ToHex
     * @param {?} str
     * @return {?} hex representation of input string
     */
    function utf8ToHex(str) {
        str = utf8.encode(str);
        var /** @type {?} */ hex = '';
        // remove \u0000 padding from either side
        str = str.replace(/^(?:\u0000)*/, '');
        str = str
            .split('')
            .reverse()
            .join('');
        str = str.replace(/^(?:\u0000)*/, '');
        str = str
            .split('')
            .reverse()
            .join('');
        for (var /** @type {?} */ i = 0; i < str.length; i++) {
            var /** @type {?} */ code = str.charCodeAt(i);
            // if (code !== 0) {
            var /** @type {?} */ n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
            // }
        }
        return '0x' + hex;
    }
    /**
     * Should be called to get utf8 from it's hex representation
     * \@method hexToUtf8
     * @param {?} hex
     * @return {?}
     */
    function hexToUtf8(hex) {
        if (!isHexStrict(hex)) {
            throw new Error("The parameter " + hex + " must be a valid HEX string.");
        }
        var /** @type {?} */ str = '';
        var /** @type {?} */ code = 0;
        hex = hex.replace(/^0x/i, '');
        // remove 00 padding from either side
        hex = hex.replace(/^(?:00)*/, '');
        hex = hex
            .split('')
            .reverse()
            .join('');
        hex = hex.replace(/^(?:00)*/, '');
        hex = hex
            .split('')
            .reverse()
            .join('');
        var /** @type {?} */ l = hex.length;
        for (var /** @type {?} */ i = 0; i < l; i += 2) {
            code = parseInt(hex.substr(i, 2), 16);
            // if (code !== 0) {
            str += String.fromCharCode(code);
            // }
        }
        return utf8.decode(str);
    }
    /**
     * Converts value to it's number representation
     * \@method hexToNumber
     * @param {?} value
     * @return {?}
     */
    function hexToNumber(value) {
        if (!value) {
            return value;
        }
        return new BN__default(value, 16).toNumber();
    }
    /**
     * Converts value to it's decimal representation in string
     * \@method hexToNumberString
     * @param {?} value
     * @return {?}
     */
    function hexToNumberString(value) {
        if (!value) {
            return value;
        }
        return new BN__default(value, 16).toString(10);
    }
    /**
     * Converts value to it's hex representation
     * \@method numberToHex
     * @param {?} value
     * @return {?}
     */
    function numberToHex(value) {
        if (typeof value === 'undefined' || value === 'null') {
            return value;
        }
        if (!isFinite(value) && !isHexStrict(value)) {
            throw new Error("Given input " + value + " is not a number.");
        }
        var /** @type {?} */ number = toBN(value);
        var /** @type {?} */ result = number.toString(16);
        return number.lt(new BN__default(0)) ? '-0x' + result.substr(1) : '0x' + result;
    }
    /**
     * Convert a byte array to a hex string
     * Note: Implementation from crypto-js
     * \@method bytesToHex
     * @param {?} bytes
     * @return {?} the hex string
     */
    function bytesToHex(bytes) {
        var /** @type {?} */ hex = [];
        for (var /** @type {?} */ i = 0; i < bytes.length; i++) {
            /* tslint:disable */
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xf).toString(16));
            /* tslint:enable  */
        }
        return '0x' + hex.join('');
    }
    /**
     * Convert a hex string to a byte array
     * Note: Implementation from crypto-js
     * \@method hexToBytes
     * @param {?} hex
     * @return {?} the byte array
     */
    function hexToBytes(hex) {
        hex = ((hex)).toString(16);
        if (!isHexStrict(hex)) {
            throw new Error("Given value " + hex + " is not a valid hex string.");
        }
        hex = hex.replace(/^0x/i, '');
        var /** @type {?} */ bytes = [];
        for (var /** @type {?} */ c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    }
    /**
     * Should be called to get ascii from it's hex representation
     *
     * \@method hexToAscii
     * @param {?} hex
     * @return {?} ascii string representation of hex value
     */
    function hexToAscii(hex) {
        if (!isHexStrict(hex)) {
            throw new Error('The parameter must be a valid HEX string.');
        }
        var /** @type {?} */ str = '';
        var /** @type {?} */ i = 0;
        var /** @type {?} */ l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i += 2) {
            var /** @type {?} */ code = parseInt(hex.substr(i, 2), 16);
            str += String.fromCharCode(code);
        }
        return str;
    }
    /**
     * Should be called to get hex representation (prefixed by 0x) of ascii string
     *
     * \@method asciiToHex
     * @param {?} str
     * @return {?} hex representation of input string
     */
    function asciiToHex(str) {
        if (!str) {
            return '0x00';
        }
        var /** @type {?} */ hex = '';
        for (var /** @type {?} */ i = 0; i < str.length; i++) {
            var /** @type {?} */ code = str.charCodeAt(i);
            var /** @type {?} */ n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }
        return '0x' + hex;
    }
    /**
     * Auto converts any given value into it's hex representation.
     *
     * And even stringifys objects before.
     *
     * \@method toHex
     * @param {?} value
     * @param {?=} returnType
     * @return {?}
     */
    function toHex(value, returnType) {
        /*jshint maxcomplexity: false */
        if (isAddress(value)) {
            return returnType
                ? 'address'
                : '0x' + value.toLowerCase().replace(/^0x/i, '');
        }
        if (typeof value === 'boolean') {
            return returnType ? 'bool' : value ? '0x01' : '0x00';
        }
        if (typeof value === 'object' && !isBigNumber(value) && !isBN(value)) {
            return returnType ? 'string' : utf8ToHex(JSON.stringify(value));
        }
        // if its a negative number, pass it through numberToHex
        if (typeof value === 'string') {
            if (value.indexOf('-0x') === 0 || value.indexOf('-0X') === 0) {
                return returnType ? 'int256' : numberToHex(value);
            }
            else if (value.indexOf('0x') === 0 || value.indexOf('0X') === 0) {
                return returnType ? 'bytes' : value;
            }
            else if (!isFinite(/** @type {?} */ (value))) {
                return returnType ? 'string' : utf8ToHex(value);
            }
        }
        return returnType ? (value < 0 ? 'int256' : 'uint256') : numberToHex(value);
    }
    /**
     * Check if string is HEX, requires a 0x in front
     *
     * \@method isHexStrict
     * @param {?} hex to be checked
     * @return {?}
     */
    function isHexStrict(hex) {
        return (typeof hex === 'string' ||
            (typeof hex === 'number' && /^(-)?0x[0-9a-f]*$/i.test(hex)));
    }
    /**
     * Check if string is HEX
     *
     * \@method isHex
     * @param {?} hex to be checked
     * @return {?}
     */
    function isHex(hex) {
        return (typeof hex === 'string' ||
            (typeof hex === 'number' && /^(-0x|0x)?[0-9a-f]*$/i.test(hex)));
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var Block = (function () {
        function Block(ethBlock) {
            this.number = hexToNumber(ethBlock.number);
            this.hash = ethBlock.hash;
            this.parentHash = ethBlock.parentHash;
            this.nonce = ethBlock.nonce;
            this.sha3Uncles = ethBlock.sha3Uncles;
            this.logsBloom = ethBlock.logsBloom;
            this.transactionsRoot = ethBlock.transactionsRoot;
            this.stateRoot = ethBlock.stateRoot;
            this.receiptsRoot = ethBlock.receiptsRoot;
            this.miner = ethBlock.miner;
            this.difficulty = hexToNumber(ethBlock.difficulty);
            this.totalDifficulty = hexToNumber(ethBlock.totalDifficulty);
            this.size = hexToNumber(ethBlock.size);
            this.extraData = ethBlock.extraData;
            this.gasLimit = hexToNumber(ethBlock.gasLimit);
            this.gasUsed = hexToNumber(ethBlock.gasUsed);
            this.timestamp = hexToNumber(ethBlock.timestamp);
            this.transactions = ethBlock.transactions;
            this.uncles = ethBlock.uncles;
        }
        return Block;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var Transaction = (function () {
        function Transaction(ethTx) {
            this.hash = ethTx.hash;
            this.nonce = hexToNumber(ethTx.nonce);
            this.blockHash = ethTx.blockHash;
            this.blockNumber = hexToNumber(ethTx.blockNumber);
            this.transactionIndex = hexToNumber(ethTx.transactionIndex);
            this.from = ethTx.from;
            this.to = ethTx.to;
            this.value = toBN(ethTx.value).toString(10);
            this.gas = hexToNumber(ethTx.gas);
            this.gasPrice = hexToNumber(ethTx.gasPrice);
            this.input = ethTx.input;
        }
        return Transaction;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var TxLogs = (function () {
        function TxLogs(ethTxLogs) {
            this.data = ethTxLogs.data;
            this.topics = ethTxLogs.topics;
            this.logIndex = hexToNumber(ethTxLogs.logIndex);
            this.transactionIndex = hexToNumber(ethTxLogs.transactionIndex);
            this.transactionHash = ethTxLogs.transactionHash;
            this.blockHash = ethTxLogs.blockHash;
            this.blockNumber = hexToNumber(ethTxLogs.blockNumber);
            this.address = ethTxLogs.address;
        }
        return TxLogs;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var TxReceipt = (function () {
        function TxReceipt(ethTxReceipt) {
            if (ethTxReceipt.status) {
                this.status = hexToNumber(ethTxReceipt.status) === 1 ? true : false;
            }
            else {
                this.root = ethTxReceipt.root;
            }
            this.transactionHash = ethTxReceipt.transactionHash;
            this.transactionIndex = hexToNumber(ethTxReceipt.transactionIndex);
            this.blockHash = ethTxReceipt.blockHash;
            this.blockNumber = hexToNumber(ethTxReceipt.blockNumber);
            this.contractAddress = ethTxReceipt.contractAddress;
            this.cumulativeGasUsed = hexToNumber(ethTxReceipt.cumulativeGasUsed);
            this.gasUsed = hexToNumber(ethTxReceipt.gasUsed);
            this.logs = ethTxReceipt.logs.map(function (log) { return new TxLogs(log); });
            this.logsBloom = ethTxReceipt.logsBloom;
        }
        return TxReceipt;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var TxObject = (function () {
        function TxObject(tx) {
            if (tx.from)
                this.from = tx.from;
            if (tx.to)
                this.to = tx.to;
            if (tx.data)
                this.data = tx.data;
            if (tx.gas)
                this.gas = new BN.BN(tx.gas, 10).toString(16);
            if (tx.gasPrice)
                this.gasPrice = new BN.BN(tx.gasPrice, 10).toString(16);
            if (tx.value)
                this.value = new BN.BN(tx.value, 10).toString(16);
            if (tx.nonce)
                this.nonce = new BN.BN(tx.nonce, 10).toString(16);
        }
        return TxObject;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.Block = Block;
    exports.Transaction = Transaction;
    exports.TxReceipt = TxReceipt;
    exports.TxLogs = TxLogs;
    exports.TxObject = TxObject;
    exports.isTopic = isTopic;
    exports.isAddress = isAddress;
    exports.checkAddressChecksum = checkAddressChecksum;
    exports.toChecksumAddress = toChecksumAddress;
    exports.leftPad = leftPad;
    exports.rightPad = rightPad;
    exports.sha3 = sha3;
    exports.utf8ToHex = utf8ToHex;
    exports.hexToUtf8 = hexToUtf8;
    exports.hexToNumber = hexToNumber;
    exports.hexToNumberString = hexToNumberString;
    exports.numberToHex = numberToHex;
    exports.bytesToHex = bytesToHex;
    exports.hexToBytes = hexToBytes;
    exports.hexToAscii = hexToAscii;
    exports.asciiToHex = asciiToHex;
    exports.toHex = toHex;
    exports.isHexStrict = isHexStrict;
    exports.isHex = isHex;
    exports.isBN = isBN;
    exports.isBigNumber = isBigNumber;
    exports.toBN = toBN;
    exports.toTwosComplement = toTwosComplement;
    exports.keccak256 = keccak256;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtdXRpbHMudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AbmdldGgvdXRpbHMvbGliL3V0aWxzL2Jsb2NrLnRzIiwibmc6Ly9AbmdldGgvdXRpbHMvbGliL3V0aWxzL2JuLnRzIiwibmc6Ly9AbmdldGgvdXRpbHMvbGliL3V0aWxzL2tlY2NhY2sudHMiLCJuZzovL0BuZ2V0aC91dGlscy9saWIvdXRpbHMvaGV4LnRzIiwibmc6Ly9AbmdldGgvdXRpbHMvbGliL2Zvcm1hdHRlcnMvYmxvY2sudHMiLCJuZzovL0BuZ2V0aC91dGlscy9saWIvZm9ybWF0dGVycy90cmFuc2FjdGlvbi50cyIsIm5nOi8vQG5nZXRoL3V0aWxzL2xpYi9mb3JtYXR0ZXJzL3R4LWxvZ3MudHMiLCJuZzovL0BuZ2V0aC91dGlscy9saWIvZm9ybWF0dGVycy90eC1yZWNlaXB0LnRzIiwibmc6Ly9AbmdldGgvdXRpbHMvbGliL2Zvcm1hdHRlcnMvdHgtb2JqZWN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgZ2l2ZW4gc3RyaW5nIGlzIGEgdmFsaWQgRXRoZXJldW0gYmxvY2sgaGVhZGVyIGJsb29tLlxyXG4gKiBAbWV0aG9kIGlzQmxvb21cclxuICogQHBhcmFtIGhleCBlbmNvZGVkIGJsb29tIGZpbHRlclxyXG4gKi9cclxuZnVuY3Rpb24gaXNCbG9vbShibG9vbTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgaWYgKCEvXigweCk/WzAtOWEtZl17NTEyfSQvaS50ZXN0KGJsb29tKSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICAvXigweCk/WzAtOWEtZl17NTEyfSQvLnRlc3QoYmxvb20pIHx8XHJcbiAgICAvXigweCk/WzAtOUEtRl17NTEyfSQvLnRlc3QoYmxvb20pXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIGdpdmVuIHN0cmluZyBpcyBhIHZhbGlkIGxvZyB0b3BpYy5cclxuICogQG1ldGhvZCBpc1RvcGljXHJcbiAqIEBwYXJhbSBoZXggZW5jb2RlZCB0b3BpY1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVG9waWModG9waWM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIGlmICghL14oMHgpP1swLTlhLWZdezY0fSQvaS50ZXN0KHRvcGljKSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICAvXigweCk/WzAtOWEtZl17NjR9JC8udGVzdCh0b3BpYykgfHxcclxuICAgIC9eKDB4KT9bMC05QS1GXXs2NH0kLy50ZXN0KHRvcGljKVxyXG4gICkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG4iLCJpbXBvcnQgQk4gZnJvbSAnYm4uanMnO1xyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBCTiwgb3RoZXJ3aXNlIGZhbHNlXHJcbiAqXHJcbiAqIEBtZXRob2QgaXNCTlxyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNCTihvYmplY3Q6IE9iamVjdCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBvYmplY3QgaW5zdGFuY2VvZiBCTiB8fFxyXG4gICAgKG9iamVjdCAmJiBvYmplY3QuY29uc3RydWN0b3IgJiYgb2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgPT09ICdCTicpXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgQmlnTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcclxuICpcclxuICogQG1ldGhvZCBpc0JpZ051bWJlclxyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNCaWdOdW1iZXIob2JqZWN0OiBPYmplY3QpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgb2JqZWN0ICYmIG9iamVjdC5jb25zdHJ1Y3RvciAmJiBvYmplY3QuY29uc3RydWN0b3IubmFtZSA9PT0gJ0JpZ051bWJlcidcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogVGFrZXMgYW4gaW5wdXQgYW5kIHRyYW5zZm9ybXMgaXQgaW50byBhbiBCTlxyXG4gKiBAcGFyYW0gbnVtYmVyLCBzdHJpbmcsIEhFWCBzdHJpbmcgb3IgQk5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0JOKG51bWJlcjogbnVtYmVyIHwgc3RyaW5nIHwgQk4pOiBCTiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBudW1iZXJUb0JOLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGAke2V9ICsgJyBHaXZlbiB2YWx1ZTogJHtudW1iZXJ9IGApO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRha2VzIGFuZCBpbnB1dCB0cmFuc2Zvcm1zIGl0IGludG8gQk4gYW5kIGlmIGl0IGlzIG5lZ2F0aXZlIHZhbHVlLCBpbnRvIHR3bydzIGNvbXBsZW1lbnRcclxuICpcclxuICogQG1ldGhvZCB0b1R3b3NDb21wbGVtZW50XHJcbiAqIEBwYXJhbSBudW1iZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0b1R3b3NDb21wbGVtZW50KG51bWJlcjogbnVtYmVyIHwgc3RyaW5nIHwgQk4pOiBzdHJpbmcge1xyXG4gIHJldHVybiAoXHJcbiAgICAnMHgnICtcclxuICAgIHRvQk4obnVtYmVyKVxyXG4gICAgICAudG9Ud29zKDI1NilcclxuICAgICAgLnRvU3RyaW5nKDE2LCA2NClcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBpbnRlZ2VyIG9yIGhleCBpbnRlZ2VyIG51bWJlcnMgdG8gQk4uanMgb2JqZWN0IGluc3RhbmNlcy4gRG9lcyBub3Qgc3VwcHJvdCBkZWNpbWFsIG51bWJlcnMuXHJcbiAqIEBwYXJhbSBhcmdcclxuICovXHJcbmZ1bmN0aW9uIG51bWJlclRvQk4oYXJnOiBzdHJpbmcgfCBudW1iZXIgfCBvYmplY3QpIHtcclxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcclxuICAgIGxldCBtdWx0aXBsaWVyID0gbmV3IEJOKDEpO1xyXG4gICAgY29uc3QgZm9ybWF0dGVkU3RyaW5nID0gU3RyaW5nKGFyZylcclxuICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgLnRyaW0oKTtcclxuICAgIGNvbnN0IGlzUHJlZml4ZWQgPVxyXG4gICAgICBmb3JtYXR0ZWRTdHJpbmcuc3Vic3RyKDAsIDIpID09PSAnMHgnIHx8XHJcbiAgICAgIGZvcm1hdHRlZFN0cmluZy5zdWJzdHIoMCwgMykgPT09ICctMHgnO1xyXG4gICAgbGV0IHN0cmluZ0FyZyA9IHN0cmlwSGV4UHJlZml4KGZvcm1hdHRlZFN0cmluZyk7XHJcbiAgICBpZiAoc3RyaW5nQXJnLnN1YnN0cigwLCAxKSA9PT0gJy0nKSB7XHJcbiAgICAgIHN0cmluZ0FyZyA9IHN0cmlwSGV4UHJlZml4KHN0cmluZ0FyZy5zbGljZSgxKSk7XHJcbiAgICAgIG11bHRpcGxpZXIgPSBuZXcgQk4oLTEsIDEwKTtcclxuICAgIH1cclxuICAgIHN0cmluZ0FyZyA9IHN0cmluZ0FyZyA9PT0gJycgPyAnMCcgOiBzdHJpbmdBcmc7XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICAoIXN0cmluZ0FyZy5tYXRjaCgvXi0/WzAtOV0rJC8pICYmIHN0cmluZ0FyZy5tYXRjaCgvXlswLTlBLUZhLWZdKyQvKSkgfHxcclxuICAgICAgc3RyaW5nQXJnLm1hdGNoKC9eW2EtZkEtRl0rJC8pIHx8XHJcbiAgICAgIChpc1ByZWZpeGVkID09PSB0cnVlICYmIHN0cmluZ0FyZy5tYXRjaCgvXlswLTlBLUZhLWZdKyQvKSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gbmV3IEJOKHN0cmluZ0FyZywgMTYpLm11bChtdWx0aXBsaWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoXHJcbiAgICAgIChzdHJpbmdBcmcubWF0Y2goL14tP1swLTldKyQvKSB8fCBzdHJpbmdBcmcgPT09ICcnKSAmJlxyXG4gICAgICBpc1ByZWZpeGVkID09PSBmYWxzZVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQk4oc3RyaW5nQXJnLCAxMCkubXVsKG11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJlxyXG4gICAgYXJnLnRvU3RyaW5nICYmXHJcbiAgICAoIWFyZ1sncG9wJ10gJiYgIWFyZ1sncHVzaCddKVxyXG4gICkge1xyXG4gICAgaWYgKFxyXG4gICAgICBhcmcudG9TdHJpbmcoKS5tYXRjaCgvXi0/WzAtOV0rJC8pICYmXHJcbiAgICAgIChhcmdbJ211bCddIHx8IGFyZ1snZGl2aWRlZFRvSW50ZWdlckJ5J10pXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIG5ldyBCTihhcmcudG9TdHJpbmcoKSwgMTApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhyb3cgbmV3IEVycm9yKGBcclxuICAgIFtudW1iZXItdG8tYm5dIHdoaWxlIGNvbnZlcnRpbmcgbnVtYmVyICR7SlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgIGFyZ1xyXG4gICAgKX0gdG8gQk4uanMgaW5zdGFuY2UsXHJcbiAgICBlcnJvcjogaW52YWxpZCBudW1iZXIgdmFsdWUuIFZhbHVlIG11c3QgYmUgYW4gaW50ZWdlciwgaGV4IHN0cmluZywgQk4gb3IgQmlnTnVtYmVyIGluc3RhbmNlLlxyXG4gICAgTm90ZSwgZGVjaW1hbHMgYXJlIG5vdCBzdXBwb3J0ZWQuXHJcbiAgYCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmVzICcweCcgZnJvbSBhIGdpdmVuIGBTdHJpbmdgIGlmIHByZXNlbnRcclxuICogQHBhcmFtIHN0ciB0aGUgc3RyaW5nIHZhbHVlXHJcbiAqIEByZXR1cm4gYSBzdHJpbmcgYnkgcGFzcyBpZiBuZWNlc3NhcnlcclxuICovXHJcbmZ1bmN0aW9uIHN0cmlwSGV4UHJlZml4KHN0cj86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gc3RyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzSGV4UHJlZml4ZWQoc3RyKSA/IHN0ci5zbGljZSgyKSA6IHN0cjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBgQm9vbGVhbmAgb24gd2hldGhlciBvciBub3QgdGhlIGEgYFN0cmluZ2Agc3RhcnRzIHdpdGggJzB4J1xyXG4gKiBAcGFyYW0gc3RyIHRoZSBzdHJpbmcgaW5wdXQgdmFsdWVcclxuICogQHJldHVybiAgYSBib29sZWFuIGlmIGl0IGlzIG9yIGlzIG5vdCBoZXggcHJlZml4ZWRcclxuICogQHRocm93cyBpZiB0aGUgc3RyIGlucHV0IGlzIG5vdCBhIHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gaXNIZXhQcmVmaXhlZChzdHI6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICBgW2lzLWhleC1wcmVmaXhlZF0gdmFsdWUgbXVzdCBiZSB0eXBlICdzdHJpbmcnLCBpcyBjdXJyZW50bHkgdHlwZSAke3R5cGVvZiBzdHJ9LCB3aGlsZSBjaGVja2luZyBpc0hleFByZWZpeGVkLmBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBDb2RlIGZyb20gZXRoLWxpYi9saWIvaGFzaFxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vTWFpYVZpY3Rvci9ldGgtbGliL2Jsb2IvbWFzdGVyL2xpYi9oYXNoLmpzI0wxMVxyXG4gKi9cclxuXHJcbmNvbnN0IEhFWF9DSEFSUyA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XHJcbmNvbnN0IEtFQ0NBS19QQURESU5HID0gWzEsIDI1NiwgNjU1MzYsIDE2Nzc3MjE2XTtcclxuY29uc3QgU0hJRlQgPSBbMCwgOCwgMTYsIDI0XTtcclxuY29uc3QgUkMgPSBbXHJcbiAgMSxcclxuICAwLFxyXG4gIDMyODk4LFxyXG4gIDAsXHJcbiAgMzI5MDYsXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAyMTQ3NTE2NDE2LFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMzI5MDcsXHJcbiAgMCxcclxuICAyMTQ3NDgzNjQ5LFxyXG4gIDAsXHJcbiAgMjE0NzUxNjU0NSxcclxuICAyMTQ3NDgzNjQ4LFxyXG4gIDMyNzc3LFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMTM4LFxyXG4gIDAsXHJcbiAgMTM2LFxyXG4gIDAsXHJcbiAgMjE0NzUxNjQyNSxcclxuICAwLFxyXG4gIDIxNDc0ODM2NTgsXHJcbiAgMCxcclxuICAyMTQ3NTE2NTU1LFxyXG4gIDAsXHJcbiAgMTM5LFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMzI5MDUsXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAzMjc3MSxcclxuICAyMTQ3NDgzNjQ4LFxyXG4gIDMyNzcwLFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMTI4LFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMzI3NzgsXHJcbiAgMCxcclxuICAyMTQ3NDgzNjU4LFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMjE0NzUxNjU0NSxcclxuICAyMTQ3NDgzNjQ4LFxyXG4gIDMyODk2LFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMjE0NzQ4MzY0OSxcclxuICAwLFxyXG4gIDIxNDc1MTY0MjQsXHJcbiAgMjE0NzQ4MzY0OFxyXG5dO1xyXG5cclxuY29uc3QgS2VjY2FrID0gYml0cyA9PiAoe1xyXG4gIGJsb2NrczogW10sXHJcbiAgcmVzZXQ6IHRydWUsXHJcbiAgYmxvY2s6IDAsXHJcbiAgc3RhcnQ6IDAsXHJcbiAgYmxvY2tDb3VudDogKDE2MDAgLSAoYml0cyA8PCAxKSkgPj4gNSxcclxuICBvdXRwdXRCbG9ja3M6IGJpdHMgPj4gNSxcclxuICBzOiAocyA9PiBbXS5jb25jYXQocywgcywgcywgcywgcykpKFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSlcclxufSk7XHJcblxyXG5jb25zdCB1cGRhdGUgPSAoc3RhdGUsIG1lc3NhZ2UpID0+IHtcclxuICBjb25zdCBsZW5ndGggPSBtZXNzYWdlLmxlbmd0aCxcclxuICAgIGJsb2NrcyA9IHN0YXRlLmJsb2NrcyxcclxuICAgIGJ5dGVDb3VudCA9IHN0YXRlLmJsb2NrQ291bnQgPDwgMixcclxuICAgIGJsb2NrQ291bnQgPSBzdGF0ZS5ibG9ja0NvdW50LFxyXG4gICAgb3V0cHV0QmxvY2tzID0gc3RhdGUub3V0cHV0QmxvY2tzLFxyXG4gICAgcyA9IHN0YXRlLnM7XHJcbiAgbGV0IGluZGV4ID0gMCxcclxuICAgIGksXHJcbiAgICBjb2RlO1xyXG5cclxuICAvLyB1cGRhdGVcclxuICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcclxuICAgIGlmIChzdGF0ZS5yZXNldCkge1xyXG4gICAgICBzdGF0ZS5yZXNldCA9IGZhbHNlO1xyXG4gICAgICBibG9ja3NbMF0gPSBzdGF0ZS5ibG9jaztcclxuICAgICAgZm9yIChpID0gMTsgaSA8IGJsb2NrQ291bnQgKyAxOyArK2kpIHtcclxuICAgICAgICBibG9ja3NbaV0gPSAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGZvciAoaSA9IHN0YXRlLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgYnl0ZUNvdW50OyArK2luZGV4KSB7XHJcbiAgICAgICAgYmxvY2tzW2kgPj4gMl0gfD0gbWVzc2FnZVtpbmRleF0gPDwgU0hJRlRbaSsrICYgM107XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAoaSA9IHN0YXRlLnN0YXJ0OyBpbmRleCA8IGxlbmd0aCAmJiBpIDwgYnl0ZUNvdW50OyArK2luZGV4KSB7XHJcbiAgICAgICAgY29kZSA9IG1lc3NhZ2UuY2hhckNvZGVBdChpbmRleCk7XHJcbiAgICAgICAgaWYgKGNvZGUgPCAweDgwKSB7XHJcbiAgICAgICAgICBibG9ja3NbaSA+PiAyXSB8PSBjb2RlIDw8IFNISUZUW2krKyAmIDNdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29kZSA8IDB4ODAwKSB7XHJcbiAgICAgICAgICBibG9ja3NbaSA+PiAyXSB8PSAoMHhjMCB8IChjb2RlID4+IDYpKSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHhkODAwIHx8IGNvZGUgPj0gMHhlMDAwKSB7XHJcbiAgICAgICAgICBibG9ja3NbaSA+PiAyXSB8PSAoMHhlMCB8IChjb2RlID4+IDEyKSkgPDwgU0hJRlRbaSsrICYgM107XHJcbiAgICAgICAgICBibG9ja3NbaSA+PiAyXSB8PSAoMHg4MCB8ICgoY29kZSA+PiA2KSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9ICgweDgwIHwgKGNvZGUgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvZGUgPVxyXG4gICAgICAgICAgICAweDEwMDAwICtcclxuICAgICAgICAgICAgKCgoY29kZSAmIDB4M2ZmKSA8PCAxMCkgfCAobWVzc2FnZS5jaGFyQ29kZUF0KCsraW5kZXgpICYgMHgzZmYpKTtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9ICgweGYwIHwgKGNvZGUgPj4gMTgpKSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+IDEyKSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xyXG4gICAgICAgICAgYmxvY2tzW2kgPj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRlLmxhc3RCeXRlSW5kZXggPSBpO1xyXG4gICAgaWYgKGkgPj0gYnl0ZUNvdW50KSB7XHJcbiAgICAgIHN0YXRlLnN0YXJ0ID0gaSAtIGJ5dGVDb3VudDtcclxuICAgICAgc3RhdGUuYmxvY2sgPSBibG9ja3NbYmxvY2tDb3VudF07XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja0NvdW50OyArK2kpIHtcclxuICAgICAgICBzW2ldIF49IGJsb2Nrc1tpXTtcclxuICAgICAgfVxyXG4gICAgICBmKHMpO1xyXG4gICAgICBzdGF0ZS5yZXNldCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdGF0ZS5zdGFydCA9IGk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBmaW5hbGl6ZVxyXG4gIGkgPSBzdGF0ZS5sYXN0Qnl0ZUluZGV4O1xyXG4gIGJsb2Nrc1tpID4+IDJdIHw9IEtFQ0NBS19QQURESU5HW2kgJiAzXTtcclxuICBpZiAoc3RhdGUubGFzdEJ5dGVJbmRleCA9PT0gYnl0ZUNvdW50KSB7XHJcbiAgICBibG9ja3NbMF0gPSBibG9ja3NbYmxvY2tDb3VudF07XHJcbiAgICBmb3IgKGkgPSAxOyBpIDwgYmxvY2tDb3VudCArIDE7ICsraSkge1xyXG4gICAgICBibG9ja3NbaV0gPSAwO1xyXG4gICAgfVxyXG4gIH1cclxuICBibG9ja3NbYmxvY2tDb3VudCAtIDFdIHw9IDB4ODAwMDAwMDA7XHJcbiAgZm9yIChpID0gMDsgaSA8IGJsb2NrQ291bnQ7ICsraSkge1xyXG4gICAgc1tpXSBePSBibG9ja3NbaV07XHJcbiAgfVxyXG4gIGYocyk7XHJcblxyXG4gIC8vIHRvU3RyaW5nXHJcbiAgbGV0IGhleCA9ICcnLFxyXG4gICAgaiA9IDAsXHJcbiAgICBibG9jaztcclxuICB3aGlsZSAoaiA8IG91dHB1dEJsb2Nrcykge1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGJsb2NrQ291bnQgJiYgaiA8IG91dHB1dEJsb2NrczsgKytpLCArK2opIHtcclxuICAgICAgYmxvY2sgPSBzW2ldO1xyXG4gICAgICBoZXggKz1cclxuICAgICAgICBIRVhfQ0hBUlNbKGJsb2NrID4+IDQpICYgMHgwZl0gK1xyXG4gICAgICAgIEhFWF9DSEFSU1tibG9jayAmIDB4MGZdICtcclxuICAgICAgICBIRVhfQ0hBUlNbKGJsb2NrID4+IDEyKSAmIDB4MGZdICtcclxuICAgICAgICBIRVhfQ0hBUlNbKGJsb2NrID4+IDgpICYgMHgwZl0gK1xyXG4gICAgICAgIEhFWF9DSEFSU1soYmxvY2sgPj4gMjApICYgMHgwZl0gK1xyXG4gICAgICAgIEhFWF9DSEFSU1soYmxvY2sgPj4gMTYpICYgMHgwZl0gK1xyXG4gICAgICAgIEhFWF9DSEFSU1soYmxvY2sgPj4gMjgpICYgMHgwZl0gK1xyXG4gICAgICAgIEhFWF9DSEFSU1soYmxvY2sgPj4gMjQpICYgMHgwZl07XHJcbiAgICB9XHJcbiAgICBpZiAoaiAlIGJsb2NrQ291bnQgPT09IDApIHtcclxuICAgICAgZihzKTtcclxuICAgICAgaSA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAnMHgnICsgaGV4O1xyXG59O1xyXG5cclxuY29uc3QgZiA9IHMgPT4ge1xyXG4gIGxldCBoLFxyXG4gICAgbCxcclxuICAgIG4sXHJcbiAgICBjMCxcclxuICAgIGMxLFxyXG4gICAgYzIsXHJcbiAgICBjMyxcclxuICAgIGM0LFxyXG4gICAgYzUsXHJcbiAgICBjNixcclxuICAgIGM3LFxyXG4gICAgYzgsXHJcbiAgICBjOSxcclxuICAgIGIwLFxyXG4gICAgYjEsXHJcbiAgICBiMixcclxuICAgIGIzLFxyXG4gICAgYjQsXHJcbiAgICBiNSxcclxuICAgIGI2LFxyXG4gICAgYjcsXHJcbiAgICBiOCxcclxuICAgIGI5LFxyXG4gICAgYjEwLFxyXG4gICAgYjExLFxyXG4gICAgYjEyLFxyXG4gICAgYjEzLFxyXG4gICAgYjE0LFxyXG4gICAgYjE1LFxyXG4gICAgYjE2LFxyXG4gICAgYjE3LFxyXG4gICAgYjE4LFxyXG4gICAgYjE5LFxyXG4gICAgYjIwLFxyXG4gICAgYjIxLFxyXG4gICAgYjIyLFxyXG4gICAgYjIzLFxyXG4gICAgYjI0LFxyXG4gICAgYjI1LFxyXG4gICAgYjI2LFxyXG4gICAgYjI3LFxyXG4gICAgYjI4LFxyXG4gICAgYjI5LFxyXG4gICAgYjMwLFxyXG4gICAgYjMxLFxyXG4gICAgYjMyLFxyXG4gICAgYjMzLFxyXG4gICAgYjM0LFxyXG4gICAgYjM1LFxyXG4gICAgYjM2LFxyXG4gICAgYjM3LFxyXG4gICAgYjM4LFxyXG4gICAgYjM5LFxyXG4gICAgYjQwLFxyXG4gICAgYjQxLFxyXG4gICAgYjQyLFxyXG4gICAgYjQzLFxyXG4gICAgYjQ0LFxyXG4gICAgYjQ1LFxyXG4gICAgYjQ2LFxyXG4gICAgYjQ3LFxyXG4gICAgYjQ4LFxyXG4gICAgYjQ5O1xyXG5cclxuICBmb3IgKG4gPSAwOyBuIDwgNDg7IG4gKz0gMikge1xyXG4gICAgYzAgPSBzWzBdIF4gc1sxMF0gXiBzWzIwXSBeIHNbMzBdIF4gc1s0MF07XHJcbiAgICBjMSA9IHNbMV0gXiBzWzExXSBeIHNbMjFdIF4gc1szMV0gXiBzWzQxXTtcclxuICAgIGMyID0gc1syXSBeIHNbMTJdIF4gc1syMl0gXiBzWzMyXSBeIHNbNDJdO1xyXG4gICAgYzMgPSBzWzNdIF4gc1sxM10gXiBzWzIzXSBeIHNbMzNdIF4gc1s0M107XHJcbiAgICBjNCA9IHNbNF0gXiBzWzE0XSBeIHNbMjRdIF4gc1szNF0gXiBzWzQ0XTtcclxuICAgIGM1ID0gc1s1XSBeIHNbMTVdIF4gc1syNV0gXiBzWzM1XSBeIHNbNDVdO1xyXG4gICAgYzYgPSBzWzZdIF4gc1sxNl0gXiBzWzI2XSBeIHNbMzZdIF4gc1s0Nl07XHJcbiAgICBjNyA9IHNbN10gXiBzWzE3XSBeIHNbMjddIF4gc1szN10gXiBzWzQ3XTtcclxuICAgIGM4ID0gc1s4XSBeIHNbMThdIF4gc1syOF0gXiBzWzM4XSBeIHNbNDhdO1xyXG4gICAgYzkgPSBzWzldIF4gc1sxOV0gXiBzWzI5XSBeIHNbMzldIF4gc1s0OV07XHJcblxyXG4gICAgaCA9IGM4IF4gKChjMiA8PCAxKSB8IChjMyA+Pj4gMzEpKTtcclxuICAgIGwgPSBjOSBeICgoYzMgPDwgMSkgfCAoYzIgPj4+IDMxKSk7XHJcbiAgICBzWzBdIF49IGg7XHJcbiAgICBzWzFdIF49IGw7XHJcbiAgICBzWzEwXSBePSBoO1xyXG4gICAgc1sxMV0gXj0gbDtcclxuICAgIHNbMjBdIF49IGg7XHJcbiAgICBzWzIxXSBePSBsO1xyXG4gICAgc1szMF0gXj0gaDtcclxuICAgIHNbMzFdIF49IGw7XHJcbiAgICBzWzQwXSBePSBoO1xyXG4gICAgc1s0MV0gXj0gbDtcclxuICAgIGggPSBjMCBeICgoYzQgPDwgMSkgfCAoYzUgPj4+IDMxKSk7XHJcbiAgICBsID0gYzEgXiAoKGM1IDw8IDEpIHwgKGM0ID4+PiAzMSkpO1xyXG4gICAgc1syXSBePSBoO1xyXG4gICAgc1szXSBePSBsO1xyXG4gICAgc1sxMl0gXj0gaDtcclxuICAgIHNbMTNdIF49IGw7XHJcbiAgICBzWzIyXSBePSBoO1xyXG4gICAgc1syM10gXj0gbDtcclxuICAgIHNbMzJdIF49IGg7XHJcbiAgICBzWzMzXSBePSBsO1xyXG4gICAgc1s0Ml0gXj0gaDtcclxuICAgIHNbNDNdIF49IGw7XHJcbiAgICBoID0gYzIgXiAoKGM2IDw8IDEpIHwgKGM3ID4+PiAzMSkpO1xyXG4gICAgbCA9IGMzIF4gKChjNyA8PCAxKSB8IChjNiA+Pj4gMzEpKTtcclxuICAgIHNbNF0gXj0gaDtcclxuICAgIHNbNV0gXj0gbDtcclxuICAgIHNbMTRdIF49IGg7XHJcbiAgICBzWzE1XSBePSBsO1xyXG4gICAgc1syNF0gXj0gaDtcclxuICAgIHNbMjVdIF49IGw7XHJcbiAgICBzWzM0XSBePSBoO1xyXG4gICAgc1szNV0gXj0gbDtcclxuICAgIHNbNDRdIF49IGg7XHJcbiAgICBzWzQ1XSBePSBsO1xyXG4gICAgaCA9IGM0IF4gKChjOCA8PCAxKSB8IChjOSA+Pj4gMzEpKTtcclxuICAgIGwgPSBjNSBeICgoYzkgPDwgMSkgfCAoYzggPj4+IDMxKSk7XHJcbiAgICBzWzZdIF49IGg7XHJcbiAgICBzWzddIF49IGw7XHJcbiAgICBzWzE2XSBePSBoO1xyXG4gICAgc1sxN10gXj0gbDtcclxuICAgIHNbMjZdIF49IGg7XHJcbiAgICBzWzI3XSBePSBsO1xyXG4gICAgc1szNl0gXj0gaDtcclxuICAgIHNbMzddIF49IGw7XHJcbiAgICBzWzQ2XSBePSBoO1xyXG4gICAgc1s0N10gXj0gbDtcclxuICAgIGggPSBjNiBeICgoYzAgPDwgMSkgfCAoYzEgPj4+IDMxKSk7XHJcbiAgICBsID0gYzcgXiAoKGMxIDw8IDEpIHwgKGMwID4+PiAzMSkpO1xyXG4gICAgc1s4XSBePSBoO1xyXG4gICAgc1s5XSBePSBsO1xyXG4gICAgc1sxOF0gXj0gaDtcclxuICAgIHNbMTldIF49IGw7XHJcbiAgICBzWzI4XSBePSBoO1xyXG4gICAgc1syOV0gXj0gbDtcclxuICAgIHNbMzhdIF49IGg7XHJcbiAgICBzWzM5XSBePSBsO1xyXG4gICAgc1s0OF0gXj0gaDtcclxuICAgIHNbNDldIF49IGw7XHJcblxyXG4gICAgYjAgPSBzWzBdO1xyXG4gICAgYjEgPSBzWzFdO1xyXG4gICAgYjMyID0gKHNbMTFdIDw8IDQpIHwgKHNbMTBdID4+PiAyOCk7XHJcbiAgICBiMzMgPSAoc1sxMF0gPDwgNCkgfCAoc1sxMV0gPj4+IDI4KTtcclxuICAgIGIxNCA9IChzWzIwXSA8PCAzKSB8IChzWzIxXSA+Pj4gMjkpO1xyXG4gICAgYjE1ID0gKHNbMjFdIDw8IDMpIHwgKHNbMjBdID4+PiAyOSk7XHJcbiAgICBiNDYgPSAoc1szMV0gPDwgOSkgfCAoc1szMF0gPj4+IDIzKTtcclxuICAgIGI0NyA9IChzWzMwXSA8PCA5KSB8IChzWzMxXSA+Pj4gMjMpO1xyXG4gICAgYjI4ID0gKHNbNDBdIDw8IDE4KSB8IChzWzQxXSA+Pj4gMTQpO1xyXG4gICAgYjI5ID0gKHNbNDFdIDw8IDE4KSB8IChzWzQwXSA+Pj4gMTQpO1xyXG4gICAgYjIwID0gKHNbMl0gPDwgMSkgfCAoc1szXSA+Pj4gMzEpO1xyXG4gICAgYjIxID0gKHNbM10gPDwgMSkgfCAoc1syXSA+Pj4gMzEpO1xyXG4gICAgYjIgPSAoc1sxM10gPDwgMTIpIHwgKHNbMTJdID4+PiAyMCk7XHJcbiAgICBiMyA9IChzWzEyXSA8PCAxMikgfCAoc1sxM10gPj4+IDIwKTtcclxuICAgIGIzNCA9IChzWzIyXSA8PCAxMCkgfCAoc1syM10gPj4+IDIyKTtcclxuICAgIGIzNSA9IChzWzIzXSA8PCAxMCkgfCAoc1syMl0gPj4+IDIyKTtcclxuICAgIGIxNiA9IChzWzMzXSA8PCAxMykgfCAoc1szMl0gPj4+IDE5KTtcclxuICAgIGIxNyA9IChzWzMyXSA8PCAxMykgfCAoc1szM10gPj4+IDE5KTtcclxuICAgIGI0OCA9IChzWzQyXSA8PCAyKSB8IChzWzQzXSA+Pj4gMzApO1xyXG4gICAgYjQ5ID0gKHNbNDNdIDw8IDIpIHwgKHNbNDJdID4+PiAzMCk7XHJcbiAgICBiNDAgPSAoc1s1XSA8PCAzMCkgfCAoc1s0XSA+Pj4gMik7XHJcbiAgICBiNDEgPSAoc1s0XSA8PCAzMCkgfCAoc1s1XSA+Pj4gMik7XHJcbiAgICBiMjIgPSAoc1sxNF0gPDwgNikgfCAoc1sxNV0gPj4+IDI2KTtcclxuICAgIGIyMyA9IChzWzE1XSA8PCA2KSB8IChzWzE0XSA+Pj4gMjYpO1xyXG4gICAgYjQgPSAoc1syNV0gPDwgMTEpIHwgKHNbMjRdID4+PiAyMSk7XHJcbiAgICBiNSA9IChzWzI0XSA8PCAxMSkgfCAoc1syNV0gPj4+IDIxKTtcclxuICAgIGIzNiA9IChzWzM0XSA8PCAxNSkgfCAoc1szNV0gPj4+IDE3KTtcclxuICAgIGIzNyA9IChzWzM1XSA8PCAxNSkgfCAoc1szNF0gPj4+IDE3KTtcclxuICAgIGIxOCA9IChzWzQ1XSA8PCAyOSkgfCAoc1s0NF0gPj4+IDMpO1xyXG4gICAgYjE5ID0gKHNbNDRdIDw8IDI5KSB8IChzWzQ1XSA+Pj4gMyk7XHJcbiAgICBiMTAgPSAoc1s2XSA8PCAyOCkgfCAoc1s3XSA+Pj4gNCk7XHJcbiAgICBiMTEgPSAoc1s3XSA8PCAyOCkgfCAoc1s2XSA+Pj4gNCk7XHJcbiAgICBiNDIgPSAoc1sxN10gPDwgMjMpIHwgKHNbMTZdID4+PiA5KTtcclxuICAgIGI0MyA9IChzWzE2XSA8PCAyMykgfCAoc1sxN10gPj4+IDkpO1xyXG4gICAgYjI0ID0gKHNbMjZdIDw8IDI1KSB8IChzWzI3XSA+Pj4gNyk7XHJcbiAgICBiMjUgPSAoc1syN10gPDwgMjUpIHwgKHNbMjZdID4+PiA3KTtcclxuICAgIGI2ID0gKHNbMzZdIDw8IDIxKSB8IChzWzM3XSA+Pj4gMTEpO1xyXG4gICAgYjcgPSAoc1szN10gPDwgMjEpIHwgKHNbMzZdID4+PiAxMSk7XHJcbiAgICBiMzggPSAoc1s0N10gPDwgMjQpIHwgKHNbNDZdID4+PiA4KTtcclxuICAgIGIzOSA9IChzWzQ2XSA8PCAyNCkgfCAoc1s0N10gPj4+IDgpO1xyXG4gICAgYjMwID0gKHNbOF0gPDwgMjcpIHwgKHNbOV0gPj4+IDUpO1xyXG4gICAgYjMxID0gKHNbOV0gPDwgMjcpIHwgKHNbOF0gPj4+IDUpO1xyXG4gICAgYjEyID0gKHNbMThdIDw8IDIwKSB8IChzWzE5XSA+Pj4gMTIpO1xyXG4gICAgYjEzID0gKHNbMTldIDw8IDIwKSB8IChzWzE4XSA+Pj4gMTIpO1xyXG4gICAgYjQ0ID0gKHNbMjldIDw8IDcpIHwgKHNbMjhdID4+PiAyNSk7XHJcbiAgICBiNDUgPSAoc1syOF0gPDwgNykgfCAoc1syOV0gPj4+IDI1KTtcclxuICAgIGIyNiA9IChzWzM4XSA8PCA4KSB8IChzWzM5XSA+Pj4gMjQpO1xyXG4gICAgYjI3ID0gKHNbMzldIDw8IDgpIHwgKHNbMzhdID4+PiAyNCk7XHJcbiAgICBiOCA9IChzWzQ4XSA8PCAxNCkgfCAoc1s0OV0gPj4+IDE4KTtcclxuICAgIGI5ID0gKHNbNDldIDw8IDE0KSB8IChzWzQ4XSA+Pj4gMTgpO1xyXG5cclxuICAgIHNbMF0gPSBiMCBeICh+YjIgJiBiNCk7XHJcbiAgICBzWzFdID0gYjEgXiAofmIzICYgYjUpO1xyXG4gICAgc1sxMF0gPSBiMTAgXiAofmIxMiAmIGIxNCk7XHJcbiAgICBzWzExXSA9IGIxMSBeICh+YjEzICYgYjE1KTtcclxuICAgIHNbMjBdID0gYjIwIF4gKH5iMjIgJiBiMjQpO1xyXG4gICAgc1syMV0gPSBiMjEgXiAofmIyMyAmIGIyNSk7XHJcbiAgICBzWzMwXSA9IGIzMCBeICh+YjMyICYgYjM0KTtcclxuICAgIHNbMzFdID0gYjMxIF4gKH5iMzMgJiBiMzUpO1xyXG4gICAgc1s0MF0gPSBiNDAgXiAofmI0MiAmIGI0NCk7XHJcbiAgICBzWzQxXSA9IGI0MSBeICh+YjQzICYgYjQ1KTtcclxuICAgIHNbMl0gPSBiMiBeICh+YjQgJiBiNik7XHJcbiAgICBzWzNdID0gYjMgXiAofmI1ICYgYjcpO1xyXG4gICAgc1sxMl0gPSBiMTIgXiAofmIxNCAmIGIxNik7XHJcbiAgICBzWzEzXSA9IGIxMyBeICh+YjE1ICYgYjE3KTtcclxuICAgIHNbMjJdID0gYjIyIF4gKH5iMjQgJiBiMjYpO1xyXG4gICAgc1syM10gPSBiMjMgXiAofmIyNSAmIGIyNyk7XHJcbiAgICBzWzMyXSA9IGIzMiBeICh+YjM0ICYgYjM2KTtcclxuICAgIHNbMzNdID0gYjMzIF4gKH5iMzUgJiBiMzcpO1xyXG4gICAgc1s0Ml0gPSBiNDIgXiAofmI0NCAmIGI0Nik7XHJcbiAgICBzWzQzXSA9IGI0MyBeICh+YjQ1ICYgYjQ3KTtcclxuICAgIHNbNF0gPSBiNCBeICh+YjYgJiBiOCk7XHJcbiAgICBzWzVdID0gYjUgXiAofmI3ICYgYjkpO1xyXG4gICAgc1sxNF0gPSBiMTQgXiAofmIxNiAmIGIxOCk7XHJcbiAgICBzWzE1XSA9IGIxNSBeICh+YjE3ICYgYjE5KTtcclxuICAgIHNbMjRdID0gYjI0IF4gKH5iMjYgJiBiMjgpO1xyXG4gICAgc1syNV0gPSBiMjUgXiAofmIyNyAmIGIyOSk7XHJcbiAgICBzWzM0XSA9IGIzNCBeICh+YjM2ICYgYjM4KTtcclxuICAgIHNbMzVdID0gYjM1IF4gKH5iMzcgJiBiMzkpO1xyXG4gICAgc1s0NF0gPSBiNDQgXiAofmI0NiAmIGI0OCk7XHJcbiAgICBzWzQ1XSA9IGI0NSBeICh+YjQ3ICYgYjQ5KTtcclxuICAgIHNbNl0gPSBiNiBeICh+YjggJiBiMCk7XHJcbiAgICBzWzddID0gYjcgXiAofmI5ICYgYjEpO1xyXG4gICAgc1sxNl0gPSBiMTYgXiAofmIxOCAmIGIxMCk7XHJcbiAgICBzWzE3XSA9IGIxNyBeICh+YjE5ICYgYjExKTtcclxuICAgIHNbMjZdID0gYjI2IF4gKH5iMjggJiBiMjApO1xyXG4gICAgc1syN10gPSBiMjcgXiAofmIyOSAmIGIyMSk7XHJcbiAgICBzWzM2XSA9IGIzNiBeICh+YjM4ICYgYjMwKTtcclxuICAgIHNbMzddID0gYjM3IF4gKH5iMzkgJiBiMzEpO1xyXG4gICAgc1s0Nl0gPSBiNDYgXiAofmI0OCAmIGI0MCk7XHJcbiAgICBzWzQ3XSA9IGI0NyBeICh+YjQ5ICYgYjQxKTtcclxuICAgIHNbOF0gPSBiOCBeICh+YjAgJiBiMik7XHJcbiAgICBzWzldID0gYjkgXiAofmIxICYgYjMpO1xyXG4gICAgc1sxOF0gPSBiMTggXiAofmIxMCAmIGIxMik7XHJcbiAgICBzWzE5XSA9IGIxOSBeICh+YjExICYgYjEzKTtcclxuICAgIHNbMjhdID0gYjI4IF4gKH5iMjAgJiBiMjIpO1xyXG4gICAgc1syOV0gPSBiMjkgXiAofmIyMSAmIGIyMyk7XHJcbiAgICBzWzM4XSA9IGIzOCBeICh+YjMwICYgYjMyKTtcclxuICAgIHNbMzldID0gYjM5IF4gKH5iMzEgJiBiMzMpO1xyXG4gICAgc1s0OF0gPSBiNDggXiAofmI0MCAmIGI0Mik7XHJcbiAgICBzWzQ5XSA9IGI0OSBeICh+YjQxICYgYjQzKTtcclxuXHJcbiAgICBzWzBdIF49IFJDW25dO1xyXG4gICAgc1sxXSBePSBSQ1tuICsgMV07XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3Qga2VjY2FrID0gKGJpdHM6IG51bWJlcikgPT4ge1xyXG4gIC8qKlxyXG4gICAqIElmIHN0ciBpcyBhIHN0cmluZyBpdCBtdXN0IGhhdmUgJzB4J1xyXG4gICAqL1xyXG4gIHJldHVybiAoc3RyOiBzdHJpbmcgfCBCdWZmZXIpID0+IHtcclxuICAgIGxldCBtc2c7XHJcbiAgICBpZiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgJiYgc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnKSB7XHJcbiAgICAgIG1zZyA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpID0gMiwgbCA9IHN0ci5sZW5ndGg7IGkgPCBsOyBpICs9IDIpIHtcclxuICAgICAgICBtc2cucHVzaChwYXJzZUludChzdHIuc2xpY2UoaSwgaSArIDIpLCAxNikpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtc2cgPSBzdHI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXBkYXRlKEtlY2NhayhiaXRzKSwgbXNnKTtcclxuICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGtlY2NhazI1NiA9IGtlY2NhaygyNTYpO1xyXG4iLCJpbXBvcnQgKiBhcyB1dGY4IGZyb20gJ3V0ZjgnO1xyXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnO1xyXG5cclxuaW1wb3J0IHsgaXNCaWdOdW1iZXIsIGlzQk4sIHRvQk4gfSBmcm9tICcuL2JuJztcclxuaW1wb3J0IHsga2VjY2FrMjU2IH0gZnJvbSAnLi9rZWNjYWNrJztcclxuXHJcbi8qKioqKioqKioqKioqKioqKioqXHJcbiAqIEFERFJFU1NcclxuICovXHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBzdHJpbmcgaXMgYW4gYWRkcmVzc1xyXG4gKiBAbWV0aG9kIGlzQWRkcmVzc1xyXG4gKiBAcGFyYW0gYWRkcmVzcyB0aGUgZ2l2ZW4gSEVYIGFkZHJlc3NcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FkZHJlc3MoYWRkcmVzczogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgLy8gY2hlY2sgaWYgaXQgaGFzIHRoZSBiYXNpYyByZXF1aXJlbWVudHMgb2YgYW4gYWRkcmVzc1xyXG4gIGlmICghL14oMHgpP1swLTlhLWZdezQwfSQvaS50ZXN0KGFkZHJlc3MpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyBJZiBpdCdzIEFMTCBsb3dlcmNhc2Ugb3IgQUxMIHVwcHBlcmNhc2VcclxuICB9IGVsc2UgaWYgKFxyXG4gICAgL14oMHh8MFgpP1swLTlhLWZdezQwfSQvLnRlc3QoYWRkcmVzcykgfHxcclxuICAgIC9eKDB4fDBYKT9bMC05QS1GXXs0MH0kLy50ZXN0KGFkZHJlc3MpXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICAgIC8vIE90aGVyd2lzZSBjaGVjayBlYWNoIGNhc2VcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGNoZWNrQWRkcmVzc0NoZWNrc3VtKGFkZHJlc3MpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gc3RyaW5nIGlzIGEgY2hlY2tzdW1tZWQgYWRkcmVzc1xyXG4gKlxyXG4gKiBAbWV0aG9kIGNoZWNrQWRkcmVzc0NoZWNrc3VtXHJcbiAqIEBwYXJhbSBhZGRyZXNzIHRoZSBnaXZlbiBIRVggYWRkcmVzc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQWRkcmVzc0NoZWNrc3VtKGFkZHJlc3M6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIC8vIENoZWNrIGVhY2ggY2FzZVxyXG4gIGFkZHJlc3MgPSBhZGRyZXNzLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcbiAgY29uc3QgYWRkcmVzc0hhc2ggPSBzaGEzKGFkZHJlc3MudG9Mb3dlckNhc2UoKSkucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA0MDsgaSsrKSB7XHJcbiAgICAvLyB0aGUgbnRoIGxldHRlciBzaG91bGQgYmUgdXBwZXJjYXNlIGlmIHRoZSBudGggZGlnaXQgb2YgY2FzZW1hcCBpcyAxXHJcbiAgICBpZiAoXHJcbiAgICAgIChwYXJzZUludChhZGRyZXNzSGFzaFtpXSwgMTYpID4gNyAmJlxyXG4gICAgICAgIGFkZHJlc3NbaV0udG9VcHBlckNhc2UoKSAhPT0gYWRkcmVzc1tpXSkgfHxcclxuICAgICAgKHBhcnNlSW50KGFkZHJlc3NIYXNoW2ldLCAxNikgPD0gNyAmJlxyXG4gICAgICAgIGFkZHJlc3NbaV0udG9Mb3dlckNhc2UoKSAhPT0gYWRkcmVzc1tpXSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdG8gYSBjaGVja3N1bSBhZGRyZXNzXHJcbiAqXHJcbiAqIEBtZXRob2QgdG9DaGVja3N1bUFkZHJlc3NcclxuICogQHBhcmFtIGFkZHJlc3MgdGhlIGdpdmVuIEhFWCBhZGRyZXNzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdG9DaGVja3N1bUFkZHJlc3MoYWRkcmVzczogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAodHlwZW9mIGFkZHJlc3MgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG5cclxuICBpZiAoIS9eKDB4KT9bMC05YS1mXXs0MH0kL2kudGVzdChhZGRyZXNzKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICBgR2l2ZW4gYWRkcmVzcyAke2FkZHJlc3N9IGlzIG5vdCBhIHZhbGlkIEV0aGVyZXVtIGFkZHJlc3MuYFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGFkZHJlc3MgPSBhZGRyZXNzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuICBjb25zdCBhZGRyZXNzSGFzaCA9IHNoYTMoYWRkcmVzcykucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuICBsZXQgY2hlY2tzdW1BZGRyZXNzID0gJzB4JztcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRyZXNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyBJZiBpdGggY2hhcmFjdGVyIGlzIDkgdG8gZiB0aGVuIG1ha2UgaXQgdXBwZXJjYXNlXHJcbiAgICBpZiAocGFyc2VJbnQoYWRkcmVzc0hhc2hbaV0sIDE2KSA+IDcpIHtcclxuICAgICAgY2hlY2tzdW1BZGRyZXNzICs9IGFkZHJlc3NbaV0udG9VcHBlckNhc2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoZWNrc3VtQWRkcmVzcyArPSBhZGRyZXNzW2ldO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gY2hlY2tzdW1BZGRyZXNzO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBwYWQgc3RyaW5nIHRvIGV4cGVjdGVkIGxlbmd0aFxyXG4gKlxyXG4gKiBAbWV0aG9kIGxlZnRQYWRcclxuICogQHBhcmFtIHN0cmluZyB0byBiZSBwYWRkZWRcclxuICogQHBhcmFtIGNoYXJzIHRoYXQgcmVzdWx0IHN0cmluZyBzaG91bGQgaGF2ZVxyXG4gKiBAcGFyYW0gc2lnbiwgYnkgZGVmYXVsdCAwXHJcbiAqIEByZXR1cm5zIHJpZ2h0IGFsaWduZWQgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbGVmdFBhZChzdHJpbmc6IHN0cmluZywgY2hhcnM6IG51bWJlciwgc2lnbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBoYXNQcmVmaXggPSAvXjB4L2kudGVzdChzdHJpbmcpIHx8IHR5cGVvZiBzdHJpbmcgPT09ICdudW1iZXInO1xyXG4gIHN0cmluZyA9IChzdHJpbmcgYXMgYW55KS50b1N0cmluZygxNikucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuXHJcbiAgY29uc3QgcGFkZGluZyA9XHJcbiAgICBjaGFycyAtIHN0cmluZy5sZW5ndGggKyAxID49IDAgPyBjaGFycyAtIHN0cmluZy5sZW5ndGggKyAxIDogMDtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIChoYXNQcmVmaXggPyAnMHgnIDogJycpICtcclxuICAgIG5ldyBBcnJheShwYWRkaW5nKS5qb2luKHNpZ24gPyBzaWduIDogJzAnKSArXHJcbiAgICBzdHJpbmdcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBwYWQgc3RyaW5nIHRvIGV4cGVjdGVkIGxlbmd0aFxyXG4gKlxyXG4gKiBAbWV0aG9kIHJpZ2h0UGFkXHJcbiAqIEBwYXJhbSBzdHJpbmcgdG8gYmUgcGFkZGVkXHJcbiAqIEBwYXJhbSBjaGFycyB0aGF0IHJlc3VsdCBzdHJpbmcgc2hvdWxkIGhhdmVcclxuICogQHBhcmFtIHNpZ24sIGJ5IGRlZmF1bHQgMFxyXG4gKiBAcmV0dXJucyByaWdodCBhbGlnbmVkIHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJpZ2h0UGFkKHN0cmluZzogc3RyaW5nLCBjaGFyczogbnVtYmVyLCBzaWduOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGhhc1ByZWZpeCA9IC9eMHgvaS50ZXN0KHN0cmluZykgfHwgdHlwZW9mIHN0cmluZyA9PT0gJ251bWJlcic7XHJcbiAgc3RyaW5nID0gKHN0cmluZyBhcyBhbnkpLnRvU3RyaW5nKDE2KS5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG5cclxuICBjb25zdCBwYWRkaW5nID1cclxuICAgIGNoYXJzIC0gc3RyaW5nLmxlbmd0aCArIDEgPj0gMCA/IGNoYXJzIC0gc3RyaW5nLmxlbmd0aCArIDEgOiAwO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgKGhhc1ByZWZpeCA/ICcweCcgOiAnJykgK1xyXG4gICAgc3RyaW5nICtcclxuICAgIG5ldyBBcnJheShwYWRkaW5nKS5qb2luKHNpZ24gPyBzaWduIDogJzAnKVxyXG4gICk7XHJcbn1cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBTSEEzXHJcbiAqL1xyXG5cclxuY29uc3QgU0hBM19OVUxMX1MgPVxyXG4gICcweGM1ZDI0NjAxODZmNzIzM2M5MjdlN2RiMmRjYzcwM2MwZTUwMGI2NTNjYTgyMjczYjdiZmFkODA0NWQ4NWE0NzAnO1xyXG5cclxuLyoqXHJcbiAqIEhhc2hlcyB2YWx1ZXMgdG8gYSBzaGEzIGhhc2ggdXNpbmcga2VjY2FrIDI1NlxyXG4gKiBUbyBoYXNoIGEgSEVYIHN0cmluZyB0aGUgaGV4IG11c3QgaGF2ZSAweCBpbiBmcm9udC5cclxuICogQG1ldGhvZCBzaGEzXHJcbiAqIEByZXR1cm4gdGhlIHNoYTMgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2hhMyh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgaWYgKGlzSGV4U3RyaWN0KHZhbHVlKSAmJiAvXjB4L2kudGVzdCh2YWx1ZS50b1N0cmluZygpKSkge1xyXG4gICAgdmFsdWUgPSBoZXhUb0J5dGVzKHZhbHVlKSBhcyBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICBjb25zdCByZXR1cm5WYWx1ZSA9IGtlY2NhazI1Nih2YWx1ZSk7XHJcblxyXG4gIGlmIChyZXR1cm5WYWx1ZSA9PT0gU0hBM19OVUxMX1MpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIEhFWFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCBoZXggcmVwcmVzZW50YXRpb24gKHByZWZpeGVkIGJ5IDB4KSBvZiB1dGY4IHN0cmluZ1xyXG4gKlxyXG4gKiBAbWV0aG9kIHV0ZjhUb0hleFxyXG4gKiBAcGFyYW0gc3RyXHJcbiAqIEByZXR1cm5zIGhleCByZXByZXNlbnRhdGlvbiBvZiBpbnB1dCBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB1dGY4VG9IZXgoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHN0ciA9IHV0ZjguZW5jb2RlKHN0cik7XHJcbiAgbGV0IGhleCA9ICcnO1xyXG5cclxuICAvLyByZW1vdmUgXFx1MDAwMCBwYWRkaW5nIGZyb20gZWl0aGVyIHNpZGVcclxuICBzdHIgPSBzdHIucmVwbGFjZSgvXig/OlxcdTAwMDApKi8sICcnKTtcclxuICBzdHIgPSBzdHJcclxuICAgIC5zcGxpdCgnJylcclxuICAgIC5yZXZlcnNlKClcclxuICAgIC5qb2luKCcnKTtcclxuICBzdHIgPSBzdHIucmVwbGFjZSgvXig/OlxcdTAwMDApKi8sICcnKTtcclxuICBzdHIgPSBzdHJcclxuICAgIC5zcGxpdCgnJylcclxuICAgIC5yZXZlcnNlKClcclxuICAgIC5qb2luKCcnKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGNvZGUgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgIC8vIGlmIChjb2RlICE9PSAwKSB7XHJcbiAgICBjb25zdCBuID0gY29kZS50b1N0cmluZygxNik7XHJcbiAgICBoZXggKz0gbi5sZW5ndGggPCAyID8gJzAnICsgbiA6IG47XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gJzB4JyArIGhleDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IHV0ZjggZnJvbSBpdCdzIGhleCByZXByZXNlbnRhdGlvblxyXG4gKiBAbWV0aG9kIGhleFRvVXRmOFxyXG4gKiBAcGFyYW0gaGV4XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9VdGY4KGhleDogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoIWlzSGV4U3RyaWN0KGhleCkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHBhcmFtZXRlciAke2hleH0gbXVzdCBiZSBhIHZhbGlkIEhFWCBzdHJpbmcuYCk7XHJcbiAgfVxyXG4gIGxldCBzdHIgPSAnJztcclxuICBsZXQgY29kZSA9IDA7XHJcbiAgaGV4ID0gaGV4LnJlcGxhY2UoL14weC9pLCAnJyk7XHJcblxyXG4gIC8vIHJlbW92ZSAwMCBwYWRkaW5nIGZyb20gZWl0aGVyIHNpZGVcclxuICBoZXggPSBoZXgucmVwbGFjZSgvXig/OjAwKSovLCAnJyk7XHJcbiAgaGV4ID0gaGV4XHJcbiAgICAuc3BsaXQoJycpXHJcbiAgICAucmV2ZXJzZSgpXHJcbiAgICAuam9pbignJyk7XHJcbiAgaGV4ID0gaGV4LnJlcGxhY2UoL14oPzowMCkqLywgJycpO1xyXG4gIGhleCA9IGhleFxyXG4gICAgLnNwbGl0KCcnKVxyXG4gICAgLnJldmVyc2UoKVxyXG4gICAgLmpvaW4oJycpO1xyXG5cclxuICBjb25zdCBsID0gaGV4Lmxlbmd0aDtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpICs9IDIpIHtcclxuICAgIGNvZGUgPSBwYXJzZUludChoZXguc3Vic3RyKGksIDIpLCAxNik7XHJcbiAgICAvLyBpZiAoY29kZSAhPT0gMCkge1xyXG4gICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXRmOC5kZWNvZGUoc3RyKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHZhbHVlIHRvIGl0J3MgbnVtYmVyIHJlcHJlc2VudGF0aW9uXHJcbiAqIEBtZXRob2QgaGV4VG9OdW1iZXJcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9OdW1iZXIodmFsdWU6IHN0cmluZyB8IG51bWJlciB8IEJOKTogbnVtYmVyIHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IEJOKHZhbHVlLCAxNikudG9OdW1iZXIoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHZhbHVlIHRvIGl0J3MgZGVjaW1hbCByZXByZXNlbnRhdGlvbiBpbiBzdHJpbmdcclxuICogQG1ldGhvZCBoZXhUb051bWJlclN0cmluZ1xyXG4gKiBAcGFyYW0gdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb051bWJlclN0cmluZyh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgQk4pOiBzdHJpbmcge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgQk4odmFsdWUsIDE2KS50b1N0cmluZygxMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB2YWx1ZSB0byBpdCdzIGhleCByZXByZXNlbnRhdGlvblxyXG4gKiBAbWV0aG9kIG51bWJlclRvSGV4XHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlclRvSGV4KHZhbHVlOiBTdHJpbmcgfCBOdW1iZXIgfCBCTik6IHN0cmluZyB7XHJcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdmFsdWUgPT09ICdudWxsJykge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFpc0Zpbml0ZSh2YWx1ZSkgJiYgIWlzSGV4U3RyaWN0KHZhbHVlKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBHaXZlbiBpbnB1dCAke3ZhbHVlfSBpcyBub3QgYSBudW1iZXIuYCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBudW1iZXIgPSB0b0JOKHZhbHVlKTtcclxuICBjb25zdCByZXN1bHQgPSBudW1iZXIudG9TdHJpbmcoMTYpO1xyXG5cclxuICByZXR1cm4gbnVtYmVyLmx0KG5ldyBCTigwKSkgPyAnLTB4JyArIHJlc3VsdC5zdWJzdHIoMSkgOiAnMHgnICsgcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBoZXggc3RyaW5nXHJcbiAqIE5vdGU6IEltcGxlbWVudGF0aW9uIGZyb20gY3J5cHRvLWpzXHJcbiAqIEBtZXRob2QgYnl0ZXNUb0hleFxyXG4gKiBAcGFyYW0gYnl0ZXNcclxuICogQHJldHVybiB0aGUgaGV4IHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGJ5dGVzVG9IZXgoYnl0ZXM6IG51bWJlcltdKTogc3RyaW5nIHtcclxuICBjb25zdCBoZXggPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG4gICAgaGV4LnB1c2goKGJ5dGVzW2ldID4+PiA0KS50b1N0cmluZygxNikpO1xyXG4gICAgaGV4LnB1c2goKGJ5dGVzW2ldICYgMHhmKS50b1N0cmluZygxNikpO1xyXG4gICAgLyogdHNsaW50OmVuYWJsZSAgKi9cclxuICB9XHJcbiAgcmV0dXJuICcweCcgKyBoZXguam9pbignJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgaGV4IHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcclxuICogTm90ZTogSW1wbGVtZW50YXRpb24gZnJvbSBjcnlwdG8tanNcclxuICogQG1ldGhvZCBoZXhUb0J5dGVzXHJcbiAqIEBwYXJhbSBoZXhcclxuICogQHJldHVybiB0aGUgYnl0ZSBhcnJheVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvQnl0ZXMoaGV4OiBzdHJpbmcpOiBudW1iZXJbXSB8IHN0cmluZyB7XHJcbiAgaGV4ID0gKGhleCBhcyBhbnkpLnRvU3RyaW5nKDE2KTtcclxuXHJcbiAgaWYgKCFpc0hleFN0cmljdChoZXgpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEdpdmVuIHZhbHVlICR7aGV4fSBpcyBub3QgYSB2YWxpZCBoZXggc3RyaW5nLmApO1xyXG4gIH1cclxuXHJcbiAgaGV4ID0gaGV4LnJlcGxhY2UoL14weC9pLCAnJyk7XHJcbiAgY29uc3QgYnl0ZXMgPSBbXTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGhleC5sZW5ndGg7IGMgKz0gMikge1xyXG4gICAgYnl0ZXMucHVzaChwYXJzZUludChoZXguc3Vic3RyKGMsIDIpLCAxNikpO1xyXG4gIH1cclxuICByZXR1cm4gYnl0ZXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCBhc2NpaSBmcm9tIGl0J3MgaGV4IHJlcHJlc2VudGF0aW9uXHJcbiAqXHJcbiAqIEBtZXRob2QgaGV4VG9Bc2NpaVxyXG4gKiBAcGFyYW0gaGV4XHJcbiAqIEByZXR1cm5zIGFzY2lpIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBoZXggdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb0FzY2lpKGhleDogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoIWlzSGV4U3RyaWN0KGhleCkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHBhcmFtZXRlciBtdXN0IGJlIGEgdmFsaWQgSEVYIHN0cmluZy4nKTtcclxuICB9XHJcblxyXG4gIGxldCBzdHIgPSAnJztcclxuICBsZXQgaSA9IDA7XHJcbiAgY29uc3QgbCA9IGhleC5sZW5ndGg7XHJcbiAgaWYgKGhleC5zdWJzdHJpbmcoMCwgMikgPT09ICcweCcpIHtcclxuICAgIGkgPSAyO1xyXG4gIH1cclxuICBmb3IgKDsgaSA8IGw7IGkgKz0gMikge1xyXG4gICAgY29uc3QgY29kZSA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSwgMiksIDE2KTtcclxuICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IGhleCByZXByZXNlbnRhdGlvbiAocHJlZml4ZWQgYnkgMHgpIG9mIGFzY2lpIHN0cmluZ1xyXG4gKlxyXG4gKiBAbWV0aG9kIGFzY2lpVG9IZXhcclxuICogQHBhcmFtIHN0clxyXG4gKiBAcmV0dXJucyBoZXggcmVwcmVzZW50YXRpb24gb2YgaW5wdXQgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXNjaWlUb0hleChzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKCFzdHIpIHtcclxuICAgIHJldHVybiAnMHgwMCc7XHJcbiAgfVxyXG4gIGxldCBoZXggPSAnJztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgY29kZSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgY29uc3QgbiA9IGNvZGUudG9TdHJpbmcoMTYpO1xyXG4gICAgaGV4ICs9IG4ubGVuZ3RoIDwgMiA/ICcwJyArIG4gOiBuO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuICcweCcgKyBoZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBdXRvIGNvbnZlcnRzIGFueSBnaXZlbiB2YWx1ZSBpbnRvIGl0J3MgaGV4IHJlcHJlc2VudGF0aW9uLlxyXG4gKlxyXG4gKiBBbmQgZXZlbiBzdHJpbmdpZnlzIG9iamVjdHMgYmVmb3JlLlxyXG4gKlxyXG4gKiBAbWV0aG9kIHRvSGV4XHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcGFyYW0gcmV0dXJuVHlwZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvSGV4KFxyXG4gIHZhbHVlOiBTdHJpbmcgfCBOdW1iZXIgfCBCTiB8IE9iamVjdCxcclxuICByZXR1cm5UeXBlPzogYm9vbGVhblxyXG4pOiBzdHJpbmcge1xyXG4gIC8qanNoaW50IG1heGNvbXBsZXhpdHk6IGZhbHNlICovXHJcblxyXG4gIGlmIChpc0FkZHJlc3ModmFsdWUpKSB7XHJcbiAgICByZXR1cm4gcmV0dXJuVHlwZVxyXG4gICAgICA/ICdhZGRyZXNzJ1xyXG4gICAgICA6ICcweCcgKyB2YWx1ZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcclxuICAgIHJldHVybiByZXR1cm5UeXBlID8gJ2Jvb2wnIDogdmFsdWUgPyAnMHgwMScgOiAnMHgwMCc7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhaXNCaWdOdW1iZXIodmFsdWUpICYmICFpc0JOKHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHJldHVyblR5cGUgPyAnc3RyaW5nJyA6IHV0ZjhUb0hleChKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gaWYgaXRzIGEgbmVnYXRpdmUgbnVtYmVyLCBwYXNzIGl0IHRocm91Z2ggbnVtYmVyVG9IZXhcclxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgaWYgKHZhbHVlLmluZGV4T2YoJy0weCcpID09PSAwIHx8IHZhbHVlLmluZGV4T2YoJy0wWCcpID09PSAwKSB7XHJcbiAgICAgIHJldHVybiByZXR1cm5UeXBlID8gJ2ludDI1NicgOiBudW1iZXJUb0hleCh2YWx1ZSk7XHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlLmluZGV4T2YoJzB4JykgPT09IDAgfHwgdmFsdWUuaW5kZXhPZignMFgnKSA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gcmV0dXJuVHlwZSA/ICdieXRlcycgOiB2YWx1ZTtcclxuICAgIH0gZWxzZSBpZiAoIWlzRmluaXRlKHZhbHVlIGFzIGFueSkpIHtcclxuICAgICAgcmV0dXJuIHJldHVyblR5cGUgPyAnc3RyaW5nJyA6IHV0ZjhUb0hleCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmV0dXJuVHlwZSA/ICh2YWx1ZSA8IDAgPyAnaW50MjU2JyA6ICd1aW50MjU2JykgOiBudW1iZXJUb0hleCh2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBzdHJpbmcgaXMgSEVYLCByZXF1aXJlcyBhIDB4IGluIGZyb250XHJcbiAqXHJcbiAqIEBtZXRob2QgaXNIZXhTdHJpY3RcclxuICogQHBhcmFtIGhleCB0byBiZSBjaGVja2VkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNIZXhTdHJpY3QoaGV4OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHlwZW9mIGhleCA9PT0gJ3N0cmluZycgfHxcclxuICAgICh0eXBlb2YgaGV4ID09PSAnbnVtYmVyJyAmJiAvXigtKT8weFswLTlhLWZdKiQvaS50ZXN0KGhleCkpXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHN0cmluZyBpcyBIRVhcclxuICpcclxuICogQG1ldGhvZCBpc0hleFxyXG4gKiBAcGFyYW0gaGV4IHRvIGJlIGNoZWNrZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0hleChoZXg6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICB0eXBlb2YgaGV4ID09PSAnc3RyaW5nJyB8fFxyXG4gICAgKHR5cGVvZiBoZXggPT09ICdudW1iZXInICYmIC9eKC0weHwweCk/WzAtOWEtZl0qJC9pLnRlc3QoaGV4KSlcclxuICApO1xyXG59XHJcbiIsImltcG9ydCB7IGhleFRvTnVtYmVyIH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQmxvY2sge1xyXG4gIC8qKiB0aGUgYmxvY2sgbnVtYmVyLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcgYmxvY2suICovXHJcbiAgbnVtYmVyOiBudW1iZXI7XHJcbiAgLyoqIGhhc2ggb2YgdGhlIGJsb2NrLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcgYmxvY2suICovXHJcbiAgaGFzaDogc3RyaW5nO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSBwYXJlbnQgYmxvY2suICovXHJcbiAgcGFyZW50SGFzaDogc3RyaW5nO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSBnZW5lcmF0ZWQgcHJvb2Ytb2Ytd29yay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGJsb2NrLiAqL1xyXG4gIG5vbmNlOiBzdHJpbmc7XHJcbiAgLyoqIFNIQTMgb2YgdGhlIHVuY2xlcyBkYXRhIGluIHRoZSBibG9jay4gKi9cclxuICBzaGEzVW5jbGVzOiBzdHJpbmc7XHJcbiAgLyoqIHRoZSBibG9vbSBmaWx0ZXIgZm9yIHRoZSBsb2dzIG9mIHRoZSBibG9jay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGJsb2NrLiAqL1xyXG4gIGxvZ3NCbG9vbTogc3RyaW5nO1xyXG4gIC8qKiB0aGUgcm9vdCBvZiB0aGUgdHJhbnNhY3Rpb24gdHJpZSBvZiB0aGUgYmxvY2suICovXHJcbiAgdHJhbnNhY3Rpb25zUm9vdDogc3RyaW5nO1xyXG4gIC8qKiB0aGUgcm9vdCBvZiB0aGUgZmluYWwgc3RhdGUgdHJpZSBvZiB0aGUgYmxvY2suICovXHJcbiAgc3RhdGVSb290OiBzdHJpbmc7XHJcbiAgLyoqIHRoZSByb290IG9mIHRoZSByZWNlaXB0cyB0cmllIG9mIHRoZSBibG9jay4gKi9cclxuICByZWNlaXB0c1Jvb3Q6IHN0cmluZztcclxuICAvKiogdGhlIGFkZHJlc3Mgb2YgdGhlIGJlbmVmaWNpYXJ5IHRvIHdob20gdGhlIG1pbmluZyByZXdhcmRzIHdlcmUgZ2l2ZW4uICovXHJcbiAgbWluZXI6IHN0cmluZztcclxuICAvKiogaW50ZWdlciBvZiB0aGUgZGlmZmljdWx0eSBmb3IgdGhpcyBibG9jay4gKi9cclxuICBkaWZmaWN1bHR5OiBudW1iZXI7XHJcbiAgLyoqICBpbnRlZ2VyIG9mIHRoZSB0b3RhbCBkaWZmaWN1bHR5IG9mIHRoZSBjaGFpbiB1bnRpbCB0aGlzIGJsb2NrLiAqL1xyXG4gIHRvdGFsRGlmZmljdWx0eTogbnVtYmVyO1xyXG4gIC8qKiBpbnRlZ2VyIHRoZSBzaXplIG9mIHRoaXMgYmxvY2sgaW4gYnl0ZXMuICovXHJcbiAgc2l6ZTogbnVtYmVyO1xyXG4gIC8qKiB0aGUgXCJleHRyYSBkYXRhXCIgZmllbGQgb2YgdGhpcyBibG9jay4gKi9cclxuICBleHRyYURhdGE6IHN0cmluZztcclxuICAvKiogdGhlIG1heGltdW0gZ2FzIGFsbG93ZWQgaW4gdGhpcyBibG9jay4gKi9cclxuICBnYXNMaW1pdDogbnVtYmVyO1xyXG4gIC8qKiB0aGUgdG90YWwgdXNlZCBnYXMgYnkgYWxsIHRyYW5zYWN0aW9ucyBpbiB0aGlzIGJsb2NrLiAqL1xyXG4gIGdhc1VzZWQ6IG51bWJlcjtcclxuICAvKiogdGhlIHVuaXggdGltZXN0YW1wIGZvciB3aGVuIHRoZSBibG9jayB3YXMgY29sbGF0ZWQuICovXHJcbiAgdGltZXN0YW1wOiBudW1iZXI7XHJcbiAgLyoqIEFycmF5IG9mIHRyYW5zYWN0aW9uIG9iamVjdHMsIG9yIDMyIEJ5dGVzIHRyYW5zYWN0aW9uIGhhc2hlcyBkZXBlbmRpbmcgb24gdGhlIGxhc3QgZ2l2ZW4gcGFyYW1ldGVyLiAqL1xyXG4gIHRyYW5zYWN0aW9uczogc3RyaW5nW107XHJcbiAgLyoqIEFycmF5IG9mIHVuY2xlIGhhc2hlcy4gKi9cclxuICB1bmNsZXM6IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmxvY2sgaW1wbGVtZW50cyBJQmxvY2sge1xyXG4gIG51bWJlcjogbnVtYmVyO1xyXG4gIGhhc2g6IHN0cmluZztcclxuICBwYXJlbnRIYXNoOiBzdHJpbmc7XHJcbiAgbm9uY2U6IHN0cmluZztcclxuICBzaGEzVW5jbGVzOiBzdHJpbmc7XHJcbiAgbG9nc0Jsb29tOiBzdHJpbmc7XHJcbiAgdHJhbnNhY3Rpb25zUm9vdDogc3RyaW5nO1xyXG4gIHN0YXRlUm9vdDogc3RyaW5nO1xyXG4gIHJlY2VpcHRzUm9vdDogc3RyaW5nO1xyXG4gIG1pbmVyOiBzdHJpbmc7XHJcbiAgZGlmZmljdWx0eTogbnVtYmVyO1xyXG4gIHRvdGFsRGlmZmljdWx0eTogbnVtYmVyO1xyXG4gIHNpemU6IG51bWJlcjtcclxuICBleHRyYURhdGE6IHN0cmluZztcclxuICBnYXNMaW1pdDogbnVtYmVyO1xyXG4gIGdhc1VzZWQ6IG51bWJlcjtcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICB0cmFuc2FjdGlvbnM6IHN0cmluZ1tdO1xyXG4gIHVuY2xlczogc3RyaW5nW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKGV0aEJsb2NrKSB7XHJcbiAgICB0aGlzLm51bWJlciA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLm51bWJlcik7XHJcbiAgICB0aGlzLmhhc2ggPSBldGhCbG9jay5oYXNoO1xyXG4gICAgdGhpcy5wYXJlbnRIYXNoID0gZXRoQmxvY2sucGFyZW50SGFzaDtcclxuICAgIHRoaXMubm9uY2UgPSBldGhCbG9jay5ub25jZTtcclxuICAgIHRoaXMuc2hhM1VuY2xlcyA9IGV0aEJsb2NrLnNoYTNVbmNsZXM7XHJcbiAgICB0aGlzLmxvZ3NCbG9vbSA9IGV0aEJsb2NrLmxvZ3NCbG9vbTtcclxuICAgIHRoaXMudHJhbnNhY3Rpb25zUm9vdCA9IGV0aEJsb2NrLnRyYW5zYWN0aW9uc1Jvb3Q7XHJcbiAgICB0aGlzLnN0YXRlUm9vdCA9IGV0aEJsb2NrLnN0YXRlUm9vdDtcclxuICAgIHRoaXMucmVjZWlwdHNSb290ID0gZXRoQmxvY2sucmVjZWlwdHNSb290O1xyXG4gICAgdGhpcy5taW5lciA9IGV0aEJsb2NrLm1pbmVyO1xyXG4gICAgdGhpcy5kaWZmaWN1bHR5ID0gaGV4VG9OdW1iZXIoZXRoQmxvY2suZGlmZmljdWx0eSk7XHJcbiAgICB0aGlzLnRvdGFsRGlmZmljdWx0eSA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLnRvdGFsRGlmZmljdWx0eSk7XHJcbiAgICB0aGlzLnNpemUgPSBoZXhUb051bWJlcihldGhCbG9jay5zaXplKTtcclxuICAgIHRoaXMuZXh0cmFEYXRhID0gZXRoQmxvY2suZXh0cmFEYXRhO1xyXG4gICAgdGhpcy5nYXNMaW1pdCA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLmdhc0xpbWl0KTtcclxuICAgIHRoaXMuZ2FzVXNlZCA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLmdhc1VzZWQpO1xyXG4gICAgdGhpcy50aW1lc3RhbXAgPSBoZXhUb051bWJlcihldGhCbG9jay50aW1lc3RhbXApO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbnMgPSBldGhCbG9jay50cmFuc2FjdGlvbnM7XHJcbiAgICB0aGlzLnVuY2xlcyA9IGV0aEJsb2NrLnVuY2xlcztcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgaGV4VG9OdW1iZXIsIHRvQk4gfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElUcmFuc2FjdGlvbiB7XHJcbiAgLyoqIGhhc2ggb2YgdGhlIHRyYW5zYWN0aW9uLiAqL1xyXG4gIGhhc2g6IHN0cmluZztcclxuICAvKiogVGhlIG51bWJlciBvZiB0cmFuc2FjdGlvbnMgbWFkZSBieSB0aGUgc2VuZGVyIHByaW9yIHRvIHRoaXMgb25lLiAqL1xyXG4gIG5vbmNlOiBudW1iZXI7XHJcbiAgLyoqIEhhc2ggb2YgdGhlIGJsb2NrIHdoZXJlIHRoaXMgdHJhbnNhY3Rpb24gd2FzIGluLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcuICovXHJcbiAgYmxvY2tIYXNoOiBzdHJpbmc7XHJcbiAgLyoqIEJsb2NrIG51bWJlciB3aGVyZSB0aGlzIHRyYW5zYWN0aW9uIHdhcyBpbi4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nLiAqL1xyXG4gIGJsb2NrTnVtYmVyOiBudW1iZXI7XHJcbiAgLyoqIEludGVnZXIgb2YgdGhlIHRyYW5zYWN0aW9ucyBpbmRleCBwb3NpdGlvbiBpbiB0aGUgYmxvY2suIG51bGwgd2hlbiBpdHMgcGVuZGluZy4gKi9cclxuICB0cmFuc2FjdGlvbkluZGV4OiBudW1iZXI7XHJcbiAgLyoqIEFkZHJlc3Mgb2YgdGhlIHNlbmRlci4gKi9cclxuICBmcm9tOiBzdHJpbmc7XHJcbiAgLyoqIEFkZHJlc3Mgb2YgdGhlIHJlY2VpdmVyLiBudWxsIHdoZW4gaXRzIGEgY29udHJhY3QgY3JlYXRpb24gdHJhbnNhY3Rpb24uICovXHJcbiAgdG86IHN0cmluZztcclxuICAvKiogQmlnTnVtYmVyOjp2YWx1ZSB0cmFuc2ZlcnJlZCBpbiBXZWkgICovXHJcbiAgdmFsdWU6IHN0cmluZztcclxuICAvKiogR2FzIHByb3ZpZGVkIGJ5IHRoZSBzZW5kZXIuICovXHJcbiAgZ2FzOiBudW1iZXI7XHJcbiAgLyoqIEdhcyBwcmljZSBwcm92aWRlZCBieSB0aGUgc2VuZGVyIGluIFdlaS4gKi9cclxuICBnYXNQcmljZTogbnVtYmVyO1xyXG4gIC8qKiBUaGUgZGF0YSBzZW5kIGFsb25nIHdpdGggdGhlIHRyYW5zYWN0aW9uLiAqL1xyXG4gIGlucHV0OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2FjdGlvbiBpbXBsZW1lbnRzIElUcmFuc2FjdGlvbiB7XHJcbiAgaGFzaDogc3RyaW5nO1xyXG4gIG5vbmNlOiBudW1iZXI7XHJcbiAgYmxvY2tIYXNoOiBzdHJpbmc7XHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICB0cmFuc2FjdGlvbkluZGV4OiBudW1iZXI7XHJcbiAgZnJvbTogc3RyaW5nO1xyXG4gIHRvOiBzdHJpbmc7XHJcbiAgdmFsdWU6IHN0cmluZztcclxuICBnYXM6IG51bWJlcjtcclxuICBnYXNQcmljZTogbnVtYmVyO1xyXG4gIGlucHV0OiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGV0aFR4KSB7XHJcbiAgICB0aGlzLmhhc2ggPSBldGhUeC5oYXNoO1xyXG4gICAgdGhpcy5ub25jZSA9IGhleFRvTnVtYmVyKGV0aFR4Lm5vbmNlKTtcclxuICAgIHRoaXMuYmxvY2tIYXNoID0gZXRoVHguYmxvY2tIYXNoO1xyXG4gICAgdGhpcy5ibG9ja051bWJlciA9IGhleFRvTnVtYmVyKGV0aFR4LmJsb2NrTnVtYmVyKTtcclxuICAgIHRoaXMudHJhbnNhY3Rpb25JbmRleCA9IGhleFRvTnVtYmVyKGV0aFR4LnRyYW5zYWN0aW9uSW5kZXgpO1xyXG4gICAgdGhpcy5mcm9tID0gZXRoVHguZnJvbTtcclxuICAgIHRoaXMudG8gPSBldGhUeC50bztcclxuICAgIHRoaXMudmFsdWUgPSB0b0JOKGV0aFR4LnZhbHVlKS50b1N0cmluZygxMCk7XHJcbiAgICB0aGlzLmdhcyA9IGhleFRvTnVtYmVyKGV0aFR4Lmdhcyk7XHJcbiAgICB0aGlzLmdhc1ByaWNlID0gaGV4VG9OdW1iZXIoZXRoVHguZ2FzUHJpY2UpO1xyXG4gICAgdGhpcy5pbnB1dCA9IGV0aFR4LmlucHV0O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoZXhUb051bWJlciB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVR4TG9ncyB7XHJcbiAgLyoqICBjb250YWlucyBvbmUgb3IgbW9yZSAzMiBCeXRlcyBub24taW5kZXhlZCBhcmd1bWVudHMgb2YgdGhlIGxvZy4gKi9cclxuICBkYXRhOiBzdHJpbmc7XHJcbiAgLyoqIEFycmF5IG9mIDAgdG8gNCAzMi1CeXRlcyBvZiBpbmRleGVkIGxvZyBhcmd1bWVudHMuIChJbiBzb2xpZGl0eTogVGhlIGZpcnN0IHRvcGljIGlzIHRoZSBoYXNoIG9mIHRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50ICovXHJcbiAgdG9waWNzOiBzdHJpbmdbXTtcclxuICAvKiogaW50ZWdlciBvZiB0aGUgbG9nIGluZGV4IHBvc2l0aW9uIGluIHRoZSBibG9jay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGxvZy4gKi9cclxuICBsb2dJbmRleDogbnVtYmVyO1xyXG4gIC8qKiBpbnRlZ2VyIG9mIHRoZSB0cmFuc2FjdGlvbnMgaW5kZXggcG9zaXRpb24gbG9nIHdhcyBjcmVhdGVkIGZyb20uIG51bGwgd2hlbiBpdHMgcGVuZGluZyBsb2cuICovXHJcbiAgdHJhbnNhY3Rpb25JbmRleDogbnVtYmVyO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSB0cmFuc2FjdGlvbnMgdGhpcyBsb2cgd2FzIGNyZWF0ZWQgZnJvbS4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGxvZy4gKi9cclxuICB0cmFuc2FjdGlvbkhhc2g6IHN0cmluZztcclxuICAvKiogaGFzaCBvZiB0aGUgYmxvY2sgd2hlcmUgdGhpcyBsb2cgd2FzIGluLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcuIG51bGwgd2hlbiBpdHMgcGVuZGluZyBsb2cuICovXHJcbiAgYmxvY2tIYXNoOiBzdHJpbmc7XHJcbiAgLyoqIHRoZSBibG9jayBudW1iZXIgd2hlcmUgdGhpcyBsb2cgd2FzIGluLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcuIG51bGwgd2hlbiBpdHMgcGVuZGluZyBsb2cuICovXHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICAvKiogYWRkcmVzcyBmcm9tIHdoaWNoIHRoaXMgbG9nIG9yaWdpbmF0ZWQuICovXHJcbiAgYWRkcmVzczogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHhMb2dzIHtcclxuICBkYXRhOiBzdHJpbmc7XHJcbiAgdG9waWNzOiBzdHJpbmdbXTtcclxuICBsb2dJbmRleDogbnVtYmVyO1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICB0cmFuc2FjdGlvbkhhc2g6IHN0cmluZztcclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICBibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZXRoVHhMb2dzKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBldGhUeExvZ3MuZGF0YTtcclxuICAgIHRoaXMudG9waWNzID0gZXRoVHhMb2dzLnRvcGljcztcclxuICAgIHRoaXMubG9nSW5kZXggPSBoZXhUb051bWJlcihldGhUeExvZ3MubG9nSW5kZXgpO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbkluZGV4ID0gaGV4VG9OdW1iZXIoZXRoVHhMb2dzLnRyYW5zYWN0aW9uSW5kZXgpO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbkhhc2ggPSBldGhUeExvZ3MudHJhbnNhY3Rpb25IYXNoO1xyXG4gICAgdGhpcy5ibG9ja0hhc2ggPSBldGhUeExvZ3MuYmxvY2tIYXNoO1xyXG4gICAgdGhpcy5ibG9ja051bWJlciA9IGhleFRvTnVtYmVyKGV0aFR4TG9ncy5ibG9ja051bWJlcik7XHJcbiAgICB0aGlzLmFkZHJlc3MgPSBldGhUeExvZ3MuYWRkcmVzcztcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSVR4TG9ncywgVHhMb2dzIH0gZnJvbSAnLi90eC1sb2dzJztcclxuaW1wb3J0IHsgaGV4VG9OdW1iZXIgfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElUeFJlY2VpcHQge1xyXG4gIC8qKiAzMiBieXRlcyBvZiBwb3N0LXRyYW5zYWN0aW9uIHN0YXRlcm9vdCAocHJlIEJ5emFudGl1bSkgICovXHJcbiAgcm9vdD86IHN0cmluZztcclxuICAvKiogc3VjY2VzcyBvciBmYWlsdXJlICovXHJcbiAgc3RhdHVzPzogYm9vbGVhbjtcclxuICAvKiogIGhhc2ggb2YgdGhlIHRyYW5zYWN0aW9uICovXHJcbiAgdHJhbnNhY3Rpb25IYXNoOiBzdHJpbmc7XHJcbiAgLyoqIGludGVnZXIgb2YgdGhlIHRyYW5zYWN0aW9ucyBpbmRleCBwb3NpdGlvbiBpbiB0aGUgYmxvY2suICovXHJcbiAgdHJhbnNhY3Rpb25JbmRleDogbnVtYmVyO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSBibG9jayB3aGVyZSB0aGlzIHRyYW5zYWN0aW9uIHdhcyBpbi4gKi9cclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICAvKiogYmxvY2sgbnVtYmVyIHdoZXJlIHRoaXMgdHJhbnNhY3Rpb24gd2FzIGluLiAqL1xyXG4gIGJsb2NrTnVtYmVyOiBudW1iZXI7XHJcbiAgLyoqIFRoZSBjb250cmFjdCBhZGRyZXNzIGNyZWF0ZWQsIGlmIHRoZSB0cmFuc2FjdGlvbiB3YXMgYSBjb250cmFjdCBjcmVhdGlvbiwgb3RoZXJ3aXNlIG51bGwuICovXHJcbiAgY29udHJhY3RBZGRyZXNzOiBzdHJpbmc7XHJcbiAgLyoqIFRoZSB0b3RhbCBhbW91bnQgb2YgZ2FzIHVzZWQgd2hlbiB0aGlzIHRyYW5zYWN0aW9uIHdhcyBleGVjdXRlZCBpbiB0aGUgYmxvY2suICovXHJcbiAgY3VtdWxhdGl2ZUdhc1VzZWQ6IG51bWJlcjtcclxuICAvKiogVGhlIGFtb3VudCBvZiBnYXMgdXNlZCBieSB0aGlzIHNwZWNpZmljIHRyYW5zYWN0aW9uIGFsb25lLiAqL1xyXG4gIGdhc1VzZWQ6IG51bWJlcjtcclxuICAvKiogQXJyYXkgb2YgbG9nIG9iamVjdHMsIHdoaWNoIHRoaXMgdHJhbnNhY3Rpb24gZ2VuZXJhdGVkLiAqL1xyXG4gIGxvZ3M6IElUeExvZ3NbXTtcclxuICAvKiogIEJsb29tIGZpbHRlciBmb3IgbGlnaHQgY2xpZW50cyB0byBxdWlja2x5IHJldHJpZXZlIHJlbGF0ZWQgbG9ncy4gKi9cclxuICBsb2dzQmxvb206IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFR4UmVjZWlwdCB7XHJcbiAgcm9vdD86IHN0cmluZztcclxuICBzdGF0dXM/OiBib29sZWFuO1xyXG4gIHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nO1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICBibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIGNvbnRyYWN0QWRkcmVzczogc3RyaW5nO1xyXG4gIGN1bXVsYXRpdmVHYXNVc2VkOiBudW1iZXI7XHJcbiAgZ2FzVXNlZDogbnVtYmVyO1xyXG4gIGxvZ3M6IElUeExvZ3NbXTtcclxuICBsb2dzQmxvb206IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZXRoVHhSZWNlaXB0KSB7XHJcbiAgICBpZiAoZXRoVHhSZWNlaXB0LnN0YXR1cykge1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IGhleFRvTnVtYmVyKGV0aFR4UmVjZWlwdC5zdGF0dXMpID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yb290ID0gZXRoVHhSZWNlaXB0LnJvb3Q7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyYW5zYWN0aW9uSGFzaCA9IGV0aFR4UmVjZWlwdC50cmFuc2FjdGlvbkhhc2g7XHJcbiAgICB0aGlzLnRyYW5zYWN0aW9uSW5kZXggPSBoZXhUb051bWJlcihldGhUeFJlY2VpcHQudHJhbnNhY3Rpb25JbmRleCk7XHJcbiAgICB0aGlzLmJsb2NrSGFzaCA9IGV0aFR4UmVjZWlwdC5ibG9ja0hhc2g7XHJcbiAgICB0aGlzLmJsb2NrTnVtYmVyID0gaGV4VG9OdW1iZXIoZXRoVHhSZWNlaXB0LmJsb2NrTnVtYmVyKTtcclxuICAgIHRoaXMuY29udHJhY3RBZGRyZXNzID0gZXRoVHhSZWNlaXB0LmNvbnRyYWN0QWRkcmVzcztcclxuICAgIHRoaXMuY3VtdWxhdGl2ZUdhc1VzZWQgPSBoZXhUb051bWJlcihldGhUeFJlY2VpcHQuY3VtdWxhdGl2ZUdhc1VzZWQpO1xyXG4gICAgdGhpcy5nYXNVc2VkID0gaGV4VG9OdW1iZXIoZXRoVHhSZWNlaXB0Lmdhc1VzZWQpO1xyXG4gICAgdGhpcy5sb2dzID0gZXRoVHhSZWNlaXB0LmxvZ3MubWFwKGxvZyA9PiBuZXcgVHhMb2dzKGxvZykpO1xyXG4gICAgdGhpcy5sb2dzQmxvb20gPSBldGhUeFJlY2VpcHQubG9nc0Jsb29tO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBCTiB9IGZyb20gJ2JuLmpzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVR4T2JqZWN0IHtcclxuICAgIC8qKiBUaGUgYWRkcmVzcyB0aGUgdHJhbnNhY3Rpb24gaXMgc2VuZCBmcm9tLiAqL1xyXG4gICAgZnJvbTogc3RyaW5nO1xyXG4gICAgLyoqIFRoZSBhZGRyZXNzIHRoZSB0cmFuc2FjdGlvbiBpcyBkaXJlY3RlZCB0by4gKi9cclxuICAgIHRvOiBzdHJpbmc7XHJcbiAgICAvKiogKGRlZmF1bHQ6IDkwMDAwKSBJbnRlZ2VyIG9mIHRoZSBnYXMgcHJvdmlkZWQgZm9yIHRoZSB0cmFuc2FjdGlvbiBleGVjdXRpb24uIEl0IHdpbGwgcmV0dXJuIHVudXNlZCBnYXMuICovXHJcbiAgICBnYXM6IG51bWJlcjtcclxuICAgIC8qKiBJbnRlZ2VyIG9mIHRoZSBnYXNQcmljZSB1c2VkIGZvciBlYWNoIHBhaWQgZ2FzICovXHJcbiAgICBnYXNQcmljZTogc3RyaW5nO1xyXG4gICAgLyoqIEludGVnZXIgb2YgdGhlIHZhbHVlIHNlbnQgd2l0aCBpZiAodHggdHJhbnNhY3Rpb24gKi9cclxuICAgIHZhbHVlOiBzdHJpbmc7XHJcbiAgICAvKiogVGhlIGNvbXBpbGVkIGNvZGUgb2YgYSBjb250cmFjdCBPUiB0aGUgaGFzaCBvZiB0aGUgaW52b2tlZCBtZXRob2Qgc2lnbmF0dXJlIGFuZCBlbmNvZGVkIHBhcmFtZXRlcnMuICovXHJcbiAgICBkYXRhOiBzdHJpbmc7XHJcbiAgICAvKiogSW50ZWdlciBvZiBhIG5vbmNlLiBUaGlzIGFsbG93cyB0byBvdmVyd3JpdGUgeW91ciBvd24gcGVuZGluZyB0cmFuc2FjdGlvbnMgdGhhdCB1c2UgdGhlIHNhbWUgbm9uY2UuICovXHJcbiAgICBub25jZTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHhPYmplY3Qge1xyXG4gIC8qKiBUaGUgYWRkcmVzcyB0aGUgdHJhbnNhY3Rpb24gaXMgc2VuZCBmcm9tLiAqL1xyXG4gIHB1YmxpYyBmcm9tOiBzdHJpbmc7XHJcbiAgLyoqIFRoZSBhZGRyZXNzIHRoZSB0cmFuc2FjdGlvbiBpcyBkaXJlY3RlZCB0by4gKi9cclxuICBwdWJsaWMgdG86IHN0cmluZztcclxuICAvKiogKGRlZmF1bHQ6IDkwMDAwKSBJbnRlZ2VyIG9mIHRoZSBnYXMgcHJvdmlkZWQgZm9yIHRoZSB0cmFuc2FjdGlvbiBleGVjdXRpb24uIEl0IHdpbGwgcmV0dXJuIHVudXNlZCBnYXMuICovXHJcbiAgcHVibGljIGdhczogc3RyaW5nO1xyXG4gIC8qKiBJbnRlZ2VyIG9mIHRoZSBnYXNQcmljZSB1c2VkIGZvciBlYWNoIHBhaWQgZ2FzICovXHJcbiAgcHVibGljIGdhc1ByaWNlOiBzdHJpbmc7XHJcbiAgLyoqIEludGVnZXIgb2YgdGhlIHZhbHVlIHNlbnQgd2l0aCBpZiAodHggdHJhbnNhY3Rpb24gKi9cclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICAvKiogVGhlIGNvbXBpbGVkIGNvZGUgb2YgYSBjb250cmFjdCBPUiB0aGUgaGFzaCBvZiB0aGUgaW52b2tlZCBtZXRob2Qgc2lnbmF0dXJlIGFuZCBlbmNvZGVkIHBhcmFtZXRlcnMuICovXHJcbiAgcHVibGljIGRhdGE6IHN0cmluZztcclxuICAvKiogSW50ZWdlciBvZiBhIG5vbmNlLiBUaGlzIGFsbG93cyB0byBvdmVyd3JpdGUgeW91ciBvd24gcGVuZGluZyB0cmFuc2FjdGlvbnMgdGhhdCB1c2UgdGhlIHNhbWUgbm9uY2UuICovXHJcbiAgcHVibGljIG5vbmNlOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHR4OiBQYXJ0aWFsPElUeE9iamVjdD4pIHtcclxuICAgIGlmICh0eC5mcm9tKSB0aGlzLmZyb20gPSB0eC5mcm9tO1xyXG4gICAgaWYgKHR4LnRvKSB0aGlzLnRvID0gdHgudG87XHJcbiAgICBpZiAodHguZGF0YSkgdGhpcy5kYXRhID0gdHguZGF0YTtcclxuXHJcbiAgICBpZiAodHguZ2FzKSB0aGlzLmdhcyA9IG5ldyBCTih0eC5nYXMsIDEwKS50b1N0cmluZygxNik7XHJcbiAgICBpZiAodHguZ2FzUHJpY2UpIHRoaXMuZ2FzUHJpY2UgPSBuZXcgQk4odHguZ2FzUHJpY2UsIDEwKS50b1N0cmluZygxNik7XHJcbiAgICBpZiAodHgudmFsdWUpIHRoaXMudmFsdWUgPSBuZXcgQk4odHgudmFsdWUsIDEwKS50b1N0cmluZygxNik7XHJcbiAgICBpZiAodHgubm9uY2UpIHRoaXMubm9uY2UgPSBuZXcgQk4odHgubm9uY2UsIDEwKS50b1N0cmluZygxNik7XHJcblxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiQk4iLCJ1dGY4LmVuY29kZSIsInV0ZjguZGVjb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7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SUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMxRCxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2xFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDNUQ7eUJBQU07d0JBQ0wsSUFBSTs0QkFDRixPQUFPO2lDQUNOLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxLQUFLLEVBQUUsS0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDbkUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMxRCxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25FLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDbEUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENB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QUFDO2dCQUNMLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDUDtTQUNGO1FBQ0QsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO0tBQ25CLENBQUM7SUFFRixxQkFBTSxDQUFDLEdBQUcsVUFBQSxDQUFDO1FBQ1QscUJBQUksQ0FBQyxtQkFDSCxDQUFDLG1CQUNELENBQUMsbUJBQ0QsRUFBRSxtQkFDRixFQUFFLG1CQUNGLEVBQUUsbUJBQ0YsRUFBRSxtQkFDRixFQUFFLG1CQUNGLEVBQUUsbUJBQ0YsRUFBRSxtQkFDRixFQUFFLG1CQUNGLEVBQUUsbUJBQ0YsRUFBRSxtQkFDRixFQUFFLG1CQUNGLEVBQUUsbUJBQ0YsRUFBRSxtQkFDRixFQUFFLG1CQUNGLEVBQUUsbUJBQ0YsRUFBRSxtQkFDRixFQUFFLG1CQUNGLEVBQUUsbUJBQ0YsRUFBRSxtQkFDRixFQUFFLG1CQUNGLEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsbUJBQ0gsR0FBRyxtQkFDSCxHQUFHLG1CQUNILEdBQUcsQ0FBQztRQUVOLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFMUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNWLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDVixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDVixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNWLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDVixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDVixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFWCxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ2xDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBRXBDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUUzQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbkI7S0FDRixDQUFDO0lBRUYscUJBQU0sTUFBTSxHQUFH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