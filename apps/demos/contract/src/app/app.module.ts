import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { ProvidersModule } from '@ngeth/provider';
import { ContractModule } from '@ngeth/contract';
import { WalletModule } from '@ngeth/wallet';
import { AppProvider } from './provider';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ProvidersModule.forRoot(AppProvider),
    ContractModule,
    WalletModule,
    NxModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
