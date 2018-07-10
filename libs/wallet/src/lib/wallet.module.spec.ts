import { async, TestBed } from '@angular/core/testing';
import { WalletModule } from '@ngeth/wallet/src/lib/wallet.module';

describe('WalletModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [WalletModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(WalletModule).toBeDefined();
  });
});
