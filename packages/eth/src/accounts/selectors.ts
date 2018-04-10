import { EthState } from '../reducers';

export const getAccounts = (state: EthState) => state.accounts.accounts;
export const getDefaultAccount = (state: EthState) => state.accounts.selected;