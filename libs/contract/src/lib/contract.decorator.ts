import { ContractModel } from '@ngeth/utils';
import { Injectable, Type } from '@angular/core';
import { ContractProvider } from '@ngeth/provider';
import { ABIEncoder, ABIDecoder } from './abi';
import { ContractModule } from './contract.module';
import { ContractClass } from './contract';

export function Contract<T extends ContractModel>(metadata: {
  provider?: Type<ContractProvider>;  // TODO : Use for custom provider (with Auth)
  abi: any[] | string;
  addresses?: {
    mainnet?: string;
    ropsten?: string;
    rinkeby?: string;
    kovan?: string;
  };
}) {
  const { abi, addresses } = metadata;
  const jsonInterace: any[] = typeof abi === 'string' ? JSON.parse(abi) : abi;

  /**
   * Get the address of the contract depending on the id of the network
   * @param id The id of the network
   */
  const getAddress = (id: number): string => {
    switch(id) {
      case 1: return addresses['mainnet'];
      case 3: return addresses['ropsten'];
      case 4: return addresses['rinkeby'];
      case 42: return addresses['kovan'];
      default: return addresses['mainnet'];
    }
  }

  return function(Base) {
    @Injectable({ providedIn: ContractModule })
    class ContractDecorated extends ContractClass<T> {
      constructor(
        protected encoder: ABIEncoder,
        protected decoder: ABIDecoder,
        protected provider: ContractProvider
      ) {
        super(encoder, decoder, provider, jsonInterace, getAddress(provider.id));
      }
    }
    return ContractDecorated as any;
  };
}
