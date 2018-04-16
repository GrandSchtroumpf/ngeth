import { WalletService } from './service';
import { Injectable, Inject } from '@angular/core';

// NGETH
import { PROVIDER } from '../../eth/src/token';
import { ProviderModel } from './../../core/src/decorator';

@Injectable()
export class WalletProvider {

    constructor(
        private wallet: WalletService, 
        @Inject(PROVIDER) private provider: ProviderModel
    ) {
        this.provider;
    }
    
    // DO SOMETHING WITH PROVIDER
    
}
