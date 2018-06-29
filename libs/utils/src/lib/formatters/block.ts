import { hexToNumber } from '../utils';

export interface IBlock {
  /** the block number. null when its pending block. */
  number: number;
  /** hash of the block. null when its pending block. */
  hash: string;
  /** hash of the parent block. */
  parentHash: string;
  /** hash of the generated proof-of-work. null when its pending block. */
  nonce: string;
  /** SHA3 of the uncles data in the block. */
  sha3Uncles: string;
  /** the bloom filter for the logs of the block. null when its pending block. */
  logsBloom: string;
  /** the root of the transaction trie of the block. */
  transactionsRoot: string;
  /** the root of the final state trie of the block. */
  stateRoot: string;
  /** the root of the receipts trie of the block. */
  receiptsRoot: string;
  /** the address of the beneficiary to whom the mining rewards were given. */
  miner: string;
  /** integer of the difficulty for this block. */
  difficulty: number;
  /**  integer of the total difficulty of the chain until this block. */
  totalDifficulty: number;
  /** integer the size of this block in bytes. */
  size: number;
  /** the "extra data" field of this block. */
  extraData: string;
  /** the maximum gas allowed in this block. */
  gasLimit: number;
  /** the total used gas by all transactions in this block. */
  gasUsed: number;
  /** the unix timestamp for when the block was collated. */
  timestamp: number;
  /** Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter. */
  transactions: string[];
  /** Array of uncle hashes. */
  uncles: string[];
}

export class Block implements IBlock {
  number: number;
  hash: string;
  parentHash: string;
  nonce: string;
  sha3Uncles: string;
  logsBloom: string;
  transactionsRoot: string;
  stateRoot: string;
  receiptsRoot: string;
  miner: string;
  difficulty: number;
  totalDifficulty: number;
  size: number;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  timestamp: number;
  transactions: string[];
  uncles: string[];

  constructor(ethBlock) {
    this.number = hexToNumber(ethBlock.number);
    this.hash = ethBlock.hash;
    this.parentHash = ethBlock.parentHash;
    this.nonce = ethBlock.nonce;
    this.sha3Uncles = ethBlock.sha3Uncles;
    this.logsBloom = ethBlock.logsBloom;
    this.transactionsRoot = ethBlock.transactionsRoot;
    this.stateRoot = ethBlock.stateRoot;
    this.receiptsRoot = ethBlock.receiptsRoot;
    this.miner = ethBlock.miner;
    this.difficulty = hexToNumber(ethBlock.difficulty);
    this.totalDifficulty = hexToNumber(ethBlock.totalDifficulty);
    this.size = hexToNumber(ethBlock.size);
    this.extraData = ethBlock.extraData;
    this.gasLimit = hexToNumber(ethBlock.gasLimit);
    this.gasUsed = hexToNumber(ethBlock.gasUsed);
    this.timestamp = hexToNumber(ethBlock.timestamp);
    this.transactions = ethBlock.transactions;
    this.uncles = ethBlock.uncles;
  }
}
