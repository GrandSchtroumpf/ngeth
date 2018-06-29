import BN from 'bn.js';
/**
 * Returns true if object is BN, otherwise false
 *
 * @method isBN
 * @param object
 */
export function isBN(object: Object): boolean {
  return (
    object instanceof BN ||
    (object && object.constructor && object.constructor.name === 'BN')
  );
}

/**
 * Returns true if object is BigNumber, otherwise false
 *
 * @method isBigNumber
 * @param object
 */
export function isBigNumber(object: Object): boolean {
  return (
    object && object.constructor && object.constructor.name === 'BigNumber'
  );
}

/**
 * Takes an input and transforms it into an BN
 * @param number, string, HEX string or BN
 */
export function toBN(number: number | string | BN): BN {
  try {
    return numberToBN.apply(null, arguments);
  } catch (e) {
    throw new Error(`${e} + ' Given value: ${number} `);
  }
}

/**
 * Takes and input transforms it into BN and if it is negative value, into two's complement
 *
 * @method toTwosComplement
 * @param number
 */
export function toTwosComplement(number: number | string | BN): string {
  return (
    '0x' +
    toBN(number)
      .toTwos(256)
      .toString(16, 64)
  );
}

/**
 * Convert integer or hex integer numbers to BN.js object instances. Does not supprot decimal numbers.
 * @param arg
 */
function numberToBN(arg: string | number | object) {
  if (typeof arg === 'string' || typeof arg === 'number') {
    let multiplier = new BN(1);
    const formattedString = String(arg)
      .toLowerCase()
      .trim();
    const isPrefixed =
      formattedString.substr(0, 2) === '0x' ||
      formattedString.substr(0, 3) === '-0x';
    let stringArg = stripHexPrefix(formattedString);
    if (stringArg.substr(0, 1) === '-') {
      stringArg = stripHexPrefix(stringArg.slice(1));
      multiplier = new BN(-1, 10);
    }
    stringArg = stringArg === '' ? '0' : stringArg;

    if (
      (!stringArg.match(/^-?[0-9]+$/) && stringArg.match(/^[0-9A-Fa-f]+$/)) ||
      stringArg.match(/^[a-fA-F]+$/) ||
      (isPrefixed === true && stringArg.match(/^[0-9A-Fa-f]+$/))
    ) {
      return new BN(stringArg, 16).mul(multiplier);
    }

    if (
      (stringArg.match(/^-?[0-9]+$/) || stringArg === '') &&
      isPrefixed === false
    ) {
      return new BN(stringArg, 10).mul(multiplier);
    }
  } else if (
    typeof arg === 'object' &&
    arg.toString &&
    (!arg['pop'] && !arg['push'])
  ) {
    if (
      arg.toString().match(/^-?[0-9]+$/) &&
      (arg['mul'] || arg['dividedToIntegerBy'])
    ) {
      return new BN(arg.toString(), 10);
    }
  }

  throw new Error(`
    [number-to-bn] while converting number ${JSON.stringify(
      arg
    )} to BN.js instance,
    error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance.
    Note, decimals are not supported.
  `);
}

/**
 * Removes '0x' from a given `String` if present
 * @param str the string value
 * @return a string by pass if necessary
 */
function stripHexPrefix(str?: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  return isHexPrefixed(str) ? str.slice(2) : str;
}

/**
 * Returns a `Boolean` on whether or not the a `String` starts with '0x'
 * @param str the string input value
 * @return  a boolean if it is or is not hex prefixed
 * @throws if the str input is not a string
 */
function isHexPrefixed(str: string): boolean {
  if (typeof str !== 'string') {
    throw new Error(
      `[is-hex-prefixed] value must be type 'string', is currently type ${typeof str}, while checking isHexPrefixed.`
    );
  }

  return str.slice(0, 2) === '0x';
}
