import { TransactionReceipt } from '../types';
import { Action } from '@ngrx/store';

export const TX_BROADCASTED = '[Eth] Transaction Broadcasted';
export const TX_CONFIRMED = '[Eth] Transaction Confirmed';
export const TX_ERROR = '[Eth] Transaction Error';

export class TxBroadcasted implements Action {
    readonly type = TX_BROADCASTED;
    constructor(public payload: string){}
}

export class TxConfirmed implements Action {
    readonly type = TX_CONFIRMED;
    constructor(public payload: TransactionReceipt){}
}


export class TxError implements Action {
    readonly type = TX_ERROR;
    constructor(public payload: any){}
}

export type TxActions =
    | TxBroadcasted
    | TxConfirmed
    | TxError;