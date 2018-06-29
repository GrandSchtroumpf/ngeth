import { Injectable } from '@angular/core';
import { RPCRes, RPCSub, RPCReq } from '@ngeth/utils';
import { ProvidersModule } from './../providers.module';
import { w3cwebsocket } from 'websocket';
import { WebSocketSubject } from 'rxjs/webSocket';

import { Observable } from 'rxjs';
import { filter, first, tap, switchMap, map } from 'rxjs/operators';

@Injectable({ providedIn: ProvidersModule })
export class WebsocketProvider {
  private socket$: WebSocketSubject<any>;
  public observables: Observable<RPCSub>[] = [];

  constructor() {}

  /**
   * Check if a message is the subscription we want
   * @param msg The message returned by the node
   * @param subscription The subscription to map
   */
  private isSubscription(msg: any, subscription: string): msg is RPCSub {
    return !!msg.method
          && msg.method === 'eth_subscription'
          && msg.params.subscription === subscription;
  }

  /** Return the response of an RPC Request */
  private response<T>(id: number) {
    return this.socket$.pipe(
      filter((msg: RPCRes<T>) => msg.id === id),
      first()
    );
  }

  /**
   * Subscribe to the node for a specific subscription name
   * @param subscription The subscription name we want to subscribe to
   */
  private subscription<T>(subscription: string): Observable<RPCSub<T>> {
    return this.socket$.pipe(
      filter(msg => this.isSubscription(msg, subscription))
    )
  }

  /**
   * Create a socket between the client and the node
   * @param url The url of the node to connect to
   */
  public create(url: string) {
    this.socket$ = new WebSocketSubject({
      url: url,
      WebSocketCtor: w3cwebsocket as any
    });
  }

  /**
   * Send an RPC request to the node
   * @param payload The RPC request
   */
  public post<T = any>(payload: RPCReq): Observable<RPCRes<T>> {
    this.socket$.next(payload);
    return this.response<T>(payload.id);
  }

  /**
   * Subscribe to a SUB/PUB
   * @param payload The RPC request
   */
  public subscribe(payload: RPCReq) {
    this.socket$.next(payload);
    return this.response<string>(payload.id).pipe(
      tap(res => { if (res.error) throw res.error; }),
      map(res => res.result),
      switchMap(result => {
        return this.observables[result] = this.subscription(result);
      })
    );
  }

  // TODO
  public unsubscribe() {

  }
}
