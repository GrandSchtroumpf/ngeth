import { Action } from '@ngrx/store';
import { ABIDefinition, Contract } from '../types';
import { NgContract, NgMethodPayload } from './models';

export const CREATE_CONTRAT = '[Eth] Create Contract';
export const CREATE_CONTRAT_SUCCESS = '[Eth] Create Contract Success';

export const CALL_METHOD = '[Eth] Call Method';
export const CALL_METHOD_SUCCESS = '[Eth] Call Method Success';

export const SEND_METHOD = '[Eth] Send Method';
export const SEND_METHOD_SUCCESS = '[Eth] Send Method Success';

export const CONTRACT_ERROR = '[Eth] Error';


/**
 * CREATE
 */
export class CreateContract implements Action {
    readonly type = CREATE_CONTRAT;
    constructor(public payload: {name: string, abi: ABIDefinition[], address: string}){}
}

export class CreateContractSuccess implements Action {
    readonly type = CREATE_CONTRAT_SUCCESS;
    constructor(public payload: NgContract<any>){}
}

/**
 * CALL
 */
export class CallMethod implements Action {
    readonly type = CALL_METHOD;
    constructor(public payload: NgMethodPayload) {
        this.payload.type = 'call';
    }
}

export class CallMethodSuccess implements Action {
    readonly type = CALL_METHOD_SUCCESS;
    constructor(public payload: NgMethodPayload) {}
}

/**
 * SEND
 */
export class SendMethod implements Action {
    readonly type = SEND_METHOD;
    constructor(public payload: NgMethodPayload) {
        this.payload.type = 'send';
    }
}

export class SendMethodSuccess implements Action {
    readonly type = SEND_METHOD_SUCCESS;
    constructor(public payload: string) {}
}

/**
 * Error
 */

export class ContractError implements Action {
    readonly type = CONTRACT_ERROR;
    constructor(public payload: any){}
}

export type ContractActions = 
    | CreateContract
    | CreateContractSuccess
    | CallMethod
    | CallMethodSuccess
    | SendMethod
    | SendMethodSuccess
    | ContractError;