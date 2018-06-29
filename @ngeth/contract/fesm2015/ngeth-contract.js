import { toChecksumAddress, hexToNumber, hexToUtf8, hexToNumberString, numberToHex, utf8ToHex, toBN, keccak256 } from '@ngeth/utils';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NgModule, Injectable, defineInjectable } from '@angular/core';
import { BN } from 'bn.js';
import { ContractProvider } from '@ngeth/provider';
import { __decorate } from 'tslib';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template T
 */
class ContractClass {
    /**
     * @param {?} encoder
     * @param {?} decoder
     * @param {?} provider
     * @param {?} abi
     * @param {?=} address
     */
    constructor(encoder, decoder, provider, abi, address) {
        this.encoder = encoder;
        this.decoder = decoder;
        this.provider = provider;
        this.abi = abi;
        this.address = address;
        this.calls = /** @type {?} */ ({});
        this.sends = /** @type {?} */ ({});
        this.events = /** @type {?} */ ({});
        if (!this.abi) {
            throw new Error('Please add an abi to the contract');
        }
        if (this.address) {
            this.address = toChecksumAddress(address);
        }
        const /** @type {?} */ calls = [];
        const /** @type {?} */ sends = [];
        const /** @type {?} */ events = [];
        for (const /** @type {?} */ def of this.abi) {
            if (def.type === 'function' && def.constant === true) {
                calls.push(def);
            }
            if (def.type === 'function' && def.constant === false) {
                sends.push(def);
            }
            if (def.type === 'event') {
                events.push(def);
            }
        }
        calls.forEach(def => (this.calls[def.name] = this.callMethod.bind(this, def)));
        sends.forEach(def => (this.sends[def.name] = this.sendMethod.bind(this, def)));
        events.forEach(def => (this.events[def.name] = this.eventMethod.bind(this, def)));
    }
    /**
     * Deploy the contract on the blockchain
     * @param {?} bytes The bytes of the contract
     * @param {...?} params Params to pass into the constructor
     * @return {?}
     */
    deploy(bytes, ...params) {
        const /** @type {?} */ constructor = this.abi.find(def => def.type === 'constructor');
        const /** @type {?} */ noParam = params.length === 0;
        const /** @type {?} */ data = noParam ? bytes : this.encoder.encodeConstructor(constructor, bytes, params);
        return this.fillGas(Object.assign({}, this.provider.defaultTx, { data }))
            .pipe(switchMap(tx => this.provider.sendTransaction(tx)));
    }
    /**
     * Used for 'call' methods
     * @param {?} method The method to call
     * @param {...?} params The params given by the user
     * @return {?}
     */
    callMethod(method, ...params) {
        const /** @type {?} */ data = this.encoder.encodeMethod(method, params);
        return this.provider
            .call(this.address, data)
            .pipe(map(result => this.decoder.decodeOutputs(result, method.outputs)), map(result => result[Object.keys(result)[0]]));
    }
    /**
     * Used for 'send' methods
     * @param {?} method The method to send
     * @param {...?} params The params given by the user
     * @return {?}
     */
    sendMethod(method, ...params) {
        const { to, data } = { to: this.address, data: this.encoder.encodeMethod(method, params) };
        return this.fillGas(Object.assign({}, this.provider.defaultTx, { to, data }))
            .pipe(switchMap(tx => this.provider.sendTransaction(tx)));
    }
    /**
     * Used for 'event' definition
     * @param {?} event The event definition in the ABI
     * @return {?}
     */
    eventMethod(event) {
        const /** @type {?} */ topics = this.encoder.encodeEvent(event);
        return this.provider.event(this.address, [topics]).pipe(map(logs => this.decoder.decodeEvent(logs.topics, logs.data, event.inputs)));
    }
    /**
     * Fill the estimated amount of gas and gasPrice to use for a transaction
     * @param {?} tx The raw transaction to estimate the gas from
     * @return {?}
     */
    fillGas(tx) {
        return forkJoin(this.provider.estimateGas(tx), this.provider.gasPrice()).pipe(map(([gas, gasPrice]) => {
            return Object.assign({}, tx, { gas, gasPrice });
        }));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ContractModule {
}
ContractModule.decorators = [
    { type: NgModule },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Create an array of params based on the size of the array in the ABI and the model
 * @param {?} size The amount of elements in the array
 * @param {?} param The model of param to based the new array on
 * @return {?}
 */
function paramFromArray(size, param) {
    const /** @type {?} */ type = nestedType(param.type);
    const /** @type {?} */ paramModel = Object.assign({}, param, { name: '', type: type }); // Remove name to avoid conflict
    return Array(size).fill(paramModel);
}
/**
 * Return the size of the fixed array ask by the ABI
 * @param {?} type The type of the array
 * @return {?}
 */
function fixedArraySize(type) {
    const /** @type {?} */ lastArrayStr = nestedArray(type).pop();
    const /** @type {?} */ lastArray = JSON.parse(lastArrayStr);
    if (lastArray.length === 0) {
        throw new Error(`Array of type ${type} is not a fixed array`);
    }
    return parseInt(lastArray[0], 10);
}
/**
 * Check if the tuple is static
 * @param {?} tuple The tuple object
 * @return {?}
 */
function isStaticTuple(tuple) {
    return (tuple.type === 'tuple' // Prevent type to be 'tuple[]'
        && tuple.components
        && tuple.components.filter(param => !isStatic(param)).length === 0);
}
/**
 * Check if the array is static
 * @param {?} arr The array object
 * @return {?}
 */
function isStaticArray(arr) {
    return (isFixedArray(arr.type)
        && isStatic(Object.assign({}, arr, { type: nestedType(arr.type) })) // Nested Type is static
    );
}
/**
 * Check if the output is static
 * @param {?} output The output defined in the abi
 * @return {?}
 */
function isStatic(output) {
    const /** @type {?} */ type = output.type;
    switch (true) {
        // Array
        case /\[([0-9]*)\]/.test(type):
            return isStaticArray(output);
        // Tuple
        case /tuple?/.test(type): {
            return isStaticTuple(output);
        }
        // Dynamic
        case /string?/.test(type):
        case /bytes?\b/.test(type):
            return false;
        // Static
        case /bytes?/.test(type):
        case /int?/.test(type):
        case /address?/.test(type):
        case /bool?/.test(type):
            return true;
    }
    return true;
}
/**
 * Check if the array is fixed
 * @param {?} type Type of the array
 * @return {?}
 */
function isFixedArray(type) {
    return /\[[0-9]\]/.test(type);
}
/**
 * Remove last [] in type
 * \@example int[32] => int
 * \@example int[2][3] => int[2]
 * @param {?} type The type to modify
 * @return {?}
 */
function nestedType(type) {
    const /** @type {?} */ arrays = nestedArray(type);
    if (!arrays) {
        return type;
    }
    const /** @type {?} */ lastArray = arrays[arrays.length - 1];
    return type.substring(0, type.length - lastArray.length);
}
/**
 * Should return array of nested types
 * \@example int[2][3][] => [[2], [3], []]
 * \@example int[] => [[]]
 * \@example int => null
 * @param {?} type The type to match
 * @return {?}
 */
function nestedArray(type) {
    return type.match(/(\[[0-9]*\])/g);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DecodedParam {
    /**
     * @param {?} result
     * @param {?} offset
     */
    constructor(result, offset) {
        this.result = result;
        this.offset = offset;
    }
}
class ABIDecoder {
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
/** @nocollapse */ ABIDecoder.ngInjectableDef = defineInjectable({ factory: function ABIDecoder_Factory() { return new ABIDecoder(); }, token: ABIDecoder, providedIn: ContractModule });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class EncodedParam {
    /**
     * @param {?=} head
     * @param {?=} tail
     */
    constructor(head = '', tail = '') {
        this.head = head;
        this.tail = tail;
    }
}
class ABIEncoder {
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
/** @nocollapse */ ABIEncoder.ngInjectableDef = defineInjectable({ factory: function ABIEncoder_Factory() { return new ABIEncoder(); }, token: ABIEncoder, providedIn: ContractModule });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 * @param {?} metadata
 * @return {?}
 */
function Contract(metadata) {
    const { abi, addresses } = metadata;
    const /** @type {?} */ jsonInterace = typeof abi === 'string' ? JSON.parse(abi) : abi;
    /**
     * Get the address of the contract depending on the id of the network
     * @param id The id of the network
     */
    const /** @type {?} */ getAddress = (id) => {
        switch (id) {
            case 1: return addresses['mainnet'];
            case 3: return addresses['ropsten'];
            case 4: return addresses['rinkeby'];
            case 42: return addresses['kovan'];
            default: return addresses['mainnet'];
        }
    };
    return function (Base) {
        class ContractDecorated extends ContractClass {
            /**
             * @param {?} encoder
             * @param {?} decoder
             * @param {?} provider
             */
            constructor(encoder, decoder, provider) {
                super(encoder, decoder, provider, jsonInterace, getAddress(provider.id));
                this.encoder = encoder;
                this.decoder = decoder;
                this.provider = provider;
            }
        }
        ContractDecorated.decorators = [
            { type: Injectable, args: [{ providedIn: ContractModule },] },
        ];
        /** @nocollapse */
        ContractDecorated.ctorParameters = () => [
            { type: ABIEncoder, },
            { type: ABIDecoder, },
            { type: ContractProvider, },
        ];
        return /** @type {?} */ (ContractDecorated);
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ abi = require('./encoder-test.abi.json');
let EncoderTestContract = class EncoderTestContract extends ContractClass {
};
EncoderTestContract = __decorate([
    Contract({
        abi: abi,
        addresses: {
            ropsten: '0x344f641ff60f6308ad70b1e62052764835f48e00'
        }
    })
], EncoderTestContract);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ abi$1 = require('./test-event.abi.json');
let TestEventContract = class TestEventContract extends ContractClass {
};
TestEventContract = __decorate([
    Contract({
        abi: abi$1,
        addresses: {
            ropsten: '0xc0D6C4cbA14aeFC218d0ff669e07D73E74078248'
        }
    })
], TestEventContract);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { ContractClass, DecodedParam, ABIDecoder, EncodedParam, ABIEncoder, Contract, ContractModule, EncoderTestContract, TestEventContract, ABIDecoder as ɵb, ABIEncoder as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtY29udHJhY3QuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvY29udHJhY3QudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvY29udHJhY3QubW9kdWxlLnRzIiwibmc6Ly9AbmdldGgvY29udHJhY3QvbGliL2FiaS91dGlscy50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9hYmkvZGVjb2Rlci50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9hYmkvZW5jb2Rlci50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9jb250cmFjdC5kZWNvcmF0b3IudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvYWJpL2VuY29kZXItdGVzdC9lbmNvZGVyLXRlc3QuY29udHJhY3QudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvYWJpL3Rlc3QtZXZlbnQvdGVzdC1ldmVudC5jb250cmFjdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBQklEZWZpbml0aW9uLCB0b0NoZWNrc3VtQWRkcmVzcywgQ29udHJhY3RNb2RlbCwgSVR4T2JqZWN0IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgQ29udHJhY3RQcm92aWRlciB9IGZyb20gJ0BuZ2V0aC9wcm92aWRlcic7XHJcbmltcG9ydCB7IEFCSUVuY29kZXIsIEFCSURlY29kZXIgfSBmcm9tICcuL2FiaSc7XHJcblxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsICBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJhY3RDbGFzczxUIGV4dGVuZHMgQ29udHJhY3RNb2RlbD4ge1xyXG4gIHB1YmxpYyBjYWxsczogeyBbUCBpbiBrZXlvZiBUWydjYWxscyddXTogVFsnY2FsbHMnXVtQXTsgfSA9IHt9IGFzIGFueTtcclxuICBwdWJsaWMgc2VuZHM6IHsgW1AgaW4ga2V5b2YgVFsnc2VuZHMnXV06IFRbJ3NlbmRzJ11bUF07IH0gPSB7fSBhcyBhbnk7XHJcbiAgcHVibGljIGV2ZW50czogeyBbUCBpbiBrZXlvZiBUWydldmVudHMnXV06IFRbJ2V2ZW50cyddW1BdOyB9ID0ge30gYXMgYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByb3RlY3RlZCBlbmNvZGVyOiBBQklFbmNvZGVyLFxyXG4gICAgcHJvdGVjdGVkIGRlY29kZXI6IEFCSURlY29kZXIsXHJcbiAgICBwcm90ZWN0ZWQgcHJvdmlkZXI6IENvbnRyYWN0UHJvdmlkZXIsXHJcbiAgICBwcml2YXRlIGFiaTogQUJJRGVmaW5pdGlvbltdLFxyXG4gICAgcHVibGljIGFkZHJlc3M/OiBzdHJpbmdcclxuICApIHtcclxuICAgIGlmICghdGhpcy5hYmkpIHsgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgYWRkIGFuIGFiaSB0byB0aGUgY29udHJhY3QnKTsgfVxyXG4gICAgaWYgKHRoaXMuYWRkcmVzcykgeyB0aGlzLmFkZHJlc3MgPSB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzKTsgfVxyXG4gICAgY29uc3QgY2FsbHM6IGFueVtdID0gW107XHJcbiAgICBjb25zdCBzZW5kczogYW55W10gPSBbXTtcclxuICAgIGNvbnN0IGV2ZW50czogYW55W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgZGVmIG9mIHRoaXMuYWJpKSB7XHJcbiAgICAgIGlmIChkZWYudHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWYuY29uc3RhbnQgPT09IHRydWUpIHtcclxuICAgICAgICBjYWxscy5wdXNoKGRlZik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRlZi50eXBlID09PSAnZnVuY3Rpb24nICYmIGRlZi5jb25zdGFudCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBzZW5kcy5wdXNoKGRlZik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRlZi50eXBlID09PSAnZXZlbnQnKSB7XHJcbiAgICAgICAgZXZlbnRzLnB1c2goZGVmKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2FsbHMuZm9yRWFjaChkZWYgPT4gKHRoaXMuY2FsbHNbZGVmLm5hbWVdID0gdGhpcy5jYWxsTWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gICAgc2VuZHMuZm9yRWFjaChkZWYgPT4gKHRoaXMuc2VuZHNbZGVmLm5hbWVdID0gdGhpcy5zZW5kTWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gICAgZXZlbnRzLmZvckVhY2goZGVmID0+ICh0aGlzLmV2ZW50c1tkZWYubmFtZV0gPSB0aGlzLmV2ZW50TWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVwbG95IHRoZSBjb250cmFjdCBvbiB0aGUgYmxvY2tjaGFpblxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhlIGNvbnRyYWN0XHJcbiAgICogQHBhcmFtIHBhcmFtcyBQYXJhbXMgdG8gcGFzcyBpbnRvIHRoZSBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZXBsb3koYnl0ZXM6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgY29uc3QgY29uc3RydWN0b3IgPSB0aGlzLmFiaS5maW5kKGRlZiA9PiBkZWYudHlwZSA9PT0gJ2NvbnN0cnVjdG9yJyk7XHJcbiAgICBjb25zdCBub1BhcmFtID0gcGFyYW1zLmxlbmd0aCA9PT0gMDtcclxuICAgIGNvbnN0IGRhdGEgPSBub1BhcmFtID8gYnl0ZXMgOiB0aGlzLmVuY29kZXIuZW5jb2RlQ29uc3RydWN0b3IoY29uc3RydWN0b3IsIGJ5dGVzLCBwYXJhbXMpO1xyXG4gICAgcmV0dXJuIHRoaXMuZmlsbEdhcyh7IC4uLnRoaXMucHJvdmlkZXIuZGVmYXVsdFR4LCBkYXRhIH0pXHJcbiAgICAgIC5waXBlKHN3aXRjaE1hcCh0eCA9PiB0aGlzLnByb3ZpZGVyLnNlbmRUcmFuc2FjdGlvbih0eCkpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVzZWQgZm9yICdjYWxsJyBtZXRob2RzXHJcbiAgICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGNhbGxcclxuICAgKiBAcGFyYW0gcGFyYW1zIFRoZSBwYXJhbXMgZ2l2ZW4gYnkgdGhlIHVzZXJcclxuICAgKi9cclxuICBwcml2YXRlIGNhbGxNZXRob2QobWV0aG9kOiBBQklEZWZpbml0aW9uLCAuLi5wYXJhbXM6IGFueVtdKSB7XHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5lbmNvZGVyLmVuY29kZU1ldGhvZChtZXRob2QsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAuY2FsbDxzdHJpbmc+KHRoaXMuYWRkcmVzcywgZGF0YSlcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgbWFwKHJlc3VsdCA9PiB0aGlzLmRlY29kZXIuZGVjb2RlT3V0cHV0cyhyZXN1bHQsIG1ldGhvZC5vdXRwdXRzKSksXHJcbiAgICAgICAgbWFwKHJlc3VsdCA9PiByZXN1bHRbT2JqZWN0LmtleXMocmVzdWx0KVswXV0pXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIGZvciAnc2VuZCcgbWV0aG9kc1xyXG4gICAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBzZW5kXHJcbiAgICogQHBhcmFtIHBhcmFtcyBUaGUgcGFyYW1zIGdpdmVuIGJ5IHRoZSB1c2VyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZW5kTWV0aG9kKG1ldGhvZDogQUJJRGVmaW5pdGlvbiwgLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgY29uc3QgeyB0bywgZGF0YSB9ID0geyB0bzogdGhpcy5hZGRyZXNzLCBkYXRhOiB0aGlzLmVuY29kZXIuZW5jb2RlTWV0aG9kKG1ldGhvZCwgcGFyYW1zKSB9O1xyXG4gICAgcmV0dXJuIHRoaXMuZmlsbEdhcyh7IC4uLnRoaXMucHJvdmlkZXIuZGVmYXVsdFR4LCB0bywgZGF0YSB9KVxyXG4gICAgICAucGlwZShzd2l0Y2hNYXAodHggPT4gdGhpcy5wcm92aWRlci5zZW5kVHJhbnNhY3Rpb24odHgpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIGZvciAnZXZlbnQnIGRlZmluaXRpb25cclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IGRlZmluaXRpb24gaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZXZlbnRNZXRob2QoZXZlbnQ6IEFCSURlZmluaXRpb24pIHtcclxuICAgIGNvbnN0IHRvcGljcyA9IHRoaXMuZW5jb2Rlci5lbmNvZGVFdmVudChldmVudCk7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ldmVudCh0aGlzLmFkZHJlc3MsIFt0b3BpY3NdKS5waXBlKFxyXG4gICAgICBtYXAobG9ncyA9PiB0aGlzLmRlY29kZXIuZGVjb2RlRXZlbnQobG9ncy50b3BpY3MsIGxvZ3MuZGF0YSwgZXZlbnQuaW5wdXRzKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGaWxsIHRoZSBlc3RpbWF0ZWQgYW1vdW50IG9mIGdhcyBhbmQgZ2FzUHJpY2UgdG8gdXNlIGZvciBhIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHR4IFRoZSByYXcgdHJhbnNhY3Rpb24gdG8gZXN0aW1hdGUgdGhlIGdhcyBmcm9tXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBmaWxsR2FzKHR4OiBQYXJ0aWFsPElUeE9iamVjdD4pOiBPYnNlcnZhYmxlPFBhcnRpYWw8SVR4T2JqZWN0Pj4ge1xyXG4gICAgcmV0dXJuIGZvcmtKb2luKFxyXG4gICAgICB0aGlzLnByb3ZpZGVyLmVzdGltYXRlR2FzKHR4KSxcclxuICAgICAgdGhpcy5wcm92aWRlci5nYXNQcmljZSgpXHJcbiAgICApLnBpcGUobWFwKChbZ2FzLCBnYXNQcmljZV0pID0+IHtcclxuICAgICAgICByZXR1cm4geyAuLi50eCwgZ2FzLCBnYXNQcmljZSB9XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBOZ01vZHVsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb250cmFjdE1vZHVsZSB7fVxyXG4iLCJpbXBvcnQgeyBBQklJbnB1dCB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGFuIGFycmF5IG9mIHBhcmFtcyBiYXNlZCBvbiB0aGUgc2l6ZSBvZiB0aGUgYXJyYXkgaW4gdGhlIEFCSSBhbmQgdGhlIG1vZGVsXHJcbiAqIEBwYXJhbSBzaXplIFRoZSBhbW91bnQgb2YgZWxlbWVudHMgaW4gdGhlIGFycmF5XHJcbiAqIEBwYXJhbSBwYXJhbSBUaGUgbW9kZWwgb2YgcGFyYW0gdG8gYmFzZWQgdGhlIG5ldyBhcnJheSBvblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFtRnJvbUFycmF5KHNpemU6IG51bWJlciwgcGFyYW06IEFCSUlucHV0KSB7XHJcbiAgY29uc3QgdHlwZSA9IG5lc3RlZFR5cGUocGFyYW0udHlwZSk7XHJcbiAgY29uc3QgcGFyYW1Nb2RlbCA9IHsgLi4ucGFyYW0sIG5hbWU6ICcnLCB0eXBlOiB0eXBlIH07ICAvLyBSZW1vdmUgbmFtZSB0byBhdm9pZCBjb25mbGljdFxyXG4gIHJldHVybiBBcnJheShzaXplKS5maWxsKHBhcmFtTW9kZWwpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBzaXplIG9mIHRoZSBmaXhlZCBhcnJheSBhc2sgYnkgdGhlIEFCSVxyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgYXJyYXlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmaXhlZEFycmF5U2l6ZSh0eXBlOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gIGNvbnN0IGxhc3RBcnJheVN0ciA9IG5lc3RlZEFycmF5KHR5cGUpLnBvcCgpO1xyXG4gIGNvbnN0IGxhc3RBcnJheSA9IEpTT04ucGFyc2UobGFzdEFycmF5U3RyKTtcclxuICBpZiAobGFzdEFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBBcnJheSBvZiB0eXBlICR7dHlwZX0gaXMgbm90IGEgZml4ZWQgYXJyYXlgKTtcclxuICB9XHJcbiAgcmV0dXJuIHBhcnNlSW50KGxhc3RBcnJheVswXSwgMTApO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIHR1cGxlIGlzIHN0YXRpY1xyXG4gKiBAcGFyYW0gdHVwbGUgVGhlIHR1cGxlIG9iamVjdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhdGljVHVwbGUodHVwbGU6IEFCSUlucHV0KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR1cGxlLnR5cGUgPT09ICd0dXBsZScgIC8vIFByZXZlbnQgdHlwZSB0byBiZSAndHVwbGVbXSdcclxuICAgICYmIHR1cGxlLmNvbXBvbmVudHNcclxuICAgICYmIHR1cGxlLmNvbXBvbmVudHMuZmlsdGVyKHBhcmFtID0+ICFpc1N0YXRpYyhwYXJhbSkpLmxlbmd0aCA9PT0gMFxyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgYXJyYXkgaXMgc3RhdGljXHJcbiAqIEBwYXJhbSBhcnIgVGhlIGFycmF5IG9iamVjdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhdGljQXJyYXkoYXJyOiBBQklJbnB1dCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBpc0ZpeGVkQXJyYXkoYXJyLnR5cGUpXHJcbiAgICAmJiBpc1N0YXRpYyh7Li4uYXJyLCB0eXBlOiBuZXN0ZWRUeXBlKGFyci50eXBlKX0pIC8vIE5lc3RlZCBUeXBlIGlzIHN0YXRpY1xyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgb3V0cHV0IGlzIHN0YXRpY1xyXG4gKiBAcGFyYW0gb3V0cHV0IFRoZSBvdXRwdXQgZGVmaW5lZCBpbiB0aGUgYWJpXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNTdGF0aWMob3V0cHV0OiBBQklJbnB1dCk6IGJvb2xlYW4ge1xyXG4gIGNvbnN0IHR5cGUgPSBvdXRwdXQudHlwZTtcclxuICBzd2l0Y2ggKHRydWUpIHtcclxuICAgIC8vIEFycmF5XHJcbiAgICBjYXNlIC9cXFsoWzAtOV0qKVxcXS8udGVzdCh0eXBlKTpcclxuICAgICAgcmV0dXJuIGlzU3RhdGljQXJyYXkob3V0cHV0KTtcclxuICAgIC8vIFR1cGxlXHJcbiAgICBjYXNlIC90dXBsZT8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgcmV0dXJuIGlzU3RhdGljVHVwbGUob3V0cHV0KTtcclxuICAgIH1cclxuICAgIC8vIER5bmFtaWNcclxuICAgIGNhc2UgL3N0cmluZz8vLnRlc3QodHlwZSk6XHJcbiAgICBjYXNlIC9ieXRlcz9cXGIvLnRlc3QodHlwZSk6XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vIFN0YXRpY1xyXG4gICAgY2FzZSAvYnl0ZXM/Ly50ZXN0KHR5cGUpOlxyXG4gICAgY2FzZSAvaW50Py8udGVzdCh0eXBlKTpcclxuICAgIGNhc2UgL2FkZHJlc3M/Ly50ZXN0KHR5cGUpOlxyXG4gICAgY2FzZSAvYm9vbD8vLnRlc3QodHlwZSk6XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSBhcnJheSBpcyBmaXhlZFxyXG4gKiBAcGFyYW0gdHlwZSBUeXBlIG9mIHRoZSBhcnJheVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRml4ZWRBcnJheSh0eXBlOiBzdHJpbmcpIHtcclxuICByZXR1cm4gL1xcW1swLTldXFxdLy50ZXN0KHR5cGUpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGxhc3QgW10gaW4gdHlwZVxyXG4gKiBAZXhhbXBsZSBpbnRbMzJdID0+IGludFxyXG4gKiBAZXhhbXBsZSBpbnRbMl1bM10gPT4gaW50WzJdXHJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIHRvIG1vZGlmeVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG5lc3RlZFR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBhcnJheXMgPSBuZXN0ZWRBcnJheSh0eXBlKTtcclxuICBpZiAoIWFycmF5cykgeyByZXR1cm4gdHlwZTsgfVxyXG4gIGNvbnN0IGxhc3RBcnJheSA9IGFycmF5c1thcnJheXMubGVuZ3RoIC0gMV07XHJcbiAgcmV0dXJuIHR5cGUuc3Vic3RyaW5nKDAsIHR5cGUubGVuZ3RoIC0gbGFzdEFycmF5Lmxlbmd0aCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgcmV0dXJuIGFycmF5IG9mIG5lc3RlZCB0eXBlc1xyXG4gKiBAZXhhbXBsZSBpbnRbMl1bM11bXSA9PiBbWzJdLCBbM10sIFtdXVxyXG4gKiBAZXhhbXBsZSBpbnRbXSA9PiBbW11dXHJcbiAqIEBleGFtcGxlIGludCA9PiBudWxsXHJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIHRvIG1hdGNoXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbmVzdGVkQXJyYXkodHlwZTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gIHJldHVybiB0eXBlLm1hdGNoKC8oXFxbWzAtOV0qXFxdKS9nKTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgQk4gfSBmcm9tICdibi5qcyc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJhY3RNb2R1bGUgfSBmcm9tICcuLy4uL2NvbnRyYWN0Lm1vZHVsZSc7XHJcbmltcG9ydCB7XHJcbiAgaXNTdGF0aWMsXHJcbiAgaXNGaXhlZEFycmF5LFxyXG4gIGZpeGVkQXJyYXlTaXplLFxyXG4gIHBhcmFtRnJvbUFycmF5LFxyXG4gIGlzU3RhdGljVHVwbGUsXHJcbiAgaXNTdGF0aWNBcnJheSB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIEFCSU91dHB1dCxcclxuICBBQklJbnB1dCxcclxuICBoZXhUb051bWJlcixcclxuICBoZXhUb1V0ZjgsXHJcbiAgaGV4VG9OdW1iZXJTdHJpbmcsXHJcbiAgdG9DaGVja3N1bUFkZHJlc3NcclxufSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlY29kZWRQYXJhbSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHJlc3VsdDogRGVjb2RlZFBhcmFtLCBwdWJsaWMgb2Zmc2V0OiBudW1iZXIpIHt9XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogQ29udHJhY3RNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEFCSURlY29kZXIge1xyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgYW4gZXZlbnQgb3V0cHV0XHJcbiAgICogQHBhcmFtIHRvcGljcyBUaGUgdG9waWNzIG9mIHRoZSBsb2dzIChpbmRleGVkIHZhbHVlcylcclxuICAgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBvZiB0aGUgbG9ncyAoYnl0ZXMpXHJcbiAgICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXRzIGdpdmVudCBieSB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUV2ZW50KHRvcGljczogc3RyaW5nW10sIGRhdGE6IHN0cmluZywgaW5wdXRzOiBBQklJbnB1dFtdKTogYW55IHtcclxuICAgIGNvbnN0IG91dHB1dHMgPSB0aGlzLmRlY29kZU91dHB1dHMoZGF0YSwgaW5wdXRzKTtcclxuICAgIGlucHV0c1xyXG4gICAgICAuZmlsdGVyKGlucHV0ID0+IGlucHV0LmluZGV4ZWQpXHJcbiAgICAgIC5mb3JFYWNoKChpbnB1dCwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRvcGljID0gdG9waWNzW2kgKyAxXS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgICAgICAvLyBJZiBpbmRleGVkIHZhbHVlIGlzIHN0YXRpYyBkZWNvZGUsIGVsc2UgcmV0dXJuIGFzIGl0XHJcbiAgICAgICAgb3V0cHV0c1tpbnB1dC5uYW1lXSA9IGlzU3RhdGljKGlucHV0KSA/IHRoaXMuZGVjb2RlQnl0ZXModG9waWMsIGlucHV0KSA6IHRvcGljO1xyXG4gICAgICB9KTtcclxuICAgIHJldHVybiBvdXRwdXRzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtYXAgdGhlIGJ5dGVzIHRvIGRlY29kZSBkZXBlbmRpbmcgb24gaXRzIHR5cGVcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIHRvIGRlY29kZVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIG91dHB1dCBkZXNjcmliZWQgaW4gdGhlIEFiaVxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVCeXRlcyhieXRlczogc3RyaW5nLCBvdXRwdXQ6IEFCSU91dHB1dCkge1xyXG4gICAgY29uc3QgdHlwZSA9IG91dHB1dC50eXBlO1xyXG4gICAgLy8gQ29tcGFyZSB0cnVlIHdpdGggdGhlIHJlc3VsdCBvZiB0aGUgY2FzZXNcclxuICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAvLyBBcnJheTogTXVzdCBiZSBmaXJzdFxyXG4gICAgICBjYXNlIC9cXFsoWzAtOV0qKVxcXS8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVBcnJheShieXRlcywgb3V0cHV0KTtcclxuICAgICAgLy8gVHVwbGVcclxuICAgICAgY2FzZSAvdHVwbGU/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZVR1cGxlKGJ5dGVzLCBvdXRwdXQuY29tcG9uZW50cyk7XHJcbiAgICAgIC8vIFN0cmluZ1xyXG4gICAgICBjYXNlIC9zdHJpbmc/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZVN0cmluZyhieXRlcyk7XHJcbiAgICAgIC8vIER5bmFtaWMgQnl0ZXNcclxuICAgICAgY2FzZSAvYnl0ZXM/XFxiLy50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZUR5bmFtaWNCeXRlcyhieXRlcyk7XHJcbiAgICAgIC8vIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2J5dGVzPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVTdGF0aWNCeXRlcyhieXRlcyk7XHJcbiAgICAgIC8vIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2ludD8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlSW50KGJ5dGVzKTtcclxuICAgICAgLy8gQWRkcmVzc1xyXG4gICAgICBjYXNlIC9hZGRyZXNzPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVBZGRyZXNzKGJ5dGVzKTtcclxuICAgICAgLy8gQm9vbFxyXG4gICAgICBjYXNlIC9ib29sPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVCb29sKGJ5dGVzKTtcclxuICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgdGhlIGRlY29kZXIgZm9yIHRoZSB0eXBlIDogJyArIHR5cGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgdGhlIG91dHB1dHMgOiBTdGFydCBmcm9tIHRoZSBsYXN0IHRvIHRoZSBmaXJzdCAodG8ga25vdyB0aGUgbGVuZ3RoIG9mIHRoZSB0YWlsKVxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhlIG91dHB1dHNcclxuICAgKiBAcGFyYW0gb3V0cHV0cyBUaGUgb3V0cHV0cyBmcm9tIHRoZSBhYmlcclxuICAgKi9cclxuICBwdWJsaWMgZGVjb2RlT3V0cHV0cyhieXRlczogc3RyaW5nLCBvdXRwdXRzOiAoQUJJT3V0cHV0IHwgQUJJSW5wdXQpW10pOiBhbnkge1xyXG4gICAgYnl0ZXMgPSBieXRlcy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIGNvbnN0IGluaXQgPSB7IHJlc3VsdDoge30sIG9mZnNldDogYnl0ZXMubGVuZ3RoIH07XHJcbiAgICByZXR1cm4gb3V0cHV0c1xyXG4gICAgICAuZmlsdGVyKG91dHB1dCA9PiAhKDxBQklJbnB1dD5vdXRwdXQpLmluZGV4ZWQpIC8vIFJlbW92ZSBpbmRleGVkIHZhbHVlc1xyXG4gICAgICAucmVkdWNlUmlnaHQoKGFjYzogRGVjb2RlZFBhcmFtLCBvdXRwdXQ6IEFCSU91dHB1dCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVhZCA9IHRoaXMuZ2V0SGVhZChieXRlcywgb3V0cHV0cywgaSk7XHJcbiAgICAgICAgaWYgKGlzU3RhdGljKG91dHB1dCkpIHtcclxuICAgICAgICAgIGFjYy5yZXN1bHRbb3V0cHV0Lm5hbWUgfHwgaV0gPSB0aGlzLmRlY29kZUJ5dGVzKGhlYWQsIG91dHB1dCk7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IERlY29kZWRQYXJhbShhY2MucmVzdWx0LCBhY2Mub2Zmc2V0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgdGFpbFN0YXJ0ID0gaGV4VG9OdW1iZXIoaGVhZCkgKiAyOyAvLyB0cmFuc2Zvcm0gYnl0ZXMgdG8gaGV4XHJcbiAgICAgICAgICBjb25zdCB0YWlsRW5kID0gYWNjLm9mZnNldDtcclxuICAgICAgICAgIGNvbnN0IHRhaWwgPSBieXRlcy5zdWJzdHJpbmcodGFpbFN0YXJ0LCB0YWlsRW5kKTtcclxuICAgICAgICAgIGFjYy5yZXN1bHRbb3V0cHV0Lm5hbWUgfHwgaV0gPSB0aGlzLmRlY29kZUJ5dGVzKHRhaWwsIG91dHB1dCk7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IERlY29kZWRQYXJhbShhY2MucmVzdWx0LCB0YWlsU3RhcnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgaW5pdFxyXG4gICAgKS5yZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgYSBhcnJheVxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhpcyBhcnJheVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIG91dHB1dCBvYmplY3QgZGVmaW5lZCBpbiB0aGUgYWJpXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUFycmF5KGJ5dGVzOiBzdHJpbmcsIG91dHB1dDogQUJJT3V0cHV0KTogYW55W10ge1xyXG4gICAgbGV0IGFtb3VudDogbnVtYmVyO1xyXG4gICAgaWYgKGlzRml4ZWRBcnJheShvdXRwdXQudHlwZSkpIHtcclxuICAgICAgYW1vdW50ID0gZml4ZWRBcnJheVNpemUob3V0cHV0LnR5cGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW1vdW50ID0gaGV4VG9OdW1iZXIoYnl0ZXMuc2xpY2UoMCwgNjQpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5lc3RlZEJ5dGVzID0gaXNGaXhlZEFycmF5KG91dHB1dC50eXBlKSA/IGJ5dGVzIDogYnl0ZXMuc2xpY2UoNjQpO1xyXG4gICAgY29uc3Qgb3V0cHV0QXJyYXkgPSBwYXJhbUZyb21BcnJheShhbW91bnQsIG91dHB1dCk7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy5kZWNvZGVPdXRwdXRzKG5lc3RlZEJ5dGVzLCBvdXRwdXRBcnJheSk7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGVjb2RlZCkubWFwKGtleSA9PiBkZWNvZGVkW2tleV0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIHR1cGxlICovXHJcbiAgcHVibGljIGRlY29kZVR1cGxlKGJ5dGVzOiBzdHJpbmcsIG91dHB1dHM6IEFCSU91dHB1dFtdKTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLmRlY29kZU91dHB1dHMoYnl0ZXMsIG91dHB1dHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIHN0cmluZyAqL1xyXG4gIHB1YmxpYyBkZWNvZGVTdHJpbmcoYnl0ZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdHIgPSBieXRlcy5zbGljZSg2NCk7XHJcbiAgICByZXR1cm4gaGV4VG9VdGY4KHN0cik7XHJcbiAgfVxyXG5cclxuICAvKiogRGVjb2RlIGEgZHluYW1pYyBieXRlICovXHJcbiAgcHVibGljIGRlY29kZUR5bmFtaWNCeXRlcyhieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGFtb3VudCA9IGhleFRvTnVtYmVyKGJ5dGVzLnNsaWNlKDAsIDY0KSk7XHJcbiAgICByZXR1cm4gYnl0ZXMuc2xpY2UoNjQpLnN1YnN0cmluZygwLCBhbW91bnQgKiAyKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSBzdGF0aWMgYnl0ZSAqL1xyXG4gIHB1YmxpYyBkZWNvZGVTdGF0aWNCeXRlcyhieXRlczogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gYnl0ZXMucmVwbGFjZSgvXFxiMCsoMCspLywgJycpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIGEgdWludCBvciBpbnRcclxuICAgKiBXQVJOSU5HIDogUmV0dXJuIGEgc3RyaW5nXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUludChieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGlzTmVnYXRpdmUgPSAodmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICByZXR1cm4gKG5ldyBCTih2YWx1ZS5zdWJzdHIoMCwgMSksIDE2KS50b1N0cmluZygyKS5zdWJzdHIoMCwgMSkpID09PSAnMSc7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNOZWdhdGl2ZShieXRlcykpIHtcclxuICAgICAgcmV0dXJuIG5ldyBCTihieXRlcywgMTYpLmZyb21Ud29zKDI1NikudG9TdHJpbmcoMTApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhleFRvTnVtYmVyU3RyaW5nKGJ5dGVzKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYW4gYWRkcmVzcyAqL1xyXG4gIHB1YmxpYyBkZWNvZGVBZGRyZXNzKGJ5dGVzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRvQ2hlY2tzdW1BZGRyZXNzKGJ5dGVzLnN1YnN0cmluZygyNCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIGJvb2xlYW4gKi9cclxuICBwdWJsaWMgZGVjb2RlQm9vbChieXRlczogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBsYXN0ID0gYnl0ZXMuc3Vic3RyaW5nKDYzKTtcclxuICAgIHJldHVybiBsYXN0ID09PSAnMScgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKioqKioqXHJcbiAgICogSEVBRFxyXG4gICAqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybiB0aGUgaGVhZCBwYXJ0IG9mIHRoZSBvdXRwdXRcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIG9mIHRoZSBvdXRwdXRTXHJcbiAgICogQHBhcmFtIG91dHB1dHMgVGhlIGxpc3Qgb2Ygb3V0cHV0c1xyXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG91dHB1dCB0byBjaGVjayBpbiB0aGUgb3V0cHV0c1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0SGVhZChieXRlczogc3RyaW5nLCBvdXRwdXRzOiBBQklPdXRwdXRbXSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXg7IGkrKykge1xyXG4gICAgICBpZiAoaXNTdGF0aWNUdXBsZShvdXRwdXRzW2ldKSkge1xyXG4gICAgICAgIGNvbnN0IGhlYWQgPSB0aGlzLmdldEFsbEhlYWRzKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2ldLmNvbXBvbmVudHMpO1xyXG4gICAgICAgIG9mZnNldCArPSBoZWFkLmxlbmd0aDtcclxuICAgICAgfSBlbHNlIGlmIChpc1N0YXRpY0FycmF5KG91dHB1dHNbaV0pKSB7XHJcbiAgICAgICAgb2Zmc2V0ICs9IHRoaXMuc3RhdGljQXJyYXlTaXplKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2luZGV4XSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2Zmc2V0ICs9IDY0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXNTdGF0aWNUdXBsZShvdXRwdXRzW2luZGV4XSkpIHtcclxuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5nZXRBbGxIZWFkcyhieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpbmRleF0uY29tcG9uZW50cykubGVuZ3RoXHJcbiAgICAgIHJldHVybiBieXRlcy5zdWJzdHIob2Zmc2V0LCBsZW5ndGgpO1xyXG4gICAgfSBlbHNlIGlmKGlzU3RhdGljQXJyYXkob3V0cHV0c1tpbmRleF0pKSB7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc3RhdGljQXJyYXlTaXplKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2luZGV4XSk7XHJcbiAgICAgIHJldHVybiBieXRlcy5zdWJzdHIob2Zmc2V0LCBsZW5ndGgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGJ5dGVzLnN1YnN0cihvZmZzZXQsIDY0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgc2l6ZSBvZiBhIHN0YXRpYyBhcnJheVxyXG4gICAqIEBwYXJhbSBieXRlcyBCeXRlcyBzdGFydGluZyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIGFycmF5IG1vZGVsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzdGF0aWNBcnJheVNpemUoYnl0ZXM6IHN0cmluZywgb3V0cHV0OiBBQklPdXRwdXQpIHtcclxuICAgIGNvbnN0IHNpemUgPSBmaXhlZEFycmF5U2l6ZShvdXRwdXQudHlwZSk7XHJcbiAgICBjb25zdCBvdXRwdXRBcnJheSA9IHBhcmFtRnJvbUFycmF5KHNpemUsIG91dHB1dCk7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRBbGxIZWFkcyhieXRlcywgb3V0cHV0QXJyYXkpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhbGwgaGVhZHMgZnJvbSBzdGF0aWMgYXJyYXlzIG9yIHR1cGxlc1xyXG4gICAqIEBwYXJhbSBieXRlcyBCeXRlcyBzdGFydGluZyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheSBvciB0dXBsZVxyXG4gICAqIEBwYXJhbSBvdXRwdXRzIFRoZSBvdXRwdXRzIGdpdmVuIGJ5IHRoZSBBQkkgZm9yIHRoaXMgYXJyYXkgb3IgdHVwbGVcclxuICAgKi9cclxuICBwcml2YXRlIGdldEFsbEhlYWRzKGJ5dGVzOiBzdHJpbmcsIG91dHB1dHM6IEFCSU91dHB1dFtdKSB7XHJcbiAgICByZXR1cm4gb3V0cHV0cy5yZWR1Y2VSaWdodCgoYWNjOiBzdHJpbmcsIG91dHB1dDogQUJJT3V0cHV0LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICByZXR1cm4gYWNjICsgdGhpcy5nZXRIZWFkKGJ5dGVzLCBvdXRwdXRzLCBpKTtcclxuICAgICAgfSwnJyk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFCSUlucHV0LCBudW1iZXJUb0hleCwgdXRmOFRvSGV4LCB0b0JOLCBBQklEZWZpbml0aW9uLCBrZWNjYWsyNTYgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBDb250cmFjdE1vZHVsZSB9IGZyb20gJy4uL2NvbnRyYWN0Lm1vZHVsZSc7XHJcbmltcG9ydCB7IGlzU3RhdGljLCBpc0ZpeGVkQXJyYXksIHBhcmFtRnJvbUFycmF5LCBmaXhlZEFycmF5U2l6ZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVuY29kZWRQYXJhbSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGhlYWQ6IHN0cmluZyA9ICcnLCBwdWJsaWMgdGFpbCA9ICcnKSB7fVxyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IENvbnRyYWN0TW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBBQklFbmNvZGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSB0aGUgY29uc3RydWN0b3IgbWV0aG9kIGZvciBkZXBsb3lpbmdcclxuICAgKiBAcGFyYW0gY29uc3RydWN0b3IgVGhlIGNvbnN0cnVjdG9yIHBhcmFtIGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgY29udGVudCBvZiB0aGUgY29udHJhY3RcclxuICAgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnRzIHRvIHBhc3MgaW50byB0aGUgY29uc3RydWN0b3IgaWYgYW55XHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZUNvbnN0cnVjdG9yKFxyXG4gICAgY29uc3RydWN0b3I6IEFCSURlZmluaXRpb24sXHJcbiAgICBieXRlczogc3RyaW5nLFxyXG4gICAgYXJncz86IGFueVtdXHJcbiAgKSB7XHJcbiAgICBjb25zdCBlbmNvZGVkID0gdGhpcy5lbmNvZGVJbnB1dHMoYXJncywgY29uc3RydWN0b3IuaW5wdXRzKTtcclxuICAgIHJldHVybiBieXRlcyArIGVuY29kZWQuaGVhZCArIGVuY29kZWQudGFpbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSB0aGUgd2hvbGUgbWV0aG9kXHJcbiAgICogQHBhcmFtIG1laHRvZCBUaGUgbWV0aG9kIHRoZSBlbmNvZGUgaGFzIGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqIEBwYXJhbSBhcmdzIFRoZSBsaXN0IG9mIGFyZ3VtZW50cyBnaXZlbiBieSB0aGUgdXNlclxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGVNZXRob2QobWV0aG9kOiBBQklEZWZpbml0aW9uLCBhcmdzOiBhbnlbXSkge1xyXG4gICAgLy8gQ3JlYXRlIGFuZCBzaWduIG1ldGhvZFxyXG4gICAgY29uc3QgeyBuYW1lLCBpbnB1dHMgfSA9IG1ldGhvZDtcclxuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHRoaXMuc2lnbk1ldGhvZChtZXRob2QpO1xyXG4gICAgY29uc3QgaGFzaFNpZ24gPSBrZWNjYWsyNTYoc2lnbmF0dXJlKS5zbGljZSgwLCAxMCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSBlbmNvZGVkIGFyZ3VtZW50c1xyXG4gICAgY29uc3QgZW5jb2RlZCA9IHRoaXMuZW5jb2RlSW5wdXRzKGFyZ3MsIGlucHV0cyk7XHJcbiAgICByZXR1cm4gaGFzaFNpZ24gKyBlbmNvZGVkLmhlYWQgKyBlbmNvZGVkLnRhaWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYW4gZXZlbnRcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIGVuY29kZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGVFdmVudChldmVudDogQUJJRGVmaW5pdGlvbik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB7IG5hbWUsIGlucHV0cyB9ID0gZXZlbnQ7XHJcbiAgICBjb25zdCBzaWduYXR1cmUgPSB0aGlzLnNpZ25NZXRob2QoZXZlbnQpO1xyXG4gICAgcmV0dXJuIGtlY2NhazI1NihzaWduYXR1cmUpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKioqKioqKioqKioqKioqIFNJR05BVFVSRSAqKioqKioqKioqKioqKioqKlxyXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBzdHJpbmcgZm9yIHRoZSBzaWduYXR1cmUgYmFzZWQgb24gdGhlIHBhcmFtcyBpbiB0aGUgQUJJXHJcbiAgICogQHBhcmFtIHBhcmFtcyBUaGUgcGFyYW1zIGdpdmVuIGJ5IHRoZSBBQkkuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaWduSW5wdXRzKGlucHV0czogQUJJSW5wdXRbXSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gaW5wdXRzXHJcbiAgICAgIC5tYXAoaW5wdXQgPT4gaW5wdXQuY29tcG9uZW50cyA/IHRoaXMudHVwbGVUeXBlKGlucHV0KSA6IGlucHV0LnR5cGUpXHJcbiAgICAgIC5qb2luKCcsJyk7XHJcbiAgfVxyXG5cclxuICAvKiogUmV0dXJuIHRoZSB0eXBlIG9mIGEgdHVwbGUgbmVlZGVkIGZvciB0aGUgc2lnbmF0dXJlICovXHJcbiAgcHJpdmF0ZSB0dXBsZVR5cGUodHVwbGU6IEFCSUlucHV0KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGlubmVyVHlwZXMgPSB0aGlzLnNpZ25JbnB1dHModHVwbGUuY29tcG9uZW50cyk7XHJcbiAgICBjb25zdCBhcnJheVBhcnQgPSB0dXBsZS50eXBlLnN1YnN0cig1KTtcclxuICAgIHJldHVybiBgKCR7aW5uZXJUeXBlc30pJHthcnJheVBhcnR9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSBzcGVjaWZpYyBtZXRob2QgYmFzZWQgb24gdGhlIEFCSVxyXG4gICAqIEBwYXJhbSBtZWh0b2QgVGhlIG1ldGhvZCB0aGUgZW5jb2RlIGhhcyBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwcml2YXRlIHNpZ25NZXRob2QobWV0aG9kOiBBQklEZWZpbml0aW9uKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgaW5wdXRzIH0gPSBtZXRob2Q7XHJcbiAgICBjb25zdCB0eXBlcyA9IHRoaXMuc2lnbklucHV0cyhpbnB1dHMpO1xyXG4gICAgcmV0dXJuIGAke25hbWV9KCR7dHlwZXN9KWA7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqKioqKioqKioqKioqKioqIEVOQ09ERSAqKioqKioqKioqKioqKioqKioqXHJcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCB0byB0aGUgcmlnaHQgZW5jb2RlciBkZXBlbmRpbmcgb24gdGhlIHR5cGVcclxuICAgKiBAcGFyYW0gYXJnIHRoZSBhcmcgb2YgdGhlIGlucHV0XHJcbiAgICogQHBhcmFtIGlucHV0IHRoZSBpbnB1dCBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlKGFyZzogYW55LCBpbnB1dDogQUJJSW5wdXQpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgdHlwZSA9IGlucHV0LnR5cGU7XHJcbiAgICAvLyBDb21wYXJlIHRydWUgd2l0aCB0aGUgcmVzdWx0IG9mIHRoZSBjYXNlc1xyXG4gICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgIC8vIEFycmF5OiBNdXN0IGJlIGZpcnN0XHJcbiAgICAgIGNhc2UgL1xcWyhbMC05XSopXFxdLy50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQXJyYXkoYXJnLCBpbnB1dCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gVHVwbGVcclxuICAgICAgY2FzZSAvdHVwbGU/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgLy8gR2V0IGFyZ3MgZ2l2ZW4gYXMgYW4gb2JqZWN0XHJcbiAgICAgICAgY29uc3QgYXJncyA9IE9iamVjdC5rZXlzKGFyZykubWFwKGtleSA9PiBhcmdba2V5XSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlVHVwbGUoYXJncywgaW5wdXQuY29tcG9uZW50cyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gU3RyaW5nXHJcbiAgICAgIGNhc2UgL3N0cmluZz8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVTdHJpbmcoYXJnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBEeW5hbWljIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2J5dGVzP1xcYi8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUR5bmFtaWNCeXRlcyhhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFN0YXRpYyBCeXRlc1xyXG4gICAgICBjYXNlIC9ieXRlcz8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVTdGF0aWNCeXRlcyhhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEludCAvIFVpbnRcclxuICAgICAgY2FzZSAvaW50Py8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUludChhcmcsIGlucHV0KTtcclxuICAgICAgfVxyXG4gICAgICAvLyBBZGRyZXNzXHJcbiAgICAgIGNhc2UgL2FkZHJlc3M/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQWRkcmVzcyhhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEJvb2xcclxuICAgICAgY2FzZSAvYm9vbD8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVCb29sKGFyZyk7XHJcbiAgICAgIH1cclxuICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgdGhlIGVuY29kZXIgZm9yIHRoZSB0eXBlIDogJyArIHR5cGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKlxyXG4gICAqIFNUQVRJQyBPUiBEWU5BTUlDXHJcbiAgICoqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBhIGxpc3Qgb2YgaW5wdXRzXHJcbiAgICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50cyBnaXZlbiBieSB0aGUgdXNlcnNcclxuICAgKiBAcGFyYW0gaW5wdXRzIFRoZSBpbnB1dHMgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZUlucHV0cyhhcmdzOiBhbnlbXSwgaW5wdXRzOiBBQklJbnB1dFtdKTogRW5jb2RlZFBhcmFtIHtcclxuICAgIGNvbnN0IG9mZnNldCA9IGFyZ3MubGVuZ3RoICogNjQ7XHJcbiAgICBjb25zdCBpbml0ID0gbmV3IEVuY29kZWRQYXJhbSgpO1xyXG4gICAgcmV0dXJuIGlucHV0cy5yZWR1Y2UoXHJcbiAgICAgIChwcmV2OiBFbmNvZGVkUGFyYW0sIGlucHV0OiBBQklJbnB1dCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IHRoaXMuZW5jb2RlKGFyZ3NbaV0sIGlucHV0KVxyXG4gICAgICAgIGNvbnN0IHN1Ym9mZnNldCA9IChvZmZzZXQgKyBwcmV2LnRhaWwubGVuZ3RoKSAvIDI7XHJcbiAgICAgICAgaWYgKGlzU3RhdGljKGlucHV0KSkge1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBFbmNvZGVkUGFyYW0ocHJldi5oZWFkICsgZW5jb2RlZCwgcHJldi50YWlsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGhlYWQgPSBudW1iZXJUb0hleChzdWJvZmZzZXQpLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgICAgICAgaGVhZCA9IHRoaXMucGFkU3RhcnQoaGVhZCwgNjQsICcwJyk7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IEVuY29kZWRQYXJhbShwcmV2LmhlYWQgKyBoZWFkLCBwcmV2LnRhaWwgKyBlbmNvZGVkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgaW5pdFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBhbiBhcnJheVxyXG4gICAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudCBnaXZlbiBieSB0aGUgdXNlciBmb3IgdGhpcyBhcnJheVxyXG4gICAqIEBwYXJhbSBpbnB1dCBUaGUgaW5wdXQgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVBcnJheShhcmdzOiBhbnlbXSwgaW5wdXQ6IEFCSUlucHV0KTogc3RyaW5nIHtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGFyZ3VtZW50cyBmb3VuZCBpbiBhcnJheSAke2lucHV0Lm5hbWV9YCk7XHJcbiAgICB9XHJcbiAgICBsZXQgZW5jb2RlZCA9ICcnO1xyXG4gICAgaWYgKCFpc0ZpeGVkQXJyYXkoaW5wdXQudHlwZSkpIHtcclxuICAgICAgZW5jb2RlZCA9IG51bWJlclRvSGV4KGFyZ3MubGVuZ3RoKS5yZXBsYWNlKCcweCcsICcnKVxyXG4gICAgICBlbmNvZGVkID0gdGhpcy5wYWRTdGFydChlbmNvZGVkLCA2NCwgJzAnKTtcclxuICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggIT09IGZpeGVkQXJyYXlTaXplKGlucHV0LnR5cGUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHthcmdzfSBzaG91bGQgYmUgb2Ygc2l6ZSAke2ZpeGVkQXJyYXlTaXplKGlucHV0LnR5cGUpfWApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW5wdXRzID0gcGFyYW1Gcm9tQXJyYXkoYXJncy5sZW5ndGgsIGlucHV0KTtcclxuICAgIGNvbnN0IHsgaGVhZCwgdGFpbCB9ID0gdGhpcy5lbmNvZGVJbnB1dHMoYXJncywgaW5wdXRzKTtcclxuICAgIHJldHVybiBlbmNvZGVkICsgaGVhZCArIHRhaWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgdGhlIHR1cGxlXHJcbiAgICogQHBhcmFtIGFyZ3MgQXJndW1lbnRzIG9mIHRoaXMgdHVwbGVcclxuICAgKiBAcGFyYW0gaW5wdXRzIElucHV0cyBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZVR1cGxlKGFyZ3M6IGFueVtdLCBpbnB1dHM6IEFCSUlucHV0W10pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgeyBoZWFkLCB0YWlsIH0gPSB0aGlzLmVuY29kZUlucHV0cyhhcmdzLCBpbnB1dHMpO1xyXG4gICAgcmV0dXJuIGhlYWQgKyB0YWlsO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKlxyXG4gICAqIERZTkFNSUNcclxuICAgKioqKioqKioqL1xyXG5cclxuICAvKiogRW5jb2RlIGEgc3RyaW5nICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVTdHJpbmcoYXJnOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIHN0cmluZ2ApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaGV4ID0gdXRmOFRvSGV4KGFyZykucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICBjb25zdCBzaXplID0gbnVtYmVyVG9IZXgoYXJnLmxlbmd0aCkucmVwbGFjZSgnMHgnLCAnJylcclxuICAgIGNvbnN0IGhleFNpemUgPSBoZXgubGVuZ3RoICsgNjQgLSAoaGV4Lmxlbmd0aCAlIDY0KTtcclxuICAgIHJldHVybiB0aGlzLnBhZFN0YXJ0KHNpemUsIDY0LCAnMCcpICsgdGhpcy5wYWRTdGFydChoZXgsIGhleFNpemUsICcwJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYSBkeW5hbWljIGJ5dGVzXHJcbiAgICogQGV4YW1wbGUgYnl0ZXNcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZUR5bmFtaWNCeXRlcyhhcmc6IHN0cmluZykge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIHN0cmluZ2ApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaGV4ID0gYXJnLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgY29uc3Qgc2l6ZSA9IG51bWJlclRvSGV4KGhleC5sZW5ndGggLyAyKS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIGNvbnN0IGhleFNpemUgPSBoZXgubGVuZ3RoICsgNjQgLSAoaGV4Lmxlbmd0aCAlIDY0KTtcclxuICAgIHJldHVybiB0aGlzLnBhZFN0YXJ0KHNpemUsIDY0LCAnMCcpICsgdGhpcy5wYWRFbmQoaGV4LCBoZXhTaXplLCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqXHJcbiAgICogU1RBVElDXHJcbiAgICoqKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYSBzdGF0aWMgYnl0ZXNcclxuICAgKiBAZXhhbXBsZSBieXRlczMsIGJ5dGVzMzJcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZVN0YXRpY0J5dGVzKGFyZzogc3RyaW5nIHwgbnVtYmVyKSB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGFyZyAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgc3RyaW5nIG9yIG51bWJlcmApO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7IGFyZyA9IGFyZy50b1N0cmluZygxNik7IH1cclxuICAgIGNvbnN0IHJlc3VsdCA9IGFyZy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIHJldHVybiB0aGlzLnBhZEVuZChyZXN1bHQsIDQ2LCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGludCBvciB1aW50XHJcbiAgICogQGV4YW1wbGUgaW50LCBpbnQzMiwgdWludDI1NlxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5jb2RlSW50KGFyZzogbnVtYmVyLCBpbnB1dDogQUJJSW5wdXQpIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBudW1iZXJgKTtcclxuICAgIH1cclxuICAgIGlmIChhcmcgJSAxICE9PSAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBwcm92aWRlciBpbnRlZ2VycywgU29saWRpdHkgZG9lcyBub3QgbWFuYWdlIGZsb2F0cycpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlucHV0LnR5cGUuaW5jbHVkZXMoJ3VpbnQnKSAmJiBhcmcgPCAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXCJ1aW50XCIgY2Fubm90IGJlIG5lZ2F0aXZlIGF0IHZhbHVlICR7YXJnfWApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9CTihhcmcpLnRvVHdvcygyNTYpLnRvU3RyaW5nKDE2LCA2NCk7XHJcbiAgfVxyXG5cclxuICAvKiogRW5jb2RlIGFuIGFkZHJlc3MgKi9cclxuICBwcml2YXRlIGVuY29kZUFkZHJlc3MoYXJnOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgYXJnICE9PSAnbnVtYmVyJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBzdHJpbmcgb3IgbnVtYmVyYCk7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHsgYXJnID0gYXJnLnRvU3RyaW5nKDE2KTsgfVxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXJnLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgcmV0dXJuIHRoaXMucGFkU3RhcnQocmVzdWx0LCA2NCwgJzAnKTtcclxuICB9XHJcblxyXG4gIC8qKiBFbmNvZGUgYSBib29sZWFuICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVCb29sKGFyZzogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIGJvb2xlYW5gKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcmcgPyB0aGlzLnBhZFN0YXJ0KCcxJywgNjQsICcwJykgOiB0aGlzLnBhZFN0YXJ0KCcwJywgNjQsICcwJyk7XHJcbiAgfVxyXG5cclxuICAvKioqXHJcbiAgICogUGFkU3RhcnQgLyBQYWRFbmRcclxuICAgKi9cclxuICBwcml2YXRlIHBhZFN0YXJ0KHRhcmdldDogc3RyaW5nLCB0YXJnZXRMZW5ndGg6IG51bWJlciwgcGFkU3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgLyogdHNsaW50OmRpc2FibGUgKi9cclxuICAgIHRhcmdldExlbmd0aCA9IHRhcmdldExlbmd0aCA+PiAwOyAvL3RydW5jYXRlIGlmIG51bWJlciBvciBjb252ZXJ0IG5vbi1udW1iZXIgdG8gMDtcclxuICAgIC8qIHRzbGludDplbmFibGUgKi9cclxuICAgIHBhZFN0cmluZyA9IFN0cmluZyh0eXBlb2YgcGFkU3RyaW5nICE9PSAndW5kZWZpbmVkJyA/IHBhZFN0cmluZyA6ICcgJyk7XHJcbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCA+IHRhcmdldExlbmd0aCkge1xyXG4gICAgICByZXR1cm4gU3RyaW5nKHRhcmdldCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0YXJnZXRMZW5ndGggPSB0YXJnZXRMZW5ndGggLSB0YXJnZXQubGVuZ3RoO1xyXG4gICAgICBpZiAodGFyZ2V0TGVuZ3RoID4gcGFkU3RyaW5nLmxlbmd0aCkge1xyXG4gICAgICAgIHBhZFN0cmluZyArPSBwYWRTdHJpbmcucmVwZWF0KHRhcmdldExlbmd0aCAvIHBhZFN0cmluZy5sZW5ndGgpOyAvL2FwcGVuZCB0byBvcmlnaW5hbCB0byBlbnN1cmUgd2UgYXJlIGxvbmdlciB0aGFuIG5lZWRlZFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBwYWRTdHJpbmcuc2xpY2UoMCwgdGFyZ2V0TGVuZ3RoKSArIFN0cmluZyh0YXJnZXQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcGFkRW5kKHRhcmdldDogc3RyaW5nLCB0YXJnZXRMZW5ndGg6IG51bWJlciwgcGFkU3RyaW5nOiBzdHJpbmcpOiBzdHJpbmd7XHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG4gICAgdGFyZ2V0TGVuZ3RoID0gdGFyZ2V0TGVuZ3RoID4+IDA7IC8vZmxvb3IgaWYgbnVtYmVyIG9yIGNvbnZlcnQgbm9uLW51bWJlciB0byAwO1xyXG4gICAgLyogdHNsaW50OmVuYWJsZSAqL1xyXG4gICAgcGFkU3RyaW5nID0gU3RyaW5nKHR5cGVvZiBwYWRTdHJpbmcgIT09ICd1bmRlZmluZWQnID8gcGFkU3RyaW5nIDogJyAnKTtcclxuICAgIGlmICh0YXJnZXQubGVuZ3RoID4gdGFyZ2V0TGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBTdHJpbmcodGFyZ2V0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRhcmdldExlbmd0aCA9IHRhcmdldExlbmd0aCAtIHRhcmdldC5sZW5ndGg7XHJcbiAgICAgIGlmICh0YXJnZXRMZW5ndGggPiBwYWRTdHJpbmcubGVuZ3RoKSB7XHJcbiAgICAgICAgcGFkU3RyaW5nICs9IHBhZFN0cmluZy5yZXBlYXQodGFyZ2V0TGVuZ3RoIC8gcGFkU3RyaW5nLmxlbmd0aCk7IC8vYXBwZW5kIHRvIG9yaWdpbmFsIHRvIGVuc3VyZSB3ZSBhcmUgbG9uZ2VyIHRoYW4gbmVlZGVkXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFN0cmluZyh0YXJnZXQpICsgcGFkU3RyaW5nLnNsaWNlKDAsIHRhcmdldExlbmd0aCk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb250cmFjdE1vZGVsIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb250cmFjdFByb3ZpZGVyIH0gZnJvbSAnQG5nZXRoL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgQUJJRW5jb2RlciwgQUJJRGVjb2RlciB9IGZyb20gJy4vYWJpJztcclxuaW1wb3J0IHsgQ29udHJhY3RNb2R1bGUgfSBmcm9tICcuL2NvbnRyYWN0Lm1vZHVsZSc7XHJcbmltcG9ydCB7IENvbnRyYWN0Q2xhc3MgfSBmcm9tICcuL2NvbnRyYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb250cmFjdDxUIGV4dGVuZHMgQ29udHJhY3RNb2RlbD4obWV0YWRhdGE6IHtcclxuICBwcm92aWRlcj86IFR5cGU8Q29udHJhY3RQcm92aWRlcj47ICAvLyBUT0RPIDogVXNlIGZvciBjdXN0b20gcHJvdmlkZXIgKHdpdGggQXV0aClcclxuICBhYmk6IGFueVtdIHwgc3RyaW5nO1xyXG4gIGFkZHJlc3Nlcz86IHtcclxuICAgIG1haW5uZXQ/OiBzdHJpbmc7XHJcbiAgICByb3BzdGVuPzogc3RyaW5nO1xyXG4gICAgcmlua2VieT86IHN0cmluZztcclxuICAgIGtvdmFuPzogc3RyaW5nO1xyXG4gIH07XHJcbn0pIHtcclxuICBjb25zdCB7IGFiaSwgYWRkcmVzc2VzIH0gPSBtZXRhZGF0YTtcclxuICBjb25zdCBqc29uSW50ZXJhY2U6IGFueVtdID0gdHlwZW9mIGFiaSA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKGFiaSkgOiBhYmk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgYWRkcmVzcyBvZiB0aGUgY29udHJhY3QgZGVwZW5kaW5nIG9uIHRoZSBpZCBvZiB0aGUgbmV0d29ya1xyXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgb2YgdGhlIG5ldHdvcmtcclxuICAgKi9cclxuICBjb25zdCBnZXRBZGRyZXNzID0gKGlkOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG4gICAgc3dpdGNoKGlkKSB7XHJcbiAgICAgIGNhc2UgMTogcmV0dXJuIGFkZHJlc3Nlc1snbWFpbm5ldCddO1xyXG4gICAgICBjYXNlIDM6IHJldHVybiBhZGRyZXNzZXNbJ3JvcHN0ZW4nXTtcclxuICAgICAgY2FzZSA0OiByZXR1cm4gYWRkcmVzc2VzWydyaW5rZWJ5J107XHJcbiAgICAgIGNhc2UgNDI6IHJldHVybiBhZGRyZXNzZXNbJ2tvdmFuJ107XHJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBhZGRyZXNzZXNbJ21haW5uZXQnXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihCYXNlKSB7XHJcbiAgICBASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IENvbnRyYWN0TW9kdWxlIH0pXHJcbiAgICBjbGFzcyBDb250cmFjdERlY29yYXRlZCBleHRlbmRzIENvbnRyYWN0Q2xhc3M8VD4ge1xyXG4gICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcm90ZWN0ZWQgZW5jb2RlcjogQUJJRW5jb2RlcixcclxuICAgICAgICBwcm90ZWN0ZWQgZGVjb2RlcjogQUJJRGVjb2RlcixcclxuICAgICAgICBwcm90ZWN0ZWQgcHJvdmlkZXI6IENvbnRyYWN0UHJvdmlkZXJcclxuICAgICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZW5jb2RlciwgZGVjb2RlciwgcHJvdmlkZXIsIGpzb25JbnRlcmFjZSwgZ2V0QWRkcmVzcyhwcm92aWRlci5pZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQ29udHJhY3REZWNvcmF0ZWQgYXMgYW55O1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29udHJhY3RDbGFzcyB9IGZyb20gJy4uLy4uL2NvbnRyYWN0JztcclxuaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tICcuLi8uLi9jb250cmFjdC5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBJRW5jb2RlclRlc3RDb250cmFjdCB9IGZyb20gJy4vZW5jb2Rlci10ZXN0Lm1vZGVscyc7XHJcbmNvbnN0IGFiaSA9IHJlcXVpcmUoJy4vZW5jb2Rlci10ZXN0LmFiaS5qc29uJyk7XHJcblxyXG5AQ29udHJhY3Q8SUVuY29kZXJUZXN0Q29udHJhY3Q+KHtcclxuICBhYmk6IGFiaSxcclxuICBhZGRyZXNzZXM6IHtcclxuICAgIHJvcHN0ZW46ICcweDM0NGY2NDFmZjYwZjYzMDhhZDcwYjFlNjIwNTI3NjQ4MzVmNDhlMDAnXHJcbiAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRW5jb2RlclRlc3RDb250cmFjdCBleHRlbmRzIENvbnRyYWN0Q2xhc3M8SUVuY29kZXJUZXN0Q29udHJhY3Q+IHt9XHJcbiIsImltcG9ydCB7IENvbnRyYWN0Q2xhc3MgfSBmcm9tICcuLi8uLi9jb250cmFjdCc7XHJcbmltcG9ydCB7IENvbnRyYWN0LCAgfSBmcm9tICcuLi8uLi9jb250cmFjdC5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBJVGVzdEV2ZW50Q29udHJhY3QgfSBmcm9tICcuL3Rlc3QtZXZlbnQubW9kZWxzJztcclxuY29uc3QgYWJpID0gcmVxdWlyZSgnLi90ZXN0LWV2ZW50LmFiaS5qc29uJyk7XHJcblxyXG5AQ29udHJhY3Q8SVRlc3RFdmVudENvbnRyYWN0Pih7XHJcbiAgYWJpOiBhYmksXHJcbiAgYWRkcmVzc2VzOiB7XHJcbiAgICByb3BzdGVuOiAnMHhjMEQ2QzRjYkExNGFlRkMyMThkMGZmNjY5ZTA3RDczRTc0MDc4MjQ4J1xyXG4gIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIFRlc3RFdmVudENvbnRyYWN0IGV4dGVuZHMgQ29udHJhY3RDbGFzczxJVGVzdEV2ZW50Q29udHJhY3Q+IHt9XHJcbiJdLCJuYW1lcyI6WyJhYmkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBT0E7Ozs7Ozs7O0lBS0UsWUFDWSxPQUFtQixFQUNuQixPQUFtQixFQUNuQixRQUEwQixFQUM1QixLQUNEO1FBSkcsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBQzVCLFFBQUcsR0FBSCxHQUFHO1FBQ0osWUFBTyxHQUFQLE9BQU87dUNBVDRDLEVBQVM7dUNBQ1QsRUFBUzt3Q0FDTixFQUFTO1FBU3RFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFD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