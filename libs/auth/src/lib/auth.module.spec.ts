import { async, TestBed } from '@angular/core/testing';
import { AuthModule } from './auth.module';

describe('WalletModule', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AuthModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(AuthModule).toBeDefined();
  });
});
