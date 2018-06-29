/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { hexToNumber, toBN } from '../utils';
/**
 * @record
 */
export function ITransaction() { }
function ITransaction_tsickle_Closure_declarations() {
    /**
     * hash of the transaction.
     * @type {?}
     */
    ITransaction.prototype.hash;
    /**
     * The number of transactions made by the sender prior to this one.
     * @type {?}
     */
    ITransaction.prototype.nonce;
    /**
     * Hash of the block where this transaction was in. null when its pending.
     * @type {?}
     */
    ITransaction.prototype.blockHash;
    /**
     * Block number where this transaction was in. null when its pending.
     * @type {?}
     */
    ITransaction.prototype.blockNumber;
    /**
     * Integer of the transactions index position in the block. null when its pending.
     * @type {?}
     */
    ITransaction.prototype.transactionIndex;
    /**
     * Address of the sender.
     * @type {?}
     */
    ITransaction.prototype.from;
    /**
     * Address of the receiver. null when its a contract creation transaction.
     * @type {?}
     */
    ITransaction.prototype.to;
    /**
     * BigNumber::value transferred in Wei
     * @type {?}
     */
    ITransaction.prototype.value;
    /**
     * Gas provided by the sender.
     * @type {?}
     */
    ITransaction.prototype.gas;
    /**
     * Gas price provided by the sender in Wei.
     * @type {?}
     */
    ITransaction.prototype.gasPrice;
    /**
     * The data send along with the transaction.
     * @type {?}
     */
    ITransaction.prototype.input;
}
var Transaction = /** @class */ (function () {
    function Transaction(ethTx) {
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
    return Transaction;
}());
export { Transaction };
function Transaction_tsickle_Closure_declarations() {
    /** @type {?} */
    Transaction.prototype.hash;
    /** @type {?} */
    Transaction.prototype.nonce;
    /** @type {?} */
    Transaction.prototype.blockHash;
    /** @type {?} */
    Transaction.prototype.blockNumber;
    /** @type {?} */
    Transaction.prototype.transactionIndex;
    /** @type {?} */
    Transaction.prototype.from;
    /** @type {?} */
    Transaction.prototype.to;
    /** @type {?} */
    Transaction.prototype.value;
    /** @type {?} */
    Transaction.prototype.gas;
    /** @type {?} */
    Transaction.prototype.gasPrice;
    /** @type {?} */
    Transaction.prototype.input;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvdXRpbHMvIiwic291cmNlcyI6WyJsaWIvZm9ybWF0dGVycy90cmFuc2FjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxVQUFVLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkI3QyxJQUFBO0lBYUUscUJBQVksS0FBSztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztLQUMxQjtzQkFwREg7SUFxREMsQ0FBQTtBQTFCRCx1QkEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoZXhUb051bWJlciwgdG9CTiB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zYWN0aW9uIHtcclxuICAvKiogaGFzaCBvZiB0aGUgdHJhbnNhY3Rpb24uICovXHJcbiAgaGFzaDogc3RyaW5nO1xyXG4gIC8qKiBUaGUgbnVtYmVyIG9mIHRyYW5zYWN0aW9ucyBtYWRlIGJ5IHRoZSBzZW5kZXIgcHJpb3IgdG8gdGhpcyBvbmUuICovXHJcbiAgbm9uY2U6IG51bWJlcjtcclxuICAvKiogSGFzaCBvZiB0aGUgYmxvY2sgd2hlcmUgdGhpcyB0cmFuc2FjdGlvbiB3YXMgaW4uIG51bGwgd2hlbiBpdHMgcGVuZGluZy4gKi9cclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICAvKiogQmxvY2sgbnVtYmVyIHdoZXJlIHRoaXMgdHJhbnNhY3Rpb24gd2FzIGluLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcuICovXHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICAvKiogSW50ZWdlciBvZiB0aGUgdHJhbnNhY3Rpb25zIGluZGV4IHBvc2l0aW9uIGluIHRoZSBibG9jay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nLiAqL1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICAvKiogQWRkcmVzcyBvZiB0aGUgc2VuZGVyLiAqL1xyXG4gIGZyb206IHN0cmluZztcclxuICAvKiogQWRkcmVzcyBvZiB0aGUgcmVjZWl2ZXIuIG51bGwgd2hlbiBpdHMgYSBjb250cmFjdCBjcmVhdGlvbiB0cmFuc2FjdGlvbi4gKi9cclxuICB0bzogc3RyaW5nO1xyXG4gIC8qKiBCaWdOdW1iZXI6OnZhbHVlIHRyYW5zZmVycmVkIGluIFdlaSAgKi9cclxuICB2YWx1ZTogc3RyaW5nO1xyXG4gIC8qKiBHYXMgcHJvdmlkZWQgYnkgdGhlIHNlbmRlci4gKi9cclxuICBnYXM6IG51bWJlcjtcclxuICAvKiogR2FzIHByaWNlIHByb3ZpZGVkIGJ5IHRoZSBzZW5kZXIgaW4gV2VpLiAqL1xyXG4gIGdhc1ByaWNlOiBudW1iZXI7XHJcbiAgLyoqIFRoZSBkYXRhIHNlbmQgYWxvbmcgd2l0aCB0aGUgdHJhbnNhY3Rpb24uICovXHJcbiAgaW5wdXQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zYWN0aW9uIGltcGxlbWVudHMgSVRyYW5zYWN0aW9uIHtcclxuICBoYXNoOiBzdHJpbmc7XHJcbiAgbm9uY2U6IG51bWJlcjtcclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICBibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICBmcm9tOiBzdHJpbmc7XHJcbiAgdG86IHN0cmluZztcclxuICB2YWx1ZTogc3RyaW5nO1xyXG4gIGdhczogbnVtYmVyO1xyXG4gIGdhc1ByaWNlOiBudW1iZXI7XHJcbiAgaW5wdXQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZXRoVHgpIHtcclxuICAgIHRoaXMuaGFzaCA9IGV0aFR4Lmhhc2g7XHJcbiAgICB0aGlzLm5vbmNlID0gaGV4VG9OdW1iZXIoZXRoVHgubm9uY2UpO1xyXG4gICAgdGhpcy5ibG9ja0hhc2ggPSBldGhUeC5ibG9ja0hhc2g7XHJcbiAgICB0aGlzLmJsb2NrTnVtYmVyID0gaGV4VG9OdW1iZXIoZXRoVHguYmxvY2tOdW1iZXIpO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbkluZGV4ID0gaGV4VG9OdW1iZXIoZXRoVHgudHJhbnNhY3Rpb25JbmRleCk7XHJcbiAgICB0aGlzLmZyb20gPSBldGhUeC5mcm9tO1xyXG4gICAgdGhpcy50byA9IGV0aFR4LnRvO1xyXG4gICAgdGhpcy52YWx1ZSA9IHRvQk4oZXRoVHgudmFsdWUpLnRvU3RyaW5nKDEwKTtcclxuICAgIHRoaXMuZ2FzID0gaGV4VG9OdW1iZXIoZXRoVHguZ2FzKTtcclxuICAgIHRoaXMuZ2FzUHJpY2UgPSBoZXhUb051bWJlcihldGhUeC5nYXNQcmljZSk7XHJcbiAgICB0aGlzLmlucHV0ID0gZXRoVHguaW5wdXQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==