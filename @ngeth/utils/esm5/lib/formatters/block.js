/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { hexToNumber } from '../utils';
/**
 * @record
 */
export function IBlock() { }
function IBlock_tsickle_Closure_declarations() {
    /**
     * the block number. null when its pending block.
     * @type {?}
     */
    IBlock.prototype.number;
    /**
     * hash of the block. null when its pending block.
     * @type {?}
     */
    IBlock.prototype.hash;
    /**
     * hash of the parent block.
     * @type {?}
     */
    IBlock.prototype.parentHash;
    /**
     * hash of the generated proof-of-work. null when its pending block.
     * @type {?}
     */
    IBlock.prototype.nonce;
    /**
     * SHA3 of the uncles data in the block.
     * @type {?}
     */
    IBlock.prototype.sha3Uncles;
    /**
     * the bloom filter for the logs of the block. null when its pending block.
     * @type {?}
     */
    IBlock.prototype.logsBloom;
    /**
     * the root of the transaction trie of the block.
     * @type {?}
     */
    IBlock.prototype.transactionsRoot;
    /**
     * the root of the final state trie of the block.
     * @type {?}
     */
    IBlock.prototype.stateRoot;
    /**
     * the root of the receipts trie of the block.
     * @type {?}
     */
    IBlock.prototype.receiptsRoot;
    /**
     * the address of the beneficiary to whom the mining rewards were given.
     * @type {?}
     */
    IBlock.prototype.miner;
    /**
     * integer of the difficulty for this block.
     * @type {?}
     */
    IBlock.prototype.difficulty;
    /**
     * integer of the total difficulty of the chain until this block.
     * @type {?}
     */
    IBlock.prototype.totalDifficulty;
    /**
     * integer the size of this block in bytes.
     * @type {?}
     */
    IBlock.prototype.size;
    /**
     * the "extra data" field of this block.
     * @type {?}
     */
    IBlock.prototype.extraData;
    /**
     * the maximum gas allowed in this block.
     * @type {?}
     */
    IBlock.prototype.gasLimit;
    /**
     * the total used gas by all transactions in this block.
     * @type {?}
     */
    IBlock.prototype.gasUsed;
    /**
     * the unix timestamp for when the block was collated.
     * @type {?}
     */
    IBlock.prototype.timestamp;
    /**
     * Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
     * @type {?}
     */
    IBlock.prototype.transactions;
    /**
     * Array of uncle hashes.
     * @type {?}
     */
    IBlock.prototype.uncles;
}
var Block = /** @class */ (function () {
    function Block(ethBlock) {
        this.number = hexToNumber(ethBlock.number);
        this.hash = ethBlock.hash;
        this.parentHash = ethBlock.parentHash;
        this.nonce = ethBlock.nonce;
        this.sha3Uncles = ethBlock.sha3Uncles;
        this.logsBloom = ethBlock.logsBloom;
        this.transactionsRoot = ethBlock.transactionsRoot;
        this.stateRoot = ethBlock.stateRoot;
        this.receiptsRoot = ethBlock.receiptsRoot;
        this.miner = ethBlock.miner;
        this.difficulty = hexToNumber(ethBlock.difficulty);
        this.totalDifficulty = hexToNumber(ethBlock.totalDifficulty);
        this.size = hexToNumber(ethBlock.size);
        this.extraData = ethBlock.extraData;
        this.gasLimit = hexToNumber(ethBlock.gasLimit);
        this.gasUsed = hexToNumber(ethBlock.gasUsed);
        this.timestamp = hexToNumber(ethBlock.timestamp);
        this.transactions = ethBlock.transactions;
        this.uncles = ethBlock.uncles;
    }
    return Block;
}());
export { Block };
function Block_tsickle_Closure_declarations() {
    /** @type {?} */
    Block.prototype.number;
    /** @type {?} */
    Block.prototype.hash;
    /** @type {?} */
    Block.prototype.parentHash;
    /** @type {?} */
    Block.prototype.nonce;
    /** @type {?} */
    Block.prototype.sha3Uncles;
    /** @type {?} */
    Block.prototype.logsBloom;
    /** @type {?} */
    Block.prototype.transactionsRoot;
    /** @type {?} */
    Block.prototype.stateRoot;
    /** @type {?} */
    Block.prototype.receiptsRoot;
    /** @type {?} */
    Block.prototype.miner;
    /** @type {?} */
    Block.prototype.difficulty;
    /** @type {?} */
    Block.prototype.totalDifficulty;
    /** @type {?} */
    Block.prototype.size;
    /** @type {?} */
    Block.prototype.extraData;
    /** @type {?} */
    Block.prototype.gasLimit;
    /** @type {?} */
    Block.prototype.gasUsed;
    /** @type {?} */
    Block.prototype.timestamp;
    /** @type {?} */
    Block.prototype.transactions;
    /** @type {?} */
    Block.prototype.uncles;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2suanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvdXRpbHMvIiwic291cmNlcyI6WyJsaWIvZm9ybWF0dGVycy9ibG9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkN2QyxJQUFBO0lBcUJFLGVBQVksUUFBUTtRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQy9CO2dCQXBGSDtJQXFGQyxDQUFBO0FBMUNELGlCQTBDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhleFRvTnVtYmVyIH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQmxvY2sge1xyXG4gIC8qKiB0aGUgYmxvY2sgbnVtYmVyLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcgYmxvY2suICovXHJcbiAgbnVtYmVyOiBudW1iZXI7XHJcbiAgLyoqIGhhc2ggb2YgdGhlIGJsb2NrLiBudWxsIHdoZW4gaXRzIHBlbmRpbmcgYmxvY2suICovXHJcbiAgaGFzaDogc3RyaW5nO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSBwYXJlbnQgYmxvY2suICovXHJcbiAgcGFyZW50SGFzaDogc3RyaW5nO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSBnZW5lcmF0ZWQgcHJvb2Ytb2Ytd29yay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGJsb2NrLiAqL1xyXG4gIG5vbmNlOiBzdHJpbmc7XHJcbiAgLyoqIFNIQTMgb2YgdGhlIHVuY2xlcyBkYXRhIGluIHRoZSBibG9jay4gKi9cclxuICBzaGEzVW5jbGVzOiBzdHJpbmc7XHJcbiAgLyoqIHRoZSBibG9vbSBmaWx0ZXIgZm9yIHRoZSBsb2dzIG9mIHRoZSBibG9jay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGJsb2NrLiAqL1xyXG4gIGxvZ3NCbG9vbTogc3RyaW5nO1xyXG4gIC8qKiB0aGUgcm9vdCBvZiB0aGUgdHJhbnNhY3Rpb24gdHJpZSBvZiB0aGUgYmxvY2suICovXHJcbiAgdHJhbnNhY3Rpb25zUm9vdDogc3RyaW5nO1xyXG4gIC8qKiB0aGUgcm9vdCBvZiB0aGUgZmluYWwgc3RhdGUgdHJpZSBvZiB0aGUgYmxvY2suICovXHJcbiAgc3RhdGVSb290OiBzdHJpbmc7XHJcbiAgLyoqIHRoZSByb290IG9mIHRoZSByZWNlaXB0cyB0cmllIG9mIHRoZSBibG9jay4gKi9cclxuICByZWNlaXB0c1Jvb3Q6IHN0cmluZztcclxuICAvKiogdGhlIGFkZHJlc3Mgb2YgdGhlIGJlbmVmaWNpYXJ5IHRvIHdob20gdGhlIG1pbmluZyByZXdhcmRzIHdlcmUgZ2l2ZW4uICovXHJcbiAgbWluZXI6IHN0cmluZztcclxuICAvKiogaW50ZWdlciBvZiB0aGUgZGlmZmljdWx0eSBmb3IgdGhpcyBibG9jay4gKi9cclxuICBkaWZmaWN1bHR5OiBudW1iZXI7XHJcbiAgLyoqICBpbnRlZ2VyIG9mIHRoZSB0b3RhbCBkaWZmaWN1bHR5IG9mIHRoZSBjaGFpbiB1bnRpbCB0aGlzIGJsb2NrLiAqL1xyXG4gIHRvdGFsRGlmZmljdWx0eTogbnVtYmVyO1xyXG4gIC8qKiBpbnRlZ2VyIHRoZSBzaXplIG9mIHRoaXMgYmxvY2sgaW4gYnl0ZXMuICovXHJcbiAgc2l6ZTogbnVtYmVyO1xyXG4gIC8qKiB0aGUgXCJleHRyYSBkYXRhXCIgZmllbGQgb2YgdGhpcyBibG9jay4gKi9cclxuICBleHRyYURhdGE6IHN0cmluZztcclxuICAvKiogdGhlIG1heGltdW0gZ2FzIGFsbG93ZWQgaW4gdGhpcyBibG9jay4gKi9cclxuICBnYXNMaW1pdDogbnVtYmVyO1xyXG4gIC8qKiB0aGUgdG90YWwgdXNlZCBnYXMgYnkgYWxsIHRyYW5zYWN0aW9ucyBpbiB0aGlzIGJsb2NrLiAqL1xyXG4gIGdhc1VzZWQ6IG51bWJlcjtcclxuICAvKiogdGhlIHVuaXggdGltZXN0YW1wIGZvciB3aGVuIHRoZSBibG9jayB3YXMgY29sbGF0ZWQuICovXHJcbiAgdGltZXN0YW1wOiBudW1iZXI7XHJcbiAgLyoqIEFycmF5IG9mIHRyYW5zYWN0aW9uIG9iamVjdHMsIG9yIDMyIEJ5dGVzIHRyYW5zYWN0aW9uIGhhc2hlcyBkZXBlbmRpbmcgb24gdGhlIGxhc3QgZ2l2ZW4gcGFyYW1ldGVyLiAqL1xyXG4gIHRyYW5zYWN0aW9uczogc3RyaW5nW107XHJcbiAgLyoqIEFycmF5IG9mIHVuY2xlIGhhc2hlcy4gKi9cclxuICB1bmNsZXM6IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmxvY2sgaW1wbGVtZW50cyBJQmxvY2sge1xyXG4gIG51bWJlcjogbnVtYmVyO1xyXG4gIGhhc2g6IHN0cmluZztcclxuICBwYXJlbnRIYXNoOiBzdHJpbmc7XHJcbiAgbm9uY2U6IHN0cmluZztcclxuICBzaGEzVW5jbGVzOiBzdHJpbmc7XHJcbiAgbG9nc0Jsb29tOiBzdHJpbmc7XHJcbiAgdHJhbnNhY3Rpb25zUm9vdDogc3RyaW5nO1xyXG4gIHN0YXRlUm9vdDogc3RyaW5nO1xyXG4gIHJlY2VpcHRzUm9vdDogc3RyaW5nO1xyXG4gIG1pbmVyOiBzdHJpbmc7XHJcbiAgZGlmZmljdWx0eTogbnVtYmVyO1xyXG4gIHRvdGFsRGlmZmljdWx0eTogbnVtYmVyO1xyXG4gIHNpemU6IG51bWJlcjtcclxuICBleHRyYURhdGE6IHN0cmluZztcclxuICBnYXNMaW1pdDogbnVtYmVyO1xyXG4gIGdhc1VzZWQ6IG51bWJlcjtcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICB0cmFuc2FjdGlvbnM6IHN0cmluZ1tdO1xyXG4gIHVuY2xlczogc3RyaW5nW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKGV0aEJsb2NrKSB7XHJcbiAgICB0aGlzLm51bWJlciA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLm51bWJlcik7XHJcbiAgICB0aGlzLmhhc2ggPSBldGhCbG9jay5oYXNoO1xyXG4gICAgdGhpcy5wYXJlbnRIYXNoID0gZXRoQmxvY2sucGFyZW50SGFzaDtcclxuICAgIHRoaXMubm9uY2UgPSBldGhCbG9jay5ub25jZTtcclxuICAgIHRoaXMuc2hhM1VuY2xlcyA9IGV0aEJsb2NrLnNoYTNVbmNsZXM7XHJcbiAgICB0aGlzLmxvZ3NCbG9vbSA9IGV0aEJsb2NrLmxvZ3NCbG9vbTtcclxuICAgIHRoaXMudHJhbnNhY3Rpb25zUm9vdCA9IGV0aEJsb2NrLnRyYW5zYWN0aW9uc1Jvb3Q7XHJcbiAgICB0aGlzLnN0YXRlUm9vdCA9IGV0aEJsb2NrLnN0YXRlUm9vdDtcclxuICAgIHRoaXMucmVjZWlwdHNSb290ID0gZXRoQmxvY2sucmVjZWlwdHNSb290O1xyXG4gICAgdGhpcy5taW5lciA9IGV0aEJsb2NrLm1pbmVyO1xyXG4gICAgdGhpcy5kaWZmaWN1bHR5ID0gaGV4VG9OdW1iZXIoZXRoQmxvY2suZGlmZmljdWx0eSk7XHJcbiAgICB0aGlzLnRvdGFsRGlmZmljdWx0eSA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLnRvdGFsRGlmZmljdWx0eSk7XHJcbiAgICB0aGlzLnNpemUgPSBoZXhUb051bWJlcihldGhCbG9jay5zaXplKTtcclxuICAgIHRoaXMuZXh0cmFEYXRhID0gZXRoQmxvY2suZXh0cmFEYXRhO1xyXG4gICAgdGhpcy5nYXNMaW1pdCA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLmdhc0xpbWl0KTtcclxuICAgIHRoaXMuZ2FzVXNlZCA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLmdhc1VzZWQpO1xyXG4gICAgdGhpcy50aW1lc3RhbXAgPSBoZXhUb051bWJlcihldGhCbG9jay50aW1lc3RhbXApO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbnMgPSBldGhCbG9jay50cmFuc2FjdGlvbnM7XHJcbiAgICB0aGlzLnVuY2xlcyA9IGV0aEJsb2NrLnVuY2xlcztcclxuICB9XHJcbn1cclxuIl19