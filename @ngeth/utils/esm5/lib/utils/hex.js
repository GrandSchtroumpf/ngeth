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
export function toChecksumAddress(address) {
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
export function leftPad(string, chars, sign) {
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
export function rightPad(string, chars, sign) {
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
export function sha3(value) {
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
export function utf8ToHex(str) {
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
export function hexToUtf8(hex) {
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
export function bytesToHex(bytes) {
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
export function hexToBytes(hex) {
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
export function hexToAscii(hex) {
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
export function asciiToHex(str) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3V0aWxzLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2hleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBRXZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7Ozs7O0FBV3RDLE1BQU0sb0JBQW9CLE9BQWU7O0lBRXZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDOztLQUVkO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNSLHdCQUF3QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FDdkMsQ0FBQyxDQUFDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDOztLQUViO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDdEM7Q0FDRjs7Ozs7Ozs7QUFRRCxNQUFNLCtCQUErQixPQUFlOztJQUVsRCxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEMscUJBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXBFLEdBQUcsQ0FBQyxDQUFDLHFCQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxD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QixNQUFNLENBQUMsQ0FDTCxPQUFPLEdBQUcsS0FBSyxRQUFRO1FBQ3ZCLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLHVCQUF1QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUMvRCxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1dGY4IGZyb20gJ3V0ZjgnO1xyXG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnO1xyXG5cclxuaW1wb3J0IHsgaXNCaWdOdW1iZXIsIGlzQk4sIHRvQk4gfSBmcm9tICcuL2JuJztcclxuaW1wb3J0IHsga2VjY2FrMjU2IH0gZnJvbSAnLi9rZWNjYWNrJztcclxuXHJcbi8qKioqKioqKioqKioqKioqKioqXHJcbiAqIEFERFJFU1NcclxuICovXHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBzdHJpbmcgaXMgYW4gYWRkcmVzc1xyXG4gKiBAbWV0aG9kIGlzQWRkcmVzc1xyXG4gKiBAcGFyYW0gYWRkcmVzcyB0aGUgZ2l2ZW4gSEVYIGFkZHJlc3NcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FkZHJlc3MoYWRkcmVzczogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgLy8gY2hlY2sgaWYgaXQgaGFzIHRoZSBiYXNpYyByZXF1aXJlbWVudHMgb2YgYW4gYWRkcmVzc1xyXG4gIGlmICghL14oMHgpP1swLTlhLWZdezQwfSQvaS50ZXN0KGFkZHJlc3MpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyBJZiBpdCdzIEFMTCBsb3dlcmNhc2Ugb3IgQUxMIHVwcHBlcmNhc2VcclxuICB9IGVsc2UgaWYgKFxyXG4gICAgL14oMHh8MFgpP1swLTlhLWZdezQwfSQvLnRlc3QoYWRkcmVzcykgfHxcclxuICAgIC9eKDB4fDBYKT9bMC05QS1GXXs0MH0kLy50ZXN0KGFkZHJlc3MpXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICAgIC8vIE90aGVyd2lzZSBjaGVjayBlYWNoIGNhc2VcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGNoZWNrQWRkcmVzc0NoZWNrc3VtKGFkZHJlc3MpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gc3RyaW5nIGlzIGEgY2hlY2tzdW1tZWQgYWRkcmVzc1xyXG4gKlxyXG4gKiBAbWV0aG9kIGNoZWNrQWRkcmVzc0NoZWNrc3VtXHJcbiAqIEBwYXJhbSBhZGRyZXNzIHRoZSBnaXZlbiBIRVggYWRkcmVzc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQWRkcmVzc0NoZWNrc3VtKGFkZHJlc3M6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIC8vIENoZWNrIGVhY2ggY2FzZVxyXG4gIGFkZHJlc3MgPSBhZGRyZXNzLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcbiAgY29uc3QgYWRkcmVzc0hhc2ggPSBzaGEzKGFkZHJlc3MudG9Mb3dlckNhc2UoKSkucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA0MDsgaSsrKSB7XHJcbiAgICAvLyB0aGUgbnRoIGxldHRlciBzaG91bGQgYmUgdXBwZXJjYXNlIGlmIHRoZSBudGggZGlnaXQgb2YgY2FzZW1hcCBpcyAxXHJcbiAgICBpZiAoXHJcbiAgICAgIChwYXJzZUludChhZGRyZXNzSGFzaFtpXSwgMTYpID4gNyAmJlxyXG4gICAgICAgIGFkZHJlc3NbaV0udG9VcHBlckNhc2UoKSAhPT0gYWRkcmVzc1tpXSkgfHxcclxuICAgICAgKHBhcnNlSW50KGFkZHJlc3NIYXNoW2ldLCAxNikgPD0gNyAmJlxyXG4gICAgICAgIGFkZHJlc3NbaV0udG9Mb3dlckNhc2UoKSAhPT0gYWRkcmVzc1tpXSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdG8gYSBjaGVja3N1bSBhZGRyZXNzXHJcbiAqXHJcbiAqIEBtZXRob2QgdG9DaGVja3N1bUFkZHJlc3NcclxuICogQHBhcmFtIGFkZHJlc3MgdGhlIGdpdmVuIEhFWCBhZGRyZXNzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdG9DaGVja3N1bUFkZHJlc3MoYWRkcmVzczogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAodHlwZW9mIGFkZHJlc3MgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG5cclxuICBpZiAoIS9eKDB4KT9bMC05YS1mXXs0MH0kL2kudGVzdChhZGRyZXNzKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICBgR2l2ZW4gYWRkcmVzcyAke2FkZHJlc3N9IGlzIG5vdCBhIHZhbGlkIEV0aGVyZXVtIGFkZHJlc3MuYFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGFkZHJlc3MgPSBhZGRyZXNzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuICBjb25zdCBhZGRyZXNzSGFzaCA9IHNoYTMoYWRkcmVzcykucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuICBsZXQgY2hlY2tzdW1BZGRyZXNzID0gJzB4JztcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRyZXNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyBJZiBpdGggY2hhcmFjdGVyIGlzIDkgdG8gZiB0aGVuIG1ha2UgaXQgdXBwZXJjYXNlXHJcbiAgICBpZiAocGFyc2VJbnQoYWRkcmVzc0hhc2hbaV0sIDE2KSA+IDcpIHtcclxuICAgICAgY2hlY2tzdW1BZGRyZXNzICs9IGFkZHJlc3NbaV0udG9VcHBlckNhc2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoZWNrc3VtQWRkcmVzcyArPSBhZGRyZXNzW2ldO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gY2hlY2tzdW1BZGRyZXNzO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBwYWQgc3RyaW5nIHRvIGV4cGVjdGVkIGxlbmd0aFxyXG4gKlxyXG4gKiBAbWV0aG9kIGxlZnRQYWRcclxuICogQHBhcmFtIHN0cmluZyB0byBiZSBwYWRkZWRcclxuICogQHBhcmFtIGNoYXJzIHRoYXQgcmVzdWx0IHN0cmluZyBzaG91bGQgaGF2ZVxyXG4gKiBAcGFyYW0gc2lnbiwgYnkgZGVmYXVsdCAwXHJcbiAqIEByZXR1cm5zIHJpZ2h0IGFsaWduZWQgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbGVmdFBhZChzdHJpbmc6IHN0cmluZywgY2hhcnM6IG51bWJlciwgc2lnbjogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBoYXNQcmVmaXggPSAvXjB4L2kudGVzdChzdHJpbmcpIHx8IHR5cGVvZiBzdHJpbmcgPT09ICdudW1iZXInO1xyXG4gIHN0cmluZyA9IChzdHJpbmcgYXMgYW55KS50b1N0cmluZygxNikucmVwbGFjZSgvXjB4L2ksICcnKTtcclxuXHJcbiAgY29uc3QgcGFkZGluZyA9XHJcbiAgICBjaGFycyAtIHN0cmluZy5sZW5ndGggKyAxID49IDAgPyBjaGFycyAtIHN0cmluZy5sZW5ndGggKyAxIDogMDtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIChoYXNQcmVmaXggPyAnMHgnIDogJycpICtcclxuICAgIG5ldyBBcnJheShwYWRkaW5nKS5qb2luKHNpZ24gPyBzaWduIDogJzAnKSArXHJcbiAgICBzdHJpbmdcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIGJlIGNhbGxlZCB0byBwYWQgc3RyaW5nIHRvIGV4cGVjdGVkIGxlbmd0aFxyXG4gKlxyXG4gKiBAbWV0aG9kIHJpZ2h0UGFkXHJcbiAqIEBwYXJhbSBzdHJpbmcgdG8gYmUgcGFkZGVkXHJcbiAqIEBwYXJhbSBjaGFycyB0aGF0IHJlc3VsdCBzdHJpbmcgc2hvdWxkIGhhdmVcclxuICogQHBhcmFtIHNpZ24sIGJ5IGRlZmF1bHQgMFxyXG4gKiBAcmV0dXJucyByaWdodCBhbGlnbmVkIHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJpZ2h0UGFkKHN0cmluZzogc3RyaW5nLCBjaGFyczogbnVtYmVyLCBzaWduOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGhhc1ByZWZpeCA9IC9eMHgvaS50ZXN0KHN0cmluZykgfHwgdHlwZW9mIHN0cmluZyA9PT0gJ251bWJlcic7XHJcbiAgc3RyaW5nID0gKHN0cmluZyBhcyBhbnkpLnRvU3RyaW5nKDE2KS5yZXBsYWNlKC9eMHgvaSwgJycpO1xyXG5cclxuICBjb25zdCBwYWRkaW5nID1cclxuICAgIGNoYXJzIC0gc3RyaW5nLmxlbmd0aCArIDEgPj0gMCA/IGNoYXJzIC0gc3RyaW5nLmxlbmd0aCArIDEgOiAwO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgKGhhc1ByZWZpeCA/ICcweCcgOiAnJykgK1xyXG4gICAgc3RyaW5nICtcclxuICAgIG5ldyBBcnJheShwYWRkaW5nKS5qb2luKHNpZ24gPyBzaWduIDogJzAnKVxyXG4gICk7XHJcbn1cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gKiBTSEEzXHJcbiAqL1xyXG5cclxuY29uc3QgU0hBM19OVUxMX1MgPVxyXG4gICcweGM1ZDI0NjAxODZmNzIzM2M5MjdlN2RiMmRjYzcwM2MwZTUwMGI2NTNjYTgyMjczYjdiZmFkODA0NWQ4NWE0NzAnO1xyXG5cclxuLyoqXHJcbiAqIEhhc2hlcyB2YWx1ZXMgdG8gYSBzaGEzIGhhc2ggdXNpbmcga2VjY2FrIDI1NlxyXG4gKiBUbyBoYXNoIGEgSEVYIHN0cmluZyB0aGUgaGV4IG11c3QgaGF2ZSAweCBpbiBmcm9udC5cclxuICogQG1ldGhvZCBzaGEzXHJcbiAqIEByZXR1cm4gdGhlIHNoYTMgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2hhMyh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgaWYgKGlzSGV4U3RyaWN0KHZhbHVlKSAmJiAvXjB4L2kudGVzdCh2YWx1ZS50b1N0cmluZygpKSkge1xyXG4gICAgdmFsdWUgPSBoZXhUb0J5dGVzKHZhbHVlKSBhcyBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICBjb25zdCByZXR1cm5WYWx1ZSA9IGtlY2NhazI1Nih2YWx1ZSk7XHJcblxyXG4gIGlmIChyZXR1cm5WYWx1ZSA9PT0gU0hBM19OVUxMX1MpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAqIEhFWFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCBoZXggcmVwcmVzZW50YXRpb24gKHByZWZpeGVkIGJ5IDB4KSBvZiB1dGY4IHN0cmluZ1xyXG4gKlxyXG4gKiBAbWV0aG9kIHV0ZjhUb0hleFxyXG4gKiBAcGFyYW0gc3RyXHJcbiAqIEByZXR1cm5zIGhleCByZXByZXNlbnRhdGlvbiBvZiBpbnB1dCBzdHJpbmdcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB1dGY4VG9IZXgoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHN0ciA9IHV0ZjguZW5jb2RlKHN0cik7XHJcbiAgbGV0IGhleCA9ICcnO1xyXG5cclxuICAvLyByZW1vdmUgXFx1MDAwMCBwYWRkaW5nIGZyb20gZWl0aGVyIHNpZGVcclxuICBzdHIgPSBzdHIucmVwbGFjZSgvXig/OlxcdTAwMDApKi8sICcnKTtcclxuICBzdHIgPSBzdHJcclxuICAgIC5zcGxpdCgnJylcclxuICAgIC5yZXZlcnNlKClcclxuICAgIC5qb2luKCcnKTtcclxuICBzdHIgPSBzdHIucmVwbGFjZSgvXig/OlxcdTAwMDApKi8sICcnKTtcclxuICBzdHIgPSBzdHJcclxuICAgIC5zcGxpdCgnJylcclxuICAgIC5yZXZlcnNlKClcclxuICAgIC5qb2luKCcnKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGNvZGUgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgIC8vIGlmIChjb2RlICE9PSAwKSB7XHJcbiAgICBjb25zdCBuID0gY29kZS50b1N0cmluZygxNik7XHJcbiAgICBoZXggKz0gbi5sZW5ndGggPCAyID8gJzAnICsgbiA6IG47XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gJzB4JyArIGhleDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IHV0ZjggZnJvbSBpdCdzIGhleCByZXByZXNlbnRhdGlvblxyXG4gKiBAbWV0aG9kIGhleFRvVXRmOFxyXG4gKiBAcGFyYW0gaGV4XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9VdGY4KGhleDogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoIWlzSGV4U3RyaWN0KGhleCkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHBhcmFtZXRlciAke2hleH0gbXVzdCBiZSBhIHZhbGlkIEhFWCBzdHJpbmcuYCk7XHJcbiAgfVxyXG4gIGxldCBzdHIgPSAnJztcclxuICBsZXQgY29kZSA9IDA7XHJcbiAgaGV4ID0gaGV4LnJlcGxhY2UoL14weC9pLCAnJyk7XHJcblxyXG4gIC8vIHJlbW92ZSAwMCBwYWRkaW5nIGZyb20gZWl0aGVyIHNpZGVcclxuICBoZXggPSBoZXgucmVwbGFjZSgvXig/OjAwKSovLCAnJyk7XHJcbiAgaGV4ID0gaGV4XHJcbiAgICAuc3BsaXQoJycpXHJcbiAgICAucmV2ZXJzZSgpXHJcbiAgICAuam9pbignJyk7XHJcbiAgaGV4ID0gaGV4LnJlcGxhY2UoL14oPzowMCkqLywgJycpO1xyXG4gIGhleCA9IGhleFxyXG4gICAgLnNwbGl0KCcnKVxyXG4gICAgLnJldmVyc2UoKVxyXG4gICAgLmpvaW4oJycpO1xyXG5cclxuICBjb25zdCBsID0gaGV4Lmxlbmd0aDtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpICs9IDIpIHtcclxuICAgIGNvZGUgPSBwYXJzZUludChoZXguc3Vic3RyKGksIDIpLCAxNik7XHJcbiAgICAvLyBpZiAoY29kZSAhPT0gMCkge1xyXG4gICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXRmOC5kZWNvZGUoc3RyKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHZhbHVlIHRvIGl0J3MgbnVtYmVyIHJlcHJlc2VudGF0aW9uXHJcbiAqIEBtZXRob2QgaGV4VG9OdW1iZXJcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9OdW1iZXIodmFsdWU6IHN0cmluZyB8IG51bWJlciB8IEJOKTogbnVtYmVyIHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IEJOKHZhbHVlLCAxNikudG9OdW1iZXIoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHZhbHVlIHRvIGl0J3MgZGVjaW1hbCByZXByZXNlbnRhdGlvbiBpbiBzdHJpbmdcclxuICogQG1ldGhvZCBoZXhUb051bWJlclN0cmluZ1xyXG4gKiBAcGFyYW0gdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb051bWJlclN0cmluZyh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgQk4pOiBzdHJpbmcge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgQk4odmFsdWUsIDE2KS50b1N0cmluZygxMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB2YWx1ZSB0byBpdCdzIGhleCByZXByZXNlbnRhdGlvblxyXG4gKiBAbWV0aG9kIG51bWJlclRvSGV4XHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlclRvSGV4KHZhbHVlOiBTdHJpbmcgfCBOdW1iZXIgfCBCTik6IHN0cmluZyB7XHJcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdmFsdWUgPT09ICdudWxsJykge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFpc0Zpbml0ZSh2YWx1ZSkgJiYgIWlzSGV4U3RyaWN0KHZhbHVlKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBHaXZlbiBpbnB1dCAke3ZhbHVlfSBpcyBub3QgYSBudW1iZXIuYCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBudW1iZXIgPSB0b0JOKHZhbHVlKTtcclxuICBjb25zdCByZXN1bHQgPSBudW1iZXIudG9TdHJpbmcoMTYpO1xyXG5cclxuICByZXR1cm4gbnVtYmVyLmx0KG5ldyBCTigwKSkgPyAnLTB4JyArIHJlc3VsdC5zdWJzdHIoMSkgOiAnMHgnICsgcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBoZXggc3RyaW5nXHJcbiAqIE5vdGU6IEltcGxlbWVudGF0aW9uIGZyb20gY3J5cHRvLWpzXHJcbiAqIEBtZXRob2QgYnl0ZXNUb0hleFxyXG4gKiBAcGFyYW0gYnl0ZXNcclxuICogQHJldHVybiB0aGUgaGV4IHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGJ5dGVzVG9IZXgoYnl0ZXM6IG51bWJlcltdKTogc3RyaW5nIHtcclxuICBjb25zdCBoZXggPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG4gICAgaGV4LnB1c2goKGJ5dGVzW2ldID4+PiA0KS50b1N0cmluZygxNikpO1xyXG4gICAgaGV4LnB1c2goKGJ5dGVzW2ldICYgMHhmKS50b1N0cmluZygxNikpO1xyXG4gICAgLyogdHNsaW50OmVuYWJsZSAgKi9cclxuICB9XHJcbiAgcmV0dXJuICcweCcgKyBoZXguam9pbignJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgaGV4IHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcclxuICogTm90ZTogSW1wbGVtZW50YXRpb24gZnJvbSBjcnlwdG8tanNcclxuICogQG1ldGhvZCBoZXhUb0J5dGVzXHJcbiAqIEBwYXJhbSBoZXhcclxuICogQHJldHVybiB0aGUgYnl0ZSBhcnJheVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvQnl0ZXMoaGV4OiBzdHJpbmcpOiBudW1iZXJbXSB8IHN0cmluZyB7XHJcbiAgaGV4ID0gKGhleCBhcyBhbnkpLnRvU3RyaW5nKDE2KTtcclxuXHJcbiAgaWYgKCFpc0hleFN0cmljdChoZXgpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEdpdmVuIHZhbHVlICR7aGV4fSBpcyBub3QgYSB2YWxpZCBoZXggc3RyaW5nLmApO1xyXG4gIH1cclxuXHJcbiAgaGV4ID0gaGV4LnJlcGxhY2UoL14weC9pLCAnJyk7XHJcbiAgY29uc3QgYnl0ZXMgPSBbXTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGhleC5sZW5ndGg7IGMgKz0gMikge1xyXG4gICAgYnl0ZXMucHVzaChwYXJzZUludChoZXguc3Vic3RyKGMsIDIpLCAxNikpO1xyXG4gIH1cclxuICByZXR1cm4gYnl0ZXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgYmUgY2FsbGVkIHRvIGdldCBhc2NpaSBmcm9tIGl0J3MgaGV4IHJlcHJlc2VudGF0aW9uXHJcbiAqXHJcbiAqIEBtZXRob2QgaGV4VG9Bc2NpaVxyXG4gKiBAcGFyYW0gaGV4XHJcbiAqIEByZXR1cm5zIGFzY2lpIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBoZXggdmFsdWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb0FzY2lpKGhleDogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoIWlzSGV4U3RyaWN0KGhleCkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHBhcmFtZXRlciBtdXN0IGJlIGEgdmFsaWQgSEVYIHN0cmluZy4nKTtcclxuICB9XHJcblxyXG4gIGxldCBzdHIgPSAnJztcclxuICBsZXQgaSA9IDA7XHJcbiAgY29uc3QgbCA9IGhleC5sZW5ndGg7XHJcbiAgaWYgKGhleC5zdWJzdHJpbmcoMCwgMikgPT09ICcweCcpIHtcclxuICAgIGkgPSAyO1xyXG4gIH1cclxuICBmb3IgKDsgaSA8IGw7IGkgKz0gMikge1xyXG4gICAgY29uc3QgY29kZSA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSwgMiksIDE2KTtcclxuICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3VsZCBiZSBjYWxsZWQgdG8gZ2V0IGhleCByZXByZXNlbnRhdGlvbiAocHJlZml4ZWQgYnkgMHgpIG9mIGFzY2lpIHN0cmluZ1xyXG4gKlxyXG4gKiBAbWV0aG9kIGFzY2lpVG9IZXhcclxuICogQHBhcmFtIHN0clxyXG4gKiBAcmV0dXJucyBoZXggcmVwcmVzZW50YXRpb24gb2YgaW5wdXQgc3RyaW5nXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXNjaWlUb0hleChzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKCFzdHIpIHtcclxuICAgIHJldHVybiAnMHgwMCc7XHJcbiAgfVxyXG4gIGxldCBoZXggPSAnJztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgY29kZSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgY29uc3QgbiA9IGNvZGUudG9TdHJpbmcoMTYpO1xyXG4gICAgaGV4ICs9IG4ubGVuZ3RoIDwgMiA/ICcwJyArIG4gOiBuO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuICcweCcgKyBoZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBdXRvIGNvbnZlcnRzIGFueSBnaXZlbiB2YWx1ZSBpbnRvIGl0J3MgaGV4IHJlcHJlc2VudGF0aW9uLlxyXG4gKlxyXG4gKiBBbmQgZXZlbiBzdHJpbmdpZnlzIG9iamVjdHMgYmVmb3JlLlxyXG4gKlxyXG4gKiBAbWV0aG9kIHRvSGV4XHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcGFyYW0gcmV0dXJuVHlwZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvSGV4KFxyXG4gIHZhbHVlOiBTdHJpbmcgfCBOdW1iZXIgfCBCTiB8IE9iamVjdCxcclxuICByZXR1cm5UeXBlPzogYm9vbGVhblxyXG4pOiBzdHJpbmcge1xyXG4gIC8qanNoaW50IG1heGNvbXBsZXhpdHk6IGZhbHNlICovXHJcblxyXG4gIGlmIChpc0FkZHJlc3ModmFsdWUpKSB7XHJcbiAgICByZXR1cm4gcmV0dXJuVHlwZVxyXG4gICAgICA/ICdhZGRyZXNzJ1xyXG4gICAgICA6ICcweCcgKyB2YWx1ZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL14weC9pLCAnJyk7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcclxuICAgIHJldHVybiByZXR1cm5UeXBlID8gJ2Jvb2wnIDogdmFsdWUgPyAnMHgwMScgOiAnMHgwMCc7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhaXNCaWdOdW1iZXIodmFsdWUpICYmICFpc0JOKHZhbHVlKSkge1xyXG4gICAgcmV0dXJuIHJldHVyblR5cGUgPyAnc3RyaW5nJyA6IHV0ZjhUb0hleChKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gaWYgaXRzIGEgbmVnYXRpdmUgbnVtYmVyLCBwYXNzIGl0IHRocm91Z2ggbnVtYmVyVG9IZXhcclxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgaWYgKHZhbHVlLmluZGV4T2YoJy0weCcpID09PSAwIHx8IHZhbHVlLmluZGV4T2YoJy0wWCcpID09PSAwKSB7XHJcbiAgICAgIHJldHVybiByZXR1cm5UeXBlID8gJ2ludDI1NicgOiBudW1iZXJUb0hleCh2YWx1ZSk7XHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlLmluZGV4T2YoJzB4JykgPT09IDAgfHwgdmFsdWUuaW5kZXhPZignMFgnKSA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gcmV0dXJuVHlwZSA/ICdieXRlcycgOiB2YWx1ZTtcclxuICAgIH0gZWxzZSBpZiAoIWlzRmluaXRlKHZhbHVlIGFzIGFueSkpIHtcclxuICAgICAgcmV0dXJuIHJldHVyblR5cGUgPyAnc3RyaW5nJyA6IHV0ZjhUb0hleCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmV0dXJuVHlwZSA/ICh2YWx1ZSA8IDAgPyAnaW50MjU2JyA6ICd1aW50MjU2JykgOiBudW1iZXJUb0hleCh2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBzdHJpbmcgaXMgSEVYLCByZXF1aXJlcyBhIDB4IGluIGZyb250XHJcbiAqXHJcbiAqIEBtZXRob2QgaXNIZXhTdHJpY3RcclxuICogQHBhcmFtIGhleCB0byBiZSBjaGVja2VkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNIZXhTdHJpY3QoaGV4OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHlwZW9mIGhleCA9PT0gJ3N0cmluZycgfHxcclxuICAgICh0eXBlb2YgaGV4ID09PSAnbnVtYmVyJyAmJiAvXigtKT8weFswLTlhLWZdKiQvaS50ZXN0KGhleCkpXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHN0cmluZyBpcyBIRVhcclxuICpcclxuICogQG1ldGhvZCBpc0hleFxyXG4gKiBAcGFyYW0gaGV4IHRvIGJlIGNoZWNrZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0hleChoZXg6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICB0eXBlb2YgaGV4ID09PSAnc3RyaW5nJyB8fFxyXG4gICAgKHR5cGVvZiBoZXggPT09ICdudW1iZXInICYmIC9eKC0weHwweCk/WzAtOWEtZl0qJC9pLnRlc3QoaGV4KSlcclxuICApO1xyXG59XHJcbiJdfQ==