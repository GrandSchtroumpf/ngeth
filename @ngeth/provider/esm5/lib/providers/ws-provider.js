/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { ProvidersModule } from './../providers.module';
import { w3cwebsocket } from 'websocket';
import { WebSocketSubject } from 'rxjs/webSocket';
import { filter, first, tap, switchMap, map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../providers.module";
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
    /** @nocollapse */ WebsocketProvider.ngInjectableDef = i0.defineInjectable({ factory: function WebsocketProvider_Factory() { return new WebsocketProvider(); }, token: WebsocketProvider, providedIn: i1.ProvidersModule });
    return WebsocketProvider;
}());
export { WebsocketProvider };
function WebsocketProvider_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    WebsocketProvider.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    WebsocketProvider.ctorParameters;
    /** @type {?} */
    WebsocketProvider.prototype.socket$;
    /** @type {?} */
    WebsocketProvider.prototype.observables;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3MtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvcHJvdmlkZXIvIiwic291cmNlcyI6WyJsaWIvcHJvdmlkZXJzL3dzLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR2xELE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7SUFPbEU7MkJBRjJDLEVBQUU7S0FFN0I7Ozs7Ozs7SUFPUiwwQ0FBYzs7Ozs7O2NBQUMsR0FBUSxFQUFFLFlBQW9CO1FBQ25ELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07ZUFDVixHQUFHLENBQUMsTUFBTSxLQUFLLGtCQUFrQjtlQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksS0FBSyxZQUFZLENBQUM7Ozs7Ozs7O0lBSTVDLG9DQUFROzs7Ozs7Y0FBSSxFQUFVO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDdEIsTUFBTSxDQUFDLFVBQUMsR0FBYyxJQUFLLE9BQUEsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQWIsQ0FBYSxDQUFDLEVBQ3pDLEtBQUssRUFBRSxDQUNSLENBQUM7Ozs7Ozs7O0lBT0ksd0NBQVk7Ozs7OztjQUFJLFlBQW9COztRQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ3RCLE1BQU0sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQ3RELENBQUE7Ozs7Ozs7SUFPSSxrQ0FBTTs7Ozs7Y0FBQyxHQUFXO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQztZQUNsQyxHQUFHLEVBQUUsR0FBRztZQUNSLGFBQWEsb0JBQUUsWUFBbUIsQ0FBQTtTQUNuQyxDQUFDLENBQUM7Ozs7Ozs7O0lBT0UsZ0NBQUk7Ozs7OztjQUFVLE9BQWU7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7O0lBTy9CLHFDQUFTOzs7OztjQUFDLE9BQWU7O1FBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFTLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQzNDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUMvQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsTUFBTSxFQUFWLENBQVUsQ0FBQyxFQUN0QixTQUFTLENBQUMsVUFBQSxNQUFNO1lBQ2QsTUFBTSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3RCxDQUFDLENBQ0gsQ0FBQzs7Ozs7SUFJRyx1Q0FBVzs7Ozs7O2dCQXhFbkIsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRTs7Ozs7NEJBVDNDOztTQVVhLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUlBDUmVzLCBSUENTdWIsIFJQQ1JlcSB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4vLi4vcHJvdmlkZXJzLm1vZHVsZSc7XHJcbmltcG9ydCB7IHczY3dlYnNvY2tldCB9IGZyb20gJ3dlYnNvY2tldCc7XHJcbmltcG9ydCB7IFdlYlNvY2tldFN1YmplY3QgfSBmcm9tICdyeGpzL3dlYlNvY2tldCc7XHJcblxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpbHRlciwgZmlyc3QsIHRhcCwgc3dpdGNoTWFwLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IFByb3ZpZGVyc01vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgV2Vic29ja2V0UHJvdmlkZXIge1xyXG4gIHByaXZhdGUgc29ja2V0JDogV2ViU29ja2V0U3ViamVjdDxhbnk+O1xyXG4gIHB1YmxpYyBvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxSUENTdWI+W10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBhIG1lc3NhZ2UgaXMgdGhlIHN1YnNjcmlwdGlvbiB3ZSB3YW50XHJcbiAgICogQHBhcmFtIG1zZyBUaGUgbWVzc2FnZSByZXR1cm5lZCBieSB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBzdWJzY3JpcHRpb24gVGhlIHN1YnNjcmlwdGlvbiB0byBtYXBcclxuICAgKi9cclxuICBwcml2YXRlIGlzU3Vic2NyaXB0aW9uKG1zZzogYW55LCBzdWJzY3JpcHRpb246IHN0cmluZyk6IG1zZyBpcyBSUENTdWIge1xyXG4gICAgcmV0dXJuICEhbXNnLm1ldGhvZFxyXG4gICAgICAgICAgJiYgbXNnLm1ldGhvZCA9PT0gJ2V0aF9zdWJzY3JpcHRpb24nXHJcbiAgICAgICAgICAmJiBtc2cucGFyYW1zLnN1YnNjcmlwdGlvbiA9PT0gc3Vic2NyaXB0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqIFJldHVybiB0aGUgcmVzcG9uc2Ugb2YgYW4gUlBDIFJlcXVlc3QgKi9cclxuICBwcml2YXRlIHJlc3BvbnNlPFQ+KGlkOiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLnNvY2tldCQucGlwZShcclxuICAgICAgZmlsdGVyKChtc2c6IFJQQ1JlczxUPikgPT4gbXNnLmlkID09PSBpZCksXHJcbiAgICAgIGZpcnN0KClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdWJzY3JpYmUgdG8gdGhlIG5vZGUgZm9yIGEgc3BlY2lmaWMgc3Vic2NyaXB0aW9uIG5hbWVcclxuICAgKiBAcGFyYW0gc3Vic2NyaXB0aW9uIFRoZSBzdWJzY3JpcHRpb24gbmFtZSB3ZSB3YW50IHRvIHN1YnNjcmliZSB0b1xyXG4gICAqL1xyXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uPFQ+KHN1YnNjcmlwdGlvbjogc3RyaW5nKTogT2JzZXJ2YWJsZTxSUENTdWI8VD4+IHtcclxuICAgIHJldHVybiB0aGlzLnNvY2tldCQucGlwZShcclxuICAgICAgZmlsdGVyKG1zZyA9PiB0aGlzLmlzU3Vic2NyaXB0aW9uKG1zZywgc3Vic2NyaXB0aW9uKSlcclxuICAgIClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIHNvY2tldCBiZXR3ZWVuIHRoZSBjbGllbnQgYW5kIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHVybCBUaGUgdXJsIG9mIHRoZSBub2RlIHRvIGNvbm5lY3QgdG9cclxuICAgKi9cclxuICBwdWJsaWMgY3JlYXRlKHVybDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNvY2tldCQgPSBuZXcgV2ViU29ja2V0U3ViamVjdCh7XHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBXZWJTb2NrZXRDdG9yOiB3M2N3ZWJzb2NrZXQgYXMgYW55XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgYW4gUlBDIHJlcXVlc3QgdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gcGF5bG9hZCBUaGUgUlBDIHJlcXVlc3RcclxuICAgKi9cclxuICBwdWJsaWMgcG9zdDxUID0gYW55PihwYXlsb2FkOiBSUENSZXEpOiBPYnNlcnZhYmxlPFJQQ1JlczxUPj4ge1xyXG4gICAgdGhpcy5zb2NrZXQkLm5leHQocGF5bG9hZCk7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZTxUPihwYXlsb2FkLmlkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN1YnNjcmliZSB0byBhIFNVQi9QVUJcclxuICAgKiBAcGFyYW0gcGF5bG9hZCBUaGUgUlBDIHJlcXVlc3RcclxuICAgKi9cclxuICBwdWJsaWMgc3Vic2NyaWJlKHBheWxvYWQ6IFJQQ1JlcSkge1xyXG4gICAgdGhpcy5zb2NrZXQkLm5leHQocGF5bG9hZCk7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZTxzdHJpbmc+KHBheWxvYWQuaWQpLnBpcGUoXHJcbiAgICAgIHRhcChyZXMgPT4geyBpZiAocmVzLmVycm9yKSB0aHJvdyByZXMuZXJyb3I7IH0pLFxyXG4gICAgICBtYXAocmVzID0+IHJlcy5yZXN1bHQpLFxyXG4gICAgICBzd2l0Y2hNYXAocmVzdWx0ID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZhYmxlc1tyZXN1bHRdID0gdGhpcy5zdWJzY3JpcHRpb24ocmVzdWx0KTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPXHJcbiAgcHVibGljIHVuc3Vic2NyaWJlKCkge1xyXG5cclxuICB9XHJcbn1cclxuIl19