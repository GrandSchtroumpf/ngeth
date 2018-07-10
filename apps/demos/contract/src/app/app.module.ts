import { AuthWallet, AuthModule } from '@ngeth/auth';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { ProvidersModule } from '@ngeth/provider';
import { ContractModule } from '@ngeth/contract';
// import { AppProvider } from './provider';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // ProvidersModule.forRoot(AppProvider),
    ProvidersModule.init('ws://localhost:7586'),
    ContractModule.Auth(AuthWallet),
    AuthModule,
    NxModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
