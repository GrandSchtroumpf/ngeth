/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { numberToHex, utf8ToHex, toBN, keccak256 } from '@ngeth/utils';
import { ContractModule } from '../contract.module';
import { isStatic, isFixedArray, paramFromArray, fixedArraySize } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "../contract.module";
export class EncodedParam {
    /**
     * @param {?=} head
     * @param {?=} tail
     */
    constructor(head = '', tail = '') {
        this.head = head;
        this.tail = tail;
    }
}
function EncodedParam_tsickle_Closure_declarations() {
    /** @type {?} */
    EncodedParam.prototype.head;
    /** @type {?} */
    EncodedParam.prototype.tail;
}
export class ABIEncoder {
    constructor() { }
    /**
     * Encode the constructor method for deploying
     * @param {?} constructor The constructor param defined in the ABI
     * @param {?} bytes The content of the contract
     * @param {?=} args The arguments to pass into the constructor if any
     * @return {?}
     */
    encodeConstructor(constructor, bytes, args) {
        const /** @type {?} */ encoded = this.encodeInputs(args, constructor.inputs);
        return bytes + encoded.head + encoded.tail;
    }
    /**
     * Encode the whole method
     * @param {?} method
     * @param {?} args The list of arguments given by the user
     * @return {?}
     */
    encodeMethod(method, args) {
        // Create and sign method
        const { name, inputs } = method;
        const /** @type {?} */ signature = this.signMethod(method);
        const /** @type {?} */ hashSign = keccak256(signature).slice(0, 10);
        // Create the encoded arguments
        const /** @type {?} */ encoded = this.encodeInputs(args, inputs);
        return hashSign + encoded.head + encoded.tail;
    }
    /**
     * Encode an event
     * @param {?} event The event to encode
     * @return {?}
     */
    encodeEvent(event) {
        const { name, inputs } = event;
        const /** @type {?} */ signature = this.signMethod(event);
        return keccak256(signature);
    }
    /**
     * Create a string for the signature based on the params in the ABI
     * @param {?} inputs
     * @return {?}
     */
    signInputs(inputs) {
        return inputs
            .map(input => input.components ? this.tupleType(input) : input.type)
            .join(',');
    }
    /**
     * Return the type of a tuple needed for the signature
     * @param {?} tuple
     * @return {?}
     */
    tupleType(tuple) {
        const /** @type {?} */ innerTypes = this.signInputs(tuple.components);
        const /** @type {?} */ arrayPart = tuple.type.substr(5);
        return `(${innerTypes})${arrayPart}`;
    }
    /**
     * Sign a specific method based on the ABI
     * @param {?} method
     * @return {?}
     */
    signMethod(method) {
        const { name, inputs } = method;
        const /** @type {?} */ types = this.signInputs(inputs);
        return `${name}(${types})`;
    }
    /**
     * Map to the right encoder depending on the type
     * @param {?} arg the arg of the input
     * @param {?} input the input defined in the ABI
     * @return {?}
     */
    encode(arg, input) {
        const /** @type {?} */ type = input.type;
        // Compare true with the result of the cases
        switch (true) {
            // Array: Must be first
            case /\[([0-9]*)\]/.test(type): {
                return this.encodeArray(arg, input);
            }
            // Tuple
            case /tuple?/.test(type): {
                // Get args given as an object
                const /** @type {?} */ args = Object.keys(arg).map(key => arg[key]);
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
    /**
     * Encode a list of inputs
     * @param {?} args The arguments given by the users
     * @param {?} inputs The inputs defined in the ABI
     * @return {?}
     */
    encodeInputs(args, inputs) {
        const /** @type {?} */ offset = args.length * 64;
        const /** @type {?} */ init = new EncodedParam();
        return inputs.reduce((prev, input, i) => {
            const /** @type {?} */ encoded = this.encode(args[i], input);
            const /** @type {?} */ suboffset = (offset + prev.tail.length) / 2;
            if (isStatic(input)) {
                return new EncodedParam(prev.head + encoded, prev.tail);
            }
            else {
                let /** @type {?} */ head = numberToHex(suboffset).replace('0x', '');
                head = this.padStart(head, 64, '0');
                return new EncodedParam(prev.head + head, prev.tail + encoded);
            }
        }, init);
    }
    /**
     * Encode an array
     * @param {?} args The argument given by the user for this array
     * @param {?} input The input defined in the ABI
     * @return {?}
     */
    encodeArray(args, input) {
        if (args.length === 0) {
            throw new Error(`No arguments found in array ${input.name}`);
        }
        let /** @type {?} */ encoded = '';
        if (!isFixedArray(input.type)) {
            encoded = numberToHex(args.length).replace('0x', '');
            encoded = this.padStart(encoded, 64, '0');
        }
        else if (args.length !== fixedArraySize(input.type)) {
            throw new Error(`${args} should be of size ${fixedArraySize(input.type)}`);
        }
        const /** @type {?} */ inputs = paramFromArray(args.length, input);
        const { head, tail } = this.encodeInputs(args, inputs);
        return encoded + head + tail;
    }
    /**
     * Encode the tuple
     * @param {?} args Arguments of this tuple
     * @param {?} inputs Inputs defined in the ABI
     * @return {?}
     */
    encodeTuple(args, inputs) {
        const { head, tail } = this.encodeInputs(args, inputs);
        return head + tail;
    }
    /**
     * Encode a string
     * @param {?} arg
     * @return {?}
     */
    encodeString(arg) {
        if (typeof arg !== 'string') {
            throw new Error(`Argument ${arg} should be a string`);
        }
        const /** @type {?} */ hex = utf8ToHex(arg).replace('0x', '');
        const /** @type {?} */ size = numberToHex(arg.length).replace('0x', '');
        const /** @type {?} */ hexSize = hex.length + 64 - (hex.length % 64);
        return this.padStart(size, 64, '0') + this.padStart(hex, hexSize, '0');
    }
    /**
     * Encode a dynamic bytes
     * \@example bytes
     * @param {?} arg
     * @return {?}
     */
    encodeDynamicBytes(arg) {
        if (typeof arg !== 'string') {
            throw new Error(`Argument ${arg} should be a string`);
        }
        const /** @type {?} */ hex = arg.replace('0x', '');
        const /** @type {?} */ size = numberToHex(hex.length / 2).replace('0x', '');
        const /** @type {?} */ hexSize = hex.length + 64 - (hex.length % 64);
        return this.padStart(size, 64, '0') + this.padEnd(hex, hexSize, '0');
    }
    /**
     * Encode a static bytes
     * \@example bytes3, bytes32
     * @param {?} arg
     * @return {?}
     */
    encodeStaticBytes(arg) {
        if (typeof arg !== 'string' && typeof arg !== 'number') {
            throw new Error(`Argument ${arg} should be a string or number`);
        }
        if (typeof arg === 'number') {
            arg = arg.toString(16);
        }
        const /** @type {?} */ result = arg.replace('0x', '');
        return this.padEnd(result, 46, '0');
    }
    /**
     * Encode int or uint
     * \@example int, int32, uint256
     * @param {?} arg
     * @param {?} input
     * @return {?}
     */
    encodeInt(arg, input) {
        if (typeof arg !== 'number') {
            throw new Error(`Argument ${arg} should be a number`);
        }
        if (arg % 1 !== 0) {
            throw new Error('Only provider integers, Solidity does not manage floats');
        }
        if (input.type.includes('uint') && arg < 0) {
            throw new Error(`"uint" cannot be negative at value ${arg}`);
        }
        return toBN(arg).toTwos(256).toString(16, 64);
    }
    /**
     * Encode an address
     * @param {?} arg
     * @return {?}
     */
    encodeAddress(arg) {
        if (typeof arg !== 'string' && typeof arg !== 'number') {
            throw new Error(`Argument ${arg} should be a string or number`);
        }
        if (typeof arg === 'number') {
            arg = arg.toString(16);
        }
        const /** @type {?} */ result = arg.replace('0x', '');
        return this.padStart(result, 64, '0');
    }
    /**
     * Encode a boolean
     * @param {?} arg
     * @return {?}
     */
    encodeBool(arg) {
        if (typeof arg !== 'boolean') {
            throw new Error(`Argument ${arg} should be a boolean`);
        }
        return arg ? this.padStart('1', 64, '0') : this.padStart('0', 64, '0');
    }
    /**
     *
     * PadStart / PadEnd
     * @param {?} target
     * @param {?} targetLength
     * @param {?} padString
     * @return {?}
     */
    padStart(target, targetLength, padString) {
        /* tslint:disable */
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        /* tslint:enable */
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (target.length > targetLength) {
            return String(target);
        }
        else {
            targetLength = targetLength - target.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(target);
        }
    }
    ;
    /**
     * @param {?} target
     * @param {?} targetLength
     * @param {?} padString
     * @return {?}
     */
    padEnd(target, targetLength, padString) {
        /* tslint:disable */
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        /* tslint:enable */
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (target.length > targetLength) {
            return String(target);
        }
        else {
            targetLength = targetLength - target.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return String(target) + padString.slice(0, targetLength);
        }
    }
    ;
}
ABIEncoder.decorators = [
    { type: Injectable, args: [{ providedIn: ContractModule },] },
];
/** @nocollapse */
ABIEncoder.ctorParameters = () => [];
/** @nocollapse */ ABIEncoder.ngInjectableDef = i0.defineInjectable({ factory: function ABIEncoder_Factory() { return new ABIEncoder(); }, token: ABIEncoder, providedIn: i1.ContractModule });
function ABIEncoder_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ABIEncoder.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ABIEncoder.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2Rlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC9jb250cmFjdC8iLCJzb3VyY2VzIjpbImxpYi9hYmkvZW5jb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQVksV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQWlCLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNoRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBRWpGLE1BQU07Ozs7O0lBQ0osWUFBbUIsT0FBZSxFQUFFLEVBQVMsT0FBTyxFQUFFO1FBQW5DLFNBQUksR0FBSixJQUFJLENBQWE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFLO0tBQUk7Q0FDM0Q7Ozs7Ozs7QUFHRCxNQUFNO0lBQ0osaUJBQWdCOzs7Ozs7OztJQVFULGlCQUFpQixDQUN0QixXQUEwQixFQUMxQixLQUFhLEVBQ2IsSUFBWTtRQUVaLHVCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUQsTUFBTSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7O0lBUXRDLFlBQVksQ0FBQyxNQUFxQixFQUFFLElBQVc7O1FBRXBELE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLHVCQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLHVCQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzs7UUFHbkQsdUJBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDOzs7Ozs7O0lBT3pDLFdBQVcsQ0FBQyxLQUFvQjtRQUNyQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztRQUMvQix1QkFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7Ozs7O0lBV3RCLFVBQVUsQ0FBQyxNQUFrQjtRQUNuQyxNQUFNLENBQUMsTUFBTTthQUNWLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDbkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7O0lBSVAsU0FBUyxDQUFDLEtBQWU7UUFDL0IsdUJBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELHVCQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsSUFBSSxVQUFVLElBQUksU0FBUyxFQUFFLENBQUM7Ozs7Ozs7SUFPL0IsVUFBVSxDQUFDLE1BQXFCO1FBQ3RDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLHVCQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQzs7Ozs7Ozs7SUFZdEIsTUFBTSxDQUFDLEdBQVEsRUFBRSxLQUFlO1FBQ3JDLHVCQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDOztRQUV4QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztZQUViLEtBQUssY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDckM7O1lBRUQsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7O2dCQUV6Qix1QkFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNqRDs7WUFFRCxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDL0I7O1lBRUQsS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDckM7O1lBRUQsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEM7O1lBRUQsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNuQzs7WUFFRCxLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDaEM7O1lBRUQsS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzdCO1lBQ0QsU0FBUyxDQUFDO2dCQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDbkU7U0FDRjs7Ozs7Ozs7SUFZSSxZQUFZLENBQUMsSUFBVyxFQUFFLE1BQWtCO1FBQ2pELHVCQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQyx1QkFBTSxJQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FDbEIsQ0FBQyxJQUFrQixFQUFFLEtBQWUsRUFBRSxDQUFTLEVBQUUsRUFBRTtZQUNqRCx1QkFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDM0MsdUJBQU0sU0FBUyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDekQ7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixxQkFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3BELElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFBO2FBQy9EO1NBQ0YsRUFBRSxJQUFJLENBQ1IsQ0FBQzs7Ozs7Ozs7SUFRSSxXQUFXLENBQUMsSUFBVyxFQUFFLEtBQWU7UUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzlEO1FBQ0QscUJBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDcEQsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUMzQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLHNCQUFzQixjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1RTtRQUNELHVCQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7SUFRdkIsV0FBVyxDQUFDLElBQVcsRUFBRSxNQUFrQjtRQUNqRCxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOzs7Ozs7O0lBUWIsWUFBWSxDQUFDLEdBQVc7UUFDOUIsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsdUJBQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLHVCQUFNLElBQUksR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDdEQsdUJBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQzs7Ozs7Ozs7SUFPakUsa0JBQWtCLENBQUMsR0FBVztRQUNwQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxHQUFHLHFCQUFxQixDQUFDLENBQUM7U0FDdkQ7UUFDRCx1QkFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsdUJBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0QsdUJBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQzs7Ozs7Ozs7SUFXL0QsaUJBQWlCLENBQUMsR0FBb0I7UUFDNUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLEdBQUcsK0JBQStCLENBQUMsQ0FBQztTQUNqRTtRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUFFO1FBQ3hELHVCQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7Ozs7SUFPOUIsU0FBUyxDQUFDLEdBQVcsRUFBRSxLQUFlO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLEdBQUcscUJBQXFCLENBQUMsQ0FBQztTQUN2RDtRQUNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7U0FDNUU7UUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1NBQzdEO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OztJQUl4QyxhQUFhLENBQUMsR0FBb0I7UUFDeEMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLEdBQUcsK0JBQStCLENBQUMsQ0FBQztTQUNqRTtRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUFFO1FBQ3hELHVCQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7O0lBSWhDLFVBQVUsQ0FBQyxHQUFZO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztTQUN4RDtRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0lBTWpFLFFBQVEsQ0FBQyxNQUFjLEVBQUUsWUFBb0IsRUFBRSxTQUFpQjs7UUFFdEUsWUFBWSxHQUFHLFlBQVksSUFBSSxDQUFDLENBQUM7O1FBRWpDLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZCO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixZQUFZLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2hFO1lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMxRDs7SUFDRixDQUFDOzs7Ozs7O0lBRU0sTUFBTSxDQUFDLE1BQWMsRUFBRSxZQUFvQixFQUFFLFNBQWlCOztRQUVwRSxZQUFZLEdBQUcsWUFBWSxJQUFJLENBQUMsQ0FBQzs7UUFFakMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkI7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFlBQVksR0FBRyxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDaEU7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzFEOztJQUNGLENBQUM7OztZQTdTSCxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBQklJbnB1dCwgbnVtYmVyVG9IZXgsIHV0ZjhUb0hleCwgdG9CTiwgQUJJRGVmaW5pdGlvbiwga2VjY2FrMjU2IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgQ29udHJhY3RNb2R1bGUgfSBmcm9tICcuLi9jb250cmFjdC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBpc1N0YXRpYywgaXNGaXhlZEFycmF5LCBwYXJhbUZyb21BcnJheSwgZml4ZWRBcnJheVNpemUgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbmNvZGVkUGFyYW0ge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBoZWFkOiBzdHJpbmcgPSAnJywgcHVibGljIHRhaWwgPSAnJykge31cclxufVxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBDb250cmFjdE1vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgQUJJRW5jb2RlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgdGhlIGNvbnN0cnVjdG9yIG1ldGhvZCBmb3IgZGVwbG95aW5nXHJcbiAgICogQHBhcmFtIGNvbnN0cnVjdG9yIFRoZSBjb25zdHJ1Y3RvciBwYXJhbSBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGNvbnRlbnQgb2YgdGhlIGNvbnRyYWN0XHJcbiAgICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBwYXNzIGludG8gdGhlIGNvbnN0cnVjdG9yIGlmIGFueVxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGVDb25zdHJ1Y3RvcihcclxuICAgIGNvbnN0cnVjdG9yOiBBQklEZWZpbml0aW9uLFxyXG4gICAgYnl0ZXM6IHN0cmluZyxcclxuICAgIGFyZ3M/OiBhbnlbXVxyXG4gICkge1xyXG4gICAgY29uc3QgZW5jb2RlZCA9IHRoaXMuZW5jb2RlSW5wdXRzKGFyZ3MsIGNvbnN0cnVjdG9yLmlucHV0cyk7XHJcbiAgICByZXR1cm4gYnl0ZXMgKyBlbmNvZGVkLmhlYWQgKyBlbmNvZGVkLnRhaWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgdGhlIHdob2xlIG1ldGhvZFxyXG4gICAqIEBwYXJhbSBtZWh0b2QgVGhlIG1ldGhvZCB0aGUgZW5jb2RlIGhhcyBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKiBAcGFyYW0gYXJncyBUaGUgbGlzdCBvZiBhcmd1bWVudHMgZ2l2ZW4gYnkgdGhlIHVzZXJcclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlTWV0aG9kKG1ldGhvZDogQUJJRGVmaW5pdGlvbiwgYXJnczogYW55W10pIHtcclxuICAgIC8vIENyZWF0ZSBhbmQgc2lnbiBtZXRob2RcclxuICAgIGNvbnN0IHsgbmFtZSwgaW5wdXRzIH0gPSBtZXRob2Q7XHJcbiAgICBjb25zdCBzaWduYXR1cmUgPSB0aGlzLnNpZ25NZXRob2QobWV0aG9kKTtcclxuICAgIGNvbnN0IGhhc2hTaWduID0ga2VjY2FrMjU2KHNpZ25hdHVyZSkuc2xpY2UoMCwgMTApO1xyXG5cclxuICAgIC8vIENyZWF0ZSB0aGUgZW5jb2RlZCBhcmd1bWVudHNcclxuICAgIGNvbnN0IGVuY29kZWQgPSB0aGlzLmVuY29kZUlucHV0cyhhcmdzLCBpbnB1dHMpO1xyXG4gICAgcmV0dXJuIGhhc2hTaWduICsgZW5jb2RlZC5oZWFkICsgZW5jb2RlZC50YWlsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGFuIGV2ZW50XHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBlbmNvZGVcclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlRXZlbnQoZXZlbnQ6IEFCSURlZmluaXRpb24pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgeyBuYW1lLCBpbnB1dHMgfSA9IGV2ZW50O1xyXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gdGhpcy5zaWduTWV0aG9kKGV2ZW50KTtcclxuICAgIHJldHVybiBrZWNjYWsyNTYoc2lnbmF0dXJlKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICoqKioqKioqKioqKioqKiBTSUdOQVRVUkUgKioqKioqKioqKioqKioqKipcclxuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgc3RyaW5nIGZvciB0aGUgc2lnbmF0dXJlIGJhc2VkIG9uIHRoZSBwYXJhbXMgaW4gdGhlIEFCSVxyXG4gICAqIEBwYXJhbSBwYXJhbXMgVGhlIHBhcmFtcyBnaXZlbiBieSB0aGUgQUJJLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2lnbklucHV0cyhpbnB1dHM6IEFCSUlucHV0W10pOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGlucHV0c1xyXG4gICAgICAubWFwKGlucHV0ID0+IGlucHV0LmNvbXBvbmVudHMgPyB0aGlzLnR1cGxlVHlwZShpbnB1dCkgOiBpbnB1dC50eXBlKVxyXG4gICAgICAuam9pbignLCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFJldHVybiB0aGUgdHlwZSBvZiBhIHR1cGxlIG5lZWRlZCBmb3IgdGhlIHNpZ25hdHVyZSAqL1xyXG4gIHByaXZhdGUgdHVwbGVUeXBlKHR1cGxlOiBBQklJbnB1dCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBpbm5lclR5cGVzID0gdGhpcy5zaWduSW5wdXRzKHR1cGxlLmNvbXBvbmVudHMpO1xyXG4gICAgY29uc3QgYXJyYXlQYXJ0ID0gdHVwbGUudHlwZS5zdWJzdHIoNSk7XHJcbiAgICByZXR1cm4gYCgke2lubmVyVHlwZXN9KSR7YXJyYXlQYXJ0fWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgc3BlY2lmaWMgbWV0aG9kIGJhc2VkIG9uIHRoZSBBQklcclxuICAgKiBAcGFyYW0gbWVodG9kIFRoZSBtZXRob2QgdGhlIGVuY29kZSBoYXMgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaWduTWV0aG9kKG1ldGhvZDogQUJJRGVmaW5pdGlvbik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB7IG5hbWUsIGlucHV0cyB9ID0gbWV0aG9kO1xyXG4gICAgY29uc3QgdHlwZXMgPSB0aGlzLnNpZ25JbnB1dHMoaW5wdXRzKTtcclxuICAgIHJldHVybiBgJHtuYW1lfSgke3R5cGVzfSlgO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKioqKioqKioqKioqKioqKiBFTkNPREUgKioqKioqKioqKioqKioqKioqKlxyXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBNYXAgdG8gdGhlIHJpZ2h0IGVuY29kZXIgZGVwZW5kaW5nIG9uIHRoZSB0eXBlXHJcbiAgICogQHBhcmFtIGFyZyB0aGUgYXJnIG9mIHRoZSBpbnB1dFxyXG4gICAqIEBwYXJhbSBpbnB1dCB0aGUgaW5wdXQgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZShhcmc6IGFueSwgaW5wdXQ6IEFCSUlucHV0KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHR5cGUgPSBpbnB1dC50eXBlO1xyXG4gICAgLy8gQ29tcGFyZSB0cnVlIHdpdGggdGhlIHJlc3VsdCBvZiB0aGUgY2FzZXNcclxuICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAvLyBBcnJheTogTXVzdCBiZSBmaXJzdFxyXG4gICAgICBjYXNlIC9cXFsoWzAtOV0qKVxcXS8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUFycmF5KGFyZywgaW5wdXQpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFR1cGxlXHJcbiAgICAgIGNhc2UgL3R1cGxlPy8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIC8vIEdldCBhcmdzIGdpdmVuIGFzIGFuIG9iamVjdFxyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBPYmplY3Qua2V5cyhhcmcpLm1hcChrZXkgPT4gYXJnW2tleV0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZVR1cGxlKGFyZ3MsIGlucHV0LmNvbXBvbmVudHMpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFN0cmluZ1xyXG4gICAgICBjYXNlIC9zdHJpbmc/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlU3RyaW5nKGFyZyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gRHluYW1pYyBCeXRlc1xyXG4gICAgICBjYXNlIC9ieXRlcz9cXGIvLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVEeW5hbWljQnl0ZXMoYXJnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBTdGF0aWMgQnl0ZXNcclxuICAgICAgY2FzZSAvYnl0ZXM/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlU3RhdGljQnl0ZXMoYXJnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBJbnQgLyBVaW50XHJcbiAgICAgIGNhc2UgL2ludD8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVJbnQoYXJnLCBpbnB1dCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gQWRkcmVzc1xyXG4gICAgICBjYXNlIC9hZGRyZXNzPy8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUFkZHJlc3MoYXJnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBCb29sXHJcbiAgICAgIGNhc2UgL2Jvb2w/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQm9vbChhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIHRoZSBlbmNvZGVyIGZvciB0aGUgdHlwZSA6ICcgKyB0eXBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKipcclxuICAgKiBTVEFUSUMgT1IgRFlOQU1JQ1xyXG4gICAqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYSBsaXN0IG9mIGlucHV0c1xyXG4gICAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgZ2l2ZW4gYnkgdGhlIHVzZXJzXHJcbiAgICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXRzIGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGVJbnB1dHMoYXJnczogYW55W10sIGlucHV0czogQUJJSW5wdXRbXSk6IEVuY29kZWRQYXJhbSB7XHJcbiAgICBjb25zdCBvZmZzZXQgPSBhcmdzLmxlbmd0aCAqIDY0O1xyXG4gICAgY29uc3QgaW5pdCA9IG5ldyBFbmNvZGVkUGFyYW0oKTtcclxuICAgIHJldHVybiBpbnB1dHMucmVkdWNlKFxyXG4gICAgICAocHJldjogRW5jb2RlZFBhcmFtLCBpbnB1dDogQUJJSW5wdXQsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVuY29kZWQgPSB0aGlzLmVuY29kZShhcmdzW2ldLCBpbnB1dClcclxuICAgICAgICBjb25zdCBzdWJvZmZzZXQgPSAob2Zmc2V0ICsgcHJldi50YWlsLmxlbmd0aCkgLyAyO1xyXG4gICAgICAgIGlmIChpc1N0YXRpYyhpbnB1dCkpIHtcclxuICAgICAgICAgIHJldHVybiBuZXcgRW5jb2RlZFBhcmFtKHByZXYuaGVhZCArIGVuY29kZWQsIHByZXYudGFpbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBoZWFkID0gbnVtYmVyVG9IZXgoc3Vib2Zmc2V0KS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgICAgICAgIGhlYWQgPSB0aGlzLnBhZFN0YXJ0KGhlYWQsIDY0LCAnMCcpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBFbmNvZGVkUGFyYW0ocHJldi5oZWFkICsgaGVhZCwgcHJldi50YWlsICsgZW5jb2RlZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sIGluaXRcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYW4gYXJyYXlcclxuICAgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnQgZ2l2ZW4gYnkgdGhlIHVzZXIgZm9yIHRoaXMgYXJyYXlcclxuICAgKiBAcGFyYW0gaW5wdXQgVGhlIGlucHV0IGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5jb2RlQXJyYXkoYXJnczogYW55W10sIGlucHV0OiBBQklJbnB1dCk6IHN0cmluZyB7XHJcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBhcmd1bWVudHMgZm91bmQgaW4gYXJyYXkgJHtpbnB1dC5uYW1lfWApO1xyXG4gICAgfVxyXG4gICAgbGV0IGVuY29kZWQgPSAnJztcclxuICAgIGlmICghaXNGaXhlZEFycmF5KGlucHV0LnR5cGUpKSB7XHJcbiAgICAgIGVuY29kZWQgPSBudW1iZXJUb0hleChhcmdzLmxlbmd0aCkucmVwbGFjZSgnMHgnLCAnJylcclxuICAgICAgZW5jb2RlZCA9IHRoaXMucGFkU3RhcnQoZW5jb2RlZCwgNjQsICcwJyk7XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoICE9PSBmaXhlZEFycmF5U2l6ZShpbnB1dC50eXBlKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7YXJnc30gc2hvdWxkIGJlIG9mIHNpemUgJHtmaXhlZEFycmF5U2l6ZShpbnB1dC50eXBlKX1gKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGlucHV0cyA9IHBhcmFtRnJvbUFycmF5KGFyZ3MubGVuZ3RoLCBpbnB1dCk7XHJcbiAgICBjb25zdCB7IGhlYWQsIHRhaWwgfSA9IHRoaXMuZW5jb2RlSW5wdXRzKGFyZ3MsIGlucHV0cyk7XHJcbiAgICByZXR1cm4gZW5jb2RlZCArIGhlYWQgKyB0YWlsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIHRoZSB0dXBsZVxyXG4gICAqIEBwYXJhbSBhcmdzIEFyZ3VtZW50cyBvZiB0aGlzIHR1cGxlXHJcbiAgICogQHBhcmFtIGlucHV0cyBJbnB1dHMgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVUdXBsZShhcmdzOiBhbnlbXSwgaW5wdXRzOiBBQklJbnB1dFtdKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHsgaGVhZCwgdGFpbCB9ID0gdGhpcy5lbmNvZGVJbnB1dHMoYXJncywgaW5wdXRzKTtcclxuICAgIHJldHVybiBoZWFkICsgdGFpbDtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKipcclxuICAgKiBEWU5BTUlDXHJcbiAgICoqKioqKioqKi9cclxuXHJcbiAgLyoqIEVuY29kZSBhIHN0cmluZyAqL1xyXG4gIHByaXZhdGUgZW5jb2RlU3RyaW5nKGFyZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBzdHJpbmdgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGhleCA9IHV0ZjhUb0hleChhcmcpLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgY29uc3Qgc2l6ZSA9IG51bWJlclRvSGV4KGFyZy5sZW5ndGgpLnJlcGxhY2UoJzB4JywgJycpXHJcbiAgICBjb25zdCBoZXhTaXplID0gaGV4Lmxlbmd0aCArIDY0IC0gKGhleC5sZW5ndGggJSA2NCk7XHJcbiAgICByZXR1cm4gdGhpcy5wYWRTdGFydChzaXplLCA2NCwgJzAnKSArIHRoaXMucGFkU3RhcnQoaGV4LCBoZXhTaXplLCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGEgZHluYW1pYyBieXRlc1xyXG4gICAqIEBleGFtcGxlIGJ5dGVzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVEeW5hbWljQnl0ZXMoYXJnOiBzdHJpbmcpIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBzdHJpbmdgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGhleCA9IGFyZy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIGNvbnN0IHNpemUgPSBudW1iZXJUb0hleChoZXgubGVuZ3RoIC8gMikucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICBjb25zdCBoZXhTaXplID0gaGV4Lmxlbmd0aCArIDY0IC0gKGhleC5sZW5ndGggJSA2NCk7XHJcbiAgICByZXR1cm4gdGhpcy5wYWRTdGFydChzaXplLCA2NCwgJzAnKSArIHRoaXMucGFkRW5kKGhleCwgaGV4U2l6ZSwgJzAnKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKlxyXG4gICAqIFNUQVRJQ1xyXG4gICAqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGEgc3RhdGljIGJ5dGVzXHJcbiAgICogQGV4YW1wbGUgYnl0ZXMzLCBieXRlczMyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVTdGF0aWNCeXRlcyhhcmc6IHN0cmluZyB8IG51bWJlcikge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBhcmcgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIHN0cmluZyBvciBudW1iZXJgKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykgeyBhcmcgPSBhcmcudG9TdHJpbmcoMTYpOyB9XHJcbiAgICBjb25zdCByZXN1bHQgPSBhcmcucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICByZXR1cm4gdGhpcy5wYWRFbmQocmVzdWx0LCA0NiwgJzAnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBpbnQgb3IgdWludFxyXG4gICAqIEBleGFtcGxlIGludCwgaW50MzIsIHVpbnQyNTZcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZUludChhcmc6IG51bWJlciwgaW5wdXQ6IEFCSUlucHV0KSB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgbnVtYmVyYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoYXJnICUgMSAhPT0gMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgcHJvdmlkZXIgaW50ZWdlcnMsIFNvbGlkaXR5IGRvZXMgbm90IG1hbmFnZSBmbG9hdHMnKTtcclxuICAgIH1cclxuICAgIGlmIChpbnB1dC50eXBlLmluY2x1ZGVzKCd1aW50JykgJiYgYXJnIDwgMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwidWludFwiIGNhbm5vdCBiZSBuZWdhdGl2ZSBhdCB2YWx1ZSAke2FyZ31gKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvQk4oYXJnKS50b1R3b3MoMjU2KS50b1N0cmluZygxNiwgNjQpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEVuY29kZSBhbiBhZGRyZXNzICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVBZGRyZXNzKGFyZzogc3RyaW5nIHwgbnVtYmVyKSB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGFyZyAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgc3RyaW5nIG9yIG51bWJlcmApO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7IGFyZyA9IGFyZy50b1N0cmluZygxNik7IH1cclxuICAgIGNvbnN0IHJlc3VsdCA9IGFyZy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIHJldHVybiB0aGlzLnBhZFN0YXJ0KHJlc3VsdCwgNjQsICcwJyk7XHJcbiAgfVxyXG5cclxuICAvKiogRW5jb2RlIGEgYm9vbGVhbiAqL1xyXG4gIHByaXZhdGUgZW5jb2RlQm9vbChhcmc6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdib29sZWFuJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBib29sZWFuYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJnID8gdGhpcy5wYWRTdGFydCgnMScsIDY0LCAnMCcpIDogdGhpcy5wYWRTdGFydCgnMCcsIDY0LCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqKlxyXG4gICAqIFBhZFN0YXJ0IC8gUGFkRW5kXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBwYWRTdGFydCh0YXJnZXQ6IHN0cmluZywgdGFyZ2V0TGVuZ3RoOiBudW1iZXIsIHBhZFN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIC8qIHRzbGludDpkaXNhYmxlICovXHJcbiAgICB0YXJnZXRMZW5ndGggPSB0YXJnZXRMZW5ndGggPj4gMDsgLy90cnVuY2F0ZSBpZiBudW1iZXIgb3IgY29udmVydCBub24tbnVtYmVyIHRvIDA7XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXHJcbiAgICBwYWRTdHJpbmcgPSBTdHJpbmcodHlwZW9mIHBhZFN0cmluZyAhPT0gJ3VuZGVmaW5lZCcgPyBwYWRTdHJpbmcgOiAnICcpO1xyXG4gICAgaWYgKHRhcmdldC5sZW5ndGggPiB0YXJnZXRMZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIFN0cmluZyh0YXJnZXQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGFyZ2V0TGVuZ3RoID0gdGFyZ2V0TGVuZ3RoIC0gdGFyZ2V0Lmxlbmd0aDtcclxuICAgICAgaWYgKHRhcmdldExlbmd0aCA+IHBhZFN0cmluZy5sZW5ndGgpIHtcclxuICAgICAgICBwYWRTdHJpbmcgKz0gcGFkU3RyaW5nLnJlcGVhdCh0YXJnZXRMZW5ndGggLyBwYWRTdHJpbmcubGVuZ3RoKTsgLy9hcHBlbmQgdG8gb3JpZ2luYWwgdG8gZW5zdXJlIHdlIGFyZSBsb25nZXIgdGhhbiBuZWVkZWRcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcGFkU3RyaW5nLnNsaWNlKDAsIHRhcmdldExlbmd0aCkgKyBTdHJpbmcodGFyZ2V0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIHBhZEVuZCh0YXJnZXQ6IHN0cmluZywgdGFyZ2V0TGVuZ3RoOiBudW1iZXIsIHBhZFN0cmluZzogc3RyaW5nKTogc3RyaW5ne1xyXG4gICAgLyogdHNsaW50OmRpc2FibGUgKi9cclxuICAgIHRhcmdldExlbmd0aCA9IHRhcmdldExlbmd0aCA+PiAwOyAvL2Zsb29yIGlmIG51bWJlciBvciBjb252ZXJ0IG5vbi1udW1iZXIgdG8gMDtcclxuICAgIC8qIHRzbGludDplbmFibGUgKi9cclxuICAgIHBhZFN0cmluZyA9IFN0cmluZyh0eXBlb2YgcGFkU3RyaW5nICE9PSAndW5kZWZpbmVkJyA/IHBhZFN0cmluZyA6ICcgJyk7XHJcbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCA+IHRhcmdldExlbmd0aCkge1xyXG4gICAgICByZXR1cm4gU3RyaW5nKHRhcmdldCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0YXJnZXRMZW5ndGggPSB0YXJnZXRMZW5ndGggLSB0YXJnZXQubGVuZ3RoO1xyXG4gICAgICBpZiAodGFyZ2V0TGVuZ3RoID4gcGFkU3RyaW5nLmxlbmd0aCkge1xyXG4gICAgICAgIHBhZFN0cmluZyArPSBwYWRTdHJpbmcucmVwZWF0KHRhcmdldExlbmd0aCAvIHBhZFN0cmluZy5sZW5ndGgpOyAvL2FwcGVuZCB0byBvcmlnaW5hbCB0byBlbnN1cmUgd2UgYXJlIGxvbmdlciB0aGFuIG5lZWRlZFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBTdHJpbmcodGFyZ2V0KSArIHBhZFN0cmluZy5zbGljZSgwLCB0YXJnZXRMZW5ndGgpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIl19