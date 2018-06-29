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
export class WebsocketProvider {
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
/** @nocollapse */ WebsocketProvider.ngInjectableDef = i0.defineInjectable({ factory: function WebsocketProvider_Factory() { return new WebsocketProvider(); }, token: WebsocketProvider, providedIn: i1.ProvidersModule });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3MtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvcHJvdmlkZXIvIiwic291cmNlcyI6WyJsaWIvcHJvdmlkZXJzL3dzLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR2xELE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQUdwRSxNQUFNO0lBSUo7MkJBRjJDLEVBQUU7S0FFN0I7Ozs7Ozs7SUFPUixjQUFjLENBQUMsR0FBUSxFQUFFLFlBQW9CO1FBQ25ELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07ZUFDVixHQUFHLENBQUMsTUFBTSxLQUFLLGtCQUFrQjtlQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksS0FBSyxZQUFZLENBQUM7Ozs7Ozs7O0lBSTVDLFFBQVEsQ0FBSSxFQUFVO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDdEIsTUFBTSxDQUFDLENBQUMsR0FBYyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUN6QyxLQUFLLEVBQUUsQ0FDUixDQUFDOzs7Ozs7OztJQU9JLFlBQVksQ0FBSSxZQUFvQjtRQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQ3RELENBQUE7Ozs7Ozs7SUFPSSxNQUFNLENBQUMsR0FBVztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZ0JBQWdCLENBQUM7WUFDbEMsR0FBRyxFQUFFLEdBQUc7WUFDUixhQUFhLG9CQUFFLFlBQW1CLENBQUE7U0FDbkMsQ0FBQyxDQUFDOzs7Ozs7OztJQU9FLElBQUksQ0FBVSxPQUFlO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7Ozs7OztJQU8vQixTQUFTLENBQUMsT0FBZTtRQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBUyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUMzQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUMvQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQ3RCLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzdELENBQUMsQ0FDSCxDQUFDOzs7OztJQUlHLFdBQVc7Ozs7WUF4RW5CLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJQQ1JlcywgUlBDU3ViLCBSUENSZXEgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBQcm92aWRlcnNNb2R1bGUgfSBmcm9tICcuLy4uL3Byb3ZpZGVycy5tb2R1bGUnO1xyXG5pbXBvcnQgeyB3M2N3ZWJzb2NrZXQgfSBmcm9tICd3ZWJzb2NrZXQnO1xyXG5pbXBvcnQgeyBXZWJTb2NrZXRTdWJqZWN0IH0gZnJvbSAncnhqcy93ZWJTb2NrZXQnO1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBmaWx0ZXIsIGZpcnN0LCB0YXAsIHN3aXRjaE1hcCwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBQcm92aWRlcnNNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIFdlYnNvY2tldFByb3ZpZGVyIHtcclxuICBwcml2YXRlIHNvY2tldCQ6IFdlYlNvY2tldFN1YmplY3Q8YW55PjtcclxuICBwdWJsaWMgb2JzZXJ2YWJsZXM6IE9ic2VydmFibGU8UlBDU3ViPltdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgYSBtZXNzYWdlIGlzIHRoZSBzdWJzY3JpcHRpb24gd2Ugd2FudFxyXG4gICAqIEBwYXJhbSBtc2cgVGhlIG1lc3NhZ2UgcmV0dXJuZWQgYnkgdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gc3Vic2NyaXB0aW9uIFRoZSBzdWJzY3JpcHRpb24gdG8gbWFwXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpc1N1YnNjcmlwdGlvbihtc2c6IGFueSwgc3Vic2NyaXB0aW9uOiBzdHJpbmcpOiBtc2cgaXMgUlBDU3ViIHtcclxuICAgIHJldHVybiAhIW1zZy5tZXRob2RcclxuICAgICAgICAgICYmIG1zZy5tZXRob2QgPT09ICdldGhfc3Vic2NyaXB0aW9uJ1xyXG4gICAgICAgICAgJiYgbXNnLnBhcmFtcy5zdWJzY3JpcHRpb24gPT09IHN1YnNjcmlwdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKiBSZXR1cm4gdGhlIHJlc3BvbnNlIG9mIGFuIFJQQyBSZXF1ZXN0ICovXHJcbiAgcHJpdmF0ZSByZXNwb25zZTxUPihpZDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zb2NrZXQkLnBpcGUoXHJcbiAgICAgIGZpbHRlcigobXNnOiBSUENSZXM8VD4pID0+IG1zZy5pZCA9PT0gaWQpLFxyXG4gICAgICBmaXJzdCgpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3Vic2NyaWJlIHRvIHRoZSBub2RlIGZvciBhIHNwZWNpZmljIHN1YnNjcmlwdGlvbiBuYW1lXHJcbiAgICogQHBhcmFtIHN1YnNjcmlwdGlvbiBUaGUgc3Vic2NyaXB0aW9uIG5hbWUgd2Ugd2FudCB0byBzdWJzY3JpYmUgdG9cclxuICAgKi9cclxuICBwcml2YXRlIHN1YnNjcmlwdGlvbjxUPihzdWJzY3JpcHRpb246IHN0cmluZyk6IE9ic2VydmFibGU8UlBDU3ViPFQ+PiB7XHJcbiAgICByZXR1cm4gdGhpcy5zb2NrZXQkLnBpcGUoXHJcbiAgICAgIGZpbHRlcihtc2cgPT4gdGhpcy5pc1N1YnNjcmlwdGlvbihtc2csIHN1YnNjcmlwdGlvbikpXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBzb2NrZXQgYmV0d2VlbiB0aGUgY2xpZW50IGFuZCB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSB1cmwgVGhlIHVybCBvZiB0aGUgbm9kZSB0byBjb25uZWN0IHRvXHJcbiAgICovXHJcbiAgcHVibGljIGNyZWF0ZSh1cmw6IHN0cmluZykge1xyXG4gICAgdGhpcy5zb2NrZXQkID0gbmV3IFdlYlNvY2tldFN1YmplY3Qoe1xyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgV2ViU29ja2V0Q3RvcjogdzNjd2Vic29ja2V0IGFzIGFueVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGFuIFJQQyByZXF1ZXN0IHRvIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHBheWxvYWQgVGhlIFJQQyByZXF1ZXN0XHJcbiAgICovXHJcbiAgcHVibGljIHBvc3Q8VCA9IGFueT4ocGF5bG9hZDogUlBDUmVxKTogT2JzZXJ2YWJsZTxSUENSZXM8VD4+IHtcclxuICAgIHRoaXMuc29ja2V0JC5uZXh0KHBheWxvYWQpO1xyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2U8VD4ocGF5bG9hZC5pZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdWJzY3JpYmUgdG8gYSBTVUIvUFVCXHJcbiAgICogQHBhcmFtIHBheWxvYWQgVGhlIFJQQyByZXF1ZXN0XHJcbiAgICovXHJcbiAgcHVibGljIHN1YnNjcmliZShwYXlsb2FkOiBSUENSZXEpIHtcclxuICAgIHRoaXMuc29ja2V0JC5uZXh0KHBheWxvYWQpO1xyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2U8c3RyaW5nPihwYXlsb2FkLmlkKS5waXBlKFxyXG4gICAgICB0YXAocmVzID0+IHsgaWYgKHJlcy5lcnJvcikgdGhyb3cgcmVzLmVycm9yOyB9KSxcclxuICAgICAgbWFwKHJlcyA9PiByZXMucmVzdWx0KSxcclxuICAgICAgc3dpdGNoTWFwKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2YWJsZXNbcmVzdWx0XSA9IHRoaXMuc3Vic2NyaXB0aW9uKHJlc3VsdCk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ET1xyXG4gIHB1YmxpYyB1bnN1YnNjcmliZSgpIHtcclxuXHJcbiAgfVxyXG59XHJcbiJdfQ==