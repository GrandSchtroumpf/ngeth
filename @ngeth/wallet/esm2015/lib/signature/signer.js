/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { keccak256, isHexStrict, hexToBytes } from '@ngeth/utils';
import { WalletModule } from './../wallet.module';
import { RLP } from './rlp';
import { Buffer } from 'buffer';
import { sign } from 'secp256k1';
import * as i0 from "@angular/core";
import * as i1 from "./rlp";
import * as i2 from "../wallet.module";
export class Signer {
    /**
     * @param {?} rlp
     */
    constructor(rlp) {
        this.rlp = rlp;
    }
    /**
     * Sign a raw transaction
     * @param {?} privateKey The private key to sign the transaction with
     * @param {?} tx The transaction to sign
     * @param {?=} chainId The id of the chain
     * @return {?}
     */
    signTx(privateKey, tx, chainId) {
        // Format TX
        const /** @type {?} */ rawTx = this.rawTx(tx);
        const /** @type {?} */ rawChain = ['0x' + (chainId || 1).toString(16), '0x', '0x'];
        // RLP encode with chainId (EIP155: prevent replay attack)
        const /** @type {?} */ rlpEncoded = this.rlp.encode([...rawTx, ...rawChain]);
        // Hash
        const /** @type {?} */ messageHash = keccak256(rlpEncoded);
        // Sign
        const { r, s, v } = this.sign(privateKey, messageHash, chainId);
        // RLP Encode with signature
        const /** @type {?} */ rlpTx = this.rlp.encode([...rawTx, ...[v, r, s]]);
        const /** @type {?} */ rawTransaction = '0x' + rlpTx.toString('hex');
        return { messageHash, r, s, v, rawTransaction };
    }
    /**
     * Recover a transaction based on its raw value
     * @param {?} rawTx The raw transaction format
     * @return {?}
     */
    recoverTx(rawTx) {
    }
    /**
     * Format the transaction
     * @param {?} tx The Transaction to encode
     * @return {?}
     */
    rawTx(tx) {
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
     * @param {?} privateKey The private key needed to sign the hash
     * @param {?} hash The hash to sign
     * @param {?=} chainId The Id of the chain
     * @return {?}
     */
    sign(privateKey, hash, chainId) {
        const /** @type {?} */ privKey = Buffer.from(privateKey.replace('0x', ''), 'hex');
        const /** @type {?} */ data = Buffer.from(hash.replace('0x', ''), 'hex');
        const /** @type {?} */ addToV = (chainId && chainId > 0) ? chainId * 2 + 8 : 0;
        const { signature, recovery } = sign(data, privKey);
        const /** @type {?} */ r = signature.toString('hex', 0, 32);
        const /** @type {?} */ s = signature.toString('hex', 32, 64);
        const /** @type {?} */ v = (recovery + 27 + addToV).toString(16);
        return {
            r: '0x' + r,
            s: '0x' + s,
            v: '0x' + v,
            signature: `0x${r}${s}${v}`
        };
    }
    /**
     * Hash a message with the preamble "\x19Ethereum Signed Message:\n"
     * @param {?} message The message to sign
     * @return {?}
     */
    hashMessage(message) {
        const /** @type {?} */ msg = isHexStrict(message) ? message : hexToBytes(message);
        const /** @type {?} */ msgBuffer = Buffer.from(/** @type {?} */ (msg));
        const /** @type {?} */ preamble = '\x19Ethereum Signed Message:\n' + msg.length;
        const /** @type {?} */ preambleBuffer = Buffer.from(preamble);
        const /** @type {?} */ ethMsg = Buffer.concat([preambleBuffer, msgBuffer]);
        return keccak256(ethMsg);
    }
}
Signer.decorators = [
    { type: Injectable, args: [{ providedIn: WalletModule },] },
];
/** @nocollapse */
Signer.ctorParameters = () => [
    { type: RLP, },
];
/** @nocollapse */ Signer.ngInjectableDef = i0.defineInjectable({ factory: function Signer_Factory() { return new Signer(i0.inject(i1.RLP)); }, token: Signer, providedIn: i2.WalletModule });
function Signer_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    Signer.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    Signer.ctorParameters;
    /** @type {?} */
    Signer.prototype.rlp;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3dhbGxldC8iLCJzb3VyY2VzIjpbImxpYi9zaWduYXR1cmUvc2lnbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBWSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM1QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUM7Ozs7QUFJakMsTUFBTTs7OztJQUVKLFlBQW9CLEdBQVE7UUFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO0tBQUk7Ozs7Ozs7O0lBUXpCLE1BQU0sQ0FBQyxVQUFrQixFQUFFLEVBQVksRUFBRSxPQUFnQjs7UUFFOUQsdUJBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IsdUJBQU0sUUFBUSxHQUFHLENBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFFLENBQUM7O1FBR3BFLHVCQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQzs7UUFHNUQsdUJBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7UUFHMUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDOztRQUdoRSx1QkFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsdUJBQU0sY0FBYyxHQUFHLElBQUksR0FBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJELE1BQU0sQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQzs7Ozs7OztJQU8zQyxTQUFTLENBQUMsS0FBYTs7Ozs7OztJQVF0QixLQUFLLENBQUMsRUFBWTtRQUN4QixNQUFNLENBQUM7WUFDTCxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUN2QixJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztZQUMxQixJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNyQixJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDbEQsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDdkIsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7U0FDdkIsQ0FBQzs7Ozs7Ozs7O0lBU0csSUFBSSxDQUFDLFVBQWtCLEVBQUUsSUFBWSxFQUFFLE9BQWdCO1FBQzVELHVCQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLHVCQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hELHVCQUFNLE1BQU0sR0FBRyxDQUFDLE9BQU8sSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELHVCQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0MsdUJBQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM1Qyx1QkFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUM7WUFDTCxDQUFDLEVBQUUsSUFBSSxHQUFDLENBQUM7WUFDVCxDQUFDLEVBQUUsSUFBSSxHQUFDLENBQUM7WUFDVCxDQUFDLEVBQUUsSUFBSSxHQUFDLENBQUM7WUFDVCxTQUFTLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtTQUM1QixDQUFDOzs7Ozs7O0lBT0csV0FBVyxDQUFDLE9BQWU7UUFDaEMsdUJBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakUsdUJBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLG1CQUFDLEdBQWEsRUFBQyxDQUFDO1FBQzdDLHVCQUFNLFFBQVEsR0FBRyxnQ0FBZ0MsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQy9ELHVCQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLHVCQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7OztZQXZGNUIsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRTs7OztZQUwvQixHQUFHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBUeE9iamVjdCwga2VjY2FrMjU2LCBpc0hleFN0cmljdCwgaGV4VG9CeXRlcyB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFdhbGxldE1vZHVsZSB9IGZyb20gJy4vLi4vd2FsbGV0Lm1vZHVsZSc7XHJcbmltcG9ydCB7IFJMUCB9IGZyb20gJy4vcmxwJztcclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJztcclxuaW1wb3J0IHsgc2lnbiB9IGZyb20gJ3NlY3AyNTZrMSc7XHJcblxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBXYWxsZXRNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIFNpZ25lciB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmxwOiBSTFApIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSByYXcgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgdHJhbnNhY3Rpb24gd2l0aFxyXG4gICAqIEBwYXJhbSB0eCBUaGUgdHJhbnNhY3Rpb24gdG8gc2lnblxyXG4gICAqIEBwYXJhbSBjaGFpbklkIFRoZSBpZCBvZiB0aGUgY2hhaW5cclxuICAgKi9cclxuICBwdWJsaWMgc2lnblR4KHByaXZhdGVLZXk6IHN0cmluZywgdHg6IFR4T2JqZWN0LCBjaGFpbklkPzogbnVtYmVyKSB7XHJcbiAgICAvLyBGb3JtYXQgVFhcclxuICAgIGNvbnN0IHJhd1R4ID0gdGhpcy5yYXdUeCh0eCk7XHJcbiAgICBjb25zdCByYXdDaGFpbiA9IFsgJzB4JyArIChjaGFpbklkIHx8IDEpLnRvU3RyaW5nKDE2KSwgJzB4JywgJzB4JyBdO1xyXG5cclxuICAgIC8vIFJMUCBlbmNvZGUgd2l0aCBjaGFpbklkIChFSVAxNTU6IHByZXZlbnQgcmVwbGF5IGF0dGFjaylcclxuICAgIGNvbnN0IHJscEVuY29kZWQgPSB0aGlzLnJscC5lbmNvZGUoWy4uLnJhd1R4LCAuLi5yYXdDaGFpbl0pO1xyXG5cclxuICAgIC8vIEhhc2hcclxuICAgIGNvbnN0IG1lc3NhZ2VIYXNoID0ga2VjY2FrMjU2KHJscEVuY29kZWQpO1xyXG5cclxuICAgIC8vIFNpZ25cclxuICAgIGNvbnN0IHsgciwgcywgdiB9ID0gdGhpcy5zaWduKHByaXZhdGVLZXksIG1lc3NhZ2VIYXNoLCBjaGFpbklkKTtcclxuXHJcbiAgICAvLyBSTFAgRW5jb2RlIHdpdGggc2lnbmF0dXJlXHJcbiAgICBjb25zdCBybHBUeCA9IHRoaXMucmxwLmVuY29kZShbLi4ucmF3VHgsIC4uLlt2LCByLCBzXV0pO1xyXG4gICAgY29uc3QgcmF3VHJhbnNhY3Rpb24gPSAnMHgnICsgIHJscFR4LnRvU3RyaW5nKCdoZXgnKTtcclxuXHJcbiAgICByZXR1cm4geyBtZXNzYWdlSGFzaCwgciwgcywgdiwgcmF3VHJhbnNhY3Rpb24gfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlY292ZXIgYSB0cmFuc2FjdGlvbiBiYXNlZCBvbiBpdHMgcmF3IHZhbHVlXHJcbiAgICogQHBhcmFtIHJhd1R4IFRoZSByYXcgdHJhbnNhY3Rpb24gZm9ybWF0XHJcbiAgICovXHJcbiAgcHVibGljIHJlY292ZXJUeChyYXdUeDogc3RyaW5nKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRm9ybWF0IHRoZSB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSB0eCBUaGUgVHJhbnNhY3Rpb24gdG8gZW5jb2RlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByYXdUeCh0eDogVHhPYmplY3QpOiBhbnlbXSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAnMHgnICsgKHR4Lm5vbmNlIHx8ICcnKSxcclxuICAgICAgJzB4JyArICh0eC5nYXNQcmljZSB8fCAnJyksXHJcbiAgICAgICcweCcgKyAodHguZ2FzIHx8ICcnKSxcclxuICAgICAgJzB4JyArIHR4LnRvLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnMHgnLCAnJykgfHwgJycsXHJcbiAgICAgICcweCcgKyAodHgudmFsdWUgfHwgJycpLFxyXG4gICAgICAnMHgnICsgKHR4LmRhdGEgfHwgJycpXHJcbiAgICBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIGhhc2hcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgbmVlZGVkIHRvIHNpZ24gdGhlIGhhc2hcclxuICAgKiBAcGFyYW0gaGFzaCBUaGUgaGFzaCB0byBzaWduXHJcbiAgICogQHBhcmFtIGNoYWluSWQgVGhlIElkIG9mIHRoZSBjaGFpblxyXG4gICAgKi9cclxuICBwdWJsaWMgc2lnbihwcml2YXRlS2V5OiBzdHJpbmcsIGhhc2g6IHN0cmluZywgY2hhaW5JZD86IG51bWJlcikge1xyXG4gICAgY29uc3QgcHJpdktleSA9IEJ1ZmZlci5mcm9tKHByaXZhdGVLZXkucmVwbGFjZSgnMHgnLCAnJyksICdoZXgnKTtcclxuICAgIGNvbnN0IGRhdGEgPSBCdWZmZXIuZnJvbShoYXNoLnJlcGxhY2UoJzB4JywgJycpLCAnaGV4Jyk7XHJcbiAgICBjb25zdCBhZGRUb1YgPSAoY2hhaW5JZCAmJiBjaGFpbklkID4gMCkgPyBjaGFpbklkICogMiArIDggOiAwO1xyXG4gICAgY29uc3QgeyBzaWduYXR1cmUsIHJlY292ZXJ5IH0gPSBzaWduKGRhdGEsIHByaXZLZXkpO1xyXG4gICAgY29uc3QgciA9IHNpZ25hdHVyZS50b1N0cmluZygnaGV4JywgMCwgMzIpO1xyXG4gICAgY29uc3QgcyA9IHNpZ25hdHVyZS50b1N0cmluZygnaGV4JywgMzIsIDY0KTtcclxuICAgIGNvbnN0IHYgPSAocmVjb3ZlcnkgKyAyNyArIGFkZFRvVikudG9TdHJpbmcoMTYpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcjogJzB4JytyLFxyXG4gICAgICBzOiAnMHgnK3MsXHJcbiAgICAgIHY6ICcweCcrdixcclxuICAgICAgc2lnbmF0dXJlOiBgMHgke3J9JHtzfSR7dn1gXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFzaCBhIG1lc3NhZ2Ugd2l0aCB0aGUgcHJlYW1ibGUgXCJcXHgxOUV0aGVyZXVtIFNpZ25lZCBNZXNzYWdlOlxcblwiXHJcbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gc2lnblxyXG4gICAqL1xyXG4gIHB1YmxpYyBoYXNoTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgbXNnID0gaXNIZXhTdHJpY3QobWVzc2FnZSkgPyBtZXNzYWdlIDogaGV4VG9CeXRlcyhtZXNzYWdlKTtcclxuICAgIGNvbnN0IG1zZ0J1ZmZlciA9IEJ1ZmZlci5mcm9tKG1zZyBhcyBzdHJpbmcpO1xyXG4gICAgY29uc3QgcHJlYW1ibGUgPSAnXFx4MTlFdGhlcmV1bSBTaWduZWQgTWVzc2FnZTpcXG4nICsgbXNnLmxlbmd0aDtcclxuICAgIGNvbnN0IHByZWFtYmxlQnVmZmVyID0gQnVmZmVyLmZyb20ocHJlYW1ibGUpO1xyXG4gICAgY29uc3QgZXRoTXNnID0gQnVmZmVyLmNvbmNhdChbcHJlYW1ibGVCdWZmZXIsIG1zZ0J1ZmZlcl0pO1xyXG4gICAgcmV0dXJuIGtlY2NhazI1NihldGhNc2cpO1xyXG4gIH1cclxufVxyXG4iXX0=