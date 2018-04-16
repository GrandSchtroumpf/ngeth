import { InjectionToken } from '@angular/core';
import { Eth } from 'web3/types';

// NGETH
import { ProviderModel } from './../../core/src/decorator';

export const ETH = new InjectionToken<Eth>('eth');
export const PROVIDER = new InjectionToken<ProviderModel>('provider')