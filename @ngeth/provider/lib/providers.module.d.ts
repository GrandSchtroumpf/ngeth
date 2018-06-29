import { ModuleWithProviders, InjectionToken } from '@angular/core';
import { MainProvider } from './provider';
export declare const AUTH: InjectionToken<any>;
export declare class ProvidersModule {
    static forRoot(Provider: typeof MainProvider): ModuleWithProviders;
}
