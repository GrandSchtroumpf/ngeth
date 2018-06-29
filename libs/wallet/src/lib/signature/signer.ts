import { Injectable } from '@angular/core';
import { TxObject, keccak256, isHexStrict, hexToBytes } from '@ngeth/utils';
import { WalletModule } from './../wallet.module';
import { RLP } from './rlp';
import { Buffer } from 'buffer';
import { sign } from 'secp256k1';


@Injectable({ providedIn: WalletModule })
export class Signer {

  constructor(private rlp: RLP) {}

  /**
   * Sign a raw transaction
   * @param privateKey The private key to sign the transaction with
   * @param tx The transaction to sign
   * @param chainId The id of the chain
   */
  public signTx(privateKey: string, tx: TxObject, chainId?: number) {
    // Format TX
    const rawTx = this.rawTx(tx);
    const rawChain = [ '0x' + (chainId || 1).toString(16), '0x', '0x' ];

    // RLP encode with chainId (EIP155: prevent replay attack)
    const rlpEncoded = this.rlp.encode([...rawTx, ...rawChain]);

    // Hash
    const messageHash = keccak256(rlpEncoded);

    // Sign
    const { r, s, v } = this.sign(privateKey, messageHash, chainId);

    // RLP Encode with signature
    const rlpTx = this.rlp.encode([...rawTx, ...[v, r, s]]);
    const rawTransaction = '0x' +  rlpTx.toString('hex');

    return { messageHash, r, s, v, rawTransaction };
  }

  /**
   * Recover a transaction based on its raw value
   * @param rawTx The raw transaction format
   */
  public recoverTx(rawTx: string) {

  }

  /**
   * Format the transaction
   * @param tx The Transaction to encode
   */
  private rawTx(tx: TxObject): any[] {
    return [
      '0x' + (tx.nonce || ''),
      '0x' + (tx.gasPrice || ''),
      '0x' + (tx.gas || ''),
      '0x' + tx.to.toLowerCase().replace('0x', '') || '',
      '0x' + (tx.value || ''),
      '0x' + (tx.data || '')
    ];
  }

  /**
   * Sign a hash
   * @param privateKey The private key needed to sign the hash
   * @param hash The hash to sign
   * @param chainId The Id of the chain
    */
  public sign(privateKey: string, hash: string, chainId?: number) {
    const privKey = Buffer.from(privateKey.replace('0x', ''), 'hex');
    const data = Buffer.from(hash.replace('0x', ''), 'hex');
    const addToV = (chainId && chainId > 0) ? chainId * 2 + 8 : 0;
    const { signature, recovery } = sign(data, privKey);
    const r = signature.toString('hex', 0, 32);
    const s = signature.toString('hex', 32, 64);
    const v = (recovery + 27 + addToV).toString(16);
    return {
      r: '0x'+r,
      s: '0x'+s,
      v: '0x'+v,
      signature: `0x${r}${s}${v}`
    };
  }

  /**
   * Hash a message with the preamble "\x19Ethereum Signed Message:\n"
   * @param message The message to sign
   */
  public hashMessage(message: string): string {
    const msg = isHexStrict(message) ? message : hexToBytes(message);
    const msgBuffer = Buffer.from(msg as string);
    const preamble = '\x19Ethereum Signed Message:\n' + msg.length;
    const preambleBuffer = Buffer.from(preamble);
    const ethMsg = Buffer.concat([preambleBuffer, msgBuffer]);
    return keccak256(ethMsg);
  }
}
