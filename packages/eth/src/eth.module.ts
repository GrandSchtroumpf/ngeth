import { NgModule, ModuleWithProviders, Type } from '@angular/core';
import { Web3Provider } from '../../core/src';
import { ETH } from './token';
import { default as Eth} from 'web3-eth';

@NgModule({

})
export class EthModule {
    /**
     * Set the provider for web3's Eth module
     * @param provider The provider used to connect to a node
     */
    static forRoot(web3Provider: Type<Web3Provider>): ModuleWithProviders;
    static forRoot(web3Provider: Type<Web3Provider>): ModuleWithProviders {
        return {
            ngModule: EthModule,
            providers: [
                {
                    provide: ETH,
                    useFactory: (web3Provider?: Web3Provider) => {
                        const ethProvider = web3Provider ? web3Provider.provider : 'ws://localhost:8586'; 
                        return new Eth( Eth.givenProvider || ethProvider );
                    },
                    deps: [web3Provider]
                }
            ]
        }
    }
}