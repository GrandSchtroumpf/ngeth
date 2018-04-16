import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

// NGETH
import { Provider, ProviderModel } from './../../packages/core/src/decorator';

@Provider({
    isCustom: true,
    rpcUrl: 'https://ropsten.infura.io/Ge8pLCXZNKUB86c7miUf'
})
export class NgProvider extends ProviderModel {}