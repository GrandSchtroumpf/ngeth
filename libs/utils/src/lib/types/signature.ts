export interface RLPTransaction {
  raw: string;
  tx: {
    nonce: string;
    gasPrice: string;
    gas: string;
    to: string;
    value: string;
    input: string;
    v: string;
    r: string;
    s: string;
    hash: string;
  };
}

export interface TxSignature {
  messageHash: string;
  v: string;
  r: string;
  s: string;
  rawTransaction: string;
}

export interface MsgSignature {
  message: string;
  messageHash: string;
  v: string;
  r: string;
  s: string;
  signature: string;
}
