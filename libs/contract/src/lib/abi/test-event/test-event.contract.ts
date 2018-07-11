import { Injectable, Injector } from '@angular/core';
import { Contract } from '../../contract';
import { ITestEventContract } from './test-event.models';
const abi = require('./test-event.abi.json');


const config = {
  abi: abi,
  addresses: {
    ropsten: '0xc0D6C4cbA14aeFC218d0ff669e07D73E74078248'
  }
};

@Injectable({providedIn: 'root'})
export class TestEventContract extends Contract<ITestEventContract> {
  constructor(injector: Injector) {
    super(injector, config);
  }
}
