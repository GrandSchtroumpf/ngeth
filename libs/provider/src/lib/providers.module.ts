import { Account } from './subproviders/account';
import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  Type,
  APP_INITIALIZER
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { Provider } from './provider';

export const AUTH = new InjectionToken<any>('auth');
export const URL = new InjectionToken<string>('url');

export function initProvider(provider: Provider, url: string) {
  return  function() {
    return provider.init(url);
  }
}

// @dynamic
@NgModule({
  imports: [HttpClientModule]
})
export class ProvidersModule {
  static init(url: string, Auth?: Type<any>): ModuleWithProviders {
    return {
      ngModule: ProvidersModule,
      providers: [
        Provider,
        { provide: URL, useValue: url },
        {
          provide: APP_INITIALIZER,
          useFactory: initProvider,
          multi: true,
          deps: [Provider, URL]
        },
        { provide: AUTH, useClass: Auth || Account },
      ]
    };
  };
  /*
  static forRoot(Provider: typeof MainProvider): ModuleWithProviders {
    return {
      ngModule: ProvidersModule,
      providers: [
        Provider,
        { provide: MainProvider, useExisting: Provider },
        {
          provide: APP_INITIALIZER,
          useFactory: setProviderId,
          multi: true,
          deps: [MainProvider]
        },
        { provide: AUTH, useClass: Provider.Auth },
      ]
    };
  }
  */
}
