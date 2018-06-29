import { BN } from 'bn.js';

export interface ITxObject {
    /** The address the transaction is send from. */
    from: string;
    /** The address the transaction is directed to. */
    to: string;
    /** (default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas. */
    gas: number;
    /** Integer of the gasPrice used for each paid gas */
    gasPrice: string;
    /** Integer of the value sent with if (tx transaction */
    value: string;
    /** The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. */
    data: string;
    /** Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce. */
    nonce: number;
}

export class TxObject {
  /** The address the transaction is send from. */
  public from: string;
  /** The address the transaction is directed to. */
  public to: string;
  /** (default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas. */
  public gas: string;
  /** Integer of the gasPrice used for each paid gas */
  public gasPrice: string;
  /** Integer of the value sent with if (tx transaction */
  public value: string;
  /** The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. */
  public data: string;
  /** Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce. */
  public nonce: string;

  constructor(tx: Partial<ITxObject>) {
    if (tx.from) this.from = tx.from;
    if (tx.to) this.to = tx.to;
    if (tx.data) this.data = tx.data;

    if (tx.gas) this.gas = new BN(tx.gas, 10).toString(16);
    if (tx.gasPrice) this.gasPrice = new BN(tx.gasPrice, 10).toString(16);
    if (tx.value) this.value = new BN(tx.value, 10).toString(16);
    if (tx.nonce) this.nonce = new BN(tx.nonce, 10).toString(16);

  }
}
