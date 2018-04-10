import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { TransactionReceipt } from '../types';
import * as actions from './actions';

export interface State extends EntityState<TransactionReceipt>{
    pending: string[];
}

export const adapter: EntityAdapter<TransactionReceipt> = createEntityAdapter<TransactionReceipt> ({
    selectId: (tx: TransactionReceipt) => tx.transactionHash,
    sortComparer: false
});

const inititalState: State = adapter.getInitialState({
    pending: []
});

export const reducers = (state = inititalState, action: actions.TxActions): State => {
    switch (action.type) {
        case (actions.TX_BROADCASTED): {
            return { ...state, pending: [...state.pending, action.payload] };
        };
        case (actions.TX_CONFIRMED): {
            const pending = removeHash(action.payload.transactionHash, state.pending);
            return adapter.addOne(action.payload, {...state, pending: pending});
        };
        default: {
            return state;
        }
    }
}

const removeHash = (hash: string, pending: string[]): string[] => {
    const index = pending.indexOf(hash);
    if (index === -1) { return pending; }
    return [...pending.slice(0, index), ...pending.slice(index+1) ];
}