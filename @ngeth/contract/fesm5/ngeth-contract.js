import { __values, __assign, __read, __extends, __decorate } from 'tslib';
import { toChecksumAddress, hexToNumber, hexToUtf8, hexToNumberString, numberToHex, utf8ToHex, toBN, keccak256 } from '@ngeth/utils';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NgModule, Injectable, defineInjectable } from '@angular/core';
import { BN } from 'bn.js';
import { ContractProvider } from '@ngeth/provider';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template T
 */
var  
// unsupported: template constraints.
/**
 * @template T
 */
ContractClass = /** @class */ (function () {
    function ContractClass(encoder, decoder, provider, abi, address) {
        var _this = this;
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
        var /** @type {?} */ calls = [];
        var /** @type {?} */ sends = [];
        var /** @type {?} */ events = [];
        try {
            for (var _a = __values(this.abi), _b = _a.next(); !_b.done; _b = _a.next()) {
                var def = _b.value;
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
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        calls.forEach(function (def) { return (_this.calls[def.name] = _this.callMethod.bind(_this, def)); });
        sends.forEach(function (def) { return (_this.sends[def.name] = _this.sendMethod.bind(_this, def)); });
        events.forEach(function (def) { return (_this.events[def.name] = _this.eventMethod.bind(_this, def)); });
        var e_1, _c;
    }
    /**
     * Deploy the contract on the blockchain
     * @param {?} bytes The bytes of the contract
     * @param {...?} params Params to pass into the constructor
     * @return {?}
     */
    ContractClass.prototype.deploy = /**
     * Deploy the contract on the blockchain
     * @param {?} bytes The bytes of the contract
     * @param {...?} params Params to pass into the constructor
     * @return {?}
     */
    function (bytes) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var /** @type {?} */ constructor = this.abi.find(function (def) { return def.type === 'constructor'; });
        var /** @type {?} */ noParam = params.length === 0;
        var /** @type {?} */ data = noParam ? bytes : this.encoder.encodeConstructor(constructor, bytes, params);
        return this.fillGas(__assign({}, this.provider.defaultTx, { data: data }))
            .pipe(switchMap(function (tx) { return _this.provider.sendTransaction(tx); }));
    };
    /**
     * Used for 'call' methods
     * @param {?} method The method to call
     * @param {...?} params The params given by the user
     * @return {?}
     */
    ContractClass.prototype.callMethod = /**
     * Used for 'call' methods
     * @param {?} method The method to call
     * @param {...?} params The params given by the user
     * @return {?}
     */
    function (method) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var /** @type {?} */ data = this.encoder.encodeMethod(method, params);
        return this.provider
            .call(this.address, data)
            .pipe(map(function (result) { return _this.decoder.decodeOutputs(result, method.outputs); }), map(function (result) { return result[Object.keys(result)[0]]; }));
    };
    /**
     * Used for 'send' methods
     * @param {?} method The method to send
     * @param {...?} params The params given by the user
     * @return {?}
     */
    ContractClass.prototype.sendMethod = /**
     * Used for 'send' methods
     * @param {?} method The method to send
     * @param {...?} params The params given by the user
     * @return {?}
     */
    function (method) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var _a = { to: this.address, data: this.encoder.encodeMethod(method, params) }, to = _a.to, data = _a.data;
        return this.fillGas(__assign({}, this.provider.defaultTx, { to: to, data: data }))
            .pipe(switchMap(function (tx) { return _this.provider.sendTransaction(tx); }));
    };
    /**
     * Used for 'event' definition
     * @param {?} event The event definition in the ABI
     * @return {?}
     */
    ContractClass.prototype.eventMethod = /**
     * Used for 'event' definition
     * @param {?} event The event definition in the ABI
     * @return {?}
     */
    function (event) {
        var _this = this;
        var /** @type {?} */ topics = this.encoder.encodeEvent(event);
        return this.provider.event(this.address, [topics]).pipe(map(function (logs) { return _this.decoder.decodeEvent(logs.topics, logs.data, event.inputs); }));
    };
    /**
     * Fill the estimated amount of gas and gasPrice to use for a transaction
     * @param {?} tx The raw transaction to estimate the gas from
     * @return {?}
     */
    ContractClass.prototype.fillGas = /**
     * Fill the estimated amount of gas and gasPrice to use for a transaction
     * @param {?} tx The raw transaction to estimate the gas from
     * @return {?}
     */
    function (tx) {
        return forkJoin(this.provider.estimateGas(tx), this.provider.gasPrice()).pipe(map(function (_a) {
            var _b = __read(_a, 2), gas = _b[0], gasPrice = _b[1];
            return __assign({}, tx, { gas: gas, gasPrice: gasPrice });
        }));
    };
    return ContractClass;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ContractModule = /** @class */ (function () {
    function ContractModule() {
    }
    ContractModule.decorators = [
        { type: NgModule },
    ];
    return ContractModule;
}());

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
    var /** @type {?} */ type = nestedType(param.type);
    var /** @type {?} */ paramModel = __assign({}, param, { name: '', type: type }); // Remove name to avoid conflict
    return Array(size).fill(paramModel);
}
/**
 * Return the size of the fixed array ask by the ABI
 * @param {?} type The type of the array
 * @return {?}
 */
function fixedArraySize(type) {
    var /** @type {?} */ lastArrayStr = nestedArray(type).pop();
    var /** @type {?} */ lastArray = JSON.parse(lastArrayStr);
    if (lastArray.length === 0) {
        throw new Error("Array of type " + type + " is not a fixed array");
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
        && tuple.components.filter(function (param) { return !isStatic(param); }).length === 0);
}
/**
 * Check if the array is static
 * @param {?} arr The array object
 * @return {?}
 */
function isStaticArray(arr) {
    return (isFixedArray(arr.type)
        && isStatic(__assign({}, arr, { type: nestedType(arr.type) })) // Nested Type is static
    );
}
/**
 * Check if the output is static
 * @param {?} output The output defined in the abi
 * @return {?}
 */
function isStatic(output) {
    var /** @type {?} */ type = output.type;
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
    var /** @type {?} */ arrays = nestedArray(type);
    if (!arrays) {
        return type;
    }
    var /** @type {?} */ lastArray = arrays[arrays.length - 1];
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
var DecodedParam = /** @class */ (function () {
    function DecodedParam(result, offset) {
        this.result = result;
        this.offset = offset;
    }
    return DecodedParam;
}());
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
    /** @nocollapse */ ABIDecoder.ngInjectableDef = defineInjectable({ factory: function ABIDecoder_Factory() { return new ABIDecoder(); }, token: ABIDecoder, providedIn: ContractModule });
    return ABIDecoder;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var EncodedParam = /** @class */ (function () {
    function EncodedParam(head, tail) {
        if (head === void 0) { head = ''; }
        if (tail === void 0) { tail = ''; }
        this.head = head;
        this.tail = tail;
    }
    return EncodedParam;
}());
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
    ABIEncoder.decorators = [
        { type: Injectable, args: [{ providedIn: ContractModule },] },
    ];
    /** @nocollapse */
    ABIEncoder.ctorParameters = function () { return []; };
    /** @nocollapse */ ABIEncoder.ngInjectableDef = defineInjectable({ factory: function ABIEncoder_Factory() { return new ABIEncoder(); }, token: ABIEncoder, providedIn: ContractModule });
    return ABIEncoder;
}());

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
    var abi = metadata.abi, addresses = metadata.addresses;
    var /** @type {?} */ jsonInterace = typeof abi === 'string' ? JSON.parse(abi) : abi;
    /**
     * Get the address of the contract depending on the id of the network
     * @param id The id of the network
     */
    var /** @type {?} */ getAddress = function (id) {
        switch (id) {
            case 1: return addresses['mainnet'];
            case 3: return addresses['ropsten'];
            case 4: return addresses['rinkeby'];
            case 42: return addresses['kovan'];
            default: return addresses['mainnet'];
        }
    };
    return function (Base) {
        var ContractDecorated = /** @class */ (function (_super) {
            __extends(ContractDecorated, _super);
            function ContractDecorated(encoder, decoder, provider) {
                var _this = _super.call(this, encoder, decoder, provider, jsonInterace, getAddress(provider.id)) || this;
                _this.encoder = encoder;
                _this.decoder = decoder;
                _this.provider = provider;
                return _this;
            }
            ContractDecorated.decorators = [
                { type: Injectable, args: [{ providedIn: ContractModule },] },
            ];
            /** @nocollapse */
            ContractDecorated.ctorParameters = function () { return [
                { type: ABIEncoder, },
                { type: ABIDecoder, },
                { type: ContractProvider, },
            ]; };
            return ContractDecorated;
        }(ContractClass));
        return /** @type {?} */ (ContractDecorated);
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ abi = require('./encoder-test.abi.json');
var EncoderTestContract = /** @class */ (function (_super) {
    __extends(EncoderTestContract, _super);
    function EncoderTestContract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EncoderTestContract = __decorate([
        Contract({
            abi: abi,
            addresses: {
                ropsten: '0x344f641ff60f6308ad70b1e62052764835f48e00'
            }
        })
    ], EncoderTestContract);
    return EncoderTestContract;
}(ContractClass));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ abi$1 = require('./test-event.abi.json');
var TestEventContract = /** @class */ (function (_super) {
    __extends(TestEventContract, _super);
    function TestEventContract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestEventContract = __decorate([
        Contract({
            abi: abi$1,
            addresses: {
                ropsten: '0xc0D6C4cbA14aeFC218d0ff669e07D73E74078248'
            }
        })
    ], TestEventContract);
    return TestEventContract;
}(ContractClass));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { ContractClass, DecodedParam, ABIDecoder, EncodedParam, ABIEncoder, Contract, ContractModule, EncoderTestContract, TestEventContract, ABIDecoder as ɵb, ABIEncoder as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtY29udHJhY3QuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvY29udHJhY3QudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvY29udHJhY3QubW9kdWxlLnRzIiwibmc6Ly9AbmdldGgvY29udHJhY3QvbGliL2FiaS91dGlscy50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9hYmkvZGVjb2Rlci50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9hYmkvZW5jb2Rlci50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9jb250cmFjdC5kZWNvcmF0b3IudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvYWJpL2VuY29kZXItdGVzdC9lbmNvZGVyLXRlc3QuY29udHJhY3QudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvYWJpL3Rlc3QtZXZlbnQvdGVzdC1ldmVudC5jb250cmFjdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBQklEZWZpbml0aW9uLCB0b0NoZWNrc3VtQWRkcmVzcywgQ29udHJhY3RNb2RlbCwgSVR4T2JqZWN0IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgQ29udHJhY3RQcm92aWRlciB9IGZyb20gJ0BuZ2V0aC9wcm92aWRlcic7XHJcbmltcG9ydCB7IEFCSUVuY29kZXIsIEFCSURlY29kZXIgfSBmcm9tICcuL2FiaSc7XHJcblxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsICBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJhY3RDbGFzczxUIGV4dGVuZHMgQ29udHJhY3RNb2RlbD4ge1xyXG4gIHB1YmxpYyBjYWxsczogeyBbUCBpbiBrZXlvZiBUWydjYWxscyddXTogVFsnY2FsbHMnXVtQXTsgfSA9IHt9IGFzIGFueTtcclxuICBwdWJsaWMgc2VuZHM6IHsgW1AgaW4ga2V5b2YgVFsnc2VuZHMnXV06IFRbJ3NlbmRzJ11bUF07IH0gPSB7fSBhcyBhbnk7XHJcbiAgcHVibGljIGV2ZW50czogeyBbUCBpbiBrZXlvZiBUWydldmVudHMnXV06IFRbJ2V2ZW50cyddW1BdOyB9ID0ge30gYXMgYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByb3RlY3RlZCBlbmNvZGVyOiBBQklFbmNvZGVyLFxyXG4gICAgcHJvdGVjdGVkIGRlY29kZXI6IEFCSURlY29kZXIsXHJcbiAgICBwcm90ZWN0ZWQgcHJvdmlkZXI6IENvbnRyYWN0UHJvdmlkZXIsXHJcbiAgICBwcml2YXRlIGFiaTogQUJJRGVmaW5pdGlvbltdLFxyXG4gICAgcHVibGljIGFkZHJlc3M/OiBzdHJpbmdcclxuICApIHtcclxuICAgIGlmICghdGhpcy5hYmkpIHsgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgYWRkIGFuIGFiaSB0byB0aGUgY29udHJhY3QnKTsgfVxyXG4gICAgaWYgKHRoaXMuYWRkcmVzcykgeyB0aGlzLmFkZHJlc3MgPSB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzKTsgfVxyXG4gICAgY29uc3QgY2FsbHM6IGFueVtdID0gW107XHJcbiAgICBjb25zdCBzZW5kczogYW55W10gPSBbXTtcclxuICAgIGNvbnN0IGV2ZW50czogYW55W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgZGVmIG9mIHRoaXMuYWJpKSB7XHJcbiAgICAgIGlmIChkZWYudHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWYuY29uc3RhbnQgPT09IHRydWUpIHtcclxuICAgICAgICBjYWxscy5wdXNoKGRlZik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRlZi50eXBlID09PSAnZnVuY3Rpb24nICYmIGRlZi5jb25zdGFudCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBzZW5kcy5wdXNoKGRlZik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRlZi50eXBlID09PSAnZXZlbnQnKSB7XHJcbiAgICAgICAgZXZlbnRzLnB1c2goZGVmKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2FsbHMuZm9yRWFjaChkZWYgPT4gKHRoaXMuY2FsbHNbZGVmLm5hbWVdID0gdGhpcy5jYWxsTWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gICAgc2VuZHMuZm9yRWFjaChkZWYgPT4gKHRoaXMuc2VuZHNbZGVmLm5hbWVdID0gdGhpcy5zZW5kTWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gICAgZXZlbnRzLmZvckVhY2goZGVmID0+ICh0aGlzLmV2ZW50c1tkZWYubmFtZV0gPSB0aGlzLmV2ZW50TWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVwbG95IHRoZSBjb250cmFjdCBvbiB0aGUgYmxvY2tjaGFpblxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhlIGNvbnRyYWN0XHJcbiAgICogQHBhcmFtIHBhcmFtcyBQYXJhbXMgdG8gcGFzcyBpbnRvIHRoZSBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZXBsb3koYnl0ZXM6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgY29uc3QgY29uc3RydWN0b3IgPSB0aGlzLmFiaS5maW5kKGRlZiA9PiBkZWYudHlwZSA9PT0gJ2NvbnN0cnVjdG9yJyk7XHJcbiAgICBjb25zdCBub1BhcmFtID0gcGFyYW1zLmxlbmd0aCA9PT0gMDtcclxuICAgIGNvbnN0IGRhdGEgPSBub1BhcmFtID8gYnl0ZXMgOiB0aGlzLmVuY29kZXIuZW5jb2RlQ29uc3RydWN0b3IoY29uc3RydWN0b3IsIGJ5dGVzLCBwYXJhbXMpO1xyXG4gICAgcmV0dXJuIHRoaXMuZmlsbEdhcyh7IC4uLnRoaXMucHJvdmlkZXIuZGVmYXVsdFR4LCBkYXRhIH0pXHJcbiAgICAgIC5waXBlKHN3aXRjaE1hcCh0eCA9PiB0aGlzLnByb3ZpZGVyLnNlbmRUcmFuc2FjdGlvbih0eCkpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVzZWQgZm9yICdjYWxsJyBtZXRob2RzXHJcbiAgICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGNhbGxcclxuICAgKiBAcGFyYW0gcGFyYW1zIFRoZSBwYXJhbXMgZ2l2ZW4gYnkgdGhlIHVzZXJcclxuICAgKi9cclxuICBwcml2YXRlIGNhbGxNZXRob2QobWV0aG9kOiBBQklEZWZpbml0aW9uLCAuLi5wYXJhbXM6IGFueVtdKSB7XHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5lbmNvZGVyLmVuY29kZU1ldGhvZChtZXRob2QsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAuY2FsbDxzdHJpbmc+KHRoaXMuYWRkcmVzcywgZGF0YSlcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgbWFwKHJlc3VsdCA9PiB0aGlzLmRlY29kZXIuZGVjb2RlT3V0cHV0cyhyZXN1bHQsIG1ldGhvZC5vdXRwdXRzKSksXHJcbiAgICAgICAgbWFwKHJlc3VsdCA9PiByZXN1bHRbT2JqZWN0LmtleXMocmVzdWx0KVswXV0pXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIGZvciAnc2VuZCcgbWV0aG9kc1xyXG4gICAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBzZW5kXHJcbiAgICogQHBhcmFtIHBhcmFtcyBUaGUgcGFyYW1zIGdpdmVuIGJ5IHRoZSB1c2VyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZW5kTWV0aG9kKG1ldGhvZDogQUJJRGVmaW5pdGlvbiwgLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgY29uc3QgeyB0bywgZGF0YSB9ID0geyB0bzogdGhpcy5hZGRyZXNzLCBkYXRhOiB0aGlzLmVuY29kZXIuZW5jb2RlTWV0aG9kKG1ldGhvZCwgcGFyYW1zKSB9O1xyXG4gICAgcmV0dXJuIHRoaXMuZmlsbEdhcyh7IC4uLnRoaXMucHJvdmlkZXIuZGVmYXVsdFR4LCB0bywgZGF0YSB9KVxyXG4gICAgICAucGlwZShzd2l0Y2hNYXAodHggPT4gdGhpcy5wcm92aWRlci5zZW5kVHJhbnNhY3Rpb24odHgpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIGZvciAnZXZlbnQnIGRlZmluaXRpb25cclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IGRlZmluaXRpb24gaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZXZlbnRNZXRob2QoZXZlbnQ6IEFCSURlZmluaXRpb24pIHtcclxuICAgIGNvbnN0IHRvcGljcyA9IHRoaXMuZW5jb2Rlci5lbmNvZGVFdmVudChldmVudCk7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ldmVudCh0aGlzLmFkZHJlc3MsIFt0b3BpY3NdKS5waXBlKFxyXG4gICAgICBtYXAobG9ncyA9PiB0aGlzLmRlY29kZXIuZGVjb2RlRXZlbnQobG9ncy50b3BpY3MsIGxvZ3MuZGF0YSwgZXZlbnQuaW5wdXRzKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGaWxsIHRoZSBlc3RpbWF0ZWQgYW1vdW50IG9mIGdhcyBhbmQgZ2FzUHJpY2UgdG8gdXNlIGZvciBhIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHR4IFRoZSByYXcgdHJhbnNhY3Rpb24gdG8gZXN0aW1hdGUgdGhlIGdhcyBmcm9tXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBmaWxsR2FzKHR4OiBQYXJ0aWFsPElUeE9iamVjdD4pOiBPYnNlcnZhYmxlPFBhcnRpYWw8SVR4T2JqZWN0Pj4ge1xyXG4gICAgcmV0dXJuIGZvcmtKb2luKFxyXG4gICAgICB0aGlzLnByb3ZpZGVyLmVzdGltYXRlR2FzKHR4KSxcclxuICAgICAgdGhpcy5wcm92aWRlci5nYXNQcmljZSgpXHJcbiAgICApLnBpcGUobWFwKChbZ2FzLCBnYXNQcmljZV0pID0+IHtcclxuICAgICAgICByZXR1cm4geyAuLi50eCwgZ2FzLCBnYXNQcmljZSB9XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBOZ01vZHVsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb250cmFjdE1vZHVsZSB7fVxyXG4iLCJpbXBvcnQgeyBBQklJbnB1dCB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGFuIGFycmF5IG9mIHBhcmFtcyBiYXNlZCBvbiB0aGUgc2l6ZSBvZiB0aGUgYXJyYXkgaW4gdGhlIEFCSSBhbmQgdGhlIG1vZGVsXHJcbiAqIEBwYXJhbSBzaXplIFRoZSBhbW91bnQgb2YgZWxlbWVudHMgaW4gdGhlIGFycmF5XHJcbiAqIEBwYXJhbSBwYXJhbSBUaGUgbW9kZWwgb2YgcGFyYW0gdG8gYmFzZWQgdGhlIG5ldyBhcnJheSBvblxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFtRnJvbUFycmF5KHNpemU6IG51bWJlciwgcGFyYW06IEFCSUlucHV0KSB7XHJcbiAgY29uc3QgdHlwZSA9IG5lc3RlZFR5cGUocGFyYW0udHlwZSk7XHJcbiAgY29uc3QgcGFyYW1Nb2RlbCA9IHsgLi4ucGFyYW0sIG5hbWU6ICcnLCB0eXBlOiB0eXBlIH07ICAvLyBSZW1vdmUgbmFtZSB0byBhdm9pZCBjb25mbGljdFxyXG4gIHJldHVybiBBcnJheShzaXplKS5maWxsKHBhcmFtTW9kZWwpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBzaXplIG9mIHRoZSBmaXhlZCBhcnJheSBhc2sgYnkgdGhlIEFCSVxyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgYXJyYXlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmaXhlZEFycmF5U2l6ZSh0eXBlOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gIGNvbnN0IGxhc3RBcnJheVN0ciA9IG5lc3RlZEFycmF5KHR5cGUpLnBvcCgpO1xyXG4gIGNvbnN0IGxhc3RBcnJheSA9IEpTT04ucGFyc2UobGFzdEFycmF5U3RyKTtcclxuICBpZiAobGFzdEFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBBcnJheSBvZiB0eXBlICR7dHlwZX0gaXMgbm90IGEgZml4ZWQgYXJyYXlgKTtcclxuICB9XHJcbiAgcmV0dXJuIHBhcnNlSW50KGxhc3RBcnJheVswXSwgMTApO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIHR1cGxlIGlzIHN0YXRpY1xyXG4gKiBAcGFyYW0gdHVwbGUgVGhlIHR1cGxlIG9iamVjdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhdGljVHVwbGUodHVwbGU6IEFCSUlucHV0KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR1cGxlLnR5cGUgPT09ICd0dXBsZScgIC8vIFByZXZlbnQgdHlwZSB0byBiZSAndHVwbGVbXSdcclxuICAgICYmIHR1cGxlLmNvbXBvbmVudHNcclxuICAgICYmIHR1cGxlLmNvbXBvbmVudHMuZmlsdGVyKHBhcmFtID0+ICFpc1N0YXRpYyhwYXJhbSkpLmxlbmd0aCA9PT0gMFxyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgYXJyYXkgaXMgc3RhdGljXHJcbiAqIEBwYXJhbSBhcnIgVGhlIGFycmF5IG9iamVjdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhdGljQXJyYXkoYXJyOiBBQklJbnB1dCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBpc0ZpeGVkQXJyYXkoYXJyLnR5cGUpXHJcbiAgICAmJiBpc1N0YXRpYyh7Li4uYXJyLCB0eXBlOiBuZXN0ZWRUeXBlKGFyci50eXBlKX0pIC8vIE5lc3RlZCBUeXBlIGlzIHN0YXRpY1xyXG4gICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgb3V0cHV0IGlzIHN0YXRpY1xyXG4gKiBAcGFyYW0gb3V0cHV0IFRoZSBvdXRwdXQgZGVmaW5lZCBpbiB0aGUgYWJpXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNTdGF0aWMob3V0cHV0OiBBQklJbnB1dCk6IGJvb2xlYW4ge1xyXG4gIGNvbnN0IHR5cGUgPSBvdXRwdXQudHlwZTtcclxuICBzd2l0Y2ggKHRydWUpIHtcclxuICAgIC8vIEFycmF5XHJcbiAgICBjYXNlIC9cXFsoWzAtOV0qKVxcXS8udGVzdCh0eXBlKTpcclxuICAgICAgcmV0dXJuIGlzU3RhdGljQXJyYXkob3V0cHV0KTtcclxuICAgIC8vIFR1cGxlXHJcbiAgICBjYXNlIC90dXBsZT8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgcmV0dXJuIGlzU3RhdGljVHVwbGUob3V0cHV0KTtcclxuICAgIH1cclxuICAgIC8vIER5bmFtaWNcclxuICAgIGNhc2UgL3N0cmluZz8vLnRlc3QodHlwZSk6XHJcbiAgICBjYXNlIC9ieXRlcz9cXGIvLnRlc3QodHlwZSk6XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vIFN0YXRpY1xyXG4gICAgY2FzZSAvYnl0ZXM/Ly50ZXN0KHR5cGUpOlxyXG4gICAgY2FzZSAvaW50Py8udGVzdCh0eXBlKTpcclxuICAgIGNhc2UgL2FkZHJlc3M/Ly50ZXN0KHR5cGUpOlxyXG4gICAgY2FzZSAvYm9vbD8vLnRlc3QodHlwZSk6XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSBhcnJheSBpcyBmaXhlZFxyXG4gKiBAcGFyYW0gdHlwZSBUeXBlIG9mIHRoZSBhcnJheVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRml4ZWRBcnJheSh0eXBlOiBzdHJpbmcpIHtcclxuICByZXR1cm4gL1xcW1swLTldXFxdLy50ZXN0KHR5cGUpO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGxhc3QgW10gaW4gdHlwZVxyXG4gKiBAZXhhbXBsZSBpbnRbMzJdID0+IGludFxyXG4gKiBAZXhhbXBsZSBpbnRbMl1bM10gPT4gaW50WzJdXHJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIHRvIG1vZGlmeVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG5lc3RlZFR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBhcnJheXMgPSBuZXN0ZWRBcnJheSh0eXBlKTtcclxuICBpZiAoIWFycmF5cykgeyByZXR1cm4gdHlwZTsgfVxyXG4gIGNvbnN0IGxhc3RBcnJheSA9IGFycmF5c1thcnJheXMubGVuZ3RoIC0gMV07XHJcbiAgcmV0dXJuIHR5cGUuc3Vic3RyaW5nKDAsIHR5cGUubGVuZ3RoIC0gbGFzdEFycmF5Lmxlbmd0aCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG91bGQgcmV0dXJuIGFycmF5IG9mIG5lc3RlZCB0eXBlc1xyXG4gKiBAZXhhbXBsZSBpbnRbMl1bM11bXSA9PiBbWzJdLCBbM10sIFtdXVxyXG4gKiBAZXhhbXBsZSBpbnRbXSA9PiBbW11dXHJcbiAqIEBleGFtcGxlIGludCA9PiBudWxsXHJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIHRvIG1hdGNoXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbmVzdGVkQXJyYXkodHlwZTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gIHJldHVybiB0eXBlLm1hdGNoKC8oXFxbWzAtOV0qXFxdKS9nKTtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgQk4gfSBmcm9tICdibi5qcyc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJhY3RNb2R1bGUgfSBmcm9tICcuLy4uL2NvbnRyYWN0Lm1vZHVsZSc7XHJcbmltcG9ydCB7XHJcbiAgaXNTdGF0aWMsXHJcbiAgaXNGaXhlZEFycmF5LFxyXG4gIGZpeGVkQXJyYXlTaXplLFxyXG4gIHBhcmFtRnJvbUFycmF5LFxyXG4gIGlzU3RhdGljVHVwbGUsXHJcbiAgaXNTdGF0aWNBcnJheSB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQge1xyXG4gIEFCSU91dHB1dCxcclxuICBBQklJbnB1dCxcclxuICBoZXhUb051bWJlcixcclxuICBoZXhUb1V0ZjgsXHJcbiAgaGV4VG9OdW1iZXJTdHJpbmcsXHJcbiAgdG9DaGVja3N1bUFkZHJlc3NcclxufSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlY29kZWRQYXJhbSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHJlc3VsdDogRGVjb2RlZFBhcmFtLCBwdWJsaWMgb2Zmc2V0OiBudW1iZXIpIHt9XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogQ29udHJhY3RNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEFCSURlY29kZXIge1xyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgYW4gZXZlbnQgb3V0cHV0XHJcbiAgICogQHBhcmFtIHRvcGljcyBUaGUgdG9waWNzIG9mIHRoZSBsb2dzIChpbmRleGVkIHZhbHVlcylcclxuICAgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBvZiB0aGUgbG9ncyAoYnl0ZXMpXHJcbiAgICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXRzIGdpdmVudCBieSB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUV2ZW50KHRvcGljczogc3RyaW5nW10sIGRhdGE6IHN0cmluZywgaW5wdXRzOiBBQklJbnB1dFtdKTogYW55IHtcclxuICAgIGNvbnN0IG91dHB1dHMgPSB0aGlzLmRlY29kZU91dHB1dHMoZGF0YSwgaW5wdXRzKTtcclxuICAgIGlucHV0c1xyXG4gICAgICAuZmlsdGVyKGlucHV0ID0+IGlucHV0LmluZGV4ZWQpXHJcbiAgICAgIC5mb3JFYWNoKChpbnB1dCwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRvcGljID0gdG9waWNzW2kgKyAxXS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgICAgICAvLyBJZiBpbmRleGVkIHZhbHVlIGlzIHN0YXRpYyBkZWNvZGUsIGVsc2UgcmV0dXJuIGFzIGl0XHJcbiAgICAgICAgb3V0cHV0c1tpbnB1dC5uYW1lXSA9IGlzU3RhdGljKGlucHV0KSA/IHRoaXMuZGVjb2RlQnl0ZXModG9waWMsIGlucHV0KSA6IHRvcGljO1xyXG4gICAgICB9KTtcclxuICAgIHJldHVybiBvdXRwdXRzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtYXAgdGhlIGJ5dGVzIHRvIGRlY29kZSBkZXBlbmRpbmcgb24gaXRzIHR5cGVcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIHRvIGRlY29kZVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIG91dHB1dCBkZXNjcmliZWQgaW4gdGhlIEFiaVxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVCeXRlcyhieXRlczogc3RyaW5nLCBvdXRwdXQ6IEFCSU91dHB1dCkge1xyXG4gICAgY29uc3QgdHlwZSA9IG91dHB1dC50eXBlO1xyXG4gICAgLy8gQ29tcGFyZSB0cnVlIHdpdGggdGhlIHJlc3VsdCBvZiB0aGUgY2FzZXNcclxuICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAvLyBBcnJheTogTXVzdCBiZSBmaXJzdFxyXG4gICAgICBjYXNlIC9cXFsoWzAtOV0qKVxcXS8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVBcnJheShieXRlcywgb3V0cHV0KTtcclxuICAgICAgLy8gVHVwbGVcclxuICAgICAgY2FzZSAvdHVwbGU/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZVR1cGxlKGJ5dGVzLCBvdXRwdXQuY29tcG9uZW50cyk7XHJcbiAgICAgIC8vIFN0cmluZ1xyXG4gICAgICBjYXNlIC9zdHJpbmc/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZVN0cmluZyhieXRlcyk7XHJcbiAgICAgIC8vIER5bmFtaWMgQnl0ZXNcclxuICAgICAgY2FzZSAvYnl0ZXM/XFxiLy50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZUR5bmFtaWNCeXRlcyhieXRlcyk7XHJcbiAgICAgIC8vIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2J5dGVzPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVTdGF0aWNCeXRlcyhieXRlcyk7XHJcbiAgICAgIC8vIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2ludD8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlSW50KGJ5dGVzKTtcclxuICAgICAgLy8gQWRkcmVzc1xyXG4gICAgICBjYXNlIC9hZGRyZXNzPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVBZGRyZXNzKGJ5dGVzKTtcclxuICAgICAgLy8gQm9vbFxyXG4gICAgICBjYXNlIC9ib29sPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVCb29sKGJ5dGVzKTtcclxuICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgdGhlIGRlY29kZXIgZm9yIHRoZSB0eXBlIDogJyArIHR5cGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgdGhlIG91dHB1dHMgOiBTdGFydCBmcm9tIHRoZSBsYXN0IHRvIHRoZSBmaXJzdCAodG8ga25vdyB0aGUgbGVuZ3RoIG9mIHRoZSB0YWlsKVxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhlIG91dHB1dHNcclxuICAgKiBAcGFyYW0gb3V0cHV0cyBUaGUgb3V0cHV0cyBmcm9tIHRoZSBhYmlcclxuICAgKi9cclxuICBwdWJsaWMgZGVjb2RlT3V0cHV0cyhieXRlczogc3RyaW5nLCBvdXRwdXRzOiAoQUJJT3V0cHV0IHwgQUJJSW5wdXQpW10pOiBhbnkge1xyXG4gICAgYnl0ZXMgPSBieXRlcy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIGNvbnN0IGluaXQgPSB7IHJlc3VsdDoge30sIG9mZnNldDogYnl0ZXMubGVuZ3RoIH07XHJcbiAgICByZXR1cm4gb3V0cHV0c1xyXG4gICAgICAuZmlsdGVyKG91dHB1dCA9PiAhKDxBQklJbnB1dD5vdXRwdXQpLmluZGV4ZWQpIC8vIFJlbW92ZSBpbmRleGVkIHZhbHVlc1xyXG4gICAgICAucmVkdWNlUmlnaHQoKGFjYzogRGVjb2RlZFBhcmFtLCBvdXRwdXQ6IEFCSU91dHB1dCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGVhZCA9IHRoaXMuZ2V0SGVhZChieXRlcywgb3V0cHV0cywgaSk7XHJcbiAgICAgICAgaWYgKGlzU3RhdGljKG91dHB1dCkpIHtcclxuICAgICAgICAgIGFjYy5yZXN1bHRbb3V0cHV0Lm5hbWUgfHwgaV0gPSB0aGlzLmRlY29kZUJ5dGVzKGhlYWQsIG91dHB1dCk7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IERlY29kZWRQYXJhbShhY2MucmVzdWx0LCBhY2Mub2Zmc2V0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgdGFpbFN0YXJ0ID0gaGV4VG9OdW1iZXIoaGVhZCkgKiAyOyAvLyB0cmFuc2Zvcm0gYnl0ZXMgdG8gaGV4XHJcbiAgICAgICAgICBjb25zdCB0YWlsRW5kID0gYWNjLm9mZnNldDtcclxuICAgICAgICAgIGNvbnN0IHRhaWwgPSBieXRlcy5zdWJzdHJpbmcodGFpbFN0YXJ0LCB0YWlsRW5kKTtcclxuICAgICAgICAgIGFjYy5yZXN1bHRbb3V0cHV0Lm5hbWUgfHwgaV0gPSB0aGlzLmRlY29kZUJ5dGVzKHRhaWwsIG91dHB1dCk7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IERlY29kZWRQYXJhbShhY2MucmVzdWx0LCB0YWlsU3RhcnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgaW5pdFxyXG4gICAgKS5yZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNvZGUgYSBhcnJheVxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhpcyBhcnJheVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIG91dHB1dCBvYmplY3QgZGVmaW5lZCBpbiB0aGUgYWJpXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUFycmF5KGJ5dGVzOiBzdHJpbmcsIG91dHB1dDogQUJJT3V0cHV0KTogYW55W10ge1xyXG4gICAgbGV0IGFtb3VudDogbnVtYmVyO1xyXG4gICAgaWYgKGlzRml4ZWRBcnJheShvdXRwdXQudHlwZSkpIHtcclxuICAgICAgYW1vdW50ID0gZml4ZWRBcnJheVNpemUob3V0cHV0LnR5cGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW1vdW50ID0gaGV4VG9OdW1iZXIoYnl0ZXMuc2xpY2UoMCwgNjQpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5lc3RlZEJ5dGVzID0gaXNGaXhlZEFycmF5KG91dHB1dC50eXBlKSA/IGJ5dGVzIDogYnl0ZXMuc2xpY2UoNjQpO1xyXG4gICAgY29uc3Qgb3V0cHV0QXJyYXkgPSBwYXJhbUZyb21BcnJheShhbW91bnQsIG91dHB1dCk7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gdGhpcy5kZWNvZGVPdXRwdXRzKG5lc3RlZEJ5dGVzLCBvdXRwdXRBcnJheSk7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGVjb2RlZCkubWFwKGtleSA9PiBkZWNvZGVkW2tleV0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIHR1cGxlICovXHJcbiAgcHVibGljIGRlY29kZVR1cGxlKGJ5dGVzOiBzdHJpbmcsIG91dHB1dHM6IEFCSU91dHB1dFtdKTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLmRlY29kZU91dHB1dHMoYnl0ZXMsIG91dHB1dHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIHN0cmluZyAqL1xyXG4gIHB1YmxpYyBkZWNvZGVTdHJpbmcoYnl0ZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdHIgPSBieXRlcy5zbGljZSg2NCk7XHJcbiAgICByZXR1cm4gaGV4VG9VdGY4KHN0cik7XHJcbiAgfVxyXG5cclxuICAvKiogRGVjb2RlIGEgZHluYW1pYyBieXRlICovXHJcbiAgcHVibGljIGRlY29kZUR5bmFtaWNCeXRlcyhieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGFtb3VudCA9IGhleFRvTnVtYmVyKGJ5dGVzLnNsaWNlKDAsIDY0KSk7XHJcbiAgICByZXR1cm4gYnl0ZXMuc2xpY2UoNjQpLnN1YnN0cmluZygwLCBhbW91bnQgKiAyKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSBzdGF0aWMgYnl0ZSAqL1xyXG4gIHB1YmxpYyBkZWNvZGVTdGF0aWNCeXRlcyhieXRlczogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gYnl0ZXMucmVwbGFjZSgvXFxiMCsoMCspLywgJycpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIGEgdWludCBvciBpbnRcclxuICAgKiBXQVJOSU5HIDogUmV0dXJuIGEgc3RyaW5nXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZUludChieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGlzTmVnYXRpdmUgPSAodmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICByZXR1cm4gKG5ldyBCTih2YWx1ZS5zdWJzdHIoMCwgMSksIDE2KS50b1N0cmluZygyKS5zdWJzdHIoMCwgMSkpID09PSAnMSc7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNOZWdhdGl2ZShieXRlcykpIHtcclxuICAgICAgcmV0dXJuIG5ldyBCTihieXRlcywgMTYpLmZyb21Ud29zKDI1NikudG9TdHJpbmcoMTApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhleFRvTnVtYmVyU3RyaW5nKGJ5dGVzKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYW4gYWRkcmVzcyAqL1xyXG4gIHB1YmxpYyBkZWNvZGVBZGRyZXNzKGJ5dGVzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRvQ2hlY2tzdW1BZGRyZXNzKGJ5dGVzLnN1YnN0cmluZygyNCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIGJvb2xlYW4gKi9cclxuICBwdWJsaWMgZGVjb2RlQm9vbChieXRlczogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBsYXN0ID0gYnl0ZXMuc3Vic3RyaW5nKDYzKTtcclxuICAgIHJldHVybiBsYXN0ID09PSAnMScgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKioqKioqXHJcbiAgICogSEVBRFxyXG4gICAqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybiB0aGUgaGVhZCBwYXJ0IG9mIHRoZSBvdXRwdXRcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIG9mIHRoZSBvdXRwdXRTXHJcbiAgICogQHBhcmFtIG91dHB1dHMgVGhlIGxpc3Qgb2Ygb3V0cHV0c1xyXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG91dHB1dCB0byBjaGVjayBpbiB0aGUgb3V0cHV0c1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0SGVhZChieXRlczogc3RyaW5nLCBvdXRwdXRzOiBBQklPdXRwdXRbXSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXg7IGkrKykge1xyXG4gICAgICBpZiAoaXNTdGF0aWNUdXBsZShvdXRwdXRzW2ldKSkge1xyXG4gICAgICAgIGNvbnN0IGhlYWQgPSB0aGlzLmdldEFsbEhlYWRzKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2ldLmNvbXBvbmVudHMpO1xyXG4gICAgICAgIG9mZnNldCArPSBoZWFkLmxlbmd0aDtcclxuICAgICAgfSBlbHNlIGlmIChpc1N0YXRpY0FycmF5KG91dHB1dHNbaV0pKSB7XHJcbiAgICAgICAgb2Zmc2V0ICs9IHRoaXMuc3RhdGljQXJyYXlTaXplKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2luZGV4XSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2Zmc2V0ICs9IDY0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXNTdGF0aWNUdXBsZShvdXRwdXRzW2luZGV4XSkpIHtcclxuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5nZXRBbGxIZWFkcyhieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpbmRleF0uY29tcG9uZW50cykubGVuZ3RoXHJcbiAgICAgIHJldHVybiBieXRlcy5zdWJzdHIob2Zmc2V0LCBsZW5ndGgpO1xyXG4gICAgfSBlbHNlIGlmKGlzU3RhdGljQXJyYXkob3V0cHV0c1tpbmRleF0pKSB7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuc3RhdGljQXJyYXlTaXplKGJ5dGVzLnN1YnN0cihvZmZzZXQpLCBvdXRwdXRzW2luZGV4XSk7XHJcbiAgICAgIHJldHVybiBieXRlcy5zdWJzdHIob2Zmc2V0LCBsZW5ndGgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGJ5dGVzLnN1YnN0cihvZmZzZXQsIDY0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgc2l6ZSBvZiBhIHN0YXRpYyBhcnJheVxyXG4gICAqIEBwYXJhbSBieXRlcyBCeXRlcyBzdGFydGluZyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheVxyXG4gICAqIEBwYXJhbSBvdXRwdXQgVGhlIGFycmF5IG1vZGVsXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzdGF0aWNBcnJheVNpemUoYnl0ZXM6IHN0cmluZywgb3V0cHV0OiBBQklPdXRwdXQpIHtcclxuICAgIGNvbnN0IHNpemUgPSBmaXhlZEFycmF5U2l6ZShvdXRwdXQudHlwZSk7XHJcbiAgICBjb25zdCBvdXRwdXRBcnJheSA9IHBhcmFtRnJvbUFycmF5KHNpemUsIG91dHB1dCk7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRBbGxIZWFkcyhieXRlcywgb3V0cHV0QXJyYXkpLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhbGwgaGVhZHMgZnJvbSBzdGF0aWMgYXJyYXlzIG9yIHR1cGxlc1xyXG4gICAqIEBwYXJhbSBieXRlcyBCeXRlcyBzdGFydGluZyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheSBvciB0dXBsZVxyXG4gICAqIEBwYXJhbSBvdXRwdXRzIFRoZSBvdXRwdXRzIGdpdmVuIGJ5IHRoZSBBQkkgZm9yIHRoaXMgYXJyYXkgb3IgdHVwbGVcclxuICAgKi9cclxuICBwcml2YXRlIGdldEFsbEhlYWRzKGJ5dGVzOiBzdHJpbmcsIG91dHB1dHM6IEFCSU91dHB1dFtdKSB7XHJcbiAgICByZXR1cm4gb3V0cHV0cy5yZWR1Y2VSaWdodCgoYWNjOiBzdHJpbmcsIG91dHB1dDogQUJJT3V0cHV0LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICByZXR1cm4gYWNjICsgdGhpcy5nZXRIZWFkKGJ5dGVzLCBvdXRwdXRzLCBpKTtcclxuICAgICAgfSwnJyk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFCSUlucHV0LCBudW1iZXJUb0hleCwgdXRmOFRvSGV4LCB0b0JOLCBBQklEZWZpbml0aW9uLCBrZWNjYWsyNTYgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBDb250cmFjdE1vZHVsZSB9IGZyb20gJy4uL2NvbnRyYWN0Lm1vZHVsZSc7XHJcbmltcG9ydCB7IGlzU3RhdGljLCBpc0ZpeGVkQXJyYXksIHBhcmFtRnJvbUFycmF5LCBmaXhlZEFycmF5U2l6ZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVuY29kZWRQYXJhbSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGhlYWQ6IHN0cmluZyA9ICcnLCBwdWJsaWMgdGFpbCA9ICcnKSB7fVxyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IENvbnRyYWN0TW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBBQklFbmNvZGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSB0aGUgY29uc3RydWN0b3IgbWV0aG9kIGZvciBkZXBsb3lpbmdcclxuICAgKiBAcGFyYW0gY29uc3RydWN0b3IgVGhlIGNvbnN0cnVjdG9yIHBhcmFtIGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgY29udGVudCBvZiB0aGUgY29udHJhY3RcclxuICAgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnRzIHRvIHBhc3MgaW50byB0aGUgY29uc3RydWN0b3IgaWYgYW55XHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZUNvbnN0cnVjdG9yKFxyXG4gICAgY29uc3RydWN0b3I6IEFCSURlZmluaXRpb24sXHJcbiAgICBieXRlczogc3RyaW5nLFxyXG4gICAgYXJncz86IGFueVtdXHJcbiAgKSB7XHJcbiAgICBjb25zdCBlbmNvZGVkID0gdGhpcy5lbmNvZGVJbnB1dHMoYXJncywgY29uc3RydWN0b3IuaW5wdXRzKTtcclxuICAgIHJldHVybiBieXRlcyArIGVuY29kZWQuaGVhZCArIGVuY29kZWQudGFpbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSB0aGUgd2hvbGUgbWV0aG9kXHJcbiAgICogQHBhcmFtIG1laHRvZCBUaGUgbWV0aG9kIHRoZSBlbmNvZGUgaGFzIGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqIEBwYXJhbSBhcmdzIFRoZSBsaXN0IG9mIGFyZ3VtZW50cyBnaXZlbiBieSB0aGUgdXNlclxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGVNZXRob2QobWV0aG9kOiBBQklEZWZpbml0aW9uLCBhcmdzOiBhbnlbXSkge1xyXG4gICAgLy8gQ3JlYXRlIGFuZCBzaWduIG1ldGhvZFxyXG4gICAgY29uc3QgeyBuYW1lLCBpbnB1dHMgfSA9IG1ldGhvZDtcclxuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHRoaXMuc2lnbk1ldGhvZChtZXRob2QpO1xyXG4gICAgY29uc3QgaGFzaFNpZ24gPSBrZWNjYWsyNTYoc2lnbmF0dXJlKS5zbGljZSgwLCAxMCk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHRoZSBlbmNvZGVkIGFyZ3VtZW50c1xyXG4gICAgY29uc3QgZW5jb2RlZCA9IHRoaXMuZW5jb2RlSW5wdXRzKGFyZ3MsIGlucHV0cyk7XHJcbiAgICByZXR1cm4gaGFzaFNpZ24gKyBlbmNvZGVkLmhlYWQgKyBlbmNvZGVkLnRhaWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYW4gZXZlbnRcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIGVuY29kZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGVFdmVudChldmVudDogQUJJRGVmaW5pdGlvbik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB7IG5hbWUsIGlucHV0cyB9ID0gZXZlbnQ7XHJcbiAgICBjb25zdCBzaWduYXR1cmUgPSB0aGlzLnNpZ25NZXRob2QoZXZlbnQpO1xyXG4gICAgcmV0dXJuIGtlY2NhazI1NihzaWduYXR1cmUpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKioqKioqKioqKioqKioqIFNJR05BVFVSRSAqKioqKioqKioqKioqKioqKlxyXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBzdHJpbmcgZm9yIHRoZSBzaWduYXR1cmUgYmFzZWQgb24gdGhlIHBhcmFtcyBpbiB0aGUgQUJJXHJcbiAgICogQHBhcmFtIHBhcmFtcyBUaGUgcGFyYW1zIGdpdmVuIGJ5IHRoZSBBQkkuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaWduSW5wdXRzKGlucHV0czogQUJJSW5wdXRbXSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gaW5wdXRzXHJcbiAgICAgIC5tYXAoaW5wdXQgPT4gaW5wdXQuY29tcG9uZW50cyA/IHRoaXMudHVwbGVUeXBlKGlucHV0KSA6IGlucHV0LnR5cGUpXHJcbiAgICAgIC5qb2luKCcsJyk7XHJcbiAgfVxyXG5cclxuICAvKiogUmV0dXJuIHRoZSB0eXBlIG9mIGEgdHVwbGUgbmVlZGVkIGZvciB0aGUgc2lnbmF0dXJlICovXHJcbiAgcHJpdmF0ZSB0dXBsZVR5cGUodHVwbGU6IEFCSUlucHV0KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGlubmVyVHlwZXMgPSB0aGlzLnNpZ25JbnB1dHModHVwbGUuY29tcG9uZW50cyk7XHJcbiAgICBjb25zdCBhcnJheVBhcnQgPSB0dXBsZS50eXBlLnN1YnN0cig1KTtcclxuICAgIHJldHVybiBgKCR7aW5uZXJUeXBlc30pJHthcnJheVBhcnR9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSBzcGVjaWZpYyBtZXRob2QgYmFzZWQgb24gdGhlIEFCSVxyXG4gICAqIEBwYXJhbSBtZWh0b2QgVGhlIG1ldGhvZCB0aGUgZW5jb2RlIGhhcyBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwcml2YXRlIHNpZ25NZXRob2QobWV0aG9kOiBBQklEZWZpbml0aW9uKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgaW5wdXRzIH0gPSBtZXRob2Q7XHJcbiAgICBjb25zdCB0eXBlcyA9IHRoaXMuc2lnbklucHV0cyhpbnB1dHMpO1xyXG4gICAgcmV0dXJuIGAke25hbWV9KCR7dHlwZXN9KWA7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqKioqKioqKioqKioqKioqIEVOQ09ERSAqKioqKioqKioqKioqKioqKioqXHJcbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCB0byB0aGUgcmlnaHQgZW5jb2RlciBkZXBlbmRpbmcgb24gdGhlIHR5cGVcclxuICAgKiBAcGFyYW0gYXJnIHRoZSBhcmcgb2YgdGhlIGlucHV0XHJcbiAgICogQHBhcmFtIGlucHV0IHRoZSBpbnB1dCBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlKGFyZzogYW55LCBpbnB1dDogQUJJSW5wdXQpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgdHlwZSA9IGlucHV0LnR5cGU7XHJcbiAgICAvLyBDb21wYXJlIHRydWUgd2l0aCB0aGUgcmVzdWx0IG9mIHRoZSBjYXNlc1xyXG4gICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgIC8vIEFycmF5OiBNdXN0IGJlIGZpcnN0XHJcbiAgICAgIGNhc2UgL1xcWyhbMC05XSopXFxdLy50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQXJyYXkoYXJnLCBpbnB1dCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gVHVwbGVcclxuICAgICAgY2FzZSAvdHVwbGU/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgLy8gR2V0IGFyZ3MgZ2l2ZW4gYXMgYW4gb2JqZWN0XHJcbiAgICAgICAgY29uc3QgYXJncyA9IE9iamVjdC5rZXlzKGFyZykubWFwKGtleSA9PiBhcmdba2V5XSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlVHVwbGUoYXJncywgaW5wdXQuY29tcG9uZW50cyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gU3RyaW5nXHJcbiAgICAgIGNhc2UgL3N0cmluZz8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVTdHJpbmcoYXJnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBEeW5hbWljIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2J5dGVzP1xcYi8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUR5bmFtaWNCeXRlcyhhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFN0YXRpYyBCeXRlc1xyXG4gICAgICBjYXNlIC9ieXRlcz8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVTdGF0aWNCeXRlcyhhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEludCAvIFVpbnRcclxuICAgICAgY2FzZSAvaW50Py8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUludChhcmcsIGlucHV0KTtcclxuICAgICAgfVxyXG4gICAgICAvLyBBZGRyZXNzXHJcbiAgICAgIGNhc2UgL2FkZHJlc3M/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQWRkcmVzcyhhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEJvb2xcclxuICAgICAgY2FzZSAvYm9vbD8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVCb29sKGFyZyk7XHJcbiAgICAgIH1cclxuICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgdGhlIGVuY29kZXIgZm9yIHRoZSB0eXBlIDogJyArIHR5cGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKlxyXG4gICAqIFNUQVRJQyBPUiBEWU5BTUlDXHJcbiAgICoqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBhIGxpc3Qgb2YgaW5wdXRzXHJcbiAgICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50cyBnaXZlbiBieSB0aGUgdXNlcnNcclxuICAgKiBAcGFyYW0gaW5wdXRzIFRoZSBpbnB1dHMgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZUlucHV0cyhhcmdzOiBhbnlbXSwgaW5wdXRzOiBBQklJbnB1dFtdKTogRW5jb2RlZFBhcmFtIHtcclxuICAgIGNvbnN0IG9mZnNldCA9IGFyZ3MubGVuZ3RoICogNjQ7XHJcbiAgICBjb25zdCBpbml0ID0gbmV3IEVuY29kZWRQYXJhbSgpO1xyXG4gICAgcmV0dXJuIGlucHV0cy5yZWR1Y2UoXHJcbiAgICAgIChwcmV2OiBFbmNvZGVkUGFyYW0sIGlucHV0OiBBQklJbnB1dCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IHRoaXMuZW5jb2RlKGFyZ3NbaV0sIGlucHV0KVxyXG4gICAgICAgIGNvbnN0IHN1Ym9mZnNldCA9IChvZmZzZXQgKyBwcmV2LnRhaWwubGVuZ3RoKSAvIDI7XHJcbiAgICAgICAgaWYgKGlzU3RhdGljKGlucHV0KSkge1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBFbmNvZGVkUGFyYW0ocHJldi5oZWFkICsgZW5jb2RlZCwgcHJldi50YWlsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGhlYWQgPSBudW1iZXJUb0hleChzdWJvZmZzZXQpLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgICAgICAgaGVhZCA9IHRoaXMucGFkU3RhcnQoaGVhZCwgNjQsICcwJyk7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IEVuY29kZWRQYXJhbShwcmV2LmhlYWQgKyBoZWFkLCBwcmV2LnRhaWwgKyBlbmNvZGVkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgaW5pdFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBhbiBhcnJheVxyXG4gICAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudCBnaXZlbiBieSB0aGUgdXNlciBmb3IgdGhpcyBhcnJheVxyXG4gICAqIEBwYXJhbSBpbnB1dCBUaGUgaW5wdXQgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVBcnJheShhcmdzOiBhbnlbXSwgaW5wdXQ6IEFCSUlucHV0KTogc3RyaW5nIHtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGFyZ3VtZW50cyBmb3VuZCBpbiBhcnJheSAke2lucHV0Lm5hbWV9YCk7XHJcbiAgICB9XHJcbiAgICBsZXQgZW5jb2RlZCA9ICcnO1xyXG4gICAgaWYgKCFpc0ZpeGVkQXJyYXkoaW5wdXQudHlwZSkpIHtcclxuICAgICAgZW5jb2RlZCA9IG51bWJlclRvSGV4KGFyZ3MubGVuZ3RoKS5yZXBsYWNlKCcweCcsICcnKVxyXG4gICAgICBlbmNvZGVkID0gdGhpcy5wYWRTdGFydChlbmNvZGVkLCA2NCwgJzAnKTtcclxuICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggIT09IGZpeGVkQXJyYXlTaXplKGlucHV0LnR5cGUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHthcmdzfSBzaG91bGQgYmUgb2Ygc2l6ZSAke2ZpeGVkQXJyYXlTaXplKGlucHV0LnR5cGUpfWApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW5wdXRzID0gcGFyYW1Gcm9tQXJyYXkoYXJncy5sZW5ndGgsIGlucHV0KTtcclxuICAgIGNvbnN0IHsgaGVhZCwgdGFpbCB9ID0gdGhpcy5lbmNvZGVJbnB1dHMoYXJncywgaW5wdXRzKTtcclxuICAgIHJldHVybiBlbmNvZGVkICsgaGVhZCArIHRhaWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgdGhlIHR1cGxlXHJcbiAgICogQHBhcmFtIGFyZ3MgQXJndW1lbnRzIG9mIHRoaXMgdHVwbGVcclxuICAgKiBAcGFyYW0gaW5wdXRzIElucHV0cyBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZVR1cGxlKGFyZ3M6IGFueVtdLCBpbnB1dHM6IEFCSUlucHV0W10pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgeyBoZWFkLCB0YWlsIH0gPSB0aGlzLmVuY29kZUlucHV0cyhhcmdzLCBpbnB1dHMpO1xyXG4gICAgcmV0dXJuIGhlYWQgKyB0YWlsO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKlxyXG4gICAqIERZTkFNSUNcclxuICAgKioqKioqKioqL1xyXG5cclxuICAvKiogRW5jb2RlIGEgc3RyaW5nICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVTdHJpbmcoYXJnOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIHN0cmluZ2ApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaGV4ID0gdXRmOFRvSGV4KGFyZykucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICBjb25zdCBzaXplID0gbnVtYmVyVG9IZXgoYXJnLmxlbmd0aCkucmVwbGFjZSgnMHgnLCAnJylcclxuICAgIGNvbnN0IGhleFNpemUgPSBoZXgubGVuZ3RoICsgNjQgLSAoaGV4Lmxlbmd0aCAlIDY0KTtcclxuICAgIHJldHVybiB0aGlzLnBhZFN0YXJ0KHNpemUsIDY0LCAnMCcpICsgdGhpcy5wYWRTdGFydChoZXgsIGhleFNpemUsICcwJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYSBkeW5hbWljIGJ5dGVzXHJcbiAgICogQGV4YW1wbGUgYnl0ZXNcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZUR5bmFtaWNCeXRlcyhhcmc6IHN0cmluZykge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIHN0cmluZ2ApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaGV4ID0gYXJnLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgY29uc3Qgc2l6ZSA9IG51bWJlclRvSGV4KGhleC5sZW5ndGggLyAyKS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIGNvbnN0IGhleFNpemUgPSBoZXgubGVuZ3RoICsgNjQgLSAoaGV4Lmxlbmd0aCAlIDY0KTtcclxuICAgIHJldHVybiB0aGlzLnBhZFN0YXJ0KHNpemUsIDY0LCAnMCcpICsgdGhpcy5wYWRFbmQoaGV4LCBoZXhTaXplLCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqXHJcbiAgICogU1RBVElDXHJcbiAgICoqKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYSBzdGF0aWMgYnl0ZXNcclxuICAgKiBAZXhhbXBsZSBieXRlczMsIGJ5dGVzMzJcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZVN0YXRpY0J5dGVzKGFyZzogc3RyaW5nIHwgbnVtYmVyKSB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGFyZyAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgc3RyaW5nIG9yIG51bWJlcmApO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7IGFyZyA9IGFyZy50b1N0cmluZygxNik7IH1cclxuICAgIGNvbnN0IHJlc3VsdCA9IGFyZy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIHJldHVybiB0aGlzLnBhZEVuZChyZXN1bHQsIDQ2LCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGludCBvciB1aW50XHJcbiAgICogQGV4YW1wbGUgaW50LCBpbnQzMiwgdWludDI1NlxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5jb2RlSW50KGFyZzogbnVtYmVyLCBpbnB1dDogQUJJSW5wdXQpIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBudW1iZXJgKTtcclxuICAgIH1cclxuICAgIGlmIChhcmcgJSAxICE9PSAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBwcm92aWRlciBpbnRlZ2VycywgU29saWRpdHkgZG9lcyBub3QgbWFuYWdlIGZsb2F0cycpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlucHV0LnR5cGUuaW5jbHVkZXMoJ3VpbnQnKSAmJiBhcmcgPCAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXCJ1aW50XCIgY2Fubm90IGJlIG5lZ2F0aXZlIGF0IHZhbHVlICR7YXJnfWApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9CTihhcmcpLnRvVHdvcygyNTYpLnRvU3RyaW5nKDE2LCA2NCk7XHJcbiAgfVxyXG5cclxuICAvKiogRW5jb2RlIGFuIGFkZHJlc3MgKi9cclxuICBwcml2YXRlIGVuY29kZUFkZHJlc3MoYXJnOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgYXJnICE9PSAnbnVtYmVyJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBzdHJpbmcgb3IgbnVtYmVyYCk7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHsgYXJnID0gYXJnLnRvU3RyaW5nKDE2KTsgfVxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXJnLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgcmV0dXJuIHRoaXMucGFkU3RhcnQocmVzdWx0LCA2NCwgJzAnKTtcclxuICB9XHJcblxyXG4gIC8qKiBFbmNvZGUgYSBib29sZWFuICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVCb29sKGFyZzogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIGJvb2xlYW5gKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcmcgPyB0aGlzLnBhZFN0YXJ0KCcxJywgNjQsICcwJykgOiB0aGlzLnBhZFN0YXJ0KCcwJywgNjQsICcwJyk7XHJcbiAgfVxyXG5cclxuICAvKioqXHJcbiAgICogUGFkU3RhcnQgLyBQYWRFbmRcclxuICAgKi9cclxuICBwcml2YXRlIHBhZFN0YXJ0KHRhcmdldDogc3RyaW5nLCB0YXJnZXRMZW5ndGg6IG51bWJlciwgcGFkU3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgLyogdHNsaW50OmRpc2FibGUgKi9cclxuICAgIHRhcmdldExlbmd0aCA9IHRhcmdldExlbmd0aCA+PiAwOyAvL3RydW5jYXRlIGlmIG51bWJlciBvciBjb252ZXJ0IG5vbi1udW1iZXIgdG8gMDtcclxuICAgIC8qIHRzbGludDplbmFibGUgKi9cclxuICAgIHBhZFN0cmluZyA9IFN0cmluZyh0eXBlb2YgcGFkU3RyaW5nICE9PSAndW5kZWZpbmVkJyA/IHBhZFN0cmluZyA6ICcgJyk7XHJcbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCA+IHRhcmdldExlbmd0aCkge1xyXG4gICAgICByZXR1cm4gU3RyaW5nKHRhcmdldCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0YXJnZXRMZW5ndGggPSB0YXJnZXRMZW5ndGggLSB0YXJnZXQubGVuZ3RoO1xyXG4gICAgICBpZiAodGFyZ2V0TGVuZ3RoID4gcGFkU3RyaW5nLmxlbmd0aCkge1xyXG4gICAgICAgIHBhZFN0cmluZyArPSBwYWRTdHJpbmcucmVwZWF0KHRhcmdldExlbmd0aCAvIHBhZFN0cmluZy5sZW5ndGgpOyAvL2FwcGVuZCB0byBvcmlnaW5hbCB0byBlbnN1cmUgd2UgYXJlIGxvbmdlciB0aGFuIG5lZWRlZFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBwYWRTdHJpbmcuc2xpY2UoMCwgdGFyZ2V0TGVuZ3RoKSArIFN0cmluZyh0YXJnZXQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcGFkRW5kKHRhcmdldDogc3RyaW5nLCB0YXJnZXRMZW5ndGg6IG51bWJlciwgcGFkU3RyaW5nOiBzdHJpbmcpOiBzdHJpbmd7XHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG4gICAgdGFyZ2V0TGVuZ3RoID0gdGFyZ2V0TGVuZ3RoID4+IDA7IC8vZmxvb3IgaWYgbnVtYmVyIG9yIGNvbnZlcnQgbm9uLW51bWJlciB0byAwO1xyXG4gICAgLyogdHNsaW50OmVuYWJsZSAqL1xyXG4gICAgcGFkU3RyaW5nID0gU3RyaW5nKHR5cGVvZiBwYWRTdHJpbmcgIT09ICd1bmRlZmluZWQnID8gcGFkU3RyaW5nIDogJyAnKTtcclxuICAgIGlmICh0YXJnZXQubGVuZ3RoID4gdGFyZ2V0TGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBTdHJpbmcodGFyZ2V0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRhcmdldExlbmd0aCA9IHRhcmdldExlbmd0aCAtIHRhcmdldC5sZW5ndGg7XHJcbiAgICAgIGlmICh0YXJnZXRMZW5ndGggPiBwYWRTdHJpbmcubGVuZ3RoKSB7XHJcbiAgICAgICAgcGFkU3RyaW5nICs9IHBhZFN0cmluZy5yZXBlYXQodGFyZ2V0TGVuZ3RoIC8gcGFkU3RyaW5nLmxlbmd0aCk7IC8vYXBwZW5kIHRvIG9yaWdpbmFsIHRvIGVuc3VyZSB3ZSBhcmUgbG9uZ2VyIHRoYW4gbmVlZGVkXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFN0cmluZyh0YXJnZXQpICsgcGFkU3RyaW5nLnNsaWNlKDAsIHRhcmdldExlbmd0aCk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb250cmFjdE1vZGVsIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb250cmFjdFByb3ZpZGVyIH0gZnJvbSAnQG5nZXRoL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgQUJJRW5jb2RlciwgQUJJRGVjb2RlciB9IGZyb20gJy4vYWJpJztcclxuaW1wb3J0IHsgQ29udHJhY3RNb2R1bGUgfSBmcm9tICcuL2NvbnRyYWN0Lm1vZHVsZSc7XHJcbmltcG9ydCB7IENvbnRyYWN0Q2xhc3MgfSBmcm9tICcuL2NvbnRyYWN0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDb250cmFjdDxUIGV4dGVuZHMgQ29udHJhY3RNb2RlbD4obWV0YWRhdGE6IHtcclxuICBwcm92aWRlcj86IFR5cGU8Q29udHJhY3RQcm92aWRlcj47ICAvLyBUT0RPIDogVXNlIGZvciBjdXN0b20gcHJvdmlkZXIgKHdpdGggQXV0aClcclxuICBhYmk6IGFueVtdIHwgc3RyaW5nO1xyXG4gIGFkZHJlc3Nlcz86IHtcclxuICAgIG1haW5uZXQ/OiBzdHJpbmc7XHJcbiAgICByb3BzdGVuPzogc3RyaW5nO1xyXG4gICAgcmlua2VieT86IHN0cmluZztcclxuICAgIGtvdmFuPzogc3RyaW5nO1xyXG4gIH07XHJcbn0pIHtcclxuICBjb25zdCB7IGFiaSwgYWRkcmVzc2VzIH0gPSBtZXRhZGF0YTtcclxuICBjb25zdCBqc29uSW50ZXJhY2U6IGFueVtdID0gdHlwZW9mIGFiaSA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKGFiaSkgOiBhYmk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgYWRkcmVzcyBvZiB0aGUgY29udHJhY3QgZGVwZW5kaW5nIG9uIHRoZSBpZCBvZiB0aGUgbmV0d29ya1xyXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgb2YgdGhlIG5ldHdvcmtcclxuICAgKi9cclxuICBjb25zdCBnZXRBZGRyZXNzID0gKGlkOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xyXG4gICAgc3dpdGNoKGlkKSB7XHJcbiAgICAgIGNhc2UgMTogcmV0dXJuIGFkZHJlc3Nlc1snbWFpbm5ldCddO1xyXG4gICAgICBjYXNlIDM6IHJldHVybiBhZGRyZXNzZXNbJ3JvcHN0ZW4nXTtcclxuICAgICAgY2FzZSA0OiByZXR1cm4gYWRkcmVzc2VzWydyaW5rZWJ5J107XHJcbiAgICAgIGNhc2UgNDI6IHJldHVybiBhZGRyZXNzZXNbJ2tvdmFuJ107XHJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBhZGRyZXNzZXNbJ21haW5uZXQnXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihCYXNlKSB7XHJcbiAgICBASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IENvbnRyYWN0TW9kdWxlIH0pXHJcbiAgICBjbGFzcyBDb250cmFjdERlY29yYXRlZCBleHRlbmRzIENvbnRyYWN0Q2xhc3M8VD4ge1xyXG4gICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcm90ZWN0ZWQgZW5jb2RlcjogQUJJRW5jb2RlcixcclxuICAgICAgICBwcm90ZWN0ZWQgZGVjb2RlcjogQUJJRGVjb2RlcixcclxuICAgICAgICBwcm90ZWN0ZWQgcHJvdmlkZXI6IENvbnRyYWN0UHJvdmlkZXJcclxuICAgICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZW5jb2RlciwgZGVjb2RlciwgcHJvdmlkZXIsIGpzb25JbnRlcmFjZSwgZ2V0QWRkcmVzcyhwcm92aWRlci5pZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQ29udHJhY3REZWNvcmF0ZWQgYXMgYW55O1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29udHJhY3RDbGFzcyB9IGZyb20gJy4uLy4uL2NvbnRyYWN0JztcclxuaW1wb3J0IHsgQ29udHJhY3QgfSBmcm9tICcuLi8uLi9jb250cmFjdC5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBJRW5jb2RlclRlc3RDb250cmFjdCB9IGZyb20gJy4vZW5jb2Rlci10ZXN0Lm1vZGVscyc7XHJcbmNvbnN0IGFiaSA9IHJlcXVpcmUoJy4vZW5jb2Rlci10ZXN0LmFiaS5qc29uJyk7XHJcblxyXG5AQ29udHJhY3Q8SUVuY29kZXJUZXN0Q29udHJhY3Q+KHtcclxuICBhYmk6IGFiaSxcclxuICBhZGRyZXNzZXM6IHtcclxuICAgIHJvcHN0ZW46ICcweDM0NGY2NDFmZjYwZjYzMDhhZDcwYjFlNjIwNTI3NjQ4MzVmNDhlMDAnXHJcbiAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRW5jb2RlclRlc3RDb250cmFjdCBleHRlbmRzIENvbnRyYWN0Q2xhc3M8SUVuY29kZXJUZXN0Q29udHJhY3Q+IHt9XHJcbiIsImltcG9ydCB7IENvbnRyYWN0Q2xhc3MgfSBmcm9tICcuLi8uLi9jb250cmFjdCc7XHJcbmltcG9ydCB7IENvbnRyYWN0LCAgfSBmcm9tICcuLi8uLi9jb250cmFjdC5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBJVGVzdEV2ZW50Q29udHJhY3QgfSBmcm9tICcuL3Rlc3QtZXZlbnQubW9kZWxzJztcclxuY29uc3QgYWJpID0gcmVxdWlyZSgnLi90ZXN0LWV2ZW50LmFiaS5qc29uJyk7XHJcblxyXG5AQ29udHJhY3Q8SVRlc3RFdmVudENvbnRyYWN0Pih7XHJcbiAgYWJpOiBhYmksXHJcbiAgYWRkcmVzc2VzOiB7XHJcbiAgICByb3BzdGVuOiAnMHhjMEQ2QzRjYkExNGFlRkMyMThkMGZmNjY5ZTA3RDczRTc0MDc4MjQ4J1xyXG4gIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIFRlc3RFdmVudENvbnRyYWN0IGV4dGVuZHMgQ29udHJhY3RDbGFzczxJVGVzdEV2ZW50Q29udHJhY3Q+IHt9XHJcbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fdmFsdWVzIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJhYmkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQTs7Ozs7QUFBQTtJQUtFLHVCQUNZLE9BQW1CLEVBQ25CLE9BQW1CLEVBQ25CLFFBQTBCLEVBQzVCLEtBQ0Q7UUFMVCxpQkEwQkM7UUF6QlcsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBQzVCLFFBQUcsR0FBSCxHQUFHO1FBQ0osWUFBTyxHQUFQLE9BQU87dUNBVDRDLEVBQVM7dUNBQ1QsRUFBUzt3Q0FDTixFQUFTO1FBU3RFLElBQUksQ0FBQyxJQUFJLENBQUMs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