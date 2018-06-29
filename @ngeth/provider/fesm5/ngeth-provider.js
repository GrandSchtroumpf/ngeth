import { tap, map, filter, first, switchMap } from 'rxjs/operators';
import { NgModule, InjectionToken, APP_INITIALIZER, Injectable, defineInjectable, inject, Inject } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { w3cwebsocket } from 'websocket';
import { WebSocketSubject } from 'rxjs/webSocket';
import { utf8ToHex, toChecksumAddress, TxLogs, TxObject, hexToNumber, hexToNumberString, numberToHex, Block, Transaction, TxReceipt, toBN } from '@ngeth/utils';
import { BehaviorSubject, bindNodeCallback } from 'rxjs';
import { __extends, __assign } from 'tslib';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var MainProvider = /** @class */ (function () {
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
        return this.sendAsync(payload).pipe(tap(console.log), map(function (res) {
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
        return this.on(payload).pipe(map(function (res) { return res.params.result; }));
    };
    return MainProvider;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ AUTH = new InjectionToken('auth');
var ProvidersModule = /** @class */ (function () {
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
                    provide: APP_INITIALIZER,
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
        { type: NgModule, args: [{
                    imports: [HttpClientModule]
                },] },
    ];
    return ProvidersModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var WebsocketProvider = /** @class */ (function () {
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
        return this.socket$.pipe(filter(function (msg) { return msg.id === id; }), first());
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
        return this.socket$.pipe(filter(function (msg) { return _this.isSubscription(msg, subscription); }));
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
        this.socket$ = new WebSocketSubject({
            url: url,
            WebSocketCtor: /** @type {?} */ (w3cwebsocket)
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
        return this.response(payload.id).pipe(tap(function (res) { if (res.error)
            throw res.error; }), map(function (res) { return res.result; }), switchMap(function (result) {
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
        { type: Injectable, args: [{ providedIn: ProvidersModule },] },
    ];
    /** @nocollapse */
    WebsocketProvider.ctorParameters = function () { return []; };
    /** @nocollapse */ WebsocketProvider.ngInjectableDef = defineInjectable({ factory: function WebsocketProvider_Factory() { return new WebsocketProvider(); }, token: WebsocketProvider, providedIn: ProvidersModule });
    return WebsocketProvider;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Account = /** @class */ (function () {
    function Account(provider) {
        this.provider = provider;
        this.currentAccount = new BehaviorSubject(null);
        this.account$ = this.currentAccount.asObservable();
    }
    Object.defineProperty(Account.prototype, "defaultAccount", {
        /** Get the default account */
        get: /**
         * Get the default account
         * @return {?}
         */
        function () {
            return this.currentAccount.getValue();
        },
        /** Set the default account */
        set: /**
         * Set the default account
         * @param {?} account
         * @return {?}
         */
        function (account) {
            this.currentAccount.next(toChecksumAddress(account));
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
        if (blockTag === void 0) { blockTag = 'latest'; }
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
        var /** @type {?} */ msg = utf8ToHex(message);
        var /** @type {?} */ method = this.provider.type === 'web3' ? 'personal_sign' : 'eth_sign';
        var /** @type {?} */ params = this.provider.type === 'web3' ? [address, msg, pwd] : [msg, address];
        return this.provider.rpc(method, params);
    };
    Account.decorators = [
        { type: Injectable, args: [{ providedIn: ProvidersModule },] },
    ];
    /** @nocollapse */
    Account.ctorParameters = function () { return [
        { type: MainProvider, },
    ]; };
    /** @nocollapse */ Account.ngInjectableDef = defineInjectable({ factory: function Account_Factory() { return new Account(inject(MainProvider)); }, token: Account, providedIn: ProvidersModule });
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
        var DecoratedProvider = /** @class */ (function (_super) {
            __extends(DecoratedProvider, _super);
            function DecoratedProvider(http, ws) {
                var _this = _super.call(this) || this;
                _this.http = http;
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
                    return bindNodeCallback(sendAsync)();
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
                { type: Injectable, args: [{ providedIn: ProvidersModule },] },
            ];
            /** @nocollapse */
            DecoratedProvider.ctorParameters = function () { return [
                { type: HttpClient, },
                { type: WebsocketProvider, },
            ]; };
            return DecoratedProvider;
        }(MainProvider));
        return /** @type {?} */ (DecoratedProvider);
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ContractProvider = /** @class */ (function () {
    function ContractProvider(auth, provider) {
        var _this = this;
        this.auth = auth;
        this.provider = provider;
        this.currentTx = new BehaviorSubject(null);
        this.tx$ = this.currentTx.asObservable();
        this.auth.account$
            .subscribe(function (from) { return _this.defaultTx = __assign({}, _this.defaultTx, { from: from }); });
        this.id = this.provider.id;
    }
    Object.defineProperty(ContractProvider.prototype, "defaultTx", {
        get: /**
         * @return {?}
         */
        function () {
            return this.currentTx.getValue();
        },
        set: /**
         * @param {?} transaction
         * @return {?}
         */
        function (transaction) {
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
        if (blockTag === void 0) { blockTag = 'latest'; }
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
        var /** @type {?} */ tx = new TxObject(transaction);
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
        return this.provider.rpcSub(['logs', { address: address, topics: topics }]).pipe(map(function (logs) { return new TxLogs(logs); }));
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
        var /** @type {?} */ tx = new TxObject(transaction);
        return this.provider.rpc('eth_estimateGas', [tx]).pipe(map(function (gas) { return hexToNumber(gas.replace('0x', '')); }));
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
        return this.provider.rpc('eth_gasPrice', []).pipe(map(function (price) { return hexToNumberString(price.replace('0x', '')); }));
    };
    ContractProvider.decorators = [
        { type: Injectable, args: [{ providedIn: ProvidersModule },] },
    ];
    /** @nocollapse */
    ContractProvider.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [AUTH,] },] },
        { type: MainProvider, },
    ]; };
    /** @nocollapse */ ContractProvider.ngInjectableDef = defineInjectable({ factory: function ContractProvider_Factory() { return new ContractProvider(inject(AUTH), inject(MainProvider)); }, token: ContractProvider, providedIn: ProvidersModule });
    return ContractProvider;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Eth = /** @class */ (function () {
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
            .pipe(map(function (block) { return toBN(block).toString(10); }));
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
            .pipe(map(function (block) { return toBN(block).toString(10); }));
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
        var /** @type {?} */ params = isNumber ? numberToHex(blockNumber) : blockNumber;
        return this.provider
            .rpc('eth_getBlockByNumber', [params, true])
            .pipe(map(function (block) { return (block ? new Block(block) : null); }));
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
            .pipe(map(function (block) { return (block ? new Block(block) : null); }));
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
            .pipe(map(function (tx) { return (tx ? new Transaction(tx) : null); }));
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
            .pipe(map(function (receipt) { return (receipt ? new TxReceipt(receipt) : null); }));
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
        return this.provider.rpcSub(['newHeads']).pipe(map(function (res) { return new Block(res); }));
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
        { type: Injectable, args: [{ providedIn: ProvidersModule },] },
    ];
    /** @nocollapse */
    Eth.ctorParameters = function () { return [
        { type: MainProvider, },
    ]; };
    /** @nocollapse */ Eth.ngInjectableDef = defineInjectable({ factory: function Eth_Factory() { return new Eth(inject(MainProvider)); }, token: Eth, providedIn: ProvidersModule });
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

export { AUTH, ProvidersModule, Provider, MainProvider, ContractProvider, Eth, Account };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtcHJvdmlkZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvcHJvdmlkZXIudHMiLCJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvcHJvdmlkZXJzLm1vZHVsZS50cyIsIm5nOi8vQG5nZXRoL3Byb3ZpZGVyL2xpYi9wcm92aWRlcnMvd3MtcHJvdmlkZXIudHMiLCJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvc3VicHJvdmlkZXJzL2FjY291bnQudHMiLCJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvcHJvdmlkZXIuZGVjb3JhdG9yLnRzIiwibmc6Ly9AbmdldGgvcHJvdmlkZXIvbGliL3N1YnByb3ZpZGVycy9jb250cmFjdC50cyIsIm5nOi8vQG5nZXRoL3Byb3ZpZGVyL2xpYi9zdWJwcm92aWRlcnMvZXRoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUlBDUmVxLCBSUENSZXMsIFJQQ1N1YiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG4vLyBAZHluYW1pY1xyXG5leHBvcnQgY2xhc3MgTWFpblByb3ZpZGVyIHtcclxuICBzdGF0aWMgQXV0aDogVHlwZTxhbnk+O1xyXG4gIHByb3RlY3RlZCBzZW5kQXN5bmM6IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDUmVzPFQ+PjtcclxuICBwcm90ZWN0ZWQgb246IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDU3ViPFQ+PjtcclxuICBwcm90ZWN0ZWQgcnBjSWQgPSAwO1xyXG4gIHByb3RlY3RlZCB3ZWIzUHJvdmlkZXI6IGFueTtcclxuICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6ICd3ZWIzJyB8ICdodHRwJyB8ICd3cyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgLyoqIEpTT04gUlBDIFJlcXVlc3QgKi9cclxuICBwcm90ZWN0ZWQgcmVxKG1ldGhvZDogc3RyaW5nLCBwYXJhbXM/OiBhbnlbXSk6IFJQQ1JlcSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBqc29ucnBjOiAnMi4wJyxcclxuICAgICAgaWQ6IHRoaXMucnBjSWQsXHJcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtcyB8fCBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKiBKU09OIFJQQyBSZXNwb25zZSAqL1xyXG4gIHByb3RlY3RlZCByZXM8VD4ocGF5bG9hZDogYW55LCByZXN1bHQ6IGFueSk6IFJQQ1JlczxUPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBqc29ucnBjOiBwYXlsb2FkLmpzb25ycGMsXHJcbiAgICAgIGlkOiBwYXlsb2FkLmlkLFxyXG4gICAgICByZXN1bHQ6IHJlc3VsdFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKiBHZXQgdGhlIGlkIG9mIHRoZSBwcm92aWRlciA6IHVzZSBvbmx5IGF0IGxhdW5jaCAqL1xyXG4gIHB1YmxpYyBmZXRjaElkKCk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICB0aGlzLnJwY0lkKys7XHJcbiAgICByZXR1cm4gdGhpcy5ycGM8bnVtYmVyPignbmV0X3ZlcnNpb24nKS50b1Byb21pc2U8bnVtYmVyPigpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBub2RlICovXHJcbiAgcHVibGljIHJwYzxUPihtZXRob2Q6IHN0cmluZywgcGFyYW1zPzogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlcShtZXRob2QsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5zZW5kQXN5bmM8VD4ocGF5bG9hZCkucGlwZShcclxuICAgICAgdGFwKGNvbnNvbGUubG9nKSxcclxuICAgICAgbWFwKHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKHJlcy5lcnJvcikgdGhyb3cgcmVzLmVycm9yO1xyXG4gICAgICAgIHJldHVybiByZXMucmVzdWx0O1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKiBTZW5kIGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QgdG8gdGhlIG5vZGUgKi9cclxuICBwdWJsaWMgcnBjU3ViPFQ+KHBhcmFtczogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlcSgnZXRoX3N1YnNjcmliZScsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5vbjxUPihwYXlsb2FkKS5waXBlKFxyXG4gICAgICBtYXAocmVzID0+ICByZXMucGFyYW1zLnJlc3VsdClcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7XHJcbiAgTmdNb2R1bGUsXHJcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcclxuICBJbmplY3Rpb25Ub2tlbixcclxuICBBUFBfSU5JVElBTElaRVJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IEFVVEggPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignYXV0aCcpO1xyXG5cclxuLy8gQGR5bmFtaWNcclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIFByb3ZpZGVyc01vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoUHJvdmlkZXI6IHR5cGVvZiBNYWluUHJvdmlkZXIpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBQcm92aWRlcnNNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHsgcHJvdmlkZTogTWFpblByb3ZpZGVyLCB1c2VFeGlzdGluZzogUHJvdmlkZXIgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXHJcbiAgICAgICAgICB1c2VGYWN0b3J5OiAocHJvdmlkZXI6IE1haW5Qcm92aWRlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gICgpID0+IHByb3ZpZGVyLmZldGNoSWQoKS50aGVuKGlkID0+IHByb3ZpZGVyLmlkID0gaWQpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgICAgICAgZGVwczogW01haW5Qcm92aWRlcl1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgcHJvdmlkZTogQVVUSCwgdXNlQ2xhc3M6IFByb3ZpZGVyLkF1dGggfSxcclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSUENSZXMsIFJQQ1N1YiwgUlBDUmVxIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlIH0gZnJvbSAnLi8uLi9wcm92aWRlcnMubW9kdWxlJztcclxuaW1wb3J0IHsgdzNjd2Vic29ja2V0IH0gZnJvbSAnd2Vic29ja2V0JztcclxuaW1wb3J0IHsgV2ViU29ja2V0U3ViamVjdCB9IGZyb20gJ3J4anMvd2ViU29ja2V0JztcclxuXHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgdGFwLCBzd2l0Y2hNYXAsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogUHJvdmlkZXJzTW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBXZWJzb2NrZXRQcm92aWRlciB7XHJcbiAgcHJpdmF0ZSBzb2NrZXQkOiBXZWJTb2NrZXRTdWJqZWN0PGFueT47XHJcbiAgcHVibGljIG9ic2VydmFibGVzOiBPYnNlcnZhYmxlPFJQQ1N1Yj5bXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgbWVzc2FnZSBpcyB0aGUgc3Vic2NyaXB0aW9uIHdlIHdhbnRcclxuICAgKiBAcGFyYW0gbXNnIFRoZSBtZXNzYWdlIHJldHVybmVkIGJ5IHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHN1YnNjcmlwdGlvbiBUaGUgc3Vic2NyaXB0aW9uIHRvIG1hcFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaXNTdWJzY3JpcHRpb24obXNnOiBhbnksIHN1YnNjcmlwdGlvbjogc3RyaW5nKTogbXNnIGlzIFJQQ1N1YiB7XHJcbiAgICByZXR1cm4gISFtc2cubWV0aG9kXHJcbiAgICAgICAgICAmJiBtc2cubWV0aG9kID09PSAnZXRoX3N1YnNjcmlwdGlvbidcclxuICAgICAgICAgICYmIG1zZy5wYXJhbXMuc3Vic2NyaXB0aW9uID09PSBzdWJzY3JpcHRpb247XHJcbiAgfVxyXG5cclxuICAvKiogUmV0dXJuIHRoZSByZXNwb25zZSBvZiBhbiBSUEMgUmVxdWVzdCAqL1xyXG4gIHByaXZhdGUgcmVzcG9uc2U8VD4oaWQ6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0JC5waXBlKFxyXG4gICAgICBmaWx0ZXIoKG1zZzogUlBDUmVzPFQ+KSA9PiBtc2cuaWQgPT09IGlkKSxcclxuICAgICAgZmlyc3QoKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN1YnNjcmliZSB0byB0aGUgbm9kZSBmb3IgYSBzcGVjaWZpYyBzdWJzY3JpcHRpb24gbmFtZVxyXG4gICAqIEBwYXJhbSBzdWJzY3JpcHRpb24gVGhlIHN1YnNjcmlwdGlvbiBuYW1lIHdlIHdhbnQgdG8gc3Vic2NyaWJlIHRvXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb248VD4oc3Vic2NyaXB0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFJQQ1N1YjxUPj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0JC5waXBlKFxyXG4gICAgICBmaWx0ZXIobXNnID0+IHRoaXMuaXNTdWJzY3JpcHRpb24obXNnLCBzdWJzY3JpcHRpb24pKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgc29ja2V0IGJldHdlZW4gdGhlIGNsaWVudCBhbmQgdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gdXJsIFRoZSB1cmwgb2YgdGhlIG5vZGUgdG8gY29ubmVjdCB0b1xyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGUodXJsOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc29ja2V0JCA9IG5ldyBXZWJTb2NrZXRTdWJqZWN0KHtcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIFdlYlNvY2tldEN0b3I6IHczY3dlYnNvY2tldCBhcyBhbnlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhbiBSUEMgcmVxdWVzdCB0byB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBwYXlsb2FkIFRoZSBSUEMgcmVxdWVzdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwb3N0PFQgPSBhbnk+KHBheWxvYWQ6IFJQQ1JlcSk6IE9ic2VydmFibGU8UlBDUmVzPFQ+PiB7XHJcbiAgICB0aGlzLnNvY2tldCQubmV4dChwYXlsb2FkKTtcclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlPFQ+KHBheWxvYWQuaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3Vic2NyaWJlIHRvIGEgU1VCL1BVQlxyXG4gICAqIEBwYXJhbSBwYXlsb2FkIFRoZSBSUEMgcmVxdWVzdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdWJzY3JpYmUocGF5bG9hZDogUlBDUmVxKSB7XHJcbiAgICB0aGlzLnNvY2tldCQubmV4dChwYXlsb2FkKTtcclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlPHN0cmluZz4ocGF5bG9hZC5pZCkucGlwZShcclxuICAgICAgdGFwKHJlcyA9PiB7IGlmIChyZXMuZXJyb3IpIHRocm93IHJlcy5lcnJvcjsgfSksXHJcbiAgICAgIG1hcChyZXMgPT4gcmVzLnJlc3VsdCksXHJcbiAgICAgIHN3aXRjaE1hcChyZXN1bHQgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9ic2VydmFibGVzW3Jlc3VsdF0gPSB0aGlzLnN1YnNjcmlwdGlvbihyZXN1bHQpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE9cclxuICBwdWJsaWMgdW5zdWJzY3JpYmUoKSB7XHJcblxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFR4T2JqZWN0LCB1dGY4VG9IZXgsIEJsb2NrVGFnLCB0b0NoZWNrc3VtQWRkcmVzcyB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4vLi4vcHJvdmlkZXJzLm1vZHVsZSc7XHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4uL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgQXV0aCB9IGZyb20gJy4uL2F1dGgnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbiA6IFByb3ZpZGVyc01vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudCBpbXBsZW1lbnRzIEF1dGgge1xyXG4gIHByaXZhdGUgY3VycmVudEFjY291bnQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4obnVsbCk7XHJcbiAgcHVibGljIGFjY291bnQkID0gdGhpcy5jdXJyZW50QWNjb3VudC5hc09ic2VydmFibGUoKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm92aWRlcjogTWFpblByb3ZpZGVyKSB7fVxyXG5cclxuICAvKiogR2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBnZXQgZGVmYXVsdEFjY291bnQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRBY2NvdW50LmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogU2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBzZXQgZGVmYXVsdEFjY291bnQoYWNjb3VudDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRBY2NvdW50Lm5leHQodG9DaGVja3N1bUFkZHJlc3MoYWNjb3VudCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCB0aGUgbGlzdCBvZiBhY2NvdW50cyBhdmFpbGFibGUgb24gdGhlIG5vZGUgKi9cclxuICBwdWJsaWMgZ2V0QWNjb3VudHMoKTogT2JzZXJ2YWJsZTxzdHJpbmdbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZ1tdPignZXRoX2FjY291bnRzJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGEgdHJhbnNhY3Rpb24gdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHBhc3MgdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tUYWcgVGhlIGJsb2NrIHRvIHRhcmdldFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVHJhbnNhY3Rpb248VD4oXHJcbiAgICB0eDogVHhPYmplY3QsXHJcbiAgICBibG9ja1RhZzogQmxvY2tUYWcgPSAnbGF0ZXN0J1xyXG4gICk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPFQ+KCdldGhfc2VuZFRyYW5zYWN0aW9uJywgW3R4LCBibG9ja1RhZ10pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEJhbGFuY2UoYWRkcmVzczogc3RyaW5nLCBibG9ja1RhZz86IEJsb2NrVGFnIHwgbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX2dldEJhbGFuY2UnLCBbYWRkcmVzcywgYmxvY2tUYWcgfHwgJ2xhdGVzdCddKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRUcmFuc2FjdGlvbkNvdW50KGFkZHJlc3M6IHN0cmluZywgYmxvY2tUYWc/OiBCbG9ja1RhZyB8IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4oJ2V0aF9nZXRUcmFuc2FjdGlvbkNvdW50JywgW1xyXG4gICAgICBhZGRyZXNzLFxyXG4gICAgICBibG9ja1RhZyB8fCAnbGF0ZXN0J1xyXG4gICAgXSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2lnbihtZXNzYWdlOiBzdHJpbmcsIGFkZHJlc3M6IHN0cmluZywgIHB3ZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IG1zZyA9IHV0ZjhUb0hleChtZXNzYWdlKTtcclxuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMucHJvdmlkZXIudHlwZSA9PT0gJ3dlYjMnID8gJ3BlcnNvbmFsX3NpZ24nIDogJ2V0aF9zaWduJztcclxuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucHJvdmlkZXIudHlwZSA9PT0gJ3dlYjMnID8gW2FkZHJlc3MsIG1zZywgcHdkXSA6IFttc2csIGFkZHJlc3NdO1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4obWV0aG9kLCBwYXJhbXMpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBXZWJzb2NrZXRQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL3dzLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBiaW5kTm9kZUNhbGxiYWNrLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBSUENSZXMsIFJQQ1JlcSwgUlBDU3ViIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcic7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4vcHJvdmlkZXJzLm1vZHVsZSc7XHJcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICcuL3N1YnByb3ZpZGVycy9hY2NvdW50JztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gUHJvdmlkZXIob3B0aW9uczoge1xyXG4gIHVybDogc3RyaW5nO1xyXG4gIGF1dGg/OiBhbnk7XHJcbn0pIHtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKEJhc2U6IFR5cGU8TWFpblByb3ZpZGVyPikge1xyXG5cclxuICAgIEBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogUHJvdmlkZXJzTW9kdWxlIH0pXHJcbiAgICBjbGFzcyBEZWNvcmF0ZWRQcm92aWRlciBleHRlbmRzIE1haW5Qcm92aWRlciB7XHJcbiAgICAgIHB1YmxpYyBzdGF0aWMgQXV0aCA9IG9wdGlvbnMuYXV0aCB8fCBBY2NvdW50O1xyXG4gICAgICBwdWJsaWMgc2VuZEFzeW5jOiA8VD4ocGF5bG9hZDogUlBDUmVxKSA9PiBPYnNlcnZhYmxlPFJQQ1JlczxUPj47XHJcbiAgICAgIHB1YmxpYyBvbjogPFQ+KHBheWxvYWQ6IFJQQ1JlcSkgPT4gT2JzZXJ2YWJsZTxSUENTdWI8VD4+O1xyXG5cclxuICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHByaXZhdGUgd3M6IFdlYnNvY2tldFByb3ZpZGVyXHJcbiAgICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnbG9jYWxob3N0Ojg1NDUnO1xyXG4gICAgICAgIGNvbnN0IHByb3RvY29sID0gbmV3IFVSTCh0aGlzLnVybCkucHJvdG9jb2w7XHJcbiAgICAgICAgY29uc3QgaXNXUyA9IHByb3RvY29sID09PSAnd3M6JyB8fCBwcm90b2NvbCA9PT0gJ3dzczonO1xyXG5cclxuICAgICAgICBpZiAod2luZG93ICYmICd3ZWIzJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICAgIHRoaXMudHlwZSA9ICd3ZWIzJztcclxuICAgICAgICAgIHRoaXMuc2V0V2ViM1Byb3ZpZGVyKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc1dTKSB7XHJcbiAgICAgICAgICB0aGlzLnR5cGUgPSAnd3MnO1xyXG4gICAgICAgICAgdGhpcy5zZXRXc1Byb3ZpZGVyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudHlwZSA9ICdodHRwJztcclxuICAgICAgICAgIHRoaXMuc2V0SHR0cFByb3ZpZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqIENvbm5lY3QgdG8gYSB3ZWIzIGluc3RhbmNlIGluc2lkZSB0aGUgcGFnZSBpZiBhbnkgKi9cclxuICAgICAgcHJpdmF0ZSBzZXRXZWIzUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdGhpcy53ZWIzUHJvdmlkZXIgPSB3aW5kb3dbJ3dlYjMnXS5jdXJyZW50UHJvdmlkZXI7XHJcbiAgICAgICAgdGhpcy5zZW5kQXN5bmMgPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgY29uc3Qgc2VuZEFzeW5jID0gdGhpcy53ZWIzUHJvdmlkZXIuc2VuZEFzeW5jLmJpbmQodGhpcy53ZWIzUHJvdmlkZXIsIHBheWxvYWQpO1xyXG4gICAgICAgICAgcmV0dXJuIGJpbmROb2RlQ2FsbGJhY2s8YW55PihzZW5kQXN5bmMpKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiogU2V0dXAgYSBXZWJzb2NrZXQgY29ubmVjdGlvbiB3aXRoIHRoZSBub2RlICovXHJcbiAgICAgIHByaXZhdGUgc2V0V3NQcm92aWRlcigpIHtcclxuICAgICAgICB0aGlzLndzLmNyZWF0ZSh0aGlzLnVybCk7XHJcbiAgICAgICAgdGhpcy5vbiA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMud3Muc3Vic2NyaWJlKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbmRBc3luYyA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMud3MucG9zdChwYXlsb2FkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKiBTZXR1cCBhbiBIVFRQIGNvbm5lY3Rpb24gd2l0aCB0aGUgbm9kZSAqL1xyXG4gICAgICBwcml2YXRlIHNldEh0dHBQcm92aWRlcigpIHtcclxuICAgICAgICB0aGlzLnNlbmRBc3luYyA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PFJQQ1Jlczxhbnk+Pih0aGlzLnVybCwgcGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gRGVjb3JhdGVkUHJvdmlkZXIgYXMgYW55O1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJsb2NrVGFnLCBUeExvZ3MsIElUeE9iamVjdCwgVHhPYmplY3QsIGhleFRvTnVtYmVyLCBoZXhUb051bWJlclN0cmluZyB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSwgQVVUSCB9IGZyb20gJy4uL3Byb3ZpZGVycy5tb2R1bGUnO1xyXG5pbXBvcnQgeyBBdXRoIH0gZnJvbSAnLi8uLi9hdXRoJztcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi8uLi9wcm92aWRlcic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW4gOiBQcm92aWRlcnNNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIENvbnRyYWN0UHJvdmlkZXIge1xyXG4gIHByaXZhdGUgY3VycmVudFR4ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQYXJ0aWFsPElUeE9iamVjdD4+KG51bGwpO1xyXG4gIHB1YmxpYyB0eCQgPSB0aGlzLmN1cnJlbnRUeC5hc09ic2VydmFibGUoKTtcclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoQEluamVjdChBVVRIKSBwcml2YXRlIGF1dGg6IEF1dGgsIHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcikge1xyXG4gICAgdGhpcy5hdXRoLmFjY291bnQkXHJcbiAgICAgICAgLnN1YnNjcmliZShmcm9tID0+IHRoaXMuZGVmYXVsdFR4ID0geyAuLi50aGlzLmRlZmF1bHRUeCwgZnJvbSB9KTtcclxuICAgIHRoaXMuaWQgPSB0aGlzLnByb3ZpZGVyLmlkO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRlZmF1bHRUeCgpOiBQYXJ0aWFsPElUeE9iamVjdD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFR4LmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICBzZXQgZGVmYXVsdFR4KHRyYW5zYWN0aW9uOiBQYXJ0aWFsPElUeE9iamVjdD4pIHtcclxuICAgIGNvbnN0IHR4ID0gey4uLnRoaXMuY3VycmVudFR4LmdldFZhbHVlKCksIC4uLnRyYW5zYWN0aW9uIH07XHJcbiAgICB0aGlzLmN1cnJlbnRUeC5uZXh0KHR4KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgYSBjYWxsIHRvIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHRvIFRoZSBhZGRyZXNzIG9mIHRoZSBjb250cmFjdCB0byBjb250YWN0XHJcbiAgICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgb2YgdGhlIGNhbGwgYXMgYnl0ZWNvZGVcclxuICAgKiBAcGFyYW0gYmxvY2tUYWcgVGhlIGJsb2NrIHRvIHRhcmdldFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjYWxsPFQ+KFxyXG4gICAgdG86IHN0cmluZyxcclxuICAgIGRhdGE6IHN0cmluZyxcclxuICAgIGJsb2NrVGFnOiBCbG9ja1RhZyA9ICdsYXRlc3QnXHJcbiAgKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8VD4oJ2V0aF9jYWxsJywgW3sgdG8sIGRhdGEgfSwgYmxvY2tUYWddKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgYSB0cmFuc2FjdGlvbiB0byB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSB0eCBUaGUgdHJhbnNhY3Rpb24gdG8gcGFzcyB0byB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBibG9ja1RhZyBUaGUgYmxvY2sgdG8gdGFyZ2V0XHJcbiAgICovXHJcbiAgcHVibGljIHNlbmRUcmFuc2FjdGlvbjxUPihcclxuICAgIHRyYW5zYWN0aW9uOiBQYXJ0aWFsPElUeE9iamVjdD4sXHJcbiAgICAuLi5yZXN0OiBhbnlbXVxyXG4gICk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgY29uc3QgdHggPSBuZXcgVHhPYmplY3QodHJhbnNhY3Rpb24pO1xyXG4gICAgcmV0dXJuIHRoaXMuYXV0aC5zZW5kVHJhbnNhY3Rpb24odHgsIHJlc3QpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIFJQQyByZXF1ZXN0IGZvciBhIHN1YnNjcmlwdGlvblxyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIG9mIHRoZSBjb250cmFjdFxyXG4gICAqIEBwYXJhbSB0b3BpY3MgVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnRcclxuICAgKi9cclxuICBwdWJsaWMgZXZlbnQoXHJcbiAgICBhZGRyZXNzOiBzdHJpbmcsXHJcbiAgICB0b3BpY3M6IHN0cmluZ1tdXHJcbiAgKTogT2JzZXJ2YWJsZTxUeExvZ3M+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwY1N1YjxUeExvZ3M+KFsnbG9ncycsIHthZGRyZXNzLCB0b3BpY3N9XSkucGlwZShcclxuICAgICAgbWFwKGxvZ3MgPT4gbmV3IFR4TG9ncyhsb2dzKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFc3RpbWF0ZSB0aGUgYW1vdW50IG9mIGdhcyBuZWVkZWQgZm9yIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHRyYW5zYWN0aW9uIFRoZSB0cmFuc2FjdGlvbiB0byBlc3RpbWF0ZSB0aGUgZ2FzIGZyb21cclxuICAgKi9cclxuICBwdWJsaWMgZXN0aW1hdGVHYXModHJhbnNhY3Rpb246IFBhcnRpYWw8SVR4T2JqZWN0Pik6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICBjb25zdCB0eCA9IG5ldyBUeE9iamVjdCh0cmFuc2FjdGlvbik7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX2VzdGltYXRlR2FzJywgW3R4XSkucGlwZShcclxuICAgICAgbWFwKGdhcyA9PiBoZXhUb051bWJlcihnYXMucmVwbGFjZSgnMHgnLCAnJykpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgcHJpY2UgcGVyIGdhcyBpbiB3ZWlcclxuICAgKi9cclxuICBwdWJsaWMgZ2FzUHJpY2UoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwYzxzdHJpbmc+KCdldGhfZ2FzUHJpY2UnLCBbXSkucGlwZShcclxuICAgICAgbWFwKHByaWNlID0+IGhleFRvTnVtYmVyU3RyaW5nKHByaWNlLnJlcGxhY2UoJzB4JywgJycpKSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgbnVtYmVyVG9IZXgsIEJsb2NrLCBUcmFuc2FjdGlvbiwgVHhSZWNlaXB0LCB0b0JOIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlIH0gZnJvbSAnLi4vcHJvdmlkZXJzLm1vZHVsZSdcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi4vcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW4gOiBQcm92aWRlcnNNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEV0aCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcikge31cclxuXHJcbiAgcHVibGljIGdldEJsb2NrTnVtYmVyKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPHN0cmluZz4oJ2V0aF9ibG9ja051bWJlcicpXHJcbiAgICAgIC5waXBlKG1hcChibG9jayA9PiB0b0JOKGJsb2NrKS50b1N0cmluZygxMCkpKTs7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0R2FzUHJpY2UoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8bnVtYmVyPignZXRoX2dhc1ByaWNlJylcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IHRvQk4oYmxvY2spLnRvU3RyaW5nKDEwKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKlxyXG4gICAqIEJMT0NLXHJcbiAgICovXHJcbiAgcHVibGljIGdldEJsb2NrQnlOdW1iZXIoYmxvY2tOdW1iZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgY29uc3QgaXNOdW1iZXIgPSB0eXBlb2YgYmxvY2tOdW1iZXIgPT09ICdudW1iZXInO1xyXG4gICAgY29uc3QgcGFyYW1zID0gaXNOdW1iZXIgPyBudW1iZXJUb0hleChibG9ja051bWJlcikgOiBibG9ja051bWJlcjtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8YW55PignZXRoX2dldEJsb2NrQnlOdW1iZXInLCBbcGFyYW1zLCB0cnVlXSlcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IChibG9jayA/IG5ldyBCbG9jayhibG9jaykgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEJsb2NrQnlIYXNoKGJsb2NrSGFzaDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8YW55PignZXRoX2dldEJsb2NrQnlOdW1iZXInLCBbYmxvY2tIYXNoLCB0cnVlXSlcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IChibG9jayA/IG5ldyBCbG9jayhibG9jaykgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKipcclxuICAgKiBUUkFOU0FDVElPTlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRUcmFuc2FjdGlvbih0cmFuc2FjdGlvbkhhc2g6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPG51bWJlcj4oJ2V0aF9nZXRUcmFuc2FjdGlvbkJ5SGFzaCcsIFt0cmFuc2FjdGlvbkhhc2hdKVxyXG4gICAgICAucGlwZShtYXAodHggPT4gKHR4ID8gbmV3IFRyYW5zYWN0aW9uKHR4KSA6IG51bGwpKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0VHJhbnNhY3Rpb25SZWNlaXB0KHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8bnVtYmVyPignZXRoX2dldFRyYW5zYWN0aW9uUmVjZWlwdCcsIFt0cmFuc2FjdGlvbkhhc2hdKVxyXG4gICAgICAucGlwZShtYXAocmVjZWlwdCA9PiAocmVjZWlwdCA/IG5ldyBUeFJlY2VpcHQocmVjZWlwdCkgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKlxyXG4gICAqIFNVQlNDUklQVElPTlNcclxuICAgKi9cclxuICBwdWJsaWMgb25OZXdCbG9jaygpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwY1N1YihbJ25ld0hlYWRzJ10pLnBpcGUoXHJcbiAgICAgIG1hcChyZXMgPT4gbmV3IEJsb2NrKHJlcykpXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNTeW5jaW5nKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjU3ViKFsnc3luY2luZyddKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbInRzbGliXzEuX19leHRlbmRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBR0EsSUFHQTtJQVVFO3FCQU5rQixDQUFDO0tBTUg7Ozs7Ozs7O0lBR04sMEJBQUc7Ozs7OztJQUFiLFVBQWMsTUFBYyxFQUFFLE1BQWM7UUFDMUMsT0FBTztZQUNMLE9BQU8sRUFBRSxLQUFLO1lBQ2QsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2QsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFN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