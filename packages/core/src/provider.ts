import { Injectable } from '@angular/core';
import { WebsocketProvider, IpcProvider, HttpProvider } from 'web3/types';

export interface Web3Provider {
    provider: WebsocketProvider | IpcProvider | HttpProvider;
}

export interface ProviderEngine {
    isCustom: boolean;
    rpcUrl: string;
    default?;
    hookedWallet?;
    data?;
    debug?;
}
