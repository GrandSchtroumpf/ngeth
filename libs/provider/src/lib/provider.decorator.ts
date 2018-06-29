import { WebsocketProvider } from './providers/ws-provider';
import { Injectable, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindNodeCallback, Observable } from 'rxjs';

import { RPCRes, RPCReq, RPCSub } from '@ngeth/utils';
import { MainProvider } from './provider';
import { ProvidersModule } from './providers.module';
import { Account } from './subproviders/account';


export function Provider(options: {
  url: string;
  auth?: any;
}) {

  return function(Base: Type<MainProvider>) {

    @Injectable({ providedIn: ProvidersModule })
    class DecoratedProvider extends MainProvider {
      public static Auth = options.auth || Account;
      public sendAsync: <T>(payload: RPCReq) => Observable<RPCRes<T>>;
      public on: <T>(payload: RPCReq) => Observable<RPCSub<T>>;

      constructor(
        private http: HttpClient,
        private ws: WebsocketProvider
      ) {
        super();
        this.url = options.url || 'localhost:8545';
        const protocol = new URL(this.url).protocol;
        const isWS = protocol === 'ws:' || protocol === 'wss:';

        if (window && 'web3' in window) {
          this.type = 'web3';
          this.setWeb3Provider();
        } else if (isWS) {
          this.type = 'ws';
          this.setWsProvider();
        } else {
          this.type = 'http';
          this.setHttpProvider();
        }

      }

      /** Connect to a web3 instance inside the page if any */
      private setWeb3Provider() {
        this.web3Provider = window['web3'].currentProvider;
        this.sendAsync = (payload) => {
          const sendAsync = this.web3Provider.sendAsync.bind(this.web3Provider, payload);
          return bindNodeCallback<any>(sendAsync)();
        }
      }

      /** Setup a Websocket connection with the node */
      private setWsProvider() {
        this.ws.create(this.url);
        this.on = (payload) => {
          this.rpcId ++;
          return this.ws.subscribe(payload);
        }
        this.sendAsync = (payload) => {
          this.rpcId ++;
          return this.ws.post(payload);
        }
      }

      /** Setup an HTTP connection with the node */
      private setHttpProvider() {
        this.sendAsync = (payload) => {
          this.rpcId ++;
          return this.http.post<RPCRes<any>>(this.url, payload);
        }
      }
    }
    return DecoratedProvider as any;
  };
}
