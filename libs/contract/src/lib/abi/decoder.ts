import { BN } from 'bn.js';
import { Injectable } from '@angular/core';
import { ContractModule } from './../contract.module';
import {
  isStatic,
  isFixedArray,
  fixedArraySize,
  paramFromArray,
  isStaticTuple,
  isStaticArray } from './utils';
import {
  ABIOutput,
  ABIInput,
  hexToNumber,
  hexToUtf8,
  hexToNumberString,
  toChecksumAddress
} from '@ngeth/utils';

export class DecodedParam {
  constructor(public result: DecodedParam, public offset: number) {}
}

@Injectable({ providedIn: ContractModule })
export class ABIDecoder {

  /**
   * Decode an event output
   * @param topics The topics of the logs (indexed values)
   * @param data The data of the logs (bytes)
   * @param inputs The inputs givent by the ABI
   */
  public decodeEvent(topics: string[], data: string, inputs: ABIInput[]): any {
    const outputs = this.decodeOutputs(data, inputs);
    inputs
      .filter(input => input.indexed)
      .forEach((input, i) => {
        const topic = topics[i + 1].replace('0x', '');
        // If indexed value is static decode, else return as it
        outputs[input.name] = isStatic(input) ? this.decodeBytes(topic, input) : topic;
      });
    return outputs;
  }

  /**
   * Remap the bytes to decode depending on its type
   * @param bytes The bytes to decode
   * @param output The output described in the Abi
   */
  public decodeBytes(bytes: string, output: ABIOutput) {
    const type = output.type;
    // Compare true with the result of the cases
    switch (true) {
      // Array: Must be first
      case /\[([0-9]*)\]/.test(type):
        return this.decodeArray(bytes, output);
      // Tuple
      case /tuple?/.test(type):
        return this.decodeTuple(bytes, output.components);
      // String
      case /string?/.test(type):
        return this.decodeString(bytes);
      // Dynamic Bytes
      case /bytes?\b/.test(type):
        return this.decodeDynamicBytes(bytes);
      // Bytes
      case /bytes?/.test(type):
        return this.decodeStaticBytes(bytes);
      // Bytes
      case /int?/.test(type):
        return this.decodeInt(bytes);
      // Address
      case /address?/.test(type):
        return this.decodeAddress(bytes);
      // Bool
      case /bool?/.test(type):
        return this.decodeBool(bytes);
      default: {
        throw new Error('Cannot find the decoder for the type : ' + type);
      }
    }
  }

  /**
   * Decode the outputs : Start from the last to the first (to know the length of the tail)
   * @param bytes The bytes of the outputs
   * @param outputs The outputs from the abi
   */
  public decodeOutputs(bytes: string, outputs: (ABIOutput | ABIInput)[]): any {
    bytes = bytes.replace('0x', '');
    const init = { result: {}, offset: bytes.length };
    return outputs
      .filter(output => !(<ABIInput>output).indexed) // Remove indexed values
      .reduceRight((acc: DecodedParam, output: ABIOutput, i: number) => {
        const head = this.getHead(bytes, outputs, i);
        if (isStatic(output)) {
          acc.result[output.name || i] = this.decodeBytes(head, output);
          return new DecodedParam(acc.result, acc.offset);
        } else {
          const tailStart = hexToNumber(head) * 2; // transform bytes to hex
          const tailEnd = acc.offset;
          const tail = bytes.substring(tailStart, tailEnd);
          acc.result[output.name || i] = this.decodeBytes(tail, output);
          return new DecodedParam(acc.result, tailStart);
        }
      }, init
    ).result;
  }

  /**
   * Decode a array
   * @param bytes The bytes of this array
   * @param output The output object defined in the abi
   */
  public decodeArray(bytes: string, output: ABIOutput): any[] {
    let amount: number;
    if (isFixedArray(output.type)) {
      amount = fixedArraySize(output.type);
    } else {
      amount = hexToNumber(bytes.slice(0, 64));
    }
    const nestedBytes = isFixedArray(output.type) ? bytes : bytes.slice(64);
    const outputArray = paramFromArray(amount, output);
    const decoded = this.decodeOutputs(nestedBytes, outputArray);
    return Object.keys(decoded).map(key => decoded[key]);
  }

  /** Decode a tuple */
  public decodeTuple(bytes: string, outputs: ABIOutput[]): any {
    return this.decodeOutputs(bytes, outputs);
  }

  /** Decode a string */
  public decodeString(bytes: string): string {
    const str = bytes.slice(64);
    return hexToUtf8(str);
  }

  /** Decode a dynamic byte */
  public decodeDynamicBytes(bytes: string): string {
    const amount = hexToNumber(bytes.slice(0, 64));
    return bytes.slice(64).substring(0, amount * 2);
  }

  /** Decode a static byte */
  public decodeStaticBytes(bytes: string) {
    return bytes.replace(/\b0+(0+)/, '');
  }

  /**
   * Decode a uint or int
   * WARNING : Return a string
   */
  public decodeInt(bytes: string): string {
    const isNegative = (value: string) => {
      return (new BN(value.substr(0, 1), 16).toString(2).substr(0, 1)) === '1';
    }
    if (isNegative(bytes)) {
      return new BN(bytes, 16).fromTwos(256).toString(10);
    }
    return hexToNumberString(bytes);
  }

  /** Decode an address */
  public decodeAddress(bytes: string): string {
    return toChecksumAddress(bytes.substring(24));
  }

  /** Decode a boolean */
  public decodeBool(bytes: string): boolean {
    const last = bytes.substring(63);
    return last === '1' ? true : false;
  }

  /******
   * HEAD
   ******/

  /**
   * Return the head part of the output
   * @param bytes The bytes of the outputS
   * @param outputs The list of outputs
   * @param index The index of the output to check in the outputs
   */
  private getHead(bytes: string, outputs: ABIOutput[], index: number): string {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      if (isStaticTuple(outputs[i])) {
        const head = this.getAllHeads(bytes.substr(offset), outputs[i].components);
        offset += head.length;
      } else if (isStaticArray(outputs[i])) {
        offset += this.staticArraySize(bytes.substr(offset), outputs[index]);
      } else {
        offset += 64;
      }
    }
    if (isStaticTuple(outputs[index])) {
      const length = this.getAllHeads(bytes.substr(offset), outputs[index].components).length
      return bytes.substr(offset, length);
    } else if(isStaticArray(outputs[index])) {
      const length = this.staticArraySize(bytes.substr(offset), outputs[index]);
      return bytes.substr(offset, length);
    } else {
      return bytes.substr(offset, 64);
    }
  }

  /**
   * Get the size of a static array
   * @param bytes Bytes starting at the beginning of the array
   * @param output The array model
   */
  private staticArraySize(bytes: string, output: ABIOutput) {
    const size = fixedArraySize(output.type);
    const outputArray = paramFromArray(size, output);
    return this.getAllHeads(bytes, outputArray).length;
  }

  /**
   * Get all heads from static arrays or tuples
   * @param bytes Bytes starting at the beginning of the array or tuple
   * @param outputs The outputs given by the ABI for this array or tuple
   */
  private getAllHeads(bytes: string, outputs: ABIOutput[]) {
    return outputs.reduceRight((acc: string, output: ABIOutput, i: number) => {
        return acc + this.getHead(bytes, outputs, i);
      },'');
  }

}
