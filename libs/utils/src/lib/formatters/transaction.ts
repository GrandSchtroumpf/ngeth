import { hexToNumber, toBN } from '../utils';

export interface ITransaction {
  /** hash of the transaction. */
  hash: string;
  /** The number of transactions made by the sender prior to this one. */
  nonce: number;
  /** Hash of the block where this transaction was in. null when its pending. */
  blockHash: string;
  /** Block number where this transaction was in. null when its pending. */
  blockNumber: number;
  /** Integer of the transactions index position in the block. null when its pending. */
  transactionIndex: number;
  /** Address of the sender. */
  from: string;
  /** Address of the receiver. null when its a contract creation transaction. */
  to: string;
  /** BigNumber::value transferred in Wei  */
  value: string;
  /** Gas provided by the sender. */
  gas: number;
  /** Gas price provided by the sender in Wei. */
  gasPrice: number;
  /** The data send along with the transaction. */
  input: string;
}

export class Transaction implements ITransaction {
  hash: string;
  nonce: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string;
  value: string;
  gas: number;
  gasPrice: number;
  input: string;

  constructor(ethTx) {
    this.hash = ethTx.hash;
    this.nonce = hexToNumber(ethTx.nonce);
    this.blockHash = ethTx.blockHash;
    this.blockNumber = hexToNumber(ethTx.blockNumber);
    this.transactionIndex = hexToNumber(ethTx.transactionIndex);
    this.from = ethTx.from;
    this.to = ethTx.to;
    this.value = toBN(ethTx.value).toString(10);
    this.gas = hexToNumber(ethTx.gas);
    this.gasPrice = hexToNumber(ethTx.gasPrice);
    this.input = ethTx.input;
  }
}
