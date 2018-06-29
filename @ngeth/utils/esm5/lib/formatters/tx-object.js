/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { BN } from 'bn.js';
/**
 * @record
 */
export function ITxObject() { }
function ITxObject_tsickle_Closure_declarations() {
    /**
     * The address the transaction is send from.
     * @type {?}
     */
    ITxObject.prototype.from;
    /**
     * The address the transaction is directed to.
     * @type {?}
     */
    ITxObject.prototype.to;
    /**
     * (default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.
     * @type {?}
     */
    ITxObject.prototype.gas;
    /**
     * Integer of the gasPrice used for each paid gas
     * @type {?}
     */
    ITxObject.prototype.gasPrice;
    /**
     * Integer of the value sent with if (tx transaction
     * @type {?}
     */
    ITxObject.prototype.value;
    /**
     * The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
     * @type {?}
     */
    ITxObject.prototype.data;
    /**
     * Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
     * @type {?}
     */
    ITxObject.prototype.nonce;
}
var TxObject = /** @class */ (function () {
    function TxObject(tx) {
        if (tx.from)
            this.from = tx.from;
        if (tx.to)
            this.to = tx.to;
        if (tx.data)
            this.data = tx.data;
        if (tx.gas)
            this.gas = new BN(tx.gas, 10).toString(16);
        if (tx.gasPrice)
            this.gasPrice = new BN(tx.gasPrice, 10).toString(16);
        if (tx.value)
            this.value = new BN(tx.value, 10).toString(16);
        if (tx.nonce)
            this.nonce = new BN(tx.nonce, 10).toString(16);
    }
    return TxObject;
}());
export { TxObject };
function TxObject_tsickle_Closure_declarations() {
    /**
     * The address the transaction is send from.
     * @type {?}
     */
    TxObject.prototype.from;
    /**
     * The address the transaction is directed to.
     * @type {?}
     */
    TxObject.prototype.to;
    /**
     * (default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.
     * @type {?}
     */
    TxObject.prototype.gas;
    /**
     * Integer of the gasPrice used for each paid gas
     * @type {?}
     */
    TxObject.prototype.gasPrice;
    /**
     * Integer of the value sent with if (tx transaction
     * @type {?}
     */
    TxObject.prototype.value;
    /**
     * The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
     * @type {?}
     */
    TxObject.prototype.data;
    /**
     * Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
     * @type {?}
     */
    TxObject.prototype.nonce;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgtb2JqZWN0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3V0aWxzLyIsInNvdXJjZXMiOlsibGliL2Zvcm1hdHRlcnMvdHgtb2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sT0FBTyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQjNCLElBQUE7SUFnQkUsa0JBQVksRUFBc0I7UUFDaEMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztZQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFFakMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkQsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7S0FFOUQ7bUJBN0NIO0lBOENDLENBQUE7QUEzQkQsb0JBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQk4gfSBmcm9tICdibi5qcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElUeE9iamVjdCB7XHJcbiAgICAvKiogVGhlIGFkZHJlc3MgdGhlIHRyYW5zYWN0aW9uIGlzIHNlbmQgZnJvbS4gKi9cclxuICAgIGZyb206IHN0cmluZztcclxuICAgIC8qKiBUaGUgYWRkcmVzcyB0aGUgdHJhbnNhY3Rpb24gaXMgZGlyZWN0ZWQgdG8uICovXHJcbiAgICB0bzogc3RyaW5nO1xyXG4gICAgLyoqIChkZWZhdWx0OiA5MDAwMCkgSW50ZWdlciBvZiB0aGUgZ2FzIHByb3ZpZGVkIGZvciB0aGUgdHJhbnNhY3Rpb24gZXhlY3V0aW9uLiBJdCB3aWxsIHJldHVybiB1bnVzZWQgZ2FzLiAqL1xyXG4gICAgZ2FzOiBudW1iZXI7XHJcbiAgICAvKiogSW50ZWdlciBvZiB0aGUgZ2FzUHJpY2UgdXNlZCBmb3IgZWFjaCBwYWlkIGdhcyAqL1xyXG4gICAgZ2FzUHJpY2U6IHN0cmluZztcclxuICAgIC8qKiBJbnRlZ2VyIG9mIHRoZSB2YWx1ZSBzZW50IHdpdGggaWYgKHR4IHRyYW5zYWN0aW9uICovXHJcbiAgICB2YWx1ZTogc3RyaW5nO1xyXG4gICAgLyoqIFRoZSBjb21waWxlZCBjb2RlIG9mIGEgY29udHJhY3QgT1IgdGhlIGhhc2ggb2YgdGhlIGludm9rZWQgbWV0aG9kIHNpZ25hdHVyZSBhbmQgZW5jb2RlZCBwYXJhbWV0ZXJzLiAqL1xyXG4gICAgZGF0YTogc3RyaW5nO1xyXG4gICAgLyoqIEludGVnZXIgb2YgYSBub25jZS4gVGhpcyBhbGxvd3MgdG8gb3ZlcndyaXRlIHlvdXIgb3duIHBlbmRpbmcgdHJhbnNhY3Rpb25zIHRoYXQgdXNlIHRoZSBzYW1lIG5vbmNlLiAqL1xyXG4gICAgbm9uY2U6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFR4T2JqZWN0IHtcclxuICAvKiogVGhlIGFkZHJlc3MgdGhlIHRyYW5zYWN0aW9uIGlzIHNlbmQgZnJvbS4gKi9cclxuICBwdWJsaWMgZnJvbTogc3RyaW5nO1xyXG4gIC8qKiBUaGUgYWRkcmVzcyB0aGUgdHJhbnNhY3Rpb24gaXMgZGlyZWN0ZWQgdG8uICovXHJcbiAgcHVibGljIHRvOiBzdHJpbmc7XHJcbiAgLyoqIChkZWZhdWx0OiA5MDAwMCkgSW50ZWdlciBvZiB0aGUgZ2FzIHByb3ZpZGVkIGZvciB0aGUgdHJhbnNhY3Rpb24gZXhlY3V0aW9uLiBJdCB3aWxsIHJldHVybiB1bnVzZWQgZ2FzLiAqL1xyXG4gIHB1YmxpYyBnYXM6IHN0cmluZztcclxuICAvKiogSW50ZWdlciBvZiB0aGUgZ2FzUHJpY2UgdXNlZCBmb3IgZWFjaCBwYWlkIGdhcyAqL1xyXG4gIHB1YmxpYyBnYXNQcmljZTogc3RyaW5nO1xyXG4gIC8qKiBJbnRlZ2VyIG9mIHRoZSB2YWx1ZSBzZW50IHdpdGggaWYgKHR4IHRyYW5zYWN0aW9uICovXHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgLyoqIFRoZSBjb21waWxlZCBjb2RlIG9mIGEgY29udHJhY3QgT1IgdGhlIGhhc2ggb2YgdGhlIGludm9rZWQgbWV0aG9kIHNpZ25hdHVyZSBhbmQgZW5jb2RlZCBwYXJhbWV0ZXJzLiAqL1xyXG4gIHB1YmxpYyBkYXRhOiBzdHJpbmc7XHJcbiAgLyoqIEludGVnZXIgb2YgYSBub25jZS4gVGhpcyBhbGxvd3MgdG8gb3ZlcndyaXRlIHlvdXIgb3duIHBlbmRpbmcgdHJhbnNhY3Rpb25zIHRoYXQgdXNlIHRoZSBzYW1lIG5vbmNlLiAqL1xyXG4gIHB1YmxpYyBub25jZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih0eDogUGFydGlhbDxJVHhPYmplY3Q+KSB7XHJcbiAgICBpZiAodHguZnJvbSkgdGhpcy5mcm9tID0gdHguZnJvbTtcclxuICAgIGlmICh0eC50bykgdGhpcy50byA9IHR4LnRvO1xyXG4gICAgaWYgKHR4LmRhdGEpIHRoaXMuZGF0YSA9IHR4LmRhdGE7XHJcblxyXG4gICAgaWYgKHR4LmdhcykgdGhpcy5nYXMgPSBuZXcgQk4odHguZ2FzLCAxMCkudG9TdHJpbmcoMTYpO1xyXG4gICAgaWYgKHR4Lmdhc1ByaWNlKSB0aGlzLmdhc1ByaWNlID0gbmV3IEJOKHR4Lmdhc1ByaWNlLCAxMCkudG9TdHJpbmcoMTYpO1xyXG4gICAgaWYgKHR4LnZhbHVlKSB0aGlzLnZhbHVlID0gbmV3IEJOKHR4LnZhbHVlLCAxMCkudG9TdHJpbmcoMTYpO1xyXG4gICAgaWYgKHR4Lm5vbmNlKSB0aGlzLm5vbmNlID0gbmV3IEJOKHR4Lm5vbmNlLCAxMCkudG9TdHJpbmcoMTYpO1xyXG5cclxuICB9XHJcbn1cclxuIl19