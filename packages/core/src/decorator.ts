import { Callback } from 'web3/types';
import { bindNodeCallback } from 'rxjs';
// Code based on ZeroClientProvider : https://github.com/MetaMask/provider-engine/blob/master/zero.js 
import { Injectable } from '@angular/core';
import { WebsocketProvider, IpcProvider, HttpProvider } from 'web3/types';
import { ProviderEngine } from './provider';
import * as Engine from 'web3-provider-engine';
import * as DefaultFixture from 'web3-provider-engine/subproviders/default-fixture.js';
import * as NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker.js';
import * as CacheSubprovider from 'web3-provider-engine/subproviders/cache.js';
import * as FilterSubprovider from 'web3-provider-engine/subproviders/filters.js';
import * as SubscriptionSubprovider from 'web3-provider-engine/subproviders/subscriptions';
import * as InflightCacheSubprovider from 'web3-provider-engine/subproviders/inflight-cache';
import * as HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet.js';
import * as SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer.js';
import * as FetchSubprovider from 'web3-provider-engine/subproviders/fetch.js';
import * as WebSocketSubprovider from 'web3-provider-engine/subproviders/websocket.js';

export interface Constructor<T = {}> {
    new(...args:any[]): T;
}

export class ProviderModel {
    provider: Engine;
}


/**
 * Decorator
 * @param options 
 */
export function Provider(options: ProviderEngine) {

    let engine;
    if (options.isCustom) {
        const connectionType = getConnectionType(options.rpcUrl);

        engine = new Engine();
        engine.addProvider(new DefaultFixture(options.default));
        engine.addProvider(new NonceTrackerSubprovider());
        engine.addProvider(new SanitizingSubprovider()); 
        engine.addProvider(new CacheSubprovider()); 
        engine.addProvider(new InflightCacheSubprovider());

        if (connectionType === 'ws') {
            engine.addProvider(new FilterSubprovider());
        } else {
            const filterAndSubsSubprovider = new SubscriptionSubprovider()
            // forward subscription events through provider
            filterAndSubsSubprovider.on('data', (err, notification) => {
              engine.emit('data', err, notification)
            });
            engine.addProvider(filterAndSubsSubprovider);
        }
            
        // data source
        const dataSubprovider = options.data || createDataSubprovider(connectionType, options)
        // for websockets, forward subscription events through provider
        if (connectionType === 'ws') {
            dataSubprovider.on('data', (err, notification) => {
                engine.emit('data', err, notification)
            })
        }
        engine.addProvider(dataSubprovider)
        engine.start();
    }

    /**
     * Factory
     */
    return function<TBase extends Constructor>(Base: TBase): TBase {

        
        @Injectable()
        class ProviderClass extends Base implements ProviderModel {
            public provider = options.isCustom ? engine : options.rpcUrl;
        }
        return ProviderClass;

    }

}



/**
 * HTTP or WS connection
 * @param rpcUrl The address of the node to connect to
 */
const getConnectionType = (rpcUrl: string): string => {
    const protocol = rpcUrl.split(':')[0]
    switch (protocol) {
        case 'http':
        case 'https':
            return 'http'
        case 'ws':
        case 'wss':
            return 'ws'
        default:
            throw new Error(`ProviderEngine - unrecognized protocol in "${rpcUrl}"`)
    }
}

/**
 * Create the right provider depending on the connexion
 * @param connectionType The type of the connection
 * @param opts options of the ProviderEngine
 */
const createDataSubprovider = (connectionType: string, opts: ProviderEngine) => {
    const { rpcUrl, debug } = opts
    
    // default to infura
    if (connectionType === 'http') {
        return new FetchSubprovider({ rpcUrl, debug })
    }
    if (connectionType === 'ws') {
        return new WebSocketSubprovider({ rpcUrl, debug })
    }
    
    throw new Error(`ProviderEngine - unrecognized connectionType "${connectionType}"`)
}