import { InjectionToken } from '@angular/core';
import { Eth } from 'web3/types';

export const ETH = new InjectionToken<Eth>('eth');
export const PROVIDER = new InjectionToken<any>('provider');
