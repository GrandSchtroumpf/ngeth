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
export class TxReceipt {
    /**
     * @param {?} ethTxReceipt
     */
    constructor(ethTxReceipt) {
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
        this.logs = ethTxReceipt.logs.map(log => new TxLogs(log));
        this.logsBloom = ethTxReceipt.logsBloom;
    }
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgtcmVjZWlwdC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC91dGlscy8iLCJzb3VyY2VzIjpbImxpYi9mb3JtYXR0ZXJzL3R4LXJlY2VpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBVyxNQUFNLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQnZDLE1BQU07Ozs7SUFhSixZQUFZLFlBQVk7UUFDdEIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDckU7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztTQUMvQjtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQztRQUNwRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQztRQUN4QyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLGVBQWUsR0FBRyxZQUFZLENBQUMsZUFBZSxDQUFDO1FBQ3BELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQztLQUN6QztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVR4TG9ncywgVHhMb2dzIH0gZnJvbSAnLi90eC1sb2dzJztcclxuaW1wb3J0IHsgaGV4VG9OdW1iZXIgfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElUeFJlY2VpcHQge1xyXG4gIC8qKiAzMiBieXRlcyBvZiBwb3N0LXRyYW5zYWN0aW9uIHN0YXRlcm9vdCAocHJlIEJ5emFudGl1bSkgICovXHJcbiAgcm9vdD86IHN0cmluZztcclxuICAvKiogc3VjY2VzcyBvciBmYWlsdXJlICovXHJcbiAgc3RhdHVzPzogYm9vbGVhbjtcclxuICAvKiogIGhhc2ggb2YgdGhlIHRyYW5zYWN0aW9uICovXHJcbiAgdHJhbnNhY3Rpb25IYXNoOiBzdHJpbmc7XHJcbiAgLyoqIGludGVnZXIgb2YgdGhlIHRyYW5zYWN0aW9ucyBpbmRleCBwb3NpdGlvbiBpbiB0aGUgYmxvY2suICovXHJcbiAgdHJhbnNhY3Rpb25JbmRleDogbnVtYmVyO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSBibG9jayB3aGVyZSB0aGlzIHRyYW5zYWN0aW9uIHdhcyBpbi4gKi9cclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICAvKiogYmxvY2sgbnVtYmVyIHdoZXJlIHRoaXMgdHJhbnNhY3Rpb24gd2FzIGluLiAqL1xyXG4gIGJsb2NrTnVtYmVyOiBudW1iZXI7XHJcbiAgLyoqIFRoZSBjb250cmFjdCBhZGRyZXNzIGNyZWF0ZWQsIGlmIHRoZSB0cmFuc2FjdGlvbiB3YXMgYSBjb250cmFjdCBjcmVhdGlvbiwgb3RoZXJ3aXNlIG51bGwuICovXHJcbiAgY29udHJhY3RBZGRyZXNzOiBzdHJpbmc7XHJcbiAgLyoqIFRoZSB0b3RhbCBhbW91bnQgb2YgZ2FzIHVzZWQgd2hlbiB0aGlzIHRyYW5zYWN0aW9uIHdhcyBleGVjdXRlZCBpbiB0aGUgYmxvY2suICovXHJcbiAgY3VtdWxhdGl2ZUdhc1VzZWQ6IG51bWJlcjtcclxuICAvKiogVGhlIGFtb3VudCBvZiBnYXMgdXNlZCBieSB0aGlzIHNwZWNpZmljIHRyYW5zYWN0aW9uIGFsb25lLiAqL1xyXG4gIGdhc1VzZWQ6IG51bWJlcjtcclxuICAvKiogQXJyYXkgb2YgbG9nIG9iamVjdHMsIHdoaWNoIHRoaXMgdHJhbnNhY3Rpb24gZ2VuZXJhdGVkLiAqL1xyXG4gIGxvZ3M6IElUeExvZ3NbXTtcclxuICAvKiogIEJsb29tIGZpbHRlciBmb3IgbGlnaHQgY2xpZW50cyB0byBxdWlja2x5IHJldHJpZXZlIHJlbGF0ZWQgbG9ncy4gKi9cclxuICBsb2dzQmxvb206IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFR4UmVjZWlwdCB7XHJcbiAgcm9vdD86IHN0cmluZztcclxuICBzdGF0dXM/OiBib29sZWFuO1xyXG4gIHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nO1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICBibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIGNvbnRyYWN0QWRkcmVzczogc3RyaW5nO1xyXG4gIGN1bXVsYXRpdmVHYXNVc2VkOiBudW1iZXI7XHJcbiAgZ2FzVXNlZDogbnVtYmVyO1xyXG4gIGxvZ3M6IElUeExvZ3NbXTtcclxuICBsb2dzQmxvb206IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZXRoVHhSZWNlaXB0KSB7XHJcbiAgICBpZiAoZXRoVHhSZWNlaXB0LnN0YXR1cykge1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IGhleFRvTnVtYmVyKGV0aFR4UmVjZWlwdC5zdGF0dXMpID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yb290ID0gZXRoVHhSZWNlaXB0LnJvb3Q7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyYW5zYWN0aW9uSGFzaCA9IGV0aFR4UmVjZWlwdC50cmFuc2FjdGlvbkhhc2g7XHJcbiAgICB0aGlzLnRyYW5zYWN0aW9uSW5kZXggPSBoZXhUb051bWJlcihldGhUeFJlY2VpcHQudHJhbnNhY3Rpb25JbmRleCk7XHJcbiAgICB0aGlzLmJsb2NrSGFzaCA9IGV0aFR4UmVjZWlwdC5ibG9ja0hhc2g7XHJcbiAgICB0aGlzLmJsb2NrTnVtYmVyID0gaGV4VG9OdW1iZXIoZXRoVHhSZWNlaXB0LmJsb2NrTnVtYmVyKTtcclxuICAgIHRoaXMuY29udHJhY3RBZGRyZXNzID0gZXRoVHhSZWNlaXB0LmNvbnRyYWN0QWRkcmVzcztcclxuICAgIHRoaXMuY3VtdWxhdGl2ZUdhc1VzZWQgPSBoZXhUb051bWJlcihldGhUeFJlY2VpcHQuY3VtdWxhdGl2ZUdhc1VzZWQpO1xyXG4gICAgdGhpcy5nYXNVc2VkID0gaGV4VG9OdW1iZXIoZXRoVHhSZWNlaXB0Lmdhc1VzZWQpO1xyXG4gICAgdGhpcy5sb2dzID0gZXRoVHhSZWNlaXB0LmxvZ3MubWFwKGxvZyA9PiBuZXcgVHhMb2dzKGxvZykpO1xyXG4gICAgdGhpcy5sb2dzQmxvb20gPSBldGhUeFJlY2VpcHQubG9nc0Jsb29tO1xyXG4gIH1cclxufVxyXG4iXX0=