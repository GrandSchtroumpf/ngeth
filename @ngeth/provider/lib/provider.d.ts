import { Type } from '@angular/core';
import { RPCReq, RPCRes, RPCSub } from '@ngeth/utils';
import { Observable } from 'rxjs';
export declare class MainProvider {
    static Auth: Type<any>;
    protected sendAsync: <T>(payload: RPCReq) => Observable<RPCRes<T>>;
    protected on: <T>(payload: RPCReq) => Observable<RPCSub<T>>;
    protected rpcId: number;
    protected web3Provider: any;
    url: string;
    id: number;
    type: 'web3' | 'http' | 'ws';
    constructor();
    /** JSON RPC Request */
    protected req(method: string, params?: any[]): RPCReq;
    /** JSON RPC Response */
    protected res<T>(payload: any, result: any): RPCRes<T>;
    /** Get the id of the provider : use only at launch */
    fetchId(): Promise<number>;
    /** Send a request to the node */
    rpc<T>(method: string, params?: any[]): Observable<T>;
    /** Send a subscription request to the node */
    rpcSub<T>(params: any[]): Observable<T>;
}
