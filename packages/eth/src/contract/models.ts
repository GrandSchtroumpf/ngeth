import { IProvider, BlockType, EventLog, EventEmitter, ABIDefinition, TransactionObject, Tx, TransactionReceipt } from './../types';
import { Observable } from 'rxjs';
import { Callback } from '../types';


/** The options of the contract. Some are used as fallbacks for calls and transactions: */
export interface ContractOptions {
    /** The address transactions should be made from. */
    from?: string;
    /** The gas price in wei to use for transactions. */
    gasPrice?: any;
    /** The maximum gas provided for a transaction (gas limit). */
    gas?: number;
    /** The byte code of the contract. Used when the contract gets deployed. */
    data?: string;
}

export interface NgEventLog<T extends object> extends EventLog {
  returnValues: T
}

export interface NgEventEmitter<T extends object> extends EventEmitter {
  on(type: "data", handler: (event: NgEventLog<T>) => void): EventEmitter
  on(type: "changed", handler: (receipt: NgEventLog<T>) => void): EventEmitter
  on(type: "error", handler: (error: Error) => void): EventEmitter
  on(type: "error" | "data" | "changed", handler: (error: Error | TransactionReceipt | string) => void): EventEmitter
}

/** Method format of the contract */
export type NgMethod<Input, Output> = (args?: Input, tx?: Tx) => Observable<Output>;
/** Event format of the contract */
export type NgEvent<T extends object> = (options?: {
  filter?: object
  fromBlock?: BlockType
  topics?: string[]
}, cb?: Callback<NgEventLog<T>>) => NgEventEmitter<T>

/** A template of Contract for the NgContract */
export interface INgContract {
  methods: {
    [fnName: string]: NgMethod<any, any>
  }
  events?: {
    [evName: string]: NgEvent<any>
    allEvents: NgEvent<any>
  }
}

/** A Web3 contract with observable methods */
export abstract class NgContract<Contract extends INgContract> {
  options: {
    address: string
    jsonInterface: ABIDefinition[]
    data: string
    from: string
    gasPrice: string
    gas: number
  };
  methods: Contract['methods'];

  deploy: (options: {
    data: string,
    arguments: any[]
  }) => TransactionObject<NgContract<Contract>>;

  events: Contract['events'];

  getPastEvents: (
    event: string,
    options?: {
      filter?: object,
      fromBlock?: BlockType,
      toBlock?: BlockType,
      topics?: string[]
    },
    cb?: Callback<NgEventLog<any>[]>
  ) => Promise<NgEventLog<any>[]>;
  setProvider: (provider: IProvider) => void;
}

export interface NgMethodPayload {
  /** The name of the contract */
  contract: string;
  /** Is it a call or a send method */
  type?: 'call' | 'send';
  /** The name of the method */
  method: string;
  /** The result of the method (only on success) */
  result?: any;
  /** The list of the arguments of the method */
  args: any[];
}