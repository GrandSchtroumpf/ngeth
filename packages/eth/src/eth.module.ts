import { NgModule, ModuleWithProviders, Type, APP_INITIALIZER, Inject } from '@angular/core';
import { Web3Provider } from '../../core/src';
import { ETH, PROVIDER } from './token';
import { EthContract } from './contract';
import { EthAccounts } from './accounts';

const Eth = require('web3-eth');

// NGETH Core
import { ProviderModel } from '../../core/src/decorator';

@NgModule()
export class EthModule {
    /**
     * Set the provider for web3's Eth module
     * @param provider The provider used to connect to a node
     */
    static forRoot(Provider: Type<ProviderModel>): ModuleWithProviders;
    static forRoot(Provider: Type<ProviderModel>): ModuleWithProviders {
        return {
            ngModule: EthModule,
            providers: [
                EthContract,
                EthAccounts,
                // Provider,                
                {
                    provide: PROVIDER,
                    useClass: Provider
                },
                {
                    provide: ETH,
                    useFactory: (provider?: ProviderModel) => {
                        const ethProvider = provider ? provider.provider : 'ws://localhost:8586'; 
                        return new Eth( Eth.givenProvider || ethProvider );
                    },
                    deps: [PROVIDER]
                },
                {
                    // Needed to get the id asynchronly before loaded contracts
                    provide: APP_INITIALIZER,
                    useFactory: (eth) => {
                        return async () => eth.net['id'] = await eth.net.getId();
                    },
                    deps: [ETH],
                    multi: true
                }
            ]
        }
    }
}