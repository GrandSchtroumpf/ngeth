/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { BN } from 'bn.js';
import { Injectable } from '@angular/core';
import { ContractModule } from './../contract.module';
import { isStatic, isFixedArray, fixedArraySize, paramFromArray, isStaticTuple, isStaticArray } from './utils';
import { hexToNumber, hexToUtf8, hexToNumberString, toChecksumAddress } from '@ngeth/utils';
import * as i0 from "@angular/core";
import * as i1 from "../contract.module";
var DecodedParam = /** @class */ (function () {
    function DecodedParam(result, offset) {
        this.result = result;
        this.offset = offset;
    }
    return DecodedParam;
}());
export { DecodedParam };
function DecodedParam_tsickle_Closure_declarations() {
    /** @type {?} */
    DecodedParam.prototype.result;
    /** @type {?} */
    DecodedParam.prototype.offset;
}
var ABIDecoder = /** @class */ (function () {
    function ABIDecoder() {
    }
    /**
     * Decode an event output
     * @param {?} topics The topics of the logs (indexed values)
     * @param {?} data The data of the logs (bytes)
     * @param {?} inputs The inputs givent by the ABI
     * @return {?}
     */
    ABIDecoder.prototype.decodeEvent = /**
     * Decode an event output
     * @param {?} topics The topics of the logs (indexed values)
     * @param {?} data The data of the logs (bytes)
     * @param {?} inputs The inputs givent by the ABI
     * @return {?}
     */
    function (topics, data, inputs) {
        var _this = this;
        var /** @type {?} */ outputs = this.decodeOutputs(data, inputs);
        inputs
            .filter(function (input) { return input.indexed; })
            .forEach(function (input, i) {
            var /** @type {?} */ topic = topics[i + 1].replace('0x', '');
            // If indexed value is static decode, else return as it
            outputs[input.name] = isStatic(input) ? _this.decodeBytes(topic, input) : topic;
        });
        return outputs;
    };
    /**
     * Remap the bytes to decode depending on its type
     * @param {?} bytes The bytes to decode
     * @param {?} output The output described in the Abi
     * @return {?}
     */
    ABIDecoder.prototype.decodeBytes = /**
     * Remap the bytes to decode depending on its type
     * @param {?} bytes The bytes to decode
     * @param {?} output The output described in the Abi
     * @return {?}
     */
    function (bytes, output) {
        var /** @type {?} */ type = output.type;
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
    };
    /**
     * Decode the outputs : Start from the last to the first (to know the length of the tail)
     * @param {?} bytes The bytes of the outputs
     * @param {?} outputs The outputs from the abi
     * @return {?}
     */
    ABIDecoder.prototype.decodeOutputs = /**
     * Decode the outputs : Start from the last to the first (to know the length of the tail)
     * @param {?} bytes The bytes of the outputs
     * @param {?} outputs The outputs from the abi
     * @return {?}
     */
    function (bytes, outputs) {
        var _this = this;
        bytes = bytes.replace('0x', '');
        var /** @type {?} */ init = { result: {}, offset: bytes.length };
        return outputs
            .filter(function (output) { return !(/** @type {?} */ (output)).indexed; }) // Remove indexed values
            .reduceRight(function (acc, output, i) {
            var /** @type {?} */ head = _this.getHead(bytes, outputs, i);
            if (isStatic(output)) {
                acc.result[output.name || i] = _this.decodeBytes(head, output);
                return new DecodedParam(acc.result, acc.offset);
            }
            else {
                var /** @type {?} */ tailStart = hexToNumber(head) * 2; // transform bytes to hex
                var /** @type {?} */ tailEnd = acc.offset;
                var /** @type {?} */ tail = bytes.substring(tailStart, tailEnd);
                acc.result[output.name || i] = _this.decodeBytes(tail, output);
                return new DecodedParam(acc.result, tailStart);
            }
        }, init).result;
    };
    /**
     * Decode a array
     * @param {?} bytes The bytes of this array
     * @param {?} output The output object defined in the abi
     * @return {?}
     */
    ABIDecoder.prototype.decodeArray = /**
     * Decode a array
     * @param {?} bytes The bytes of this array
     * @param {?} output The output object defined in the abi
     * @return {?}
     */
    function (bytes, output) {
        var /** @type {?} */ amount;
        if (isFixedArray(output.type)) {
            amount = fixedArraySize(output.type);
        }
        else {
            amount = hexToNumber(bytes.slice(0, 64));
        }
        var /** @type {?} */ nestedBytes = isFixedArray(output.type) ? bytes : bytes.slice(64);
        var /** @type {?} */ outputArray = paramFromArray(amount, output);
        var /** @type {?} */ decoded = this.decodeOutputs(nestedBytes, outputArray);
        return Object.keys(decoded).map(function (key) { return decoded[key]; });
    };
    /**
     * Decode a tuple
     * @param {?} bytes
     * @param {?} outputs
     * @return {?}
     */
    ABIDecoder.prototype.decodeTuple = /**
     * Decode a tuple
     * @param {?} bytes
     * @param {?} outputs
     * @return {?}
     */
    function (bytes, outputs) {
        return this.decodeOutputs(bytes, outputs);
    };
    /**
     * Decode a string
     * @param {?} bytes
     * @return {?}
     */
    ABIDecoder.prototype.decodeString = /**
     * Decode a string
     * @param {?} bytes
     * @return {?}
     */
    function (bytes) {
        var /** @type {?} */ str = bytes.slice(64);
        return hexToUtf8(str);
    };
    /**
     * Decode a dynamic byte
     * @param {?} bytes
     * @return {?}
     */
    ABIDecoder.prototype.decodeDynamicBytes = /**
     * Decode a dynamic byte
     * @param {?} bytes
     * @return {?}
     */
    function (bytes) {
        var /** @type {?} */ amount = hexToNumber(bytes.slice(0, 64));
        return bytes.slice(64).substring(0, amount * 2);
    };
    /**
     * Decode a static byte
     * @param {?} bytes
     * @return {?}
     */
    ABIDecoder.prototype.decodeStaticBytes = /**
     * Decode a static byte
     * @param {?} bytes
     * @return {?}
     */
    function (bytes) {
        return bytes.replace(/\b0+(0+)/, '');
    };
    /**
     * Decode a uint or int
     * WARNING : Return a string
     * @param {?} bytes
     * @return {?}
     */
    ABIDecoder.prototype.decodeInt = /**
     * Decode a uint or int
     * WARNING : Return a string
     * @param {?} bytes
     * @return {?}
     */
    function (bytes) {
        var /** @type {?} */ isNegative = function (value) {
            return (new BN(value.substr(0, 1), 16).toString(2).substr(0, 1)) === '1';
        };
        if (isNegative(bytes)) {
            return new BN(bytes, 16).fromTwos(256).toString(10);
        }
        return hexToNumberString(bytes);
    };
    /**
     * Decode an address
     * @param {?} bytes
     * @return {?}
     */
    ABIDecoder.prototype.decodeAddress = /**
     * Decode an address
     * @param {?} bytes
     * @return {?}
     */
    function (bytes) {
        return toChecksumAddress(bytes.substring(24));
    };
    /**
     * Decode a boolean
     * @param {?} bytes
     * @return {?}
     */
    ABIDecoder.prototype.decodeBool = /**
     * Decode a boolean
     * @param {?} bytes
     * @return {?}
     */
    function (bytes) {
        var /** @type {?} */ last = bytes.substring(63);
        return last === '1' ? true : false;
    };
    /**
     * Return the head part of the output
     * @param {?} bytes The bytes of the outputS
     * @param {?} outputs The list of outputs
     * @param {?} index The index of the output to check in the outputs
     * @return {?}
     */
    ABIDecoder.prototype.getHead = /**
     * Return the head part of the output
     * @param {?} bytes The bytes of the outputS
     * @param {?} outputs The list of outputs
     * @param {?} index The index of the output to check in the outputs
     * @return {?}
     */
    function (bytes, outputs, index) {
        var /** @type {?} */ offset = 0;
        for (var /** @type {?} */ i = 0; i < index; i++) {
            if (isStaticTuple(outputs[i])) {
                var /** @type {?} */ head = this.getAllHeads(bytes.substr(offset), outputs[i].components);
                offset += head.length;
            }
            else if (isStaticArray(outputs[i])) {
                offset += this.staticArraySize(bytes.substr(offset), outputs[index]);
            }
            else {
                offset += 64;
            }
        }
        if (isStaticTuple(outputs[index])) {
            var /** @type {?} */ length_1 = this.getAllHeads(bytes.substr(offset), outputs[index].components).length;
            return bytes.substr(offset, length_1);
        }
        else if (isStaticArray(outputs[index])) {
            var /** @type {?} */ length_2 = this.staticArraySize(bytes.substr(offset), outputs[index]);
            return bytes.substr(offset, length_2);
        }
        else {
            return bytes.substr(offset, 64);
        }
    };
    /**
     * Get the size of a static array
     * @param {?} bytes Bytes starting at the beginning of the array
     * @param {?} output The array model
     * @return {?}
     */
    ABIDecoder.prototype.staticArraySize = /**
     * Get the size of a static array
     * @param {?} bytes Bytes starting at the beginning of the array
     * @param {?} output The array model
     * @return {?}
     */
    function (bytes, output) {
        var /** @type {?} */ size = fixedArraySize(output.type);
        var /** @type {?} */ outputArray = paramFromArray(size, output);
        return this.getAllHeads(bytes, outputArray).length;
    };
    /**
     * Get all heads from static arrays or tuples
     * @param {?} bytes Bytes starting at the beginning of the array or tuple
     * @param {?} outputs The outputs given by the ABI for this array or tuple
     * @return {?}
     */
    ABIDecoder.prototype.getAllHeads = /**
     * Get all heads from static arrays or tuples
     * @param {?} bytes Bytes starting at the beginning of the array or tuple
     * @param {?} outputs The outputs given by the ABI for this array or tuple
     * @return {?}
     */
    function (bytes, outputs) {
        var _this = this;
        return outputs.reduceRight(function (acc, output, i) {
            return acc + _this.getHead(bytes, outputs, i);
        }, '');
    };
    ABIDecoder.decorators = [
        { type: Injectable, args: [{ providedIn: ContractModule },] },
    ];
    /** @nocollapse */ ABIDecoder.ngInjectableDef = i0.defineInjectable({ factory: function ABIDecoder_Factory() { return new ABIDecoder(); }, token: ABIDecoder, providedIn: i1.ContractModule });
    return ABIDecoder;
}());
export { ABIDecoder };
function ABIDecoder_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ABIDecoder.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ABIDecoder.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2Rlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC9jb250cmFjdC8iLCJzb3VyY2VzIjpbImxpYi9hYmkvZGVjb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUMzQixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQ0wsUUFBUSxFQUNSLFlBQVksRUFDWixjQUFjLEVBQ2QsY0FBYyxFQUNkLGFBQWEsRUFDYixhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUdMLFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNsQixNQUFNLGNBQWMsQ0FBQzs7O0FBRXRCLElBQUE7SUFDRSxzQkFBbUIsTUFBb0IsRUFBUyxNQUFjO1FBQTNDLFdBQU0sR0FBTixNQUFNLENBQWM7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO0tBQUk7dUJBcEJwRTtJQXFCQyxDQUFBO0FBRkQsd0JBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBV1EsZ0NBQVc7Ozs7Ozs7Y0FBQyxNQUFnQixFQUFFLElBQVksRUFBRSxNQUFrQjs7UUFDbkUscUJBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELE1BQU07YUFDSCxNQUFNLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsT0FBTyxFQUFiLENBQWEsQ0FBQzthQUM5QixPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUUsQ0FBQztZQUNoQixxQkFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztZQUU5QyxPQUFPLENB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Qzs7Ozs7Ozs7SUFRSyxvQ0FBZTs7Ozs7O2NBQUMsS0FBYSxFQUFFLE1BQWlCO1FBQ3RELHFCQUFNLElBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLHFCQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7O0lBUTdDLGdDQUFXOzs7Ozs7Y0FBQyxLQUFhLEVBQUUsT0FBb0I7O1FBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQUMsR0FBVyxFQUFFLE1BQWlCLEVBQUUsQ0FBUztZQUNqRSxNQUFNLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM5QyxFQUFDLEVBQUUsQ0FBQyxDQUFDOzs7Z0JBM01YLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUU7OztxQkF2QjFDOztTQXdCYSxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQk4gfSBmcm9tICdibi5qcyc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJhY3RNb2R1bGUgfSBmcm9tICcuLy4uL2NvbnRyYWN0Lm1vZHVsZSc7XHJcbmltcG9ydCB7XHJcbiAgaXNTdGF0aWMsXHJcbiAgaXNGaXhlZEFycmF5LFxyXG4gIGZpeGVkQXJyYXlTaXplLFxyXG4gIHBhcmFtRnJvbUFycmF5LFxyXG4gIGlzU3RhdGljVHVwbGUsXHJcbiAgaXNTdGF0aWNBcnJheSB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIEFCSU91dHB1dCxcclxuICBBQklJbnB1dCxcclxuICBoZXhUb051bWJlcixcclxuICBoZXhUb1V0ZjgsXHJcbiAgaGV4VG9OdW1iZXJTdHJpbmcsXHJcbiAgdG9DaGVja3N1bUFkZHJlc3NcclxufSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlY29kZWRQYXJhbSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHJlc3VsdDogRGVjb2RlZFBhcmFtLCBwdWJsaWMgb2Zmc2V0OiBudW1iZXIpIHt9XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogQ29udHJhY3RNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEFCSURlY29kZXIge1xyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgYW4gZXZlbnQgb3V0cHV0XHJcbiAgICogQHBhcmFtIHRvcGljcyBUaGUgdG9waWNzIG9mIHRoZSBsb2dzIChpbmRleGVkIHZhbHVlcylcclxuICAgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBvZiB0aGUgbG9ncyAoYnl0ZXMpXHJcbiAgICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXRzIGdpdmVudCBieSB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUV2ZW50KHRvcGljczogc3RyaW5nW10sIGRhdGE6IHN0cmluZywgaW5wdXRzOiBBQklJbnB1dFtdKTogYW55IHtcclxuICAgIGNvbnN0IG91dHB1dHMgPSB0aGlzLmRlY29kZU91dHB1dHMoZGF0YSwgaW5wdXRzKTtcclxuICAgIGlucHV0c1xyXG4gICAgICAuZmlsdGVyKGlucHV0ID0+IGlucHV0LmluZGV4ZWQpXHJcbiAgICAgIC5mb3JFYWNoKChpbnB1dCwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRvcGljID0gdG9waWNzW2kgKyAxXS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgICAgICAvLyBJZiBpbmRleGVkIHZhbHVlIGlzIHN0YXRpYyBkZWNvZGUsIGVsc2UgcmV0dXJuIGFzIGl0XHJcbiAgICAgICAgb3V0cHV0c1tpbnB1dC5uYW1lXSA9IGlzU3RhdGljKGlucHV0KSA/IHRoaXMuZGVjb2RlQnl0ZXModG9waWMsIGlucHV0KSA6IHRvcGljO1xyXG4gICAgICB9KTtcclxuICAgIHJldHVybiBvdXRwdXRzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtYXAgdGhlIGJ5dGVzIHRvIGRlY29kZSBkZXBlbmRpbmcgb24gaXRzIHR5cGVcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIHRvIGRlY29kZVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIG91dHB1dCBkZXNjcmliZWQgaW4gdGhlIEFiaVxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVCeXRlcyhieXRlczogc3RyaW5nLCBvdXRwdXQ6IEFCSU91dHB1dCkge1xyXG4gICAgY29uc3QgdHlwZSA9IG91dHB1dC50eXBlO1xyXG4gICAgLy8gQ29tcGFyZSB0cnVlIHdpdGggdGhlIHJlc3VsdCBvZiB0aGUgY2FzZXNcclxuICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAvLyBBcnJheTogTXVzdCBiZSBmaXJzdFxyXG4gICAgICBjYXNlIC9cXFsoWzAtOV0qKVxcXS8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVBcnJheShieXRlcywgb3V0cHV0KTtcclxuICAgICAgLy8gVHVwbGVcclxuICAgICAgY2FzZSAvdHVwbGU/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZVR1cGxlKGJ5dGVzLCBvdXRwdXQuY29tcG9uZW50cyk7XHJcbiAgICAgIC8vIFN0cmluZ1xyXG4gICAgICBjYXNlIC9zdHJpbmc/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZVN0cmluZyhieXRlcyk7XHJcbiAgICAgIC8vIER5bmFtaWMgQnl0ZXNcclxuICAgICAgY2FzZSAvYnl0ZXM/XFxiLy50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZUR5bmFtaWNCeXRlcyhieXRlcyk7XHJcbiAgICAgIC8vIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2J5dGVzPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVTdGF0aWNCeXRlcyhieXRlcyk7XHJcbiAgICAgIC8vIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2ludD8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlSW50KGJ5dGVzKTtcclxuICAgICAgLy8gQWRkcmVzc1xyXG4gICAgICBjYXNlIC9hZGRyZXNzPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVBZGRyZXNzKGJ5dGVzKTtcclxuICAgICAgLy8gQm9vbFxyXG4gICAgICBjYXNlIC9ib29sPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVCb29sKGJ5dGVzKTtcclxuICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgdGhlIGRlY29kZXIgZm9yIHRoZSB0eXBlIDogJyArIHR5cGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgdGhlIG91dHB1dHMgOiBTdGFydCBmcm9tIHRoZSBsYXN0IHRvIHRoZSBmaXJzdCAodG8ga25vdyB0aGUgbGVuZ3RoIG9mIHRoZSB0YWlsKVxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhlIG91dHB1dHNcclxuICAgKiBAcGFyYW0gb3V0cHV0cyBUaGUgb3V0cHV0cyBmcm9tIHRoZSBhYmlcclxuICAgKi9cclxuICBwdWJsaWMgZGVjb2RlT3V0cHV0cyhieXRlczogc3RyaW5nLCBvdXRwdXRzOiAoQUJJT3V0cHV0IHwgQUJJSW5wdXQpW10pOiBhbnkge1xyXG4gICAgYnl0ZXMgPSBieXRlcy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIGNvbnN0IGluaXQgPSB7IHJlc3VsdDoge30sIG9mZnNldDogYnl0ZXMubGVuZ3RoIH07XHJcbiAgICByZXR1cm4gb3V0cHV0c1xyXG4gICAgICAuZmlsdGVyKG91dHB1dCA9PiAhKDxBQklJbnB1dD5vdXRwdXQpLmluZGV4ZWQpIC8vIFJlbW92ZSBpbmRleGVkIHZhbHVlc1xyXG4gICAgICAucmVkdWNlUmlnaHQoKGFjYzogRGVjb2RlZFBhcmFtLCBvdXRwdXQ6IEFCSU91dHB1dCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVhZCA9IHRoaXMuZ2V0SGVhZChieXRlcywgb3V0cHV0cywgaSk7XHJcbiAgICAgICAgaWYgKGlzU3RhdGljKG91dHB1dCkpIHtcclxuICAgICAgICAgIGFjYy5yZXN1bHRbb3V0cHV0Lm5hbWUgfHwgaV0gPSB0aGlzLmRlY29kZUJ5dGVzKGhlYWQsIG91dHB1dCk7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IERlY29kZWRQYXJhbShhY2MucmVzdWx0LCBhY2Mub2Zmc2V0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgdGFpbFN0YXJ0ID0gaGV4VG9OdW1iZXIoaGVhZCkgKiAyOyAvLyB0cmFuc2Zvcm0gYnl0ZXMgdG8gaGV4XHJcbiAgICAgICAgICBjb25zdCB0YWlsRW5kID0gYWNjLm9mZnNldDtcclxuICAgICAgICAgIGNvbnN0IHRhaWwgPSBieXRlcy5zdWJzdHJpbmcodGFpbFN0YXJ0LCB0YWlsRW5kKTtcclxuICAgICAgICAgIGFjYy5yZXN1bHRbb3V0cHV0Lm5hbWUgfHwgaV0gPSB0aGlzLmRlY29kZUJ5dGVzKHRhaWwsIG91dHB1dCk7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IERlY29kZWRQYXJhbShhY2MucmVzdWx0LCB0YWlsU3RhcnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgaW5pdFxyXG4gICAgKS5yZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgYSBhcnJheVxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhpcyBhcnJheVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIG91dHB1dCBvYmplY3QgZGVmaW5lZCBpbiB0aGUgYWJpXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUFycmF5KGJ5dGVzOiBzdHJpbmcsIG91dHB1dDogQUJJT3V0cHV0KTogYW55W10ge1xyXG4gICAgbGV0IGFtb3VudDogbnVtYmVyO1xyXG4gICAgaWYgKGlzRml4ZWRBcnJheShvdXRwdXQudHlwZSkpIHtcclxuICAgICAgYW1vdW50ID0gZml4ZWRBcnJheVNpemUob3V0cHV0LnR5cGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW1vdW50ID0gaGV4VG9OdW1iZXIoYnl0ZXMuc2xpY2UoMCwgNjQpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5lc3RlZEJ5dGVzID0gaXNGaXhlZEFycmF5KG91dHB1dC50eXBlKSA/IGJ5dGVzIDogYnl0ZXMuc2xpY2UoNjQpO1xyXG4gICAgY29uc3Qgb3V0cHV0QXJyYXkgPSBwYXJhbUZyb21BcnJheShhbW91bnQsIG91dHB1dCk7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy5kZWNvZGVPdXRwdXRzKG5lc3RlZEJ5dGVzLCBvdXRwdXRBcnJheSk7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGVjb2RlZCkubWFwKGtleSA9PiBkZWNvZGVkW2tleV0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIHR1cGxlICovXHJcbiAgcHVibGljIGRlY29kZVR1cGxlKGJ5dGVzOiBzdHJpbmcsIG91dHB1dHM6IEFCSU91dHB1dFtdKTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLmRlY29kZU91dHB1dHMoYnl0ZXMsIG91dHB1dHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIHN0cmluZyAqL1xyXG4gIHB1YmxpYyBkZWNvZGVTdHJpbmcoYnl0ZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdHIgPSBieXRlcy5zbGljZSg2NCk7XHJcbiAgICByZXR1cm4gaGV4VG9VdGY4KHN0cik7XHJcbiAgfVxyXG5cclxuICAvKiogRGVjb2RlIGEgZHluYW1pYyBieXRlICovXHJcbiAgcHVibGljIGRlY29kZUR5bmFtaWNCeXRlcyhieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGFtb3VudCA9IGhleFRvTnVtYmVyKGJ5dGVzLnNsaWNlKDAsIDY0KSk7XHJcbiAgICByZXR1cm4gYnl0ZXMuc2xpY2UoNjQpLnN1YnN0cmluZygwLCBhbW91bnQgKiAyKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSBzdGF0aWMgYnl0ZSAqL1xyXG4gIHB1YmxpYyBkZWNvZGVTdGF0aWNCeXRlcyhieXRlczogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gYnl0ZXMucmVwbGFjZSgvXFxiMCsoMCspLywgJycpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIGEgdWludCBvciBpbnRcclxuICAgKiBXQVJOSU5HIDogUmV0dXJuIGEgc3RyaW5nXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUludChieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGlzTmVnYXRpdmUgPSAodmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICByZXR1cm4gKG5ldyBCTih2YWx1ZS5zdWJzdHIoMCwgMSksIDE2KS50b1N0cmluZygyKS5zdWJzdHIoMCwgMSkpID09PSAnMSc7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNOZWdhdGl2ZShieXRlcykpIHtcclxuICAgICAgcmV0dXJuIG5ldyBCTihieXRlcywgMTYpLmZyb21Ud29zKDI1NikudG9TdHJpbmcoMTApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhleFRvTnVtYmVyU3RyaW5nKGJ5dGVzKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYW4gYWRkcmVzcyAqL1xyXG4gIHB1YmxpYyBkZWNvZGVBZGRyZXNzKGJ5dGVzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRvQ2hlY2tzdW1BZGRyZXNzKGJ5dGVzLnN1YnN0cmluZygyNCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIGJvb2xlYW4gKi9cclxuICBwdWJsaWMgZGVjb2RlQm9vbChieXRlczogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBsYXN0ID0gYnl0ZXMuc3Vic3RyaW5nKDYzKTtcclxuICAgIHJldHVybiBsYXN0ID09PSAnMScgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKioqKioqXHJcbiAgICogSEVBRFxyXG4gICAqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybiB0aGUgaGVhZCBwYXJ0IG9mIHRoZSBvdXRwdXRcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIG9mIHRoZSBvdXRwdXRTXHJcbiAgICogQHBhcmFtIG91dHB1dHMgVGhlIGxpc3Qgb2Ygb3V0cHV0c1xyXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG91dHB1dCB0byBjaGVjayBpbiB0aGUgb3V0cHV0c1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0SGVhZChieXRlczogc3RyaW5nLCBvdXRwdXRzOiBBQklPdXRwdXRbXSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXg7IGkrKykge1xyXG4gICAgICBpZiAoaXNTdGF0aWNUdXBsZShvdXRwdXRzW2ldKSkge1xyXG4gICAgICAgIGNvbnN0IGhlYWQgPSB0aGlzLmdldEFsbEhlYWRzKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2ldLmNvbXBvbmVudHMpO1xyXG4gICAgICAgIG9mZnNldCArPSBoZWFkLmxlbmd0aDtcclxuICAgICAgfSBlbHNlIGlmIChpc1N0YXRpY0FycmF5KG91dHB1dHNbaV0pKSB7XHJcbiAgICAgICAgb2Zmc2V0ICs9IHRoaXMuc3RhdGljQXJyYXlTaXplKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2luZGV4XSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2Zmc2V0ICs9IDY0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXNTdGF0aWNUdXBsZShvdXRwdXRzW2luZGV4XSkpIHtcclxuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5nZXRBbGxIZWFkcyhieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpbmRleF0uY29tcG9uZW50cykubGVuZ3RoXHJcbiAgICAgIHJldHVybiBieXRlcy5zdWJzdHIob2Zmc2V0LCBsZW5ndGgpO1xyXG4gICAgfSBlbHNlIGlmKGlzU3RhdGljQXJyYXkob3V0cHV0c1tpbmRleF0pKSB7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc3RhdGljQXJyYXlTaXplKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2luZGV4XSk7XHJcbiAgICAgIHJldHVybiBieXRlcy5zdWJzdHIob2Zmc2V0LCBsZW5ndGgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGJ5dGVzLnN1YnN0cihvZmZzZXQsIDY0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgc2l6ZSBvZiBhIHN0YXRpYyBhcnJheVxyXG4gICAqIEBwYXJhbSBieXRlcyBCeXRlcyBzdGFydGluZyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIGFycmF5IG1vZGVsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzdGF0aWNBcnJheVNpemUoYnl0ZXM6IHN0cmluZywgb3V0cHV0OiBBQklPdXRwdXQpIHtcclxuICAgIGNvbnN0IHNpemUgPSBmaXhlZEFycmF5U2l6ZShvdXRwdXQudHlwZSk7XHJcbiAgICBjb25zdCBvdXRwdXRBcnJheSA9IHBhcmFtRnJvbUFycmF5KHNpemUsIG91dHB1dCk7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRBbGxIZWFkcyhieXRlcywgb3V0cHV0QXJyYXkpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhbGwgaGVhZHMgZnJvbSBzdGF0aWMgYXJyYXlzIG9yIHR1cGxlc1xyXG4gICAqIEBwYXJhbSBieXRlcyBCeXRlcyBzdGFydGluZyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheSBvciB0dXBsZVxyXG4gICAqIEBwYXJhbSBvdXRwdXRzIFRoZSBvdXRwdXRzIGdpdmVuIGJ5IHRoZSBBQkkgZm9yIHRoaXMgYXJyYXkgb3IgdHVwbGVcclxuICAgKi9cclxuICBwcml2YXRlIGdldEFsbEhlYWRzKGJ5dGVzOiBzdHJpbmcsIG91dHB1dHM6IEFCSU91dHB1dFtdKSB7XHJcbiAgICByZXR1cm4gb3V0cHV0cy5yZWR1Y2VSaWdodCgoYWNjOiBzdHJpbmcsIG91dHB1dDogQUJJT3V0cHV0LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICByZXR1cm4gYWNjICsgdGhpcy5nZXRIZWFkKGJ5dGVzLCBvdXRwdXRzLCBpKTtcclxuICAgICAgfSwnJyk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=