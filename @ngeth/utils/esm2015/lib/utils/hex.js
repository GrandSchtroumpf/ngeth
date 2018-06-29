/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as utf8 from 'utf8';
import BN from 'bn.js';
import { isBigNumber, isBN, toBN } from './bn';
import { keccak256 } from './keccack';
/**
 * Checks if the given string is an address
 * \@method isAddress
 * @param {?} address the given HEX address
 * @return {?}
 */
export function isAddress(address) {
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
export function checkAddressChecksum(address) {
    // Check each case
    address = address.replace(/^0x/i, '');
    const /** @type {?} */ addressHash = sha3(address.toLowerCase()).replace(/^0x/i, '');
    for (let /** @type {?} */ i = 0; i < 40; i++) {
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
export function toChecksumAddress(address) {
    if (typeof address === 'undefined') {
        return '';
    }
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        throw new Error(`Given address ${address} is not a valid Ethereum address.`);
    }
    address = address.toLowerCase().replace(/^0x/i, '');
    const /** @type {?} */ addressHash = sha3(address).replace(/^0x/i, '');
    let /** @type {?} */ checksumAddress = '0x';
    for (let /** @type {?} */ i = 0; i < address.length; i++) {
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
export function leftPad(string, chars, sign) {
    const /** @type {?} */ hasPrefix = /^0x/i.test(string) || typeof string === 'number';
    string = (/** @type {?} */ (string)).toString(16).replace(/^0x/i, '');
    const /** @type {?} */ padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
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
export function rightPad(string, chars, sign) {
    const /** @type {?} */ hasPrefix = /^0x/i.test(string) || typeof string === 'number';
    string = (/** @type {?} */ (string)).toString(16).replace(/^0x/i, '');
    const /** @type {?} */ padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
    return ((hasPrefix ? '0x' : '') +
        string +
        new Array(padding).join(sign ? sign : '0'));
}
/**
 * *****************************
 * SHA3
 */
const /** @type {?} */ SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
/**
 * Hashes values to a sha3 hash using keccak 256
 * To hash a HEX string the hex must have 0x in front.
 * \@method sha3
 * @param {?} value
 * @return {?} the sha3 string
 */
export function sha3(value) {
    if (isHexStrict(value) && /^0x/i.test(value.toString())) {
        value = /** @type {?} */ (hexToBytes(value));
    }
    const /** @type {?} */ returnValue = keccak256(value);
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
export function utf8ToHex(str) {
    str = utf8.encode(str);
    let /** @type {?} */ hex = '';
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
    for (let /** @type {?} */ i = 0; i < str.length; i++) {
        const /** @type {?} */ code = str.charCodeAt(i);
        // if (code !== 0) {
        const /** @type {?} */ n = code.toString(16);
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
export function hexToUtf8(hex) {
    if (!isHexStrict(hex)) {
        throw new Error(`The parameter ${hex} must be a valid HEX string.`);
    }
    let /** @type {?} */ str = '';
    let /** @type {?} */ code = 0;
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
    const /** @type {?} */ l = hex.length;
    for (let /** @type {?} */ i = 0; i < l; i += 2) {
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
export function hexToNumber(value) {
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
export function hexToNumberString(value) {
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
export function numberToHex(value) {
    if (typeof value === 'undefined' || value === 'null') {
        return value;
    }
    if (!isFinite(value) && !isHexStrict(value)) {
        throw new Error(`Given input ${value} is not a number.`);
    }
    const /** @type {?} */ number = toBN(value);
    const /** @type {?} */ result = number.toString(16);
    return number.lt(new BN(0)) ? '-0x' + result.substr(1) : '0x' + result;
}
/**
 * Convert a byte array to a hex string
 * Note: Implementation from crypto-js
 * \@method bytesToHex
 * @param {?} bytes
 * @return {?} the hex string
 */
export function bytesToHex(bytes) {
    const /** @type {?} */ hex = [];
    for (let /** @type {?} */ i = 0; i < bytes.length; i++) {
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
export function hexToBytes(hex) {
    hex = (/** @type {?} */ (hex)).toString(16);
    if (!isHexStrict(hex)) {
        throw new Error(`Given value ${hex} is not a valid hex string.`);
    }
    hex = hex.replace(/^0x/i, '');
    const /** @type {?} */ bytes = [];
    for (let /** @type {?} */ c = 0; c < hex.length; c += 2) {
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
export function hexToAscii(hex) {
    if (!isHexStrict(hex)) {
        throw new Error('The parameter must be a valid HEX string.');
    }
    let /** @type {?} */ str = '';
    let /** @type {?} */ i = 0;
    const /** @type {?} */ l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i += 2) {
        const /** @type {?} */ code = parseInt(hex.substr(i, 2), 16);
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
export function asciiToHex(str) {
    if (!str) {
        return '0x00';
    }
    let /** @type {?} */ hex = '';
    for (let /** @type {?} */ i = 0; i < str.length; i++) {
        const /** @type {?} */ code = str.charCodeAt(i);
        const /** @type {?} */ n = code.toString(16);
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
export function toHex(value, returnType) {
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
export function isHexStrict(hex) {
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
export function isHex(hex) {
    return (typeof hex === 'string' ||
        (typeof hex === 'number' && /^(-0x|0x)?[0-9a-f]*$/i.test(hex)));
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3V0aWxzLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2hleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBRXZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7Ozs7O0FBV3RDLE1BQU0sb0JBQW9CLE9BQWU7O0lBRXZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDOztLQUVkO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNSLHdCQUF3QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FDdkMsQ0FBQyxDQUFDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDOztLQUViO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDdEM7Q0FDRjs7Ozs7Ozs7QUFRRCxNQUFNLCtCQUErQixPQUFlOztJQUVsRCxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEMsdUJBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXBFLEdBQUcsQ0FBQyxDQUFDLHFCQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxD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TUFBTSxDQUFDLENBQ0wsT0FBTyxHQUFHLEtBQUssUUFBUTtRQUN2QixDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDL0QsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdXRmOCBmcm9tICd1dGY4JztcclxuaW1wb3J0IEJOIGZyb20gJ2JuLmpzJztcclxuXHJcbmltcG9ydCB7IGlzQmlnTnVtYmVyLCBpc0JOLCB0b0JOIH0gZnJvbSAnLi9ibic7XHJcbmltcG9ydCB7IGtlY2NhazI1NiB9IGZyb20gJy4va2VjY2Fjayc7XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKlxyXG4gKiBBRERSRVNTXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gc3RyaW5nIGlzIGFuIGFkZHJlc3NcclxuICogQG1ldGhvZCBpc0FkZHJlc3NcclxuICogQHBhcmFtIGFkZHJlc3MgdGhlIGdpdmVuIEhFWCBhZGRyZXNzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNBZGRyZXNzKGFkZHJlc3M6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIC8vIGNoZWNrIGlmIGl0IGhhcyB0aGUgYmFzaWMgcmVxdWlyZW1lbnRzIG9mIGFuIGFkZHJlc3NcclxuICBpZiAoIS9eKDB4KT9bMC05YS1mXXs0MH0kL2kudGVzdChhZGRyZXNzKSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gSWYgaXQncyBBTEwgbG93ZXJjYXNlIG9yIEFMTCB1cHBwZXJjYXNlXHJcbiAgfSBlbHNlIGlmIChcclxuICAgIC9eKDB4fDBYKT9bMC05YS1mXXs0MH0kLy50ZXN0KGFkZHJlc3MpIHx8XHJcbiAgICAvXigweHwwWCk/WzAtOUEtRl17NDB9JC8udGVzdChhZGRyZXNzKVxyXG4gICkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLyBPdGhlcndpc2UgY2hlY2sgZWFjaCBjYXNlXHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBjaGVja0FkZHJlc3NDaGVja3N1bShhZGRyZXNzKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIHN0cmluZyBpcyBhIGNoZWNrc3VtbWVkIGFkZHJlc3NcclxuICpcclxuICogQG1ldGhvZCBjaGVja0FkZHJlc3NDaGVja3N1bVxyXG4gKiBAcGFyYW0gYWRkcmVzcyB0aGUgZ2l2ZW4gSEVYIGFkZHJlc3NcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0FkZHJlc3NDaGVja3N1bShhZGRyZXNzOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAvLyBDaGVjayBlYWNoIGNhc2VcclxuICBhZGRyZXNzID0gYWRkcmVzcy5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG4gIGNvbnN0IGFkZHJlc3NIYXNoID0gc2hhMyhhZGRyZXNzLnRvTG93ZXJDYXNlKCkpLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNDA7IGkrKykge1xyXG4gICAgLy8gdGhlIG50aCBsZXR0ZXIgc2hvdWxkIGJlIHVwcGVyY2FzZSBpZiB0aGUgbnRoIGRpZ2l0IG9mIGNhc2VtYXAgaXMgMVxyXG4gICAgaWYgKFxyXG4gICAgICAocGFyc2VJbnQoYWRkcmVzc0hhc2hbaV0sIDE2KSA+IDcgJiZcclxuICAgICAgICBhZGRyZXNzW2ldLnRvVXBwZXJDYXNlKCkgIT09IGFkZHJlc3NbaV0pIHx8XHJcbiAgICAgIChwYXJzZUludChhZGRyZXNzSGFzaFtpXSwgMTYpIDw9IDcgJiZcclxuICAgICAgICBhZGRyZXNzW2ldLnRvTG93ZXJDYXNlKCkgIT09IGFkZHJlc3NbaV0pXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRvIGEgY2hlY2tzdW0gYWRkcmVzc1xyXG4gKlxyXG4gKiBAbWV0aG9kIHRvQ2hlY2tzdW1BZGRyZXNzXHJcbiAqIEBwYXJhbSBhZGRyZXNzIHRoZSBnaXZlbiBIRVggYWRkcmVzc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2hlY2tzdW1BZGRyZXNzKGFkZHJlc3M6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKHR5cGVvZiBhZGRyZXNzID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuXHJcbiAgaWYgKCEvXigweCk/WzAtOWEtZl17NDB9JC9pLnRlc3QoYWRkcmVzcykpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgYEdpdmVuIGFkZHJlc3MgJHthZGRyZXNzfSBpcyBub3QgYSB2YWxpZCBFdGhlcmV1bSBhZGRyZXNzLmBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBhZGRyZXNzID0gYWRkcmVzcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcbiAgY29uc3QgYWRkcmVzc0hhc2ggPSBzaGEzKGFkZHJlc3MpLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcbiAgbGV0IGNoZWNrc3VtQWRkcmVzcyA9ICcweCc7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkcmVzcy5sZW5ndGg7IGkrKykge1xyXG4gICAgLy8gSWYgaXRoIGNoYXJhY3RlciBpcyA5IHRvIGYgdGhlbiBtYWtlIGl0IHVwcGVyY2FzZVxyXG4gICAgaWYgKHBhcnNlSW50KGFkZHJlc3NIYXNoW2ldLCAxNikgPiA3KSB7XHJcbiAgICAgIGNoZWNrc3VtQWRkcmVzcyArPSBhZGRyZXNzW2ldLnRvVXBwZXJDYXNlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGVja3N1bUFkZHJlc3MgKz0gYWRkcmVzc1tpXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGNoZWNrc3VtQWRkcmVzcztcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gcGFkIHN0cmluZyB0byBleHBlY3RlZCBsZW5ndGhcclxuICpcclxuICogQG1ldGhvZCBsZWZ0UGFkXHJcbiAqIEBwYXJhbSBzdHJpbmcgdG8gYmUgcGFkZGVkXHJcbiAqIEBwYXJhbSBjaGFycyB0aGF0IHJlc3VsdCBzdHJpbmcgc2hvdWxkIGhhdmVcclxuICogQHBhcmFtIHNpZ24sIGJ5IGRlZmF1bHQgMFxyXG4gKiBAcmV0dXJucyByaWdodCBhbGlnbmVkIHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxlZnRQYWQoc3RyaW5nOiBzdHJpbmcsIGNoYXJzOiBudW1iZXIsIHNpZ246IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgaGFzUHJlZml4ID0gL14weC9pLnRlc3Qoc3RyaW5nKSB8fCB0eXBlb2Ygc3RyaW5nID09PSAnbnVtYmVyJztcclxuICBzdHJpbmcgPSAoc3RyaW5nIGFzIGFueSkudG9TdHJpbmcoMTYpLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcblxyXG4gIGNvbnN0IHBhZGRpbmcgPVxyXG4gICAgY2hhcnMgLSBzdHJpbmcubGVuZ3RoICsgMSA+PSAwID8gY2hhcnMgLSBzdHJpbmcubGVuZ3RoICsgMSA6IDA7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICAoaGFzUHJlZml4ID8gJzB4JyA6ICcnKSArXHJcbiAgICBuZXcgQXJyYXkocGFkZGluZykuam9pbihzaWduID8gc2lnbiA6ICcwJykgK1xyXG4gICAgc3RyaW5nXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gcGFkIHN0cmluZyB0byBleHBlY3RlZCBsZW5ndGhcclxuICpcclxuICogQG1ldGhvZCByaWdodFBhZFxyXG4gKiBAcGFyYW0gc3RyaW5nIHRvIGJlIHBhZGRlZFxyXG4gKiBAcGFyYW0gY2hhcnMgdGhhdCByZXN1bHQgc3RyaW5nIHNob3VsZCBoYXZlXHJcbiAqIEBwYXJhbSBzaWduLCBieSBkZWZhdWx0IDBcclxuICogQHJldHVybnMgcmlnaHQgYWxpZ25lZCBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByaWdodFBhZChzdHJpbmc6IHN0cmluZywgY2hhcnM6IG51bWJlciwgc2lnbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBoYXNQcmVmaXggPSAvXjB4L2kudGVzdChzdHJpbmcpIHx8IHR5cGVvZiBzdHJpbmcgPT09ICdudW1iZXInO1xyXG4gIHN0cmluZyA9IChzdHJpbmcgYXMgYW55KS50b1N0cmluZygxNikucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuXHJcbiAgY29uc3QgcGFkZGluZyA9XHJcbiAgICBjaGFycyAtIHN0cmluZy5sZW5ndGggKyAxID49IDAgPyBjaGFycyAtIHN0cmluZy5sZW5ndGggKyAxIDogMDtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIChoYXNQcmVmaXggPyAnMHgnIDogJycpICtcclxuICAgIHN0cmluZyArXHJcbiAgICBuZXcgQXJyYXkocGFkZGluZykuam9pbihzaWduID8gc2lnbiA6ICcwJylcclxuICApO1xyXG59XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICogU0hBM1xyXG4gKi9cclxuXHJcbmNvbnN0IFNIQTNfTlVMTF9TID1cclxuICAnMHhjNWQyNDYwMTg2ZjcyMzNjOTI3ZTdkYjJkY2M3MDNjMGU1MDBiNjUzY2E4MjI3M2I3YmZhZDgwNDVkODVhNDcwJztcclxuXHJcbi8qKlxyXG4gKiBIYXNoZXMgdmFsdWVzIHRvIGEgc2hhMyBoYXNoIHVzaW5nIGtlY2NhayAyNTZcclxuICogVG8gaGFzaCBhIEhFWCBzdHJpbmcgdGhlIGhleCBtdXN0IGhhdmUgMHggaW4gZnJvbnQuXHJcbiAqIEBtZXRob2Qgc2hhM1xyXG4gKiBAcmV0dXJuIHRoZSBzaGEzIHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNoYTModmFsdWU6IHN0cmluZykge1xyXG4gIGlmIChpc0hleFN0cmljdCh2YWx1ZSkgJiYgL14weC9pLnRlc3QodmFsdWUudG9TdHJpbmcoKSkpIHtcclxuICAgIHZhbHVlID0gaGV4VG9CeXRlcyh2YWx1ZSkgYXMgc3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcmV0dXJuVmFsdWUgPSBrZWNjYWsyNTYodmFsdWUpO1xyXG5cclxuICBpZiAocmV0dXJuVmFsdWUgPT09IFNIQTNfTlVMTF9TKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBIRVhcclxuICovXHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBnZXQgaGV4IHJlcHJlc2VudGF0aW9uIChwcmVmaXhlZCBieSAweCkgb2YgdXRmOCBzdHJpbmdcclxuICpcclxuICogQG1ldGhvZCB1dGY4VG9IZXhcclxuICogQHBhcmFtIHN0clxyXG4gKiBAcmV0dXJucyBoZXggcmVwcmVzZW50YXRpb24gb2YgaW5wdXQgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdXRmOFRvSGV4KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICBzdHIgPSB1dGY4LmVuY29kZShzdHIpO1xyXG4gIGxldCBoZXggPSAnJztcclxuXHJcbiAgLy8gcmVtb3ZlIFxcdTAwMDAgcGFkZGluZyBmcm9tIGVpdGhlciBzaWRlXHJcbiAgc3RyID0gc3RyLnJlcGxhY2UoL14oPzpcXHUwMDAwKSovLCAnJyk7XHJcbiAgc3RyID0gc3RyXHJcbiAgICAuc3BsaXQoJycpXHJcbiAgICAucmV2ZXJzZSgpXHJcbiAgICAuam9pbignJyk7XHJcbiAgc3RyID0gc3RyLnJlcGxhY2UoL14oPzpcXHUwMDAwKSovLCAnJyk7XHJcbiAgc3RyID0gc3RyXHJcbiAgICAuc3BsaXQoJycpXHJcbiAgICAucmV2ZXJzZSgpXHJcbiAgICAuam9pbignJyk7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBjb2RlID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAvLyBpZiAoY29kZSAhPT0gMCkge1xyXG4gICAgY29uc3QgbiA9IGNvZGUudG9TdHJpbmcoMTYpO1xyXG4gICAgaGV4ICs9IG4ubGVuZ3RoIDwgMiA/ICcwJyArIG4gOiBuO1xyXG4gICAgLy8gfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICcweCcgKyBoZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCB1dGY4IGZyb20gaXQncyBoZXggcmVwcmVzZW50YXRpb25cclxuICogQG1ldGhvZCBoZXhUb1V0ZjhcclxuICogQHBhcmFtIGhleFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvVXRmOChoZXg6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKCFpc0hleFN0cmljdChoZXgpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBwYXJhbWV0ZXIgJHtoZXh9IG11c3QgYmUgYSB2YWxpZCBIRVggc3RyaW5nLmApO1xyXG4gIH1cclxuICBsZXQgc3RyID0gJyc7XHJcbiAgbGV0IGNvZGUgPSAwO1xyXG4gIGhleCA9IGhleC5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG5cclxuICAvLyByZW1vdmUgMDAgcGFkZGluZyBmcm9tIGVpdGhlciBzaWRlXHJcbiAgaGV4ID0gaGV4LnJlcGxhY2UoL14oPzowMCkqLywgJycpO1xyXG4gIGhleCA9IGhleFxyXG4gICAgLnNwbGl0KCcnKVxyXG4gICAgLnJldmVyc2UoKVxyXG4gICAgLmpvaW4oJycpO1xyXG4gIGhleCA9IGhleC5yZXBsYWNlKC9eKD86MDApKi8sICcnKTtcclxuICBoZXggPSBoZXhcclxuICAgIC5zcGxpdCgnJylcclxuICAgIC5yZXZlcnNlKClcclxuICAgIC5qb2luKCcnKTtcclxuXHJcbiAgY29uc3QgbCA9IGhleC5sZW5ndGg7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSArPSAyKSB7XHJcbiAgICBjb2RlID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpLCAyKSwgMTYpO1xyXG4gICAgLy8gaWYgKGNvZGUgIT09IDApIHtcclxuICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xyXG4gICAgLy8gfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHV0ZjguZGVjb2RlKHN0cik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB2YWx1ZSB0byBpdCdzIG51bWJlciByZXByZXNlbnRhdGlvblxyXG4gKiBAbWV0aG9kIGhleFRvTnVtYmVyXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvTnVtYmVyKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBCTik6IG51bWJlciB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBCTih2YWx1ZSwgMTYpLnRvTnVtYmVyKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB2YWx1ZSB0byBpdCdzIGRlY2ltYWwgcmVwcmVzZW50YXRpb24gaW4gc3RyaW5nXHJcbiAqIEBtZXRob2QgaGV4VG9OdW1iZXJTdHJpbmdcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9OdW1iZXJTdHJpbmcodmFsdWU6IHN0cmluZyB8IG51bWJlciB8IEJOKTogc3RyaW5nIHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IEJOKHZhbHVlLCAxNikudG9TdHJpbmcoMTApO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdmFsdWUgdG8gaXQncyBoZXggcmVwcmVzZW50YXRpb25cclxuICogQG1ldGhvZCBudW1iZXJUb0hleFxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJUb0hleCh2YWx1ZTogU3RyaW5nIHwgTnVtYmVyIHwgQk4pOiBzdHJpbmcge1xyXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHZhbHVlID09PSAnbnVsbCcpIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGlmICghaXNGaW5pdGUodmFsdWUpICYmICFpc0hleFN0cmljdCh2YWx1ZSkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgR2l2ZW4gaW5wdXQgJHt2YWx1ZX0gaXMgbm90IGEgbnVtYmVyLmApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgbnVtYmVyID0gdG9CTih2YWx1ZSk7XHJcbiAgY29uc3QgcmVzdWx0ID0gbnVtYmVyLnRvU3RyaW5nKDE2KTtcclxuXHJcbiAgcmV0dXJuIG51bWJlci5sdChuZXcgQk4oMCkpID8gJy0weCcgKyByZXN1bHQuc3Vic3RyKDEpIDogJzB4JyArIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgaGV4IHN0cmluZ1xyXG4gKiBOb3RlOiBJbXBsZW1lbnRhdGlvbiBmcm9tIGNyeXB0by1qc1xyXG4gKiBAbWV0aG9kIGJ5dGVzVG9IZXhcclxuICogQHBhcmFtIGJ5dGVzXHJcbiAqIEByZXR1cm4gdGhlIGhleCBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBieXRlc1RvSGV4KGJ5dGVzOiBudW1iZXJbXSk6IHN0cmluZyB7XHJcbiAgY29uc3QgaGV4ID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgLyogdHNsaW50OmRpc2FibGUgKi9cclxuICAgIGhleC5wdXNoKChieXRlc1tpXSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcclxuICAgIGhleC5wdXNoKChieXRlc1tpXSAmIDB4ZikudG9TdHJpbmcoMTYpKTtcclxuICAgIC8qIHRzbGludDplbmFibGUgICovXHJcbiAgfVxyXG4gIHJldHVybiAnMHgnICsgaGV4LmpvaW4oJycpO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIGhleCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XHJcbiAqIE5vdGU6IEltcGxlbWVudGF0aW9uIGZyb20gY3J5cHRvLWpzXHJcbiAqIEBtZXRob2QgaGV4VG9CeXRlc1xyXG4gKiBAcGFyYW0gaGV4XHJcbiAqIEByZXR1cm4gdGhlIGJ5dGUgYXJyYXlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb0J5dGVzKGhleDogc3RyaW5nKTogbnVtYmVyW10gfCBzdHJpbmcge1xyXG4gIGhleCA9IChoZXggYXMgYW55KS50b1N0cmluZygxNik7XHJcblxyXG4gIGlmICghaXNIZXhTdHJpY3QoaGV4KSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBHaXZlbiB2YWx1ZSAke2hleH0gaXMgbm90IGEgdmFsaWQgaGV4IHN0cmluZy5gKTtcclxuICB9XHJcblxyXG4gIGhleCA9IGhleC5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG4gIGNvbnN0IGJ5dGVzID0gW107XHJcbiAgZm9yIChsZXQgYyA9IDA7IGMgPCBoZXgubGVuZ3RoOyBjICs9IDIpIHtcclxuICAgIGJ5dGVzLnB1c2gocGFyc2VJbnQoaGV4LnN1YnN0cihjLCAyKSwgMTYpKTtcclxuICB9XHJcbiAgcmV0dXJuIGJ5dGVzO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBnZXQgYXNjaWkgZnJvbSBpdCdzIGhleCByZXByZXNlbnRhdGlvblxyXG4gKlxyXG4gKiBAbWV0aG9kIGhleFRvQXNjaWlcclxuICogQHBhcmFtIGhleFxyXG4gKiBAcmV0dXJucyBhc2NpaSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgaGV4IHZhbHVlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9Bc2NpaShoZXg6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKCFpc0hleFN0cmljdChoZXgpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwYXJhbWV0ZXIgbXVzdCBiZSBhIHZhbGlkIEhFWCBzdHJpbmcuJyk7XHJcbiAgfVxyXG5cclxuICBsZXQgc3RyID0gJyc7XHJcbiAgbGV0IGkgPSAwO1xyXG4gIGNvbnN0IGwgPSBoZXgubGVuZ3RoO1xyXG4gIGlmIChoZXguc3Vic3RyaW5nKDAsIDIpID09PSAnMHgnKSB7XHJcbiAgICBpID0gMjtcclxuICB9XHJcbiAgZm9yICg7IGkgPCBsOyBpICs9IDIpIHtcclxuICAgIGNvbnN0IGNvZGUgPSBwYXJzZUludChoZXguc3Vic3RyKGksIDIpLCAxNik7XHJcbiAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCBoZXggcmVwcmVzZW50YXRpb24gKHByZWZpeGVkIGJ5IDB4KSBvZiBhc2NpaSBzdHJpbmdcclxuICpcclxuICogQG1ldGhvZCBhc2NpaVRvSGV4XHJcbiAqIEBwYXJhbSBzdHJcclxuICogQHJldHVybnMgaGV4IHJlcHJlc2VudGF0aW9uIG9mIGlucHV0IHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFzY2lpVG9IZXgoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGlmICghc3RyKSB7XHJcbiAgICByZXR1cm4gJzB4MDAnO1xyXG4gIH1cclxuICBsZXQgaGV4ID0gJyc7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGNvZGUgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgIGNvbnN0IG4gPSBjb2RlLnRvU3RyaW5nKDE2KTtcclxuICAgIGhleCArPSBuLmxlbmd0aCA8IDIgPyAnMCcgKyBuIDogbjtcclxuICB9XHJcblxyXG4gIHJldHVybiAnMHgnICsgaGV4O1xyXG59XHJcblxyXG4vKipcclxuICogQXV0byBjb252ZXJ0cyBhbnkgZ2l2ZW4gdmFsdWUgaW50byBpdCdzIGhleCByZXByZXNlbnRhdGlvbi5cclxuICpcclxuICogQW5kIGV2ZW4gc3RyaW5naWZ5cyBvYmplY3RzIGJlZm9yZS5cclxuICpcclxuICogQG1ldGhvZCB0b0hleFxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHBhcmFtIHJldHVyblR5cGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0hleChcclxuICB2YWx1ZTogU3RyaW5nIHwgTnVtYmVyIHwgQk4gfCBPYmplY3QsXHJcbiAgcmV0dXJuVHlwZT86IGJvb2xlYW5cclxuKTogc3RyaW5nIHtcclxuICAvKmpzaGludCBtYXhjb21wbGV4aXR5OiBmYWxzZSAqL1xyXG5cclxuICBpZiAoaXNBZGRyZXNzKHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHJldHVyblR5cGVcclxuICAgICAgPyAnYWRkcmVzcydcclxuICAgICAgOiAnMHgnICsgdmFsdWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICByZXR1cm4gcmV0dXJuVHlwZSA/ICdib29sJyA6IHZhbHVlID8gJzB4MDEnIDogJzB4MDAnO1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIWlzQmlnTnVtYmVyKHZhbHVlKSAmJiAhaXNCTih2YWx1ZSkpIHtcclxuICAgIHJldHVybiByZXR1cm5UeXBlID8gJ3N0cmluZycgOiB1dGY4VG9IZXgoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICB9XHJcblxyXG4gIC8vIGlmIGl0cyBhIG5lZ2F0aXZlIG51bWJlciwgcGFzcyBpdCB0aHJvdWdoIG51bWJlclRvSGV4XHJcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIGlmICh2YWx1ZS5pbmRleE9mKCctMHgnKSA9PT0gMCB8fCB2YWx1ZS5pbmRleE9mKCctMFgnKSA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gcmV0dXJuVHlwZSA/ICdpbnQyNTYnIDogbnVtYmVyVG9IZXgodmFsdWUpO1xyXG4gICAgfSBlbHNlIGlmICh2YWx1ZS5pbmRleE9mKCcweCcpID09PSAwIHx8IHZhbHVlLmluZGV4T2YoJzBYJykgPT09IDApIHtcclxuICAgICAgcmV0dXJuIHJldHVyblR5cGUgPyAnYnl0ZXMnIDogdmFsdWU7XHJcbiAgICB9IGVsc2UgaWYgKCFpc0Zpbml0ZSh2YWx1ZSBhcyBhbnkpKSB7XHJcbiAgICAgIHJldHVybiByZXR1cm5UeXBlID8gJ3N0cmluZycgOiB1dGY4VG9IZXgodmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJldHVyblR5cGUgPyAodmFsdWUgPCAwID8gJ2ludDI1NicgOiAndWludDI1NicpIDogbnVtYmVyVG9IZXgodmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgc3RyaW5nIGlzIEhFWCwgcmVxdWlyZXMgYSAweCBpbiBmcm9udFxyXG4gKlxyXG4gKiBAbWV0aG9kIGlzSGV4U3RyaWN0XHJcbiAqIEBwYXJhbSBoZXggdG8gYmUgY2hlY2tlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzSGV4U3RyaWN0KGhleDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR5cGVvZiBoZXggPT09ICdzdHJpbmcnIHx8XHJcbiAgICAodHlwZW9mIGhleCA9PT0gJ251bWJlcicgJiYgL14oLSk/MHhbMC05YS1mXSokL2kudGVzdChoZXgpKVxyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBzdHJpbmcgaXMgSEVYXHJcbiAqXHJcbiAqIEBtZXRob2QgaXNIZXhcclxuICogQHBhcmFtIGhleCB0byBiZSBjaGVja2VkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNIZXgoaGV4OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHlwZW9mIGhleCA9PT0gJ3N0cmluZycgfHxcclxuICAgICh0eXBlb2YgaGV4ID09PSAnbnVtYmVyJyAmJiAvXigtMHh8MHgpP1swLTlhLWZdKiQvaS50ZXN0KGhleCkpXHJcbiAgKTtcclxufVxyXG4iXX0=