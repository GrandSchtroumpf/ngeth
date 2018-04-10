import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromAccounts from './accounts/reducers';
import * as fromTransaction from './transactions/reducers';
import * as fromContract from './contract/reducers';

export interface EthState {
    accounts: fromAccounts.State,
    transactions: fromTransaction.State,
    contracts: fromContract.State
}

export const ethReducers: ActionReducerMap<EthState> = {
    accounts: fromAccounts.reducers,
    transactions: fromTransaction.reducers,
    contracts: fromContract.reducers
};
