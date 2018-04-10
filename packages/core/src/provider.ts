import { Injectable } from '@angular/core';
import { Provider } from 'web3/types';

export interface Web3Provider {
    provider: Provider;
}