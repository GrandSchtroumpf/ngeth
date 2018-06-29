import BN, { BN as BN$1 } from 'bn.js';
import { encode, decode } from 'utf8';

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
    return (object instanceof BN ||
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
    catch (/** @type {?} */ e) {
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
        var /** @type {?} */ multiplier = new BN(1);
        var /** @type {?} */ formattedString = String(arg)
            .toLowerCase()
            .trim();
        var /** @type {?} */ isPrefixed = formattedString.substr(0, 2) === '0x' ||
            formattedString.substr(0, 3) === '-0x';
        var /** @type {?} */ stringArg = stripHexPrefix(formattedString);
        if (stringArg.substr(0, 1) === '-') {
            stringArg = stripHexPrefix(stringArg.slice(1));
            multiplier = new BN(-1, 10);
        }
        stringArg = stringArg === '' ? '0' : stringArg;
        if ((!stringArg.match(/^-?[0-9]+$/) && stringArg.match(/^[0-9A-Fa-f]+$/)) ||
            stringArg.match(/^[a-fA-F]+$/) ||
            (isPrefixed === true && stringArg.match(/^[0-9A-Fa-f]+$/))) {
            return new BN(stringArg, 16).mul(multiplier);
        }
        if ((stringArg.match(/^-?[0-9]+$/) || stringArg === '') &&
            isPrefixed === false) {
            return new BN(stringArg, 10).mul(multiplier);
        }
    }
    else if (typeof arg === 'object' &&
        arg.toString &&
        (!arg['pop'] && !arg['push'])) {
        if (arg.toString().match(/^-?[0-9]+$/) &&
            (arg['mul'] || arg['dividedToIntegerBy'])) {
            return new BN(arg.toString(), 10);
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
    var /** @type {?} */ length = message.length, /** @type {?} */
    blocks = state.blocks, /** @type {?} */
    byteCount = state.blockCount << 2, /** @type {?} */
    blockCount = state.blockCount, /** @type {?} */
    outputBlocks = state.outputBlocks, /** @type {?} */
    s = state.s;
    var /** @type {?} */ index = 0, /** @type {?} */
    i, /** @type {?} */
    code;
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
    var /** @type {?} */ hex = '', /** @type {?} */
    j = 0, /** @type {?} */
    block;
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
    var /** @type {?} */ h, /** @type {?} */
    l, /** @type {?} */
    n, /** @type {?} */
    c0, /** @type {?} */
    c1, /** @type {?} */
    c2, /** @type {?} */
    c3, /** @type {?} */
    c4, /** @type {?} */
    c5, /** @type {?} */
    c6, /** @type {?} */
    c7, /** @type {?} */
    c8, /** @type {?} */
    c9, /** @type {?} */
    b0, /** @type {?} */
    b1, /** @type {?} */
    b2, /** @type {?} */
    b3, /** @type {?} */
    b4, /** @type {?} */
    b5, /** @type {?} */
    b6, /** @type {?} */
    b7, /** @type {?} */
    b8, /** @type {?} */
    b9, /** @type {?} */
    b10, /** @type {?} */
    b11, /** @type {?} */
    b12, /** @type {?} */
    b13, /** @type {?} */
    b14, /** @type {?} */
    b15, /** @type {?} */
    b16, /** @type {?} */
    b17, /** @type {?} */
    b18, /** @type {?} */
    b19, /** @type {?} */
    b20, /** @type {?} */
    b21, /** @type {?} */
    b22, /** @type {?} */
    b23, /** @type {?} */
    b24, /** @type {?} */
    b25, /** @type {?} */
    b26, /** @type {?} */
    b27, /** @type {?} */
    b28, /** @type {?} */
    b29, /** @type {?} */
    b30, /** @type {?} */
    b31, /** @type {?} */
    b32, /** @type {?} */
    b33, /** @type {?} */
    b34, /** @type {?} */
    b35, /** @type {?} */
    b36, /** @type {?} */
    b37, /** @type {?} */
    b38, /** @type {?} */
    b39, /** @type {?} */
    b40, /** @type {?} */
    b41, /** @type {?} */
    b42, /** @type {?} */
    b43, /** @type {?} */
    b44, /** @type {?} */
    b45, /** @type {?} */
    b46, /** @type {?} */
    b47, /** @type {?} */
    b48, /** @type {?} */
    b49;
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
    string = (/** @type {?} */ (string)).toString(16).replace(/^0x/i, '');
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
    string = (/** @type {?} */ (string)).toString(16).replace(/^0x/i, '');
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
    str = encode(str);
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
    return decode(str);
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
    return new BN(value, 16).toNumber();
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
    return new BN(value, 16).toString(10);
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
    return number.lt(new BN(0)) ? '-0x' + result.substr(1) : '0x' + result;
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
    hex = (/** @type {?} */ (hex)).toString(16);
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
var Block = /** @class */ (function () {
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
var Transaction = /** @class */ (function () {
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
var TxLogs = /** @class */ (function () {
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
var TxReceipt = /** @class */ (function () {
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
var TxObject = /** @class */ (function () {
    function TxObject(tx) {
        if (tx.from)
            this.from = tx.from;
        if (tx.to)
            this.to = tx.to;
        if (tx.data)
            this.data = tx.data;
        if (tx.gas)
            this.gas = new BN$1(tx.gas, 10).toString(16);
        if (tx.gasPrice)
            this.gasPrice = new BN$1(tx.gasPrice, 10).toString(16);
        if (tx.value)
            this.value = new BN$1(tx.value, 10).toString(16);
        if (tx.nonce)
            this.nonce = new BN$1(tx.nonce, 10).toString(16);
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

export { Block, Transaction, TxReceipt, TxLogs, TxObject, isTopic, isAddress, checkAddressChecksum, toChecksumAddress, leftPad, rightPad, sha3, utf8ToHex, hexToUtf8, hexToNumber, hexToNumberString, numberToHex, bytesToHex, hexToBytes, hexToAscii, asciiToHex, toHex, isHexStrict, isHex, isBN, isBigNumber, toBN, toTwosComplement, keccak256 };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtdXRpbHMuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BuZ2V0aC91dGlscy9saWIvdXRpbHMvYmxvY2sudHMiLCJuZzovL0BuZ2V0aC91dGlscy9saWIvdXRpbHMvYm4udHMiLCJuZzovL0BuZ2V0aC91dGlscy9saWIvdXRpbHMva2VjY2Fjay50cyIsIm5nOi8vQG5nZXRoL3V0aWxzL2xpYi91dGlscy9oZXgudHMiLCJuZzovL0BuZ2V0aC91dGlscy9saWIvZm9ybWF0dGVycy9ibG9jay50cyIsIm5nOi8vQG5nZXRoL3V0aWxzL2xpYi9mb3JtYXR0ZXJzL3RyYW5zYWN0aW9uLnRzIiwibmc6Ly9AbmdldGgvdXRpbHMvbGliL2Zvcm1hdHRlcnMvdHgtbG9ncy50cyIsIm5nOi8vQG5nZXRoL3V0aWxzL2xpYi9mb3JtYXR0ZXJzL3R4LXJlY2VpcHQudHMiLCJuZzovL0BuZ2V0aC91dGlscy9saWIvZm9ybWF0dGVycy90eC1vYmplY3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBnaXZlbiBzdHJpbmcgaXMgYSB2YWxpZCBFdGhlcmV1bSBibG9jayBoZWFkZXIgYmxvb20uXHJcbiAqIEBtZXRob2QgaXNCbG9vbVxyXG4gKiBAcGFyYW0gaGV4IGVuY29kZWQgYmxvb20gZmlsdGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Jsb29tKGJsb29tOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICBpZiAoIS9eKDB4KT9bMC05YS1mXXs1MTJ9JC9pLnRlc3QoYmxvb20pKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSBlbHNlIGlmIChcclxuICAgIC9eKDB4KT9bMC05YS1mXXs1MTJ9JC8udGVzdChibG9vbSkgfHxcclxuICAgIC9eKDB4KT9bMC05QS1GXXs1MTJ9JC8udGVzdChibG9vbSlcclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgZ2l2ZW4gc3RyaW5nIGlzIGEgdmFsaWQgbG9nIHRvcGljLlxyXG4gKiBAbWV0aG9kIGlzVG9waWNcclxuICogQHBhcmFtIGhleCBlbmNvZGVkIHRvcGljXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNUb3BpYyh0b3BpYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgaWYgKCEvXigweCk/WzAtOWEtZl17NjR9JC9pLnRlc3QodG9waWMpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSBlbHNlIGlmIChcclxuICAgIC9eKDB4KT9bMC05YS1mXXs2NH0kLy50ZXN0KHRvcGljKSB8fFxyXG4gICAgL14oMHgpP1swLTlBLUZdezY0fSQvLnRlc3QodG9waWMpXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbiIsImltcG9ydCBCTiBmcm9tICdibi5qcyc7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIEJOLCBvdGhlcndpc2UgZmFsc2VcclxuICpcclxuICogQG1ldGhvZCBpc0JOXHJcbiAqIEBwYXJhbSBvYmplY3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0JOKG9iamVjdDogT2JqZWN0KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIG9iamVjdCBpbnN0YW5jZW9mIEJOIHx8XHJcbiAgICAob2JqZWN0ICYmIG9iamVjdC5jb25zdHJ1Y3RvciAmJiBvYmplY3QuY29uc3RydWN0b3IubmFtZSA9PT0gJ0JOJylcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBCaWdOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxyXG4gKlxyXG4gKiBAbWV0aG9kIGlzQmlnTnVtYmVyXHJcbiAqIEBwYXJhbSBvYmplY3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0JpZ051bWJlcihvYmplY3Q6IE9iamVjdCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBvYmplY3QgJiYgb2JqZWN0LmNvbnN0cnVjdG9yICYmIG9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQmlnTnVtYmVyJ1xyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUYWtlcyBhbiBpbnB1dCBhbmQgdHJhbnNmb3JtcyBpdCBpbnRvIGFuIEJOXHJcbiAqIEBwYXJhbSBudW1iZXIsIHN0cmluZywgSEVYIHN0cmluZyBvciBCTlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvQk4obnVtYmVyOiBudW1iZXIgfCBzdHJpbmcgfCBCTik6IEJOIHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIG51bWJlclRvQk4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZX0gKyAnIEdpdmVuIHZhbHVlOiAke251bWJlcn0gYCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVGFrZXMgYW5kIGlucHV0IHRyYW5zZm9ybXMgaXQgaW50byBCTiBhbmQgaWYgaXQgaXMgbmVnYXRpdmUgdmFsdWUsIGludG8gdHdvJ3MgY29tcGxlbWVudFxyXG4gKlxyXG4gKiBAbWV0aG9kIHRvVHdvc0NvbXBsZW1lbnRcclxuICogQHBhcmFtIG51bWJlclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvVHdvc0NvbXBsZW1lbnQobnVtYmVyOiBudW1iZXIgfCBzdHJpbmcgfCBCTik6IHN0cmluZyB7XHJcbiAgcmV0dXJuIChcclxuICAgICcweCcgK1xyXG4gICAgdG9CTihudW1iZXIpXHJcbiAgICAgIC50b1R3b3MoMjU2KVxyXG4gICAgICAudG9TdHJpbmcoMTYsIDY0KVxyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGludGVnZXIgb3IgaGV4IGludGVnZXIgbnVtYmVycyB0byBCTi5qcyBvYmplY3QgaW5zdGFuY2VzLiBEb2VzIG5vdCBzdXBwcm90IGRlY2ltYWwgbnVtYmVycy5cclxuICogQHBhcmFtIGFyZ1xyXG4gKi9cclxuZnVuY3Rpb24gbnVtYmVyVG9CTihhcmc6IHN0cmluZyB8IG51bWJlciB8IG9iamVjdCkge1xyXG4gIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xyXG4gICAgbGV0IG11bHRpcGxpZXIgPSBuZXcgQk4oMSk7XHJcbiAgICBjb25zdCBmb3JtYXR0ZWRTdHJpbmcgPSBTdHJpbmcoYXJnKVxyXG4gICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgICAudHJpbSgpO1xyXG4gICAgY29uc3QgaXNQcmVmaXhlZCA9XHJcbiAgICAgIGZvcm1hdHRlZFN0cmluZy5zdWJzdHIoMCwgMikgPT09ICcweCcgfHxcclxuICAgICAgZm9ybWF0dGVkU3RyaW5nLnN1YnN0cigwLCAzKSA9PT0gJy0weCc7XHJcbiAgICBsZXQgc3RyaW5nQXJnID0gc3RyaXBIZXhQcmVmaXgoZm9ybWF0dGVkU3RyaW5nKTtcclxuICAgIGlmIChzdHJpbmdBcmcuc3Vic3RyKDAsIDEpID09PSAnLScpIHtcclxuICAgICAgc3RyaW5nQXJnID0gc3RyaXBIZXhQcmVmaXgoc3RyaW5nQXJnLnNsaWNlKDEpKTtcclxuICAgICAgbXVsdGlwbGllciA9IG5ldyBCTigtMSwgMTApO1xyXG4gICAgfVxyXG4gICAgc3RyaW5nQXJnID0gc3RyaW5nQXJnID09PSAnJyA/ICcwJyA6IHN0cmluZ0FyZztcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgICghc3RyaW5nQXJnLm1hdGNoKC9eLT9bMC05XSskLykgJiYgc3RyaW5nQXJnLm1hdGNoKC9eWzAtOUEtRmEtZl0rJC8pKSB8fFxyXG4gICAgICBzdHJpbmdBcmcubWF0Y2goL15bYS1mQS1GXSskLykgfHxcclxuICAgICAgKGlzUHJlZml4ZWQgPT09IHRydWUgJiYgc3RyaW5nQXJnLm1hdGNoKC9eWzAtOUEtRmEtZl0rJC8pKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQk4oc3RyaW5nQXJnLCAxNikubXVsKG11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChcclxuICAgICAgKHN0cmluZ0FyZy5tYXRjaCgvXi0/WzAtOV0rJC8pIHx8IHN0cmluZ0FyZyA9PT0gJycpICYmXHJcbiAgICAgIGlzUHJlZml4ZWQgPT09IGZhbHNlXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIG5ldyBCTihzdHJpbmdBcmcsIDEwKS5tdWwobXVsdGlwbGllcik7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmIChcclxuICAgIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmXHJcbiAgICBhcmcudG9TdHJpbmcgJiZcclxuICAgICghYXJnWydwb3AnXSAmJiAhYXJnWydwdXNoJ10pXHJcbiAgKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgIGFyZy50b1N0cmluZygpLm1hdGNoKC9eLT9bMC05XSskLykgJiZcclxuICAgICAgKGFyZ1snbXVsJ10gfHwgYXJnWydkaXZpZGVkVG9JbnRlZ2VyQnknXSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gbmV3IEJOKGFyZy50b1N0cmluZygpLCAxMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aHJvdyBuZXcgRXJyb3IoYFxyXG4gICAgW251bWJlci10by1ibl0gd2hpbGUgY29udmVydGluZyBudW1iZXIgJHtKU09OLnN0cmluZ2lmeShcclxuICAgICAgYXJnXHJcbiAgICApfSB0byBCTi5qcyBpbnN0YW5jZSxcclxuICAgIGVycm9yOiBpbnZhbGlkIG51bWJlciB2YWx1ZS4gVmFsdWUgbXVzdCBiZSBhbiBpbnRlZ2VyLCBoZXggc3RyaW5nLCBCTiBvciBCaWdOdW1iZXIgaW5zdGFuY2UuXHJcbiAgICBOb3RlLCBkZWNpbWFscyBhcmUgbm90IHN1cHBvcnRlZC5cclxuICBgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZXMgJzB4JyBmcm9tIGEgZ2l2ZW4gYFN0cmluZ2AgaWYgcHJlc2VudFxyXG4gKiBAcGFyYW0gc3RyIHRoZSBzdHJpbmcgdmFsdWVcclxuICogQHJldHVybiBhIHN0cmluZyBieSBwYXNzIGlmIG5lY2Vzc2FyeVxyXG4gKi9cclxuZnVuY3Rpb24gc3RyaXBIZXhQcmVmaXgoc3RyPzogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiBzdHI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNIZXhQcmVmaXhlZChzdHIpID8gc3RyLnNsaWNlKDIpIDogc3RyO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIGBCb29sZWFuYCBvbiB3aGV0aGVyIG9yIG5vdCB0aGUgYSBgU3RyaW5nYCBzdGFydHMgd2l0aCAnMHgnXHJcbiAqIEBwYXJhbSBzdHIgdGhlIHN0cmluZyBpbnB1dCB2YWx1ZVxyXG4gKiBAcmV0dXJuICBhIGJvb2xlYW4gaWYgaXQgaXMgb3IgaXMgbm90IGhleCBwcmVmaXhlZFxyXG4gKiBAdGhyb3dzIGlmIHRoZSBzdHIgaW5wdXQgaXMgbm90IGEgc3RyaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0hleFByZWZpeGVkKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgIGBbaXMtaGV4LXByZWZpeGVkXSB2YWx1ZSBtdXN0IGJlIHR5cGUgJ3N0cmluZycsIGlzIGN1cnJlbnRseSB0eXBlICR7dHlwZW9mIHN0cn0sIHdoaWxlIGNoZWNraW5nIGlzSGV4UHJlZml4ZWQuYFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHIuc2xpY2UoMCwgMikgPT09ICcweCc7XHJcbn1cclxuIiwiLyoqXHJcbiAqIENvZGUgZnJvbSBldGgtbGliL2xpYi9oYXNoXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9NYWlhVmljdG9yL2V0aC1saWIvYmxvYi9tYXN0ZXIvbGliL2hhc2guanMjTDExXHJcbiAqL1xyXG5cclxuY29uc3QgSEVYX0NIQVJTID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcclxuY29uc3QgS0VDQ0FLX1BBRERJTkcgPSBbMSwgMjU2LCA2NTUzNiwgMTY3NzcyMTZdO1xyXG5jb25zdCBTSElGVCA9IFswLCA4LCAxNiwgMjRdO1xyXG5jb25zdCBSQyA9IFtcclxuICAxLFxyXG4gIDAsXHJcbiAgMzI4OTgsXHJcbiAgMCxcclxuICAzMjkwNixcclxuICAyMTQ3NDgzNjQ4LFxyXG4gIDIxNDc1MTY0MTYsXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAzMjkwNyxcclxuICAwLFxyXG4gIDIxNDc0ODM2NDksXHJcbiAgMCxcclxuICAyMTQ3NTE2NTQ1LFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMzI3NzcsXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAxMzgsXHJcbiAgMCxcclxuICAxMzYsXHJcbiAgMCxcclxuICAyMTQ3NTE2NDI1LFxyXG4gIDAsXHJcbiAgMjE0NzQ4MzY1OCxcclxuICAwLFxyXG4gIDIxNDc1MTY1NTUsXHJcbiAgMCxcclxuICAxMzksXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAzMjkwNSxcclxuICAyMTQ3NDgzNjQ4LFxyXG4gIDMyNzcxLFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMzI3NzAsXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAxMjgsXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAzMjc3OCxcclxuICAwLFxyXG4gIDIxNDc0ODM2NTgsXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAyMTQ3NTE2NTQ1LFxyXG4gIDIxNDc0ODM2NDgsXHJcbiAgMzI4OTYsXHJcbiAgMjE0NzQ4MzY0OCxcclxuICAyMTQ3NDgzNjQ5LFxyXG4gIDAsXHJcbiAgMjE0NzUxNjQyNCxcclxuICAyMTQ3NDgzNjQ4XHJcbl07XHJcblxyXG5jb25zdCBLZWNjYWsgPSBiaXRzID0+ICh7XHJcbiAgYmxvY2tzOiBbXSxcclxuICByZXNldDogdHJ1ZSxcclxuICBibG9jazogMCxcclxuICBzdGFydDogMCxcclxuICBibG9ja0NvdW50OiAoMTYwMCAtIChiaXRzIDw8IDEpKSA+PiA1LFxyXG4gIG91dHB1dEJsb2NrczogYml0cyA+PiA1LFxyXG4gIHM6IChzID0+IFtdLmNvbmNhdChzLCBzLCBzLCBzLCBzKSkoWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdKVxyXG59KTtcclxuXHJcbmNvbnN0IHVwZGF0ZSA9IChzdGF0ZSwgbWVzc2FnZSkgPT4ge1xyXG4gIGNvbnN0IGxlbmd0aCA9IG1lc3NhZ2UubGVuZ3RoLFxyXG4gICAgYmxvY2tzID0gc3RhdGUuYmxvY2tzLFxyXG4gICAgYnl0ZUNvdW50ID0gc3RhdGUuYmxvY2tDb3VudCA8PCAyLFxyXG4gICAgYmxvY2tDb3VudCA9IHN0YXRlLmJsb2NrQ291bnQsXHJcbiAgICBvdXRwdXRCbG9ja3MgPSBzdGF0ZS5vdXRwdXRCbG9ja3MsXHJcbiAgICBzID0gc3RhdGUucztcclxuICBsZXQgaW5kZXggPSAwLFxyXG4gICAgaSxcclxuICAgIGNvZGU7XHJcblxyXG4gIC8vIHVwZGF0ZVxyXG4gIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xyXG4gICAgaWYgKHN0YXRlLnJlc2V0KSB7XHJcbiAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XHJcbiAgICAgIGJsb2Nrc1swXSA9IHN0YXRlLmJsb2NrO1xyXG4gICAgICBmb3IgKGkgPSAxOyBpIDwgYmxvY2tDb3VudCArIDE7ICsraSkge1xyXG4gICAgICAgIGJsb2Nrc1tpXSA9IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbWVzc2FnZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgZm9yIChpID0gc3RhdGUuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCBieXRlQ291bnQ7ICsraW5kZXgpIHtcclxuICAgICAgICBibG9ja3NbaSA+PiAyXSB8PSBtZXNzYWdlW2luZGV4XSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChpID0gc3RhdGUuc3RhcnQ7IGluZGV4IDwgbGVuZ3RoICYmIGkgPCBieXRlQ291bnQ7ICsraW5kZXgpIHtcclxuICAgICAgICBjb2RlID0gbWVzc2FnZS5jaGFyQ29kZUF0KGluZGV4KTtcclxuICAgICAgICBpZiAoY29kZSA8IDB4ODApIHtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9IGNvZGUgPDwgU0hJRlRbaSsrICYgM107XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlIDwgMHg4MDApIHtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9ICgweGMwIHwgKGNvZGUgPj4gNikpIDw8IFNISUZUW2krKyAmIDNdO1xyXG4gICAgICAgICAgYmxvY2tzW2kgPj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPCAweGQ4MDAgfHwgY29kZSA+PSAweGUwMDApIHtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9ICgweGUwIHwgKGNvZGUgPj4gMTIpKSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgICAgIGJsb2Nrc1tpID4+IDJdIHw9ICgweDgwIHwgKChjb2RlID4+IDYpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xyXG4gICAgICAgICAgYmxvY2tzW2kgPj4gMl0gfD0gKDB4ODAgfCAoY29kZSAmIDB4M2YpKSA8PCBTSElGVFtpKysgJiAzXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29kZSA9XHJcbiAgICAgICAgICAgIDB4MTAwMDAgK1xyXG4gICAgICAgICAgICAoKChjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChtZXNzYWdlLmNoYXJDb2RlQXQoKytpbmRleCkgJiAweDNmZikpO1xyXG4gICAgICAgICAgYmxvY2tzW2kgPj4gMl0gfD0gKDB4ZjAgfCAoY29kZSA+PiAxOCkpIDw8IFNISUZUW2krKyAmIDNdO1xyXG4gICAgICAgICAgYmxvY2tzW2kgPj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4gMTIpICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xyXG4gICAgICAgICAgYmxvY2tzW2kgPj4gMl0gfD0gKDB4ODAgfCAoKGNvZGUgPj4gNikgJiAweDNmKSkgPDwgU0hJRlRbaSsrICYgM107XHJcbiAgICAgICAgICBibG9ja3NbaSA+PiAyXSB8PSAoMHg4MCB8IChjb2RlICYgMHgzZikpIDw8IFNISUZUW2krKyAmIDNdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGUubGFzdEJ5dGVJbmRleCA9IGk7XHJcbiAgICBpZiAoaSA+PSBieXRlQ291bnQpIHtcclxuICAgICAgc3RhdGUuc3RhcnQgPSBpIC0gYnl0ZUNvdW50O1xyXG4gICAgICBzdGF0ZS5ibG9jayA9IGJsb2Nrc1tibG9ja0NvdW50XTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2NrQ291bnQ7ICsraSkge1xyXG4gICAgICAgIHNbaV0gXj0gYmxvY2tzW2ldO1xyXG4gICAgICB9XHJcbiAgICAgIGYocyk7XHJcbiAgICAgIHN0YXRlLnJlc2V0ID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0YXRlLnN0YXJ0ID0gaTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGZpbmFsaXplXHJcbiAgaSA9IHN0YXRlLmxhc3RCeXRlSW5kZXg7XHJcbiAgYmxvY2tzW2kgPj4gMl0gfD0gS0VDQ0FLX1BBRERJTkdbaSAmIDNdO1xyXG4gIGlmIChzdGF0ZS5sYXN0Qnl0ZUluZGV4ID09PSBieXRlQ291bnQpIHtcclxuICAgIGJsb2Nrc1swXSA9IGJsb2Nrc1tibG9ja0NvdW50XTtcclxuICAgIGZvciAoaSA9IDE7IGkgPCBibG9ja0NvdW50ICsgMTsgKytpKSB7XHJcbiAgICAgIGJsb2Nrc1tpXSA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGJsb2Nrc1tibG9ja0NvdW50IC0gMV0gfD0gMHg4MDAwMDAwMDtcclxuICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tDb3VudDsgKytpKSB7XHJcbiAgICBzW2ldIF49IGJsb2Nrc1tpXTtcclxuICB9XHJcbiAgZihzKTtcclxuXHJcbiAgLy8gdG9TdHJpbmdcclxuICBsZXQgaGV4ID0gJycsXHJcbiAgICBqID0gMCxcclxuICAgIGJsb2NrO1xyXG4gIHdoaWxlIChqIDwgb3V0cHV0QmxvY2tzKSB7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tDb3VudCAmJiBqIDwgb3V0cHV0QmxvY2tzOyArK2ksICsraikge1xyXG4gICAgICBibG9jayA9IHNbaV07XHJcbiAgICAgIGhleCArPVxyXG4gICAgICAgIEhFWF9DSEFSU1soYmxvY2sgPj4gNCkgJiAweDBmXSArXHJcbiAgICAgICAgSEVYX0NIQVJTW2Jsb2NrICYgMHgwZl0gK1xyXG4gICAgICAgIEhFWF9DSEFSU1soYmxvY2sgPj4gMTIpICYgMHgwZl0gK1xyXG4gICAgICAgIEhFWF9DSEFSU1soYmxvY2sgPj4gOCkgJiAweDBmXSArXHJcbiAgICAgICAgSEVYX0NIQVJTWyhibG9jayA+PiAyMCkgJiAweDBmXSArXHJcbiAgICAgICAgSEVYX0NIQVJTWyhibG9jayA+PiAxNikgJiAweDBmXSArXHJcbiAgICAgICAgSEVYX0NIQVJTWyhibG9jayA+PiAyOCkgJiAweDBmXSArXHJcbiAgICAgICAgSEVYX0NIQVJTWyhibG9jayA+PiAyNCkgJiAweDBmXTtcclxuICAgIH1cclxuICAgIGlmIChqICUgYmxvY2tDb3VudCA9PT0gMCkge1xyXG4gICAgICBmKHMpO1xyXG4gICAgICBpID0gMDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuICcweCcgKyBoZXg7XHJcbn07XHJcblxyXG5jb25zdCBmID0gcyA9PiB7XHJcbiAgbGV0IGgsXHJcbiAgICBsLFxyXG4gICAgbixcclxuICAgIGMwLFxyXG4gICAgYzEsXHJcbiAgICBjMixcclxuICAgIGMzLFxyXG4gICAgYzQsXHJcbiAgICBjNSxcclxuICAgIGM2LFxyXG4gICAgYzcsXHJcbiAgICBjOCxcclxuICAgIGM5LFxyXG4gICAgYjAsXHJcbiAgICBiMSxcclxuICAgIGIyLFxyXG4gICAgYjMsXHJcbiAgICBiNCxcclxuICAgIGI1LFxyXG4gICAgYjYsXHJcbiAgICBiNyxcclxuICAgIGI4LFxyXG4gICAgYjksXHJcbiAgICBiMTAsXHJcbiAgICBiMTEsXHJcbiAgICBiMTIsXHJcbiAgICBiMTMsXHJcbiAgICBiMTQsXHJcbiAgICBiMTUsXHJcbiAgICBiMTYsXHJcbiAgICBiMTcsXHJcbiAgICBiMTgsXHJcbiAgICBiMTksXHJcbiAgICBiMjAsXHJcbiAgICBiMjEsXHJcbiAgICBiMjIsXHJcbiAgICBiMjMsXHJcbiAgICBiMjQsXHJcbiAgICBiMjUsXHJcbiAgICBiMjYsXHJcbiAgICBiMjcsXHJcbiAgICBiMjgsXHJcbiAgICBiMjksXHJcbiAgICBiMzAsXHJcbiAgICBiMzEsXHJcbiAgICBiMzIsXHJcbiAgICBiMzMsXHJcbiAgICBiMzQsXHJcbiAgICBiMzUsXHJcbiAgICBiMzYsXHJcbiAgICBiMzcsXHJcbiAgICBiMzgsXHJcbiAgICBiMzksXHJcbiAgICBiNDAsXHJcbiAgICBiNDEsXHJcbiAgICBiNDIsXHJcbiAgICBiNDMsXHJcbiAgICBiNDQsXHJcbiAgICBiNDUsXHJcbiAgICBiNDYsXHJcbiAgICBiNDcsXHJcbiAgICBiNDgsXHJcbiAgICBiNDk7XHJcblxyXG4gIGZvciAobiA9IDA7IG4gPCA0ODsgbiArPSAyKSB7XHJcbiAgICBjMCA9IHNbMF0gXiBzWzEwXSBeIHNbMjBdIF4gc1szMF0gXiBzWzQwXTtcclxuICAgIGMxID0gc1sxXSBeIHNbMTFdIF4gc1syMV0gXiBzWzMxXSBeIHNbNDFdO1xyXG4gICAgYzIgPSBzWzJdIF4gc1sxMl0gXiBzWzIyXSBeIHNbMzJdIF4gc1s0Ml07XHJcbiAgICBjMyA9IHNbM10gXiBzWzEzXSBeIHNbMjNdIF4gc1szM10gXiBzWzQzXTtcclxuICAgIGM0ID0gc1s0XSBeIHNbMTRdIF4gc1syNF0gXiBzWzM0XSBeIHNbNDRdO1xyXG4gICAgYzUgPSBzWzVdIF4gc1sxNV0gXiBzWzI1XSBeIHNbMzVdIF4gc1s0NV07XHJcbiAgICBjNiA9IHNbNl0gXiBzWzE2XSBeIHNbMjZdIF4gc1szNl0gXiBzWzQ2XTtcclxuICAgIGM3ID0gc1s3XSBeIHNbMTddIF4gc1syN10gXiBzWzM3XSBeIHNbNDddO1xyXG4gICAgYzggPSBzWzhdIF4gc1sxOF0gXiBzWzI4XSBeIHNbMzhdIF4gc1s0OF07XHJcbiAgICBjOSA9IHNbOV0gXiBzWzE5XSBeIHNbMjldIF4gc1szOV0gXiBzWzQ5XTtcclxuXHJcbiAgICBoID0gYzggXiAoKGMyIDw8IDEpIHwgKGMzID4+PiAzMSkpO1xyXG4gICAgbCA9IGM5IF4gKChjMyA8PCAxKSB8IChjMiA+Pj4gMzEpKTtcclxuICAgIHNbMF0gXj0gaDtcclxuICAgIHNbMV0gXj0gbDtcclxuICAgIHNbMTBdIF49IGg7XHJcbiAgICBzWzExXSBePSBsO1xyXG4gICAgc1syMF0gXj0gaDtcclxuICAgIHNbMjFdIF49IGw7XHJcbiAgICBzWzMwXSBePSBoO1xyXG4gICAgc1szMV0gXj0gbDtcclxuICAgIHNbNDBdIF49IGg7XHJcbiAgICBzWzQxXSBePSBsO1xyXG4gICAgaCA9IGMwIF4gKChjNCA8PCAxKSB8IChjNSA+Pj4gMzEpKTtcclxuICAgIGwgPSBjMSBeICgoYzUgPDwgMSkgfCAoYzQgPj4+IDMxKSk7XHJcbiAgICBzWzJdIF49IGg7XHJcbiAgICBzWzNdIF49IGw7XHJcbiAgICBzWzEyXSBePSBoO1xyXG4gICAgc1sxM10gXj0gbDtcclxuICAgIHNbMjJdIF49IGg7XHJcbiAgICBzWzIzXSBePSBsO1xyXG4gICAgc1szMl0gXj0gaDtcclxuICAgIHNbMzNdIF49IGw7XHJcbiAgICBzWzQyXSBePSBoO1xyXG4gICAgc1s0M10gXj0gbDtcclxuICAgIGggPSBjMiBeICgoYzYgPDwgMSkgfCAoYzcgPj4+IDMxKSk7XHJcbiAgICBsID0gYzMgXiAoKGM3IDw8IDEpIHwgKGM2ID4+PiAzMSkpO1xyXG4gICAgc1s0XSBePSBoO1xyXG4gICAgc1s1XSBePSBsO1xyXG4gICAgc1sxNF0gXj0gaDtcclxuICAgIHNbMTVdIF49IGw7XHJcbiAgICBzWzI0XSBePSBoO1xyXG4gICAgc1syNV0gXj0gbDtcclxuICAgIHNbMzRdIF49IGg7XHJcbiAgICBzWzM1XSBePSBsO1xyXG4gICAgc1s0NF0gXj0gaDtcclxuICAgIHNbNDVdIF49IGw7XHJcbiAgICBoID0gYzQgXiAoKGM4IDw8IDEpIHwgKGM5ID4+PiAzMSkpO1xyXG4gICAgbCA9IGM1IF4gKChjOSA8PCAxKSB8IChjOCA+Pj4gMzEpKTtcclxuICAgIHNbNl0gXj0gaDtcclxuICAgIHNbN10gXj0gbDtcclxuICAgIHNbMTZdIF49IGg7XHJcbiAgICBzWzE3XSBePSBsO1xyXG4gICAgc1syNl0gXj0gaDtcclxuICAgIHNbMjddIF49IGw7XHJcbiAgICBzWzM2XSBePSBoO1xyXG4gICAgc1szN10gXj0gbDtcclxuICAgIHNbNDZdIF49IGg7XHJcbiAgICBzWzQ3XSBePSBsO1xyXG4gICAgaCA9IGM2IF4gKChjMCA8PCAxKSB8IChjMSA+Pj4gMzEpKTtcclxuICAgIGwgPSBjNyBeICgoYzEgPDwgMSkgfCAoYzAgPj4+IDMxKSk7XHJcbiAgICBzWzhdIF49IGg7XHJcbiAgICBzWzldIF49IGw7XHJcbiAgICBzWzE4XSBePSBoO1xyXG4gICAgc1sxOV0gXj0gbDtcclxuICAgIHNbMjhdIF49IGg7XHJcbiAgICBzWzI5XSBePSBsO1xyXG4gICAgc1szOF0gXj0gaDtcclxuICAgIHNbMzldIF49IGw7XHJcbiAgICBzWzQ4XSBePSBoO1xyXG4gICAgc1s0OV0gXj0gbDtcclxuXHJcbiAgICBiMCA9IHNbMF07XHJcbiAgICBiMSA9IHNbMV07XHJcbiAgICBiMzIgPSAoc1sxMV0gPDwgNCkgfCAoc1sxMF0gPj4+IDI4KTtcclxuICAgIGIzMyA9IChzWzEwXSA8PCA0KSB8IChzWzExXSA+Pj4gMjgpO1xyXG4gICAgYjE0ID0gKHNbMjBdIDw8IDMpIHwgKHNbMjFdID4+PiAyOSk7XHJcbiAgICBiMTUgPSAoc1syMV0gPDwgMykgfCAoc1syMF0gPj4+IDI5KTtcclxuICAgIGI0NiA9IChzWzMxXSA8PCA5KSB8IChzWzMwXSA+Pj4gMjMpO1xyXG4gICAgYjQ3ID0gKHNbMzBdIDw8IDkpIHwgKHNbMzFdID4+PiAyMyk7XHJcbiAgICBiMjggPSAoc1s0MF0gPDwgMTgpIHwgKHNbNDFdID4+PiAxNCk7XHJcbiAgICBiMjkgPSAoc1s0MV0gPDwgMTgpIHwgKHNbNDBdID4+PiAxNCk7XHJcbiAgICBiMjAgPSAoc1syXSA8PCAxKSB8IChzWzNdID4+PiAzMSk7XHJcbiAgICBiMjEgPSAoc1szXSA8PCAxKSB8IChzWzJdID4+PiAzMSk7XHJcbiAgICBiMiA9IChzWzEzXSA8PCAxMikgfCAoc1sxMl0gPj4+IDIwKTtcclxuICAgIGIzID0gKHNbMTJdIDw8IDEyKSB8IChzWzEzXSA+Pj4gMjApO1xyXG4gICAgYjM0ID0gKHNbMjJdIDw8IDEwKSB8IChzWzIzXSA+Pj4gMjIpO1xyXG4gICAgYjM1ID0gKHNbMjNdIDw8IDEwKSB8IChzWzIyXSA+Pj4gMjIpO1xyXG4gICAgYjE2ID0gKHNbMzNdIDw8IDEzKSB8IChzWzMyXSA+Pj4gMTkpO1xyXG4gICAgYjE3ID0gKHNbMzJdIDw8IDEzKSB8IChzWzMzXSA+Pj4gMTkpO1xyXG4gICAgYjQ4ID0gKHNbNDJdIDw8IDIpIHwgKHNbNDNdID4+PiAzMCk7XHJcbiAgICBiNDkgPSAoc1s0M10gPDwgMikgfCAoc1s0Ml0gPj4+IDMwKTtcclxuICAgIGI0MCA9IChzWzVdIDw8IDMwKSB8IChzWzRdID4+PiAyKTtcclxuICAgIGI0MSA9IChzWzRdIDw8IDMwKSB8IChzWzVdID4+PiAyKTtcclxuICAgIGIyMiA9IChzWzE0XSA8PCA2KSB8IChzWzE1XSA+Pj4gMjYpO1xyXG4gICAgYjIzID0gKHNbMTVdIDw8IDYpIHwgKHNbMTRdID4+PiAyNik7XHJcbiAgICBiNCA9IChzWzI1XSA8PCAxMSkgfCAoc1syNF0gPj4+IDIxKTtcclxuICAgIGI1ID0gKHNbMjRdIDw8IDExKSB8IChzWzI1XSA+Pj4gMjEpO1xyXG4gICAgYjM2ID0gKHNbMzRdIDw8IDE1KSB8IChzWzM1XSA+Pj4gMTcpO1xyXG4gICAgYjM3ID0gKHNbMzVdIDw8IDE1KSB8IChzWzM0XSA+Pj4gMTcpO1xyXG4gICAgYjE4ID0gKHNbNDVdIDw8IDI5KSB8IChzWzQ0XSA+Pj4gMyk7XHJcbiAgICBiMTkgPSAoc1s0NF0gPDwgMjkpIHwgKHNbNDVdID4+PiAzKTtcclxuICAgIGIxMCA9IChzWzZdIDw8IDI4KSB8IChzWzddID4+PiA0KTtcclxuICAgIGIxMSA9IChzWzddIDw8IDI4KSB8IChzWzZdID4+PiA0KTtcclxuICAgIGI0MiA9IChzWzE3XSA8PCAyMykgfCAoc1sxNl0gPj4+IDkpO1xyXG4gICAgYjQzID0gKHNbMTZdIDw8IDIzKSB8IChzWzE3XSA+Pj4gOSk7XHJcbiAgICBiMjQgPSAoc1syNl0gPDwgMjUpIHwgKHNbMjddID4+PiA3KTtcclxuICAgIGIyNSA9IChzWzI3XSA8PCAyNSkgfCAoc1syNl0gPj4+IDcpO1xyXG4gICAgYjYgPSAoc1szNl0gPDwgMjEpIHwgKHNbMzddID4+PiAxMSk7XHJcbiAgICBiNyA9IChzWzM3XSA8PCAyMSkgfCAoc1szNl0gPj4+IDExKTtcclxuICAgIGIzOCA9IChzWzQ3XSA8PCAyNCkgfCAoc1s0Nl0gPj4+IDgpO1xyXG4gICAgYjM5ID0gKHNbNDZdIDw8IDI0KSB8IChzWzQ3XSA+Pj4gOCk7XHJcbiAgICBiMzAgPSAoc1s4XSA8PCAyNykgfCAoc1s5XSA+Pj4gNSk7XHJcbiAgICBiMzEgPSAoc1s5XSA8PCAyNykgfCAoc1s4XSA+Pj4gNSk7XHJcbiAgICBiMTIgPSAoc1sxOF0gPDwgMjApIHwgKHNbMTldID4+PiAxMik7XHJcbiAgICBiMTMgPSAoc1sxOV0gPDwgMjApIHwgKHNbMThdID4+PiAxMik7XHJcbiAgICBiNDQgPSAoc1syOV0gPDwgNykgfCAoc1syOF0gPj4+IDI1KTtcclxuICAgIGI0NSA9IChzWzI4XSA8PCA3KSB8IChzWzI5XSA+Pj4gMjUpO1xyXG4gICAgYjI2ID0gKHNbMzhdIDw8IDgpIHwgKHNbMzldID4+PiAyNCk7XHJcbiAgICBiMjcgPSAoc1szOV0gPDwgOCkgfCAoc1szOF0gPj4+IDI0KTtcclxuICAgIGI4ID0gKHNbNDhdIDw8IDE0KSB8IChzWzQ5XSA+Pj4gMTgpO1xyXG4gICAgYjkgPSAoc1s0OV0gPDwgMTQpIHwgKHNbNDhdID4+PiAxOCk7XHJcblxyXG4gICAgc1swXSA9IGIwIF4gKH5iMiAmIGI0KTtcclxuICAgIHNbMV0gPSBiMSBeICh+YjMgJiBiNSk7XHJcbiAgICBzWzEwXSA9IGIxMCBeICh+YjEyICYgYjE0KTtcclxuICAgIHNbMTFdID0gYjExIF4gKH5iMTMgJiBiMTUpO1xyXG4gICAgc1syMF0gPSBiMjAgXiAofmIyMiAmIGIyNCk7XHJcbiAgICBzWzIxXSA9IGIyMSBeICh+YjIzICYgYjI1KTtcclxuICAgIHNbMzBdID0gYjMwIF4gKH5iMzIgJiBiMzQpO1xyXG4gICAgc1szMV0gPSBiMzEgXiAofmIzMyAmIGIzNSk7XHJcbiAgICBzWzQwXSA9IGI0MCBeICh+YjQyICYgYjQ0KTtcclxuICAgIHNbNDFdID0gYjQxIF4gKH5iNDMgJiBiNDUpO1xyXG4gICAgc1syXSA9IGIyIF4gKH5iNCAmIGI2KTtcclxuICAgIHNbM10gPSBiMyBeICh+YjUgJiBiNyk7XHJcbiAgICBzWzEyXSA9IGIxMiBeICh+YjE0ICYgYjE2KTtcclxuICAgIHNbMTNdID0gYjEzIF4gKH5iMTUgJiBiMTcpO1xyXG4gICAgc1syMl0gPSBiMjIgXiAofmIyNCAmIGIyNik7XHJcbiAgICBzWzIzXSA9IGIyMyBeICh+YjI1ICYgYjI3KTtcclxuICAgIHNbMzJdID0gYjMyIF4gKH5iMzQgJiBiMzYpO1xyXG4gICAgc1szM10gPSBiMzMgXiAofmIzNSAmIGIzNyk7XHJcbiAgICBzWzQyXSA9IGI0MiBeICh+YjQ0ICYgYjQ2KTtcclxuICAgIHNbNDNdID0gYjQzIF4gKH5iNDUgJiBiNDcpO1xyXG4gICAgc1s0XSA9IGI0IF4gKH5iNiAmIGI4KTtcclxuICAgIHNbNV0gPSBiNSBeICh+YjcgJiBiOSk7XHJcbiAgICBzWzE0XSA9IGIxNCBeICh+YjE2ICYgYjE4KTtcclxuICAgIHNbMTVdID0gYjE1IF4gKH5iMTcgJiBiMTkpO1xyXG4gICAgc1syNF0gPSBiMjQgXiAofmIyNiAmIGIyOCk7XHJcbiAgICBzWzI1XSA9IGIyNSBeICh+YjI3ICYgYjI5KTtcclxuICAgIHNbMzRdID0gYjM0IF4gKH5iMzYgJiBiMzgpO1xyXG4gICAgc1szNV0gPSBiMzUgXiAofmIzNyAmIGIzOSk7XHJcbiAgICBzWzQ0XSA9IGI0NCBeICh+YjQ2ICYgYjQ4KTtcclxuICAgIHNbNDVdID0gYjQ1IF4gKH5iNDcgJiBiNDkpO1xyXG4gICAgc1s2XSA9IGI2IF4gKH5iOCAmIGIwKTtcclxuICAgIHNbN10gPSBiNyBeICh+YjkgJiBiMSk7XHJcbiAgICBzWzE2XSA9IGIxNiBeICh+YjE4ICYgYjEwKTtcclxuICAgIHNbMTddID0gYjE3IF4gKH5iMTkgJiBiMTEpO1xyXG4gICAgc1syNl0gPSBiMjYgXiAofmIyOCAmIGIyMCk7XHJcbiAgICBzWzI3XSA9IGIyNyBeICh+YjI5ICYgYjIxKTtcclxuICAgIHNbMzZdID0gYjM2IF4gKH5iMzggJiBiMzApO1xyXG4gICAgc1szN10gPSBiMzcgXiAofmIzOSAmIGIzMSk7XHJcbiAgICBzWzQ2XSA9IGI0NiBeICh+YjQ4ICYgYjQwKTtcclxuICAgIHNbNDddID0gYjQ3IF4gKH5iNDkgJiBiNDEpO1xyXG4gICAgc1s4XSA9IGI4IF4gKH5iMCAmIGIyKTtcclxuICAgIHNbOV0gPSBiOSBeICh+YjEgJiBiMyk7XHJcbiAgICBzWzE4XSA9IGIxOCBeICh+YjEwICYgYjEyKTtcclxuICAgIHNbMTldID0gYjE5IF4gKH5iMTEgJiBiMTMpO1xyXG4gICAgc1syOF0gPSBiMjggXiAofmIyMCAmIGIyMik7XHJcbiAgICBzWzI5XSA9IGIyOSBeICh+YjIxICYgYjIzKTtcclxuICAgIHNbMzhdID0gYjM4IF4gKH5iMzAgJiBiMzIpO1xyXG4gICAgc1szOV0gPSBiMzkgXiAofmIzMSAmIGIzMyk7XHJcbiAgICBzWzQ4XSA9IGI0OCBeICh+YjQwICYgYjQyKTtcclxuICAgIHNbNDldID0gYjQ5IF4gKH5iNDEgJiBiNDMpO1xyXG5cclxuICAgIHNbMF0gXj0gUkNbbl07XHJcbiAgICBzWzFdIF49IFJDW24gKyAxXTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBrZWNjYWsgPSAoYml0czogbnVtYmVyKSA9PiB7XHJcbiAgLyoqXHJcbiAgICogSWYgc3RyIGlzIGEgc3RyaW5nIGl0IG11c3QgaGF2ZSAnMHgnXHJcbiAgICovXHJcbiAgcmV0dXJuIChzdHI6IHN0cmluZyB8IEJ1ZmZlcikgPT4ge1xyXG4gICAgbGV0IG1zZztcclxuICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiBzdHIuc2xpY2UoMCwgMikgPT09ICcweCcpIHtcclxuICAgICAgbXNnID0gW107XHJcbiAgICAgIGZvciAobGV0IGkgPSAyLCBsID0gc3RyLmxlbmd0aDsgaSA8IGw7IGkgKz0gMikge1xyXG4gICAgICAgIG1zZy5wdXNoKHBhcnNlSW50KHN0ci5zbGljZShpLCBpICsgMiksIDE2KSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1zZyA9IHN0cjtcclxuICAgIH1cclxuICAgIHJldHVybiB1cGRhdGUoS2VjY2FrKGJpdHMpLCBtc2cpO1xyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qga2VjY2FrMjU2ID0ga2VjY2FrKDI1Nik7XHJcbiIsImltcG9ydCAqIGFzIHV0ZjggZnJvbSAndXRmOCc7XHJcbmltcG9ydCBCTiBmcm9tICdibi5qcyc7XHJcblxyXG5pbXBvcnQgeyBpc0JpZ051bWJlciwgaXNCTiwgdG9CTiB9IGZyb20gJy4vYm4nO1xyXG5pbXBvcnQgeyBrZWNjYWsyNTYgfSBmcm9tICcuL2tlY2NhY2snO1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKipcclxuICogQUREUkVTU1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIHN0cmluZyBpcyBhbiBhZGRyZXNzXHJcbiAqIEBtZXRob2QgaXNBZGRyZXNzXHJcbiAqIEBwYXJhbSBhZGRyZXNzIHRoZSBnaXZlbiBIRVggYWRkcmVzc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQWRkcmVzcyhhZGRyZXNzOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAvLyBjaGVjayBpZiBpdCBoYXMgdGhlIGJhc2ljIHJlcXVpcmVtZW50cyBvZiBhbiBhZGRyZXNzXHJcbiAgaWYgKCEvXigweCk/WzAtOWEtZl17NDB9JC9pLnRlc3QoYWRkcmVzcykpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vIElmIGl0J3MgQUxMIGxvd2VyY2FzZSBvciBBTEwgdXBwcGVyY2FzZVxyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICAvXigweHwwWCk/WzAtOWEtZl17NDB9JC8udGVzdChhZGRyZXNzKSB8fFxyXG4gICAgL14oMHh8MFgpP1swLTlBLUZdezQwfSQvLnRlc3QoYWRkcmVzcylcclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8gT3RoZXJ3aXNlIGNoZWNrIGVhY2ggY2FzZVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gY2hlY2tBZGRyZXNzQ2hlY2tzdW0oYWRkcmVzcyk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBzdHJpbmcgaXMgYSBjaGVja3N1bW1lZCBhZGRyZXNzXHJcbiAqXHJcbiAqIEBtZXRob2QgY2hlY2tBZGRyZXNzQ2hlY2tzdW1cclxuICogQHBhcmFtIGFkZHJlc3MgdGhlIGdpdmVuIEhFWCBhZGRyZXNzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tBZGRyZXNzQ2hlY2tzdW0oYWRkcmVzczogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgLy8gQ2hlY2sgZWFjaCBjYXNlXHJcbiAgYWRkcmVzcyA9IGFkZHJlc3MucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuICBjb25zdCBhZGRyZXNzSGFzaCA9IHNoYTMoYWRkcmVzcy50b0xvd2VyQ2FzZSgpKS5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IDQwOyBpKyspIHtcclxuICAgIC8vIHRoZSBudGggbGV0dGVyIHNob3VsZCBiZSB1cHBlcmNhc2UgaWYgdGhlIG50aCBkaWdpdCBvZiBjYXNlbWFwIGlzIDFcclxuICAgIGlmIChcclxuICAgICAgKHBhcnNlSW50KGFkZHJlc3NIYXNoW2ldLCAxNikgPiA3ICYmXHJcbiAgICAgICAgYWRkcmVzc1tpXS50b1VwcGVyQ2FzZSgpICE9PSBhZGRyZXNzW2ldKSB8fFxyXG4gICAgICAocGFyc2VJbnQoYWRkcmVzc0hhc2hbaV0sIDE2KSA8PSA3ICYmXHJcbiAgICAgICAgYWRkcmVzc1tpXS50b0xvd2VyQ2FzZSgpICE9PSBhZGRyZXNzW2ldKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0byBhIGNoZWNrc3VtIGFkZHJlc3NcclxuICpcclxuICogQG1ldGhvZCB0b0NoZWNrc3VtQWRkcmVzc1xyXG4gKiBAcGFyYW0gYWRkcmVzcyB0aGUgZ2l2ZW4gSEVYIGFkZHJlc3NcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGlmICh0eXBlb2YgYWRkcmVzcyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiAnJztcclxuICB9XHJcblxyXG4gIGlmICghL14oMHgpP1swLTlhLWZdezQwfSQvaS50ZXN0KGFkZHJlc3MpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgIGBHaXZlbiBhZGRyZXNzICR7YWRkcmVzc30gaXMgbm90IGEgdmFsaWQgRXRoZXJldW0gYWRkcmVzcy5gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgYWRkcmVzcyA9IGFkZHJlc3MudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG4gIGNvbnN0IGFkZHJlc3NIYXNoID0gc2hhMyhhZGRyZXNzKS5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG4gIGxldCBjaGVja3N1bUFkZHJlc3MgPSAnMHgnO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHJlc3MubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vIElmIGl0aCBjaGFyYWN0ZXIgaXMgOSB0byBmIHRoZW4gbWFrZSBpdCB1cHBlcmNhc2VcclxuICAgIGlmIChwYXJzZUludChhZGRyZXNzSGFzaFtpXSwgMTYpID4gNykge1xyXG4gICAgICBjaGVja3N1bUFkZHJlc3MgKz0gYWRkcmVzc1tpXS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hlY2tzdW1BZGRyZXNzICs9IGFkZHJlc3NbaV07XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBjaGVja3N1bUFkZHJlc3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIHBhZCBzdHJpbmcgdG8gZXhwZWN0ZWQgbGVuZ3RoXHJcbiAqXHJcbiAqIEBtZXRob2QgbGVmdFBhZFxyXG4gKiBAcGFyYW0gc3RyaW5nIHRvIGJlIHBhZGRlZFxyXG4gKiBAcGFyYW0gY2hhcnMgdGhhdCByZXN1bHQgc3RyaW5nIHNob3VsZCBoYXZlXHJcbiAqIEBwYXJhbSBzaWduLCBieSBkZWZhdWx0IDBcclxuICogQHJldHVybnMgcmlnaHQgYWxpZ25lZCBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsZWZ0UGFkKHN0cmluZzogc3RyaW5nLCBjaGFyczogbnVtYmVyLCBzaWduOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGhhc1ByZWZpeCA9IC9eMHgvaS50ZXN0KHN0cmluZykgfHwgdHlwZW9mIHN0cmluZyA9PT0gJ251bWJlcic7XHJcbiAgc3RyaW5nID0gKHN0cmluZyBhcyBhbnkpLnRvU3RyaW5nKDE2KS5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG5cclxuICBjb25zdCBwYWRkaW5nID1cclxuICAgIGNoYXJzIC0gc3RyaW5nLmxlbmd0aCArIDEgPj0gMCA/IGNoYXJzIC0gc3RyaW5nLmxlbmd0aCArIDEgOiAwO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgKGhhc1ByZWZpeCA/ICcweCcgOiAnJykgK1xyXG4gICAgbmV3IEFycmF5KHBhZGRpbmcpLmpvaW4oc2lnbiA/IHNpZ24gOiAnMCcpICtcclxuICAgIHN0cmluZ1xyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIHBhZCBzdHJpbmcgdG8gZXhwZWN0ZWQgbGVuZ3RoXHJcbiAqXHJcbiAqIEBtZXRob2QgcmlnaHRQYWRcclxuICogQHBhcmFtIHN0cmluZyB0byBiZSBwYWRkZWRcclxuICogQHBhcmFtIGNoYXJzIHRoYXQgcmVzdWx0IHN0cmluZyBzaG91bGQgaGF2ZVxyXG4gKiBAcGFyYW0gc2lnbiwgYnkgZGVmYXVsdCAwXHJcbiAqIEByZXR1cm5zIHJpZ2h0IGFsaWduZWQgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmlnaHRQYWQoc3RyaW5nOiBzdHJpbmcsIGNoYXJzOiBudW1iZXIsIHNpZ246IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgaGFzUHJlZml4ID0gL14weC9pLnRlc3Qoc3RyaW5nKSB8fCB0eXBlb2Ygc3RyaW5nID09PSAnbnVtYmVyJztcclxuICBzdHJpbmcgPSAoc3RyaW5nIGFzIGFueSkudG9TdHJpbmcoMTYpLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcblxyXG4gIGNvbnN0IHBhZGRpbmcgPVxyXG4gICAgY2hhcnMgLSBzdHJpbmcubGVuZ3RoICsgMSA+PSAwID8gY2hhcnMgLSBzdHJpbmcubGVuZ3RoICsgMSA6IDA7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICAoaGFzUHJlZml4ID8gJzB4JyA6ICcnKSArXHJcbiAgICBzdHJpbmcgK1xyXG4gICAgbmV3IEFycmF5KHBhZGRpbmcpLmpvaW4oc2lnbiA/IHNpZ24gOiAnMCcpXHJcbiAgKTtcclxufVxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIFNIQTNcclxuICovXHJcblxyXG5jb25zdCBTSEEzX05VTExfUyA9XHJcbiAgJzB4YzVkMjQ2MDE4NmY3MjMzYzkyN2U3ZGIyZGNjNzAzYzBlNTAwYjY1M2NhODIyNzNiN2JmYWQ4MDQ1ZDg1YTQ3MCc7XHJcblxyXG4vKipcclxuICogSGFzaGVzIHZhbHVlcyB0byBhIHNoYTMgaGFzaCB1c2luZyBrZWNjYWsgMjU2XHJcbiAqIFRvIGhhc2ggYSBIRVggc3RyaW5nIHRoZSBoZXggbXVzdCBoYXZlIDB4IGluIGZyb250LlxyXG4gKiBAbWV0aG9kIHNoYTNcclxuICogQHJldHVybiB0aGUgc2hhMyBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzaGEzKHZhbHVlOiBzdHJpbmcpIHtcclxuICBpZiAoaXNIZXhTdHJpY3QodmFsdWUpICYmIC9eMHgvaS50ZXN0KHZhbHVlLnRvU3RyaW5nKCkpKSB7XHJcbiAgICB2YWx1ZSA9IGhleFRvQnl0ZXModmFsdWUpIGFzIHN0cmluZztcclxuICB9XHJcblxyXG4gIGNvbnN0IHJldHVyblZhbHVlID0ga2VjY2FrMjU2KHZhbHVlKTtcclxuXHJcbiAgaWYgKHJldHVyblZhbHVlID09PSBTSEEzX05VTExfUykge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogSEVYXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IGhleCByZXByZXNlbnRhdGlvbiAocHJlZml4ZWQgYnkgMHgpIG9mIHV0Zjggc3RyaW5nXHJcbiAqXHJcbiAqIEBtZXRob2QgdXRmOFRvSGV4XHJcbiAqIEBwYXJhbSBzdHJcclxuICogQHJldHVybnMgaGV4IHJlcHJlc2VudGF0aW9uIG9mIGlucHV0IHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHV0ZjhUb0hleChzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgc3RyID0gdXRmOC5lbmNvZGUoc3RyKTtcclxuICBsZXQgaGV4ID0gJyc7XHJcblxyXG4gIC8vIHJlbW92ZSBcXHUwMDAwIHBhZGRpbmcgZnJvbSBlaXRoZXIgc2lkZVxyXG4gIHN0ciA9IHN0ci5yZXBsYWNlKC9eKD86XFx1MDAwMCkqLywgJycpO1xyXG4gIHN0ciA9IHN0clxyXG4gICAgLnNwbGl0KCcnKVxyXG4gICAgLnJldmVyc2UoKVxyXG4gICAgLmpvaW4oJycpO1xyXG4gIHN0ciA9IHN0ci5yZXBsYWNlKC9eKD86XFx1MDAwMCkqLywgJycpO1xyXG4gIHN0ciA9IHN0clxyXG4gICAgLnNwbGl0KCcnKVxyXG4gICAgLnJldmVyc2UoKVxyXG4gICAgLmpvaW4oJycpO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgY29kZSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgLy8gaWYgKGNvZGUgIT09IDApIHtcclxuICAgIGNvbnN0IG4gPSBjb2RlLnRvU3RyaW5nKDE2KTtcclxuICAgIGhleCArPSBuLmxlbmd0aCA8IDIgPyAnMCcgKyBuIDogbjtcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIHJldHVybiAnMHgnICsgaGV4O1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBnZXQgdXRmOCBmcm9tIGl0J3MgaGV4IHJlcHJlc2VudGF0aW9uXHJcbiAqIEBtZXRob2QgaGV4VG9VdGY4XHJcbiAqIEBwYXJhbSBoZXhcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1V0ZjgoaGV4OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGlmICghaXNIZXhTdHJpY3QoaGV4KSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgcGFyYW1ldGVyICR7aGV4fSBtdXN0IGJlIGEgdmFsaWQgSEVYIHN0cmluZy5gKTtcclxuICB9XHJcbiAgbGV0IHN0ciA9ICcnO1xyXG4gIGxldCBjb2RlID0gMDtcclxuICBoZXggPSBoZXgucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuXHJcbiAgLy8gcmVtb3ZlIDAwIHBhZGRpbmcgZnJvbSBlaXRoZXIgc2lkZVxyXG4gIGhleCA9IGhleC5yZXBsYWNlKC9eKD86MDApKi8sICcnKTtcclxuICBoZXggPSBoZXhcclxuICAgIC5zcGxpdCgnJylcclxuICAgIC5yZXZlcnNlKClcclxuICAgIC5qb2luKCcnKTtcclxuICBoZXggPSBoZXgucmVwbGFjZSgvXig/OjAwKSovLCAnJyk7XHJcbiAgaGV4ID0gaGV4XHJcbiAgICAuc3BsaXQoJycpXHJcbiAgICAucmV2ZXJzZSgpXHJcbiAgICAuam9pbignJyk7XHJcblxyXG4gIGNvbnN0IGwgPSBoZXgubGVuZ3RoO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkgKz0gMikge1xyXG4gICAgY29kZSA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSwgMiksIDE2KTtcclxuICAgIC8vIGlmIChjb2RlICE9PSAwKSB7XHJcbiAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB1dGY4LmRlY29kZShzdHIpO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdmFsdWUgdG8gaXQncyBudW1iZXIgcmVwcmVzZW50YXRpb25cclxuICogQG1ldGhvZCBoZXhUb051bWJlclxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb051bWJlcih2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgQk4pOiBudW1iZXIge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgQk4odmFsdWUsIDE2KS50b051bWJlcigpO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdmFsdWUgdG8gaXQncyBkZWNpbWFsIHJlcHJlc2VudGF0aW9uIGluIHN0cmluZ1xyXG4gKiBAbWV0aG9kIGhleFRvTnVtYmVyU3RyaW5nXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvTnVtYmVyU3RyaW5nKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBCTik6IHN0cmluZyB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBCTih2YWx1ZSwgMTYpLnRvU3RyaW5nKDEwKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHZhbHVlIHRvIGl0J3MgaGV4IHJlcHJlc2VudGF0aW9uXHJcbiAqIEBtZXRob2QgbnVtYmVyVG9IZXhcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyVG9IZXgodmFsdWU6IFN0cmluZyB8IE51bWJlciB8IEJOKTogc3RyaW5nIHtcclxuICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyB8fCB2YWx1ZSA9PT0gJ251bGwnKSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzRmluaXRlKHZhbHVlKSAmJiAhaXNIZXhTdHJpY3QodmFsdWUpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEdpdmVuIGlucHV0ICR7dmFsdWV9IGlzIG5vdCBhIG51bWJlci5gKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IG51bWJlciA9IHRvQk4odmFsdWUpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IG51bWJlci50b1N0cmluZygxNik7XHJcblxyXG4gIHJldHVybiBudW1iZXIubHQobmV3IEJOKDApKSA/ICctMHgnICsgcmVzdWx0LnN1YnN0cigxKSA6ICcweCcgKyByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIGhleCBzdHJpbmdcclxuICogTm90ZTogSW1wbGVtZW50YXRpb24gZnJvbSBjcnlwdG8tanNcclxuICogQG1ldGhvZCBieXRlc1RvSGV4XHJcbiAqIEBwYXJhbSBieXRlc1xyXG4gKiBAcmV0dXJuIHRoZSBoZXggc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYnl0ZXNUb0hleChieXRlczogbnVtYmVyW10pOiBzdHJpbmcge1xyXG4gIGNvbnN0IGhleCA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIC8qIHRzbGludDpkaXNhYmxlICovXHJcbiAgICBoZXgucHVzaCgoYnl0ZXNbaV0gPj4+IDQpLnRvU3RyaW5nKDE2KSk7XHJcbiAgICBoZXgucHVzaCgoYnl0ZXNbaV0gJiAweGYpLnRvU3RyaW5nKDE2KSk7XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlICAqL1xyXG4gIH1cclxuICByZXR1cm4gJzB4JyArIGhleC5qb2luKCcnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBoZXggc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxyXG4gKiBOb3RlOiBJbXBsZW1lbnRhdGlvbiBmcm9tIGNyeXB0by1qc1xyXG4gKiBAbWV0aG9kIGhleFRvQnl0ZXNcclxuICogQHBhcmFtIGhleFxyXG4gKiBAcmV0dXJuIHRoZSBieXRlIGFycmF5XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9CeXRlcyhoZXg6IHN0cmluZyk6IG51bWJlcltdIHwgc3RyaW5nIHtcclxuICBoZXggPSAoaGV4IGFzIGFueSkudG9TdHJpbmcoMTYpO1xyXG5cclxuICBpZiAoIWlzSGV4U3RyaWN0KGhleCkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgR2l2ZW4gdmFsdWUgJHtoZXh9IGlzIG5vdCBhIHZhbGlkIGhleCBzdHJpbmcuYCk7XHJcbiAgfVxyXG5cclxuICBoZXggPSBoZXgucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuICBjb25zdCBieXRlcyA9IFtdO1xyXG4gIGZvciAobGV0IGMgPSAwOyBjIDwgaGV4Lmxlbmd0aDsgYyArPSAyKSB7XHJcbiAgICBieXRlcy5wdXNoKHBhcnNlSW50KGhleC5zdWJzdHIoYywgMiksIDE2KSk7XHJcbiAgfVxyXG4gIHJldHVybiBieXRlcztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IGFzY2lpIGZyb20gaXQncyBoZXggcmVwcmVzZW50YXRpb25cclxuICpcclxuICogQG1ldGhvZCBoZXhUb0FzY2lpXHJcbiAqIEBwYXJhbSBoZXhcclxuICogQHJldHVybnMgYXNjaWkgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGhleCB2YWx1ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvQXNjaWkoaGV4OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGlmICghaXNIZXhTdHJpY3QoaGV4KSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcGFyYW1ldGVyIG11c3QgYmUgYSB2YWxpZCBIRVggc3RyaW5nLicpO1xyXG4gIH1cclxuXHJcbiAgbGV0IHN0ciA9ICcnO1xyXG4gIGxldCBpID0gMDtcclxuICBjb25zdCBsID0gaGV4Lmxlbmd0aDtcclxuICBpZiAoaGV4LnN1YnN0cmluZygwLCAyKSA9PT0gJzB4Jykge1xyXG4gICAgaSA9IDI7XHJcbiAgfVxyXG4gIGZvciAoOyBpIDwgbDsgaSArPSAyKSB7XHJcbiAgICBjb25zdCBjb2RlID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpLCAyKSwgMTYpO1xyXG4gICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RyO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBnZXQgaGV4IHJlcHJlc2VudGF0aW9uIChwcmVmaXhlZCBieSAweCkgb2YgYXNjaWkgc3RyaW5nXHJcbiAqXHJcbiAqIEBtZXRob2QgYXNjaWlUb0hleFxyXG4gKiBAcGFyYW0gc3RyXHJcbiAqIEByZXR1cm5zIGhleCByZXByZXNlbnRhdGlvbiBvZiBpbnB1dCBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhc2NpaVRvSGV4KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoIXN0cikge1xyXG4gICAgcmV0dXJuICcweDAwJztcclxuICB9XHJcbiAgbGV0IGhleCA9ICcnO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBjb2RlID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICBjb25zdCBuID0gY29kZS50b1N0cmluZygxNik7XHJcbiAgICBoZXggKz0gbi5sZW5ndGggPCAyID8gJzAnICsgbiA6IG47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gJzB4JyArIGhleDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEF1dG8gY29udmVydHMgYW55IGdpdmVuIHZhbHVlIGludG8gaXQncyBoZXggcmVwcmVzZW50YXRpb24uXHJcbiAqXHJcbiAqIEFuZCBldmVuIHN0cmluZ2lmeXMgb2JqZWN0cyBiZWZvcmUuXHJcbiAqXHJcbiAqIEBtZXRob2QgdG9IZXhcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEBwYXJhbSByZXR1cm5UeXBlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdG9IZXgoXHJcbiAgdmFsdWU6IFN0cmluZyB8IE51bWJlciB8IEJOIHwgT2JqZWN0LFxyXG4gIHJldHVyblR5cGU/OiBib29sZWFuXHJcbik6IHN0cmluZyB7XHJcbiAgLypqc2hpbnQgbWF4Y29tcGxleGl0eTogZmFsc2UgKi9cclxuXHJcbiAgaWYgKGlzQWRkcmVzcyh2YWx1ZSkpIHtcclxuICAgIHJldHVybiByZXR1cm5UeXBlXHJcbiAgICAgID8gJ2FkZHJlc3MnXHJcbiAgICAgIDogJzB4JyArIHZhbHVlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xyXG4gICAgcmV0dXJuIHJldHVyblR5cGUgPyAnYm9vbCcgOiB2YWx1ZSA/ICcweDAxJyA6ICcweDAwJztcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFpc0JpZ051bWJlcih2YWx1ZSkgJiYgIWlzQk4odmFsdWUpKSB7XHJcbiAgICByZXR1cm4gcmV0dXJuVHlwZSA/ICdzdHJpbmcnIDogdXRmOFRvSGV4KEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XHJcbiAgfVxyXG5cclxuICAvLyBpZiBpdHMgYSBuZWdhdGl2ZSBudW1iZXIsIHBhc3MgaXQgdGhyb3VnaCBudW1iZXJUb0hleFxyXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBpZiAodmFsdWUuaW5kZXhPZignLTB4JykgPT09IDAgfHwgdmFsdWUuaW5kZXhPZignLTBYJykgPT09IDApIHtcclxuICAgICAgcmV0dXJuIHJldHVyblR5cGUgPyAnaW50MjU2JyA6IG51bWJlclRvSGV4KHZhbHVlKTtcclxuICAgIH0gZWxzZSBpZiAodmFsdWUuaW5kZXhPZignMHgnKSA9PT0gMCB8fCB2YWx1ZS5pbmRleE9mKCcwWCcpID09PSAwKSB7XHJcbiAgICAgIHJldHVybiByZXR1cm5UeXBlID8gJ2J5dGVzJyA6IHZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICghaXNGaW5pdGUodmFsdWUgYXMgYW55KSkge1xyXG4gICAgICByZXR1cm4gcmV0dXJuVHlwZSA/ICdzdHJpbmcnIDogdXRmOFRvSGV4KHZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXR1cm5UeXBlID8gKHZhbHVlIDwgMCA/ICdpbnQyNTYnIDogJ3VpbnQyNTYnKSA6IG51bWJlclRvSGV4KHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHN0cmluZyBpcyBIRVgsIHJlcXVpcmVzIGEgMHggaW4gZnJvbnRcclxuICpcclxuICogQG1ldGhvZCBpc0hleFN0cmljdFxyXG4gKiBAcGFyYW0gaGV4IHRvIGJlIGNoZWNrZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0hleFN0cmljdChoZXg6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICB0eXBlb2YgaGV4ID09PSAnc3RyaW5nJyB8fFxyXG4gICAgKHR5cGVvZiBoZXggPT09ICdudW1iZXInICYmIC9eKC0pPzB4WzAtOWEtZl0qJC9pLnRlc3QoaGV4KSlcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgc3RyaW5nIGlzIEhFWFxyXG4gKlxyXG4gKiBAbWV0aG9kIGlzSGV4XHJcbiAqIEBwYXJhbSBoZXggdG8gYmUgY2hlY2tlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzSGV4KGhleDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR5cGVvZiBoZXggPT09ICdzdHJpbmcnIHx8XHJcbiAgICAodHlwZW9mIGhleCA9PT0gJ251bWJlcicgJiYgL14oLTB4fDB4KT9bMC05YS1mXSokL2kudGVzdChoZXgpKVxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgaGV4VG9OdW1iZXIgfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElCbG9jayB7XHJcbiAgLyoqIHRoZSBibG9jayBudW1iZXIuIG51bGwgd2hlbiBpdHMgcGVuZGluZyBibG9jay4gKi9cclxuICBudW1iZXI6IG51bWJlcjtcclxuICAvKiogaGFzaCBvZiB0aGUgYmxvY2suIG51bGwgd2hlbiBpdHMgcGVuZGluZyBibG9jay4gKi9cclxuICBoYXNoOiBzdHJpbmc7XHJcbiAgLyoqIGhhc2ggb2YgdGhlIHBhcmVudCBibG9jay4gKi9cclxuICBwYXJlbnRIYXNoOiBzdHJpbmc7XHJcbiAgLyoqIGhhc2ggb2YgdGhlIGdlbmVyYXRlZCBwcm9vZi1vZi13b3JrLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcgYmxvY2suICovXHJcbiAgbm9uY2U6IHN0cmluZztcclxuICAvKiogU0hBMyBvZiB0aGUgdW5jbGVzIGRhdGEgaW4gdGhlIGJsb2NrLiAqL1xyXG4gIHNoYTNVbmNsZXM6IHN0cmluZztcclxuICAvKiogdGhlIGJsb29tIGZpbHRlciBmb3IgdGhlIGxvZ3Mgb2YgdGhlIGJsb2NrLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcgYmxvY2suICovXHJcbiAgbG9nc0Jsb29tOiBzdHJpbmc7XHJcbiAgLyoqIHRoZSByb290IG9mIHRoZSB0cmFuc2FjdGlvbiB0cmllIG9mIHRoZSBibG9jay4gKi9cclxuICB0cmFuc2FjdGlvbnNSb290OiBzdHJpbmc7XHJcbiAgLyoqIHRoZSByb290IG9mIHRoZSBmaW5hbCBzdGF0ZSB0cmllIG9mIHRoZSBibG9jay4gKi9cclxuICBzdGF0ZVJvb3Q6IHN0cmluZztcclxuICAvKiogdGhlIHJvb3Qgb2YgdGhlIHJlY2VpcHRzIHRyaWUgb2YgdGhlIGJsb2NrLiAqL1xyXG4gIHJlY2VpcHRzUm9vdDogc3RyaW5nO1xyXG4gIC8qKiB0aGUgYWRkcmVzcyBvZiB0aGUgYmVuZWZpY2lhcnkgdG8gd2hvbSB0aGUgbWluaW5nIHJld2FyZHMgd2VyZSBnaXZlbi4gKi9cclxuICBtaW5lcjogc3RyaW5nO1xyXG4gIC8qKiBpbnRlZ2VyIG9mIHRoZSBkaWZmaWN1bHR5IGZvciB0aGlzIGJsb2NrLiAqL1xyXG4gIGRpZmZpY3VsdHk6IG51bWJlcjtcclxuICAvKiogIGludGVnZXIgb2YgdGhlIHRvdGFsIGRpZmZpY3VsdHkgb2YgdGhlIGNoYWluIHVudGlsIHRoaXMgYmxvY2suICovXHJcbiAgdG90YWxEaWZmaWN1bHR5OiBudW1iZXI7XHJcbiAgLyoqIGludGVnZXIgdGhlIHNpemUgb2YgdGhpcyBibG9jayBpbiBieXRlcy4gKi9cclxuICBzaXplOiBudW1iZXI7XHJcbiAgLyoqIHRoZSBcImV4dHJhIGRhdGFcIiBmaWVsZCBvZiB0aGlzIGJsb2NrLiAqL1xyXG4gIGV4dHJhRGF0YTogc3RyaW5nO1xyXG4gIC8qKiB0aGUgbWF4aW11bSBnYXMgYWxsb3dlZCBpbiB0aGlzIGJsb2NrLiAqL1xyXG4gIGdhc0xpbWl0OiBudW1iZXI7XHJcbiAgLyoqIHRoZSB0b3RhbCB1c2VkIGdhcyBieSBhbGwgdHJhbnNhY3Rpb25zIGluIHRoaXMgYmxvY2suICovXHJcbiAgZ2FzVXNlZDogbnVtYmVyO1xyXG4gIC8qKiB0aGUgdW5peCB0aW1lc3RhbXAgZm9yIHdoZW4gdGhlIGJsb2NrIHdhcyBjb2xsYXRlZC4gKi9cclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICAvKiogQXJyYXkgb2YgdHJhbnNhY3Rpb24gb2JqZWN0cywgb3IgMzIgQnl0ZXMgdHJhbnNhY3Rpb24gaGFzaGVzIGRlcGVuZGluZyBvbiB0aGUgbGFzdCBnaXZlbiBwYXJhbWV0ZXIuICovXHJcbiAgdHJhbnNhY3Rpb25zOiBzdHJpbmdbXTtcclxuICAvKiogQXJyYXkgb2YgdW5jbGUgaGFzaGVzLiAqL1xyXG4gIHVuY2xlczogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBCbG9jayBpbXBsZW1lbnRzIElCbG9jayB7XHJcbiAgbnVtYmVyOiBudW1iZXI7XHJcbiAgaGFzaDogc3RyaW5nO1xyXG4gIHBhcmVudEhhc2g6IHN0cmluZztcclxuICBub25jZTogc3RyaW5nO1xyXG4gIHNoYTNVbmNsZXM6IHN0cmluZztcclxuICBsb2dzQmxvb206IHN0cmluZztcclxuICB0cmFuc2FjdGlvbnNSb290OiBzdHJpbmc7XHJcbiAgc3RhdGVSb290OiBzdHJpbmc7XHJcbiAgcmVjZWlwdHNSb290OiBzdHJpbmc7XHJcbiAgbWluZXI6IHN0cmluZztcclxuICBkaWZmaWN1bHR5OiBudW1iZXI7XHJcbiAgdG90YWxEaWZmaWN1bHR5OiBudW1iZXI7XHJcbiAgc2l6ZTogbnVtYmVyO1xyXG4gIGV4dHJhRGF0YTogc3RyaW5nO1xyXG4gIGdhc0xpbWl0OiBudW1iZXI7XHJcbiAgZ2FzVXNlZDogbnVtYmVyO1xyXG4gIHRpbWVzdGFtcDogbnVtYmVyO1xyXG4gIHRyYW5zYWN0aW9uczogc3RyaW5nW107XHJcbiAgdW5jbGVzOiBzdHJpbmdbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoZXRoQmxvY2spIHtcclxuICAgIHRoaXMubnVtYmVyID0gaGV4VG9OdW1iZXIoZXRoQmxvY2subnVtYmVyKTtcclxuICAgIHRoaXMuaGFzaCA9IGV0aEJsb2NrLmhhc2g7XHJcbiAgICB0aGlzLnBhcmVudEhhc2ggPSBldGhCbG9jay5wYXJlbnRIYXNoO1xyXG4gICAgdGhpcy5ub25jZSA9IGV0aEJsb2NrLm5vbmNlO1xyXG4gICAgdGhpcy5zaGEzVW5jbGVzID0gZXRoQmxvY2suc2hhM1VuY2xlcztcclxuICAgIHRoaXMubG9nc0Jsb29tID0gZXRoQmxvY2subG9nc0Jsb29tO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbnNSb290ID0gZXRoQmxvY2sudHJhbnNhY3Rpb25zUm9vdDtcclxuICAgIHRoaXMuc3RhdGVSb290ID0gZXRoQmxvY2suc3RhdGVSb290O1xyXG4gICAgdGhpcy5yZWNlaXB0c1Jvb3QgPSBldGhCbG9jay5yZWNlaXB0c1Jvb3Q7XHJcbiAgICB0aGlzLm1pbmVyID0gZXRoQmxvY2subWluZXI7XHJcbiAgICB0aGlzLmRpZmZpY3VsdHkgPSBoZXhUb051bWJlcihldGhCbG9jay5kaWZmaWN1bHR5KTtcclxuICAgIHRoaXMudG90YWxEaWZmaWN1bHR5ID0gaGV4VG9OdW1iZXIoZXRoQmxvY2sudG90YWxEaWZmaWN1bHR5KTtcclxuICAgIHRoaXMuc2l6ZSA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLnNpemUpO1xyXG4gICAgdGhpcy5leHRyYURhdGEgPSBldGhCbG9jay5leHRyYURhdGE7XHJcbiAgICB0aGlzLmdhc0xpbWl0ID0gaGV4VG9OdW1iZXIoZXRoQmxvY2suZ2FzTGltaXQpO1xyXG4gICAgdGhpcy5nYXNVc2VkID0gaGV4VG9OdW1iZXIoZXRoQmxvY2suZ2FzVXNlZCk7XHJcbiAgICB0aGlzLnRpbWVzdGFtcCA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLnRpbWVzdGFtcCk7XHJcbiAgICB0aGlzLnRyYW5zYWN0aW9ucyA9IGV0aEJsb2NrLnRyYW5zYWN0aW9ucztcclxuICAgIHRoaXMudW5jbGVzID0gZXRoQmxvY2sudW5jbGVzO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBoZXhUb051bWJlciwgdG9CTiB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zYWN0aW9uIHtcclxuICAvKiogaGFzaCBvZiB0aGUgdHJhbnNhY3Rpb24uICovXHJcbiAgaGFzaDogc3RyaW5nO1xyXG4gIC8qKiBUaGUgbnVtYmVyIG9mIHRyYW5zYWN0aW9ucyBtYWRlIGJ5IHRoZSBzZW5kZXIgcHJpb3IgdG8gdGhpcyBvbmUuICovXHJcbiAgbm9uY2U6IG51bWJlcjtcclxuICAvKiogSGFzaCBvZiB0aGUgYmxvY2sgd2hlcmUgdGhpcyB0cmFuc2FjdGlvbiB3YXMgaW4uIG51bGwgd2hlbiBpdHMgcGVuZGluZy4gKi9cclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICAvKiogQmxvY2sgbnVtYmVyIHdoZXJlIHRoaXMgdHJhbnNhY3Rpb24gd2FzIGluLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcuICovXHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICAvKiogSW50ZWdlciBvZiB0aGUgdHJhbnNhY3Rpb25zIGluZGV4IHBvc2l0aW9uIGluIHRoZSBibG9jay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nLiAqL1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICAvKiogQWRkcmVzcyBvZiB0aGUgc2VuZGVyLiAqL1xyXG4gIGZyb206IHN0cmluZztcclxuICAvKiogQWRkcmVzcyBvZiB0aGUgcmVjZWl2ZXIuIG51bGwgd2hlbiBpdHMgYSBjb250cmFjdCBjcmVhdGlvbiB0cmFuc2FjdGlvbi4gKi9cclxuICB0bzogc3RyaW5nO1xyXG4gIC8qKiBCaWdOdW1iZXI6OnZhbHVlIHRyYW5zZmVycmVkIGluIFdlaSAgKi9cclxuICB2YWx1ZTogc3RyaW5nO1xyXG4gIC8qKiBHYXMgcHJvdmlkZWQgYnkgdGhlIHNlbmRlci4gKi9cclxuICBnYXM6IG51bWJlcjtcclxuICAvKiogR2FzIHByaWNlIHByb3ZpZGVkIGJ5IHRoZSBzZW5kZXIgaW4gV2VpLiAqL1xyXG4gIGdhc1ByaWNlOiBudW1iZXI7XHJcbiAgLyoqIFRoZSBkYXRhIHNlbmQgYWxvbmcgd2l0aCB0aGUgdHJhbnNhY3Rpb24uICovXHJcbiAgaW5wdXQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zYWN0aW9uIGltcGxlbWVudHMgSVRyYW5zYWN0aW9uIHtcclxuICBoYXNoOiBzdHJpbmc7XHJcbiAgbm9uY2U6IG51bWJlcjtcclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICBibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICBmcm9tOiBzdHJpbmc7XHJcbiAgdG86IHN0cmluZztcclxuICB2YWx1ZTogc3RyaW5nO1xyXG4gIGdhczogbnVtYmVyO1xyXG4gIGdhc1ByaWNlOiBudW1iZXI7XHJcbiAgaW5wdXQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZXRoVHgpIHtcclxuICAgIHRoaXMuaGFzaCA9IGV0aFR4Lmhhc2g7XHJcbiAgICB0aGlzLm5vbmNlID0gaGV4VG9OdW1iZXIoZXRoVHgubm9uY2UpO1xyXG4gICAgdGhpcy5ibG9ja0hhc2ggPSBldGhUeC5ibG9ja0hhc2g7XHJcbiAgICB0aGlzLmJsb2NrTnVtYmVyID0gaGV4VG9OdW1iZXIoZXRoVHguYmxvY2tOdW1iZXIpO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbkluZGV4ID0gaGV4VG9OdW1iZXIoZXRoVHgudHJhbnNhY3Rpb25JbmRleCk7XHJcbiAgICB0aGlzLmZyb20gPSBldGhUeC5mcm9tO1xyXG4gICAgdGhpcy50byA9IGV0aFR4LnRvO1xyXG4gICAgdGhpcy52YWx1ZSA9IHRvQk4oZXRoVHgudmFsdWUpLnRvU3RyaW5nKDEwKTtcclxuICAgIHRoaXMuZ2FzID0gaGV4VG9OdW1iZXIoZXRoVHguZ2FzKTtcclxuICAgIHRoaXMuZ2FzUHJpY2UgPSBoZXhUb051bWJlcihldGhUeC5nYXNQcmljZSk7XHJcbiAgICB0aGlzLmlucHV0ID0gZXRoVHguaW5wdXQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGhleFRvTnVtYmVyIH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVHhMb2dzIHtcclxuICAvKiogIGNvbnRhaW5zIG9uZSBvciBtb3JlIDMyIEJ5dGVzIG5vbi1pbmRleGVkIGFyZ3VtZW50cyBvZiB0aGUgbG9nLiAqL1xyXG4gIGRhdGE6IHN0cmluZztcclxuICAvKiogQXJyYXkgb2YgMCB0byA0IDMyLUJ5dGVzIG9mIGluZGV4ZWQgbG9nIGFyZ3VtZW50cy4gKEluIHNvbGlkaXR5OiBUaGUgZmlyc3QgdG9waWMgaXMgdGhlIGhhc2ggb2YgdGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgKi9cclxuICB0b3BpY3M6IHN0cmluZ1tdO1xyXG4gIC8qKiBpbnRlZ2VyIG9mIHRoZSBsb2cgaW5kZXggcG9zaXRpb24gaW4gdGhlIGJsb2NrLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcgbG9nLiAqL1xyXG4gIGxvZ0luZGV4OiBudW1iZXI7XHJcbiAgLyoqIGludGVnZXIgb2YgdGhlIHRyYW5zYWN0aW9ucyBpbmRleCBwb3NpdGlvbiBsb2cgd2FzIGNyZWF0ZWQgZnJvbS4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGxvZy4gKi9cclxuICB0cmFuc2FjdGlvbkluZGV4OiBudW1iZXI7XHJcbiAgLyoqIGhhc2ggb2YgdGhlIHRyYW5zYWN0aW9ucyB0aGlzIGxvZyB3YXMgY3JlYXRlZCBmcm9tLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcgbG9nLiAqL1xyXG4gIHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSBibG9jayB3aGVyZSB0aGlzIGxvZyB3YXMgaW4uIG51bGwgd2hlbiBpdHMgcGVuZGluZy4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGxvZy4gKi9cclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICAvKiogdGhlIGJsb2NrIG51bWJlciB3aGVyZSB0aGlzIGxvZyB3YXMgaW4uIG51bGwgd2hlbiBpdHMgcGVuZGluZy4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGxvZy4gKi9cclxuICBibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIC8qKiBhZGRyZXNzIGZyb20gd2hpY2ggdGhpcyBsb2cgb3JpZ2luYXRlZC4gKi9cclxuICBhZGRyZXNzOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUeExvZ3Mge1xyXG4gIGRhdGE6IHN0cmluZztcclxuICB0b3BpY3M6IHN0cmluZ1tdO1xyXG4gIGxvZ0luZGV4OiBudW1iZXI7XHJcbiAgdHJhbnNhY3Rpb25JbmRleDogbnVtYmVyO1xyXG4gIHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nO1xyXG4gIGJsb2NrSGFzaDogc3RyaW5nO1xyXG4gIGJsb2NrTnVtYmVyOiBudW1iZXI7XHJcbiAgYWRkcmVzczogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihldGhUeExvZ3MpIHtcclxuICAgIHRoaXMuZGF0YSA9IGV0aFR4TG9ncy5kYXRhO1xyXG4gICAgdGhpcy50b3BpY3MgPSBldGhUeExvZ3MudG9waWNzO1xyXG4gICAgdGhpcy5sb2dJbmRleCA9IGhleFRvTnVtYmVyKGV0aFR4TG9ncy5sb2dJbmRleCk7XHJcbiAgICB0aGlzLnRyYW5zYWN0aW9uSW5kZXggPSBoZXhUb051bWJlcihldGhUeExvZ3MudHJhbnNhY3Rpb25JbmRleCk7XHJcbiAgICB0aGlzLnRyYW5zYWN0aW9uSGFzaCA9IGV0aFR4TG9ncy50cmFuc2FjdGlvbkhhc2g7XHJcbiAgICB0aGlzLmJsb2NrSGFzaCA9IGV0aFR4TG9ncy5ibG9ja0hhc2g7XHJcbiAgICB0aGlzLmJsb2NrTnVtYmVyID0gaGV4VG9OdW1iZXIoZXRoVHhMb2dzLmJsb2NrTnVtYmVyKTtcclxuICAgIHRoaXMuYWRkcmVzcyA9IGV0aFR4TG9ncy5hZGRyZXNzO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJVHhMb2dzLCBUeExvZ3MgfSBmcm9tICcuL3R4LWxvZ3MnO1xyXG5pbXBvcnQgeyBoZXhUb051bWJlciB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVR4UmVjZWlwdCB7XHJcbiAgLyoqIDMyIGJ5dGVzIG9mIHBvc3QtdHJhbnNhY3Rpb24gc3RhdGVyb290IChwcmUgQnl6YW50aXVtKSAgKi9cclxuICByb290Pzogc3RyaW5nO1xyXG4gIC8qKiBzdWNjZXNzIG9yIGZhaWx1cmUgKi9cclxuICBzdGF0dXM/OiBib29sZWFuO1xyXG4gIC8qKiAgaGFzaCBvZiB0aGUgdHJhbnNhY3Rpb24gKi9cclxuICB0cmFuc2FjdGlvbkhhc2g6IHN0cmluZztcclxuICAvKiogaW50ZWdlciBvZiB0aGUgdHJhbnNhY3Rpb25zIGluZGV4IHBvc2l0aW9uIGluIHRoZSBibG9jay4gKi9cclxuICB0cmFuc2FjdGlvbkluZGV4OiBudW1iZXI7XHJcbiAgLyoqIGhhc2ggb2YgdGhlIGJsb2NrIHdoZXJlIHRoaXMgdHJhbnNhY3Rpb24gd2FzIGluLiAqL1xyXG4gIGJsb2NrSGFzaDogc3RyaW5nO1xyXG4gIC8qKiBibG9jayBudW1iZXIgd2hlcmUgdGhpcyB0cmFuc2FjdGlvbiB3YXMgaW4uICovXHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICAvKiogVGhlIGNvbnRyYWN0IGFkZHJlc3MgY3JlYXRlZCwgaWYgdGhlIHRyYW5zYWN0aW9uIHdhcyBhIGNvbnRyYWN0IGNyZWF0aW9uLCBvdGhlcndpc2UgbnVsbC4gKi9cclxuICBjb250cmFjdEFkZHJlc3M6IHN0cmluZztcclxuICAvKiogVGhlIHRvdGFsIGFtb3VudCBvZiBnYXMgdXNlZCB3aGVuIHRoaXMgdHJhbnNhY3Rpb24gd2FzIGV4ZWN1dGVkIGluIHRoZSBibG9jay4gKi9cclxuICBjdW11bGF0aXZlR2FzVXNlZDogbnVtYmVyO1xyXG4gIC8qKiBUaGUgYW1vdW50IG9mIGdhcyB1c2VkIGJ5IHRoaXMgc3BlY2lmaWMgdHJhbnNhY3Rpb24gYWxvbmUuICovXHJcbiAgZ2FzVXNlZDogbnVtYmVyO1xyXG4gIC8qKiBBcnJheSBvZiBsb2cgb2JqZWN0cywgd2hpY2ggdGhpcyB0cmFuc2FjdGlvbiBnZW5lcmF0ZWQuICovXHJcbiAgbG9nczogSVR4TG9nc1tdO1xyXG4gIC8qKiAgQmxvb20gZmlsdGVyIGZvciBsaWdodCBjbGllbnRzIHRvIHF1aWNrbHkgcmV0cmlldmUgcmVsYXRlZCBsb2dzLiAqL1xyXG4gIGxvZ3NCbG9vbTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHhSZWNlaXB0IHtcclxuICByb290Pzogc3RyaW5nO1xyXG4gIHN0YXR1cz86IGJvb2xlYW47XHJcbiAgdHJhbnNhY3Rpb25IYXNoOiBzdHJpbmc7XHJcbiAgdHJhbnNhY3Rpb25JbmRleDogbnVtYmVyO1xyXG4gIGJsb2NrSGFzaDogc3RyaW5nO1xyXG4gIGJsb2NrTnVtYmVyOiBudW1iZXI7XHJcbiAgY29udHJhY3RBZGRyZXNzOiBzdHJpbmc7XHJcbiAgY3VtdWxhdGl2ZUdhc1VzZWQ6IG51bWJlcjtcclxuICBnYXNVc2VkOiBudW1iZXI7XHJcbiAgbG9nczogSVR4TG9nc1tdO1xyXG4gIGxvZ3NCbG9vbTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihldGhUeFJlY2VpcHQpIHtcclxuICAgIGlmIChldGhUeFJlY2VpcHQuc3RhdHVzKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gaGV4VG9OdW1iZXIoZXRoVHhSZWNlaXB0LnN0YXR1cykgPT09IDEgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJvb3QgPSBldGhUeFJlY2VpcHQucm9vdDtcclxuICAgIH1cclxuICAgIHRoaXMudHJhbnNhY3Rpb25IYXNoID0gZXRoVHhSZWNlaXB0LnRyYW5zYWN0aW9uSGFzaDtcclxuICAgIHRoaXMudHJhbnNhY3Rpb25JbmRleCA9IGhleFRvTnVtYmVyKGV0aFR4UmVjZWlwdC50cmFuc2FjdGlvbkluZGV4KTtcclxuICAgIHRoaXMuYmxvY2tIYXNoID0gZXRoVHhSZWNlaXB0LmJsb2NrSGFzaDtcclxuICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBoZXhUb051bWJlcihldGhUeFJlY2VpcHQuYmxvY2tOdW1iZXIpO1xyXG4gICAgdGhpcy5jb250cmFjdEFkZHJlc3MgPSBldGhUeFJlY2VpcHQuY29udHJhY3RBZGRyZXNzO1xyXG4gICAgdGhpcy5jdW11bGF0aXZlR2FzVXNlZCA9IGhleFRvTnVtYmVyKGV0aFR4UmVjZWlwdC5jdW11bGF0aXZlR2FzVXNlZCk7XHJcbiAgICB0aGlzLmdhc1VzZWQgPSBoZXhUb051bWJlcihldGhUeFJlY2VpcHQuZ2FzVXNlZCk7XHJcbiAgICB0aGlzLmxvZ3MgPSBldGhUeFJlY2VpcHQubG9ncy5tYXAobG9nID0+IG5ldyBUeExvZ3MobG9nKSk7XHJcbiAgICB0aGlzLmxvZ3NCbG9vbSA9IGV0aFR4UmVjZWlwdC5sb2dzQmxvb207XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEJOIH0gZnJvbSAnYm4uanMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVHhPYmplY3Qge1xyXG4gICAgLyoqIFRoZSBhZGRyZXNzIHRoZSB0cmFuc2FjdGlvbiBpcyBzZW5kIGZyb20uICovXHJcbiAgICBmcm9tOiBzdHJpbmc7XHJcbiAgICAvKiogVGhlIGFkZHJlc3MgdGhlIHRyYW5zYWN0aW9uIGlzIGRpcmVjdGVkIHRvLiAqL1xyXG4gICAgdG86IHN0cmluZztcclxuICAgIC8qKiAoZGVmYXVsdDogOTAwMDApIEludGVnZXIgb2YgdGhlIGdhcyBwcm92aWRlZCBmb3IgdGhlIHRyYW5zYWN0aW9uIGV4ZWN1dGlvbi4gSXQgd2lsbCByZXR1cm4gdW51c2VkIGdhcy4gKi9cclxuICAgIGdhczogbnVtYmVyO1xyXG4gICAgLyoqIEludGVnZXIgb2YgdGhlIGdhc1ByaWNlIHVzZWQgZm9yIGVhY2ggcGFpZCBnYXMgKi9cclxuICAgIGdhc1ByaWNlOiBzdHJpbmc7XHJcbiAgICAvKiogSW50ZWdlciBvZiB0aGUgdmFsdWUgc2VudCB3aXRoIGlmICh0eCB0cmFuc2FjdGlvbiAqL1xyXG4gICAgdmFsdWU6IHN0cmluZztcclxuICAgIC8qKiBUaGUgY29tcGlsZWQgY29kZSBvZiBhIGNvbnRyYWN0IE9SIHRoZSBoYXNoIG9mIHRoZSBpbnZva2VkIG1ldGhvZCBzaWduYXR1cmUgYW5kIGVuY29kZWQgcGFyYW1ldGVycy4gKi9cclxuICAgIGRhdGE6IHN0cmluZztcclxuICAgIC8qKiBJbnRlZ2VyIG9mIGEgbm9uY2UuIFRoaXMgYWxsb3dzIHRvIG92ZXJ3cml0ZSB5b3VyIG93biBwZW5kaW5nIHRyYW5zYWN0aW9ucyB0aGF0IHVzZSB0aGUgc2FtZSBub25jZS4gKi9cclxuICAgIG5vbmNlOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUeE9iamVjdCB7XHJcbiAgLyoqIFRoZSBhZGRyZXNzIHRoZSB0cmFuc2FjdGlvbiBpcyBzZW5kIGZyb20uICovXHJcbiAgcHVibGljIGZyb206IHN0cmluZztcclxuICAvKiogVGhlIGFkZHJlc3MgdGhlIHRyYW5zYWN0aW9uIGlzIGRpcmVjdGVkIHRvLiAqL1xyXG4gIHB1YmxpYyB0bzogc3RyaW5nO1xyXG4gIC8qKiAoZGVmYXVsdDogOTAwMDApIEludGVnZXIgb2YgdGhlIGdhcyBwcm92aWRlZCBmb3IgdGhlIHRyYW5zYWN0aW9uIGV4ZWN1dGlvbi4gSXQgd2lsbCByZXR1cm4gdW51c2VkIGdhcy4gKi9cclxuICBwdWJsaWMgZ2FzOiBzdHJpbmc7XHJcbiAgLyoqIEludGVnZXIgb2YgdGhlIGdhc1ByaWNlIHVzZWQgZm9yIGVhY2ggcGFpZCBnYXMgKi9cclxuICBwdWJsaWMgZ2FzUHJpY2U6IHN0cmluZztcclxuICAvKiogSW50ZWdlciBvZiB0aGUgdmFsdWUgc2VudCB3aXRoIGlmICh0eCB0cmFuc2FjdGlvbiAqL1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIC8qKiBUaGUgY29tcGlsZWQgY29kZSBvZiBhIGNvbnRyYWN0IE9SIHRoZSBoYXNoIG9mIHRoZSBpbnZva2VkIG1ldGhvZCBzaWduYXR1cmUgYW5kIGVuY29kZWQgcGFyYW1ldGVycy4gKi9cclxuICBwdWJsaWMgZGF0YTogc3RyaW5nO1xyXG4gIC8qKiBJbnRlZ2VyIG9mIGEgbm9uY2UuIFRoaXMgYWxsb3dzIHRvIG92ZXJ3cml0ZSB5b3VyIG93biBwZW5kaW5nIHRyYW5zYWN0aW9ucyB0aGF0IHVzZSB0aGUgc2FtZSBub25jZS4gKi9cclxuICBwdWJsaWMgbm9uY2U6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IodHg6IFBhcnRpYWw8SVR4T2JqZWN0Pikge1xyXG4gICAgaWYgKHR4LmZyb20pIHRoaXMuZnJvbSA9IHR4LmZyb207XHJcbiAgICBpZiAodHgudG8pIHRoaXMudG8gPSB0eC50bztcclxuICAgIGlmICh0eC5kYXRhKSB0aGlzLmRhdGEgPSB0eC5kYXRhO1xyXG5cclxuICAgIGlmICh0eC5nYXMpIHRoaXMuZ2FzID0gbmV3IEJOKHR4LmdhcywgMTApLnRvU3RyaW5nKDE2KTtcclxuICAgIGlmICh0eC5nYXNQcmljZSkgdGhpcy5nYXNQcmljZSA9IG5ldyBCTih0eC5nYXNQcmljZSwgMTApLnRvU3RyaW5nKDE2KTtcclxuICAgIGlmICh0eC52YWx1ZSkgdGhpcy52YWx1ZSA9IG5ldyBCTih0eC52YWx1ZSwgMTApLnRvU3RyaW5nKDE2KTtcclxuICAgIGlmICh0eC5ub25jZSkgdGhpcy5ub25jZSA9IG5ldyBCTih0eC5ub25jZSwgMTApLnRvU3RyaW5nKDE2KTtcclxuXHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJ1dGY4LmVuY29kZSIsInV0ZjguZGVjb2RlIiwiQk4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFz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QUcsQ0FBQyxDQUFDLENBQUM7b0JBQzFELE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUM1RDtxQkFBTTtvQkFDTCxJQUFJO3dCQUNGLE9BQU87NkJBQ04sQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLEtBQUssRUFBRSxLQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNuRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzFELE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbkUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNsRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFL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QztDQUNuQixDQUFDO0FBRUYscUJBQU0sQ0FBQyxHQUFHLFVBQUEsQ0FBQztJQUNULHFCQUFJLENBQUM7SUFDSCxDQUFDO0lBQ0QsQ0FBQztJQUNELEVBQUU7SUFDRixFQUFFO0lBQ0YsRUFBRTtJQUNGLEVBQUU7SUFDRixFQUFFO0lBQ0YsRUFBRTtJQUNGLEVBQUU7SUFDRixFQUFFO0lBQ0YsRUFBRTtJQUNGLEVBQUU7SUFDRixFQUFFO0lBQ0YsRUFBRTtJQUNGLEVBQUU7SUFDRixFQUFFO0lBQ0YsRUFBRTtJQUNGLEVBQUU7SUFDRixFQUFFO0lBQ0YsRUFBRTtJQUNGLEVBQUU7SUFDRixFQUFFO0lBQ0YsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRyxDQUFDO0lBRU4sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMxQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUxQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDVixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVYLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1YsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbEMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFcEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRTNCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNuQjtDQUNGLENBQUM7QUFFRixxQkFBTSxNQUFNLEdBQUcsVUFBQyxJQUFZOzs7O0lBSTFCLE9BQU8sVUFBQyxHQUFvQjtRQUMxQixxQkFBSSxHQUFHLENBQUM7UUFDUixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENB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