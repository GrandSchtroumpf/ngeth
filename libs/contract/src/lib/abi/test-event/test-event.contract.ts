import { ContractClass } from '../../contract';
import { Contract,  } from '../../contract.decorator';
import { ITestEventContract } from './test-event.models';
const abi = require('./test-event.abi.json');

@Contract<ITestEventContract>({
  abi: abi,
  addresses: {
    ropsten: '0xc0D6C4cbA14aeFC218d0ff669e07D73E74078248'
  }
})
export class TestEventContract extends ContractClass<ITestEventContract> {}
