import { hdkey } from './../../packages/wallet/src/models';
import { Component, OnInit } from '@angular/core';
import { LibraryContract } from './nxc-library/library.contract';
import { Asset } from './nxc-library/library';

import { Observable } from 'rxjs';

// NGETH
import { getAccounts } from './../../packages/eth/src/accounts/selectors';
import { WalletService } from './../../packages/wallet/src/service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  public assets$: Observable<Asset[]>;

  constructor(
    private contract: LibraryContract,
    private wallet: WalletService
  ) {}

  ngOnInit() {
    this.assets$ = this.contract.methods.getAllAssets();
  }

}
