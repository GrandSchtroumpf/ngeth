import { Injectable } from '@angular/core';
import { EthAccounts } from './service';

// NGRX
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { GET_ACCOUNTS, GetAccountsSuccess, SELECT_ACCOUNT, SelectAccount, AccountError } from './actions';

// RXJS
import { Observable, of } from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class AccountsEffects {

    constructor(private actions$: Actions, private account: EthAccounts) {}

    @Effect()
    GetAccounts$: Observable<Action> = this.actions$.pipe(
        ofType(GET_ACCOUNTS),
        switchMap(() => this.account.getAccounts()),
        map((accounts: string[]) => new GetAccountsSuccess(accounts)),
        catchError((err: any) => of(new AccountError(err)))
    );
    
    @Effect({dispatch: false})
    SelectAccount$ = this.actions$.pipe(
        ofType(SELECT_ACCOUNT),
        map((action: SelectAccount) => this.account.defaultAccount = action.payload)
    );
}
