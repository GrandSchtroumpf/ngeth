import { Type } from '@angular/core';
import { RPCReq, RPCRes, RPCSub } from '@ngeth/utils';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

// @dynamic
export class MainProvider {
  static Auth: Type<any>;
  protected sendAsync: <T>(payload: RPCReq) => Observable<RPCRes<T>>;
  protected on: <T>(payload: RPCReq) => Observable<RPCSub<T>>;
  protected rpcId = 0;
  protected web3Provider: any;
  public url: string;
  public id: number;
  public type: 'web3' | 'http' | 'ws';

  constructor() {}

  /** JSON RPC Request */
  protected req(method: string, params?: any[]): RPCReq {
    return {
      jsonrpc: '2.0',
      id: this.rpcId,
      method: method,
      params: params || []
    };
  }

  /** JSON RPC Response */
  protected res<T>(payload: any, result: any): RPCRes<T> {
    return {
      jsonrpc: payload.jsonrpc,
      id: payload.id,
      result: result
    };
  }

  /** Get the id of the provider : use only at launch */
  public fetchId(): Promise<number> {
    this.rpcId++;
    return this.rpc<number>('net_version').toPromise<number>();
  }

  /** Send a request to the node */
  public rpc<T>(method: string, params?: any[]): Observable<T> {
    const payload = this.req(method, params);
    return this.sendAsync<T>(payload).pipe(
      tap(console.log),
      map(res => {
        if (res.error) throw res.error;
        return res.result;
      })
    );
  }

  /** Send a subscription request to the node */
  public rpcSub<T>(params: any[]): Observable<T> {
    const payload = this.req('eth_subscribe', params);
    return this.on<T>(payload).pipe(
      map(res =>  res.params.result)
    );
  }
}
