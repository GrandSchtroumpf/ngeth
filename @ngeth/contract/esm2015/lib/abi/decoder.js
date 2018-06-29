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
export class DecodedParam {
    /**
     * @param {?} result
     * @param {?} offset
     */
    constructor(result, offset) {
        this.result = result;
        this.offset = offset;
    }
}
function DecodedParam_tsickle_Closure_declarations() {
    /** @type {?} */
    DecodedParam.prototype.result;
    /** @type {?} */
    DecodedParam.prototype.offset;
}
export class ABIDecoder {
    /**
     * Decode an event output
     * @param {?} topics The topics of the logs (indexed values)
     * @param {?} data The data of the logs (bytes)
     * @param {?} inputs The inputs givent by the ABI
     * @return {?}
     */
    decodeEvent(topics, data, inputs) {
        const /** @type {?} */ outputs = this.decodeOutputs(data, inputs);
        inputs
            .filter(input => input.indexed)
            .forEach((input, i) => {
            const /** @type {?} */ topic = topics[i + 1].replace('0x', '');
            // If indexed value is static decode, else return as it
            outputs[input.name] = isStatic(input) ? this.decodeBytes(topic, input) : topic;
        });
        return outputs;
    }
    /**
     * Remap the bytes to decode depending on its type
     * @param {?} bytes The bytes to decode
     * @param {?} output The output described in the Abi
     * @return {?}
     */
    decodeBytes(bytes, output) {
        const /** @type {?} */ type = output.type;
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
     * @param {?} bytes The bytes of the outputs
     * @param {?} outputs The outputs from the abi
     * @return {?}
     */
    decodeOutputs(bytes, outputs) {
        bytes = bytes.replace('0x', '');
        const /** @type {?} */ init = { result: {}, offset: bytes.length };
        return outputs
            .filter(output => !(/** @type {?} */ (output)).indexed) // Remove indexed values
            .reduceRight((acc, output, i) => {
            const /** @type {?} */ head = this.getHead(bytes, outputs, i);
            if (isStatic(output)) {
                acc.result[output.name || i] = this.decodeBytes(head, output);
                return new DecodedParam(acc.result, acc.offset);
            }
            else {
                const /** @type {?} */ tailStart = hexToNumber(head) * 2; // transform bytes to hex
                const /** @type {?} */ tailEnd = acc.offset;
                const /** @type {?} */ tail = bytes.substring(tailStart, tailEnd);
                acc.result[output.name || i] = this.decodeBytes(tail, output);
                return new DecodedParam(acc.result, tailStart);
            }
        }, init).result;
    }
    /**
     * Decode a array
     * @param {?} bytes The bytes of this array
     * @param {?} output The output object defined in the abi
     * @return {?}
     */
    decodeArray(bytes, output) {
        let /** @type {?} */ amount;
        if (isFixedArray(output.type)) {
            amount = fixedArraySize(output.type);
        }
        else {
            amount = hexToNumber(bytes.slice(0, 64));
        }
        const /** @type {?} */ nestedBytes = isFixedArray(output.type) ? bytes : bytes.slice(64);
        const /** @type {?} */ outputArray = paramFromArray(amount, output);
        const /** @type {?} */ decoded = this.decodeOutputs(nestedBytes, outputArray);
        return Object.keys(decoded).map(key => decoded[key]);
    }
    /**
     * Decode a tuple
     * @param {?} bytes
     * @param {?} outputs
     * @return {?}
     */
    decodeTuple(bytes, outputs) {
        return this.decodeOutputs(bytes, outputs);
    }
    /**
     * Decode a string
     * @param {?} bytes
     * @return {?}
     */
    decodeString(bytes) {
        const /** @type {?} */ str = bytes.slice(64);
        return hexToUtf8(str);
    }
    /**
     * Decode a dynamic byte
     * @param {?} bytes
     * @return {?}
     */
    decodeDynamicBytes(bytes) {
        const /** @type {?} */ amount = hexToNumber(bytes.slice(0, 64));
        return bytes.slice(64).substring(0, amount * 2);
    }
    /**
     * Decode a static byte
     * @param {?} bytes
     * @return {?}
     */
    decodeStaticBytes(bytes) {
        return bytes.replace(/\b0+(0+)/, '');
    }
    /**
     * Decode a uint or int
     * WARNING : Return a string
     * @param {?} bytes
     * @return {?}
     */
    decodeInt(bytes) {
        const /** @type {?} */ isNegative = (value) => {
            return (new BN(value.substr(0, 1), 16).toString(2).substr(0, 1)) === '1';
        };
        if (isNegative(bytes)) {
            return new BN(bytes, 16).fromTwos(256).toString(10);
        }
        return hexToNumberString(bytes);
    }
    /**
     * Decode an address
     * @param {?} bytes
     * @return {?}
     */
    decodeAddress(bytes) {
        return toChecksumAddress(bytes.substring(24));
    }
    /**
     * Decode a boolean
     * @param {?} bytes
     * @return {?}
     */
    decodeBool(bytes) {
        const /** @type {?} */ last = bytes.substring(63);
        return last === '1' ? true : false;
    }
    /**
     * Return the head part of the output
     * @param {?} bytes The bytes of the outputS
     * @param {?} outputs The list of outputs
     * @param {?} index The index of the output to check in the outputs
     * @return {?}
     */
    getHead(bytes, outputs, index) {
        let /** @type {?} */ offset = 0;
        for (let /** @type {?} */ i = 0; i < index; i++) {
            if (isStaticTuple(outputs[i])) {
                const /** @type {?} */ head = this.getAllHeads(bytes.substr(offset), outputs[i].components);
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
            const /** @type {?} */ length = this.getAllHeads(bytes.substr(offset), outputs[index].components).length;
            return bytes.substr(offset, length);
        }
        else if (isStaticArray(outputs[index])) {
            const /** @type {?} */ length = this.staticArraySize(bytes.substr(offset), outputs[index]);
            return bytes.substr(offset, length);
        }
        else {
            return bytes.substr(offset, 64);
        }
    }
    /**
     * Get the size of a static array
     * @param {?} bytes Bytes starting at the beginning of the array
     * @param {?} output The array model
     * @return {?}
     */
    staticArraySize(bytes, output) {
        const /** @type {?} */ size = fixedArraySize(output.type);
        const /** @type {?} */ outputArray = paramFromArray(size, output);
        return this.getAllHeads(bytes, outputArray).length;
    }
    /**
     * Get all heads from static arrays or tuples
     * @param {?} bytes Bytes starting at the beginning of the array or tuple
     * @param {?} outputs The outputs given by the ABI for this array or tuple
     * @return {?}
     */
    getAllHeads(bytes, outputs) {
        return outputs.reduceRight((acc, output, i) => {
            return acc + this.getHead(bytes, outputs, i);
        }, '');
    }
}
ABIDecoder.decorators = [
    { type: Injectable, args: [{ providedIn: ContractModule },] },
];
/** @nocollapse */ ABIDecoder.ngInjectableDef = i0.defineInjectable({ factory: function ABIDecoder_Factory() { return new ABIDecoder(); }, token: ABIDecoder, providedIn: i1.ContractModule });
function ABIDecoder_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ABIDecoder.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ABIDecoder.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2Rlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC9jb250cmFjdC8iLCJzb3VyY2VzIjpbImxpYi9hYmkvZGVjb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUMzQixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQ0wsUUFBUSxFQUNSLFlBQVksRUFDWixjQUFjLEVBQ2QsY0FBYyxFQUNkLGFBQWEsRUFDYixhQUFhLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUdMLFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNsQixNQUFNLGNBQWMsQ0FBQzs7O0FBRXRCLE1BQU07Ozs7O0lBQ0osWUFBbUIsTUFBb0IsRUFBUyxNQUFjO1FBQTNDLFdBQU0sR0FBTixNQUFNLENBQWM7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO0tBQUk7Q0FDbkU7Ozs7Ozs7QUFHRCxNQUFNOzs7Ozs7OztJQVFHLFdBQVcsQ0FBQyxNQUFnQixFQUFFLElBQVksRUFBRSxNQUFrQjtRQUNuRSx1QkFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakQsTUFBTTthQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7YUFDOUIsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BCLHVCQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7O1lBRTlDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFD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SSxDQUFDLENBQUM7UUFDekMsdUJBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7SUFRN0MsV0FBVyxDQUFDLEtBQWEsRUFBRSxPQUFvQjtRQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQVcsRUFBRSxNQUFpQixFQUFFLENBQVMsRUFBRSxFQUFFO1lBQ3JFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzlDLEVBQUMsRUFBRSxDQUFDLENBQUM7Ozs7WUEzTVgsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJOIH0gZnJvbSAnYm4uanMnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyYWN0TW9kdWxlIH0gZnJvbSAnLi8uLi9jb250cmFjdC5tb2R1bGUnO1xyXG5pbXBvcnQge1xyXG4gIGlzU3RhdGljLFxyXG4gIGlzRml4ZWRBcnJheSxcclxuICBmaXhlZEFycmF5U2l6ZSxcclxuICBwYXJhbUZyb21BcnJheSxcclxuICBpc1N0YXRpY1R1cGxlLFxyXG4gIGlzU3RhdGljQXJyYXkgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBBQklPdXRwdXQsXHJcbiAgQUJJSW5wdXQsXHJcbiAgaGV4VG9OdW1iZXIsXHJcbiAgaGV4VG9VdGY4LFxyXG4gIGhleFRvTnVtYmVyU3RyaW5nLFxyXG4gIHRvQ2hlY2tzdW1BZGRyZXNzXHJcbn0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEZWNvZGVkUGFyYW0ge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZXN1bHQ6IERlY29kZWRQYXJhbSwgcHVibGljIG9mZnNldDogbnVtYmVyKSB7fVxyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IENvbnRyYWN0TW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBBQklEZWNvZGVyIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIGFuIGV2ZW50IG91dHB1dFxyXG4gICAqIEBwYXJhbSB0b3BpY3MgVGhlIHRvcGljcyBvZiB0aGUgbG9ncyAoaW5kZXhlZCB2YWx1ZXMpXHJcbiAgICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgb2YgdGhlIGxvZ3MgKGJ5dGVzKVxyXG4gICAqIEBwYXJhbSBpbnB1dHMgVGhlIGlucHV0cyBnaXZlbnQgYnkgdGhlIEFCSVxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVFdmVudCh0b3BpY3M6IHN0cmluZ1tdLCBkYXRhOiBzdHJpbmcsIGlucHV0czogQUJJSW5wdXRbXSk6IGFueSB7XHJcbiAgICBjb25zdCBvdXRwdXRzID0gdGhpcy5kZWNvZGVPdXRwdXRzKGRhdGEsIGlucHV0cyk7XHJcbiAgICBpbnB1dHNcclxuICAgICAgLmZpbHRlcihpbnB1dCA9PiBpbnB1dC5pbmRleGVkKVxyXG4gICAgICAuZm9yRWFjaCgoaW5wdXQsIGkpID0+IHtcclxuICAgICAgICBjb25zdCB0b3BpYyA9IHRvcGljc1tpICsgMV0ucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICAgICAgLy8gSWYgaW5kZXhlZCB2YWx1ZSBpcyBzdGF0aWMgZGVjb2RlLCBlbHNlIHJldHVybiBhcyBpdFxyXG4gICAgICAgIG91dHB1dHNbaW5wdXQubmFtZV0gPSBpc1N0YXRpYyhpbnB1dCkgPyB0aGlzLmRlY29kZUJ5dGVzKHRvcGljLCBpbnB1dCkgOiB0b3BpYztcclxuICAgICAgfSk7XHJcbiAgICByZXR1cm4gb3V0cHV0cztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbWFwIHRoZSBieXRlcyB0byBkZWNvZGUgZGVwZW5kaW5nIG9uIGl0cyB0eXBlXHJcbiAgICogQHBhcmFtIGJ5dGVzIFRoZSBieXRlcyB0byBkZWNvZGVcclxuICAgKiBAcGFyYW0gb3V0cHV0IFRoZSBvdXRwdXQgZGVzY3JpYmVkIGluIHRoZSBBYmlcclxuICAgKi9cclxuICBwdWJsaWMgZGVjb2RlQnl0ZXMoYnl0ZXM6IHN0cmluZywgb3V0cHV0OiBBQklPdXRwdXQpIHtcclxuICAgIGNvbnN0IHR5cGUgPSBvdXRwdXQudHlwZTtcclxuICAgIC8vIENvbXBhcmUgdHJ1ZSB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIGNhc2VzXHJcbiAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgLy8gQXJyYXk6IE11c3QgYmUgZmlyc3RcclxuICAgICAgY2FzZSAvXFxbKFswLTldKilcXF0vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlQXJyYXkoYnl0ZXMsIG91dHB1dCk7XHJcbiAgICAgIC8vIFR1cGxlXHJcbiAgICAgIGNhc2UgL3R1cGxlPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVUdXBsZShieXRlcywgb3V0cHV0LmNvbXBvbmVudHMpO1xyXG4gICAgICAvLyBTdHJpbmdcclxuICAgICAgY2FzZSAvc3RyaW5nPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVTdHJpbmcoYnl0ZXMpO1xyXG4gICAgICAvLyBEeW5hbWljIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2J5dGVzP1xcYi8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVEeW5hbWljQnl0ZXMoYnl0ZXMpO1xyXG4gICAgICAvLyBCeXRlc1xyXG4gICAgICBjYXNlIC9ieXRlcz8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlU3RhdGljQnl0ZXMoYnl0ZXMpO1xyXG4gICAgICAvLyBCeXRlc1xyXG4gICAgICBjYXNlIC9pbnQ/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZUludChieXRlcyk7XHJcbiAgICAgIC8vIEFkZHJlc3NcclxuICAgICAgY2FzZSAvYWRkcmVzcz8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlQWRkcmVzcyhieXRlcyk7XHJcbiAgICAgIC8vIEJvb2xcclxuICAgICAgY2FzZSAvYm9vbD8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlQm9vbChieXRlcyk7XHJcbiAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIHRoZSBkZWNvZGVyIGZvciB0aGUgdHlwZSA6ICcgKyB0eXBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIHRoZSBvdXRwdXRzIDogU3RhcnQgZnJvbSB0aGUgbGFzdCB0byB0aGUgZmlyc3QgKHRvIGtub3cgdGhlIGxlbmd0aCBvZiB0aGUgdGFpbClcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIG9mIHRoZSBvdXRwdXRzXHJcbiAgICogQHBhcmFtIG91dHB1dHMgVGhlIG91dHB1dHMgZnJvbSB0aGUgYWJpXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZU91dHB1dHMoYnl0ZXM6IHN0cmluZywgb3V0cHV0czogKEFCSU91dHB1dCB8IEFCSUlucHV0KVtdKTogYW55IHtcclxuICAgIGJ5dGVzID0gYnl0ZXMucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICBjb25zdCBpbml0ID0geyByZXN1bHQ6IHt9LCBvZmZzZXQ6IGJ5dGVzLmxlbmd0aCB9O1xyXG4gICAgcmV0dXJuIG91dHB1dHNcclxuICAgICAgLmZpbHRlcihvdXRwdXQgPT4gISg8QUJJSW5wdXQ+b3V0cHV0KS5pbmRleGVkKSAvLyBSZW1vdmUgaW5kZXhlZCB2YWx1ZXNcclxuICAgICAgLnJlZHVjZVJpZ2h0KChhY2M6IERlY29kZWRQYXJhbSwgb3V0cHV0OiBBQklPdXRwdXQsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWQgPSB0aGlzLmdldEhlYWQoYnl0ZXMsIG91dHB1dHMsIGkpO1xyXG4gICAgICAgIGlmIChpc1N0YXRpYyhvdXRwdXQpKSB7XHJcbiAgICAgICAgICBhY2MucmVzdWx0W291dHB1dC5uYW1lIHx8IGldID0gdGhpcy5kZWNvZGVCeXRlcyhoZWFkLCBvdXRwdXQpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBEZWNvZGVkUGFyYW0oYWNjLnJlc3VsdCwgYWNjLm9mZnNldCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHRhaWxTdGFydCA9IGhleFRvTnVtYmVyKGhlYWQpICogMjsgLy8gdHJhbnNmb3JtIGJ5dGVzIHRvIGhleFxyXG4gICAgICAgICAgY29uc3QgdGFpbEVuZCA9IGFjYy5vZmZzZXQ7XHJcbiAgICAgICAgICBjb25zdCB0YWlsID0gYnl0ZXMuc3Vic3RyaW5nKHRhaWxTdGFydCwgdGFpbEVuZCk7XHJcbiAgICAgICAgICBhY2MucmVzdWx0W291dHB1dC5uYW1lIHx8IGldID0gdGhpcy5kZWNvZGVCeXRlcyh0YWlsLCBvdXRwdXQpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBEZWNvZGVkUGFyYW0oYWNjLnJlc3VsdCwgdGFpbFN0YXJ0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIGluaXRcclxuICAgICkucmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIGEgYXJyYXlcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIG9mIHRoaXMgYXJyYXlcclxuICAgKiBAcGFyYW0gb3V0cHV0IFRoZSBvdXRwdXQgb2JqZWN0IGRlZmluZWQgaW4gdGhlIGFiaVxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVBcnJheShieXRlczogc3RyaW5nLCBvdXRwdXQ6IEFCSU91dHB1dCk6IGFueVtdIHtcclxuICAgIGxldCBhbW91bnQ6IG51bWJlcjtcclxuICAgIGlmIChpc0ZpeGVkQXJyYXkob3V0cHV0LnR5cGUpKSB7XHJcbiAgICAgIGFtb3VudCA9IGZpeGVkQXJyYXlTaXplKG91dHB1dC50eXBlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFtb3VudCA9IGhleFRvTnVtYmVyKGJ5dGVzLnNsaWNlKDAsIDY0KSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXN0ZWRCeXRlcyA9IGlzRml4ZWRBcnJheShvdXRwdXQudHlwZSkgPyBieXRlcyA6IGJ5dGVzLnNsaWNlKDY0KTtcclxuICAgIGNvbnN0IG91dHB1dEFycmF5ID0gcGFyYW1Gcm9tQXJyYXkoYW1vdW50LCBvdXRwdXQpO1xyXG4gICAgY29uc3QgZGVjb2RlZCA9IHRoaXMuZGVjb2RlT3V0cHV0cyhuZXN0ZWRCeXRlcywgb3V0cHV0QXJyYXkpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRlY29kZWQpLm1hcChrZXkgPT4gZGVjb2RlZFtrZXldKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSB0dXBsZSAqL1xyXG4gIHB1YmxpYyBkZWNvZGVUdXBsZShieXRlczogc3RyaW5nLCBvdXRwdXRzOiBBQklPdXRwdXRbXSk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5kZWNvZGVPdXRwdXRzKGJ5dGVzLCBvdXRwdXRzKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSBzdHJpbmcgKi9cclxuICBwdWJsaWMgZGVjb2RlU3RyaW5nKGJ5dGVzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RyID0gYnl0ZXMuc2xpY2UoNjQpO1xyXG4gICAgcmV0dXJuIGhleFRvVXRmOChzdHIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIGR5bmFtaWMgYnl0ZSAqL1xyXG4gIHB1YmxpYyBkZWNvZGVEeW5hbWljQnl0ZXMoYnl0ZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBhbW91bnQgPSBoZXhUb051bWJlcihieXRlcy5zbGljZSgwLCA2NCkpO1xyXG4gICAgcmV0dXJuIGJ5dGVzLnNsaWNlKDY0KS5zdWJzdHJpbmcoMCwgYW1vdW50ICogMik7XHJcbiAgfVxyXG5cclxuICAvKiogRGVjb2RlIGEgc3RhdGljIGJ5dGUgKi9cclxuICBwdWJsaWMgZGVjb2RlU3RhdGljQnl0ZXMoYnl0ZXM6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGJ5dGVzLnJlcGxhY2UoL1xcYjArKDArKS8sICcnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlY29kZSBhIHVpbnQgb3IgaW50XHJcbiAgICogV0FSTklORyA6IFJldHVybiBhIHN0cmluZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVJbnQoYnl0ZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBpc05lZ2F0aXZlID0gKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgcmV0dXJuIChuZXcgQk4odmFsdWUuc3Vic3RyKDAsIDEpLCAxNikudG9TdHJpbmcoMikuc3Vic3RyKDAsIDEpKSA9PT0gJzEnO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzTmVnYXRpdmUoYnl0ZXMpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQk4oYnl0ZXMsIDE2KS5mcm9tVHdvcygyNTYpLnRvU3RyaW5nKDEwKTtcclxuICAgIH1cclxuICAgIHJldHVybiBoZXhUb051bWJlclN0cmluZyhieXRlcyk7XHJcbiAgfVxyXG5cclxuICAvKiogRGVjb2RlIGFuIGFkZHJlc3MgKi9cclxuICBwdWJsaWMgZGVjb2RlQWRkcmVzcyhieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0b0NoZWNrc3VtQWRkcmVzcyhieXRlcy5zdWJzdHJpbmcoMjQpKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSBib29sZWFuICovXHJcbiAgcHVibGljIGRlY29kZUJvb2woYnl0ZXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGFzdCA9IGJ5dGVzLnN1YnN0cmluZyg2Myk7XHJcbiAgICByZXR1cm4gbGFzdCA9PT0gJzEnID8gdHJ1ZSA6IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKlxyXG4gICAqIEhFQURcclxuICAgKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm4gdGhlIGhlYWQgcGFydCBvZiB0aGUgb3V0cHV0XHJcbiAgICogQHBhcmFtIGJ5dGVzIFRoZSBieXRlcyBvZiB0aGUgb3V0cHV0U1xyXG4gICAqIEBwYXJhbSBvdXRwdXRzIFRoZSBsaXN0IG9mIG91dHB1dHNcclxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBvdXRwdXQgdG8gY2hlY2sgaW4gdGhlIG91dHB1dHNcclxuICAgKi9cclxuICBwcml2YXRlIGdldEhlYWQoYnl0ZXM6IHN0cmluZywgb3V0cHV0czogQUJJT3V0cHV0W10sIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgbGV0IG9mZnNldCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGV4OyBpKyspIHtcclxuICAgICAgaWYgKGlzU3RhdGljVHVwbGUob3V0cHV0c1tpXSkpIHtcclxuICAgICAgICBjb25zdCBoZWFkID0gdGhpcy5nZXRBbGxIZWFkcyhieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpXS5jb21wb25lbnRzKTtcclxuICAgICAgICBvZmZzZXQgKz0gaGVhZC5sZW5ndGg7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNTdGF0aWNBcnJheShvdXRwdXRzW2ldKSkge1xyXG4gICAgICAgIG9mZnNldCArPSB0aGlzLnN0YXRpY0FycmF5U2l6ZShieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpbmRleF0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9mZnNldCArPSA2NDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGlzU3RhdGljVHVwbGUob3V0cHV0c1tpbmRleF0pKSB7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuZ2V0QWxsSGVhZHMoYnl0ZXMuc3Vic3RyKG9mZnNldCksIG91dHB1dHNbaW5kZXhdLmNvbXBvbmVudHMpLmxlbmd0aFxyXG4gICAgICByZXR1cm4gYnl0ZXMuc3Vic3RyKG9mZnNldCwgbGVuZ3RoKTtcclxuICAgIH0gZWxzZSBpZihpc1N0YXRpY0FycmF5KG91dHB1dHNbaW5kZXhdKSkge1xyXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnN0YXRpY0FycmF5U2l6ZShieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpbmRleF0pO1xyXG4gICAgICByZXR1cm4gYnl0ZXMuc3Vic3RyKG9mZnNldCwgbGVuZ3RoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBieXRlcy5zdWJzdHIob2Zmc2V0LCA2NCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIHNpemUgb2YgYSBzdGF0aWMgYXJyYXlcclxuICAgKiBAcGFyYW0gYnl0ZXMgQnl0ZXMgc3RhcnRpbmcgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXlcclxuICAgKiBAcGFyYW0gb3V0cHV0IFRoZSBhcnJheSBtb2RlbFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc3RhdGljQXJyYXlTaXplKGJ5dGVzOiBzdHJpbmcsIG91dHB1dDogQUJJT3V0cHV0KSB7XHJcbiAgICBjb25zdCBzaXplID0gZml4ZWRBcnJheVNpemUob3V0cHV0LnR5cGUpO1xyXG4gICAgY29uc3Qgb3V0cHV0QXJyYXkgPSBwYXJhbUZyb21BcnJheShzaXplLCBvdXRwdXQpO1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsSGVhZHMoYnl0ZXMsIG91dHB1dEFycmF5KS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYWxsIGhlYWRzIGZyb20gc3RhdGljIGFycmF5cyBvciB0dXBsZXNcclxuICAgKiBAcGFyYW0gYnl0ZXMgQnl0ZXMgc3RhcnRpbmcgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXkgb3IgdHVwbGVcclxuICAgKiBAcGFyYW0gb3V0cHV0cyBUaGUgb3V0cHV0cyBnaXZlbiBieSB0aGUgQUJJIGZvciB0aGlzIGFycmF5IG9yIHR1cGxlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRBbGxIZWFkcyhieXRlczogc3RyaW5nLCBvdXRwdXRzOiBBQklPdXRwdXRbXSkge1xyXG4gICAgcmV0dXJuIG91dHB1dHMucmVkdWNlUmlnaHQoKGFjYzogc3RyaW5nLCBvdXRwdXQ6IEFCSU91dHB1dCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGFjYyArIHRoaXMuZ2V0SGVhZChieXRlcywgb3V0cHV0cywgaSk7XHJcbiAgICAgIH0sJycpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19