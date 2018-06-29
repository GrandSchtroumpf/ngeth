import * as utf8 from 'utf8';
import BN from 'bn.js';

import { isBigNumber, isBN, toBN } from './bn';
import { keccak256 } from './keccack';

/*******************
 * ADDRESS
 */

/**
 * Checks if the given string is an address
 * @method isAddress
 * @param address the given HEX address
 */
export function isAddress(address: string): boolean {
  // check if it has the basic requirements of an address
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
    // If it's ALL lowercase or ALL upppercase
  } else if (
    /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
    /^(0x|0X)?[0-9A-F]{40}$/.test(address)
  ) {
    return true;
    // Otherwise check each case
  } else {
    return checkAddressChecksum(address);
  }
}

/**
 * Checks if the given string is a checksummed address
 *
 * @method checkAddressChecksum
 * @param address the given HEX address
 */
export function checkAddressChecksum(address: string): boolean {
  // Check each case
  address = address.replace(/^0x/i, '');
  const addressHash = sha3(address.toLowerCase()).replace(/^0x/i, '');

  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Converts to a checksum address
 *
 * @method toChecksumAddress
 * @param address the given HEX address
 */
export function toChecksumAddress(address: string): string {
  if (typeof address === 'undefined') {
    return '';
  }

  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Error(
      `Given address ${address} is not a valid Ethereum address.`
    );
  }

  address = address.toLowerCase().replace(/^0x/i, '');
  const addressHash = sha3(address).replace(/^0x/i, '');
  let checksumAddress = '0x';

  for (let i = 0; i < address.length; i++) {
    // If ith character is 9 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }
  return checksumAddress;
}

/**
 * Should be called to pad string to expected length
 *
 * @method leftPad
 * @param string to be padded
 * @param chars that result string should have
 * @param sign, by default 0
 * @returns right aligned string
 */
export function leftPad(string: string, chars: number, sign: string): string {
  const hasPrefix = /^0x/i.test(string) || typeof string === 'number';
  string = (string as any).toString(16).replace(/^0x/i, '');

  const padding =
    chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

  return (
    (hasPrefix ? '0x' : '') +
    new Array(padding).join(sign ? sign : '0') +
    string
  );
}

/**
 * Should be called to pad string to expected length
 *
 * @method rightPad
 * @param string to be padded
 * @param chars that result string should have
 * @param sign, by default 0
 * @returns right aligned string
 */
export function rightPad(string: string, chars: number, sign: string): string {
  const hasPrefix = /^0x/i.test(string) || typeof string === 'number';
  string = (string as any).toString(16).replace(/^0x/i, '');

  const padding =
    chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

  return (
    (hasPrefix ? '0x' : '') +
    string +
    new Array(padding).join(sign ? sign : '0')
  );
}

/********************************
 * SHA3
 */

const SHA3_NULL_S =
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

/**
 * Hashes values to a sha3 hash using keccak 256
 * To hash a HEX string the hex must have 0x in front.
 * @method sha3
 * @return the sha3 string
 */
export function sha3(value: string) {
  if (isHexStrict(value) && /^0x/i.test(value.toString())) {
    value = hexToBytes(value) as string;
  }

  const returnValue = keccak256(value);

  if (returnValue === SHA3_NULL_S) {
    return null;
  } else {
    return returnValue;
  }
}

/************************************
 * HEX
 */

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method utf8ToHex
 * @param str
 * @returns hex representation of input string
 */
export function utf8ToHex(str: string): string {
  str = utf8.encode(str);
  let hex = '';

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

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // if (code !== 0) {
    const n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
    // }
  }

  return '0x' + hex;
}

/**
 * Should be called to get utf8 from it's hex representation
 * @method hexToUtf8
 * @param hex
 */
export function hexToUtf8(hex: string): string {
  if (!isHexStrict(hex)) {
    throw new Error(`The parameter ${hex} must be a valid HEX string.`);
  }
  let str = '';
  let code = 0;
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

  const l = hex.length;

  for (let i = 0; i < l; i += 2) {
    code = parseInt(hex.substr(i, 2), 16);
    // if (code !== 0) {
    str += String.fromCharCode(code);
    // }
  }

  return utf8.decode(str);
}

/**
 * Converts value to it's number representation
 * @method hexToNumber
 * @param value
 */
export function hexToNumber(value: string | number | BN): number {
  if (!value) {
    return value;
  }

  return new BN(value, 16).toNumber();
}

/**
 * Converts value to it's decimal representation in string
 * @method hexToNumberString
 * @param value
 */
export function hexToNumberString(value: string | number | BN): string {
  if (!value) {
    return value;
  }

  return new BN(value, 16).toString(10);
}

/**
 * Converts value to it's hex representation
 * @method numberToHex
 * @param value
 */
export function numberToHex(value: String | Number | BN): string {
  if (typeof value === 'undefined' || value === 'null') {
    return value;
  }

  if (!isFinite(value) && !isHexStrict(value)) {
    throw new Error(`Given input ${value} is not a number.`);
  }

  const number = toBN(value);
  const result = number.toString(16);

  return number.lt(new BN(0)) ? '-0x' + result.substr(1) : '0x' + result;
}

/**
 * Convert a byte array to a hex string
 * Note: Implementation from crypto-js
 * @method bytesToHex
 * @param bytes
 * @return the hex string
 */
export function bytesToHex(bytes: number[]): string {
  const hex = [];
  for (let i = 0; i < bytes.length; i++) {
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
 * @method hexToBytes
 * @param hex
 * @return the byte array
 */
export function hexToBytes(hex: string): number[] | string {
  hex = (hex as any).toString(16);

  if (!isHexStrict(hex)) {
    throw new Error(`Given value ${hex} is not a valid hex string.`);
  }

  hex = hex.replace(/^0x/i, '');
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

/**
 * Should be called to get ascii from it's hex representation
 *
 * @method hexToAscii
 * @param hex
 * @returns ascii string representation of hex value
 */
export function hexToAscii(hex: string): string {
  if (!isHexStrict(hex)) {
    throw new Error('The parameter must be a valid HEX string.');
  }

  let str = '';
  let i = 0;
  const l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }
  for (; i < l; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
}

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method asciiToHex
 * @param str
 * @returns hex representation of input string
 */
export function asciiToHex(str: string): string {
  if (!str) {
    return '0x00';
  }
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return '0x' + hex;
}

/**
 * Auto converts any given value into it's hex representation.
 *
 * And even stringifys objects before.
 *
 * @method toHex
 * @param value
 * @param returnType
 */
export function toHex(
  value: String | Number | BN | Object,
  returnType?: boolean
): string {
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
    } else if (value.indexOf('0x') === 0 || value.indexOf('0X') === 0) {
      return returnType ? 'bytes' : value;
    } else if (!isFinite(value as any)) {
      return returnType ? 'string' : utf8ToHex(value);
    }
  }

  return returnType ? (value < 0 ? 'int256' : 'uint256') : numberToHex(value);
}

/**
 * Check if string is HEX, requires a 0x in front
 *
 * @method isHexStrict
 * @param hex to be checked
 */
export function isHexStrict(hex: string): boolean {
  return (
    typeof hex === 'string' ||
    (typeof hex === 'number' && /^(-)?0x[0-9a-f]*$/i.test(hex))
  );
}

/**
 * Check if string is HEX
 *
 * @method isHex
 * @param hex to be checked
 */
export function isHex(hex: string): boolean {
  return (
    typeof hex === 'string' ||
    (typeof hex === 'number' && /^(-0x|0x)?[0-9a-f]*$/i.test(hex))
  );
}
