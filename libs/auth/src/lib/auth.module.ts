import { NgModule, InjectionToken } from '@angular/core';

export const AUTH = new InjectionToken<any>('auth');

@NgModule()
export class AuthModule {}
