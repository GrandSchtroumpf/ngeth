import { RPCRes, RPCSub, RPCReq } from '@ngeth/utils';
import { Observable } from 'rxjs';
export declare class WebsocketProvider {
    private socket$;
    observables: Observable<RPCSub>[];
    constructor();
    /**
     * Check if a message is the subscription we want
     * @param msg The message returned by the node
     * @param subscription The subscription to map
     */
    private isSubscription(msg, subscription);
    /** Return the response of an RPC Request */
    private response<T>(id);
    /**
     * Subscribe to the node for a specific subscription name
     * @param subscription The subscription name we want to subscribe to
     */
    private subscription<T>(subscription);
    /**
     * Create a socket between the client and the node
     * @param url The url of the node to connect to
     */
    create(url: string): void;
    /**
     * Send an RPC request to the node
     * @param payload The RPC request
     */
    post<T = any>(payload: RPCReq): Observable<RPCRes<T>>;
    /**
     * Subscribe to a SUB/PUB
     * @param payload The RPC request
     */
    subscribe(payload: RPCReq): Observable<RPCSub<{}>>;
    unsubscribe(): void;
}
