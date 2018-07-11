import { Contract } from './contract';
import { NgModule, Type, InjectionToken } from '@angular/core';
import { AuthAccount, AUTH, Auth as Authentication } from '@ngeth/auth';
import { ABIEncoder, ABIDecoder } from './abi';

export const CONTRACTS = new InjectionToken<Contract<any>[]>('@ngeth/contracts: Contracts');

@NgModule({
  providers: [{provide: AUTH, useClass: AuthAccount}]
})
export class ContractModule {
  static forRoot(Authenticator: Type<Authentication>) {
    return {
      ngModule: ContractModule,
      providers: [{ provide: AUTH, useClass: Authenticator }]
    };
  }

}
