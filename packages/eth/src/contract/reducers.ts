import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import * as actions from './actions';

export class ContractDef {
    public name: string;
    public address: string;
    public events: string[];
    public methods: {
        [name: string] : any;
    }
}

export interface State {
    [name: string]: ContractDef;
}


export const reducers = (state = {}, action: actions.ContractActions): State => {
    switch (action.type) {
        case (actions.CALL_METHOD_SUCCESS): {
            const { contract, method, result, args } = action.payload;
            const oldMethods = state[contract] ? state[contract].methods : {};
            return {
                ...state,
                [contract] : {
                    name: contract,
                    methods: {
                        ...oldMethods,
                        [method]: { ...result, args: args }
                    }
                }
            }
        };
        default: {
            return state;
        }
    }
}