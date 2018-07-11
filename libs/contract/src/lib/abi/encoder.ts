import { Injectable } from '@angular/core';
import { ABIInput, numberToHex, utf8ToHex, toBN, ABIDefinition, keccak256 } from '@ngeth/utils';
import { isStatic, isFixedArray, paramFromArray, fixedArraySize } from './utils';

export class EncodedParam {
  constructor(public head: string = '', public tail = '') {}
}

@Injectable({ providedIn: 'root' })
export class ABIEncoder {
  constructor() {}

  /**
   * Encode the constructor method for deploying
   * @param constructor The constructor param defined in the ABI
   * @param bytes The content of the contract
   * @param args The arguments to pass into the constructor if any
   */
  public encodeConstructor(
    constructor: ABIDefinition,
    bytes: string,
    args?: any[]
  ) {
    const encoded = this.encodeInputs(args, constructor.inputs);
    return bytes + encoded.head + encoded.tail;
  }

  /**
   * Encode the whole method
   * @param mehtod The method the encode has defined in the ABI
   * @param args The list of arguments given by the user
   */
  public encodeMethod(method: ABIDefinition, args: any[]) {
    // Create and sign method
    const { name, inputs } = method;
    const signature = this.signMethod(method);
    const hashSign = keccak256(signature).slice(0, 10);

    // Create the encoded arguments
    const encoded = this.encodeInputs(args, inputs);
    return hashSign + encoded.head + encoded.tail;
  }

  /**
   * Encode an event
   * @param event The event to encode
   */
  public encodeEvent(event: ABIDefinition): string {
    const { name, inputs } = event;
    const signature = this.signMethod(event);
    return keccak256(signature);
  }

  /*******************************************
   *************** SIGNATURE *****************
   *******************************************/

  /**
   * Create a string for the signature based on the params in the ABI
   * @param params The params given by the ABI.
   */
  private signInputs(inputs: ABIInput[]): string {
    return inputs
      .map(input => input.components ? this.tupleType(input) : input.type)
      .join(',');
  }

  /** Return the type of a tuple needed for the signature */
  private tupleType(tuple: ABIInput): string {
    const innerTypes = this.signInputs(tuple.components);
    const arrayPart = tuple.type.substr(5);
    return `(${innerTypes})${arrayPart}`;
  }

  /**
   * Sign a specific method based on the ABI
   * @param mehtod The method the encode has defined in the ABI
   */
  private signMethod(method: ABIDefinition): string {
    const { name, inputs } = method;
    const types = this.signInputs(inputs);
    return `${name}(${types})`;
  }

  /*******************************************
   **************** ENCODE *******************
   *******************************************/

  /**
   * Map to the right encoder depending on the type
   * @param arg the arg of the input
   * @param input the input defined in the ABI
   */
  public encode(arg: any, input: ABIInput): string {
    const type = input.type;
    // Compare true with the result of the cases
    switch (true) {
      // Array: Must be first
      case /\[([0-9]*)\]/.test(type): {
        return this.encodeArray(arg, input);
      }
      // Tuple
      case /tuple?/.test(type): {
        // Get args given as an object
        const args = Object.keys(arg).map(key => arg[key]);
        return this.encodeTuple(args, input.components);
      }
      // String
      case /string?/.test(type): {
        return this.encodeString(arg);
      }
      // Dynamic Bytes
      case /bytes?\b/.test(type): {
        return this.encodeDynamicBytes(arg);
      }
      // Static Bytes
      case /bytes?/.test(type): {
        return this.encodeStaticBytes(arg);
      }
      // Int / Uint
      case /int?/.test(type): {
        return this.encodeInt(arg, input);
      }
      // Address
      case /address?/.test(type): {
        return this.encodeAddress(arg);
      }
      // Bool
      case /bool?/.test(type): {
        return this.encodeBool(arg);
      }
      default: {
        throw new Error('Cannot find the encoder for the type : ' + type);
      }
    }
  }

  /*******************
   * STATIC OR DYNAMIC
   *******************/

  /**
   * Encode a list of inputs
   * @param args The arguments given by the users
   * @param inputs The inputs defined in the ABI
   */
  public encodeInputs(args: any[], inputs: ABIInput[]): EncodedParam {
    const offset = args.length * 64;
    const init = new EncodedParam();
    return inputs.reduce(
      (prev: EncodedParam, input: ABIInput, i: number) => {
        const encoded = this.encode(args[i], input)
        const suboffset = (offset + prev.tail.length) / 2;
        if (isStatic(input)) {
          return new EncodedParam(prev.head + encoded, prev.tail);
        } else {
          let head = numberToHex(suboffset).replace('0x', '');
          head = this.padStart(head, 64, '0');
          return new EncodedParam(prev.head + head, prev.tail + encoded)
        }
      }, init
    );
  }

  /**
   * Encode an array
   * @param args The argument given by the user for this array
   * @param input The input defined in the ABI
   */
  private encodeArray(args: any[], input: ABIInput): string {
    if (args.length === 0) {
      throw new Error(`No arguments found in array ${input.name}`);
    }
    let encoded = '';
    if (!isFixedArray(input.type)) {
      encoded = numberToHex(args.length).replace('0x', '')
      encoded = this.padStart(encoded, 64, '0');
    } else if (args.length !== fixedArraySize(input.type)) {
      throw new Error(`${args} should be of size ${fixedArraySize(input.type)}`);
    }
    const inputs = paramFromArray(args.length, input);
    const { head, tail } = this.encodeInputs(args, inputs);
    return encoded + head + tail;
  }

  /**
   * Encode the tuple
   * @param args Arguments of this tuple
   * @param inputs Inputs defined in the ABI
   */
  private encodeTuple(args: any[], inputs: ABIInput[]): string {
    const { head, tail } = this.encodeInputs(args, inputs);
    return head + tail;
  }

  /*********
   * DYNAMIC
   *********/

  /** Encode a string */
  private encodeString(arg: string): string {
    if (typeof arg !== 'string') {
      throw new Error(`Argument ${arg} should be a string`);
    }
    const hex = utf8ToHex(arg).replace('0x', '');
    const size = numberToHex(arg.length).replace('0x', '')
    const hexSize = hex.length + 64 - (hex.length % 64);
    return this.padStart(size, 64, '0') + this.padEnd(hex, hexSize, '0');
  }

  /**
   * Encode a dynamic bytes
   * @example bytes
   */
  private encodeDynamicBytes(arg: string) {
    if (typeof arg !== 'string') {
      throw new Error(`Argument ${arg} should be a string`);
    }
    const hex = arg.replace('0x', '');
    const size = numberToHex(hex.length / 2).replace('0x', '');
    const hexSize = hex.length + 64 - (hex.length % 64);
    return this.padStart(size, 64, '0') + this.padEnd(hex, hexSize, '0');
  }

  /********
   * STATIC
   ********/

  /**
   * Encode a static bytes
   * @example bytes3, bytes32
   */
  private encodeStaticBytes(arg: string | number) {
    if (typeof arg !== 'string' && typeof arg !== 'number') {
      throw new Error(`Argument ${arg} should be a string or number`);
    }
    if (typeof arg === 'number') { arg = arg.toString(16); }
    const result = arg.replace('0x', '');
    return this.padEnd(result, 46, '0');
  }

  /**
   * Encode int or uint
   * @example int, int32, uint256
   */
  private encodeInt(arg: number, input: ABIInput) {
    if (typeof arg !== 'number') {
      throw new Error(`Argument ${arg} should be a number`);
    }
    if (arg % 1 !== 0) {
      throw new Error('Only provider integers, Solidity does not manage floats');
    }
    if (input.type.includes('uint') && arg < 0) {
      throw new Error(`"uint" cannot be negative at value ${arg}`)
    }
    return toBN(arg).toTwos(256).toString(16, 64);
  }

  /** Encode an address */
  private encodeAddress(arg: string | number) {
    if (typeof arg !== 'string' && typeof arg !== 'number') {
      throw new Error(`Argument ${arg} should be a string or number`);
    }
    if (typeof arg === 'number') { arg = arg.toString(16); }
    const result = arg.replace('0x', '');
    return this.padStart(result, 64, '0');
  }

  /** Encode a boolean */
  private encodeBool(arg: boolean): string {
    if (typeof arg !== 'boolean') {
      throw new Error(`Argument ${arg} should be a boolean`);
    }
    return arg ? this.padStart('1', 64, '0') : this.padStart('0', 64, '0');
  }

  /***
   * PadStart / PadEnd
   */
  private padStart(target: string, targetLength: number, padString: string): string {
    /* tslint:disable */
    targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
    /* tslint:enable */
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (target.length > targetLength) {
      return String(target);
    } else {
      targetLength = targetLength - target.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(target);
    }
  };

  private padEnd(target: string, targetLength: number, padString: string): string{
    /* tslint:disable */
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    /* tslint:enable */
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (target.length > targetLength) {
      return String(target);
    } else {
      targetLength = targetLength - target.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return String(target) + padString.slice(0, targetLength);
    }
  };
}
