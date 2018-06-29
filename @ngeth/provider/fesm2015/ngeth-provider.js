import { tap, map, filter, first, switchMap } from 'rxjs/operators';
import { NgModule, InjectionToken, APP_INITIALIZER, Injectable, Inject, defineInjectable, inject } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { w3cwebsocket } from 'websocket';
import { WebSocketSubject } from 'rxjs/webSocket';
import { utf8ToHex, toChecksumAddress, TxLogs, TxObject, hexToNumber, hexToNumberString, numberToHex, Block, Transaction, TxReceipt, toBN } from '@ngeth/utils';
import { BehaviorSubject, bindNodeCallback } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class MainProvider {
    constructor() {
        this.rpcId = 0;
    }
    /**
     * JSON RPC Request
     * @param {?} method
     * @param {?=} params
     * @return {?}
     */
    req(method, params) {
        return {
            jsonrpc: '2.0',
            id: this.rpcId,
            method: method,
            params: params || []
        };
    }
    /**
     * JSON RPC Response
     * @template T
     * @param {?} payload
     * @param {?} result
     * @return {?}
     */
    res(payload, result) {
        return {
            jsonrpc: payload.jsonrpc,
            id: payload.id,
            result: result
        };
    }
    /**
     * Get the id of the provider : use only at launch
     * @return {?}
     */
    fetchId() {
        this.rpcId++;
        return this.rpc('net_version').toPromise();
    }
    /**
     * Send a request to the node
     * @template T
     * @param {?} method
     * @param {?=} params
     * @return {?}
     */
    rpc(method, params) {
        const /** @type {?} */ payload = this.req(method, params);
        return this.sendAsync(payload).pipe(tap(console.log), map(res => {
            if (res.error)
                throw res.error;
            return res.result;
        }));
    }
    /**
     * Send a subscription request to the node
     * @template T
     * @param {?} params
     * @return {?}
     */
    rpcSub(params) {
        const /** @type {?} */ payload = this.req('eth_subscribe', params);
        return this.on(payload).pipe(map(res => res.params.result));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ AUTH = new InjectionToken('auth');
class ProvidersModule {
    /**
     * @param {?} Provider
     * @return {?}
     */
    static forRoot(Provider) {
        return {
            ngModule: ProvidersModule,
            providers: [
                { provide: MainProvider, useExisting: Provider },
                {
                    provide: APP_INITIALIZER,
                    useFactory: (provider) => {
                        return () => provider.fetchId().then(id => provider.id = id);
                    },
                    multi: true,
                    deps: [MainProvider]
                },
                { provide: AUTH, useClass: Provider.Auth },
            ]
        };
    }
}
ProvidersModule.decorators = [
    { type: NgModule, args: [{
                imports: [HttpClientModule]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class WebsocketProvider {
    constructor() {
        this.observables = [];
    }
    /**
     * Check if a message is the subscription we want
     * @param {?} msg The message returned by the node
     * @param {?} subscription The subscription to map
     * @return {?}
     */
    isSubscription(msg, subscription) {
        return !!msg.method
            && msg.method === 'eth_subscription'
            && msg.params.subscription === subscription;
    }
    /**
     * Return the response of an RPC Request
     * @template T
     * @param {?} id
     * @return {?}
     */
    response(id) {
        return this.socket$.pipe(filter((msg) => msg.id === id), first());
    }
    /**
     * Subscribe to the node for a specific subscription name
     * @template T
     * @param {?} subscription The subscription name we want to subscribe to
     * @return {?}
     */
    subscription(subscription) {
        return this.socket$.pipe(filter(msg => this.isSubscription(msg, subscription)));
    }
    /**
     * Create a socket between the client and the node
     * @param {?} url The url of the node to connect to
     * @return {?}
     */
    create(url) {
        this.socket$ = new WebSocketSubject({
            url: url,
            WebSocketCtor: /** @type {?} */ (w3cwebsocket)
        });
    }
    /**
     * Send an RPC request to the node
     * @template T
     * @param {?} payload The RPC request
     * @return {?}
     */
    post(payload) {
        this.socket$.next(payload);
        return this.response(payload.id);
    }
    /**
     * Subscribe to a SUB/PUB
     * @param {?} payload The RPC request
     * @return {?}
     */
    subscribe(payload) {
        this.socket$.next(payload);
        return this.response(payload.id).pipe(tap(res => { if (res.error)
            throw res.error; }), map(res => res.result), switchMap(result => {
            return this.observables[result] = this.subscription(result);
        }));
    }
    /**
     * @return {?}
     */
    unsubscribe() {
    }
}
WebsocketProvider.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
WebsocketProvider.ctorParameters = () => [];
/** @nocollapse */ WebsocketProvider.ngInjectableDef = defineInjectable({ factory: function WebsocketProvider_Factory() { return new WebsocketProvider(); }, token: WebsocketProvider, providedIn: ProvidersModule });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Account {
    /**
     * @param {?} provider
     */
    constructor(provider) {
        this.provider = provider;
        this.currentAccount = new BehaviorSubject(null);
        this.account$ = this.currentAccount.asObservable();
    }
    /**
     * Get the default account
     * @return {?}
     */
    get defaultAccount() {
        return this.currentAccount.getValue();
    }
    /**
     * Set the default account
     * @param {?} account
     * @return {?}
     */
    set defaultAccount(account) {
        this.currentAccount.next(toChecksumAddress(account));
    }
    /**
     * Get the list of accounts available on the node
     * @return {?}
     */
    getAccounts() {
        return this.provider.rpc('eth_accounts');
    }
    /**
     * Send a transaction to the node
     * @template T
     * @param {?} tx The transaction to pass to the node
     * @param {?=} blockTag The block to target
     * @return {?}
     */
    sendTransaction(tx, blockTag = 'latest') {
        return this.provider.rpc('eth_sendTransaction', [tx, blockTag]);
    }
    /**
     * @param {?} address
     * @param {?=} blockTag
     * @return {?}
     */
    getBalance(address, blockTag) {
        return this.provider.rpc('eth_getBalance', [address, blockTag || 'latest']);
    }
    /**
     * @param {?} address
     * @param {?=} blockTag
     * @return {?}
     */
    getTransactionCount(address, blockTag) {
        return this.provider.rpc('eth_getTransactionCount', [
            address,
            blockTag || 'latest'
        ]);
    }
    /**
     * @param {?} message
     * @param {?} address
     * @param {?} pwd
     * @return {?}
     */
    sign(message, address, pwd) {
        const /** @type {?} */ msg = utf8ToHex(message);
        const /** @type {?} */ method = this.provider.type === 'web3' ? 'personal_sign' : 'eth_sign';
        const /** @type {?} */ params = this.provider.type === 'web3' ? [address, msg, pwd] : [msg, address];
        return this.provider.rpc(method, params);
    }
}
Account.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
Account.ctorParameters = () => [
    { type: MainProvider, },
];
/** @nocollapse */ Account.ngInjectableDef = defineInjectable({ factory: function Account_Factory() { return new Account(inject(MainProvider)); }, token: Account, providedIn: ProvidersModule });

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
        class DecoratedProvider extends MainProvider {
            /**
             * @param {?} http
             * @param {?} ws
             */
            constructor(http, ws) {
                super();
                this.http = http;
                this.ws = ws;
                this.url = options.url || 'localhost:8545';
                const /** @type {?} */ protocol = new URL(this.url).protocol;
                const /** @type {?} */ isWS = protocol === 'ws:' || protocol === 'wss:';
                if (window && 'web3' in window) {
                    this.type = 'web3';
                    this.setWeb3Provider();
                }
                else if (isWS) {
                    this.type = 'ws';
                    this.setWsProvider();
                }
                else {
                    this.type = 'http';
                    this.setHttpProvider();
                }
            }
            /**
             * Connect to a web3 instance inside the page if any
             * @return {?}
             */
            setWeb3Provider() {
                this.web3Provider = window['web3'].currentProvider;
                this.sendAsync = (payload) => {
                    const /** @type {?} */ sendAsync = this.web3Provider.sendAsync.bind(this.web3Provider, payload);
                    return bindNodeCallback(sendAsync)();
                };
            }
            /**
             * Setup a Websocket connection with the node
             * @return {?}
             */
            setWsProvider() {
                this.ws.create(this.url);
                this.on = (payload) => {
                    this.rpcId++;
                    return this.ws.subscribe(payload);
                };
                this.sendAsync = (payload) => {
                    this.rpcId++;
                    return this.ws.post(payload);
                };
            }
            /**
             * Setup an HTTP connection with the node
             * @return {?}
             */
            setHttpProvider() {
                this.sendAsync = (payload) => {
                    this.rpcId++;
                    return this.http.post(this.url, payload);
                };
            }
        }
        DecoratedProvider.Auth = options.auth || Account;
        DecoratedProvider.decorators = [
            { type: Injectable, args: [{ providedIn: ProvidersModule },] },
        ];
        /** @nocollapse */
        DecoratedProvider.ctorParameters = () => [
            { type: HttpClient, },
            { type: WebsocketProvider, },
        ];
        return /** @type {?} */ (DecoratedProvider);
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ContractProvider {
    /**
     * @param {?} auth
     * @param {?} provider
     */
    constructor(auth, provider) {
        this.auth = auth;
        this.provider = provider;
        this.currentTx = new BehaviorSubject(null);
        this.tx$ = this.currentTx.asObservable();
        this.auth.account$
            .subscribe(from => this.defaultTx = Object.assign({}, this.defaultTx, { from }));
        this.id = this.provider.id;
    }
    /**
     * @return {?}
     */
    get defaultTx() {
        return this.currentTx.getValue();
    }
    /**
     * @param {?} transaction
     * @return {?}
     */
    set defaultTx(transaction) {
        const /** @type {?} */ tx = Object.assign({}, this.currentTx.getValue(), transaction);
        this.currentTx.next(tx);
    }
    /**
     * Make a call to the node
     * @template T
     * @param {?} to The address of the contract to contact
     * @param {?} data The data of the call as bytecode
     * @param {?=} blockTag The block to target
     * @return {?}
     */
    call(to, data, blockTag = 'latest') {
        return this.provider.rpc('eth_call', [{ to, data }, blockTag]);
    }
    /**
     * Send a transaction to the node
     * @template T
     * @param {?} transaction
     * @param {...?} rest
     * @return {?}
     */
    sendTransaction(transaction, ...rest) {
        const /** @type {?} */ tx = new TxObject(transaction);
        return this.auth.sendTransaction(tx, rest);
    }
    /**
     * Create a RPC request for a subscription
     * @param {?} address The address of the contract
     * @param {?} topics The signature of the event
     * @return {?}
     */
    event(address, topics) {
        return this.provider.rpcSub(['logs', { address, topics }]).pipe(map(logs => new TxLogs(logs)));
    }
    /**
     * Estimate the amount of gas needed for transaction
     * @param {?} transaction The transaction to estimate the gas from
     * @return {?}
     */
    estimateGas(transaction) {
        const /** @type {?} */ tx = new TxObject(transaction);
        return this.provider.rpc('eth_estimateGas', [tx]).pipe(map(gas => hexToNumber(gas.replace('0x', ''))));
    }
    /**
     * Returns the current price per gas in wei
     * @return {?}
     */
    gasPrice() {
        return this.provider.rpc('eth_gasPrice', []).pipe(map(price => hexToNumberString(price.replace('0x', ''))));
    }
}
ContractProvider.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
ContractProvider.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [AUTH,] },] },
    { type: MainProvider, },
];
/** @nocollapse */ ContractProvider.ngInjectableDef = defineInjectable({ factory: function ContractProvider_Factory() { return new ContractProvider(inject(AUTH), inject(MainProvider)); }, token: ContractProvider, providedIn: ProvidersModule });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Eth {
    /**
     * @param {?} provider
     */
    constructor(provider) {
        this.provider = provider;
    }
    /**
     * @return {?}
     */
    getBlockNumber() {
        return this.provider
            .rpc('eth_blockNumber')
            .pipe(map(block => toBN(block).toString(10)));
    }
    /**
     * @return {?}
     */
    getGasPrice() {
        return this.provider
            .rpc('eth_gasPrice')
            .pipe(map(block => toBN(block).toString(10)));
    }
    /**
     * ***
     * BLOCK
     * @param {?} blockNumber
     * @return {?}
     */
    getBlockByNumber(blockNumber) {
        const /** @type {?} */ isNumber = typeof blockNumber === 'number';
        const /** @type {?} */ params = isNumber ? numberToHex(blockNumber) : blockNumber;
        return this.provider
            .rpc('eth_getBlockByNumber', [params, true])
            .pipe(map(block => (block ? new Block(block) : null)));
    }
    /**
     * @param {?} blockHash
     * @return {?}
     */
    getBlockByHash(blockHash) {
        return this.provider
            .rpc('eth_getBlockByNumber', [blockHash, true])
            .pipe(map(block => (block ? new Block(block) : null)));
    }
    /**
     * **********
     * TRANSACTION
     * @param {?} transactionHash
     * @return {?}
     */
    getTransaction(transactionHash) {
        return this.provider
            .rpc('eth_getTransactionByHash', [transactionHash])
            .pipe(map(tx => (tx ? new Transaction(tx) : null)));
    }
    /**
     * @param {?} transactionHash
     * @return {?}
     */
    getTransactionReceipt(transactionHash) {
        return this.provider
            .rpc('eth_getTransactionReceipt', [transactionHash])
            .pipe(map(receipt => (receipt ? new TxReceipt(receipt) : null)));
    }
    /**
     * ************
     * SUBSCRIPTIONS
     * @return {?}
     */
    onNewBlock() {
        return this.provider.rpcSub(['newHeads']).pipe(map(res => new Block(res)));
    }
    /**
     * @return {?}
     */
    isSyncing() {
        return this.provider.rpcSub(['syncing']);
    }
}
Eth.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
Eth.ctorParameters = () => [
    { type: MainProvider, },
];
/** @nocollapse */ Eth.ngInjectableDef = defineInjectable({ factory: function Eth_Factory() { return new Eth(inject(MainProvider)); }, token: Eth, providedIn: ProvidersModule });

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdldGgtcHJvdmlkZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvcHJvdmlkZXIudHMiLCJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvcHJvdmlkZXJzLm1vZHVsZS50cyIsIm5nOi8vQG5nZXRoL3Byb3ZpZGVyL2xpYi9wcm92aWRlcnMvd3MtcHJvdmlkZXIudHMiLCJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvc3VicHJvdmlkZXJzL2FjY291bnQudHMiLCJuZzovL0BuZ2V0aC9wcm92aWRlci9saWIvcHJvdmlkZXIuZGVjb3JhdG9yLnRzIiwibmc6Ly9AbmdldGgvcHJvdmlkZXIvbGliL3N1YnByb3ZpZGVycy9jb250cmFjdC50cyIsIm5nOi8vQG5nZXRoL3Byb3ZpZGVyL2xpYi9zdWJwcm92aWRlcnMvZXRoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUlBDUmVxLCBSUENSZXMsIFJQQ1N1YiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG4vLyBAZHluYW1pY1xyXG5leHBvcnQgY2xhc3MgTWFpblByb3ZpZGVyIHtcclxuICBzdGF0aWMgQXV0aDogVHlwZTxhbnk+O1xyXG4gIHByb3RlY3RlZCBzZW5kQXN5bmM6IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDUmVzPFQ+PjtcclxuICBwcm90ZWN0ZWQgb246IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDU3ViPFQ+PjtcclxuICBwcm90ZWN0ZWQgcnBjSWQgPSAwO1xyXG4gIHByb3RlY3RlZCB3ZWIzUHJvdmlkZXI6IGFueTtcclxuICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6ICd3ZWIzJyB8ICdodHRwJyB8ICd3cyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgLyoqIEpTT04gUlBDIFJlcXVlc3QgKi9cclxuICBwcm90ZWN0ZWQgcmVxKG1ldGhvZDogc3RyaW5nLCBwYXJhbXM/OiBhbnlbXSk6IFJQQ1JlcSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBqc29ucnBjOiAnMi4wJyxcclxuICAgICAgaWQ6IHRoaXMucnBjSWQsXHJcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtcyB8fCBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKiBKU09OIFJQQyBSZXNwb25zZSAqL1xyXG4gIHByb3RlY3RlZCByZXM8VD4ocGF5bG9hZDogYW55LCByZXN1bHQ6IGFueSk6IFJQQ1JlczxUPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBqc29ucnBjOiBwYXlsb2FkLmpzb25ycGMsXHJcbiAgICAgIGlkOiBwYXlsb2FkLmlkLFxyXG4gICAgICByZXN1bHQ6IHJlc3VsdFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKiBHZXQgdGhlIGlkIG9mIHRoZSBwcm92aWRlciA6IHVzZSBvbmx5IGF0IGxhdW5jaCAqL1xyXG4gIHB1YmxpYyBmZXRjaElkKCk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICB0aGlzLnJwY0lkKys7XHJcbiAgICByZXR1cm4gdGhpcy5ycGM8bnVtYmVyPignbmV0X3ZlcnNpb24nKS50b1Byb21pc2U8bnVtYmVyPigpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBub2RlICovXHJcbiAgcHVibGljIHJwYzxUPihtZXRob2Q6IHN0cmluZywgcGFyYW1zPzogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlcShtZXRob2QsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5zZW5kQXN5bmM8VD4ocGF5bG9hZCkucGlwZShcclxuICAgICAgdGFwKGNvbnNvbGUubG9nKSxcclxuICAgICAgbWFwKHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKHJlcy5lcnJvcikgdGhyb3cgcmVzLmVycm9yO1xyXG4gICAgICAgIHJldHVybiByZXMucmVzdWx0O1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKiBTZW5kIGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QgdG8gdGhlIG5vZGUgKi9cclxuICBwdWJsaWMgcnBjU3ViPFQ+KHBhcmFtczogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlcSgnZXRoX3N1YnNjcmliZScsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5vbjxUPihwYXlsb2FkKS5waXBlKFxyXG4gICAgICBtYXAocmVzID0+ICByZXMucGFyYW1zLnJlc3VsdClcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7XHJcbiAgTmdNb2R1bGUsXHJcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcclxuICBJbmplY3Rpb25Ub2tlbixcclxuICBBUFBfSU5JVElBTElaRVJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IEFVVEggPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignYXV0aCcpO1xyXG5cclxuLy8gQGR5bmFtaWNcclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIFByb3ZpZGVyc01vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoUHJvdmlkZXI6IHR5cGVvZiBNYWluUHJvdmlkZXIpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBQcm92aWRlcnNNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHsgcHJvdmlkZTogTWFpblByb3ZpZGVyLCB1c2VFeGlzdGluZzogUHJvdmlkZXIgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXHJcbiAgICAgICAgICB1c2VGYWN0b3J5OiAocHJvdmlkZXI6IE1haW5Qcm92aWRlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gICgpID0+IHByb3ZpZGVyLmZldGNoSWQoKS50aGVuKGlkID0+IHByb3ZpZGVyLmlkID0gaWQpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgICAgICAgZGVwczogW01haW5Qcm92aWRlcl1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgcHJvdmlkZTogQVVUSCwgdXNlQ2xhc3M6IFByb3ZpZGVyLkF1dGggfSxcclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSUENSZXMsIFJQQ1N1YiwgUlBDUmVxIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlIH0gZnJvbSAnLi8uLi9wcm92aWRlcnMubW9kdWxlJztcclxuaW1wb3J0IHsgdzNjd2Vic29ja2V0IH0gZnJvbSAnd2Vic29ja2V0JztcclxuaW1wb3J0IHsgV2ViU29ja2V0U3ViamVjdCB9IGZyb20gJ3J4anMvd2ViU29ja2V0JztcclxuXHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgdGFwLCBzd2l0Y2hNYXAsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogUHJvdmlkZXJzTW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBXZWJzb2NrZXRQcm92aWRlciB7XHJcbiAgcHJpdmF0ZSBzb2NrZXQkOiBXZWJTb2NrZXRTdWJqZWN0PGFueT47XHJcbiAgcHVibGljIG9ic2VydmFibGVzOiBPYnNlcnZhYmxlPFJQQ1N1Yj5bXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrIGlmIGEgbWVzc2FnZSBpcyB0aGUgc3Vic2NyaXB0aW9uIHdlIHdhbnRcclxuICAgKiBAcGFyYW0gbXNnIFRoZSBtZXNzYWdlIHJldHVybmVkIGJ5IHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHN1YnNjcmlwdGlvbiBUaGUgc3Vic2NyaXB0aW9uIHRvIG1hcFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaXNTdWJzY3JpcHRpb24obXNnOiBhbnksIHN1YnNjcmlwdGlvbjogc3RyaW5nKTogbXNnIGlzIFJQQ1N1YiB7XHJcbiAgICByZXR1cm4gISFtc2cubWV0aG9kXHJcbiAgICAgICAgICAmJiBtc2cubWV0aG9kID09PSAnZXRoX3N1YnNjcmlwdGlvbidcclxuICAgICAgICAgICYmIG1zZy5wYXJhbXMuc3Vic2NyaXB0aW9uID09PSBzdWJzY3JpcHRpb247XHJcbiAgfVxyXG5cclxuICAvKiogUmV0dXJuIHRoZSByZXNwb25zZSBvZiBhbiBSUEMgUmVxdWVzdCAqL1xyXG4gIHByaXZhdGUgcmVzcG9uc2U8VD4oaWQ6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0JC5waXBlKFxyXG4gICAgICBmaWx0ZXIoKG1zZzogUlBDUmVzPFQ+KSA9PiBtc2cuaWQgPT09IGlkKSxcclxuICAgICAgZmlyc3QoKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN1YnNjcmliZSB0byB0aGUgbm9kZSBmb3IgYSBzcGVjaWZpYyBzdWJzY3JpcHRpb24gbmFtZVxyXG4gICAqIEBwYXJhbSBzdWJzY3JpcHRpb24gVGhlIHN1YnNjcmlwdGlvbiBuYW1lIHdlIHdhbnQgdG8gc3Vic2NyaWJlIHRvXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb248VD4oc3Vic2NyaXB0aW9uOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFJQQ1N1YjxUPj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0JC5waXBlKFxyXG4gICAgICBmaWx0ZXIobXNnID0+IHRoaXMuaXNTdWJzY3JpcHRpb24obXNnLCBzdWJzY3JpcHRpb24pKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgc29ja2V0IGJldHdlZW4gdGhlIGNsaWVudCBhbmQgdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gdXJsIFRoZSB1cmwgb2YgdGhlIG5vZGUgdG8gY29ubmVjdCB0b1xyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGUodXJsOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc29ja2V0JCA9IG5ldyBXZWJTb2NrZXRTdWJqZWN0KHtcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIFdlYlNvY2tldEN0b3I6IHczY3dlYnNvY2tldCBhcyBhbnlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhbiBSUEMgcmVxdWVzdCB0byB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBwYXlsb2FkIFRoZSBSUEMgcmVxdWVzdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwb3N0PFQgPSBhbnk+KHBheWxvYWQ6IFJQQ1JlcSk6IE9ic2VydmFibGU8UlBDUmVzPFQ+PiB7XHJcbiAgICB0aGlzLnNvY2tldCQubmV4dChwYXlsb2FkKTtcclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlPFQ+KHBheWxvYWQuaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3Vic2NyaWJlIHRvIGEgU1VCL1BVQlxyXG4gICAqIEBwYXJhbSBwYXlsb2FkIFRoZSBSUEMgcmVxdWVzdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdWJzY3JpYmUocGF5bG9hZDogUlBDUmVxKSB7XHJcbiAgICB0aGlzLnNvY2tldCQubmV4dChwYXlsb2FkKTtcclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlPHN0cmluZz4ocGF5bG9hZC5pZCkucGlwZShcclxuICAgICAgdGFwKHJlcyA9PiB7IGlmIChyZXMuZXJyb3IpIHRocm93IHJlcy5lcnJvcjsgfSksXHJcbiAgICAgIG1hcChyZXMgPT4gcmVzLnJlc3VsdCksXHJcbiAgICAgIHN3aXRjaE1hcChyZXN1bHQgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9ic2VydmFibGVzW3Jlc3VsdF0gPSB0aGlzLnN1YnNjcmlwdGlvbihyZXN1bHQpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE9cclxuICBwdWJsaWMgdW5zdWJzY3JpYmUoKSB7XHJcblxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFR4T2JqZWN0LCB1dGY4VG9IZXgsIEJsb2NrVGFnLCB0b0NoZWNrc3VtQWRkcmVzcyB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4vLi4vcHJvdmlkZXJzLm1vZHVsZSc7XHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4uL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgQXV0aCB9IGZyb20gJy4uL2F1dGgnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbiA6IFByb3ZpZGVyc01vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudCBpbXBsZW1lbnRzIEF1dGgge1xyXG4gIHByaXZhdGUgY3VycmVudEFjY291bnQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4obnVsbCk7XHJcbiAgcHVibGljIGFjY291bnQkID0gdGhpcy5jdXJyZW50QWNjb3VudC5hc09ic2VydmFibGUoKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm92aWRlcjogTWFpblByb3ZpZGVyKSB7fVxyXG5cclxuICAvKiogR2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBnZXQgZGVmYXVsdEFjY291bnQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRBY2NvdW50LmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogU2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBzZXQgZGVmYXVsdEFjY291bnQoYWNjb3VudDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRBY2NvdW50Lm5leHQodG9DaGVja3N1bUFkZHJlc3MoYWNjb3VudCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCB0aGUgbGlzdCBvZiBhY2NvdW50cyBhdmFpbGFibGUgb24gdGhlIG5vZGUgKi9cclxuICBwdWJsaWMgZ2V0QWNjb3VudHMoKTogT2JzZXJ2YWJsZTxzdHJpbmdbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZ1tdPignZXRoX2FjY291bnRzJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGEgdHJhbnNhY3Rpb24gdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHBhc3MgdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tUYWcgVGhlIGJsb2NrIHRvIHRhcmdldFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVHJhbnNhY3Rpb248VD4oXHJcbiAgICB0eDogVHhPYmplY3QsXHJcbiAgICBibG9ja1RhZzogQmxvY2tUYWcgPSAnbGF0ZXN0J1xyXG4gICk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPFQ+KCdldGhfc2VuZFRyYW5zYWN0aW9uJywgW3R4LCBibG9ja1RhZ10pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEJhbGFuY2UoYWRkcmVzczogc3RyaW5nLCBibG9ja1RhZz86IEJsb2NrVGFnIHwgbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX2dldEJhbGFuY2UnLCBbYWRkcmVzcywgYmxvY2tUYWcgfHwgJ2xhdGVzdCddKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRUcmFuc2FjdGlvbkNvdW50KGFkZHJlc3M6IHN0cmluZywgYmxvY2tUYWc/OiBCbG9ja1RhZyB8IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4oJ2V0aF9nZXRUcmFuc2FjdGlvbkNvdW50JywgW1xyXG4gICAgICBhZGRyZXNzLFxyXG4gICAgICBibG9ja1RhZyB8fCAnbGF0ZXN0J1xyXG4gICAgXSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2lnbihtZXNzYWdlOiBzdHJpbmcsIGFkZHJlc3M6IHN0cmluZywgIHB3ZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IG1zZyA9IHV0ZjhUb0hleChtZXNzYWdlKTtcclxuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMucHJvdmlkZXIudHlwZSA9PT0gJ3dlYjMnID8gJ3BlcnNvbmFsX3NpZ24nIDogJ2V0aF9zaWduJztcclxuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucHJvdmlkZXIudHlwZSA9PT0gJ3dlYjMnID8gW2FkZHJlc3MsIG1zZywgcHdkXSA6IFttc2csIGFkZHJlc3NdO1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4obWV0aG9kLCBwYXJhbXMpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBXZWJzb2NrZXRQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL3dzLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBiaW5kTm9kZUNhbGxiYWNrLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBSUENSZXMsIFJQQ1JlcSwgUlBDU3ViIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcic7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4vcHJvdmlkZXJzLm1vZHVsZSc7XHJcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICcuL3N1YnByb3ZpZGVycy9hY2NvdW50JztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gUHJvdmlkZXIob3B0aW9uczoge1xyXG4gIHVybDogc3RyaW5nO1xyXG4gIGF1dGg/OiBhbnk7XHJcbn0pIHtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKEJhc2U6IFR5cGU8TWFpblByb3ZpZGVyPikge1xyXG5cclxuICAgIEBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogUHJvdmlkZXJzTW9kdWxlIH0pXHJcbiAgICBjbGFzcyBEZWNvcmF0ZWRQcm92aWRlciBleHRlbmRzIE1haW5Qcm92aWRlciB7XHJcbiAgICAgIHB1YmxpYyBzdGF0aWMgQXV0aCA9IG9wdGlvbnMuYXV0aCB8fCBBY2NvdW50O1xyXG4gICAgICBwdWJsaWMgc2VuZEFzeW5jOiA8VD4ocGF5bG9hZDogUlBDUmVxKSA9PiBPYnNlcnZhYmxlPFJQQ1JlczxUPj47XHJcbiAgICAgIHB1YmxpYyBvbjogPFQ+KHBheWxvYWQ6IFJQQ1JlcSkgPT4gT2JzZXJ2YWJsZTxSUENTdWI8VD4+O1xyXG5cclxuICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHByaXZhdGUgd3M6IFdlYnNvY2tldFByb3ZpZGVyXHJcbiAgICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnbG9jYWxob3N0Ojg1NDUnO1xyXG4gICAgICAgIGNvbnN0IHByb3RvY29sID0gbmV3IFVSTCh0aGlzLnVybCkucHJvdG9jb2w7XHJcbiAgICAgICAgY29uc3QgaXNXUyA9IHByb3RvY29sID09PSAnd3M6JyB8fCBwcm90b2NvbCA9PT0gJ3dzczonO1xyXG5cclxuICAgICAgICBpZiAod2luZG93ICYmICd3ZWIzJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICAgIHRoaXMudHlwZSA9ICd3ZWIzJztcclxuICAgICAgICAgIHRoaXMuc2V0V2ViM1Byb3ZpZGVyKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc1dTKSB7XHJcbiAgICAgICAgICB0aGlzLnR5cGUgPSAnd3MnO1xyXG4gICAgICAgICAgdGhpcy5zZXRXc1Byb3ZpZGVyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudHlwZSA9ICdodHRwJztcclxuICAgICAgICAgIHRoaXMuc2V0SHR0cFByb3ZpZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqIENvbm5lY3QgdG8gYSB3ZWIzIGluc3RhbmNlIGluc2lkZSB0aGUgcGFnZSBpZiBhbnkgKi9cclxuICAgICAgcHJpdmF0ZSBzZXRXZWIzUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdGhpcy53ZWIzUHJvdmlkZXIgPSB3aW5kb3dbJ3dlYjMnXS5jdXJyZW50UHJvdmlkZXI7XHJcbiAgICAgICAgdGhpcy5zZW5kQXN5bmMgPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgY29uc3Qgc2VuZEFzeW5jID0gdGhpcy53ZWIzUHJvdmlkZXIuc2VuZEFzeW5jLmJpbmQodGhpcy53ZWIzUHJvdmlkZXIsIHBheWxvYWQpO1xyXG4gICAgICAgICAgcmV0dXJuIGJpbmROb2RlQ2FsbGJhY2s8YW55PihzZW5kQXN5bmMpKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiogU2V0dXAgYSBXZWJzb2NrZXQgY29ubmVjdGlvbiB3aXRoIHRoZSBub2RlICovXHJcbiAgICAgIHByaXZhdGUgc2V0V3NQcm92aWRlcigpIHtcclxuICAgICAgICB0aGlzLndzLmNyZWF0ZSh0aGlzLnVybCk7XHJcbiAgICAgICAgdGhpcy5vbiA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMud3Muc3Vic2NyaWJlKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbmRBc3luYyA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMud3MucG9zdChwYXlsb2FkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKiBTZXR1cCBhbiBIVFRQIGNvbm5lY3Rpb24gd2l0aCB0aGUgbm9kZSAqL1xyXG4gICAgICBwcml2YXRlIHNldEh0dHBQcm92aWRlcigpIHtcclxuICAgICAgICB0aGlzLnNlbmRBc3luYyA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PFJQQ1Jlczxhbnk+Pih0aGlzLnVybCwgcGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gRGVjb3JhdGVkUHJvdmlkZXIgYXMgYW55O1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJsb2NrVGFnLCBUeExvZ3MsIElUeE9iamVjdCwgVHhPYmplY3QsIGhleFRvTnVtYmVyLCBoZXhUb051bWJlclN0cmluZyB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSwgQVVUSCB9IGZyb20gJy4uL3Byb3ZpZGVycy5tb2R1bGUnO1xyXG5pbXBvcnQgeyBBdXRoIH0gZnJvbSAnLi8uLi9hdXRoJztcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi8uLi9wcm92aWRlcic7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW4gOiBQcm92aWRlcnNNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIENvbnRyYWN0UHJvdmlkZXIge1xyXG4gIHByaXZhdGUgY3VycmVudFR4ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQYXJ0aWFsPElUeE9iamVjdD4+KG51bGwpO1xyXG4gIHB1YmxpYyB0eCQgPSB0aGlzLmN1cnJlbnRUeC5hc09ic2VydmFibGUoKTtcclxuICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoQEluamVjdChBVVRIKSBwcml2YXRlIGF1dGg6IEF1dGgsIHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcikge1xyXG4gICAgdGhpcy5hdXRoLmFjY291bnQkXHJcbiAgICAgICAgLnN1YnNjcmliZShmcm9tID0+IHRoaXMuZGVmYXVsdFR4ID0geyAuLi50aGlzLmRlZmF1bHRUeCwgZnJvbSB9KTtcclxuICAgIHRoaXMuaWQgPSB0aGlzLnByb3ZpZGVyLmlkO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRlZmF1bHRUeCgpOiBQYXJ0aWFsPElUeE9iamVjdD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFR4LmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICBzZXQgZGVmYXVsdFR4KHRyYW5zYWN0aW9uOiBQYXJ0aWFsPElUeE9iamVjdD4pIHtcclxuICAgIGNvbnN0IHR4ID0gey4uLnRoaXMuY3VycmVudFR4LmdldFZhbHVlKCksIC4uLnRyYW5zYWN0aW9uIH07XHJcbiAgICB0aGlzLmN1cnJlbnRUeC5uZXh0KHR4KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2UgYSBjYWxsIHRvIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHRvIFRoZSBhZGRyZXNzIG9mIHRoZSBjb250cmFjdCB0byBjb250YWN0XHJcbiAgICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgb2YgdGhlIGNhbGwgYXMgYnl0ZWNvZGVcclxuICAgKiBAcGFyYW0gYmxvY2tUYWcgVGhlIGJsb2NrIHRvIHRhcmdldFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjYWxsPFQ+KFxyXG4gICAgdG86IHN0cmluZyxcclxuICAgIGRhdGE6IHN0cmluZyxcclxuICAgIGJsb2NrVGFnOiBCbG9ja1RhZyA9ICdsYXRlc3QnXHJcbiAgKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8VD4oJ2V0aF9jYWxsJywgW3sgdG8sIGRhdGEgfSwgYmxvY2tUYWddKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgYSB0cmFuc2FjdGlvbiB0byB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSB0eCBUaGUgdHJhbnNhY3Rpb24gdG8gcGFzcyB0byB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBibG9ja1RhZyBUaGUgYmxvY2sgdG8gdGFyZ2V0XHJcbiAgICovXHJcbiAgcHVibGljIHNlbmRUcmFuc2FjdGlvbjxUPihcclxuICAgIHRyYW5zYWN0aW9uOiBQYXJ0aWFsPElUeE9iamVjdD4sXHJcbiAgICAuLi5yZXN0OiBhbnlbXVxyXG4gICk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgY29uc3QgdHggPSBuZXcgVHhPYmplY3QodHJhbnNhY3Rpb24pO1xyXG4gICAgcmV0dXJuIHRoaXMuYXV0aC5zZW5kVHJhbnNhY3Rpb24odHgsIHJlc3QpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIFJQQyByZXF1ZXN0IGZvciBhIHN1YnNjcmlwdGlvblxyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIG9mIHRoZSBjb250cmFjdFxyXG4gICAqIEBwYXJhbSB0b3BpY3MgVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnRcclxuICAgKi9cclxuICBwdWJsaWMgZXZlbnQoXHJcbiAgICBhZGRyZXNzOiBzdHJpbmcsXHJcbiAgICB0b3BpY3M6IHN0cmluZ1tdXHJcbiAgKTogT2JzZXJ2YWJsZTxUeExvZ3M+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwY1N1YjxUeExvZ3M+KFsnbG9ncycsIHthZGRyZXNzLCB0b3BpY3N9XSkucGlwZShcclxuICAgICAgbWFwKGxvZ3MgPT4gbmV3IFR4TG9ncyhsb2dzKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFc3RpbWF0ZSB0aGUgYW1vdW50IG9mIGdhcyBuZWVkZWQgZm9yIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHRyYW5zYWN0aW9uIFRoZSB0cmFuc2FjdGlvbiB0byBlc3RpbWF0ZSB0aGUgZ2FzIGZyb21cclxuICAgKi9cclxuICBwdWJsaWMgZXN0aW1hdGVHYXModHJhbnNhY3Rpb246IFBhcnRpYWw8SVR4T2JqZWN0Pik6IE9ic2VydmFibGU8bnVtYmVyPiB7XHJcbiAgICBjb25zdCB0eCA9IG5ldyBUeE9iamVjdCh0cmFuc2FjdGlvbik7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX2VzdGltYXRlR2FzJywgW3R4XSkucGlwZShcclxuICAgICAgbWFwKGdhcyA9PiBoZXhUb051bWJlcihnYXMucmVwbGFjZSgnMHgnLCAnJykpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgcHJpY2UgcGVyIGdhcyBpbiB3ZWlcclxuICAgKi9cclxuICBwdWJsaWMgZ2FzUHJpY2UoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwYzxzdHJpbmc+KCdldGhfZ2FzUHJpY2UnLCBbXSkucGlwZShcclxuICAgICAgbWFwKHByaWNlID0+IGhleFRvTnVtYmVyU3RyaW5nKHByaWNlLnJlcGxhY2UoJzB4JywgJycpKSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgbnVtYmVyVG9IZXgsIEJsb2NrLCBUcmFuc2FjdGlvbiwgVHhSZWNlaXB0LCB0b0JOIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlIH0gZnJvbSAnLi4vcHJvdmlkZXJzLm1vZHVsZSdcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi4vcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW4gOiBQcm92aWRlcnNNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEV0aCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcikge31cclxuXHJcbiAgcHVibGljIGdldEJsb2NrTnVtYmVyKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPHN0cmluZz4oJ2V0aF9ibG9ja051bWJlcicpXHJcbiAgICAgIC5waXBlKG1hcChibG9jayA9PiB0b0JOKGJsb2NrKS50b1N0cmluZygxMCkpKTs7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0R2FzUHJpY2UoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8bnVtYmVyPignZXRoX2dhc1ByaWNlJylcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IHRvQk4oYmxvY2spLnRvU3RyaW5nKDEwKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKlxyXG4gICAqIEJMT0NLXHJcbiAgICovXHJcbiAgcHVibGljIGdldEJsb2NrQnlOdW1iZXIoYmxvY2tOdW1iZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgY29uc3QgaXNOdW1iZXIgPSB0eXBlb2YgYmxvY2tOdW1iZXIgPT09ICdudW1iZXInO1xyXG4gICAgY29uc3QgcGFyYW1zID0gaXNOdW1iZXIgPyBudW1iZXJUb0hleChibG9ja051bWJlcikgOiBibG9ja051bWJlcjtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8YW55PignZXRoX2dldEJsb2NrQnlOdW1iZXInLCBbcGFyYW1zLCB0cnVlXSlcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IChibG9jayA/IG5ldyBCbG9jayhibG9jaykgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEJsb2NrQnlIYXNoKGJsb2NrSGFzaDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8YW55PignZXRoX2dldEJsb2NrQnlOdW1iZXInLCBbYmxvY2tIYXNoLCB0cnVlXSlcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IChibG9jayA/IG5ldyBCbG9jayhibG9jaykgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKipcclxuICAgKiBUUkFOU0FDVElPTlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRUcmFuc2FjdGlvbih0cmFuc2FjdGlvbkhhc2g6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPG51bWJlcj4oJ2V0aF9nZXRUcmFuc2FjdGlvbkJ5SGFzaCcsIFt0cmFuc2FjdGlvbkhhc2hdKVxyXG4gICAgICAucGlwZShtYXAodHggPT4gKHR4ID8gbmV3IFRyYW5zYWN0aW9uKHR4KSA6IG51bGwpKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0VHJhbnNhY3Rpb25SZWNlaXB0KHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8bnVtYmVyPignZXRoX2dldFRyYW5zYWN0aW9uUmVjZWlwdCcsIFt0cmFuc2FjdGlvbkhhc2hdKVxyXG4gICAgICAucGlwZShtYXAocmVjZWlwdCA9PiAocmVjZWlwdCA/IG5ldyBUeFJlY2VpcHQocmVjZWlwdCkgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKlxyXG4gICAqIFNVQlNDUklQVElPTlNcclxuICAgKi9cclxuICBwdWJsaWMgb25OZXdCbG9jaygpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwY1N1YihbJ25ld0hlYWRzJ10pLnBpcGUoXHJcbiAgICAgIG1hcChyZXMgPT4gbmV3IEJsb2NrKHJlcykpXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNTeW5jaW5nKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjU3ViKFsnc3luY2luZyddKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBO0lBYUU7cUJBTmtCLENBQUM7S0FNSDs7Ozs7OztJQUdOLEdBQUcsQ0FBQyxNQUFjLEVBQUUsTUFBYztRQUMxQyxPQUFPO1lBQ0wsT0FBTyxFQUFFLEtBQUs7WUFDZCxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNLElBQUksRUFBRTtTQUNyQixDQUFDO0tBQ0g7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