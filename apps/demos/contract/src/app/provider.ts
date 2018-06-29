import { Wallet } from '@ngeth/wallet';
import { Provider, MainProvider } from '@ngeth/provider';

@Provider({
  url: 'ws://localhost:7586', // 'https://ropsten.infura.io/Ge8pLCXZNKUB86c7miUf'
  auth: Wallet
})
export class AppProvider extends MainProvider{}
