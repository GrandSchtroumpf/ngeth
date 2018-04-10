import { Action } from '@ngrx/store';

/**
 * TYPES
 */
export const GET_ACCOUNTS = '[Eth] Get Accounts';
export const GET_ACCOUNTS_SUCCESS = '[Eth] Get Accounts Success';

export const SELECT_ACCOUNT = '[Eth] Select Account';
export const ACCOUNT_ERROR = '[Eth] Error Account';

/**
 * ACTIONS
 */
export class GetAccounts implements Action {
    readonly type = GET_ACCOUNTS;
}

export class GetAccountsSuccess implements Action {
    readonly type = GET_ACCOUNTS_SUCCESS;
    constructor(public payload: string[]){}
}

export class SelectAccount implements Action {
    readonly type = SELECT_ACCOUNT;
    constructor(public payload: string) {}
}

export class AccountError implements Action {
    readonly type = ACCOUNT_ERROR;
    constructor(public payload: any) {}
}

export type AccountsActions = 
    | GetAccounts
    | GetAccountsSuccess
    | SelectAccount;