import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgProvider } from './provider';

// NGETH
import { EthModule } from './../../packages/eth/src/eth.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EthModule.forRoot(NgProvider)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
