/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { TxLogs } from './tx-logs';
import { hexToNumber } from '../utils';
/**
 * @record
 */
export function ITxReceipt() { }
function ITxReceipt_tsickle_Closure_declarations() {
    /**
     * 32 bytes of post-transaction stateroot (pre Byzantium)
     * @type {?|undefined}
     */
    ITxReceipt.prototype.root;
    /**
     * success or failure
     * @type {?|undefined}
     */
    ITxReceipt.prototype.status;
    /**
     * hash of the transaction
     * @type {?}
     */
    ITxReceipt.prototype.transactionHash;
    /**
     * integer of the transactions index position in the block.
     * @type {?}
     */
    ITxReceipt.prototype.transactionIndex;
    /**
     * hash of the block where this transaction was in.
     * @type {?}
     */
    ITxReceipt.prototype.blockHash;
    /**
     * block number where this transaction was in.
     * @type {?}
     */
    ITxReceipt.prototype.blockNumber;
    /**
     * The contract address created, if the transaction was a contract creation, otherwise null.
     * @type {?}
     */
    ITxReceipt.prototype.contractAddress;
    /**
     * The total amount of gas used when this transaction was executed in the block.
     * @type {?}
     */
    ITxReceipt.prototype.cumulativeGasUsed;
    /**
     * The amount of gas used by this specific transaction alone.
     * @type {?}
     */
    ITxReceipt.prototype.gasUsed;
    /**
     * Array of log objects, which this transaction generated.
     * @type {?}
     */
    ITxReceipt.prototype.logs;
    /**
     * Bloom filter for light clients to quickly retrieve related logs.
     * @type {?}
     */
    ITxReceipt.prototype.logsBloom;
}
var TxReceipt = /** @class */ (function () {
    function TxReceipt(ethTxReceipt) {
        if (ethTxReceipt.status) {
            this.status = hexToNumber(ethTxReceipt.status) === 1 ? true : false;
        }
        else {
            this.root = ethTxReceipt.root;
        }
        this.transactionHash = ethTxReceipt.transactionHash;
        this.transactionIndex = hexToNumber(ethTxReceipt.transactionIndex);
        this.blockHash = ethTxReceipt.blockHash;
        this.blockNumber = hexToNumber(ethTxReceipt.blockNumber);
        this.contractAddress = ethTxReceipt.contractAddress;
        this.cumulativeGasUsed = hexToNumber(ethTxReceipt.cumulativeGasUsed);
        this.gasUsed = hexToNumber(ethTxReceipt.gasUsed);
        this.logs = ethTxReceipt.logs.map(function (log) { return new TxLogs(log); });
        this.logsBloom = ethTxReceipt.logsBloom;
    }
    return TxReceipt;
}());
export { TxReceipt };
function TxReceipt_tsickle_Closure_declarations() {
    /** @type {?} */
    TxReceipt.prototype.root;
    /** @type {?} */
    TxReceipt.prototype.status;
    /** @type {?} */
    TxReceipt.prototype.transactionHash;
    /** @type {?} */
    TxReceipt.prototype.transactionIndex;
    /** @type {?} */
    TxReceipt.prototype.blockHash;
    /** @type {?} */
    TxReceipt.prototype.blockNumber;
    /** @type {?} */
    TxReceipt.prototype.contractAddress;
    /** @type {?} */
    TxReceipt.prototype.cumulativeGasUsed;
    /** @type {?} */
    TxReceipt.prototype.gasUsed;
    /** @type {?} */
    TxReceipt.prototype.logs;
    /** @type {?} */
    TxReceipt.prototype.logsBloom;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgtcmVjZWlwdC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC91dGlscy8iLCJzb3VyY2VzIjpbImxpYi9mb3JtYXR0ZXJzL3R4LXJlY2VpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBVyxNQUFNLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQnZDLElBQUE7SUFhRSxtQkFBWSxZQUFZO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ3JFO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUM7UUFDcEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUM7UUFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQztRQUNwRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQWYsQ0FBZSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDO0tBQ3pDO29CQXhESDtJQXlEQyxDQUFBO0FBN0JELHFCQTZCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElUeExvZ3MsIFR4TG9ncyB9IGZyb20gJy4vdHgtbG9ncyc7XHJcbmltcG9ydCB7IGhleFRvTnVtYmVyIH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVHhSZWNlaXB0IHtcclxuICAvKiogMzIgYnl0ZXMgb2YgcG9zdC10cmFuc2FjdGlvbiBzdGF0ZXJvb3QgKHByZSBCeXphbnRpdW0pICAqL1xyXG4gIHJvb3Q/OiBzdHJpbmc7XHJcbiAgLyoqIHN1Y2Nlc3Mgb3IgZmFpbHVyZSAqL1xyXG4gIHN0YXR1cz86IGJvb2xlYW47XHJcbiAgLyoqICBoYXNoIG9mIHRoZSB0cmFuc2FjdGlvbiAqL1xyXG4gIHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nO1xyXG4gIC8qKiBpbnRlZ2VyIG9mIHRoZSB0cmFuc2FjdGlvbnMgaW5kZXggcG9zaXRpb24gaW4gdGhlIGJsb2NrLiAqL1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICAvKiogaGFzaCBvZiB0aGUgYmxvY2sgd2hlcmUgdGhpcyB0cmFuc2FjdGlvbiB3YXMgaW4uICovXHJcbiAgYmxvY2tIYXNoOiBzdHJpbmc7XHJcbiAgLyoqIGJsb2NrIG51bWJlciB3aGVyZSB0aGlzIHRyYW5zYWN0aW9uIHdhcyBpbi4gKi9cclxuICBibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIC8qKiBUaGUgY29udHJhY3QgYWRkcmVzcyBjcmVhdGVkLCBpZiB0aGUgdHJhbnNhY3Rpb24gd2FzIGEgY29udHJhY3QgY3JlYXRpb24sIG90aGVyd2lzZSBudWxsLiAqL1xyXG4gIGNvbnRyYWN0QWRkcmVzczogc3RyaW5nO1xyXG4gIC8qKiBUaGUgdG90YWwgYW1vdW50IG9mIGdhcyB1c2VkIHdoZW4gdGhpcyB0cmFuc2FjdGlvbiB3YXMgZXhlY3V0ZWQgaW4gdGhlIGJsb2NrLiAqL1xyXG4gIGN1bXVsYXRpdmVHYXNVc2VkOiBudW1iZXI7XHJcbiAgLyoqIFRoZSBhbW91bnQgb2YgZ2FzIHVzZWQgYnkgdGhpcyBzcGVjaWZpYyB0cmFuc2FjdGlvbiBhbG9uZS4gKi9cclxuICBnYXNVc2VkOiBudW1iZXI7XHJcbiAgLyoqIEFycmF5IG9mIGxvZyBvYmplY3RzLCB3aGljaCB0aGlzIHRyYW5zYWN0aW9uIGdlbmVyYXRlZC4gKi9cclxuICBsb2dzOiBJVHhMb2dzW107XHJcbiAgLyoqICBCbG9vbSBmaWx0ZXIgZm9yIGxpZ2h0IGNsaWVudHMgdG8gcXVpY2tseSByZXRyaWV2ZSByZWxhdGVkIGxvZ3MuICovXHJcbiAgbG9nc0Jsb29tOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUeFJlY2VpcHQge1xyXG4gIHJvb3Q/OiBzdHJpbmc7XHJcbiAgc3RhdHVzPzogYm9vbGVhbjtcclxuICB0cmFuc2FjdGlvbkhhc2g6IHN0cmluZztcclxuICB0cmFuc2FjdGlvbkluZGV4OiBudW1iZXI7XHJcbiAgYmxvY2tIYXNoOiBzdHJpbmc7XHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICBjb250cmFjdEFkZHJlc3M6IHN0cmluZztcclxuICBjdW11bGF0aXZlR2FzVXNlZDogbnVtYmVyO1xyXG4gIGdhc1VzZWQ6IG51bWJlcjtcclxuICBsb2dzOiBJVHhMb2dzW107XHJcbiAgbG9nc0Jsb29tOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGV0aFR4UmVjZWlwdCkge1xyXG4gICAgaWYgKGV0aFR4UmVjZWlwdC5zdGF0dXMpIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBoZXhUb051bWJlcihldGhUeFJlY2VpcHQuc3RhdHVzKSA9PT0gMSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucm9vdCA9IGV0aFR4UmVjZWlwdC5yb290O1xyXG4gICAgfVxyXG4gICAgdGhpcy50cmFuc2FjdGlvbkhhc2ggPSBldGhUeFJlY2VpcHQudHJhbnNhY3Rpb25IYXNoO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbkluZGV4ID0gaGV4VG9OdW1iZXIoZXRoVHhSZWNlaXB0LnRyYW5zYWN0aW9uSW5kZXgpO1xyXG4gICAgdGhpcy5ibG9ja0hhc2ggPSBldGhUeFJlY2VpcHQuYmxvY2tIYXNoO1xyXG4gICAgdGhpcy5ibG9ja051bWJlciA9IGhleFRvTnVtYmVyKGV0aFR4UmVjZWlwdC5ibG9ja051bWJlcik7XHJcbiAgICB0aGlzLmNvbnRyYWN0QWRkcmVzcyA9IGV0aFR4UmVjZWlwdC5jb250cmFjdEFkZHJlc3M7XHJcbiAgICB0aGlzLmN1bXVsYXRpdmVHYXNVc2VkID0gaGV4VG9OdW1iZXIoZXRoVHhSZWNlaXB0LmN1bXVsYXRpdmVHYXNVc2VkKTtcclxuICAgIHRoaXMuZ2FzVXNlZCA9IGhleFRvTnVtYmVyKGV0aFR4UmVjZWlwdC5nYXNVc2VkKTtcclxuICAgIHRoaXMubG9ncyA9IGV0aFR4UmVjZWlwdC5sb2dzLm1hcChsb2cgPT4gbmV3IFR4TG9ncyhsb2cpKTtcclxuICAgIHRoaXMubG9nc0Jsb29tID0gZXRoVHhSZWNlaXB0LmxvZ3NCbG9vbTtcclxuICB9XHJcbn1cclxuIl19