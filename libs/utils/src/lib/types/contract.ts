import { Type } from '@angular/core';
import { ABIDefinition } from './abi';

/**********
 * MAIN
 */

export interface ContractMethod<I, O> {
  input: I;
  output: O;
}
export interface CallMethod<Input, Output>
  extends ContractMethod<Input, Output> {}
export interface SendMethod<Input> extends ContractMethod<Input, any> {}
/**
 * Contract based interface
 */
export interface ContractModel {
  name?: string;
  calls: {
    [name: string]: any;
  };
  sends: {
    [name: string]: any;
  };
  events: {
    [name: string]: any;
  };
}

/**********
 * CONTRACT HELPERS
 */

/** MetaData for the decorator */
export interface ContractMetadata {
  abi: ABIDefinition[] | string;
  providedIn?: Type<any> | 'root';
  addresses?: {
    main?: string;
    ropsten?: string;
    koven?: string;
    rinkeby?: string;
    custom?: string;
  };
  options?: {
    from?: string;
    gasPrice?: any;
    gas?: number;
    data?: string;
  };
}

/** Options of the contract once instanciated */
export interface ContractOptions {
  address: string;
  jsonInterface: ABIDefinition[];
  data: string;
  from: string;
  gasPrice: string;
  gas: number;
}

/** An event-log returned by Ethereum */
export interface EventLog<T extends object> {
  returnValues: T;
  raw: {
    data: string;
    topics: string[];
  };
  event: string;
  signature: string;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
}

/** The options of the contract. Some are used as fallbacks for calls and transactions: */
export interface ContractTxOptions {
  /** The address transactions should be made from. */
  from?: string;
  /** The gas price in wei to use for transactions. */
  gasPrice?: any;
  /** The maximum gas provided for a transaction (gas limit). */
  gas?: number;
  /** The byte code of the contract. Used when the contract gets deployed. */
  data?: string;
}

/** The event emitter object returned by web3 */
export interface EventEmitter<T extends object> {
  on(type: 'data', handler: (event: EventLog<T>) => void): EventEmitter<T>;
  on(type: 'changed', handler: (receipt: EventLog<T>) => void): EventEmitter<T>;
  on(type: 'error', handler: (error: Error) => void): EventEmitter<T>;
  on(
    type: 'error' | 'data' | 'changed',
    handler: (error: Error | TransactionReceipt | string) => void
  ): EventEmitter<T>;
}

export interface EventFilter {
  filter: Object;
  fromBlock: number;
}

export interface TransactionObject<T> {
  arguments: any[];
  call(tx?: Tx): Promise<T>;
  send(tx?: Tx): PromiEvent<T>;
  estimateGas(tx?: Tx): Promise<number>;
  encodeABI(): string;
}

export declare interface PromiEvent<T> extends Promise<T> {
  once(
    type: 'transactionHash',
    handler: (receipt: string) => void
  ): PromiEvent<T>;
  once(
    type: 'receipt',
    handler: (receipt: TransactionReceipt) => void
  ): PromiEvent<T>;
  once(
    type: 'confirmation',
    handler: (confNumber: number, receipt: TransactionReceipt) => void
  ): PromiEvent<T>;
  once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
  once(
    type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
    handler: (error: Error | TransactionReceipt | string) => void
  ): PromiEvent<T>;
  on(
    type: 'transactionHash',
    handler: (receipt: string) => void
  ): PromiEvent<T>;
  on(
    type: 'receipt',
    handler: (receipt: TransactionReceipt) => void
  ): PromiEvent<T>;
  on(
    type: 'confirmation',
    handler: (confNumber: number, receipt: TransactionReceipt) => void
  ): PromiEvent<T>;
  on(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
  on(
    type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
    handler: (error: Error | TransactionReceipt | string) => void
  ): PromiEvent<T>;
}

export type BlockType = 'latest' | 'pending' | 'genesis' | number;

/*****
 * DUPLICATE WITH PROVIDER
 */

export interface Tx {
  nonce?: string | number;
  chainId?: string | number;
  from?: string;
  to?: string;
  data?: string;
  value?: string | number;
  gas?: string | number;
  gasPrice?: string | number;
}

export interface TransactionReceipt {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  from: string;
  to: string;
  contractAddress: string;
  cumulativeGasUsed: number;
  gasUsed: number;
  logs?: Array<Log>;
  events?: {
    [eventName: string]: EventLog<any>;
  };
  status: string;
}

export interface Log {
  address: string;
  data: string;
  topics: string[];
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
}
