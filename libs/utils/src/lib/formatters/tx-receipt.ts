import { ITxLogs, TxLogs } from './tx-logs';
import { hexToNumber } from '../utils';

export interface ITxReceipt {
  /** 32 bytes of post-transaction stateroot (pre Byzantium)  */
  root?: string;
  /** success or failure */
  status?: boolean;
  /**  hash of the transaction */
  transactionHash: string;
  /** integer of the transactions index position in the block. */
  transactionIndex: number;
  /** hash of the block where this transaction was in. */
  blockHash: string;
  /** block number where this transaction was in. */
  blockNumber: number;
  /** The contract address created, if the transaction was a contract creation, otherwise null. */
  contractAddress: string;
  /** The total amount of gas used when this transaction was executed in the block. */
  cumulativeGasUsed: number;
  /** The amount of gas used by this specific transaction alone. */
  gasUsed: number;
  /** Array of log objects, which this transaction generated. */
  logs: ITxLogs[];
  /**  Bloom filter for light clients to quickly retrieve related logs. */
  logsBloom: string;
}

export class TxReceipt {
  root?: string;
  status?: boolean;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  contractAddress: string;
  cumulativeGasUsed: number;
  gasUsed: number;
  logs: ITxLogs[];
  logsBloom: string;

  constructor(ethTxReceipt) {
    if (ethTxReceipt.status) {
      this.status = hexToNumber(ethTxReceipt.status) === 1 ? true : false;
    } else {
      this.root = ethTxReceipt.root;
    }
    this.transactionHash = ethTxReceipt.transactionHash;
    this.transactionIndex = hexToNumber(ethTxReceipt.transactionIndex);
    this.blockHash = ethTxReceipt.blockHash;
    this.blockNumber = hexToNumber(ethTxReceipt.blockNumber);
    this.contractAddress = ethTxReceipt.contractAddress;
    this.cumulativeGasUsed = hexToNumber(ethTxReceipt.cumulativeGasUsed);
    this.gasUsed = hexToNumber(ethTxReceipt.gasUsed);
    this.logs = ethTxReceipt.logs.map(log => new TxLogs(log));
    this.logsBloom = ethTxReceipt.logsBloom;
  }
}
