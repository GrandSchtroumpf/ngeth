(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/operators'), require('@angular/core'), require('@angular/common/http'), require('websocket'), require('rxjs/webSocket'), require('@ngeth/utils'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('@ngeth/provider', ['exports', 'rxjs/operators', '@angular/core', '@angular/common/http', 'websocket', 'rxjs/webSocket', '@ngeth/utils', 'rxjs'], factory) :
    (factory((global.ngeth = global.ngeth || {}, global.ngeth.provider = {}),global.rxjs.operators,global.ng.core,global.ng.common.http,null,global.rxjs.webSocket,null,global.rxjs));
}(this, (function (exports,operators,i0,http,websocket,webSocket,utils,rxjs) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var MainProvider = (function () {
        function MainProvider() {
            this.rpcId = 0;
        }
        /** JSON RPC Request */
        /**
         * JSON RPC Request
         * @param {?} method
         * @param {?=} params
         * @return {?}
         */
        MainProvider.prototype.req = /**
         * JSON RPC Request
         * @param {?} method
         * @param {?=} params
         * @return {?}
         */
            function (method, params) {
                return {
                    jsonrpc: '2.0',
                    id: this.rpcId,
                    method: method,
                    params: params || []
                };
            };
        /** JSON RPC Response */
        /**
         * JSON RPC Response
         * @template T
         * @param {?} payload
         * @param {?} result
         * @return {?}
         */
        MainProvider.prototype.res = /**
         * JSON RPC Response
         * @template T
         * @param {?} payload
         * @param {?} result
         * @return {?}
         */
            function (payload, result) {
                return {
                    jsonrpc: payload.jsonrpc,
                    id: payload.id,
                    result: result
                };
            };
        /**
         * Get the id of the provider : use only at launch
         * @return {?}
         */
        MainProvider.prototype.fetchId = /**
         * Get the id of the provider : use only at launch
         * @return {?}
         */
            function () {
                this.rpcId++;
                return this.rpc('net_version').toPromise();
            };
        /**
         * Send a request to the node
         * @template T
         * @param {?} method
         * @param {?=} params
         * @return {?}
         */
        MainProvider.prototype.rpc = /**
         * Send a request to the node
         * @template T
         * @param {?} method
         * @param {?=} params
         * @return {?}
         */
            function (method, params) {
                var /** @type {?} */ payload = this.req(method, params);
                return this.sendAsync(payload).pipe(operators.tap(console.log), operators.map(function (res) {
                    if (res.error)
                        throw res.error;
                    return res.result;
                }));
            };
        /**
         * Send a subscription request to the node
         * @template T
         * @param {?} params
         * @return {?}
         */
        MainProvider.prototype.rpcSub = /**
         * Send a subscription request to the node
         * @template T
         * @param {?} params
         * @return {?}
         */
            function (params) {
                var /** @type {?} */ payload = this.req('eth_subscribe', params);
                return this.on(payload).pipe(operators.map(function (res) { return res.params.result; }));
            };
        return MainProvider;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var /** @type {?} */ AUTH = new i0.InjectionToken('auth');
    var ProvidersModule = (function () {
        function ProvidersModule() {
        }
        /**
         * @param {?} Provider
         * @return {?}
         */
        ProvidersModule.forRoot = /**
         * @param {?} Provider
         * @return {?}
         */
            function (Provider) {
                return {
                    ngModule: ProvidersModule,
                    providers: [
                        { provide: MainProvider, useExisting: Provider },
                        {
                            provide: i0.APP_INITIALIZER,
                            useFactory: function (provider) {
                                return function () { return provider.fetchId().then(function (id) { return provider.id = id; }); };
                            },
                            multi: true,
                            deps: [MainProvider]
                        },
                        { provide: AUTH, useClass: Provider.Auth },
                    ]
                };
            };
        ProvidersModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [http.HttpClientModule]
                    },] },
        ];
        return ProvidersModule;
    }());

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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var WebsocketProvider = (function () {
        function WebsocketProvider() {
            this.observables = [];
        }
        /**
         * Check if a message is the subscription we want
         * @param {?} msg The message returned by the node
         * @param {?} subscription The subscription to map
         * @return {?}
         */
        WebsocketProvider.prototype.isSubscription = /**
         * Check if a message is the subscription we want
         * @param {?} msg The message returned by the node
         * @param {?} subscription The subscription to map
         * @return {?}
         */
            function (msg, subscription) {
                return !!msg.method
                    && msg.method === 'eth_subscription'
                    && msg.params.subscription === subscription;
            };
        /**
         * Return the response of an RPC Request
         * @template T
         * @param {?} id
         * @return {?}
         */
        WebsocketProvider.prototype.response = /**
         * Return the response of an RPC Request
         * @template T
         * @param {?} id
         * @return {?}
         */
            function (id) {
                return this.socket$.pipe(operators.filter(function (msg) { return msg.id === id; }), operators.first());
            };
        /**
         * Subscribe to the node for a specific subscription name
         * @template T
         * @param {?} subscription The subscription name we want to subscribe to
         * @return {?}
         */
        WebsocketProvider.prototype.subscription = /**
         * Subscribe to the node for a specific subscription name
         * @template T
         * @param {?} subscription The subscription name we want to subscribe to
         * @return {?}
         */
            function (subscription) {
                var _this = this;
                return this.socket$.pipe(operators.filter(function (msg) { return _this.isSubscription(msg, subscription); }));
            };
        /**
         * Create a socket between the client and the node
         * @param {?} url The url of the node to connect to
         * @return {?}
         */
        WebsocketProvider.prototype.create = /**
         * Create a socket between the client and the node
         * @param {?} url The url of the node to connect to
         * @return {?}
         */
            function (url) {
                this.socket$ = new webSocket.WebSocketSubject({
                    url: url,
                    WebSocketCtor: /** @type {?} */ (websocket.w3cwebsocket)
                });
            };
        /**
         * Send an RPC request to the node
         * @template T
         * @param {?} payload The RPC request
         * @return {?}
         */
        WebsocketProvider.prototype.post = /**
         * Send an RPC request to the node
         * @template T
         * @param {?} payload The RPC request
         * @return {?}
         */
            function (payload) {
                this.socket$.next(payload);
                return this.response(payload.id);
            };
        /**
         * Subscribe to a SUB/PUB
         * @param {?} payload The RPC request
         * @return {?}
         */
        WebsocketProvider.prototype.subscribe = /**
         * Subscribe to a SUB/PUB
         * @param {?} payload The RPC request
         * @return {?}
         */
            function (payload) {
                var _this = this;
                this.socket$.next(payload);
                return this.response(payload.id).pipe(operators.tap(function (res) {
                    if (res.error)
                        throw res.error;
                }), operators.map(function (res) { return res.result; }), operators.switchMap(function (result) {
                    return _this.observables[result] = _this.subscription(result);
                }));
            };
        /**
         * @return {?}
         */
        WebsocketProvider.prototype.unsubscribe = /**
         * @return {?}
         */
            function () {
            };
        WebsocketProvider.decorators = [
            { type: i0.Injectable, args: [{ providedIn: ProvidersModule },] },
        ];
        /** @nocollapse */
        WebsocketProvider.ctorParameters = function () { return []; };
        /** @nocollapse */ WebsocketProvider.ngInjectableDef = i0.defineInjectable({ factory: function WebsocketProvider_Factory() { return new WebsocketProvider(); }, token: WebsocketProvider, providedIn: ProvidersModule });
        return WebsocketProvider;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var Account = (function () {
        function Account(provider) {
            this.provider = provider;
            this.currentAccount = new rxjs.BehaviorSubject(null);
            this.account$ = this.currentAccount.asObservable();
        }
        Object.defineProperty(Account.prototype, "defaultAccount", {
            /** Get the default account */
            get: /**
             * Get the default account
             * @return {?}
             */ function () {
                return this.currentAccount.getValue();
            },
            /** Set the default account */
            set: /**
             * Set the default account
             * @param {?} account
             * @return {?}
             */ function (account) {
                this.currentAccount.next(utils.toChecksumAddress(account));
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Get the list of accounts available on the node
         * @return {?}
         */
        Account.prototype.getAccounts = /**
         * Get the list of accounts available on the node
         * @return {?}
         */
            function () {
                return this.provider.rpc('eth_accounts');
            };
        /**
         * Send a transaction to the node
         * @template T
         * @param {?} tx The transaction to pass to the node
         * @param {?=} blockTag The block to target
         * @return {?}
         */
        Account.prototype.sendTransaction = /**
         * Send a transaction to the node
         * @template T
         * @param {?} tx The transaction to pass to the node
         * @param {?=} blockTag The block to target
         * @return {?}
         */
            function (tx, blockTag) {
                if (blockTag === void 0) {
                    blockTag = 'latest';
                }
                return this.provider.rpc('eth_sendTransaction', [tx, blockTag]);
            };
        /**
         * @param {?} address
         * @param {?=} blockTag
         * @return {?}
         */
        Account.prototype.getBalance = /**
         * @param {?} address
         * @param {?=} blockTag
         * @return {?}
         */
            function (address, blockTag) {
                return this.provider.rpc('eth_getBalance', [address, blockTag || 'latest']);
            };
        /**
         * @param {?} address
         * @param {?=} blockTag
         * @return {?}
         */
        Account.prototype.getTransactionCount = /**
         * @param {?} address
         * @param {?=} blockTag
         * @return {?}
         */
            function (address, blockTag) {
                return this.provider.rpc('eth_getTransactionCount', [
                    address,
                    blockTag || 'latest'
                ]);
            };
        /**
         * @param {?} message
         * @param {?} address
         * @param {?} pwd
         * @return {?}
         */
        Account.prototype.sign = /**
         * @param {?} message
         * @param {?} address
         * @param {?} pwd
         * @return {?}
         */
            function (message, address, pwd) {
                var /** @type {?} */ msg = utils.utf8ToHex(message);
                var /** @type {?} */ method = this.provider.type === 'web3' ? 'personal_sign' : 'eth_sign';
                var /** @type {?} */ params = this.provider.type === 'web3' ? [address, msg, pwd] : [msg, address];
                return this.provider.rpc(method, params);
            };
        Account.decorators = [
            { type: i0.Injectable, args: [{ providedIn: ProvidersModule },] },
        ];
        /** @nocollapse */
        Account.ctorParameters = function () {
            return [
                { type: MainProvider, },
            ];
        };
        /** @nocollapse */ Account.ngInjectableDef = i0.defineInjectable({ factory: function Account_Factory() { return new Account(i0.inject(MainProvider)); }, token: Account, providedIn: ProvidersModule });
        return Account;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @param {?} options
     * @return {?}
     */
    function Provider(options) {
        return function (Base) {
            var DecoratedProvider = (function (_super) {
                __extends(DecoratedProvider, _super);
                function DecoratedProvider(http$$1, ws) {
                    var _this = _super.call(this) || this;
                    _this.http = http$$1;
                    _this.ws = ws;
                    _this.url = options.url || 'localhost:8545';
                    var /** @type {?} */ protocol = new URL(_this.url).protocol;
                    var /** @type {?} */ isWS = protocol === 'ws:' || protocol === 'wss:';
                    if (window && 'web3' in window) {
                        _this.type = 'web3';
                        _this.setWeb3Provider();
                    }
                    else if (isWS) {
                        _this.type = 'ws';
                        _this.setWsProvider();
                    }
                    else {
                        _this.type = 'http';
                        _this.setHttpProvider();
                    }
                    return _this;
                }
                /**
                 * Connect to a web3 instance inside the page if any
                 * @return {?}
                 */
                DecoratedProvider.prototype.setWeb3Provider = /**
                 * Connect to a web3 instance inside the page if any
                 * @return {?}
                 */
                    function () {
                        var _this = this;
                        this.web3Provider = window['web3'].currentProvider;
                        this.sendAsync = function (payload) {
                            var /** @type {?} */ sendAsync = _this.web3Provider.sendAsync.bind(_this.web3Provider, payload);
                            return rxjs.bindNodeCallback(sendAsync)();
                        };
                    };
                /**
                 * Setup a Websocket connection with the node
                 * @return {?}
                 */
                DecoratedProvider.prototype.setWsProvider = /**
                 * Setup a Websocket connection with the node
                 * @return {?}
                 */
                    function () {
                        var _this = this;
                        this.ws.create(this.url);
                        this.on = function (payload) {
                            _this.rpcId++;
                            return _this.ws.subscribe(payload);
                        };
                        this.sendAsync = function (payload) {
                            _this.rpcId++;
                            return _this.ws.post(payload);
                        };
                    };
                /**
                 * Setup an HTTP connection with the node
                 * @return {?}
                 */
                DecoratedProvider.prototype.setHttpProvider = /**
                 * Setup an HTTP connection with the node
                 * @return {?}
                 */
                    function () {
                        var _this = this;
                        this.sendAsync = function (payload) {
                            _this.rpcId++;
                            return _this.http.post(_this.url, payload);
                        };
                    };
                DecoratedProvider.Auth = options.auth || Account;
                DecoratedProvider.decorators = [
                    { type: i0.Injectable, args: [{ providedIn: ProvidersModule },] },
                ];
                /** @nocollapse */
                DecoratedProvider.ctorParameters = function () {
                    return [
                        { type: http.HttpClient, },
                        { type: WebsocketProvider, },
                    ];
                };
                return DecoratedProvider;
            }(MainProvider));
            return /** @type {?} */ (DecoratedProvider);
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ContractProvider = (function () {
        function ContractProvider(auth, provider) {
            var _this = this;
            this.auth = auth;
            this.provider = provider;
            this.currentTx = new rxjs.BehaviorSubject(null);
            this.tx$ = this.currentTx.asObservable();
            this.auth.account$
                .subscribe(function (from) { return _this.defaultTx = __assign({}, _this.defaultTx, { from: from }); });
            this.id = this.provider.id;
        }
        Object.defineProperty(ContractProvider.prototype, "defaultTx", {
            get: /**
             * @return {?}
             */ function () {
                return this.currentTx.getValue();
            },
            set: /**
             * @param {?} transaction
             * @return {?}
             */ function (transaction) {
                var /** @type {?} */ tx = __assign({}, this.currentTx.getValue(), transaction);
                this.currentTx.next(tx);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Make a call to the node
         * @template T
         * @param {?} to The address of the contract to contact
         * @param {?} data The data of the call as bytecode
         * @param {?=} blockTag The block to target
         * @return {?}
         */
        ContractProvider.prototype.call = /**
         * Make a call to the node
         * @template T
         * @param {?} to The address of the contract to contact
         * @param {?} data The data of the call as bytecode
         * @param {?=} blockTag The block to target
         * @return {?}
         */
            function (to, data, blockTag) {
                if (blockTag === void 0) {
                    blockTag = 'latest';
                }
                return this.provider.rpc('eth_call', [{ to: to, data: data }, blockTag]);
            };
        /**
         * Send a transaction to the node
         * @template T
         * @param {?} transaction
         * @param {...?} rest
         * @return {?}
         */
        ContractProvider.prototype.sendTransaction = /**
         * Send a transaction to the node
         * @template T
         * @param {?} transaction
         * @param {...?} rest
         * @return {?}
         */
            function (transaction) {
                var rest = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    rest[_i - 1] = arguments[_i];
                }
                var /** @type {?} */ tx = new utils.TxObject(transaction);
                return this.auth.sendTransaction(tx, rest);
            };
        /**
         * Create a RPC request for a subscription
         * @param {?} address The address of the contract
         * @param {?} topics The signature of the event
         * @return {?}
         */
        ContractProvider.prototype.event = /**
         * Create a RPC request for a subscription
         * @param {?} address The address of the contract
         * @param {?} topics The signature of the event
         * @return {?}
         */
            function (address, topics) {
                return this.provider.rpcSub(['logs', { address: address, topics: topics }]).pipe(operators.map(function (logs) { return new utils.TxLogs(logs); }));
            };
        /**
         * Estimate the amount of gas needed for transaction
         * @param {?} transaction The transaction to estimate the gas from
         * @return {?}
         */
        ContractProvider.prototype.estimateGas = /**
         * Estimate the amount of gas needed for transaction
         * @param {?} transaction The transaction to estimate the gas from
         * @return {?}
         */
            function (transaction) {
                var /** @type {?} */ tx = new utils.TxObject(transaction);
                return this.provider.rpc('eth_estimateGas', [tx]).pipe(operators.map(function (gas) { return utils.hexToNumber(gas.replace('0x', '')); }));
            };
        /**
         * Returns the current price per gas in wei
         * @return {?}
         */
        ContractProvider.prototype.gasPrice = /**
         * Returns the current price per gas in wei
         * @return {?}
         */
            function () {
                return this.provider.rpc('eth_gasPrice', []).pipe(operators.map(function (price) { return utils.hexToNumberString(price.replace('0x', '')); }));
            };
        ContractProvider.decorators = [
            { type: i0.Injectable, args: [{ providedIn: ProvidersModule },] },
        ];
        /** @nocollapse */
        ContractProvider.ctorParameters = function () {
            return [
                { type: undefined, decorators: [{ type: i0.Inject, args: [AUTH,] },] },
                { type: MainProvider, },
            ];
        };
        /** @nocollapse */ ContractProvider.ngInjectableDef = i0.defineInjectable({ factory: function ContractProvider_Factory() { return new ContractProvider(i0.inject(AUTH), i0.inject(MainProvider)); }, token: ContractProvider, providedIn: ProvidersModule });
        return ContractProvider;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var Eth = (function () {
        function Eth(provider) {
            this.provider = provider;
        }
        /**
         * @return {?}
         */
        Eth.prototype.getBlockNumber = /**
         * @return {?}
         */
            function () {
                return this.provider
                    .rpc('eth_blockNumber')
                    .pipe(operators.map(function (block) { return utils.toBN(block).toString(10); }));
            };
        /**
         * @return {?}
         */
        Eth.prototype.getGasPrice = /**
         * @return {?}
         */
            function () {
                return this.provider
                    .rpc('eth_gasPrice')
                    .pipe(operators.map(function (block) { return utils.toBN(block).toString(10); }));
            };
        /**
         * ***
         * BLOCK
         * @param {?} blockNumber
         * @return {?}
         */
        Eth.prototype.getBlockByNumber = /**
         * ***
         * BLOCK
         * @param {?} blockNumber
         * @return {?}
         */
            function (blockNumber) {
                var /** @type {?} */ isNumber = typeof blockNumber === 'number';
                var /** @type {?} */ params = isNumber ? utils.numberToHex(blockNumber) : blockNumber;
                return this.provider
                    .rpc('eth_getBlockByNumber', [params, true])
                    .pipe(operators.map(function (block) { return (block ? new utils.Block(block) : null); }));
            };
        /**
         * @param {?} blockHash
         * @return {?}
         */
        Eth.prototype.getBlockByHash = /**
         * @param {?} blockHash
         * @return {?}
         */
            function (blockHash) {
                return this.provider
                    .rpc('eth_getBlockByNumber', [blockHash, true])
                    .pipe(operators.map(function (block) { return (block ? new utils.Block(block) : null); }));
            };
        /**
         * **********
         * TRANSACTION
         * @param {?} transactionHash
         * @return {?}
         */
        Eth.prototype.getTransaction = /**
         * **********
         * TRANSACTION
         * @param {?} transactionHash
         * @return {?}
         */
            function (transactionHash) {
                return this.provider
                    .rpc('eth_getTransactionByHash', [transactionHash])
                    .pipe(operators.map(function (tx) { return (tx ? new utils.Transaction(tx) : null); }));
            };
        /**
         * @param {?} transactionHash
         * @return {?}
         */
        Eth.prototype.getTransactionReceipt = /**
         * @param {?} transactionHash
         * @return {?}
         */
            function (transactionHash) {
                return this.provider
                    .rpc('eth_getTransactionReceipt', [transactionHash])
                    .pipe(operators.map(function (receipt) { return (receipt ? new utils.TxReceipt(receipt) : null); }));
            };
        /**
         * ************
         * SUBSCRIPTIONS
         * @return {?}
         */
        Eth.prototype.onNewBlock = /**
         * ************
         * SUBSCRIPTIONS
         * @return {?}
         */
            function () {
                return this.provider.rpcSub(['newHeads']).pipe(operators.map(function (res) { return new utils.Block(res); }));
            };
        /**
         * @return {?}
         */
        Eth.prototype.isSyncing = /**
         * @return {?}
         */
            function () {
                return this.provider.rpcSub(['syncing']);
            };
        Eth.decorators = [
            { type: i0.Injectable, args: [{ providedIn: ProvidersModule },] },
        ];
        /** @nocollapse */
        Eth.ctorParameters = function () {
            return [
                { type: MainProvider, },
            ];
        };
        /** @nocollapse */ Eth.ngInjectableDef = i0.defineInjectable({ factory: function Eth_Factory() { return new Eth(i0.inject(MainProvider)); }, token: Eth, providedIn: ProvidersModule });
        return Eth;
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
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.AUTH = AUTH;
    exports.ProvidersModule = ProvidersModule;
    exports.Provider = Provider;
    exports.MainProvider = MainProvider;
    exports.ContractProvider = ContractProvider;
    exports.Eth = Eth;
    exports.Account = Account;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtcHJvdmlkZXIudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AbmdldGgvcHJvdmlkZXIvbGliL3Byb3ZpZGVyLnRzIiwibmc6Ly9AbmdldGgvcHJvdmlkZXIvbGliL3Byb3ZpZGVycy5tb2R1bGUudHMiLG51bGwsIm5nOi8vQG5nZXRoL3Byb3ZpZGVyL2xpYi9wcm92aWRlcnMvd3MtcHJvdmlkZXIudHMiLCJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvc3VicHJvdmlkZXJzL2FjY291bnQudHMiLCJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvcHJvdmlkZXIuZGVjb3JhdG9yLnRzIiwibmc6Ly9AbmdldGgvcHJvdmlkZXIvbGliL3N1YnByb3ZpZGVycy9jb250cmFjdC50cyIsIm5nOi8vQG5nZXRoL3Byb3ZpZGVyL2xpYi9zdWJwcm92aWRlcnMvZXRoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUlBDUmVxLCBSUENSZXMsIFJQQ1N1YiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG4vLyBAZHluYW1pY1xyXG5leHBvcnQgY2xhc3MgTWFpblByb3ZpZGVyIHtcclxuICBzdGF0aWMgQXV0aDogVHlwZTxhbnk+O1xyXG4gIHByb3RlY3RlZCBzZW5kQXN5bmM6IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDUmVzPFQ+PjtcclxuICBwcm90ZWN0ZWQgb246IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDU3ViPFQ+PjtcclxuICBwcm90ZWN0ZWQgcnBjSWQgPSAwO1xyXG4gIHByb3RlY3RlZCB3ZWIzUHJvdmlkZXI6IGFueTtcclxuICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6ICd3ZWIzJyB8ICdodHRwJyB8ICd3cyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgLyoqIEpTT04gUlBDIFJlcXVlc3QgKi9cclxuICBwcm90ZWN0ZWQgcmVxKG1ldGhvZDogc3RyaW5nLCBwYXJhbXM/OiBhbnlbXSk6IFJQQ1JlcSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBqc29ucnBjOiAnMi4wJyxcclxuICAgICAgaWQ6IHRoaXMucnBjSWQsXHJcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtcyB8fCBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKiBKU09OIFJQQyBSZXNwb25zZSAqL1xyXG4gIHByb3RlY3RlZCByZXM8VD4ocGF5bG9hZDogYW55LCByZXN1bHQ6IGFueSk6IFJQQ1JlczxUPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBqc29ucnBjOiBwYXlsb2FkLmpzb25ycGMsXHJcbiAgICAgIGlkOiBwYXlsb2FkLmlkLFxyXG4gICAgICByZXN1bHQ6IHJlc3VsdFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKiBHZXQgdGhlIGlkIG9mIHRoZSBwcm92aWRlciA6IHVzZSBvbmx5IGF0IGxhdW5jaCAqL1xyXG4gIHB1YmxpYyBmZXRjaElkKCk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICB0aGlzLnJwY0lkKys7XHJcbiAgICByZXR1cm4gdGhpcy5ycGM8bnVtYmVyPignbmV0X3ZlcnNpb24nKS50b1Byb21pc2U8bnVtYmVyPigpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBub2RlICovXHJcbiAgcHVibGljIHJwYzxUPihtZXRob2Q6IHN0cmluZywgcGFyYW1zPzogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlcShtZXRob2QsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5zZW5kQXN5bmM8VD4ocGF5bG9hZCkucGlwZShcclxuICAgICAgdGFwKGNvbnNvbGUubG9nKSxcclxuICAgICAgbWFwKHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKHJlcy5lcnJvcikgdGhyb3cgcmVzLmVycm9yO1xyXG4gICAgICAgIHJldHVybiByZXMucmVzdWx0O1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKiBTZW5kIGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QgdG8gdGhlIG5vZGUgKi9cclxuICBwdWJsaWMgcnBjU3ViPFQ+KHBhcmFtczogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlcSgnZXRoX3N1YnNjcmliZScsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5vbjxUPihwYXlsb2FkKS5waXBlKFxyXG4gICAgICBtYXAocmVzID0+ICByZXMucGFyYW1zLnJlc3VsdClcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7XHJcbiAgTmdNb2R1bGUsXHJcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcclxuICBJbmplY3Rpb25Ub2tlbixcclxuICBBUFBfSU5JVElBTElaRVJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IEFVVEggPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignYXV0aCcpO1xyXG5cclxuLy8gQGR5bmFtaWNcclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIFByb3ZpZGVyc01vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoUHJvdmlkZXI6IHR5cGVvZiBNYWluUHJvdmlkZXIpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBQcm92aWRlcnNNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHsgcHJvdmlkZTogTWFpblByb3ZpZGVyLCB1c2VFeGlzdGluZzogUHJvdmlkZXIgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXHJcbiAgICAgICAgICB1c2VGYWN0b3J5OiAocHJvdmlkZXI6IE1haW5Qcm92aWRlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gICgpID0+IHByb3ZpZGVyLmZldGNoSWQoKS50aGVuKGlkID0+IHByb3ZpZGVyLmlkID0gaWQpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgICAgICAgZGVwczogW01haW5Qcm92aWRlcl1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgcHJvdmlkZTogQVVUSCwgdXNlQ2xhc3M6IFByb3ZpZGVyLkF1dGggfSxcclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSB5W29wWzBdICYgMiA/IFwicmV0dXJuXCIgOiBvcFswXSA/IFwidGhyb3dcIiA6IFwibmV4dFwiXSkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbMCwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgIH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlmIChvW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9OyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUlBDUmVzLCBSUENTdWIsIFJQQ1JlcSB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4vLi4vcHJvdmlkZXJzLm1vZHVsZSc7XHJcbmltcG9ydCB7IHczY3dlYnNvY2tldCB9IGZyb20gJ3dlYnNvY2tldCc7XHJcbmltcG9ydCB7IFdlYlNvY2tldFN1YmplY3QgfSBmcm9tICdyeGpzL3dlYlNvY2tldCc7XHJcblxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpbHRlciwgZmlyc3QsIHRhcCwgc3dpdGNoTWFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IFByb3ZpZGVyc01vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgV2Vic29ja2V0UHJvdmlkZXIge1xyXG4gIHByaXZhdGUgc29ja2V0JDogV2ViU29ja2V0U3ViamVjdDxhbnk+O1xyXG4gIHB1YmxpYyBvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxSUENTdWI+W10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaXMgdGhlIHN1YnNjcmlwdGlvbiB3ZSB3YW50XHJcbiAgICogQHBhcmFtIG1zZyBUaGUgbWVzc2FnZSByZXR1cm5lZCBieSB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBzdWJzY3JpcHRpb24gVGhlIHN1YnNjcmlwdGlvbiB0byBtYXBcclxuICAgKi9cclxuICBwcml2YXRlIGlzU3Vic2NyaXB0aW9uKG1zZzogYW55LCBzdWJzY3JpcHRpb246IHN0cmluZyk6IG1zZyBpcyBSUENTdWIge1xyXG4gICAgcmV0dXJuICEhbXNnLm1ldGhvZFxyXG4gICAgICAgICAgJiYgbXNnLm1ldGhvZCA9PT0gJ2V0aF9zdWJzY3JpcHRpb24nXHJcbiAgICAgICAgICAmJiBtc2cucGFyYW1zLnN1YnNjcmlwdGlvbiA9PT0gc3Vic2NyaXB0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqIFJldHVybiB0aGUgcmVzcG9uc2Ugb2YgYW4gUlBDIFJlcXVlc3QgKi9cclxuICBwcml2YXRlIHJlc3BvbnNlPFQ+KGlkOiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLnNvY2tldCQucGlwZShcclxuICAgICAgZmlsdGVyKChtc2c6IFJQQ1JlczxUPikgPT4gbXNnLmlkID09PSBpZCksXHJcbiAgICAgIGZpcnN0KClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdWJzY3JpYmUgdG8gdGhlIG5vZGUgZm9yIGEgc3BlY2lmaWMgc3Vic2NyaXB0aW9uIG5hbWVcclxuICAgKiBAcGFyYW0gc3Vic2NyaXB0aW9uIFRoZSBzdWJzY3JpcHRpb24gbmFtZSB3ZSB3YW50IHRvIHN1YnNjcmliZSB0b1xyXG4gICAqL1xyXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uPFQ+KHN1YnNjcmlwdGlvbjogc3RyaW5nKTogT2JzZXJ2YWJsZTxSUENTdWI8VD4+IHtcclxuICAgIHJldHVybiB0aGlzLnNvY2tldCQucGlwZShcclxuICAgICAgZmlsdGVyKG1zZyA9PiB0aGlzLmlzU3Vic2NyaXB0aW9uKG1zZywgc3Vic2NyaXB0aW9uKSlcclxuICAgIClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIHNvY2tldCBiZXR3ZWVuIHRoZSBjbGllbnQgYW5kIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHVybCBUaGUgdXJsIG9mIHRoZSBub2RlIHRvIGNvbm5lY3QgdG9cclxuICAgKi9cclxuICBwdWJsaWMgY3JlYXRlKHVybDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNvY2tldCQgPSBuZXcgV2ViU29ja2V0U3ViamVjdCh7XHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBXZWJTb2NrZXRDdG9yOiB3M2N3ZWJzb2NrZXQgYXMgYW55XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgYW4gUlBDIHJlcXVlc3QgdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gcGF5bG9hZCBUaGUgUlBDIHJlcXVlc3RcclxuICAgKi9cclxuICBwdWJsaWMgcG9zdDxUID0gYW55PihwYXlsb2FkOiBSUENSZXEpOiBPYnNlcnZhYmxlPFJQQ1JlczxUPj4ge1xyXG4gICAgdGhpcy5zb2NrZXQkLm5leHQocGF5bG9hZCk7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZTxUPihwYXlsb2FkLmlkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN1YnNjcmliZSB0byBhIFNVQi9QVUJcclxuICAgKiBAcGFyYW0gcGF5bG9hZCBUaGUgUlBDIHJlcXVlc3RcclxuICAgKi9cclxuICBwdWJsaWMgc3Vic2NyaWJlKHBheWxvYWQ6IFJQQ1JlcSkge1xyXG4gICAgdGhpcy5zb2NrZXQkLm5leHQocGF5bG9hZCk7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZTxzdHJpbmc+KHBheWxvYWQuaWQpLnBpcGUoXHJcbiAgICAgIHRhcChyZXMgPT4geyBpZiAocmVzLmVycm9yKSB0aHJvdyByZXMuZXJyb3I7IH0pLFxyXG4gICAgICBtYXAocmVzID0+IHJlcy5yZXN1bHQpLFxyXG4gICAgICBzd2l0Y2hNYXAocmVzdWx0ID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZhYmxlc1tyZXN1bHRdID0gdGhpcy5zdWJzY3JpcHRpb24ocmVzdWx0KTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPXHJcbiAgcHVibGljIHVuc3Vic2NyaWJlKCkge1xyXG5cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBUeE9iamVjdCwgdXRmOFRvSGV4LCBCbG9ja1RhZywgdG9DaGVja3N1bUFkZHJlc3MgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBQcm92aWRlcnNNb2R1bGUgfSBmcm9tICcuLy4uL3Byb3ZpZGVycy5tb2R1bGUnO1xyXG5pbXBvcnQgeyBNYWluUHJvdmlkZXIgfSBmcm9tICcuLi9wcm92aWRlcic7XHJcbmltcG9ydCB7IEF1dGggfSBmcm9tICcuLi9hdXRoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW4gOiBQcm92aWRlcnNNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEFjY291bnQgaW1wbGVtZW50cyBBdXRoIHtcclxuICBwcml2YXRlIGN1cnJlbnRBY2NvdW50ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+KG51bGwpO1xyXG4gIHB1YmxpYyBhY2NvdW50JCA9IHRoaXMuY3VycmVudEFjY291bnQuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcikge31cclxuXHJcbiAgLyoqIEdldCB0aGUgZGVmYXVsdCBhY2NvdW50ICovXHJcbiAgZ2V0IGRlZmF1bHRBY2NvdW50KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50QWNjb3VudC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNldCB0aGUgZGVmYXVsdCBhY2NvdW50ICovXHJcbiAgc2V0IGRlZmF1bHRBY2NvdW50KGFjY291bnQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5jdXJyZW50QWNjb3VudC5uZXh0KHRvQ2hlY2tzdW1BZGRyZXNzKGFjY291bnQpKTtcclxuICB9XHJcblxyXG4gIC8qKiBHZXQgdGhlIGxpc3Qgb2YgYWNjb3VudHMgYXZhaWxhYmxlIG9uIHRoZSBub2RlICovXHJcbiAgcHVibGljIGdldEFjY291bnRzKCk6IE9ic2VydmFibGU8c3RyaW5nW10+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwYzxzdHJpbmdbXT4oJ2V0aF9hY2NvdW50cycpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhIHRyYW5zYWN0aW9uIHRvIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHR4IFRoZSB0cmFuc2FjdGlvbiB0byBwYXNzIHRvIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIGJsb2NrVGFnIFRoZSBibG9jayB0byB0YXJnZXRcclxuICAgKi9cclxuICBwdWJsaWMgc2VuZFRyYW5zYWN0aW9uPFQ+KFxyXG4gICAgdHg6IFR4T2JqZWN0LFxyXG4gICAgYmxvY2tUYWc6IEJsb2NrVGFnID0gJ2xhdGVzdCdcclxuICApOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwYzxUPignZXRoX3NlbmRUcmFuc2FjdGlvbicsIFt0eCwgYmxvY2tUYWddKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRCYWxhbmNlKGFkZHJlc3M6IHN0cmluZywgYmxvY2tUYWc/OiBCbG9ja1RhZyB8IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4oJ2V0aF9nZXRCYWxhbmNlJywgW2FkZHJlc3MsIGJsb2NrVGFnIHx8ICdsYXRlc3QnXSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0VHJhbnNhY3Rpb25Db3VudChhZGRyZXNzOiBzdHJpbmcsIGJsb2NrVGFnPzogQmxvY2tUYWcgfCBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwYzxzdHJpbmc+KCdldGhfZ2V0VHJhbnNhY3Rpb25Db3VudCcsIFtcclxuICAgICAgYWRkcmVzcyxcclxuICAgICAgYmxvY2tUYWcgfHwgJ2xhdGVzdCdcclxuICAgIF0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNpZ24obWVzc2FnZTogc3RyaW5nLCBhZGRyZXNzOiBzdHJpbmcsICBwd2Q6IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICBjb25zdCBtc2cgPSB1dGY4VG9IZXgobWVzc2FnZSk7XHJcbiAgICBjb25zdCBtZXRob2QgPSB0aGlzLnByb3ZpZGVyLnR5cGUgPT09ICd3ZWIzJyA/ICdwZXJzb25hbF9zaWduJyA6ICdldGhfc2lnbic7XHJcbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnByb3ZpZGVyLnR5cGUgPT09ICd3ZWIzJyA/IFthZGRyZXNzLCBtc2csIHB3ZF0gOiBbbXNnLCBhZGRyZXNzXTtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwYzxzdHJpbmc+KG1ldGhvZCwgcGFyYW1zKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgV2Vic29ja2V0UHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy93cy1wcm92aWRlcic7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgYmluZE5vZGVDYWxsYmFjaywgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgUlBDUmVzLCBSUENSZXEsIFJQQ1N1YiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBQcm92aWRlcnNNb2R1bGUgfSBmcm9tICcuL3Byb3ZpZGVycy5tb2R1bGUnO1xyXG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnLi9zdWJwcm92aWRlcnMvYWNjb3VudCc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFByb3ZpZGVyKG9wdGlvbnM6IHtcclxuICB1cmw6IHN0cmluZztcclxuICBhdXRoPzogYW55O1xyXG59KSB7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihCYXNlOiBUeXBlPE1haW5Qcm92aWRlcj4pIHtcclxuXHJcbiAgICBASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IFByb3ZpZGVyc01vZHVsZSB9KVxyXG4gICAgY2xhc3MgRGVjb3JhdGVkUHJvdmlkZXIgZXh0ZW5kcyBNYWluUHJvdmlkZXIge1xyXG4gICAgICBwdWJsaWMgc3RhdGljIEF1dGggPSBvcHRpb25zLmF1dGggfHwgQWNjb3VudDtcclxuICAgICAgcHVibGljIHNlbmRBc3luYzogPFQ+KHBheWxvYWQ6IFJQQ1JlcSkgPT4gT2JzZXJ2YWJsZTxSUENSZXM8VD4+O1xyXG4gICAgICBwdWJsaWMgb246IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDU3ViPFQ+PjtcclxuXHJcbiAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICBwcml2YXRlIHdzOiBXZWJzb2NrZXRQcm92aWRlclxyXG4gICAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJ2xvY2FsaG9zdDo4NTQ1JztcclxuICAgICAgICBjb25zdCBwcm90b2NvbCA9IG5ldyBVUkwodGhpcy51cmwpLnByb3RvY29sO1xyXG4gICAgICAgIGNvbnN0IGlzV1MgPSBwcm90b2NvbCA9PT0gJ3dzOicgfHwgcHJvdG9jb2wgPT09ICd3c3M6JztcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdyAmJiAnd2ViMycgaW4gd2luZG93KSB7XHJcbiAgICAgICAgICB0aGlzLnR5cGUgPSAnd2ViMyc7XHJcbiAgICAgICAgICB0aGlzLnNldFdlYjNQcm92aWRlcigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNXUykge1xyXG4gICAgICAgICAgdGhpcy50eXBlID0gJ3dzJztcclxuICAgICAgICAgIHRoaXMuc2V0V3NQcm92aWRlcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnR5cGUgPSAnaHR0cCc7XHJcbiAgICAgICAgICB0aGlzLnNldEh0dHBQcm92aWRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKiBDb25uZWN0IHRvIGEgd2ViMyBpbnN0YW5jZSBpbnNpZGUgdGhlIHBhZ2UgaWYgYW55ICovXHJcbiAgICAgIHByaXZhdGUgc2V0V2ViM1Byb3ZpZGVyKCkge1xyXG4gICAgICAgIHRoaXMud2ViM1Byb3ZpZGVyID0gd2luZG93Wyd3ZWIzJ10uY3VycmVudFByb3ZpZGVyO1xyXG4gICAgICAgIHRoaXMuc2VuZEFzeW5jID0gKHBheWxvYWQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHNlbmRBc3luYyA9IHRoaXMud2ViM1Byb3ZpZGVyLnNlbmRBc3luYy5iaW5kKHRoaXMud2ViM1Byb3ZpZGVyLCBwYXlsb2FkKTtcclxuICAgICAgICAgIHJldHVybiBiaW5kTm9kZUNhbGxiYWNrPGFueT4oc2VuZEFzeW5jKSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqIFNldHVwIGEgV2Vic29ja2V0IGNvbm5lY3Rpb24gd2l0aCB0aGUgbm9kZSAqL1xyXG4gICAgICBwcml2YXRlIHNldFdzUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdGhpcy53cy5jcmVhdGUodGhpcy51cmwpO1xyXG4gICAgICAgIHRoaXMub24gPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ycGNJZCArKztcclxuICAgICAgICAgIHJldHVybiB0aGlzLndzLnN1YnNjcmliZShwYXlsb2FkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZW5kQXN5bmMgPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ycGNJZCArKztcclxuICAgICAgICAgIHJldHVybiB0aGlzLndzLnBvc3QocGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiogU2V0dXAgYW4gSFRUUCBjb25uZWN0aW9uIHdpdGggdGhlIG5vZGUgKi9cclxuICAgICAgcHJpdmF0ZSBzZXRIdHRwUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kQXN5bmMgPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ycGNJZCArKztcclxuICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxSUENSZXM8YW55Pj4odGhpcy51cmwsIHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIERlY29yYXRlZFByb3ZpZGVyIGFzIGFueTtcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCbG9ja1RhZywgVHhMb2dzLCBJVHhPYmplY3QsIFR4T2JqZWN0LCBoZXhUb051bWJlciwgaGV4VG9OdW1iZXJTdHJpbmcgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBQcm92aWRlcnNNb2R1bGUsIEFVVEggfSBmcm9tICcuLi9wcm92aWRlcnMubW9kdWxlJztcclxuaW1wb3J0IHsgQXV0aCB9IGZyb20gJy4vLi4vYXV0aCc7XHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4vLi4vcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluIDogUHJvdmlkZXJzTW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBDb250cmFjdFByb3ZpZGVyIHtcclxuICBwcml2YXRlIGN1cnJlbnRUeCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UGFydGlhbDxJVHhPYmplY3Q+PihudWxsKTtcclxuICBwdWJsaWMgdHgkID0gdGhpcy5jdXJyZW50VHguYXNPYnNlcnZhYmxlKCk7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoQVVUSCkgcHJpdmF0ZSBhdXRoOiBBdXRoLCBwcml2YXRlIHByb3ZpZGVyOiBNYWluUHJvdmlkZXIpIHtcclxuICAgIHRoaXMuYXV0aC5hY2NvdW50JFxyXG4gICAgICAgIC5zdWJzY3JpYmUoZnJvbSA9PiB0aGlzLmRlZmF1bHRUeCA9IHsgLi4udGhpcy5kZWZhdWx0VHgsIGZyb20gfSk7XHJcbiAgICB0aGlzLmlkID0gdGhpcy5wcm92aWRlci5pZDtcclxuICB9XHJcblxyXG4gIGdldCBkZWZhdWx0VHgoKTogUGFydGlhbDxJVHhPYmplY3Q+IHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRUeC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRlZmF1bHRUeCh0cmFuc2FjdGlvbjogUGFydGlhbDxJVHhPYmplY3Q+KSB7XHJcbiAgICBjb25zdCB0eCA9IHsuLi50aGlzLmN1cnJlbnRUeC5nZXRWYWx1ZSgpLCAuLi50cmFuc2FjdGlvbiB9O1xyXG4gICAgdGhpcy5jdXJyZW50VHgubmV4dCh0eCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIGEgY2FsbCB0byB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSB0byBUaGUgYWRkcmVzcyBvZiB0aGUgY29udHJhY3QgdG8gY29udGFjdFxyXG4gICAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIG9mIHRoZSBjYWxsIGFzIGJ5dGVjb2RlXHJcbiAgICogQHBhcmFtIGJsb2NrVGFnIFRoZSBibG9jayB0byB0YXJnZXRcclxuICAgKi9cclxuICBwdWJsaWMgY2FsbDxUPihcclxuICAgIHRvOiBzdHJpbmcsXHJcbiAgICBkYXRhOiBzdHJpbmcsXHJcbiAgICBibG9ja1RhZzogQmxvY2tUYWcgPSAnbGF0ZXN0J1xyXG4gICk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPFQ+KCdldGhfY2FsbCcsIFt7IHRvLCBkYXRhIH0sIGJsb2NrVGFnXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGEgdHJhbnNhY3Rpb24gdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHBhc3MgdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tUYWcgVGhlIGJsb2NrIHRvIHRhcmdldFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVHJhbnNhY3Rpb248VD4oXHJcbiAgICB0cmFuc2FjdGlvbjogUGFydGlhbDxJVHhPYmplY3Q+LFxyXG4gICAgLi4ucmVzdDogYW55W11cclxuICApOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHR4ID0gbmV3IFR4T2JqZWN0KHRyYW5zYWN0aW9uKTtcclxuICAgIHJldHVybiB0aGlzLmF1dGguc2VuZFRyYW5zYWN0aW9uKHR4LCByZXN0KTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBSUEMgcmVxdWVzdCBmb3IgYSBzdWJzY3JpcHRpb25cclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyBvZiB0aGUgY29udHJhY3RcclxuICAgKiBAcGFyYW0gdG9waWNzIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50XHJcbiAgICovXHJcbiAgcHVibGljIGV2ZW50KFxyXG4gICAgYWRkcmVzczogc3RyaW5nLFxyXG4gICAgdG9waWNzOiBzdHJpbmdbXVxyXG4gICk6IE9ic2VydmFibGU8VHhMb2dzPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGNTdWI8VHhMb2dzPihbJ2xvZ3MnLCB7YWRkcmVzcywgdG9waWNzfV0pLnBpcGUoXHJcbiAgICAgIG1hcChsb2dzID0+IG5ldyBUeExvZ3MobG9ncykpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXN0aW1hdGUgdGhlIGFtb3VudCBvZiBnYXMgbmVlZGVkIGZvciB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSB0cmFuc2FjdGlvbiBUaGUgdHJhbnNhY3Rpb24gdG8gZXN0aW1hdGUgdGhlIGdhcyBmcm9tXHJcbiAgICovXHJcbiAgcHVibGljIGVzdGltYXRlR2FzKHRyYW5zYWN0aW9uOiBQYXJ0aWFsPElUeE9iamVjdD4pOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xyXG4gICAgY29uc3QgdHggPSBuZXcgVHhPYmplY3QodHJhbnNhY3Rpb24pO1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4oJ2V0aF9lc3RpbWF0ZUdhcycsIFt0eF0pLnBpcGUoXHJcbiAgICAgIG1hcChnYXMgPT4gaGV4VG9OdW1iZXIoZ2FzLnJlcGxhY2UoJzB4JywgJycpKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHByaWNlIHBlciBnYXMgaW4gd2VpXHJcbiAgICovXHJcbiAgcHVibGljIGdhc1ByaWNlKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX2dhc1ByaWNlJywgW10pLnBpcGUoXHJcbiAgICAgIG1hcChwcmljZSA9PiBoZXhUb051bWJlclN0cmluZyhwcmljZS5yZXBsYWNlKCcweCcsICcnKSkpXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IG51bWJlclRvSGV4LCBCbG9jaywgVHJhbnNhY3Rpb24sIFR4UmVjZWlwdCwgdG9CTiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4uL3Byb3ZpZGVycy5tb2R1bGUnXHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4uL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluIDogUHJvdmlkZXJzTW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBFdGgge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb3ZpZGVyOiBNYWluUHJvdmlkZXIpIHt9XHJcblxyXG4gIHB1YmxpYyBnZXRCbG9ja051bWJlcigpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJcclxuICAgICAgLnJwYzxzdHJpbmc+KCdldGhfYmxvY2tOdW1iZXInKVxyXG4gICAgICAucGlwZShtYXAoYmxvY2sgPT4gdG9CTihibG9jaykudG9TdHJpbmcoMTApKSk7O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEdhc1ByaWNlKCk6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPG51bWJlcj4oJ2V0aF9nYXNQcmljZScpXHJcbiAgICAgIC5waXBlKG1hcChibG9jayA9PiB0b0JOKGJsb2NrKS50b1N0cmluZygxMCkpKTtcclxuICB9XHJcblxyXG4gIC8qKioqKipcclxuICAgKiBCTE9DS1xyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRCbG9ja0J5TnVtYmVyKGJsb2NrTnVtYmVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGNvbnN0IGlzTnVtYmVyID0gdHlwZW9mIGJsb2NrTnVtYmVyID09PSAnbnVtYmVyJztcclxuICAgIGNvbnN0IHBhcmFtcyA9IGlzTnVtYmVyID8gbnVtYmVyVG9IZXgoYmxvY2tOdW1iZXIpIDogYmxvY2tOdW1iZXI7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPGFueT4oJ2V0aF9nZXRCbG9ja0J5TnVtYmVyJywgW3BhcmFtcywgdHJ1ZV0pXHJcbiAgICAgIC5waXBlKG1hcChibG9jayA9PiAoYmxvY2sgPyBuZXcgQmxvY2soYmxvY2spIDogbnVsbCkpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRCbG9ja0J5SGFzaChibG9ja0hhc2g6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPGFueT4oJ2V0aF9nZXRCbG9ja0J5TnVtYmVyJywgW2Jsb2NrSGFzaCwgdHJ1ZV0pXHJcbiAgICAgIC5waXBlKG1hcChibG9jayA9PiAoYmxvY2sgPyBuZXcgQmxvY2soYmxvY2spIDogbnVsbCkpKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqXHJcbiAgICogVFJBTlNBQ1RJT05cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0VHJhbnNhY3Rpb24odHJhbnNhY3Rpb25IYXNoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJcclxuICAgICAgLnJwYzxudW1iZXI+KCdldGhfZ2V0VHJhbnNhY3Rpb25CeUhhc2gnLCBbdHJhbnNhY3Rpb25IYXNoXSlcclxuICAgICAgLnBpcGUobWFwKHR4ID0+ICh0eCA/IG5ldyBUcmFuc2FjdGlvbih0eCkgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldFRyYW5zYWN0aW9uUmVjZWlwdCh0cmFuc2FjdGlvbkhhc2g6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPG51bWJlcj4oJ2V0aF9nZXRUcmFuc2FjdGlvblJlY2VpcHQnLCBbdHJhbnNhY3Rpb25IYXNoXSlcclxuICAgICAgLnBpcGUobWFwKHJlY2VpcHQgPT4gKHJlY2VpcHQgPyBuZXcgVHhSZWNlaXB0KHJlY2VpcHQpIDogbnVsbCkpKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKipcclxuICAgKiBTVUJTQ1JJUFRJT05TXHJcbiAgICovXHJcbiAgcHVibGljIG9uTmV3QmxvY2soKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGNTdWIoWyduZXdIZWFkcyddKS5waXBlKFxyXG4gICAgICBtYXAocmVzID0+IG5ldyBCbG9jayhyZXMpKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzU3luY2luZygpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwY1N1YihbJ3N5bmNpbmcnXSk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJ0YXAiLCJtYXAiLCJJbmplY3Rpb25Ub2tlbiIsIkFQUF9JTklUSUFMSVpFUiIsIk5nTW9kdWxlIiwiSHR0cENsaWVudE1vZHVsZSIsImZpbHRlciIsImZpcnN0IiwiV2ViU29ja2V0U3ViamVjdCIsInczY3dlYnNvY2tldCIsInN3aXRjaE1hcCIsIkluamVjdGFibGUiLCJCZWhhdmlvclN1YmplY3QiLCJ0b0NoZWNrc3VtQWRkcmVzcyIsInV0ZjhUb0hleCIsInRzbGliXzEuX19leHRlbmRzIiwiaHR0cCIsImJpbmROb2RlQ2FsbGJhY2siLCJIdHRwQ2xpZW50IiwiVHhPYmplY3QiLCJUeExvZ3MiLCJoZXhUb051bWJlciIsImhleFRvTnVtYmVyU3RyaW5nIiwiSW5qZWN0IiwidG9CTiIsIm51bWJlclRvSGV4IiwiQmxvY2siLCJUcmFuc2FjdGlvbiIsIlR4UmVjZWlwdCJdLCJtYXBwaW5ncyI6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