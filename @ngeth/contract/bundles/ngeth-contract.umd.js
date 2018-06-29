(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@ngeth/utils'), require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('bn.js'), require('@ngeth/provider')) :
    typeof define === 'function' && define.amd ? define('@ngeth/contract', ['exports', '@ngeth/utils', 'rxjs', 'rxjs/operators', '@angular/core', 'bn.js', '@ngeth/provider'], factory) :
    (factory((global.ngeth = global.ngeth || {}, global.ngeth.contract = {}),null,global.rxjs,global.rxjs.operators,global.ng.core,null,null));
}(this, (function (exports,utils,rxjs,operators,i0,bn_js,provider) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }

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
    ContractClass = (function () {
        function ContractClass(encoder, decoder, provider$$1, abi, address) {
            var _this = this;
            this.encoder = encoder;
            this.decoder = decoder;
            this.provider = provider$$1;
            this.abi = abi;
            this.address = address;
            this.calls = /** @type {?} */ ({});
            this.sends = /** @type {?} */ ({});
            this.events = /** @type {?} */ ({});
            if (!this.abi) {
                throw new Error('Please add an abi to the contract');
            }
            if (this.address) {
                this.address = utils.toChecksumAddress(address);
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
            catch (e_1_1) {
                e_1 = { error: e_1_1 };
            }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return))
                        _c.call(_a);
                }
                finally {
                    if (e_1)
                        throw e_1.error;
                }
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
                    .pipe(operators.switchMap(function (tx) { return _this.provider.sendTransaction(tx); }));
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
                    .pipe(operators.map(function (result) { return _this.decoder.decodeOutputs(result, method.outputs); }), operators.map(function (result) { return result[Object.keys(result)[0]]; }));
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
                    .pipe(operators.switchMap(function (tx) { return _this.provider.sendTransaction(tx); }));
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
                return this.provider.event(this.address, [topics]).pipe(operators.map(function (logs) { return _this.decoder.decodeEvent(logs.topics, logs.data, event.inputs); }));
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
                return rxjs.forkJoin(this.provider.estimateGas(tx), this.provider.gasPrice()).pipe(operators.map(function (_a) {
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
    var ContractModule = (function () {
        function ContractModule() {
        }
        ContractModule.decorators = [
            { type: i0.NgModule },
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
    var DecodedParam = (function () {
        function DecodedParam(result, offset) {
            this.result = result;
            this.offset = offset;
        }
        return DecodedParam;
    }());
    var ABIDecoder = (function () {
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
                    .filter(function (output) { return !((output)).indexed; }) // Remove indexed values
                    .reduceRight(function (acc, output, i) {
                    var /** @type {?} */ head = _this.getHead(bytes, outputs, i);
                    if (isStatic(output)) {
                        acc.result[output.name || i] = _this.decodeBytes(head, output);
                        return new DecodedParam(acc.result, acc.offset);
                    }
                    else {
                        var /** @type {?} */ tailStart = utils.hexToNumber(head) * 2; // transform bytes to hex
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
                    amount = utils.hexToNumber(bytes.slice(0, 64));
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
                return utils.hexToUtf8(str);
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
                var /** @type {?} */ amount = utils.hexToNumber(bytes.slice(0, 64));
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
                    return (new bn_js.BN(value.substr(0, 1), 16).toString(2).substr(0, 1)) === '1';
                };
                if (isNegative(bytes)) {
                    return new bn_js.BN(bytes, 16).fromTwos(256).toString(10);
                }
                return utils.hexToNumberString(bytes);
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
                return utils.toChecksumAddress(bytes.substring(24));
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
            { type: i0.Injectable, args: [{ providedIn: ContractModule },] },
        ];
        /** @nocollapse */ ABIDecoder.ngInjectableDef = i0.defineInjectable({ factory: function ABIDecoder_Factory() { return new ABIDecoder(); }, token: ABIDecoder, providedIn: ContractModule });
        return ABIDecoder;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var EncodedParam = (function () {
        function EncodedParam(head, tail) {
            if (head === void 0) {
                head = '';
            }
            if (tail === void 0) {
                tail = '';
            }
            this.head = head;
            this.tail = tail;
        }
        return EncodedParam;
    }());
    var ABIEncoder = (function () {
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
                var /** @type {?} */ hashSign = utils.keccak256(signature).slice(0, 10);
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
                return utils.keccak256(signature);
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
                        var /** @type {?} */ head = utils.numberToHex(suboffset).replace('0x', '');
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
                    encoded = utils.numberToHex(args.length).replace('0x', '');
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
                var /** @type {?} */ hex = utils.utf8ToHex(arg).replace('0x', '');
                var /** @type {?} */ size = utils.numberToHex(arg.length).replace('0x', '');
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
                var /** @type {?} */ size = utils.numberToHex(hex.length / 2).replace('0x', '');
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
                return utils.toBN(arg).toTwos(256).toString(16, 64);
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
            { type: i0.Injectable, args: [{ providedIn: ContractModule },] },
        ];
        /** @nocollapse */
        ABIEncoder.ctorParameters = function () { return []; };
        /** @nocollapse */ ABIEncoder.ngInjectableDef = i0.defineInjectable({ factory: function ABIEncoder_Factory() { return new ABIEncoder(); }, token: ABIEncoder, providedIn: ContractModule });
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
            var ContractDecorated = (function (_super) {
                __extends(ContractDecorated, _super);
                function ContractDecorated(encoder, decoder, provider$$1) {
                    var _this = _super.call(this, encoder, decoder, provider$$1, jsonInterace, getAddress(provider$$1.id)) || this;
                    _this.encoder = encoder;
                    _this.decoder = decoder;
                    _this.provider = provider$$1;
                    return _this;
                }
                ContractDecorated.decorators = [
                    { type: i0.Injectable, args: [{ providedIn: ContractModule },] },
                ];
                /** @nocollapse */
                ContractDecorated.ctorParameters = function () {
                    return [
                        { type: ABIEncoder, },
                        { type: ABIDecoder, },
                        { type: provider.ContractProvider, },
                    ];
                };
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
    var EncoderTestContract = (function (_super) {
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
    var TestEventContract = (function (_super) {
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

    exports.ContractClass = ContractClass;
    exports.DecodedParam = DecodedParam;
    exports.ABIDecoder = ABIDecoder;
    exports.EncodedParam = EncodedParam;
    exports.ABIEncoder = ABIEncoder;
    exports.Contract = Contract;
    exports.ContractModule = ContractModule;
    exports.EncoderTestContract = EncoderTestContract;
    exports.TestEventContract = TestEventContract;
    exports.ɵb = ABIDecoder;
    exports.ɵa = ABIEncoder;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtY29udHJhY3QudW1kLmpzLm1hcCIsInNvdXJjZXMiOltudWxsLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvY29udHJhY3QudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvY29udHJhY3QubW9kdWxlLnRzIiwibmc6Ly9AbmdldGgvY29udHJhY3QvbGliL2FiaS91dGlscy50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9hYmkvZGVjb2Rlci50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9hYmkvZW5jb2Rlci50cyIsIm5nOi8vQG5nZXRoL2NvbnRyYWN0L2xpYi9jb250cmFjdC5kZWNvcmF0b3IudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvYWJpL2VuY29kZXItdGVzdC9lbmNvZGVyLXRlc3QuY29udHJhY3QudHMiLCJuZzovL0BuZ2V0aC9jb250cmFjdC9saWIvYWJpL3Rlc3QtZXZlbnQvdGVzdC1ldmVudC5jb250cmFjdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IHlbb3BbMF0gJiAyID8gXCJyZXR1cm5cIiA6IG9wWzBdID8gXCJ0aHJvd1wiIDogXCJuZXh0XCJdKSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFswLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyAgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKG9bbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH07IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl07XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgQUJJRGVmaW5pdGlvbiwgdG9DaGVja3N1bUFkZHJlc3MsIENvbnRyYWN0TW9kZWwsIElUeE9iamVjdCB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IENvbnRyYWN0UHJvdmlkZXIgfSBmcm9tICdAbmdldGgvcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBBQklFbmNvZGVyLCBBQklEZWNvZGVyIH0gZnJvbSAnLi9hYmknO1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwLCAgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRyYWN0Q2xhc3M8VCBleHRlbmRzIENvbnRyYWN0TW9kZWw+IHtcclxuICBwdWJsaWMgY2FsbHM6IHsgW1AgaW4ga2V5b2YgVFsnY2FsbHMnXV06IFRbJ2NhbGxzJ11bUF07IH0gPSB7fSBhcyBhbnk7XHJcbiAgcHVibGljIHNlbmRzOiB7IFtQIGluIGtleW9mIFRbJ3NlbmRzJ11dOiBUWydzZW5kcyddW1BdOyB9ID0ge30gYXMgYW55O1xyXG4gIHB1YmxpYyBldmVudHM6IHsgW1AgaW4ga2V5b2YgVFsnZXZlbnRzJ11dOiBUWydldmVudHMnXVtQXTsgfSA9IHt9IGFzIGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcm90ZWN0ZWQgZW5jb2RlcjogQUJJRW5jb2RlcixcclxuICAgIHByb3RlY3RlZCBkZWNvZGVyOiBBQklEZWNvZGVyLFxyXG4gICAgcHJvdGVjdGVkIHByb3ZpZGVyOiBDb250cmFjdFByb3ZpZGVyLFxyXG4gICAgcHJpdmF0ZSBhYmk6IEFCSURlZmluaXRpb25bXSxcclxuICAgIHB1YmxpYyBhZGRyZXNzPzogc3RyaW5nXHJcbiAgKSB7XHJcbiAgICBpZiAoIXRoaXMuYWJpKSB7IHRocm93IG5ldyBFcnJvcignUGxlYXNlIGFkZCBhbiBhYmkgdG8gdGhlIGNvbnRyYWN0Jyk7IH1cclxuICAgIGlmICh0aGlzLmFkZHJlc3MpIHsgdGhpcy5hZGRyZXNzID0gdG9DaGVja3N1bUFkZHJlc3MoYWRkcmVzcyk7IH1cclxuICAgIGNvbnN0IGNhbGxzOiBhbnlbXSA9IFtdO1xyXG4gICAgY29uc3Qgc2VuZHM6IGFueVtdID0gW107XHJcbiAgICBjb25zdCBldmVudHM6IGFueVtdID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGRlZiBvZiB0aGlzLmFiaSkge1xyXG4gICAgICBpZiAoZGVmLnR5cGUgPT09ICdmdW5jdGlvbicgJiYgZGVmLmNvbnN0YW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgY2FsbHMucHVzaChkZWYpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkZWYudHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWYuY29uc3RhbnQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgc2VuZHMucHVzaChkZWYpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkZWYudHlwZSA9PT0gJ2V2ZW50Jykge1xyXG4gICAgICAgIGV2ZW50cy5wdXNoKGRlZik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNhbGxzLmZvckVhY2goZGVmID0+ICh0aGlzLmNhbGxzW2RlZi5uYW1lXSA9IHRoaXMuY2FsbE1ldGhvZC5iaW5kKHRoaXMsIGRlZikpKTtcclxuICAgIHNlbmRzLmZvckVhY2goZGVmID0+ICh0aGlzLnNlbmRzW2RlZi5uYW1lXSA9IHRoaXMuc2VuZE1ldGhvZC5iaW5kKHRoaXMsIGRlZikpKTtcclxuICAgIGV2ZW50cy5mb3JFYWNoKGRlZiA9PiAodGhpcy5ldmVudHNbZGVmLm5hbWVdID0gdGhpcy5ldmVudE1ldGhvZC5iaW5kKHRoaXMsIGRlZikpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlcGxveSB0aGUgY29udHJhY3Qgb24gdGhlIGJsb2NrY2hhaW5cclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIG9mIHRoZSBjb250cmFjdFxyXG4gICAqIEBwYXJhbSBwYXJhbXMgUGFyYW1zIHRvIHBhc3MgaW50byB0aGUgY29uc3RydWN0b3JcclxuICAgKi9cclxuICBwdWJsaWMgZGVwbG95KGJ5dGVzOiBzdHJpbmcsIC4uLnBhcmFtczogYW55W10pIHtcclxuICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gdGhpcy5hYmkuZmluZChkZWYgPT4gZGVmLnR5cGUgPT09ICdjb25zdHJ1Y3RvcicpO1xyXG4gICAgY29uc3Qgbm9QYXJhbSA9IHBhcmFtcy5sZW5ndGggPT09IDA7XHJcbiAgICBjb25zdCBkYXRhID0gbm9QYXJhbSA/IGJ5dGVzIDogdGhpcy5lbmNvZGVyLmVuY29kZUNvbnN0cnVjdG9yKGNvbnN0cnVjdG9yLCBieXRlcywgcGFyYW1zKTtcclxuICAgIHJldHVybiB0aGlzLmZpbGxHYXMoeyAuLi50aGlzLnByb3ZpZGVyLmRlZmF1bHRUeCwgZGF0YSB9KVxyXG4gICAgICAucGlwZShzd2l0Y2hNYXAodHggPT4gdGhpcy5wcm92aWRlci5zZW5kVHJhbnNhY3Rpb24odHgpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIGZvciAnY2FsbCcgbWV0aG9kc1xyXG4gICAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBjYWxsXHJcbiAgICogQHBhcmFtIHBhcmFtcyBUaGUgcGFyYW1zIGdpdmVuIGJ5IHRoZSB1c2VyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBjYWxsTWV0aG9kKG1ldGhvZDogQUJJRGVmaW5pdGlvbiwgLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZW5jb2Rlci5lbmNvZGVNZXRob2QobWV0aG9kLCBwYXJhbXMpO1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJcclxuICAgICAgLmNhbGw8c3RyaW5nPih0aGlzLmFkZHJlc3MsIGRhdGEpXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIG1hcChyZXN1bHQgPT4gdGhpcy5kZWNvZGVyLmRlY29kZU91dHB1dHMocmVzdWx0LCBtZXRob2Qub3V0cHV0cykpLFxyXG4gICAgICAgIG1hcChyZXN1bHQgPT4gcmVzdWx0W09iamVjdC5rZXlzKHJlc3VsdClbMF1dKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXNlZCBmb3IgJ3NlbmQnIG1ldGhvZHNcclxuICAgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gc2VuZFxyXG4gICAqIEBwYXJhbSBwYXJhbXMgVGhlIHBhcmFtcyBnaXZlbiBieSB0aGUgdXNlclxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2VuZE1ldGhvZChtZXRob2Q6IEFCSURlZmluaXRpb24sIC4uLnBhcmFtczogYW55W10pIHtcclxuICAgIGNvbnN0IHsgdG8sIGRhdGEgfSA9IHsgdG86IHRoaXMuYWRkcmVzcywgZGF0YTogdGhpcy5lbmNvZGVyLmVuY29kZU1ldGhvZChtZXRob2QsIHBhcmFtcykgfTtcclxuICAgIHJldHVybiB0aGlzLmZpbGxHYXMoeyAuLi50aGlzLnByb3ZpZGVyLmRlZmF1bHRUeCwgdG8sIGRhdGEgfSlcclxuICAgICAgLnBpcGUoc3dpdGNoTWFwKHR4ID0+IHRoaXMucHJvdmlkZXIuc2VuZFRyYW5zYWN0aW9uKHR4KSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXNlZCBmb3IgJ2V2ZW50JyBkZWZpbml0aW9uXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCBkZWZpbml0aW9uIGluIHRoZSBBQklcclxuICAgKi9cclxuICBwcml2YXRlIGV2ZW50TWV0aG9kKGV2ZW50OiBBQklEZWZpbml0aW9uKSB7XHJcbiAgICBjb25zdCB0b3BpY3MgPSB0aGlzLmVuY29kZXIuZW5jb2RlRXZlbnQoZXZlbnQpO1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIuZXZlbnQodGhpcy5hZGRyZXNzLCBbdG9waWNzXSkucGlwZShcclxuICAgICAgbWFwKGxvZ3MgPT4gdGhpcy5kZWNvZGVyLmRlY29kZUV2ZW50KGxvZ3MudG9waWNzLCBsb2dzLmRhdGEsIGV2ZW50LmlucHV0cykpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmlsbCB0aGUgZXN0aW1hdGVkIGFtb3VudCBvZiBnYXMgYW5kIGdhc1ByaWNlIHRvIHVzZSBmb3IgYSB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSB0eCBUaGUgcmF3IHRyYW5zYWN0aW9uIHRvIGVzdGltYXRlIHRoZSBnYXMgZnJvbVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZmlsbEdhcyh0eDogUGFydGlhbDxJVHhPYmplY3Q+KTogT2JzZXJ2YWJsZTxQYXJ0aWFsPElUeE9iamVjdD4+IHtcclxuICAgIHJldHVybiBmb3JrSm9pbihcclxuICAgICAgdGhpcy5wcm92aWRlci5lc3RpbWF0ZUdhcyh0eCksXHJcbiAgICAgIHRoaXMucHJvdmlkZXIuZ2FzUHJpY2UoKVxyXG4gICAgKS5waXBlKG1hcCgoW2dhcywgZ2FzUHJpY2VdKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4udHgsIGdhcywgZ2FzUHJpY2UgfVxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ATmdNb2R1bGUoKVxyXG5leHBvcnQgY2xhc3MgQ29udHJhY3RNb2R1bGUge31cclxuIiwiaW1wb3J0IHsgQUJJSW5wdXQgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhbiBhcnJheSBvZiBwYXJhbXMgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIGFycmF5IGluIHRoZSBBQkkgYW5kIHRoZSBtb2RlbFxyXG4gKiBAcGFyYW0gc2l6ZSBUaGUgYW1vdW50IG9mIGVsZW1lbnRzIGluIHRoZSBhcnJheVxyXG4gKiBAcGFyYW0gcGFyYW0gVGhlIG1vZGVsIG9mIHBhcmFtIHRvIGJhc2VkIHRoZSBuZXcgYXJyYXkgb25cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJhbUZyb21BcnJheShzaXplOiBudW1iZXIsIHBhcmFtOiBBQklJbnB1dCkge1xyXG4gIGNvbnN0IHR5cGUgPSBuZXN0ZWRUeXBlKHBhcmFtLnR5cGUpO1xyXG4gIGNvbnN0IHBhcmFtTW9kZWwgPSB7IC4uLnBhcmFtLCBuYW1lOiAnJywgdHlwZTogdHlwZSB9OyAgLy8gUmVtb3ZlIG5hbWUgdG8gYXZvaWQgY29uZmxpY3RcclxuICByZXR1cm4gQXJyYXkoc2l6ZSkuZmlsbChwYXJhbU1vZGVsKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgc2l6ZSBvZiB0aGUgZml4ZWQgYXJyYXkgYXNrIGJ5IHRoZSBBQklcclxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGFycmF5XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZml4ZWRBcnJheVNpemUodHlwZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICBjb25zdCBsYXN0QXJyYXlTdHIgPSBuZXN0ZWRBcnJheSh0eXBlKS5wb3AoKTtcclxuICBjb25zdCBsYXN0QXJyYXkgPSBKU09OLnBhcnNlKGxhc3RBcnJheVN0cik7XHJcbiAgaWYgKGxhc3RBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQXJyYXkgb2YgdHlwZSAke3R5cGV9IGlzIG5vdCBhIGZpeGVkIGFycmF5YCk7XHJcbiAgfVxyXG4gIHJldHVybiBwYXJzZUludChsYXN0QXJyYXlbMF0sIDEwKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSB0dXBsZSBpcyBzdGF0aWNcclxuICogQHBhcmFtIHR1cGxlIFRoZSB0dXBsZSBvYmplY3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXRpY1R1cGxlKHR1cGxlOiBBQklJbnB1dCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICB0dXBsZS50eXBlID09PSAndHVwbGUnICAvLyBQcmV2ZW50IHR5cGUgdG8gYmUgJ3R1cGxlW10nXHJcbiAgICAmJiB0dXBsZS5jb21wb25lbnRzXHJcbiAgICAmJiB0dXBsZS5jb21wb25lbnRzLmZpbHRlcihwYXJhbSA9PiAhaXNTdGF0aWMocGFyYW0pKS5sZW5ndGggPT09IDBcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIGFycmF5IGlzIHN0YXRpY1xyXG4gKiBAcGFyYW0gYXJyIFRoZSBhcnJheSBvYmplY3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXRpY0FycmF5KGFycjogQUJJSW5wdXQpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgaXNGaXhlZEFycmF5KGFyci50eXBlKVxyXG4gICAgJiYgaXNTdGF0aWMoey4uLmFyciwgdHlwZTogbmVzdGVkVHlwZShhcnIudHlwZSl9KSAvLyBOZXN0ZWQgVHlwZSBpcyBzdGF0aWNcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIG91dHB1dCBpcyBzdGF0aWNcclxuICogQHBhcmFtIG91dHB1dCBUaGUgb3V0cHV0IGRlZmluZWQgaW4gdGhlIGFiaVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhdGljKG91dHB1dDogQUJJSW5wdXQpOiBib29sZWFuIHtcclxuICBjb25zdCB0eXBlID0gb3V0cHV0LnR5cGU7XHJcbiAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAvLyBBcnJheVxyXG4gICAgY2FzZSAvXFxbKFswLTldKilcXF0vLnRlc3QodHlwZSk6XHJcbiAgICAgIHJldHVybiBpc1N0YXRpY0FycmF5KG91dHB1dCk7XHJcbiAgICAvLyBUdXBsZVxyXG4gICAgY2FzZSAvdHVwbGU/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgIHJldHVybiBpc1N0YXRpY1R1cGxlKG91dHB1dCk7XHJcbiAgICB9XHJcbiAgICAvLyBEeW5hbWljXHJcbiAgICBjYXNlIC9zdHJpbmc/Ly50ZXN0KHR5cGUpOlxyXG4gICAgY2FzZSAvYnl0ZXM/XFxiLy50ZXN0KHR5cGUpOlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyBTdGF0aWNcclxuICAgIGNhc2UgL2J5dGVzPy8udGVzdCh0eXBlKTpcclxuICAgIGNhc2UgL2ludD8vLnRlc3QodHlwZSk6XHJcbiAgICBjYXNlIC9hZGRyZXNzPy8udGVzdCh0eXBlKTpcclxuICAgIGNhc2UgL2Jvb2w/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgYXJyYXkgaXMgZml4ZWRcclxuICogQHBhcmFtIHR5cGUgVHlwZSBvZiB0aGUgYXJyYXlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0ZpeGVkQXJyYXkodHlwZTogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIC9cXFtbMC05XVxcXS8udGVzdCh0eXBlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBsYXN0IFtdIGluIHR5cGVcclxuICogQGV4YW1wbGUgaW50WzMyXSA9PiBpbnRcclxuICogQGV4YW1wbGUgaW50WzJdWzNdID0+IGludFsyXVxyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB0byBtb2RpZnlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBuZXN0ZWRUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgYXJyYXlzID0gbmVzdGVkQXJyYXkodHlwZSk7XHJcbiAgaWYgKCFhcnJheXMpIHsgcmV0dXJuIHR5cGU7IH1cclxuICBjb25zdCBsYXN0QXJyYXkgPSBhcnJheXNbYXJyYXlzLmxlbmd0aCAtIDFdO1xyXG4gIHJldHVybiB0eXBlLnN1YnN0cmluZygwLCB0eXBlLmxlbmd0aCAtIGxhc3RBcnJheS5sZW5ndGgpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIHJldHVybiBhcnJheSBvZiBuZXN0ZWQgdHlwZXNcclxuICogQGV4YW1wbGUgaW50WzJdWzNdW10gPT4gW1syXSwgWzNdLCBbXV1cclxuICogQGV4YW1wbGUgaW50W10gPT4gW1tdXVxyXG4gKiBAZXhhbXBsZSBpbnQgPT4gbnVsbFxyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB0byBtYXRjaFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG5lc3RlZEFycmF5KHR5cGU6IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICByZXR1cm4gdHlwZS5tYXRjaCgvKFxcW1swLTldKlxcXSkvZyk7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IEJOIH0gZnJvbSAnYm4uanMnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyYWN0TW9kdWxlIH0gZnJvbSAnLi8uLi9jb250cmFjdC5tb2R1bGUnO1xyXG5pbXBvcnQge1xyXG4gIGlzU3RhdGljLFxyXG4gIGlzRml4ZWRBcnJheSxcclxuICBmaXhlZEFycmF5U2l6ZSxcclxuICBwYXJhbUZyb21BcnJheSxcclxuICBpc1N0YXRpY1R1cGxlLFxyXG4gIGlzU3RhdGljQXJyYXkgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHtcclxuICBBQklPdXRwdXQsXHJcbiAgQUJJSW5wdXQsXHJcbiAgaGV4VG9OdW1iZXIsXHJcbiAgaGV4VG9VdGY4LFxyXG4gIGhleFRvTnVtYmVyU3RyaW5nLFxyXG4gIHRvQ2hlY2tzdW1BZGRyZXNzXHJcbn0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEZWNvZGVkUGFyYW0ge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZXN1bHQ6IERlY29kZWRQYXJhbSwgcHVibGljIG9mZnNldDogbnVtYmVyKSB7fVxyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IENvbnRyYWN0TW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBBQklEZWNvZGVyIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIGFuIGV2ZW50IG91dHB1dFxyXG4gICAqIEBwYXJhbSB0b3BpY3MgVGhlIHRvcGljcyBvZiB0aGUgbG9ncyAoaW5kZXhlZCB2YWx1ZXMpXHJcbiAgICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgb2YgdGhlIGxvZ3MgKGJ5dGVzKVxyXG4gICAqIEBwYXJhbSBpbnB1dHMgVGhlIGlucHV0cyBnaXZlbnQgYnkgdGhlIEFCSVxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVFdmVudCh0b3BpY3M6IHN0cmluZ1tdLCBkYXRhOiBzdHJpbmcsIGlucHV0czogQUJJSW5wdXRbXSk6IGFueSB7XHJcbiAgICBjb25zdCBvdXRwdXRzID0gdGhpcy5kZWNvZGVPdXRwdXRzKGRhdGEsIGlucHV0cyk7XHJcbiAgICBpbnB1dHNcclxuICAgICAgLmZpbHRlcihpbnB1dCA9PiBpbnB1dC5pbmRleGVkKVxyXG4gICAgICAuZm9yRWFjaCgoaW5wdXQsIGkpID0+IHtcclxuICAgICAgICBjb25zdCB0b3BpYyA9IHRvcGljc1tpICsgMV0ucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICAgICAgLy8gSWYgaW5kZXhlZCB2YWx1ZSBpcyBzdGF0aWMgZGVjb2RlLCBlbHNlIHJldHVybiBhcyBpdFxyXG4gICAgICAgIG91dHB1dHNbaW5wdXQubmFtZV0gPSBpc1N0YXRpYyhpbnB1dCkgPyB0aGlzLmRlY29kZUJ5dGVzKHRvcGljLCBpbnB1dCkgOiB0b3BpYztcclxuICAgICAgfSk7XHJcbiAgICByZXR1cm4gb3V0cHV0cztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbWFwIHRoZSBieXRlcyB0byBkZWNvZGUgZGVwZW5kaW5nIG9uIGl0cyB0eXBlXHJcbiAgICogQHBhcmFtIGJ5dGVzIFRoZSBieXRlcyB0byBkZWNvZGVcclxuICAgKiBAcGFyYW0gb3V0cHV0IFRoZSBvdXRwdXQgZGVzY3JpYmVkIGluIHRoZSBBYmlcclxuICAgKi9cclxuICBwdWJsaWMgZGVjb2RlQnl0ZXMoYnl0ZXM6IHN0cmluZywgb3V0cHV0OiBBQklPdXRwdXQpIHtcclxuICAgIGNvbnN0IHR5cGUgPSBvdXRwdXQudHlwZTtcclxuICAgIC8vIENvbXBhcmUgdHJ1ZSB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIGNhc2VzXHJcbiAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgLy8gQXJyYXk6IE11c3QgYmUgZmlyc3RcclxuICAgICAgY2FzZSAvXFxbKFswLTldKilcXF0vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlQXJyYXkoYnl0ZXMsIG91dHB1dCk7XHJcbiAgICAgIC8vIFR1cGxlXHJcbiAgICAgIGNhc2UgL3R1cGxlPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVUdXBsZShieXRlcywgb3V0cHV0LmNvbXBvbmVudHMpO1xyXG4gICAgICAvLyBTdHJpbmdcclxuICAgICAgY2FzZSAvc3RyaW5nPy8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVTdHJpbmcoYnl0ZXMpO1xyXG4gICAgICAvLyBEeW5hbWljIEJ5dGVzXHJcbiAgICAgIGNhc2UgL2J5dGVzP1xcYi8udGVzdCh0eXBlKTpcclxuICAgICAgICByZXR1cm4gdGhpcy5kZWNvZGVEeW5hbWljQnl0ZXMoYnl0ZXMpO1xyXG4gICAgICAvLyBCeXRlc1xyXG4gICAgICBjYXNlIC9ieXRlcz8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlU3RhdGljQnl0ZXMoYnl0ZXMpO1xyXG4gICAgICAvLyBCeXRlc1xyXG4gICAgICBjYXNlIC9pbnQ/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY29kZUludChieXRlcyk7XHJcbiAgICAgIC8vIEFkZHJlc3NcclxuICAgICAgY2FzZSAvYWRkcmVzcz8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlQWRkcmVzcyhieXRlcyk7XHJcbiAgICAgIC8vIEJvb2xcclxuICAgICAgY2FzZSAvYm9vbD8vLnRlc3QodHlwZSk6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVjb2RlQm9vbChieXRlcyk7XHJcbiAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIHRoZSBkZWNvZGVyIGZvciB0aGUgdHlwZSA6ICcgKyB0eXBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIHRoZSBvdXRwdXRzIDogU3RhcnQgZnJvbSB0aGUgbGFzdCB0byB0aGUgZmlyc3QgKHRvIGtub3cgdGhlIGxlbmd0aCBvZiB0aGUgdGFpbClcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIG9mIHRoZSBvdXRwdXRzXHJcbiAgICogQHBhcmFtIG91dHB1dHMgVGhlIG91dHB1dHMgZnJvbSB0aGUgYWJpXHJcbiAgICovXHJcbiAgcHVibGljIGRlY29kZU91dHB1dHMoYnl0ZXM6IHN0cmluZywgb3V0cHV0czogKEFCSU91dHB1dCB8IEFCSUlucHV0KVtdKTogYW55IHtcclxuICAgIGJ5dGVzID0gYnl0ZXMucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICBjb25zdCBpbml0ID0geyByZXN1bHQ6IHt9LCBvZmZzZXQ6IGJ5dGVzLmxlbmd0aCB9O1xyXG4gICAgcmV0dXJuIG91dHB1dHNcclxuICAgICAgLmZpbHRlcihvdXRwdXQgPT4gISg8QUJJSW5wdXQ+b3V0cHV0KS5pbmRleGVkKSAvLyBSZW1vdmUgaW5kZXhlZCB2YWx1ZXNcclxuICAgICAgLnJlZHVjZVJpZ2h0KChhY2M6IERlY29kZWRQYXJhbSwgb3V0cHV0OiBBQklPdXRwdXQsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhlYWQgPSB0aGlzLmdldEhlYWQoYnl0ZXMsIG91dHB1dHMsIGkpO1xyXG4gICAgICAgIGlmIChpc1N0YXRpYyhvdXRwdXQpKSB7XHJcbiAgICAgICAgICBhY2MucmVzdWx0W291dHB1dC5uYW1lIHx8IGldID0gdGhpcy5kZWNvZGVCeXRlcyhoZWFkLCBvdXRwdXQpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBEZWNvZGVkUGFyYW0oYWNjLnJlc3VsdCwgYWNjLm9mZnNldCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHRhaWxTdGFydCA9IGhleFRvTnVtYmVyKGhlYWQpICogMjsgLy8gdHJhbnNmb3JtIGJ5dGVzIHRvIGhleFxyXG4gICAgICAgICAgY29uc3QgdGFpbEVuZCA9IGFjYy5vZmZzZXQ7XHJcbiAgICAgICAgICBjb25zdCB0YWlsID0gYnl0ZXMuc3Vic3RyaW5nKHRhaWxTdGFydCwgdGFpbEVuZCk7XHJcbiAgICAgICAgICBhY2MucmVzdWx0W291dHB1dC5uYW1lIHx8IGldID0gdGhpcy5kZWNvZGVCeXRlcyh0YWlsLCBvdXRwdXQpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBEZWNvZGVkUGFyYW0oYWNjLnJlc3VsdCwgdGFpbFN0YXJ0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIGluaXRcclxuICAgICkucmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjb2RlIGEgYXJyYXlcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGJ5dGVzIG9mIHRoaXMgYXJyYXlcclxuICAgKiBAcGFyYW0gb3V0cHV0IFRoZSBvdXRwdXQgb2JqZWN0IGRlZmluZWQgaW4gdGhlIGFiaVxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVBcnJheShieXRlczogc3RyaW5nLCBvdXRwdXQ6IEFCSU91dHB1dCk6IGFueVtdIHtcclxuICAgIGxldCBhbW91bnQ6IG51bWJlcjtcclxuICAgIGlmIChpc0ZpeGVkQXJyYXkob3V0cHV0LnR5cGUpKSB7XHJcbiAgICAgIGFtb3VudCA9IGZpeGVkQXJyYXlTaXplKG91dHB1dC50eXBlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFtb3VudCA9IGhleFRvTnVtYmVyKGJ5dGVzLnNsaWNlKDAsIDY0KSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXN0ZWRCeXRlcyA9IGlzRml4ZWRBcnJheShvdXRwdXQudHlwZSkgPyBieXRlcyA6IGJ5dGVzLnNsaWNlKDY0KTtcclxuICAgIGNvbnN0IG91dHB1dEFycmF5ID0gcGFyYW1Gcm9tQXJyYXkoYW1vdW50LCBvdXRwdXQpO1xyXG4gICAgY29uc3QgZGVjb2RlZCA9IHRoaXMuZGVjb2RlT3V0cHV0cyhuZXN0ZWRCeXRlcywgb3V0cHV0QXJyYXkpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRlY29kZWQpLm1hcChrZXkgPT4gZGVjb2RlZFtrZXldKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSB0dXBsZSAqL1xyXG4gIHB1YmxpYyBkZWNvZGVUdXBsZShieXRlczogc3RyaW5nLCBvdXRwdXRzOiBBQklPdXRwdXRbXSk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5kZWNvZGVPdXRwdXRzKGJ5dGVzLCBvdXRwdXRzKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSBzdHJpbmcgKi9cclxuICBwdWJsaWMgZGVjb2RlU3RyaW5nKGJ5dGVzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RyID0gYnl0ZXMuc2xpY2UoNjQpO1xyXG4gICAgcmV0dXJuIGhleFRvVXRmOChzdHIpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlY29kZSBhIGR5bmFtaWMgYnl0ZSAqL1xyXG4gIHB1YmxpYyBkZWNvZGVEeW5hbWljQnl0ZXMoYnl0ZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBhbW91bnQgPSBoZXhUb051bWJlcihieXRlcy5zbGljZSgwLCA2NCkpO1xyXG4gICAgcmV0dXJuIGJ5dGVzLnNsaWNlKDY0KS5zdWJzdHJpbmcoMCwgYW1vdW50ICogMik7XHJcbiAgfVxyXG5cclxuICAvKiogRGVjb2RlIGEgc3RhdGljIGJ5dGUgKi9cclxuICBwdWJsaWMgZGVjb2RlU3RhdGljQnl0ZXMoYnl0ZXM6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGJ5dGVzLnJlcGxhY2UoL1xcYjArKDArKS8sICcnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlY29kZSBhIHVpbnQgb3IgaW50XHJcbiAgICogV0FSTklORyA6IFJldHVybiBhIHN0cmluZ1xyXG4gICAqL1xyXG4gIHB1YmxpYyBkZWNvZGVJbnQoYnl0ZXM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBpc05lZ2F0aXZlID0gKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgcmV0dXJuIChuZXcgQk4odmFsdWUuc3Vic3RyKDAsIDEpLCAxNikudG9TdHJpbmcoMikuc3Vic3RyKDAsIDEpKSA9PT0gJzEnO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzTmVnYXRpdmUoYnl0ZXMpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQk4oYnl0ZXMsIDE2KS5mcm9tVHdvcygyNTYpLnRvU3RyaW5nKDEwKTtcclxuICAgIH1cclxuICAgIHJldHVybiBoZXhUb051bWJlclN0cmluZyhieXRlcyk7XHJcbiAgfVxyXG5cclxuICAvKiogRGVjb2RlIGFuIGFkZHJlc3MgKi9cclxuICBwdWJsaWMgZGVjb2RlQWRkcmVzcyhieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0b0NoZWNrc3VtQWRkcmVzcyhieXRlcy5zdWJzdHJpbmcoMjQpKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWNvZGUgYSBib29sZWFuICovXHJcbiAgcHVibGljIGRlY29kZUJvb2woYnl0ZXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbGFzdCA9IGJ5dGVzLnN1YnN0cmluZyg2Myk7XHJcbiAgICByZXR1cm4gbGFzdCA9PT0gJzEnID8gdHJ1ZSA6IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKlxyXG4gICAqIEhFQURcclxuICAgKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm4gdGhlIGhlYWQgcGFydCBvZiB0aGUgb3V0cHV0XHJcbiAgICogQHBhcmFtIGJ5dGVzIFRoZSBieXRlcyBvZiB0aGUgb3V0cHV0U1xyXG4gICAqIEBwYXJhbSBvdXRwdXRzIFRoZSBsaXN0IG9mIG91dHB1dHNcclxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBvdXRwdXQgdG8gY2hlY2sgaW4gdGhlIG91dHB1dHNcclxuICAgKi9cclxuICBwcml2YXRlIGdldEhlYWQoYnl0ZXM6IHN0cmluZywgb3V0cHV0czogQUJJT3V0cHV0W10sIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgbGV0IG9mZnNldCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGV4OyBpKyspIHtcclxuICAgICAgaWYgKGlzU3RhdGljVHVwbGUob3V0cHV0c1tpXSkpIHtcclxuICAgICAgICBjb25zdCBoZWFkID0gdGhpcy5nZXRBbGxIZWFkcyhieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpXS5jb21wb25lbnRzKTtcclxuICAgICAgICBvZmZzZXQgKz0gaGVhZC5sZW5ndGg7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNTdGF0aWNBcnJheShvdXRwdXRzW2ldKSkge1xyXG4gICAgICAgIG9mZnNldCArPSB0aGlzLnN0YXRpY0FycmF5U2l6ZShieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpbmRleF0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9mZnNldCArPSA2NDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGlzU3RhdGljVHVwbGUob3V0cHV0c1tpbmRleF0pKSB7XHJcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuZ2V0QWxsSGVhZHMoYnl0ZXMuc3Vic3RyKG9mZnNldCksIG91dHB1dHNbaW5kZXhdLmNvbXBvbmVudHMpLmxlbmd0aFxyXG4gICAgICByZXR1cm4gYnl0ZXMuc3Vic3RyKG9mZnNldCwgbGVuZ3RoKTtcclxuICAgIH0gZWxzZSBpZihpc1N0YXRpY0FycmF5KG91dHB1dHNbaW5kZXhdKSkge1xyXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnN0YXRpY0FycmF5U2l6ZShieXRlcy5zdWJzdHIob2Zmc2V0KSwgb3V0cHV0c1tpbmRleF0pO1xyXG4gICAgICByZXR1cm4gYnl0ZXMuc3Vic3RyKG9mZnNldCwgbGVuZ3RoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBieXRlcy5zdWJzdHIob2Zmc2V0LCA2NCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIHNpemUgb2YgYSBzdGF0aWMgYXJyYXlcclxuICAgKiBAcGFyYW0gYnl0ZXMgQnl0ZXMgc3RhcnRpbmcgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXlcclxuICAgKiBAcGFyYW0gb3V0cHV0IFRoZSBhcnJheSBtb2RlbFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc3RhdGljQXJyYXlTaXplKGJ5dGVzOiBzdHJpbmcsIG91dHB1dDogQUJJT3V0cHV0KSB7XHJcbiAgICBjb25zdCBzaXplID0gZml4ZWRBcnJheVNpemUob3V0cHV0LnR5cGUpO1xyXG4gICAgY29uc3Qgb3V0cHV0QXJyYXkgPSBwYXJhbUZyb21BcnJheShzaXplLCBvdXRwdXQpO1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsSGVhZHMoYnl0ZXMsIG91dHB1dEFycmF5KS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYWxsIGhlYWRzIGZyb20gc3RhdGljIGFycmF5cyBvciB0dXBsZXNcclxuICAgKiBAcGFyYW0gYnl0ZXMgQnl0ZXMgc3RhcnRpbmcgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXkgb3IgdHVwbGVcclxuICAgKiBAcGFyYW0gb3V0cHV0cyBUaGUgb3V0cHV0cyBnaXZlbiBieSB0aGUgQUJJIGZvciB0aGlzIGFycmF5IG9yIHR1cGxlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRBbGxIZWFkcyhieXRlczogc3RyaW5nLCBvdXRwdXRzOiBBQklPdXRwdXRbXSkge1xyXG4gICAgcmV0dXJuIG91dHB1dHMucmVkdWNlUmlnaHQoKGFjYzogc3RyaW5nLCBvdXRwdXQ6IEFCSU91dHB1dCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGFjYyArIHRoaXMuZ2V0SGVhZChieXRlcywgb3V0cHV0cywgaSk7XHJcbiAgICAgIH0sJycpO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBQklJbnB1dCwgbnVtYmVyVG9IZXgsIHV0ZjhUb0hleCwgdG9CTiwgQUJJRGVmaW5pdGlvbiwga2VjY2FrMjU2IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgQ29udHJhY3RNb2R1bGUgfSBmcm9tICcuLi9jb250cmFjdC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBpc1N0YXRpYywgaXNGaXhlZEFycmF5LCBwYXJhbUZyb21BcnJheSwgZml4ZWRBcnJheVNpemUgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbmNvZGVkUGFyYW0ge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBoZWFkOiBzdHJpbmcgPSAnJywgcHVibGljIHRhaWwgPSAnJykge31cclxufVxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBDb250cmFjdE1vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgQUJJRW5jb2RlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgdGhlIGNvbnN0cnVjdG9yIG1ldGhvZCBmb3IgZGVwbG95aW5nXHJcbiAgICogQHBhcmFtIGNvbnN0cnVjdG9yIFRoZSBjb25zdHJ1Y3RvciBwYXJhbSBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKiBAcGFyYW0gYnl0ZXMgVGhlIGNvbnRlbnQgb2YgdGhlIGNvbnRyYWN0XHJcbiAgICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBwYXNzIGludG8gdGhlIGNvbnN0cnVjdG9yIGlmIGFueVxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGVDb25zdHJ1Y3RvcihcclxuICAgIGNvbnN0cnVjdG9yOiBBQklEZWZpbml0aW9uLFxyXG4gICAgYnl0ZXM6IHN0cmluZyxcclxuICAgIGFyZ3M/OiBhbnlbXVxyXG4gICkge1xyXG4gICAgY29uc3QgZW5jb2RlZCA9IHRoaXMuZW5jb2RlSW5wdXRzKGFyZ3MsIGNvbnN0cnVjdG9yLmlucHV0cyk7XHJcbiAgICByZXR1cm4gYnl0ZXMgKyBlbmNvZGVkLmhlYWQgKyBlbmNvZGVkLnRhaWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgdGhlIHdob2xlIG1ldGhvZFxyXG4gICAqIEBwYXJhbSBtZWh0b2QgVGhlIG1ldGhvZCB0aGUgZW5jb2RlIGhhcyBkZWZpbmVkIGluIHRoZSBBQklcclxuICAgKiBAcGFyYW0gYXJncyBUaGUgbGlzdCBvZiBhcmd1bWVudHMgZ2l2ZW4gYnkgdGhlIHVzZXJcclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlTWV0aG9kKG1ldGhvZDogQUJJRGVmaW5pdGlvbiwgYXJnczogYW55W10pIHtcclxuICAgIC8vIENyZWF0ZSBhbmQgc2lnbiBtZXRob2RcclxuICAgIGNvbnN0IHsgbmFtZSwgaW5wdXRzIH0gPSBtZXRob2Q7XHJcbiAgICBjb25zdCBzaWduYXR1cmUgPSB0aGlzLnNpZ25NZXRob2QobWV0aG9kKTtcclxuICAgIGNvbnN0IGhhc2hTaWduID0ga2VjY2FrMjU2KHNpZ25hdHVyZSkuc2xpY2UoMCwgMTApO1xyXG5cclxuICAgIC8vIENyZWF0ZSB0aGUgZW5jb2RlZCBhcmd1bWVudHNcclxuICAgIGNvbnN0IGVuY29kZWQgPSB0aGlzLmVuY29kZUlucHV0cyhhcmdzLCBpbnB1dHMpO1xyXG4gICAgcmV0dXJuIGhhc2hTaWduICsgZW5jb2RlZC5oZWFkICsgZW5jb2RlZC50YWlsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGFuIGV2ZW50XHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBlbmNvZGVcclxuICAgKi9cclxuICBwdWJsaWMgZW5jb2RlRXZlbnQoZXZlbnQ6IEFCSURlZmluaXRpb24pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgeyBuYW1lLCBpbnB1dHMgfSA9IGV2ZW50O1xyXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gdGhpcy5zaWduTWV0aG9kKGV2ZW50KTtcclxuICAgIHJldHVybiBrZWNjYWsyNTYoc2lnbmF0dXJlKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICoqKioqKioqKioqKioqKiBTSUdOQVRVUkUgKioqKioqKioqKioqKioqKipcclxuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgc3RyaW5nIGZvciB0aGUgc2lnbmF0dXJlIGJhc2VkIG9uIHRoZSBwYXJhbXMgaW4gdGhlIEFCSVxyXG4gICAqIEBwYXJhbSBwYXJhbXMgVGhlIHBhcmFtcyBnaXZlbiBieSB0aGUgQUJJLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2lnbklucHV0cyhpbnB1dHM6IEFCSUlucHV0W10pOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGlucHV0c1xyXG4gICAgICAubWFwKGlucHV0ID0+IGlucHV0LmNvbXBvbmVudHMgPyB0aGlzLnR1cGxlVHlwZShpbnB1dCkgOiBpbnB1dC50eXBlKVxyXG4gICAgICAuam9pbignLCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFJldHVybiB0aGUgdHlwZSBvZiBhIHR1cGxlIG5lZWRlZCBmb3IgdGhlIHNpZ25hdHVyZSAqL1xyXG4gIHByaXZhdGUgdHVwbGVUeXBlKHR1cGxlOiBBQklJbnB1dCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBpbm5lclR5cGVzID0gdGhpcy5zaWduSW5wdXRzKHR1cGxlLmNvbXBvbmVudHMpO1xyXG4gICAgY29uc3QgYXJyYXlQYXJ0ID0gdHVwbGUudHlwZS5zdWJzdHIoNSk7XHJcbiAgICByZXR1cm4gYCgke2lubmVyVHlwZXN9KSR7YXJyYXlQYXJ0fWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgc3BlY2lmaWMgbWV0aG9kIGJhc2VkIG9uIHRoZSBBQklcclxuICAgKiBAcGFyYW0gbWVodG9kIFRoZSBtZXRob2QgdGhlIGVuY29kZSBoYXMgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaWduTWV0aG9kKG1ldGhvZDogQUJJRGVmaW5pdGlvbik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB7IG5hbWUsIGlucHV0cyB9ID0gbWV0aG9kO1xyXG4gICAgY29uc3QgdHlwZXMgPSB0aGlzLnNpZ25JbnB1dHMoaW5wdXRzKTtcclxuICAgIHJldHVybiBgJHtuYW1lfSgke3R5cGVzfSlgO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKioqKioqKioqKioqKioqKiBFTkNPREUgKioqKioqKioqKioqKioqKioqKlxyXG4gICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBNYXAgdG8gdGhlIHJpZ2h0IGVuY29kZXIgZGVwZW5kaW5nIG9uIHRoZSB0eXBlXHJcbiAgICogQHBhcmFtIGFyZyB0aGUgYXJnIG9mIHRoZSBpbnB1dFxyXG4gICAqIEBwYXJhbSBpbnB1dCB0aGUgaW5wdXQgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHVibGljIGVuY29kZShhcmc6IGFueSwgaW5wdXQ6IEFCSUlucHV0KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHR5cGUgPSBpbnB1dC50eXBlO1xyXG4gICAgLy8gQ29tcGFyZSB0cnVlIHdpdGggdGhlIHJlc3VsdCBvZiB0aGUgY2FzZXNcclxuICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICAvLyBBcnJheTogTXVzdCBiZSBmaXJzdFxyXG4gICAgICBjYXNlIC9cXFsoWzAtOV0qKVxcXS8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUFycmF5KGFyZywgaW5wdXQpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFR1cGxlXHJcbiAgICAgIGNhc2UgL3R1cGxlPy8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIC8vIEdldCBhcmdzIGdpdmVuIGFzIGFuIG9iamVjdFxyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBPYmplY3Qua2V5cyhhcmcpLm1hcChrZXkgPT4gYXJnW2tleV0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZVR1cGxlKGFyZ3MsIGlucHV0LmNvbXBvbmVudHMpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFN0cmluZ1xyXG4gICAgICBjYXNlIC9zdHJpbmc/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlU3RyaW5nKGFyZyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gRHluYW1pYyBCeXRlc1xyXG4gICAgICBjYXNlIC9ieXRlcz9cXGIvLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVEeW5hbWljQnl0ZXMoYXJnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBTdGF0aWMgQnl0ZXNcclxuICAgICAgY2FzZSAvYnl0ZXM/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlU3RhdGljQnl0ZXMoYXJnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBJbnQgLyBVaW50XHJcbiAgICAgIGNhc2UgL2ludD8vLnRlc3QodHlwZSk6IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmNvZGVJbnQoYXJnLCBpbnB1dCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gQWRkcmVzc1xyXG4gICAgICBjYXNlIC9hZGRyZXNzPy8udGVzdCh0eXBlKToge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUFkZHJlc3MoYXJnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBCb29sXHJcbiAgICAgIGNhc2UgL2Jvb2w/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQm9vbChhcmcpO1xyXG4gICAgICB9XHJcbiAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIHRoZSBlbmNvZGVyIGZvciB0aGUgdHlwZSA6ICcgKyB0eXBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKipcclxuICAgKiBTVEFUSUMgT1IgRFlOQU1JQ1xyXG4gICAqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYSBsaXN0IG9mIGlucHV0c1xyXG4gICAqIEBwYXJhbSBhcmdzIFRoZSBhcmd1bWVudHMgZ2l2ZW4gYnkgdGhlIHVzZXJzXHJcbiAgICogQHBhcmFtIGlucHV0cyBUaGUgaW5wdXRzIGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHB1YmxpYyBlbmNvZGVJbnB1dHMoYXJnczogYW55W10sIGlucHV0czogQUJJSW5wdXRbXSk6IEVuY29kZWRQYXJhbSB7XHJcbiAgICBjb25zdCBvZmZzZXQgPSBhcmdzLmxlbmd0aCAqIDY0O1xyXG4gICAgY29uc3QgaW5pdCA9IG5ldyBFbmNvZGVkUGFyYW0oKTtcclxuICAgIHJldHVybiBpbnB1dHMucmVkdWNlKFxyXG4gICAgICAocHJldjogRW5jb2RlZFBhcmFtLCBpbnB1dDogQUJJSW5wdXQsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVuY29kZWQgPSB0aGlzLmVuY29kZShhcmdzW2ldLCBpbnB1dClcclxuICAgICAgICBjb25zdCBzdWJvZmZzZXQgPSAob2Zmc2V0ICsgcHJldi50YWlsLmxlbmd0aCkgLyAyO1xyXG4gICAgICAgIGlmIChpc1N0YXRpYyhpbnB1dCkpIHtcclxuICAgICAgICAgIHJldHVybiBuZXcgRW5jb2RlZFBhcmFtKHByZXYuaGVhZCArIGVuY29kZWQsIHByZXYudGFpbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBoZWFkID0gbnVtYmVyVG9IZXgoc3Vib2Zmc2V0KS5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgICAgICAgIGhlYWQgPSB0aGlzLnBhZFN0YXJ0KGhlYWQsIDY0LCAnMCcpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBFbmNvZGVkUGFyYW0ocHJldi5oZWFkICsgaGVhZCwgcHJldi50YWlsICsgZW5jb2RlZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sIGluaXRcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNvZGUgYW4gYXJyYXlcclxuICAgKiBAcGFyYW0gYXJncyBUaGUgYXJndW1lbnQgZ2l2ZW4gYnkgdGhlIHVzZXIgZm9yIHRoaXMgYXJyYXlcclxuICAgKiBAcGFyYW0gaW5wdXQgVGhlIGlucHV0IGRlZmluZWQgaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZW5jb2RlQXJyYXkoYXJnczogYW55W10sIGlucHV0OiBBQklJbnB1dCk6IHN0cmluZyB7XHJcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBhcmd1bWVudHMgZm91bmQgaW4gYXJyYXkgJHtpbnB1dC5uYW1lfWApO1xyXG4gICAgfVxyXG4gICAgbGV0IGVuY29kZWQgPSAnJztcclxuICAgIGlmICghaXNGaXhlZEFycmF5KGlucHV0LnR5cGUpKSB7XHJcbiAgICAgIGVuY29kZWQgPSBudW1iZXJUb0hleChhcmdzLmxlbmd0aCkucmVwbGFjZSgnMHgnLCAnJylcclxuICAgICAgZW5jb2RlZCA9IHRoaXMucGFkU3RhcnQoZW5jb2RlZCwgNjQsICcwJyk7XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoICE9PSBmaXhlZEFycmF5U2l6ZShpbnB1dC50eXBlKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7YXJnc30gc2hvdWxkIGJlIG9mIHNpemUgJHtmaXhlZEFycmF5U2l6ZShpbnB1dC50eXBlKX1gKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGlucHV0cyA9IHBhcmFtRnJvbUFycmF5KGFyZ3MubGVuZ3RoLCBpbnB1dCk7XHJcbiAgICBjb25zdCB7IGhlYWQsIHRhaWwgfSA9IHRoaXMuZW5jb2RlSW5wdXRzKGFyZ3MsIGlucHV0cyk7XHJcbiAgICByZXR1cm4gZW5jb2RlZCArIGhlYWQgKyB0YWlsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIHRoZSB0dXBsZVxyXG4gICAqIEBwYXJhbSBhcmdzIEFyZ3VtZW50cyBvZiB0aGlzIHR1cGxlXHJcbiAgICogQHBhcmFtIGlucHV0cyBJbnB1dHMgZGVmaW5lZCBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVUdXBsZShhcmdzOiBhbnlbXSwgaW5wdXRzOiBBQklJbnB1dFtdKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHsgaGVhZCwgdGFpbCB9ID0gdGhpcy5lbmNvZGVJbnB1dHMoYXJncywgaW5wdXRzKTtcclxuICAgIHJldHVybiBoZWFkICsgdGFpbDtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKipcclxuICAgKiBEWU5BTUlDXHJcbiAgICoqKioqKioqKi9cclxuXHJcbiAgLyoqIEVuY29kZSBhIHN0cmluZyAqL1xyXG4gIHByaXZhdGUgZW5jb2RlU3RyaW5nKGFyZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBzdHJpbmdgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGhleCA9IHV0ZjhUb0hleChhcmcpLnJlcGxhY2UoJzB4JywgJycpO1xyXG4gICAgY29uc3Qgc2l6ZSA9IG51bWJlclRvSGV4KGFyZy5sZW5ndGgpLnJlcGxhY2UoJzB4JywgJycpXHJcbiAgICBjb25zdCBoZXhTaXplID0gaGV4Lmxlbmd0aCArIDY0IC0gKGhleC5sZW5ndGggJSA2NCk7XHJcbiAgICByZXR1cm4gdGhpcy5wYWRTdGFydChzaXplLCA2NCwgJzAnKSArIHRoaXMucGFkU3RhcnQoaGV4LCBoZXhTaXplLCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGEgZHluYW1pYyBieXRlc1xyXG4gICAqIEBleGFtcGxlIGJ5dGVzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVEeW5hbWljQnl0ZXMoYXJnOiBzdHJpbmcpIHtcclxuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBzdHJpbmdgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGhleCA9IGFyZy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIGNvbnN0IHNpemUgPSBudW1iZXJUb0hleChoZXgubGVuZ3RoIC8gMikucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICBjb25zdCBoZXhTaXplID0gaGV4Lmxlbmd0aCArIDY0IC0gKGhleC5sZW5ndGggJSA2NCk7XHJcbiAgICByZXR1cm4gdGhpcy5wYWRTdGFydChzaXplLCA2NCwgJzAnKSArIHRoaXMucGFkRW5kKGhleCwgaGV4U2l6ZSwgJzAnKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKlxyXG4gICAqIFNUQVRJQ1xyXG4gICAqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlIGEgc3RhdGljIGJ5dGVzXHJcbiAgICogQGV4YW1wbGUgYnl0ZXMzLCBieXRlczMyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVTdGF0aWNCeXRlcyhhcmc6IHN0cmluZyB8IG51bWJlcikge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBhcmcgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJndW1lbnQgJHthcmd9IHNob3VsZCBiZSBhIHN0cmluZyBvciBudW1iZXJgKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykgeyBhcmcgPSBhcmcudG9TdHJpbmcoMTYpOyB9XHJcbiAgICBjb25zdCByZXN1bHQgPSBhcmcucmVwbGFjZSgnMHgnLCAnJyk7XHJcbiAgICByZXR1cm4gdGhpcy5wYWRFbmQocmVzdWx0LCA0NiwgJzAnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuY29kZSBpbnQgb3IgdWludFxyXG4gICAqIEBleGFtcGxlIGludCwgaW50MzIsIHVpbnQyNTZcclxuICAgKi9cclxuICBwcml2YXRlIGVuY29kZUludChhcmc6IG51bWJlciwgaW5wdXQ6IEFCSUlucHV0KSB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgbnVtYmVyYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoYXJnICUgMSAhPT0gMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgcHJvdmlkZXIgaW50ZWdlcnMsIFNvbGlkaXR5IGRvZXMgbm90IG1hbmFnZSBmbG9hdHMnKTtcclxuICAgIH1cclxuICAgIGlmIChpbnB1dC50eXBlLmluY2x1ZGVzKCd1aW50JykgJiYgYXJnIDwgMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFwidWludFwiIGNhbm5vdCBiZSBuZWdhdGl2ZSBhdCB2YWx1ZSAke2FyZ31gKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvQk4oYXJnKS50b1R3b3MoMjU2KS50b1N0cmluZygxNiwgNjQpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEVuY29kZSBhbiBhZGRyZXNzICovXHJcbiAgcHJpdmF0ZSBlbmNvZGVBZGRyZXNzKGFyZzogc3RyaW5nIHwgbnVtYmVyKSB7XHJcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGFyZyAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBcmd1bWVudCAke2FyZ30gc2hvdWxkIGJlIGEgc3RyaW5nIG9yIG51bWJlcmApO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7IGFyZyA9IGFyZy50b1N0cmluZygxNik7IH1cclxuICAgIGNvbnN0IHJlc3VsdCA9IGFyZy5yZXBsYWNlKCcweCcsICcnKTtcclxuICAgIHJldHVybiB0aGlzLnBhZFN0YXJ0KHJlc3VsdCwgNjQsICcwJyk7XHJcbiAgfVxyXG5cclxuICAvKiogRW5jb2RlIGEgYm9vbGVhbiAqL1xyXG4gIHByaXZhdGUgZW5jb2RlQm9vbChhcmc6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdib29sZWFuJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFyZ3VtZW50ICR7YXJnfSBzaG91bGQgYmUgYSBib29sZWFuYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJnID8gdGhpcy5wYWRTdGFydCgnMScsIDY0LCAnMCcpIDogdGhpcy5wYWRTdGFydCgnMCcsIDY0LCAnMCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqKlxyXG4gICAqIFBhZFN0YXJ0IC8gUGFkRW5kXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBwYWRTdGFydCh0YXJnZXQ6IHN0cmluZywgdGFyZ2V0TGVuZ3RoOiBudW1iZXIsIHBhZFN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIC8qIHRzbGludDpkaXNhYmxlICovXHJcbiAgICB0YXJnZXRMZW5ndGggPSB0YXJnZXRMZW5ndGggPj4gMDsgLy90cnVuY2F0ZSBpZiBudW1iZXIgb3IgY29udmVydCBub24tbnVtYmVyIHRvIDA7XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXHJcbiAgICBwYWRTdHJpbmcgPSBTdHJpbmcodHlwZW9mIHBhZFN0cmluZyAhPT0gJ3VuZGVmaW5lZCcgPyBwYWRTdHJpbmcgOiAnICcpO1xyXG4gICAgaWYgKHRhcmdldC5sZW5ndGggPiB0YXJnZXRMZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIFN0cmluZyh0YXJnZXQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGFyZ2V0TGVuZ3RoID0gdGFyZ2V0TGVuZ3RoIC0gdGFyZ2V0Lmxlbmd0aDtcclxuICAgICAgaWYgKHRhcmdldExlbmd0aCA+IHBhZFN0cmluZy5sZW5ndGgpIHtcclxuICAgICAgICBwYWRTdHJpbmcgKz0gcGFkU3RyaW5nLnJlcGVhdCh0YXJnZXRMZW5ndGggLyBwYWRTdHJpbmcubGVuZ3RoKTsgLy9hcHBlbmQgdG8gb3JpZ2luYWwgdG8gZW5zdXJlIHdlIGFyZSBsb25nZXIgdGhhbiBuZWVkZWRcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcGFkU3RyaW5nLnNsaWNlKDAsIHRhcmdldExlbmd0aCkgKyBTdHJpbmcodGFyZ2V0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIHBhZEVuZCh0YXJnZXQ6IHN0cmluZywgdGFyZ2V0TGVuZ3RoOiBudW1iZXIsIHBhZFN0cmluZzogc3RyaW5nKTogc3RyaW5ne1xyXG4gICAgLyogdHNsaW50OmRpc2FibGUgKi9cclxuICAgIHRhcmdldExlbmd0aCA9IHRhcmdldExlbmd0aCA+PiAwOyAvL2Zsb29yIGlmIG51bWJlciBvciBjb252ZXJ0IG5vbi1udW1iZXIgdG8gMDtcclxuICAgIC8qIHRzbGludDplbmFibGUgKi9cclxuICAgIHBhZFN0cmluZyA9IFN0cmluZyh0eXBlb2YgcGFkU3RyaW5nICE9PSAndW5kZWZpbmVkJyA/IHBhZFN0cmluZyA6ICcgJyk7XHJcbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCA+IHRhcmdldExlbmd0aCkge1xyXG4gICAgICByZXR1cm4gU3RyaW5nKHRhcmdldCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0YXJnZXRMZW5ndGggPSB0YXJnZXRMZW5ndGggLSB0YXJnZXQubGVuZ3RoO1xyXG4gICAgICBpZiAodGFyZ2V0TGVuZ3RoID4gcGFkU3RyaW5nLmxlbmd0aCkge1xyXG4gICAgICAgIHBhZFN0cmluZyArPSBwYWRTdHJpbmcucmVwZWF0KHRhcmdldExlbmd0aCAvIHBhZFN0cmluZy5sZW5ndGgpOyAvL2FwcGVuZCB0byBvcmlnaW5hbCB0byBlbnN1cmUgd2UgYXJlIGxvbmdlciB0aGFuIG5lZWRlZFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBTdHJpbmcodGFyZ2V0KSArIHBhZFN0cmluZy5zbGljZSgwLCB0YXJnZXRMZW5ndGgpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29udHJhY3RNb2RlbCB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJhY3RQcm92aWRlciB9IGZyb20gJ0BuZ2V0aC9wcm92aWRlcic7XHJcbmltcG9ydCB7IEFCSUVuY29kZXIsIEFCSURlY29kZXIgfSBmcm9tICcuL2FiaSc7XHJcbmltcG9ydCB7IENvbnRyYWN0TW9kdWxlIH0gZnJvbSAnLi9jb250cmFjdC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBDb250cmFjdENsYXNzIH0gZnJvbSAnLi9jb250cmFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ29udHJhY3Q8VCBleHRlbmRzIENvbnRyYWN0TW9kZWw+KG1ldGFkYXRhOiB7XHJcbiAgcHJvdmlkZXI/OiBUeXBlPENvbnRyYWN0UHJvdmlkZXI+OyAgLy8gVE9ETyA6IFVzZSBmb3IgY3VzdG9tIHByb3ZpZGVyICh3aXRoIEF1dGgpXHJcbiAgYWJpOiBhbnlbXSB8IHN0cmluZztcclxuICBhZGRyZXNzZXM/OiB7XHJcbiAgICBtYWlubmV0Pzogc3RyaW5nO1xyXG4gICAgcm9wc3Rlbj86IHN0cmluZztcclxuICAgIHJpbmtlYnk/OiBzdHJpbmc7XHJcbiAgICBrb3Zhbj86IHN0cmluZztcclxuICB9O1xyXG59KSB7XHJcbiAgY29uc3QgeyBhYmksIGFkZHJlc3NlcyB9ID0gbWV0YWRhdGE7XHJcbiAgY29uc3QganNvbkludGVyYWNlOiBhbnlbXSA9IHR5cGVvZiBhYmkgPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShhYmkpIDogYWJpO1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGFkZHJlc3Mgb2YgdGhlIGNvbnRyYWN0IGRlcGVuZGluZyBvbiB0aGUgaWQgb2YgdGhlIG5ldHdvcmtcclxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBuZXR3b3JrXHJcbiAgICovXHJcbiAgY29uc3QgZ2V0QWRkcmVzcyA9IChpZDogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuICAgIHN3aXRjaChpZCkge1xyXG4gICAgICBjYXNlIDE6IHJldHVybiBhZGRyZXNzZXNbJ21haW5uZXQnXTtcclxuICAgICAgY2FzZSAzOiByZXR1cm4gYWRkcmVzc2VzWydyb3BzdGVuJ107XHJcbiAgICAgIGNhc2UgNDogcmV0dXJuIGFkZHJlc3Nlc1sncmlua2VieSddO1xyXG4gICAgICBjYXNlIDQyOiByZXR1cm4gYWRkcmVzc2VzWydrb3ZhbiddO1xyXG4gICAgICBkZWZhdWx0OiByZXR1cm4gYWRkcmVzc2VzWydtYWlubmV0J107XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oQmFzZSkge1xyXG4gICAgQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBDb250cmFjdE1vZHVsZSB9KVxyXG4gICAgY2xhc3MgQ29udHJhY3REZWNvcmF0ZWQgZXh0ZW5kcyBDb250cmFjdENsYXNzPFQ+IHtcclxuICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIGVuY29kZXI6IEFCSUVuY29kZXIsXHJcbiAgICAgICAgcHJvdGVjdGVkIGRlY29kZXI6IEFCSURlY29kZXIsXHJcbiAgICAgICAgcHJvdGVjdGVkIHByb3ZpZGVyOiBDb250cmFjdFByb3ZpZGVyXHJcbiAgICAgICkge1xyXG4gICAgICAgIHN1cGVyKGVuY29kZXIsIGRlY29kZXIsIHByb3ZpZGVyLCBqc29uSW50ZXJhY2UsIGdldEFkZHJlc3MocHJvdmlkZXIuaWQpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIENvbnRyYWN0RGVjb3JhdGVkIGFzIGFueTtcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IENvbnRyYWN0Q2xhc3MgfSBmcm9tICcuLi8uLi9jb250cmFjdCc7XHJcbmltcG9ydCB7IENvbnRyYWN0IH0gZnJvbSAnLi4vLi4vY29udHJhY3QuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgSUVuY29kZXJUZXN0Q29udHJhY3QgfSBmcm9tICcuL2VuY29kZXItdGVzdC5tb2RlbHMnO1xyXG5jb25zdCBhYmkgPSByZXF1aXJlKCcuL2VuY29kZXItdGVzdC5hYmkuanNvbicpO1xyXG5cclxuQENvbnRyYWN0PElFbmNvZGVyVGVzdENvbnRyYWN0Pih7XHJcbiAgYWJpOiBhYmksXHJcbiAgYWRkcmVzc2VzOiB7XHJcbiAgICByb3BzdGVuOiAnMHgzNDRmNjQxZmY2MGY2MzA4YWQ3MGIxZTYyMDUyNzY0ODM1ZjQ4ZTAwJ1xyXG4gIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIEVuY29kZXJUZXN0Q29udHJhY3QgZXh0ZW5kcyBDb250cmFjdENsYXNzPElFbmNvZGVyVGVzdENvbnRyYWN0PiB7fVxyXG4iLCJpbXBvcnQgeyBDb250cmFjdENsYXNzIH0gZnJvbSAnLi4vLi4vY29udHJhY3QnO1xyXG5pbXBvcnQgeyBDb250cmFjdCwgIH0gZnJvbSAnLi4vLi4vY29udHJhY3QuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgSVRlc3RFdmVudENvbnRyYWN0IH0gZnJvbSAnLi90ZXN0LWV2ZW50Lm1vZGVscyc7XHJcbmNvbnN0IGFiaSA9IHJlcXVpcmUoJy4vdGVzdC1ldmVudC5hYmkuanNvbicpO1xyXG5cclxuQENvbnRyYWN0PElUZXN0RXZlbnRDb250cmFjdD4oe1xyXG4gIGFiaTogYWJpLFxyXG4gIGFkZHJlc3Nlczoge1xyXG4gICAgcm9wc3RlbjogJzB4YzBENkM0Y2JBMTRhZUZDMjE4ZDBmZjY2OWUwN0Q3M0U3NDA3ODI0OCdcclxuICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUZXN0RXZlbnRDb250cmFjdCBleHRlbmRzIENvbnRyYWN0Q2xhc3M8SVRlc3RFdmVudENvbnRyYWN0PiB7fVxyXG4iXSwibmFtZXMiOlsicHJvdmlkZXIiLCJ0b0NoZWNrc3VtQWRkcmVzcyIsInRzbGliXzEuX192YWx1ZXMiLCJzd2l0Y2hNYXAiLCJtYXAiLCJmb3JrSm9pbiIsIk5nTW9kdWxlIiwiaGV4VG9OdW1iZXIiLCJoZXhUb1V0ZjgiLCJCTiIsImhleFRvTnVtYmVyU3RyaW5nIiwiSW5qZWN0YWJsZSIsImtlY2NhazI1NiIsIm51bWJlclRvSGV4IiwidXRmOFRvSGV4IiwidG9CTiIsInRzbGliXzEuX19leHRlbmRzIiwiQ29udHJhY3RQcm92aWRlciIsImFiaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0E7SUFFQSxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztTQUNwQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1RSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsSUFBSSxDQUFDLENBQUMs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