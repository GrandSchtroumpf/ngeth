/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXIuZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3Byb3ZpZGVyLyIsInNvdXJjZXMiOlsibGliL3Byb3ZpZGVyLmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFVBQVUsRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGdCQUFnQixFQUFjLE1BQU0sTUFBTSxDQUFDO0FBR3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDMUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7QUFHakQsTUFBTSxtQkFBbUIsT0FHeEI7SUFFQyxNQUFNLENBQUMsVUFBUyxJQUF3QjtRQUV0Qyx1QkFDd0IsU0FBUSxZQUFZOzs7OztZQUsxQyxZQUNVLE1BQ0E7Z0JBRVIsS0FBSyxFQUFFLENBQUM7Z0JBSEEsU0FBSSxHQUFKLElBQUk7Z0JBQ0osT0FBRSxHQUFGLEVBQUU7Z0JBR1YsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLGdCQUFnQixDQUFDO2dCQUMzQyx1QkFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDNUMsdUJBQU0sSUFBSSxHQUFHLFFBQVEsS0FBSyxLQUFLLElBQUksUUFBUSxLQUFLLE1BQU0sQ0FBQztnQkFFdkQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztvQkFDbkIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2lCQUN4QjtnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztpQkFDdEI7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7b0JBQ25CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztpQkFDeEI7YUFFRjs7Ozs7WUFHTyxlQUFlO2dCQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDM0IsdUJBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUMvRSxNQUFNLENBQUMsZ0JBQWdCLENBQU0sU0FBUyxDQUFDLEVBQUUsQ0FBQztpQkFDM0MsQ0FBQTs7Ozs7O1lBSUssYUFBYTtnQkFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxLQUFLLEVBQUcsQ0FBQztvQkFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ25DLENBQUE7Z0JBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFO29CQUMzQixJQUFJLENBQUMsS0FBSyxFQUFHLENBQUM7b0JBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM5QixDQUFBOzs7Ozs7WUFJSyxlQUFlO2dCQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQzNCLElBQUksQ0FBQyxLQUFLLEVBQUcsQ0FBQztvQkFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQWMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztpQkFDdkQsQ0FBQTs7O2lDQXJEa0IsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPOztvQkFGN0MsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRTs7OztvQkFoQnRDLFVBQVU7b0JBRlYsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUE0RXRCLE1BQU0sbUJBQUMsaUJBQXdCLEVBQUM7S0FDakMsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgV2Vic29ja2V0UHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy93cy1wcm92aWRlcic7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgYmluZE5vZGVDYWxsYmFjaywgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgUlBDUmVzLCBSUENSZXEsIFJQQ1N1YiB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBQcm92aWRlcnNNb2R1bGUgfSBmcm9tICcuL3Byb3ZpZGVycy5tb2R1bGUnO1xyXG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnLi9zdWJwcm92aWRlcnMvYWNjb3VudCc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFByb3ZpZGVyKG9wdGlvbnM6IHtcclxuICB1cmw6IHN0cmluZztcclxuICBhdXRoPzogYW55O1xyXG59KSB7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihCYXNlOiBUeXBlPE1haW5Qcm92aWRlcj4pIHtcclxuXHJcbiAgICBASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IFByb3ZpZGVyc01vZHVsZSB9KVxyXG4gICAgY2xhc3MgRGVjb3JhdGVkUHJvdmlkZXIgZXh0ZW5kcyBNYWluUHJvdmlkZXIge1xyXG4gICAgICBwdWJsaWMgc3RhdGljIEF1dGggPSBvcHRpb25zLmF1dGggfHwgQWNjb3VudDtcclxuICAgICAgcHVibGljIHNlbmRBc3luYzogPFQ+KHBheWxvYWQ6IFJQQ1JlcSkgPT4gT2JzZXJ2YWJsZTxSUENSZXM8VD4+O1xyXG4gICAgICBwdWJsaWMgb246IDxUPihwYXlsb2FkOiBSUENSZXEpID0+IE9ic2VydmFibGU8UlBDU3ViPFQ+PjtcclxuXHJcbiAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICBwcml2YXRlIHdzOiBXZWJzb2NrZXRQcm92aWRlclxyXG4gICAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJ2xvY2FsaG9zdDo4NTQ1JztcclxuICAgICAgICBjb25zdCBwcm90b2NvbCA9IG5ldyBVUkwodGhpcy51cmwpLnByb3RvY29sO1xyXG4gICAgICAgIGNvbnN0IGlzV1MgPSBwcm90b2NvbCA9PT0gJ3dzOicgfHwgcHJvdG9jb2wgPT09ICd3c3M6JztcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdyAmJiAnd2ViMycgaW4gd2luZG93KSB7XHJcbiAgICAgICAgICB0aGlzLnR5cGUgPSAnd2ViMyc7XHJcbiAgICAgICAgICB0aGlzLnNldFdlYjNQcm92aWRlcigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNXUykge1xyXG4gICAgICAgICAgdGhpcy50eXBlID0gJ3dzJztcclxuICAgICAgICAgIHRoaXMuc2V0V3NQcm92aWRlcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnR5cGUgPSAnaHR0cCc7XHJcbiAgICAgICAgICB0aGlzLnNldEh0dHBQcm92aWRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKiBDb25uZWN0IHRvIGEgd2ViMyBpbnN0YW5jZSBpbnNpZGUgdGhlIHBhZ2UgaWYgYW55ICovXHJcbiAgICAgIHByaXZhdGUgc2V0V2ViM1Byb3ZpZGVyKCkge1xyXG4gICAgICAgIHRoaXMud2ViM1Byb3ZpZGVyID0gd2luZG93Wyd3ZWIzJ10uY3VycmVudFByb3ZpZGVyO1xyXG4gICAgICAgIHRoaXMuc2VuZEFzeW5jID0gKHBheWxvYWQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHNlbmRBc3luYyA9IHRoaXMud2ViM1Byb3ZpZGVyLnNlbmRBc3luYy5iaW5kKHRoaXMud2ViM1Byb3ZpZGVyLCBwYXlsb2FkKTtcclxuICAgICAgICAgIHJldHVybiBiaW5kTm9kZUNhbGxiYWNrPGFueT4oc2VuZEFzeW5jKSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqIFNldHVwIGEgV2Vic29ja2V0IGNvbm5lY3Rpb24gd2l0aCB0aGUgbm9kZSAqL1xyXG4gICAgICBwcml2YXRlIHNldFdzUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdGhpcy53cy5jcmVhdGUodGhpcy51cmwpO1xyXG4gICAgICAgIHRoaXMub24gPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ycGNJZCArKztcclxuICAgICAgICAgIHJldHVybiB0aGlzLndzLnN1YnNjcmliZShwYXlsb2FkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZW5kQXN5bmMgPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ycGNJZCArKztcclxuICAgICAgICAgIHJldHVybiB0aGlzLndzLnBvc3QocGF5bG9hZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiogU2V0dXAgYW4gSFRUUCBjb25uZWN0aW9uIHdpdGggdGhlIG5vZGUgKi9cclxuICAgICAgcHJpdmF0ZSBzZXRIdHRwUHJvdmlkZXIoKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kQXN5bmMgPSAocGF5bG9hZCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ycGNJZCArKztcclxuICAgICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxSUENSZXM8YW55Pj4odGhpcy51cmwsIHBheWxvYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIERlY29yYXRlZFByb3ZpZGVyIGFzIGFueTtcclxuICB9O1xyXG59XHJcbiJdfQ==