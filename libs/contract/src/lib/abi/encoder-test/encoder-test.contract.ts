import { Injector, Injectable } from '@angular/core';
import { Contract } from '../../contract';
import { IEncoderTestContract } from './encoder-test.models';
const abi = require('./encoder-test.abi.json');

const config = {
  abi: abi,
  addresses: {
    ropsten: '0x344f641ff60f6308ad70b1e62052764835f48e00'
  }
};

@Injectable({providedIn: 'root'})
export class EncoderTestContract extends Contract<IEncoderTestContract> {
  constructor(injector: Injector) {
    super(injector, config);
  }
}
