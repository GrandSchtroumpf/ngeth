import { abi } from './library.abi';
import { Asset } from './library';
// NGETH
import { Contract } from '../../../packages/eth/src/contract/decorator';
import { NgContract, INgContract, NgMethod } from '../../../packages/eth/src/contract/models';
import { EthContract } from './../../../packages/eth/src/contract/service';

export interface ILibraryContract extends INgContract {
    methods: {
        /** Get all the assets of BTV */
        getAllAssets: NgMethod<null, Asset[]>;
    }
}

@Contract<ILibraryContract>({
  abi: abi as any,
  addresses: {
      ropsten: '0x285419c0972dfaf787ddd73e81cdf95ebb11964c'
  }
})
export class LibraryContract extends NgContract<ILibraryContract> {}