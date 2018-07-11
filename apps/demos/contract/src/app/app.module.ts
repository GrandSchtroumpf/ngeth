import { AuthWallet, AuthModule } from '@ngeth/auth';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { ProvidersModule } from '@ngeth/provider';
import { ContractModule, TestEventContract } from '@ngeth/contract';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ProvidersModule.init('ws://localhost:7586'),
    AuthModule,
    ContractModule.forRoot(AuthWallet),
    NxModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
