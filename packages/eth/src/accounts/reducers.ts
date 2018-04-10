import { GET_ACCOUNTS_SUCCESS, SELECT_ACCOUNT, AccountsActions } from './actions';

export interface State {
    selected: string,
    accounts: string[]
}

const initialState: State = {
    selected: null,
    accounts: []
}

export const reducers = (state = initialState, action: AccountsActions): State => {
    switch (action.type) {
        case (GET_ACCOUNTS_SUCCESS): {
            return {...state, accounts: action.payload };
        };
        case (SELECT_ACCOUNT): {
            return {...state, selected: action.payload };
        };
        default: {
            return state;
        }
    }
}
