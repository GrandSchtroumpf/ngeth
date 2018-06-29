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
var EncodedParam = /** @class */ (function () {
    function EncodedParam(head, tail) {
        if (head === void 0) { head = ''; }
        if (tail === void 0) { tail = ''; }
        this.head = head;
        this.tail = tail;
    }
    return EncodedParam;
}());
export { EncodedParam };
function EncodedParam_tsickle_Closure_declarations() {
    /** @type {?} */
    EncodedParam.prototype.head;
    /** @type {?} */
    EncodedParam.prototype.tail;
}
var ABIEncoder = /** @class */ (function () {
    function ABIEncoder() {
    }
    /**
     * Encode the constructor method for deploying
     * @param {?} constructor The constructor param defined in the ABI
     * @param {?} bytes The content of the contract
     * @param {?=} args The arguments to pass into the constructor if any
     * @return {?}
     */
    ABIEncoder.prototype.encodeConstructor = /**
     * Encode the constructor method for deploying
     * @param {?} constructor The constructor param defined in the ABI
     * @param {?} bytes The content of the contract
     * @param {?=} args The arguments to pass into the constructor if any
     * @return {?}
     */
    function (constructor, bytes, args) {
        var /** @type {?} */ encoded = this.encodeInputs(args, constructor.inputs);
        return bytes + encoded.head + encoded.tail;
    };
    /**
     * Encode the whole method
     * @param {?} method
     * @param {?} args The list of arguments given by the user
     * @return {?}
     */
    ABIEncoder.prototype.encodeMethod = /**
     * Encode the whole method
     * @param {?} method
     * @param {?} args The list of arguments given by the user
     * @return {?}
     */
    function (method, args) {
        // Create and sign method
        var name = method.name, inputs = method.inputs;
        var /** @type {?} */ signature = this.signMethod(method);
        var /** @type {?} */ hashSign = keccak256(signature).slice(0, 10);
        // Create the encoded arguments
        var /** @type {?} */ encoded = this.encodeInputs(args, inputs);
        return hashSign + encoded.head + encoded.tail;
    };
    /**
     * Encode an event
     * @param {?} event The event to encode
     * @return {?}
     */
    ABIEncoder.prototype.encodeEvent = /**
     * Encode an event
     * @param {?} event The event to encode
     * @return {?}
     */
    function (event) {
        var name = event.name, inputs = event.inputs;
        var /** @type {?} */ signature = this.signMethod(event);
        return keccak256(signature);
    };
    /**
     * Create a string for the signature based on the params in the ABI
     * @param {?} inputs
     * @return {?}
     */
    ABIEncoder.prototype.signInputs = /**
     * Create a string for the signature based on the params in the ABI
     * @param {?} inputs
     * @return {?}
     */
    function (inputs) {
        var _this = this;
        return inputs
            .map(function (input) { return input.components ? _this.tupleType(input) : input.type; })
            .join(',');
    };
    /**
     * Return the type of a tuple needed for the signature
     * @param {?} tuple
     * @return {?}
     */
    ABIEncoder.prototype.tupleType = /**
     * Return the type of a tuple needed for the signature
     * @param {?} tuple
     * @return {?}
     */
    function (tuple) {
        var /** @type {?} */ innerTypes = this.signInputs(tuple.components);
        var /** @type {?} */ arrayPart = tuple.type.substr(5);
        return "(" + innerTypes + ")" + arrayPart;
    };
    /**
     * Sign a specific method based on the ABI
     * @param {?} method
     * @return {?}
     */
    ABIEncoder.prototype.signMethod = /**
     * Sign a specific method based on the ABI
     * @param {?} method
     * @return {?}
     */
    function (method) {
        var name = method.name, inputs = method.inputs;
        var /** @type {?} */ types = this.signInputs(inputs);
        return name + "(" + types + ")";
    };
    /**
     * Map to the right encoder depending on the type
     * @param {?} arg the arg of the input
     * @param {?} input the input defined in the ABI
     * @return {?}
     */
    ABIEncoder.prototype.encode = /**
     * Map to the right encoder depending on the type
     * @param {?} arg the arg of the input
     * @param {?} input the input defined in the ABI
     * @return {?}
     */
    function (arg, input) {
        var /** @type {?} */ type = input.type;
        // Compare true with the result of the cases
        switch (true) {
            // Array: Must be first
            case /\[([0-9]*)\]/.test(type): {
                return this.encodeArray(arg, input);
            }
            // Tuple
            case /tuple?/.test(type): {
                // Get args given as an object
                var /** @type {?} */ args = Object.keys(arg).map(function (key) { return arg[key]; });
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
    };
    /**
     * Encode a list of inputs
     * @param {?} args The arguments given by the users
     * @param {?} inputs The inputs defined in the ABI
     * @return {?}
     */
    ABIEncoder.prototype.encodeInputs = /**
     * Encode a list of inputs
     * @param {?} args The arguments given by the users
     * @param {?} inputs The inputs defined in the ABI
     * @return {?}
     */
    function (args, inputs) {
        var _this = this;
        var /** @type {?} */ offset = args.length * 64;
        var /** @type {?} */ init = new EncodedParam();
        return inputs.reduce(function (prev, input, i) {
            var /** @type {?} */ encoded = _this.encode(args[i], input);
            var /** @type {?} */ suboffset = (offset + prev.tail.length) / 2;
            if (isStatic(input)) {
                return new EncodedParam(prev.head + encoded, prev.tail);
            }
            else {
                var /** @type {?} */ head = numberToHex(suboffset).replace('0x', '');
                head = _this.padStart(head, 64, '0');
                return new EncodedParam(prev.head + head, prev.tail + encoded);
            }
        }, init);
    };
    /**
     * Encode an array
     * @param {?} args The argument given by the user for this array
     * @param {?} input The input defined in the ABI
     * @return {?}
     */
    ABIEncoder.prototype.encodeArray = /**
     * Encode an array
     * @param {?} args The argument given by the user for this array
     * @param {?} input The input defined in the ABI
     * @return {?}
     */
    function (args, input) {
        if (args.length === 0) {
            throw new Error("No arguments found in array " + input.name);
        }
        var /** @type {?} */ encoded = '';
        if (!isFixedArray(input.type)) {
            encoded = numberToHex(args.length).replace('0x', '');
            encoded = this.padStart(encoded, 64, '0');
        }
        else if (args.length !== fixedArraySize(input.type)) {
            throw new Error(args + " should be of size " + fixedArraySize(input.type));
        }
        var /** @type {?} */ inputs = paramFromArray(args.length, input);
        var _a = this.encodeInputs(args, inputs), head = _a.head, tail = _a.tail;
        return encoded + head + tail;
    };
    /**
     * Encode the tuple
     * @param {?} args Arguments of this tuple
     * @param {?} inputs Inputs defined in the ABI
     * @return {?}
     */
    ABIEncoder.prototype.encodeTuple = /**
     * Encode the tuple
     * @param {?} args Arguments of this tuple
     * @param {?} inputs Inputs defined in the ABI
     * @return {?}
     */
    function (args, inputs) {
        var _a = this.encodeInputs(args, inputs), head = _a.head, tail = _a.tail;
        return head + tail;
    };
    /**
     * Encode a string
     * @param {?} arg
     * @return {?}
     */
    ABIEncoder.prototype.encodeString = /**
     * Encode a string
     * @param {?} arg
     * @return {?}
     */
    function (arg) {
        if (typeof arg !== 'string') {
            throw new Error("Argument " + arg + " should be a string");
        }
        var /** @type {?} */ hex = utf8ToHex(arg).replace('0x', '');
        var /** @type {?} */ size = numberToHex(arg.length).replace('0x', '');
        var /** @type {?} */ hexSize = hex.length + 64 - (hex.length % 64);
        return this.padStart(size, 64, '0') + this.padStart(hex, hexSize, '0');
    };
    /**
     * Encode a dynamic bytes
     * \@example bytes
     * @param {?} arg
     * @return {?}
     */
    ABIEncoder.prototype.encodeDynamicBytes = /**
     * Encode a dynamic bytes
     * \@example bytes
     * @param {?} arg
     * @return {?}
     */
    function (arg) {
        if (typeof arg !== 'string') {
            throw new Error("Argument " + arg + " should be a string");
        }
        var /** @type {?} */ hex = arg.replace('0x', '');
        var /** @type {?} */ size = numberToHex(hex.length / 2).replace('0x', '');
        var /** @type {?} */ hexSize = hex.length + 64 - (hex.length % 64);
        return this.padStart(size, 64, '0') + this.padEnd(hex, hexSize, '0');
    };
    /**
     * Encode a static bytes
     * \@example bytes3, bytes32
     * @param {?} arg
     * @return {?}
     */
    ABIEncoder.prototype.encodeStaticBytes = /**
     * Encode a static bytes
     * \@example bytes3, bytes32
     * @param {?} arg
     * @return {?}
     */
    function (arg) {
        if (typeof arg !== 'string' && typeof arg !== 'number') {
            throw new Error("Argument " + arg + " should be a string or number");
        }
        if (typeof arg === 'number') {
            arg = arg.toString(16);
        }
        var /** @type {?} */ result = arg.replace('0x', '');
        return this.padEnd(result, 46, '0');
    };
    /**
     * Encode int or uint
     * \@example int, int32, uint256
     * @param {?} arg
     * @param {?} input
     * @return {?}
     */
    ABIEncoder.prototype.encodeInt = /**
     * Encode int or uint
     * \@example int, int32, uint256
     * @param {?} arg
     * @param {?} input
     * @return {?}
     */
    function (arg, input) {
        if (typeof arg !== 'number') {
            throw new Error("Argument " + arg + " should be a number");
        }
        if (arg % 1 !== 0) {
            throw new Error('Only provider integers, Solidity does not manage floats');
        }
        if (input.type.includes('uint') && arg < 0) {
            throw new Error("\"uint\" cannot be negative at value " + arg);
        }
        return toBN(arg).toTwos(256).toString(16, 64);
    };
    /**
     * Encode an address
     * @param {?} arg
     * @return {?}
     */
    ABIEncoder.prototype.encodeAddress = /**
     * Encode an address
     * @param {?} arg
     * @return {?}
     */
    function (arg) {
        if (typeof arg !== 'string' && typeof arg !== 'number') {
            throw new Error("Argument " + arg + " should be a string or number");
        }
        if (typeof arg === 'number') {
            arg = arg.toString(16);
        }
        var /** @type {?} */ result = arg.replace('0x', '');
        return this.padStart(result, 64, '0');
    };
    /**
     * Encode a boolean
     * @param {?} arg
     * @return {?}
     */
    ABIEncoder.prototype.encodeBool = /**
     * Encode a boolean
     * @param {?} arg
     * @return {?}
     */
    function (arg) {
        if (typeof arg !== 'boolean') {
            throw new Error("Argument " + arg + " should be a boolean");
        }
        return arg ? this.padStart('1', 64, '0') : this.padStart('0', 64, '0');
    };
    /**
     *
     * PadStart / PadEnd
     * @param {?} target
     * @param {?} targetLength
     * @param {?} padString
     * @return {?}
     */
    ABIEncoder.prototype.padStart = /**
     *
     * PadStart / PadEnd
     * @param {?} target
     * @param {?} targetLength
     * @param {?} padString
     * @return {?}
     */
    function (target, targetLength, padString) {
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
    };
    ;
    /**
     * @param {?} target
     * @param {?} targetLength
     * @param {?} padString
     * @return {?}
     */
    ABIEncoder.prototype.padEnd = /**
     * @param {?} target
     * @param {?} targetLength
     * @param {?} padString
     * @return {?}
     */
    function (target, targetLength, padString) {
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
    };
    ;
    ABIEncoder.decorators = [
        { type: Injectable, args: [{ providedIn: ContractModule },] },
    ];
    /** @nocollapse */
    ABIEncoder.ctorParameters = function () { return []; };
    /** @nocollapse */ ABIEncoder.ngInjectableDef = i0.defineInjectable({ factory: function ABIEncoder_Factory() { return new ABIEncoder(); }, token: ABIEncoder, providedIn: i1.ContractModule });
    return ABIEncoder;
}());
export { ABIEncoder };
function ABIEncoder_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ABIEncoder.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ABIEncoder.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2Rlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC9jb250cmFjdC8iLCJzb3VyY2VzIjpbImxpYi9hYmkvZW5jb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQVksV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQWlCLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNoRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBRWpGLElBQUE7SUFDRSxzQkFBbUIsSUFBaUIsRUFBUyxJQUFTO3dDQUFsQjt3Q0FBa0I7UUFBbkMsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFTLFNBQUksR0FBSixJQUFJLENBQUs7S0FBSTt1QkFONUQ7SUFPQyxDQUFBO0FBRkQsd0JBRUM7Ozs7Ozs7O0lBSUM7S0FBZ0I7Ozs7Ozs7O0lBUVQsc0NBQWlCOzs7Ozs7O2NBQ3RCLFdBQTBCLEVBQzFCLEtBQWEsRUFDYixJQUFZO1FBRVoscUJBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzs7Ozs7Ozs7SUFRdEMsaUNBQVk7Ozs7OztjQUFDLE1BQXFCLEVBQUUsSUFBVzs7UUFFNUMsSUFBQSxrQkFBSSxFQUFFLHNCQUFNLENBQVk7UUFDaEMscUJBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMscUJBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFL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QztTQUMxRDs7SUFDRixDQUFDOzs7Ozs7O0lBRU0sMkJBQU07Ozs7OztjQUFDLE1BQWMsRUFBRSxZQUFvQixFQUFFLFNBQWlCOztRQUVwRSxZQUFZLEdBQUcsWUFBWSxJQUFJLENBQUMsQ0FBQzs7UUFFakMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkI7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFlBQVksR0FBRyxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDaEU7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzFEOztJQUNGLENBQUM7O2dCQTdTSCxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFOzs7OztxQkFUMUM7O1NBVWEsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQUJJSW5wdXQsIG51bWJlclRvSGV4LCB1dGY4VG9IZXgsIHRvQk4sIEFCSURlZmluaXRpb24sIGtlY2NhazI1NiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IENvbnRyYWN0TW9kdWxlIH0gZnJvbSAnLi4vY29udHJhY3QubW9kdWxlJztcclxuaW1wb3J0IHsgaXNTdGF0aWMsIGlzRml4ZWRBcnJheSwgcGFyYW1Gcm9tQXJyYXksIGZpeGVkQXJyYXlTaXplIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5leHBvcnQgY2xhc3MgRW5jb2RlZFBhcmFtIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaGVhZDogc3RyaW5nID0gJycsIHB1YmxpYyB0YWlsID0gJycpIHt9XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogQ29udHJhY3RNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEFCSUVuY29kZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIHRoZSBjb25zdHJ1Y3RvciBtZXRob2QgZm9yIGRlcGxveWluZ1xyXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RvciBUaGUgY29uc3RydWN0b3IgcGFyYW0gZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICogQHBhcmFtIGJ5dGVzIFRoZSBjb250ZW50IG9mIHRoZSBjb250cmFjdFxyXG4gICAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gcGFzcyBpbnRvIHRoZSBjb25zdHJ1Y3RvciBpZiBhbnlcclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlQ29uc3RydWN0b3IoXHJcbiAgICBjb25zdHJ1Y3RvcjogQUJJRGVmaW5pdGlvbixcclxuICAgIGJ5dGVzOiBzdHJpbmcsXHJcbiAgICBhcmdzPzogYW55W11cclxuICApIHtcclxuICAgIGNvbnN0IGVuY29kZWQgPSB0aGlzLmVuY29kZUlucHV0cyhhcmdzLCBjb25zdHJ1Y3Rvci5pbnB1dHMpO1xyXG4gICAgcmV0dXJuIGJ5dGVzICsgZW5jb2RlZC5oZWFkICsgZW5jb2RlZC50YWlsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIHRoZSB3aG9sZSBtZXRob2RcclxuICAgKiBAcGFyYW0gbWVodG9kIFRoZSBtZXRob2QgdGhlIGVuY29kZSBoYXMgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICogQHBhcmFtIGFyZ3MgVGhlIGxpc3Qgb2YgYXJndW1lbnRzIGdpdmVuIGJ5IHRoZSB1c2VyXHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZU1ldGhvZChtZXRob2Q6IEFCSURlZmluaXRpb24sIGFyZ3M6IGFueVtdKSB7XHJcbiAgICAvLyBDcmVhdGUgYW5kIHNpZ24gbWV0aG9kXHJcbiAgICBjb25zdCB7IG5hbWUsIGlucHV0cyB9ID0gbWV0aG9kO1xyXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gdGhpcy5zaWduTWV0aG9kKG1ldGhvZCk7XHJcbiAgICBjb25zdCBoYXNoU2lnbiA9IGtlY2NhazI1NihzaWduYXR1cmUpLnNsaWNlKDAsIDEwKTtcclxuXHJcbiAgICAvLyBDcmVhdGUgdGhlIGVuY29kZWQgYXJndW1lbnRzXHJcbiAgICBjb25zdCBlbmNvZGVkID0gdGhpcy5lbmNvZGVJbnB1dHMoYXJncywgaW5wdXRzKTtcclxuICAgIHJldHVybiBoYXNoU2lnbiArIGVuY29kZWQuaGVhZCArIGVuY29kZWQudGFpbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBhbiBldmVudFxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gZW5jb2RlXHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZUV2ZW50KGV2ZW50OiBBQklEZWZpbml0aW9uKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgaW5wdXRzIH0gPSBldmVudDtcclxuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHRoaXMuc2lnbk1ldGhvZChldmVudCk7XHJcbiAgICByZXR1cm4ga2VjY2FrMjU2KHNpZ25hdHVyZSk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqKioqKioqKioqKioqKiogU0lHTkFUVVJFICoqKioqKioqKioqKioqKioqXHJcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIHN0cmluZyBmb3IgdGhlIHNpZ25hdHVyZSBiYXNlZCBvbiB0aGUgcGFyYW1zIGluIHRoZSBBQklcclxuICAgKiBAcGFyYW0gcGFyYW1zIFRoZSBwYXJhbXMgZ2l2ZW4gYnkgdGhlIEFCSS5cclxuICAgKi9cclxuICBwcml2YXRlIHNpZ25JbnB1dHMoaW5wdXRzOiBBQklJbnB1dFtdKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBpbnB1dHNcclxuICAgICAgLm1hcChpbnB1dCA9PiBpbnB1dC5jb21wb25lbnRzID8gdGhpcy50dXBsZVR5cGUoaW5wdXQpIDogaW5wdXQudHlwZSlcclxuICAgICAgLmpvaW4oJywnKTtcclxuICB9XHJcblxyXG4gIC8qKiBSZXR1cm4gdGhlIHR5cGUgb2YgYSB0dXBsZSBuZWVkZWQgZm9yIHRoZSBzaWduYXR1cmUgKi9cclxuICBwcml2YXRlIHR1cGxlVHlwZSh0dXBsZTogQUJJSW5wdXQpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgaW5uZXJUeXBlcyA9IHRoaXMuc2lnbklucHV0cyh0dXBsZS5jb21wb25lbnRzKTtcclxuICAgIGNvbnN0IGFycmF5UGFydCA9IHR1cGxlLnR5cGUuc3Vic3RyKDUpO1xyXG4gICAgcmV0dXJuIGAoJHtpbm5lclR5cGVzfSkke2FycmF5UGFydH1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIHNwZWNpZmljIG1ldGhvZCBiYXNlZCBvbiB0aGUgQUJJXHJcbiAgICogQHBhcmFtIG1laHRvZCBUaGUgbWV0aG9kIHRoZSBlbmNvZGUgaGFzIGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2lnbk1ldGhvZChtZXRob2Q6IEFCSURlZmluaXRpb24pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgeyBuYW1lLCBpbnB1dHMgfSA9IG1ldGhvZDtcclxuICAgIGNvbnN0IHR5cGVzID0gdGhpcy5zaWduSW5wdXRzKGlucHV0cyk7XHJcbiAgICByZXR1cm4gYCR7bmFtZX0oJHt0eXBlc30pYDtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICoqKioqKioqKioqKioqKiogRU5DT0RFICoqKioqKioqKioqKioqKioqKipcclxuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogTWFwIHRvIHRoZSByaWdodCBlbmNvZGVyIGRlcGVuZGluZyBvbiB0aGUgdHlwZVxyXG4gICAqIEBwYXJhbSBhcmcgdGhlIGFyZyBvZiB0aGUgaW5wdXRcclxuICAgKiBAcGFyYW0gaW5wdXQgdGhlIGlucHV0IGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGUoYXJnOiBhbnksIGlucHV0OiBBQklJbnB1dCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCB0eXBlID0gaW5wdXQudHlwZTtcclxuICAgIC8vIENvbXBhcmUgdHJ1ZSB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIGNhc2VzXHJcbiAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgLy8gQXJyYXk6IE11c3QgYmUgZmlyc3RcclxuICAgICAgY2FzZSAvXFxbKFswLTldKilcXF0vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVBcnJheShhcmcsIGlucHV0KTtcclxuICAgICAgfVxyXG4gICAgICAvLyBUdXBsZVxyXG4gICAgICBjYXNlIC90dXBsZT8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICAvLyBHZXQgYXJncyBnaXZlbiBhcyBhbiBvYmplY3RcclxuICAgICAgICBjb25zdCBhcmdzID0gT2JqZWN0LmtleXMoYXJnKS5tYXAoa2V5ID0+IGFyZ1trZXldKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVUdXBsZShhcmdzLCBpbnB1dC5jb21wb25lbnRzKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBTdHJpbmdcclxuICAgICAgY2FzZSAvc3RyaW5nPy8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZVN0cmluZyhhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIER5bmFtaWMgQnl0ZXNcclxuICAgICAgY2FzZSAvYnl0ZXM/XFxiLy50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlRHluYW1pY0J5dGVzKGFyZyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gU3RhdGljIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2J5dGVzPy8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZVN0YXRpY0J5dGVzKGFyZyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gSW50IC8gVWludFxyXG4gICAgICBjYXNlIC9pbnQ/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlSW50KGFyZywgaW5wdXQpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEFkZHJlc3NcclxuICAgICAgY2FzZSAvYWRkcmVzcz8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVBZGRyZXNzKGFyZyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gQm9vbFxyXG4gICAgICBjYXNlIC9ib29sPy8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUJvb2woYXJnKTtcclxuICAgICAgfVxyXG4gICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmluZCB0aGUgZW5jb2RlciBmb3IgdGhlIHR5cGUgOiAnICsgdHlwZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqXHJcbiAgICogU1RBVElDIE9SIERZTkFNSUNcclxuICAgKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGEgbGlzdCBvZiBpbnB1dHNcclxuICAgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnRzIGdpdmVuIGJ5IHRoZSB1c2Vyc1xyXG4gICAqIEBwYXJhbSBpbnB1dHMgVGhlIGlucHV0cyBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlSW5wdXRzKGFyZ3M6IGFueVtdLCBpbnB1dHM6IEFCSUlucHV0W10pOiBFbmNvZGVkUGFyYW0ge1xyXG4gICAgY29uc3Qgb2Zmc2V0ID0gYXJncy5sZW5ndGggKiA2NDtcclxuICAgIGNvbnN0IGluaXQgPSBuZXcgRW5jb2RlZFBhcmFtKCk7XHJcbiAgICByZXR1cm4gaW5wdXRzLnJlZHVjZShcclxuICAgICAgKHByZXY6IEVuY29kZWRQYXJhbSwgaW5wdXQ6IEFCSUlucHV0LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBlbmNvZGVkID0gdGhpcy5lbmNvZGUoYXJnc1tpXSwgaW5wdXQpXHJcbiAgICAgICAgY29uc3Qgc3Vib2Zmc2V0ID0gKG9mZnNldCArIHByZXYudGFpbC5sZW5ndGgpIC8gMjtcclxuICAgICAgICBpZiAoaXNTdGF0aWMoaW5wdXQpKSB7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IEVuY29kZWRQYXJhbShwcmV2LmhlYWQgKyBlbmNvZGVkLCBwcmV2LnRhaWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgaGVhZCA9IG51bWJlclRvSGV4KHN1Ym9mZnNldCkucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICAgICAgICBoZWFkID0gdGhpcy5wYWRTdGFydChoZWFkLCA2NCwgJzAnKTtcclxuICAgICAgICAgIHJldHVybiBuZXcgRW5jb2RlZFBhcmFtKHByZXYuaGVhZCArIGhlYWQsIHByZXYudGFpbCArIGVuY29kZWQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBpbml0XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGFuIGFycmF5XHJcbiAgICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50IGdpdmVuIGJ5IHRoZSB1c2VyIGZvciB0aGlzIGFycmF5XHJcbiAgICogQHBhcmFtIGlucHV0IFRoZSBpbnB1dCBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZUFycmF5KGFyZ3M6IGFueVtdLCBpbnB1dDogQUJJSW5wdXQpOiBzdHJpbmcge1xyXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gYXJndW1lbnRzIGZvdW5kIGluIGFycmF5ICR7aW5wdXQubmFtZX1gKTtcclxuICAgIH1cclxuICAgIGxldCBlbmNvZGVkID0gJyc7XHJcbiAgICBpZiAoIWlzRml4ZWRBcnJheShpbnB1dC50eXBlKSkge1xyXG4gICAgICBlbmNvZGVkID0gbnVtYmVyVG9IZXgoYXJncy5sZW5ndGgpLnJlcGxhY2UoJzB4JywgJycpXHJcbiAgICAgIGVuY29kZWQgPSB0aGlzLnBhZFN0YXJ0KGVuY29kZWQsIDY0LCAnMCcpO1xyXG4gICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCAhPT0gZml4ZWRBcnJheVNpemUoaW5wdXQudHlwZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2FyZ3N9IHNob3VsZCBiZSBvZiBzaXplICR7Zml4ZWRBcnJheVNpemUoaW5wdXQudHlwZSl9YCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpbnB1dHMgPSBwYXJhbUZyb21BcnJheShhcmdzLmxlbmd0aCwgaW5wdXQpO1xyXG4gICAgY29uc3QgeyBoZWFkLCB0YWlsIH0gPSB0aGlzLmVuY29kZUlucHV0cyhhcmdzLCBpbnB1dHMpO1xyXG4gICAgcmV0dXJuIGVuY29kZWQgKyBoZWFkICsgdGFpbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSB0aGUgdHVwbGVcclxuICAgKiBAcGFyYW0gYXJncyBBcmd1bWVudHMgb2YgdGhpcyB0dXBsZVxyXG4gICAqIEBwYXJhbSBpbnB1dHMgSW5wdXRzIGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5jb2RlVHVwbGUoYXJnczogYW55W10sIGlucHV0czogQUJJSW5wdXRbXSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCB7IGhlYWQsIHRhaWwgfSA9IHRoaXMuZW5jb2RlSW5wdXRzKGFyZ3MsIGlucHV0cyk7XHJcbiAgICByZXR1cm4gaGVhZCArIHRhaWw7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqXHJcbiAgICogRFlOQU1JQ1xyXG4gICAqKioqKioqKiovXHJcblxyXG4gIC8qKiBFbmNvZGUgYSBzdHJpbmcgKi9cclxuICBwcml2YXRlIGVuY29kZVN0cmluZyhhcmc6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgc3RyaW5nYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBoZXggPSB1dGY4VG9IZXgoYXJnKS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIGNvbnN0IHNpemUgPSBudW1iZXJUb0hleChhcmcubGVuZ3RoKS5yZXBsYWNlKCcweCcsICcnKVxyXG4gICAgY29uc3QgaGV4U2l6ZSA9IGhleC5sZW5ndGggKyA2NCAtIChoZXgubGVuZ3RoICUgNjQpO1xyXG4gICAgcmV0dXJuIHRoaXMucGFkU3RhcnQoc2l6ZSwgNjQsICcwJykgKyB0aGlzLnBhZFN0YXJ0KGhleCwgaGV4U2l6ZSwgJzAnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBhIGR5bmFtaWMgYnl0ZXNcclxuICAgKiBAZXhhbXBsZSBieXRlc1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5jb2RlRHluYW1pY0J5dGVzKGFyZzogc3RyaW5nKSB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgc3RyaW5nYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBoZXggPSBhcmcucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICBjb25zdCBzaXplID0gbnVtYmVyVG9IZXgoaGV4Lmxlbmd0aCAvIDIpLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgY29uc3QgaGV4U2l6ZSA9IGhleC5sZW5ndGggKyA2NCAtIChoZXgubGVuZ3RoICUgNjQpO1xyXG4gICAgcmV0dXJuIHRoaXMucGFkU3RhcnQoc2l6ZSwgNjQsICcwJykgKyB0aGlzLnBhZEVuZChoZXgsIGhleFNpemUsICcwJyk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKipcclxuICAgKiBTVEFUSUNcclxuICAgKioqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBhIHN0YXRpYyBieXRlc1xyXG4gICAqIEBleGFtcGxlIGJ5dGVzMywgYnl0ZXMzMlxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5jb2RlU3RhdGljQnl0ZXMoYXJnOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgYXJnICE9PSAnbnVtYmVyJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBzdHJpbmcgb3IgbnVtYmVyYCk7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHsgYXJnID0gYXJnLnRvU3RyaW5nKDE2KTsgfVxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXJnLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgcmV0dXJuIHRoaXMucGFkRW5kKHJlc3VsdCwgNDYsICcwJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgaW50IG9yIHVpbnRcclxuICAgKiBAZXhhbXBsZSBpbnQsIGludDMyLCB1aW50MjU2XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVJbnQoYXJnOiBudW1iZXIsIGlucHV0OiBBQklJbnB1dCkge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIG51bWJlcmApO1xyXG4gICAgfVxyXG4gICAgaWYgKGFyZyAlIDEgIT09IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IHByb3ZpZGVyIGludGVnZXJzLCBTb2xpZGl0eSBkb2VzIG5vdCBtYW5hZ2UgZmxvYXRzJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5wdXQudHlwZS5pbmNsdWRlcygndWludCcpICYmIGFyZyA8IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcInVpbnRcIiBjYW5ub3QgYmUgbmVnYXRpdmUgYXQgdmFsdWUgJHthcmd9YClcclxuICAgIH1cclxuICAgIHJldHVybiB0b0JOKGFyZykudG9Ud29zKDI1NikudG9TdHJpbmcoMTYsIDY0KTtcclxuICB9XHJcblxyXG4gIC8qKiBFbmNvZGUgYW4gYWRkcmVzcyAqL1xyXG4gIHByaXZhdGUgZW5jb2RlQWRkcmVzcyhhcmc6IHN0cmluZyB8IG51bWJlcikge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBhcmcgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIHN0cmluZyBvciBudW1iZXJgKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykgeyBhcmcgPSBhcmcudG9TdHJpbmcoMTYpOyB9XHJcbiAgICBjb25zdCByZXN1bHQgPSBhcmcucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICByZXR1cm4gdGhpcy5wYWRTdGFydChyZXN1bHQsIDY0LCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEVuY29kZSBhIGJvb2xlYW4gKi9cclxuICBwcml2YXRlIGVuY29kZUJvb2woYXJnOiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnYm9vbGVhbicpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgYm9vbGVhbmApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyZyA/IHRoaXMucGFkU3RhcnQoJzEnLCA2NCwgJzAnKSA6IHRoaXMucGFkU3RhcnQoJzAnLCA2NCwgJzAnKTtcclxuICB9XHJcblxyXG4gIC8qKipcclxuICAgKiBQYWRTdGFydCAvIFBhZEVuZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgcGFkU3RhcnQodGFyZ2V0OiBzdHJpbmcsIHRhcmdldExlbmd0aDogbnVtYmVyLCBwYWRTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG4gICAgdGFyZ2V0TGVuZ3RoID0gdGFyZ2V0TGVuZ3RoID4+IDA7IC8vdHJ1bmNhdGUgaWYgbnVtYmVyIG9yIGNvbnZlcnQgbm9uLW51bWJlciB0byAwO1xyXG4gICAgLyogdHNsaW50OmVuYWJsZSAqL1xyXG4gICAgcGFkU3RyaW5nID0gU3RyaW5nKHR5cGVvZiBwYWRTdHJpbmcgIT09ICd1bmRlZmluZWQnID8gcGFkU3RyaW5nIDogJyAnKTtcclxuICAgIGlmICh0YXJnZXQubGVuZ3RoID4gdGFyZ2V0TGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBTdHJpbmcodGFyZ2V0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRhcmdldExlbmd0aCA9IHRhcmdldExlbmd0aCAtIHRhcmdldC5sZW5ndGg7XHJcbiAgICAgIGlmICh0YXJnZXRMZW5ndGggPiBwYWRTdHJpbmcubGVuZ3RoKSB7XHJcbiAgICAgICAgcGFkU3RyaW5nICs9IHBhZFN0cmluZy5yZXBlYXQodGFyZ2V0TGVuZ3RoIC8gcGFkU3RyaW5nLmxlbmd0aCk7IC8vYXBwZW5kIHRvIG9yaWdpbmFsIHRvIGVuc3VyZSB3ZSBhcmUgbG9uZ2VyIHRoYW4gbmVlZGVkXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHBhZFN0cmluZy5zbGljZSgwLCB0YXJnZXRMZW5ndGgpICsgU3RyaW5nKHRhcmdldCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwYWRFbmQodGFyZ2V0OiBzdHJpbmcsIHRhcmdldExlbmd0aDogbnVtYmVyLCBwYWRTdHJpbmc6IHN0cmluZyk6IHN0cmluZ3tcclxuICAgIC8qIHRzbGludDpkaXNhYmxlICovXHJcbiAgICB0YXJnZXRMZW5ndGggPSB0YXJnZXRMZW5ndGggPj4gMDsgLy9mbG9vciBpZiBudW1iZXIgb3IgY29udmVydCBub24tbnVtYmVyIHRvIDA7XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXHJcbiAgICBwYWRTdHJpbmcgPSBTdHJpbmcodHlwZW9mIHBhZFN0cmluZyAhPT0gJ3VuZGVmaW5lZCcgPyBwYWRTdHJpbmcgOiAnICcpO1xyXG4gICAgaWYgKHRhcmdldC5sZW5ndGggPiB0YXJnZXRMZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIFN0cmluZyh0YXJnZXQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGFyZ2V0TGVuZ3RoID0gdGFyZ2V0TGVuZ3RoIC0gdGFyZ2V0Lmxlbmd0aDtcclxuICAgICAgaWYgKHRhcmdldExlbmd0aCA+IHBhZFN0cmluZy5sZW5ndGgpIHtcclxuICAgICAgICBwYWRTdHJpbmcgKz0gcGFkU3RyaW5nLnJlcGVhdCh0YXJnZXRMZW5ndGggLyBwYWRTdHJpbmcubGVuZ3RoKTsgLy9hcHBlbmQgdG8gb3JpZ2luYWwgdG8gZW5zdXJlIHdlIGFyZSBsb25nZXIgdGhhbiBuZWVkZWRcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gU3RyaW5nKHRhcmdldCkgKyBwYWRTdHJpbmcuc2xpY2UoMCwgdGFyZ2V0TGVuZ3RoKTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcbiJdfQ==