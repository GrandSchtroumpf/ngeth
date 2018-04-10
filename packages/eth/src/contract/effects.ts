import { Injectable } from '@angular/core';
import { EthContract } from './service';
import { NgContract } from './models';

// NGRX
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as actions from './actions';

// RXJS
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class ContractEffect {

    constructor(
        private actions$: Actions<actions.ContractActions>,
        private contract: EthContract
    ) {}

    @Effect()
    create$: Observable<Action> = this.actions$.pipe(
        ofType(actions.CREATE_CONTRAT),
        map((action: actions.CreateContract) => {
            const { name, abi, address } = action.payload;
            return this.contract.create(name, abi, address);
        }),
        map((contract: NgContract<any>) => new actions.CreateContractSuccess(contract)),
        catchError((err: any) => of(new actions.ContractError(err)))
    );

    @Effect()
    method$: Observable<Action> = this.actions$.pipe(
        ofType(actions.CALL_METHOD),
        switchMap((action: actions.CallMethod | actions.SendMethod) => {
            const { contract, method, type, args } = action.payload;
            return this.contract.effect(contract, type, method, args);
        }),
        catchError((err: any) => of(new actions.ContractError(err)))
    );
}
