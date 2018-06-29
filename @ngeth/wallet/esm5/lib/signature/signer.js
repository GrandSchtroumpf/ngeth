/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { keccak256, isHexStrict, hexToBytes } from '@ngeth/utils';
import { WalletModule } from './../wallet.module';
import { RLP } from './rlp';
import { Buffer } from 'buffer';
import { sign } from 'secp256k1';
import * as i0 from "@angular/core";
import * as i1 from "./rlp";
import * as i2 from "../wallet.module";
var Signer = /** @class */ (function () {
    function Signer(rlp) {
        this.rlp = rlp;
    }
    /**
     * Sign a raw transaction
     * @param {?} privateKey The private key to sign the transaction with
     * @param {?} tx The transaction to sign
     * @param {?=} chainId The id of the chain
     * @return {?}
     */
    Signer.prototype.signTx = /**
     * Sign a raw transaction
     * @param {?} privateKey The private key to sign the transaction with
     * @param {?} tx The transaction to sign
     * @param {?=} chainId The id of the chain
     * @return {?}
     */
    function (privateKey, tx, chainId) {
        // Format TX
        var /** @type {?} */ rawTx = this.rawTx(tx);
        var /** @type {?} */ rawChain = ['0x' + (chainId || 1).toString(16), '0x', '0x'];
        // RLP encode with chainId (EIP155: prevent replay attack)
        var /** @type {?} */ rlpEncoded = this.rlp.encode(tslib_1.__spread(rawTx, rawChain));
        // Hash
        var /** @type {?} */ messageHash = keccak256(rlpEncoded);
        // Sign
        var _a = this.sign(privateKey, messageHash, chainId), r = _a.r, s = _a.s, v = _a.v;
        // RLP Encode with signature
        var /** @type {?} */ rlpTx = this.rlp.encode(tslib_1.__spread(rawTx, [v, r, s]));
        var /** @type {?} */ rawTransaction = '0x' + rlpTx.toString('hex');
        return { messageHash: messageHash, r: r, s: s, v: v, rawTransaction: rawTransaction };
    };
    /**
     * Recover a transaction based on its raw value
     * @param {?} rawTx The raw transaction format
     * @return {?}
     */
    Signer.prototype.recoverTx = /**
     * Recover a transaction based on its raw value
     * @param {?} rawTx The raw transaction format
     * @return {?}
     */
    function (rawTx) {
    };
    /**
     * Format the transaction
     * @param {?} tx The Transaction to encode
     * @return {?}
     */
    Signer.prototype.rawTx = /**
     * Format the transaction
     * @param {?} tx The Transaction to encode
     * @return {?}
     */
    function (tx) {
        return [
            '0x' + (tx.nonce || ''),
            '0x' + (tx.gasPrice || ''),
            '0x' + (tx.gas || ''),
            '0x' + tx.to.toLowerCase().replace('0x', '') || '',
            '0x' + (tx.value || ''),
            '0x' + (tx.data || '')
        ];
    };
    /**
     * Sign a hash
     * @param {?} privateKey The private key needed to sign the hash
     * @param {?} hash The hash to sign
     * @param {?=} chainId The Id of the chain
     * @return {?}
     */
    Signer.prototype.sign = /**
     * Sign a hash
     * @param {?} privateKey The private key needed to sign the hash
     * @param {?} hash The hash to sign
     * @param {?=} chainId The Id of the chain
     * @return {?}
     */
    function (privateKey, hash, chainId) {
        var /** @type {?} */ privKey = Buffer.from(privateKey.replace('0x', ''), 'hex');
        var /** @type {?} */ data = Buffer.from(hash.replace('0x', ''), 'hex');
        var /** @type {?} */ addToV = (chainId && chainId > 0) ? chainId * 2 + 8 : 0;
        var _a = sign(data, privKey), signature = _a.signature, recovery = _a.recovery;
        var /** @type {?} */ r = signature.toString('hex', 0, 32);
        var /** @type {?} */ s = signature.toString('hex', 32, 64);
        var /** @type {?} */ v = (recovery + 27 + addToV).toString(16);
        return {
            r: '0x' + r,
            s: '0x' + s,
            v: '0x' + v,
            signature: "0x" + r + s + v
        };
    };
    /**
     * Hash a message with the preamble "\x19Ethereum Signed Message:\n"
     * @param {?} message The message to sign
     * @return {?}
     */
    Signer.prototype.hashMessage = /**
     * Hash a message with the preamble "\x19Ethereum Signed Message:\n"
     * @param {?} message The message to sign
     * @return {?}
     */
    function (message) {
        var /** @type {?} */ msg = isHexStrict(message) ? message : hexToBytes(message);
        var /** @type {?} */ msgBuffer = Buffer.from(/** @type {?} */ (msg));
        var /** @type {?} */ preamble = '\x19Ethereum Signed Message:\n' + msg.length;
        var /** @type {?} */ preambleBuffer = Buffer.from(preamble);
        var /** @type {?} */ ethMsg = Buffer.concat([preambleBuffer, msgBuffer]);
        return keccak256(ethMsg);
    };
    Signer.decorators = [
        { type: Injectable, args: [{ providedIn: WalletModule },] },
    ];
    /** @nocollapse */
    Signer.ctorParameters = function () { return [
        { type: RLP, },
    ]; };
    /** @nocollapse */ Signer.ngInjectableDef = i0.defineInjectable({ factory: function Signer_Factory() { return new Signer(i0.inject(i1.RLP)); }, token: Signer, providedIn: i2.WalletModule });
    return Signer;
}());
export { Signer };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3dhbGxldC8iLCJzb3VyY2VzIjpbImxpYi9zaWduYXR1cmUvc2lnbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQVksU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDNUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDNUIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNoQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7OztJQU0vQixnQkFBb0IsR0FBUTtRQUFSLFFBQUcsR0FBSCxHQUFHLENBQUs7S0FBSTs7Ozs7Ozs7SUFRekIsdUJBQU07Ozs7Ozs7Y0FBQyxVQUFrQixFQUFFLEVBQVksRUFBRSxPQUFnQjs7UUFFOUQscUJBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IscUJBQU0sUUFBUSxHQUFHLENBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFFLENBQUM7O1FBR3BFLHFCQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sa0JBQUssS0FBSyxFQUFLLFFBQVEsRUFBRSxDQUFDOztRQUc1RCxxQkFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztRQUcxQyxzREFBUSxRQUFDLEVBQUUsUUFBQyxFQUFFLFFBQUMsQ0FBaUQ7O1FBR2hFLHFCQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1B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QUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O2dCQXZGNUIsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRTs7OztnQkFML0IsR0FBRzs7O2lCQUhaOztTQVNhLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFR4T2JqZWN0LCBrZWNjYWsyNTYsIGlzSGV4U3RyaWN0LCBoZXhUb0J5dGVzIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgV2FsbGV0TW9kdWxlIH0gZnJvbSAnLi8uLi93YWxsZXQubW9kdWxlJztcclxuaW1wb3J0IHsgUkxQIH0gZnJvbSAnLi9ybHAnO1xyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tICdidWZmZXInO1xyXG5pbXBvcnQgeyBzaWduIH0gZnJvbSAnc2VjcDI1NmsxJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46IFdhbGxldE1vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgU2lnbmVyIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBybHA6IFJMUCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIHJhdyB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBzaWduIHRoZSB0cmFuc2FjdGlvbiB3aXRoXHJcbiAgICogQHBhcmFtIHR4IFRoZSB0cmFuc2FjdGlvbiB0byBzaWduXHJcbiAgICogQHBhcmFtIGNoYWluSWQgVGhlIGlkIG9mIHRoZSBjaGFpblxyXG4gICAqL1xyXG4gIHB1YmxpYyBzaWduVHgocHJpdmF0ZUtleTogc3RyaW5nLCB0eDogVHhPYmplY3QsIGNoYWluSWQ/OiBudW1iZXIpIHtcclxuICAgIC8vIEZvcm1hdCBUWFxyXG4gICAgY29uc3QgcmF3VHggPSB0aGlzLnJhd1R4KHR4KTtcclxuICAgIGNvbnN0IHJhd0NoYWluID0gWyAnMHgnICsgKGNoYWluSWQgfHwgMSkudG9TdHJpbmcoMTYpLCAnMHgnLCAnMHgnIF07XHJcblxyXG4gICAgLy8gUkxQIGVuY29kZSB3aXRoIGNoYWluSWQgKEVJUDE1NTogcHJldmVudCByZXBsYXkgYXR0YWNrKVxyXG4gICAgY29uc3QgcmxwRW5jb2RlZCA9IHRoaXMucmxwLmVuY29kZShbLi4ucmF3VHgsIC4uLnJhd0NoYWluXSk7XHJcblxyXG4gICAgLy8gSGFzaFxyXG4gICAgY29uc3QgbWVzc2FnZUhhc2ggPSBrZWNjYWsyNTYocmxwRW5jb2RlZCk7XHJcblxyXG4gICAgLy8gU2lnblxyXG4gICAgY29uc3QgeyByLCBzLCB2IH0gPSB0aGlzLnNpZ24ocHJpdmF0ZUtleSwgbWVzc2FnZUhhc2gsIGNoYWluSWQpO1xyXG5cclxuICAgIC8vIFJMUCBFbmNvZGUgd2l0aCBzaWduYXR1cmVcclxuICAgIGNvbnN0IHJscFR4ID0gdGhpcy5ybHAuZW5jb2RlKFsuLi5yYXdUeCwgLi4uW3YsIHIsIHNdXSk7XHJcbiAgICBjb25zdCByYXdUcmFuc2FjdGlvbiA9ICcweCcgKyAgcmxwVHgudG9TdHJpbmcoJ2hleCcpO1xyXG5cclxuICAgIHJldHVybiB7IG1lc3NhZ2VIYXNoLCByLCBzLCB2LCByYXdUcmFuc2FjdGlvbiB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVjb3ZlciBhIHRyYW5zYWN0aW9uIGJhc2VkIG9uIGl0cyByYXcgdmFsdWVcclxuICAgKiBAcGFyYW0gcmF3VHggVGhlIHJhdyB0cmFuc2FjdGlvbiBmb3JtYXRcclxuICAgKi9cclxuICBwdWJsaWMgcmVjb3ZlclR4KHJhd1R4OiBzdHJpbmcpIHtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGb3JtYXQgdGhlIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHR4IFRoZSBUcmFuc2FjdGlvbiB0byBlbmNvZGVcclxuICAgKi9cclxuICBwcml2YXRlIHJhd1R4KHR4OiBUeE9iamVjdCk6IGFueVtdIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICcweCcgKyAodHgubm9uY2UgfHwgJycpLFxyXG4gICAgICAnMHgnICsgKHR4Lmdhc1ByaWNlIHx8ICcnKSxcclxuICAgICAgJzB4JyArICh0eC5nYXMgfHwgJycpLFxyXG4gICAgICAnMHgnICsgdHgudG8udG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcweCcsICcnKSB8fCAnJyxcclxuICAgICAgJzB4JyArICh0eC52YWx1ZSB8fCAnJyksXHJcbiAgICAgICcweCcgKyAodHguZGF0YSB8fCAnJylcclxuICAgIF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgaGFzaFxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSBuZWVkZWQgdG8gc2lnbiB0aGUgaGFzaFxyXG4gICAqIEBwYXJhbSBoYXNoIFRoZSBoYXNoIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gY2hhaW5JZCBUaGUgSWQgb2YgdGhlIGNoYWluXHJcbiAgICAqL1xyXG4gIHB1YmxpYyBzaWduKHByaXZhdGVLZXk6IHN0cmluZywgaGFzaDogc3RyaW5nLCBjaGFpbklkPzogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBwcml2S2V5ID0gQnVmZmVyLmZyb20ocHJpdmF0ZUtleS5yZXBsYWNlKCcweCcsICcnKSwgJ2hleCcpO1xyXG4gICAgY29uc3QgZGF0YSA9IEJ1ZmZlci5mcm9tKGhhc2gucmVwbGFjZSgnMHgnLCAnJyksICdoZXgnKTtcclxuICAgIGNvbnN0IGFkZFRvViA9IChjaGFpbklkICYmIGNoYWluSWQgPiAwKSA/IGNoYWluSWQgKiAyICsgOCA6IDA7XHJcbiAgICBjb25zdCB7IHNpZ25hdHVyZSwgcmVjb3ZlcnkgfSA9IHNpZ24oZGF0YSwgcHJpdktleSk7XHJcbiAgICBjb25zdCByID0gc2lnbmF0dXJlLnRvU3RyaW5nKCdoZXgnLCAwLCAzMik7XHJcbiAgICBjb25zdCBzID0gc2lnbmF0dXJlLnRvU3RyaW5nKCdoZXgnLCAzMiwgNjQpO1xyXG4gICAgY29uc3QgdiA9IChyZWNvdmVyeSArIDI3ICsgYWRkVG9WKS50b1N0cmluZygxNik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByOiAnMHgnK3IsXHJcbiAgICAgIHM6ICcweCcrcyxcclxuICAgICAgdjogJzB4Jyt2LFxyXG4gICAgICBzaWduYXR1cmU6IGAweCR7cn0ke3N9JHt2fWBcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYXNoIGEgbWVzc2FnZSB3aXRoIHRoZSBwcmVhbWJsZSBcIlxceDE5RXRoZXJldW0gU2lnbmVkIE1lc3NhZ2U6XFxuXCJcclxuICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBzaWduXHJcbiAgICovXHJcbiAgcHVibGljIGhhc2hNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBtc2cgPSBpc0hleFN0cmljdChtZXNzYWdlKSA/IG1lc3NhZ2UgOiBoZXhUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgY29uc3QgbXNnQnVmZmVyID0gQnVmZmVyLmZyb20obXNnIGFzIHN0cmluZyk7XHJcbiAgICBjb25zdCBwcmVhbWJsZSA9ICdcXHgxOUV0aGVyZXVtIFNpZ25lZCBNZXNzYWdlOlxcbicgKyBtc2cubGVuZ3RoO1xyXG4gICAgY29uc3QgcHJlYW1ibGVCdWZmZXIgPSBCdWZmZXIuZnJvbShwcmVhbWJsZSk7XHJcbiAgICBjb25zdCBldGhNc2cgPSBCdWZmZXIuY29uY2F0KFtwcmVhbWJsZUJ1ZmZlciwgbXNnQnVmZmVyXSk7XHJcbiAgICByZXR1cm4ga2VjY2FrMjU2KGV0aE1zZyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==