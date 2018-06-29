/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { hexToNumber } from '../utils';
/**
 * @record
 */
export function ITxLogs() { }
function ITxLogs_tsickle_Closure_declarations() {
    /**
     * contains one or more 32 Bytes non-indexed arguments of the log.
     * @type {?}
     */
    ITxLogs.prototype.data;
    /**
     * Array of 0 to 4 32-Bytes of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event
     * @type {?}
     */
    ITxLogs.prototype.topics;
    /**
     * integer of the log index position in the block. null when its pending log.
     * @type {?}
     */
    ITxLogs.prototype.logIndex;
    /**
     * integer of the transactions index position log was created from. null when its pending log.
     * @type {?}
     */
    ITxLogs.prototype.transactionIndex;
    /**
     * hash of the transactions this log was created from. null when its pending log.
     * @type {?}
     */
    ITxLogs.prototype.transactionHash;
    /**
     * hash of the block where this log was in. null when its pending. null when its pending log.
     * @type {?}
     */
    ITxLogs.prototype.blockHash;
    /**
     * the block number where this log was in. null when its pending. null when its pending log.
     * @type {?}
     */
    ITxLogs.prototype.blockNumber;
    /**
     * address from which this log originated.
     * @type {?}
     */
    ITxLogs.prototype.address;
}
export class TxLogs {
    /**
     * @param {?} ethTxLogs
     */
    constructor(ethTxLogs) {
        this.data = ethTxLogs.data;
        this.topics = ethTxLogs.topics;
        this.logIndex = hexToNumber(ethTxLogs.logIndex);
        this.transactionIndex = hexToNumber(ethTxLogs.transactionIndex);
        this.transactionHash = ethTxLogs.transactionHash;
        this.blockHash = ethTxLogs.blockHash;
        this.blockNumber = hexToNumber(ethTxLogs.blockNumber);
        this.address = ethTxLogs.address;
    }
}
function TxLogs_tsickle_Closure_declarations() {
    /** @type {?} */
    TxLogs.prototype.data;
    /** @type {?} */
    TxLogs.prototype.topics;
    /** @type {?} */
    TxLogs.prototype.logIndex;
    /** @type {?} */
    TxLogs.prototype.transactionIndex;
    /** @type {?} */
    TxLogs.prototype.transactionHash;
    /** @type {?} */
    TxLogs.prototype.blockHash;
    /** @type {?} */
    TxLogs.prototype.blockNumber;
    /** @type {?} */
    TxLogs.prototype.address;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgtbG9ncy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC91dGlscy8iLCJzb3VyY2VzIjpbImxpYi9mb3JtYXR0ZXJzL3R4LWxvZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJ2QyxNQUFNOzs7O0lBVUosWUFBWSxTQUFTO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUNyQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0tBQ2xDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoZXhUb051bWJlciB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVR4TG9ncyB7XHJcbiAgLyoqICBjb250YWlucyBvbmUgb3IgbW9yZSAzMiBCeXRlcyBub24taW5kZXhlZCBhcmd1bWVudHMgb2YgdGhlIGxvZy4gKi9cclxuICBkYXRhOiBzdHJpbmc7XHJcbiAgLyoqIEFycmF5IG9mIDAgdG8gNCAzMi1CeXRlcyBvZiBpbmRleGVkIGxvZyBhcmd1bWVudHMuIChJbiBzb2xpZGl0eTogVGhlIGZpcnN0IHRvcGljIGlzIHRoZSBoYXNoIG9mIHRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50ICovXHJcbiAgdG9waWNzOiBzdHJpbmdbXTtcclxuICAvKiogaW50ZWdlciBvZiB0aGUgbG9nIGluZGV4IHBvc2l0aW9uIGluIHRoZSBibG9jay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGxvZy4gKi9cclxuICBsb2dJbmRleDogbnVtYmVyO1xyXG4gIC8qKiBpbnRlZ2VyIG9mIHRoZSB0cmFuc2FjdGlvbnMgaW5kZXggcG9zaXRpb24gbG9nIHdhcyBjcmVhdGVkIGZyb20uIG51bGwgd2hlbiBpdHMgcGVuZGluZyBsb2cuICovXHJcbiAgdHJhbnNhY3Rpb25JbmRleDogbnVtYmVyO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSB0cmFuc2FjdGlvbnMgdGhpcyBsb2cgd2FzIGNyZWF0ZWQgZnJvbS4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGxvZy4gKi9cclxuICB0cmFuc2FjdGlvbkhhc2g6IHN0cmluZztcclxuICAvKiogaGFzaCBvZiB0aGUgYmxvY2sgd2hlcmUgdGhpcyBsb2cgd2FzIGluLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcuIG51bGwgd2hlbiBpdHMgcGVuZGluZyBsb2cuICovXHJcbiAgYmxvY2tIYXNoOiBzdHJpbmc7XHJcbiAgLyoqIHRoZSBibG9jayBudW1iZXIgd2hlcmUgdGhpcyBsb2cgd2FzIGluLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcuIG51bGwgd2hlbiBpdHMgcGVuZGluZyBsb2cuICovXHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICAvKiogYWRkcmVzcyBmcm9tIHdoaWNoIHRoaXMgbG9nIG9yaWdpbmF0ZWQuICovXHJcbiAgYWRkcmVzczogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHhMb2dzIHtcclxuICBkYXRhOiBzdHJpbmc7XHJcbiAgdG9waWNzOiBzdHJpbmdbXTtcclxuICBsb2dJbmRleDogbnVtYmVyO1xyXG4gIHRyYW5zYWN0aW9uSW5kZXg6IG51bWJlcjtcclxuICB0cmFuc2FjdGlvbkhhc2g6IHN0cmluZztcclxuICBibG9ja0hhc2g6IHN0cmluZztcclxuICBibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZXRoVHhMb2dzKSB7XHJcbiAgICB0aGlzLmRhdGEgPSBldGhUeExvZ3MuZGF0YTtcclxuICAgIHRoaXMudG9waWNzID0gZXRoVHhMb2dzLnRvcGljcztcclxuICAgIHRoaXMubG9nSW5kZXggPSBoZXhUb051bWJlcihldGhUeExvZ3MubG9nSW5kZXgpO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbkluZGV4ID0gaGV4VG9OdW1iZXIoZXRoVHhMb2dzLnRyYW5zYWN0aW9uSW5kZXgpO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbkhhc2ggPSBldGhUeExvZ3MudHJhbnNhY3Rpb25IYXNoO1xyXG4gICAgdGhpcy5ibG9ja0hhc2ggPSBldGhUeExvZ3MuYmxvY2tIYXNoO1xyXG4gICAgdGhpcy5ibG9ja051bWJlciA9IGhleFRvTnVtYmVyKGV0aFR4TG9ncy5ibG9ja051bWJlcik7XHJcbiAgICB0aGlzLmFkZHJlc3MgPSBldGhUeExvZ3MuYWRkcmVzcztcclxuICB9XHJcbn1cclxuIl19