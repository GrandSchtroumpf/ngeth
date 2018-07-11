import { ContractModel } from '@ngeth/utils';
import { Injectable, Type, Inject, Injector } from '@angular/core';
import { ContractProvider } from './contract.provider';
import { ABIEncoder, ABIDecoder } from './abi';
import { Contract } from './contract';


export function ContractDecorator<T extends ContractModel>(metadata: {
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
  const jsonInterface: any[] = typeof abi === 'string' ? JSON.parse(abi) : abi;

  /**
   * Get the address of the contract depending on the id of the network
   * @param id The id of the network
   */
  function getAddress(id: number): string {
    switch(id) {
      case 1: return addresses['mainnet'];
      case 3: return addresses['ropsten'];
      case 4: return addresses['rinkeby'];
      case 42: return addresses['kovan'];
      default: return addresses['mainnet'];
    }
  }

  return function<B extends Type<any>>(Base: B) {
    @Injectable({ providedIn: 'root' })
    class ContractDecorated extends Contract<T> {

      constructor(injector: Injector) {
        super(injector, {abi, addresses});
        // this.init(jsonInterface, getAddress(provider.id));
      }
    }
    return <B>ContractDecorated;
  };
}
