/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { WebsocketProvider } from './providers/ws-provider';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindNodeCallback } from 'rxjs';
import { MainProvider } from './provider';
import { ProvidersModule } from './providers.module';
import { Account } from './subproviders/account';
/**
 * @param {?} options
 * @return {?}
 */
export function Provider(options) {
    return function (Base) {
        var DecoratedProvider = /** @class */ (function (_super) {
            tslib_1.__extends(DecoratedProvider, _super);
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
        function DecoratedProvider_tsickle_Closure_declarations() {
            /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
            DecoratedProvider.decorators;
            /**
             * @nocollapse
             * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
             */
            DecoratedProvider.ctorParameters;
            /** @type {?} */
            DecoratedProvider.Auth;
            /** @type {?} */
            DecoratedProvider.prototype.sendAsync;
            /** @type {?} */
            DecoratedProvider.prototype.on;
            /** @type {?} */
            DecoratedProvider.prototype.http;
            /** @type {?} */
            DecoratedProvider.prototype.ws;
        }
        return /** @type {?} */ (DecoratedProvider);
    };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3Byb3ZpZGVyLyIsInNvdXJjZXMiOlsibGliL3Byb3ZpZGVyLmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBRSxVQUFVLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxnQkFBZ0IsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUdwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7Ozs7O0FBR2pELE1BQU0sbUJBQW1CLE9BR3hCO0lBRUMsTUFBTSxDQUFDLFVBQVMsSUFBd0I7O1lBR04sNkNBQVk7WUFLMUMsMkJBQ1UsTUFDQTtnQkFGVixZQUlFLGlCQUFPLFNBZ0JSO2dCQW5CUyxVQUFJLEdBQUosSUFBSTtnQkFDSixRQUFFLEdBQUYsRUFBRTtnQkFHVixLQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLElBQUksZ0JBQWdCLENBQUM7Z0JBQzNDLHFCQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUM1QyxxQkFBTSxJQUFJLEdBQUcsUUFBUSxLQUFLLEtBQUssSUFBSSxRQUFRLEtBQUssTUFBTSxDQUFDO2dCQUV2RCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQy9CLEtBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO29CQUNuQixLQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7aUJBQ3hCO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNoQixLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDakIsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN0QjtnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixLQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztvQkFDbkIsS0FBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2lCQUN4Qjs7YUFFRjs7Ozs7WUFHTywyQ0FBZTs7Ozs7O2dCQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxPQUFPO29CQUN2QixxQkFBTSxTQUFTLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQy9FLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBTSxTQUFTLENBQUMsRUFBRSxDQUFDO2lCQUMzQyxDQUFBOzs7Ozs7WUFJSyx5Q0FBYTs7Ozs7O2dCQUNuQixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxFQUFFLEdBQUcsVUFBQyxPQUFPO29CQUNoQixLQUFJLENBQUMsS0FBSyxFQUFHLENBQUM7b0JBQ2QsTUFBTSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNuQyxDQUFBO2dCQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxPQUFPO29CQUN2QixLQUFJLENBQUMsS0FBSyxFQUFHLENBQUM7b0JBQ2QsTUFBTSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM5QixDQUFBOzs7Ozs7WUFJSywyQ0FBZTs7Ozs7O2dCQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQUMsT0FBTztvQkFDdkIsS0FBSSxDQUFDLEtBQUssRUFBRyxDQUFDO29CQUNkLE1BQU0sQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBYyxLQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUN2RCxDQUFBOztxQ0FyRGtCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTzs7d0JBRjdDLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUU7Ozs7d0JBaEJ0QyxVQUFVO3dCQUZWLGlCQUFpQjs7b0NBQTFCO1VBbUJvQyxZQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXlENUMsTUFBTSxtQkFBQyxpQkFBd0IsRUFBQztLQUNqQyxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXZWJzb2NrZXRQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL3dzLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBiaW5kTm9kZUNhbGxiYWNrLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBSUENSZXMsIFJQQ1JlcSwgUlBDU3ViIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcic7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4vcHJvdmlkZXJzLm1vZHVsZSc7XHJcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tICcuL3N1YnByb3ZpZGVycy9hY2NvdW50JztcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gUHJvdmlkZXIob3B0aW9uczoge1xyXG4gIHVybDogc3RyaW5nO1xyXG4gIGF1dGg/OiBhbnk7XHJcbn0pIHtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKEJhc2U6IFR5cGU8TWFpblByb3ZpZGVyPikge1xyXG5cclxuICAgIEBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogUHJvdmlkZXJzTW9kdWxlIH0pXHJcbiAgICBjbGFzcyBEZWNvcmF0ZWRQcm92aWRlciBleHRlbmRzIE1haW5Qcm92aWRlciB7XHJcbiAgICAgIHB1YmxpYyBzdGF0aWMgQXV0aCA9IG9wdGlvbnMuYXV0aCB8fCBBY2NvdW50O1xyXG4gICAgICBwdWJsaWMgc2VuZEFzeW5jOiA8VD4ocGF5bG9hZDogUlBDUmVxKSA9PiBPYnNlcnZhYmxlPFJQQ1JlczxUPj47XHJcbiAgICAgIHB1YmxpYyBvbjogPFQ+KHBheWxvYWQ6IFJQQ1JlcSkgPT4gT2JzZXJ2YWJsZTxSUENTdWI8VD4+O1xyXG5cclxuICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHByaXZhdGUgd3M6IFdlYnNvY2tldFByb3ZpZGVyXHJcbiAgICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnbG9jYWxob3N0Ojg1NDUnO1xyXG4gICAgICAgIGNvbnN0IHByb3RvY29sID0gbmV3IFVSTCh0aGlzLnVybCkucHJvdG9jb2w7XHJcbiAgICAgICAgY29uc3QgaXNXUyA9IHByb3RvY29sID09PSAnd3M6JyB8fCBwcm90b2NvbCA9PT0gJ3dzczonO1xyXG5cclxuICAgICAgICBpZiAod2luZG93ICYmICd3ZWIzJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICAgIHRoaXMudHlwZSA9ICd3ZWIzJztcclxuICAgICAgICAgIHRoaXMuc2V0V2ViM1Byb3ZpZGVyKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc1dTKSB7XHJcbiAgICAgICAgICB0aGlzLnR5cGUgPSAnd3MnO1xyXG4gICAgICAgICAgdGhpcy5zZXRXc1Byb3ZpZGVyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudHlwZSA9ICdodHRwJztcclxuICAgICAgICAgIHRoaXMuc2V0SHR0cFByb3ZpZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqIENvbm5lY3QgdG8gYSB3ZWIzIGluc3RhbmNlIGluc2lkZSB0aGUgcGFnZSBpZiBhbnkgKi9cclxuICAgICAgcHJpdmF0ZSBzZXRXZWIzUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdGhpcy53ZWIzUHJvdmlkZXIgPSB3aW5kb3dbJ3dlYjMnXS5jdXJyZW50UHJvdmlkZXI7XHJcbiAgICAgICAgdGhpcy5zZW5kQXN5bmMgPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgY29uc3Qgc2VuZEFzeW5jID0gdGhpcy53ZWIzUHJvdmlkZXIuc2VuZEFzeW5jLmJpbmQodGhpcy53ZWIzUHJvdmlkZXIsIHBheWxvYWQpO1xyXG4gICAgICAgICAgcmV0dXJuIGJpbmROb2RlQ2FsbGJhY2s8YW55PihzZW5kQXN5bmMpKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiogU2V0dXAgYSBXZWJzb2NrZXQgY29ubmVjdGlvbiB3aXRoIHRoZSBub2RlICovXHJcbiAgICAgIHByaXZhdGUgc2V0V3NQcm92aWRlcigpIHtcclxuICAgICAgICB0aGlzLndzLmNyZWF0ZSh0aGlzLnVybCk7XHJcbiAgICAgICAgdGhpcy5vbiA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMud3Muc3Vic2NyaWJlKHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbmRBc3luYyA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMud3MucG9zdChwYXlsb2FkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKiBTZXR1cCBhbiBIVFRQIGNvbm5lY3Rpb24gd2l0aCB0aGUgbm9kZSAqL1xyXG4gICAgICBwcml2YXRlIHNldEh0dHBQcm92aWRlcigpIHtcclxuICAgICAgICB0aGlzLnNlbmRBc3luYyA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJwY0lkICsrO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PFJQQ1Jlczxhbnk+Pih0aGlzLnVybCwgcGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gRGVjb3JhdGVkUHJvdmlkZXIgYXMgYW55O1xyXG4gIH07XHJcbn1cclxuIl19