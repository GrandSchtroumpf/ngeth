import { WalletModule } from './../../packages/wallet/src/wallet.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgProvider } from './provider';
import { NxcLibraryModule } from './nxc-library/nxc-library.module';

// NGETH
import { EthModule } from './../../packages/eth/src/eth.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EthModule.forRoot(NgProvider),
    WalletModule,
    NxcLibraryModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
