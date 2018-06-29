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
export class Block {
    /**
     * @param {?} ethBlock
     */
    constructor(ethBlock) {
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
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2suanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvdXRpbHMvIiwic291cmNlcyI6WyJsaWIvZm9ybWF0dGVycy9ibG9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkN2QyxNQUFNOzs7O0lBcUJKLFlBQVksUUFBUTtRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQy9CO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoZXhUb051bWJlciB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUJsb2NrIHtcclxuICAvKiogdGhlIGJsb2NrIG51bWJlci4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGJsb2NrLiAqL1xyXG4gIG51bWJlcjogbnVtYmVyO1xyXG4gIC8qKiBoYXNoIG9mIHRoZSBibG9jay4gbnVsbCB3aGVuIGl0cyBwZW5kaW5nIGJsb2NrLiAqL1xyXG4gIGhhc2g6IHN0cmluZztcclxuICAvKiogaGFzaCBvZiB0aGUgcGFyZW50IGJsb2NrLiAqL1xyXG4gIHBhcmVudEhhc2g6IHN0cmluZztcclxuICAvKiogaGFzaCBvZiB0aGUgZ2VuZXJhdGVkIHByb29mLW9mLXdvcmsuIG51bGwgd2hlbiBpdHMgcGVuZGluZyBibG9jay4gKi9cclxuICBub25jZTogc3RyaW5nO1xyXG4gIC8qKiBTSEEzIG9mIHRoZSB1bmNsZXMgZGF0YSBpbiB0aGUgYmxvY2suICovXHJcbiAgc2hhM1VuY2xlczogc3RyaW5nO1xyXG4gIC8qKiB0aGUgYmxvb20gZmlsdGVyIGZvciB0aGUgbG9ncyBvZiB0aGUgYmxvY2suIG51bGwgd2hlbiBpdHMgcGVuZGluZyBibG9jay4gKi9cclxuICBsb2dzQmxvb206IHN0cmluZztcclxuICAvKiogdGhlIHJvb3Qgb2YgdGhlIHRyYW5zYWN0aW9uIHRyaWUgb2YgdGhlIGJsb2NrLiAqL1xyXG4gIHRyYW5zYWN0aW9uc1Jvb3Q6IHN0cmluZztcclxuICAvKiogdGhlIHJvb3Qgb2YgdGhlIGZpbmFsIHN0YXRlIHRyaWUgb2YgdGhlIGJsb2NrLiAqL1xyXG4gIHN0YXRlUm9vdDogc3RyaW5nO1xyXG4gIC8qKiB0aGUgcm9vdCBvZiB0aGUgcmVjZWlwdHMgdHJpZSBvZiB0aGUgYmxvY2suICovXHJcbiAgcmVjZWlwdHNSb290OiBzdHJpbmc7XHJcbiAgLyoqIHRoZSBhZGRyZXNzIG9mIHRoZSBiZW5lZmljaWFyeSB0byB3aG9tIHRoZSBtaW5pbmcgcmV3YXJkcyB3ZXJlIGdpdmVuLiAqL1xyXG4gIG1pbmVyOiBzdHJpbmc7XHJcbiAgLyoqIGludGVnZXIgb2YgdGhlIGRpZmZpY3VsdHkgZm9yIHRoaXMgYmxvY2suICovXHJcbiAgZGlmZmljdWx0eTogbnVtYmVyO1xyXG4gIC8qKiAgaW50ZWdlciBvZiB0aGUgdG90YWwgZGlmZmljdWx0eSBvZiB0aGUgY2hhaW4gdW50aWwgdGhpcyBibG9jay4gKi9cclxuICB0b3RhbERpZmZpY3VsdHk6IG51bWJlcjtcclxuICAvKiogaW50ZWdlciB0aGUgc2l6ZSBvZiB0aGlzIGJsb2NrIGluIGJ5dGVzLiAqL1xyXG4gIHNpemU6IG51bWJlcjtcclxuICAvKiogdGhlIFwiZXh0cmEgZGF0YVwiIGZpZWxkIG9mIHRoaXMgYmxvY2suICovXHJcbiAgZXh0cmFEYXRhOiBzdHJpbmc7XHJcbiAgLyoqIHRoZSBtYXhpbXVtIGdhcyBhbGxvd2VkIGluIHRoaXMgYmxvY2suICovXHJcbiAgZ2FzTGltaXQ6IG51bWJlcjtcclxuICAvKiogdGhlIHRvdGFsIHVzZWQgZ2FzIGJ5IGFsbCB0cmFuc2FjdGlvbnMgaW4gdGhpcyBibG9jay4gKi9cclxuICBnYXNVc2VkOiBudW1iZXI7XHJcbiAgLyoqIHRoZSB1bml4IHRpbWVzdGFtcCBmb3Igd2hlbiB0aGUgYmxvY2sgd2FzIGNvbGxhdGVkLiAqL1xyXG4gIHRpbWVzdGFtcDogbnVtYmVyO1xyXG4gIC8qKiBBcnJheSBvZiB0cmFuc2FjdGlvbiBvYmplY3RzLCBvciAzMiBCeXRlcyB0cmFuc2FjdGlvbiBoYXNoZXMgZGVwZW5kaW5nIG9uIHRoZSBsYXN0IGdpdmVuIHBhcmFtZXRlci4gKi9cclxuICB0cmFuc2FjdGlvbnM6IHN0cmluZ1tdO1xyXG4gIC8qKiBBcnJheSBvZiB1bmNsZSBoYXNoZXMuICovXHJcbiAgdW5jbGVzOiBzdHJpbmdbXTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJsb2NrIGltcGxlbWVudHMgSUJsb2NrIHtcclxuICBudW1iZXI6IG51bWJlcjtcclxuICBoYXNoOiBzdHJpbmc7XHJcbiAgcGFyZW50SGFzaDogc3RyaW5nO1xyXG4gIG5vbmNlOiBzdHJpbmc7XHJcbiAgc2hhM1VuY2xlczogc3RyaW5nO1xyXG4gIGxvZ3NCbG9vbTogc3RyaW5nO1xyXG4gIHRyYW5zYWN0aW9uc1Jvb3Q6IHN0cmluZztcclxuICBzdGF0ZVJvb3Q6IHN0cmluZztcclxuICByZWNlaXB0c1Jvb3Q6IHN0cmluZztcclxuICBtaW5lcjogc3RyaW5nO1xyXG4gIGRpZmZpY3VsdHk6IG51bWJlcjtcclxuICB0b3RhbERpZmZpY3VsdHk6IG51bWJlcjtcclxuICBzaXplOiBudW1iZXI7XHJcbiAgZXh0cmFEYXRhOiBzdHJpbmc7XHJcbiAgZ2FzTGltaXQ6IG51bWJlcjtcclxuICBnYXNVc2VkOiBudW1iZXI7XHJcbiAgdGltZXN0YW1wOiBudW1iZXI7XHJcbiAgdHJhbnNhY3Rpb25zOiBzdHJpbmdbXTtcclxuICB1bmNsZXM6IHN0cmluZ1tdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihldGhCbG9jaykge1xyXG4gICAgdGhpcy5udW1iZXIgPSBoZXhUb051bWJlcihldGhCbG9jay5udW1iZXIpO1xyXG4gICAgdGhpcy5oYXNoID0gZXRoQmxvY2suaGFzaDtcclxuICAgIHRoaXMucGFyZW50SGFzaCA9IGV0aEJsb2NrLnBhcmVudEhhc2g7XHJcbiAgICB0aGlzLm5vbmNlID0gZXRoQmxvY2subm9uY2U7XHJcbiAgICB0aGlzLnNoYTNVbmNsZXMgPSBldGhCbG9jay5zaGEzVW5jbGVzO1xyXG4gICAgdGhpcy5sb2dzQmxvb20gPSBldGhCbG9jay5sb2dzQmxvb207XHJcbiAgICB0aGlzLnRyYW5zYWN0aW9uc1Jvb3QgPSBldGhCbG9jay50cmFuc2FjdGlvbnNSb290O1xyXG4gICAgdGhpcy5zdGF0ZVJvb3QgPSBldGhCbG9jay5zdGF0ZVJvb3Q7XHJcbiAgICB0aGlzLnJlY2VpcHRzUm9vdCA9IGV0aEJsb2NrLnJlY2VpcHRzUm9vdDtcclxuICAgIHRoaXMubWluZXIgPSBldGhCbG9jay5taW5lcjtcclxuICAgIHRoaXMuZGlmZmljdWx0eSA9IGhleFRvTnVtYmVyKGV0aEJsb2NrLmRpZmZpY3VsdHkpO1xyXG4gICAgdGhpcy50b3RhbERpZmZpY3VsdHkgPSBoZXhUb051bWJlcihldGhCbG9jay50b3RhbERpZmZpY3VsdHkpO1xyXG4gICAgdGhpcy5zaXplID0gaGV4VG9OdW1iZXIoZXRoQmxvY2suc2l6ZSk7XHJcbiAgICB0aGlzLmV4dHJhRGF0YSA9IGV0aEJsb2NrLmV4dHJhRGF0YTtcclxuICAgIHRoaXMuZ2FzTGltaXQgPSBoZXhUb051bWJlcihldGhCbG9jay5nYXNMaW1pdCk7XHJcbiAgICB0aGlzLmdhc1VzZWQgPSBoZXhUb051bWJlcihldGhCbG9jay5nYXNVc2VkKTtcclxuICAgIHRoaXMudGltZXN0YW1wID0gaGV4VG9OdW1iZXIoZXRoQmxvY2sudGltZXN0YW1wKTtcclxuICAgIHRoaXMudHJhbnNhY3Rpb25zID0gZXRoQmxvY2sudHJhbnNhY3Rpb25zO1xyXG4gICAgdGhpcy51bmNsZXMgPSBldGhCbG9jay51bmNsZXM7XHJcbiAgfVxyXG59XHJcbiJdfQ==