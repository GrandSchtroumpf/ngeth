import { Injectable } from '@angular/core';
import { default as Web3 } from 'web3';
import { Web3Provider } from './../../packages/core/src/provider';

@Injectable()
export class NgProvider implements Web3Provider {

    public provider = new Web3.providers.HttpProvider('');
}