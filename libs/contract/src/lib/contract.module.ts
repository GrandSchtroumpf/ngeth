import { NgModule, InjectionToken, Type } from '@angular/core';
import { AuthAccount, Auth as Authentication } from '@ngeth/auth';

export const AUTH = new InjectionToken<any>('auth');

@NgModule({
  providers: [{provide: AUTH, useClass: AuthAccount}]
})
export class ContractModule {
  static Auth(Authenticator: Type<Authentication>) {
    return {
      ngModule: ContractModule,
      providers: [{provide: AUTH, useClass: Authenticator}]
    };
  }
}
