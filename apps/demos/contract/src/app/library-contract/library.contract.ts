import { ContractClass, Contract } from '@ngeth/contract';

import { abi } from './library.abi';

@Contract({
  addresses: {
    ropsten: '0x285419c0972dfaf787ddd73e81cdf95ebb11964c'
  },
  abi: abi
})
export class LibraryContract extends ContractClass<any> {}
