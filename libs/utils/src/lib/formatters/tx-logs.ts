import { hexToNumber } from '../utils';

export interface ITxLogs {
  /**  contains one or more 32 Bytes non-indexed arguments of the log. */
  data: string;
  /** Array of 0 to 4 32-Bytes of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event */
  topics: string[];
  /** integer of the log index position in the block. null when its pending log. */
  logIndex: number;
  /** integer of the transactions index position log was created from. null when its pending log. */
  transactionIndex: number;
  /** hash of the transactions this log was created from. null when its pending log. */
  transactionHash: string;
  /** hash of the block where this log was in. null when its pending. null when its pending log. */
  blockHash: string;
  /** the block number where this log was in. null when its pending. null when its pending log. */
  blockNumber: number;
  /** address from which this log originated. */
  address: string;
}

export class TxLogs {
  data: string;
  topics: string[];
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;

  constructor(ethTxLogs) {
    this.data = ethTxLogs.data;
    this.topics = ethTxLogs.topics;
    this.logIndex = hexToNumber(ethTxLogs.logIndex);
    this.transactionIndex = hexToNumber(ethTxLogs.transactionIndex);
    this.transactionHash = ethTxLogs.transactionHash;
    this.blockHash = ethTxLogs.blockHash;
    this.blockNumber = hexToNumber(ethTxLogs.blockNumber);
    this.address = ethTxLogs.address;
  }
}
