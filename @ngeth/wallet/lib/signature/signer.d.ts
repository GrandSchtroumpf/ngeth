import { TxObject } from '@ngeth/utils';
import { RLP } from './rlp';
export declare class Signer {
    private rlp;
    constructor(rlp: RLP);
    /**
     * Sign a raw transaction
     * @param privateKey The private key to sign the transaction with
     * @param tx The transaction to sign
     * @param chainId The id of the chain
     */
    signTx(privateKey: string, tx: TxObject, chainId?: number): {
        messageHash: string;
        r: string;
        s: string;
        v: string;
        rawTransaction: string;
    };
    /**
     * Recover a transaction based on its raw value
     * @param rawTx The raw transaction format
     */
    recoverTx(rawTx: string): void;
    /**
     * Format the transaction
     * @param tx The Transaction to encode
     */
    private rawTx(tx);
    /**
     * Sign a hash
     * @param privateKey The private key needed to sign the hash
     * @param hash The hash to sign
     * @param chainId The Id of the chain
      */
    sign(privateKey: string, hash: string, chainId?: number): {
        r: string;
        s: string;
        v: string;
        signature: string;
    };
    /**
     * Hash a message with the preamble "\x19Ethereum Signed Message:\n"
     * @param message The message to sign
     */
    hashMessage(message: string): string;
}
