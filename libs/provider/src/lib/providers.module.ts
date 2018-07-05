import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  APP_INITIALIZER
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MainProvider } from './provider';

export const AUTH = new InjectionToken<any>('auth');

export function setProviderId(provider: MainProvider) {
  return  function() {
    provider.fetchId().then(id => provider.id = id);
  }
}

// @dynamic
@NgModule({
  imports: [HttpClientModule]
})
export class ProvidersModule {
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
}
