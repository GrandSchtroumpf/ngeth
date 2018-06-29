import { IBlock, ITransaction, ITxReceipt, ITxLogs } from './../formatters';
/** JSON RPC Request model */
export interface RPCReq {
  jsonrpc: string;
  id: number;
  method: string;
  params: any[];
}

/** JSON RPC Response model with the result as a generic type */
export interface RPCRes<Result = any> {
  jsonrpc: string;
  id: number;
  result?: Result;
  error?: string;
}

/** The RPC Callback of send functions */
export type RPCCallback = (err: string, result: RPCRes) => void;

/** JSON RPC Subscription model with the result as a generic type */
export interface RPCSub<Result = any> {
  jsonrpc: string;
  method: 'eth_subscription';
  params: {
    subscription: string,
    result: any
  }
}


export interface RPCMethod {
  // Web3
  web3_clientVersion: string;
  web3_sha3: string;
  // Net
  net_version: string;
  net_peerCount: number;
  net_listening: boolean;
  // Eth
  eth_protocolVersion: string;
  eth_syncing: {
    startingBlock: number;
    currentBlock: number;
    highestBlock: number;
  };
  eth_coinbase: string;
  eth_mining: boolean;
  eth_hashrate: number;
  eth_gasPrice: number;
  eth_accounts: string[];
  eth_blockNumber: number;
  eth_getBalance: number;
  eth_getStorageAt: string;
  eth_getTransactionCount: number;
  eth_getBlockTransactionCountByHash: number;
  eth_getBlockTransactionCountByNumber: number;
  eth_getUncleCountByBlockHash: number;
  eth_getUncleCountByBlockNumber: number;
  eth_getCode: string;
  eth_sign: string;
  eth_sendTransaction: string;
  eth_sendRawTransaction: string;
  eth_call: string;
  eth_estimateGas: number;
  eth_getBlockByHash: IBlock;
  eth_getBlockByNumber: IBlock;
  eth_getTransactionByHash: ITransaction;
  eth_getTransactionByBlockHashAndIndex: ITransaction;
  eth_getTransactionByBlockNumberAndIndex: ITransaction;
  eth_getTransactionReceipt: ITxReceipt;
  eth_getUncleByBlockHashAndIndex: IBlock;
  eth_getUncleByBlockNumberAndIndex: IBlock;
  eth_getCompilers: ('solitidy' | 'lll' | 'serpent')[];
  eth_compileLLL: any;
  eth_compileSolidity: any;
  eth_compileSerpent: any;
  eth_newFilter: number;
  eth_newBlockFilter: string;
  eth_newPendingTransactionFilter: number;
  eth_uninstallFilter: boolean;
  eth_getFilterChanges: number;
  eth_getFilterLogs: ITxLogs;
  eth_getLogs: ITxLogs;
  eth_getWork: [string, string, string];
  eth_submitWork: boolean;
  eth_submitHashrate: boolean;
  // SHH
  shh_post: boolean;
  shh_version: string;
  shh_newIdentity: string;
  shh_hasIdentity: boolean;
  shh_newGroup: string;
  shh_addToGroup: boolean;
  shh_newFilter: number;
  shh_uninstallFilter: boolean;
  shh_getFilterChanges: any[];
  shh_getMessages: number;
}
