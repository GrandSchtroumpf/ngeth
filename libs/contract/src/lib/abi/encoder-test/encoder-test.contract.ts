import { ContractClass } from '../../contract';
import { Contract } from '../../contract.decorator';
import { IEncoderTestContract } from './encoder-test.models';
const abi = require('./encoder-test.abi.json');

@Contract<IEncoderTestContract>({
  abi: abi,
  addresses: {
    ropsten: '0x344f641ff60f6308ad70b1e62052764835f48e00'
  }
})
export class EncoderTestContract extends ContractClass<IEncoderTestContract> {}
