/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { tap, map } from 'rxjs/operators';
export class MainProvider {
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
function MainProvider_tsickle_Closure_declarations() {
    /** @type {?} */
    MainProvider.Auth;
    /** @type {?} */
    MainProvider.prototype.sendAsync;
    /** @type {?} */
    MainProvider.prototype.on;
    /** @type {?} */
    MainProvider.prototype.rpcId;
    /** @type {?} */
    MainProvider.prototype.web3Provider;
    /** @type {?} */
    MainProvider.prototype.url;
    /** @type {?} */
    MainProvider.prototype.id;
    /** @type {?} */
    MainProvider.prototype.type;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvcHJvdmlkZXIvIiwic291cmNlcyI6WyJsaWIvcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUdBLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHMUMsTUFBTTtJQVVKO3FCQU5rQixDQUFDO0tBTUg7Ozs7Ozs7SUFHTixHQUFHLENBQUMsTUFBYyxFQUFFLE1BQWM7UUFDMUMsTUFBTSxDQUFDO1lBQ0wsT0FBTyxFQUFFLEtBQUs7WUFDZCxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNLElBQUksRUFBRTtTQUNyQixDQUFDO0tBQ0g7Ozs7Ozs7O0lBR1MsR0FBRyxDQUFJLE9BQVksRUFBRSxNQUFXO1FBQ3hDLE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN4QixFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDZCxNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUM7S0FDSDs7Ozs7SUFHTSxPQUFPO1FBQ1osSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVMsYUFBYSxDQUFDLENBQUMsU0FBUyxFQUFVLENBQUM7Ozs7Ozs7OztJQUl0RCxHQUFHLENBQUksTUFBYyxFQUFFLE1BQWM7UUFDMUMsdUJBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDcEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1IsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7U0FDbkIsQ0FBQyxDQUNILENBQUM7Ozs7Ozs7O0lBSUcsTUFBTSxDQUFJLE1BQWE7UUFDNUIsdUJBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDN0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDL0IsQ0FBQzs7Q0FFTCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUlBDUmVxLCBSUENSZXMsIFJQQ1N1YiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG4vLyBAZHluYW1pY1xyXG5leHBvcnQgY2xhc3MgTWFpblByb3ZpZGVyIHtcclxuICBzdGF0aWMgQXV0aDogVHlwZTxhbnk+O1xyXG4gIHByb3RlY3RlZCBzZW5kQXN5bmM6IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDUmVzPFQ+PjtcclxuICBwcm90ZWN0ZWQgb246IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDU3ViPFQ+PjtcclxuICBwcm90ZWN0ZWQgcnBjSWQgPSAwO1xyXG4gIHByb3RlY3RlZCB3ZWIzUHJvdmlkZXI6IGFueTtcclxuICBwdWJsaWMgdXJsOiBzdHJpbmc7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgcHVibGljIHR5cGU6ICd3ZWIzJyB8ICdodHRwJyB8ICd3cyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgLyoqIEpTT04gUlBDIFJlcXVlc3QgKi9cclxuICBwcm90ZWN0ZWQgcmVxKG1ldGhvZDogc3RyaW5nLCBwYXJhbXM/OiBhbnlbXSk6IFJQQ1JlcSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBqc29ucnBjOiAnMi4wJyxcclxuICAgICAgaWQ6IHRoaXMucnBjSWQsXHJcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICBwYXJhbXM6IHBhcmFtcyB8fCBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKiBKU09OIFJQQyBSZXNwb25zZSAqL1xyXG4gIHByb3RlY3RlZCByZXM8VD4ocGF5bG9hZDogYW55LCByZXN1bHQ6IGFueSk6IFJQQ1JlczxUPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBqc29ucnBjOiBwYXlsb2FkLmpzb25ycGMsXHJcbiAgICAgIGlkOiBwYXlsb2FkLmlkLFxyXG4gICAgICByZXN1bHQ6IHJlc3VsdFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKiBHZXQgdGhlIGlkIG9mIHRoZSBwcm92aWRlciA6IHVzZSBvbmx5IGF0IGxhdW5jaCAqL1xyXG4gIHB1YmxpYyBmZXRjaElkKCk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICB0aGlzLnJwY0lkKys7XHJcbiAgICByZXR1cm4gdGhpcy5ycGM8bnVtYmVyPignbmV0X3ZlcnNpb24nKS50b1Byb21pc2U8bnVtYmVyPigpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBub2RlICovXHJcbiAgcHVibGljIHJwYzxUPihtZXRob2Q6IHN0cmluZywgcGFyYW1zPzogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlcShtZXRob2QsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5zZW5kQXN5bmM8VD4ocGF5bG9hZCkucGlwZShcclxuICAgICAgdGFwKGNvbnNvbGUubG9nKSxcclxuICAgICAgbWFwKHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKHJlcy5lcnJvcikgdGhyb3cgcmVzLmVycm9yO1xyXG4gICAgICAgIHJldHVybiByZXMucmVzdWx0O1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKiBTZW5kIGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QgdG8gdGhlIG5vZGUgKi9cclxuICBwdWJsaWMgcnBjU3ViPFQ+KHBhcmFtczogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlcSgnZXRoX3N1YnNjcmliZScsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5vbjxUPihwYXlsb2FkKS5waXBlKFxyXG4gICAgICBtYXAocmVzID0+ICByZXMucGFyYW1zLnJlc3VsdClcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==