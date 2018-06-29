/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { tap, map } from 'rxjs/operators';
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
export { MainProvider };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvcHJvdmlkZXIvIiwic291cmNlcyI6WyJsaWIvcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUdBLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHMUMsSUFBQTtJQVVFO3FCQU5rQixDQUFDO0tBTUg7SUFFaEIsdUJBQXVCOzs7Ozs7O0lBQ2IsMEJBQUc7Ozs7OztJQUFiLFVBQWMsTUFBYyxFQUFFLE1BQWM7UUFDMUMsTUFBTSxDQUFDO1lBQ0wsT0FBTyxFQUFFLEtBQUs7WUFDZCxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNLElBQUksRUFBRTtTQUNyQixDQUFDO0tBQ0g7SUFFRCx3QkFBd0I7Ozs7Ozs7O0lBQ2QsMEJBQUc7Ozs7Ozs7SUFBYixVQUFpQixPQUFZLEVBQUUsTUFBVztRQUN4QyxNQUFNLENBQUM7WUFDTCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDeEIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ2QsTUFBTSxFQUFFLE1BQU07U0FDZixDQUFDO0tBQ0g7Ozs7O0lBR00sOEJBQU87Ozs7O1FBQ1osSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVMsYUFBYSxDQUFDLENBQUMsU0FBUyxFQUFVLENBQUM7Ozs7Ozs7OztJQUl0RCwwQkFBRzs7Ozs7OztjQUFJLE1BQWMsRUFBRSxNQUFjO1FBQzFDLHFCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQ3BDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQ2hCLEdBQUcsQ0FBQyxVQUFBLEdBQUc7WUFDTCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQztZQUMvQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztTQUNuQixDQUFDLENBQ0gsQ0FBQzs7Ozs7Ozs7SUFJRyw2QkFBTTs7Ozs7O2NBQUksTUFBYTtRQUM1QixxQkFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUM3QixHQUFHLENBQUMsVUFBQSxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBakIsQ0FBaUIsQ0FBQyxDQUMvQixDQUFDOzt1QkE1RE47SUE4REMsQ0FBQTtBQXhERCx3QkF3REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJQQ1JlcSwgUlBDUmVzLCBSUENTdWIgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRhcCwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuLy8gQGR5bmFtaWNcclxuZXhwb3J0IGNsYXNzIE1haW5Qcm92aWRlciB7XHJcbiAgc3RhdGljIEF1dGg6IFR5cGU8YW55PjtcclxuICBwcm90ZWN0ZWQgc2VuZEFzeW5jOiA8VD4ocGF5bG9hZDogUlBDUmVxKSA9PiBPYnNlcnZhYmxlPFJQQ1JlczxUPj47XHJcbiAgcHJvdGVjdGVkIG9uOiA8VD4ocGF5bG9hZDogUlBDUmVxKSA9PiBPYnNlcnZhYmxlPFJQQ1N1YjxUPj47XHJcbiAgcHJvdGVjdGVkIHJwY0lkID0gMDtcclxuICBwcm90ZWN0ZWQgd2ViM1Byb3ZpZGVyOiBhbnk7XHJcbiAgcHVibGljIHVybDogc3RyaW5nO1xyXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eXBlOiAnd2ViMycgfCAnaHR0cCcgfCAnd3MnO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIC8qKiBKU09OIFJQQyBSZXF1ZXN0ICovXHJcbiAgcHJvdGVjdGVkIHJlcShtZXRob2Q6IHN0cmluZywgcGFyYW1zPzogYW55W10pOiBSUENSZXEge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAganNvbnJwYzogJzIuMCcsXHJcbiAgICAgIGlkOiB0aGlzLnJwY0lkLFxyXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgcGFyYW1zOiBwYXJhbXMgfHwgW11cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKiogSlNPTiBSUEMgUmVzcG9uc2UgKi9cclxuICBwcm90ZWN0ZWQgcmVzPFQ+KHBheWxvYWQ6IGFueSwgcmVzdWx0OiBhbnkpOiBSUENSZXM8VD4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAganNvbnJwYzogcGF5bG9hZC5qc29ucnBjLFxyXG4gICAgICBpZDogcGF5bG9hZC5pZCxcclxuICAgICAgcmVzdWx0OiByZXN1bHRcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKiogR2V0IHRoZSBpZCBvZiB0aGUgcHJvdmlkZXIgOiB1c2Ugb25seSBhdCBsYXVuY2ggKi9cclxuICBwdWJsaWMgZmV0Y2hJZCgpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgdGhpcy5ycGNJZCsrO1xyXG4gICAgcmV0dXJuIHRoaXMucnBjPG51bWJlcj4oJ25ldF92ZXJzaW9uJykudG9Qcm9taXNlPG51bWJlcj4oKTtcclxuICB9XHJcblxyXG4gIC8qKiBTZW5kIGEgcmVxdWVzdCB0byB0aGUgbm9kZSAqL1xyXG4gIHB1YmxpYyBycGM8VD4obWV0aG9kOiBzdHJpbmcsIHBhcmFtcz86IGFueVtdKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5yZXEobWV0aG9kLCBwYXJhbXMpO1xyXG4gICAgcmV0dXJuIHRoaXMuc2VuZEFzeW5jPFQ+KHBheWxvYWQpLnBpcGUoXHJcbiAgICAgIHRhcChjb25zb2xlLmxvZyksXHJcbiAgICAgIG1hcChyZXMgPT4ge1xyXG4gICAgICAgIGlmIChyZXMuZXJyb3IpIHRocm93IHJlcy5lcnJvcjtcclxuICAgICAgICByZXR1cm4gcmVzLnJlc3VsdDtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKiogU2VuZCBhIHN1YnNjcmlwdGlvbiByZXF1ZXN0IHRvIHRoZSBub2RlICovXHJcbiAgcHVibGljIHJwY1N1YjxUPihwYXJhbXM6IGFueVtdKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5yZXEoJ2V0aF9zdWJzY3JpYmUnLCBwYXJhbXMpO1xyXG4gICAgcmV0dXJuIHRoaXMub248VD4ocGF5bG9hZCkucGlwZShcclxuICAgICAgbWFwKHJlcyA9PiAgcmVzLnBhcmFtcy5yZXN1bHQpXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=