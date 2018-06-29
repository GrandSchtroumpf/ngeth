/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * JSON RPC Request model
 * @record
 */
export function RPCReq() { }
function RPCReq_tsickle_Closure_declarations() {
    /** @type {?} */
    RPCReq.prototype.jsonrpc;
    /** @type {?} */
    RPCReq.prototype.id;
    /** @type {?} */
    RPCReq.prototype.method;
    /** @type {?} */
    RPCReq.prototype.params;
}
/**
 * JSON RPC Response model with the result as a generic type
 * @record
 * @template Result
 */
export function RPCRes() { }
function RPCRes_tsickle_Closure_declarations() {
    /** @type {?} */
    RPCRes.prototype.jsonrpc;
    /** @type {?} */
    RPCRes.prototype.id;
    /** @type {?|undefined} */
    RPCRes.prototype.result;
    /** @type {?|undefined} */
    RPCRes.prototype.error;
}
/**
 * JSON RPC Subscription model with the result as a generic type
 * @record
 * @template Result
 */
export function RPCSub() { }
function RPCSub_tsickle_Closure_declarations() {
    /** @type {?} */
    RPCSub.prototype.jsonrpc;
    /** @type {?} */
    RPCSub.prototype.method;
    /** @type {?} */
    RPCSub.prototype.params;
}
/**
 * @record
 */
export function RPCMethod() { }
function RPCMethod_tsickle_Closure_declarations() {
    /** @type {?} */
    RPCMethod.prototype.web3_clientVersion;
    /** @type {?} */
    RPCMethod.prototype.web3_sha3;
    /** @type {?} */
    RPCMethod.prototype.net_version;
    /** @type {?} */
    RPCMethod.prototype.net_peerCount;
    /** @type {?} */
    RPCMethod.prototype.net_listening;
    /** @type {?} */
    RPCMethod.prototype.eth_protocolVersion;
    /** @type {?} */
    RPCMethod.prototype.eth_syncing;
    /** @type {?} */
    RPCMethod.prototype.eth_coinbase;
    /** @type {?} */
    RPCMethod.prototype.eth_mining;
    /** @type {?} */
    RPCMethod.prototype.eth_hashrate;
    /** @type {?} */
    RPCMethod.prototype.eth_gasPrice;
    /** @type {?} */
    RPCMethod.prototype.eth_accounts;
    /** @type {?} */
    RPCMethod.prototype.eth_blockNumber;
    /** @type {?} */
    RPCMethod.prototype.eth_getBalance;
    /** @type {?} */
    RPCMethod.prototype.eth_getStorageAt;
    /** @type {?} */
    RPCMethod.prototype.eth_getTransactionCount;
    /** @type {?} */
    RPCMethod.prototype.eth_getBlockTransactionCountByHash;
    /** @type {?} */
    RPCMethod.prototype.eth_getBlockTransactionCountByNumber;
    /** @type {?} */
    RPCMethod.prototype.eth_getUncleCountByBlockHash;
    /** @type {?} */
    RPCMethod.prototype.eth_getUncleCountByBlockNumber;
    /** @type {?} */
    RPCMethod.prototype.eth_getCode;
    /** @type {?} */
    RPCMethod.prototype.eth_sign;
    /** @type {?} */
    RPCMethod.prototype.eth_sendTransaction;
    /** @type {?} */
    RPCMethod.prototype.eth_sendRawTransaction;
    /** @type {?} */
    RPCMethod.prototype.eth_call;
    /** @type {?} */
    RPCMethod.prototype.eth_estimateGas;
    /** @type {?} */
    RPCMethod.prototype.eth_getBlockByHash;
    /** @type {?} */
    RPCMethod.prototype.eth_getBlockByNumber;
    /** @type {?} */
    RPCMethod.prototype.eth_getTransactionByHash;
    /** @type {?} */
    RPCMethod.prototype.eth_getTransactionByBlockHashAndIndex;
    /** @type {?} */
    RPCMethod.prototype.eth_getTransactionByBlockNumberAndIndex;
    /** @type {?} */
    RPCMethod.prototype.eth_getTransactionReceipt;
    /** @type {?} */
    RPCMethod.prototype.eth_getUncleByBlockHashAndIndex;
    /** @type {?} */
    RPCMethod.prototype.eth_getUncleByBlockNumberAndIndex;
    /** @type {?} */
    RPCMethod.prototype.eth_getCompilers;
    /** @type {?} */
    RPCMethod.prototype.eth_compileLLL;
    /** @type {?} */
    RPCMethod.prototype.eth_compileSolidity;
    /** @type {?} */
    RPCMethod.prototype.eth_compileSerpent;
    /** @type {?} */
    RPCMethod.prototype.eth_newFilter;
    /** @type {?} */
    RPCMethod.prototype.eth_newBlockFilter;
    /** @type {?} */
    RPCMethod.prototype.eth_newPendingTransactionFilter;
    /** @type {?} */
    RPCMethod.prototype.eth_uninstallFilter;
    /** @type {?} */
    RPCMethod.prototype.eth_getFilterChanges;
    /** @type {?} */
    RPCMethod.prototype.eth_getFilterLogs;
    /** @type {?} */
    RPCMethod.prototype.eth_getLogs;
    /** @type {?} */
    RPCMethod.prototype.eth_getWork;
    /** @type {?} */
    RPCMethod.prototype.eth_submitWork;
    /** @type {?} */
    RPCMethod.prototype.eth_submitHashrate;
    /** @type {?} */
    RPCMethod.prototype.shh_post;
    /** @type {?} */
    RPCMethod.prototype.shh_version;
    /** @type {?} */
    RPCMethod.prototype.shh_newIdentity;
    /** @type {?} */
    RPCMethod.prototype.shh_hasIdentity;
    /** @type {?} */
    RPCMethod.prototype.shh_newGroup;
    /** @type {?} */
    RPCMethod.prototype.shh_addToGroup;
    /** @type {?} */
    RPCMethod.prototype.shh_newFilter;
    /** @type {?} */
    RPCMethod.prototype.shh_uninstallFilter;
    /** @type {?} */
    RPCMethod.prototype.shh_getFilterChanges;
    /** @type {?} */
    RPCMethod.prototype.shh_getMessages;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3V0aWxzLyIsInNvdXJjZXMiOlsibGliL3R5cGVzL3JwYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJsb2NrLCBJVHJhbnNhY3Rpb24sIElUeFJlY2VpcHQsIElUeExvZ3MgfSBmcm9tICcuLy4uL2Zvcm1hdHRlcnMnO1xyXG4vKiogSlNPTiBSUEMgUmVxdWVzdCBtb2RlbCAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFJQQ1JlcSB7XHJcbiAganNvbnJwYzogc3RyaW5nO1xyXG4gIGlkOiBudW1iZXI7XHJcbiAgbWV0aG9kOiBzdHJpbmc7XHJcbiAgcGFyYW1zOiBhbnlbXTtcclxufVxyXG5cclxuLyoqIEpTT04gUlBDIFJlc3BvbnNlIG1vZGVsIHdpdGggdGhlIHJlc3VsdCBhcyBhIGdlbmVyaWMgdHlwZSAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFJQQ1JlczxSZXN1bHQgPSBhbnk+IHtcclxuICBqc29ucnBjOiBzdHJpbmc7XHJcbiAgaWQ6IG51bWJlcjtcclxuICByZXN1bHQ/OiBSZXN1bHQ7XHJcbiAgZXJyb3I/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKiBUaGUgUlBDIENhbGxiYWNrIG9mIHNlbmQgZnVuY3Rpb25zICovXHJcbmV4cG9ydCB0eXBlIFJQQ0NhbGxiYWNrID0gKGVycjogc3RyaW5nLCByZXN1bHQ6IFJQQ1JlcykgPT4gdm9pZDtcclxuXHJcbi8qKiBKU09OIFJQQyBTdWJzY3JpcHRpb24gbW9kZWwgd2l0aCB0aGUgcmVzdWx0IGFzIGEgZ2VuZXJpYyB0eXBlICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgUlBDU3ViPFJlc3VsdCA9IGFueT4ge1xyXG4gIGpzb25ycGM6IHN0cmluZztcclxuICBtZXRob2Q6ICdldGhfc3Vic2NyaXB0aW9uJztcclxuICBwYXJhbXM6IHtcclxuICAgIHN1YnNjcmlwdGlvbjogc3RyaW5nLFxyXG4gICAgcmVzdWx0OiBhbnlcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJQQ01ldGhvZCB7XHJcbiAgLy8gV2ViM1xyXG4gIHdlYjNfY2xpZW50VmVyc2lvbjogc3RyaW5nO1xyXG4gIHdlYjNfc2hhMzogc3RyaW5nO1xyXG4gIC8vIE5ldFxyXG4gIG5ldF92ZXJzaW9uOiBzdHJpbmc7XHJcbiAgbmV0X3BlZXJDb3VudDogbnVtYmVyO1xyXG4gIG5ldF9saXN0ZW5pbmc6IGJvb2xlYW47XHJcbiAgLy8gRXRoXHJcbiAgZXRoX3Byb3RvY29sVmVyc2lvbjogc3RyaW5nO1xyXG4gIGV0aF9zeW5jaW5nOiB7XHJcbiAgICBzdGFydGluZ0Jsb2NrOiBudW1iZXI7XHJcbiAgICBjdXJyZW50QmxvY2s6IG51bWJlcjtcclxuICAgIGhpZ2hlc3RCbG9jazogbnVtYmVyO1xyXG4gIH07XHJcbiAgZXRoX2NvaW5iYXNlOiBzdHJpbmc7XHJcbiAgZXRoX21pbmluZzogYm9vbGVhbjtcclxuICBldGhfaGFzaHJhdGU6IG51bWJlcjtcclxuICBldGhfZ2FzUHJpY2U6IG51bWJlcjtcclxuICBldGhfYWNjb3VudHM6IHN0cmluZ1tdO1xyXG4gIGV0aF9ibG9ja051bWJlcjogbnVtYmVyO1xyXG4gIGV0aF9nZXRCYWxhbmNlOiBudW1iZXI7XHJcbiAgZXRoX2dldFN0b3JhZ2VBdDogc3RyaW5nO1xyXG4gIGV0aF9nZXRUcmFuc2FjdGlvbkNvdW50OiBudW1iZXI7XHJcbiAgZXRoX2dldEJsb2NrVHJhbnNhY3Rpb25Db3VudEJ5SGFzaDogbnVtYmVyO1xyXG4gIGV0aF9nZXRCbG9ja1RyYW5zYWN0aW9uQ291bnRCeU51bWJlcjogbnVtYmVyO1xyXG4gIGV0aF9nZXRVbmNsZUNvdW50QnlCbG9ja0hhc2g6IG51bWJlcjtcclxuICBldGhfZ2V0VW5jbGVDb3VudEJ5QmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICBldGhfZ2V0Q29kZTogc3RyaW5nO1xyXG4gIGV0aF9zaWduOiBzdHJpbmc7XHJcbiAgZXRoX3NlbmRUcmFuc2FjdGlvbjogc3RyaW5nO1xyXG4gIGV0aF9zZW5kUmF3VHJhbnNhY3Rpb246IHN0cmluZztcclxuICBldGhfY2FsbDogc3RyaW5nO1xyXG4gIGV0aF9lc3RpbWF0ZUdhczogbnVtYmVyO1xyXG4gIGV0aF9nZXRCbG9ja0J5SGFzaDogSUJsb2NrO1xyXG4gIGV0aF9nZXRCbG9ja0J5TnVtYmVyOiBJQmxvY2s7XHJcbiAgZXRoX2dldFRyYW5zYWN0aW9uQnlIYXNoOiBJVHJhbnNhY3Rpb247XHJcbiAgZXRoX2dldFRyYW5zYWN0aW9uQnlCbG9ja0hhc2hBbmRJbmRleDogSVRyYW5zYWN0aW9uO1xyXG4gIGV0aF9nZXRUcmFuc2FjdGlvbkJ5QmxvY2tOdW1iZXJBbmRJbmRleDogSVRyYW5zYWN0aW9uO1xyXG4gIGV0aF9nZXRUcmFuc2FjdGlvblJlY2VpcHQ6IElUeFJlY2VpcHQ7XHJcbiAgZXRoX2dldFVuY2xlQnlCbG9ja0hhc2hBbmRJbmRleDogSUJsb2NrO1xyXG4gIGV0aF9nZXRVbmNsZUJ5QmxvY2tOdW1iZXJBbmRJbmRleDogSUJsb2NrO1xyXG4gIGV0aF9nZXRDb21waWxlcnM6ICgnc29saXRpZHknIHwgJ2xsbCcgfCAnc2VycGVudCcpW107XHJcbiAgZXRoX2NvbXBpbGVMTEw6IGFueTtcclxuICBldGhfY29tcGlsZVNvbGlkaXR5OiBhbnk7XHJcbiAgZXRoX2NvbXBpbGVTZXJwZW50OiBhbnk7XHJcbiAgZXRoX25ld0ZpbHRlcjogbnVtYmVyO1xyXG4gIGV0aF9uZXdCbG9ja0ZpbHRlcjogc3RyaW5nO1xyXG4gIGV0aF9uZXdQZW5kaW5nVHJhbnNhY3Rpb25GaWx0ZXI6IG51bWJlcjtcclxuICBldGhfdW5pbnN0YWxsRmlsdGVyOiBib29sZWFuO1xyXG4gIGV0aF9nZXRGaWx0ZXJDaGFuZ2VzOiBudW1iZXI7XHJcbiAgZXRoX2dldEZpbHRlckxvZ3M6IElUeExvZ3M7XHJcbiAgZXRoX2dldExvZ3M6IElUeExvZ3M7XHJcbiAgZXRoX2dldFdvcms6IFtzdHJpbmcsIHN0cmluZywgc3RyaW5nXTtcclxuICBldGhfc3VibWl0V29yazogYm9vbGVhbjtcclxuICBldGhfc3VibWl0SGFzaHJhdGU6IGJvb2xlYW47XHJcbiAgLy8gU0hIXHJcbiAgc2hoX3Bvc3Q6IGJvb2xlYW47XHJcbiAgc2hoX3ZlcnNpb246IHN0cmluZztcclxuICBzaGhfbmV3SWRlbnRpdHk6IHN0cmluZztcclxuICBzaGhfaGFzSWRlbnRpdHk6IGJvb2xlYW47XHJcbiAgc2hoX25ld0dyb3VwOiBzdHJpbmc7XHJcbiAgc2hoX2FkZFRvR3JvdXA6IGJvb2xlYW47XHJcbiAgc2hoX25ld0ZpbHRlcjogbnVtYmVyO1xyXG4gIHNoaF91bmluc3RhbGxGaWx0ZXI6IGJvb2xlYW47XHJcbiAgc2hoX2dldEZpbHRlckNoYW5nZXM6IGFueVtdO1xyXG4gIHNoaF9nZXRNZXNzYWdlczogbnVtYmVyO1xyXG59XHJcbiJdfQ==