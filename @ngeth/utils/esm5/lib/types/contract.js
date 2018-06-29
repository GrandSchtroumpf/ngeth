/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * *******
 * MAIN
 * @record
 * @template I, O
 */
export function ContractMethod() { }
function ContractMethod_tsickle_Closure_declarations() {
    /** @type {?} */
    ContractMethod.prototype.input;
    /** @type {?} */
    ContractMethod.prototype.output;
}
/**
 * @record
 * @template Input, Output
 */
export function CallMethod() { }
function CallMethod_tsickle_Closure_declarations() {
}
/**
 * @record
 * @template Input
 */
export function SendMethod() { }
function SendMethod_tsickle_Closure_declarations() {
}
/**
 * Contract based interface
 * @record
 */
export function ContractModel() { }
function ContractModel_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    ContractModel.prototype.name;
    /** @type {?} */
    ContractModel.prototype.calls;
    /** @type {?} */
    ContractModel.prototype.sends;
    /** @type {?} */
    ContractModel.prototype.events;
}
/**
 * MetaData for the decorator
 * @record
 */
export function ContractMetadata() { }
function ContractMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    ContractMetadata.prototype.abi;
    /** @type {?|undefined} */
    ContractMetadata.prototype.providedIn;
    /** @type {?|undefined} */
    ContractMetadata.prototype.addresses;
    /** @type {?|undefined} */
    ContractMetadata.prototype.options;
}
/**
 * Options of the contract once instanciated
 * @record
 */
export function ContractOptions() { }
function ContractOptions_tsickle_Closure_declarations() {
    /** @type {?} */
    ContractOptions.prototype.address;
    /** @type {?} */
    ContractOptions.prototype.jsonInterface;
    /** @type {?} */
    ContractOptions.prototype.data;
    /** @type {?} */
    ContractOptions.prototype.from;
    /** @type {?} */
    ContractOptions.prototype.gasPrice;
    /** @type {?} */
    ContractOptions.prototype.gas;
}
// unsupported: template constraints.
/**
 * An event-log returned by Ethereum
 * @record
 * @template T
 */
export function EventLog() { }
function EventLog_tsickle_Closure_declarations() {
    /** @type {?} */
    EventLog.prototype.returnValues;
    /** @type {?} */
    EventLog.prototype.raw;
    /** @type {?} */
    EventLog.prototype.event;
    /** @type {?} */
    EventLog.prototype.signature;
    /** @type {?} */
    EventLog.prototype.logIndex;
    /** @type {?} */
    EventLog.prototype.transactionIndex;
    /** @type {?} */
    EventLog.prototype.transactionHash;
    /** @type {?} */
    EventLog.prototype.blockHash;
    /** @type {?} */
    EventLog.prototype.blockNumber;
    /** @type {?} */
    EventLog.prototype.address;
}
/**
 * The options of the contract. Some are used as fallbacks for calls and transactions:
 * @record
 */
export function ContractTxOptions() { }
function ContractTxOptions_tsickle_Closure_declarations() {
    /**
     * The address transactions should be made from.
     * @type {?|undefined}
     */
    ContractTxOptions.prototype.from;
    /**
     * The gas price in wei to use for transactions.
     * @type {?|undefined}
     */
    ContractTxOptions.prototype.gasPrice;
    /**
     * The maximum gas provided for a transaction (gas limit).
     * @type {?|undefined}
     */
    ContractTxOptions.prototype.gas;
    /**
     * The byte code of the contract. Used when the contract gets deployed.
     * @type {?|undefined}
     */
    ContractTxOptions.prototype.data;
}
// unsupported: template constraints.
/**
 * The event emitter object returned by web3
 * @record
 * @template T
 */
export function EventEmitter() { }
function EventEmitter_tsickle_Closure_declarations() {
    /** @type {?} */
    EventEmitter.prototype.on;
    /** @type {?} */
    EventEmitter.prototype.on;
    /** @type {?} */
    EventEmitter.prototype.on;
    /** @type {?} */
    EventEmitter.prototype.on;
}
/**
 * @record
 */
export function EventFilter() { }
function EventFilter_tsickle_Closure_declarations() {
    /** @type {?} */
    EventFilter.prototype.filter;
    /** @type {?} */
    EventFilter.prototype.fromBlock;
}
/**
 * @record
 * @template T
 */
export function TransactionObject() { }
function TransactionObject_tsickle_Closure_declarations() {
    /** @type {?} */
    TransactionObject.prototype.arguments;
    /** @type {?} */
    TransactionObject.prototype.call;
    /** @type {?} */
    TransactionObject.prototype.send;
    /** @type {?} */
    TransactionObject.prototype.estimateGas;
    /** @type {?} */
    TransactionObject.prototype.encodeABI;
}
/**
 * **
 * DUPLICATE WITH PROVIDER
 * @record
 */
export function Tx() { }
function Tx_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    Tx.prototype.nonce;
    /** @type {?|undefined} */
    Tx.prototype.chainId;
    /** @type {?|undefined} */
    Tx.prototype.from;
    /** @type {?|undefined} */
    Tx.prototype.to;
    /** @type {?|undefined} */
    Tx.prototype.data;
    /** @type {?|undefined} */
    Tx.prototype.value;
    /** @type {?|undefined} */
    Tx.prototype.gas;
    /** @type {?|undefined} */
    Tx.prototype.gasPrice;
}
/**
 * @record
 */
export function TransactionReceipt() { }
function TransactionReceipt_tsickle_Closure_declarations() {
    /** @type {?} */
    TransactionReceipt.prototype.transactionHash;
    /** @type {?} */
    TransactionReceipt.prototype.transactionIndex;
    /** @type {?} */
    TransactionReceipt.prototype.blockHash;
    /** @type {?} */
    TransactionReceipt.prototype.blockNumber;
    /** @type {?} */
    TransactionReceipt.prototype.from;
    /** @type {?} */
    TransactionReceipt.prototype.to;
    /** @type {?} */
    TransactionReceipt.prototype.contractAddress;
    /** @type {?} */
    TransactionReceipt.prototype.cumulativeGasUsed;
    /** @type {?} */
    TransactionReceipt.prototype.gasUsed;
    /** @type {?|undefined} */
    TransactionReceipt.prototype.logs;
    /** @type {?|undefined} */
    TransactionReceipt.prototype.events;
    /** @type {?} */
    TransactionReceipt.prototype.status;
}
/**
 * @record
 */
export function Log() { }
function Log_tsickle_Closure_declarations() {
    /** @type {?} */
    Log.prototype.address;
    /** @type {?} */
    Log.prototype.data;
    /** @type {?} */
    Log.prototype.topics;
    /** @type {?} */
    Log.prototype.logIndex;
    /** @type {?} */
    Log.prototype.transactionHash;
    /** @type {?} */
    Log.prototype.transactionIndex;
    /** @type {?} */
    Log.prototype.blockHash;
    /** @type {?} */
    Log.prototype.blockNumber;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvdXRpbHMvIiwic291cmNlcyI6WyJsaWIvdHlwZXMvY29udHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQUJJRGVmaW5pdGlvbiB9IGZyb20gJy4vYWJpJztcclxuXHJcbi8qKioqKioqKioqXHJcbiAqIE1BSU5cclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbnRyYWN0TWV0aG9kPEksIE8+IHtcclxuICBpbnB1dDogSTtcclxuICBvdXRwdXQ6IE87XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBDYWxsTWV0aG9kPElucHV0LCBPdXRwdXQ+XHJcbiAgZXh0ZW5kcyBDb250cmFjdE1ldGhvZDxJbnB1dCwgT3V0cHV0PiB7fVxyXG5leHBvcnQgaW50ZXJmYWNlIFNlbmRNZXRob2Q8SW5wdXQ+IGV4dGVuZHMgQ29udHJhY3RNZXRob2Q8SW5wdXQsIGFueT4ge31cclxuLyoqXHJcbiAqIENvbnRyYWN0IGJhc2VkIGludGVyZmFjZVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBDb250cmFjdE1vZGVsIHtcclxuICBuYW1lPzogc3RyaW5nO1xyXG4gIGNhbGxzOiB7XHJcbiAgICBbbmFtZTogc3RyaW5nXTogYW55O1xyXG4gIH07XHJcbiAgc2VuZHM6IHtcclxuICAgIFtuYW1lOiBzdHJpbmddOiBhbnk7XHJcbiAgfTtcclxuICBldmVudHM6IHtcclxuICAgIFtuYW1lOiBzdHJpbmddOiBhbnk7XHJcbiAgfTtcclxufVxyXG5cclxuLyoqKioqKioqKipcclxuICogQ09OVFJBQ1QgSEVMUEVSU1xyXG4gKi9cclxuXHJcbi8qKiBNZXRhRGF0YSBmb3IgdGhlIGRlY29yYXRvciAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIENvbnRyYWN0TWV0YWRhdGEge1xyXG4gIGFiaTogQUJJRGVmaW5pdGlvbltdIHwgc3RyaW5nO1xyXG4gIHByb3ZpZGVkSW4/OiBUeXBlPGFueT4gfCAncm9vdCc7XHJcbiAgYWRkcmVzc2VzPzoge1xyXG4gICAgbWFpbj86IHN0cmluZztcclxuICAgIHJvcHN0ZW4/OiBzdHJpbmc7XHJcbiAgICBrb3Zlbj86IHN0cmluZztcclxuICAgIHJpbmtlYnk/OiBzdHJpbmc7XHJcbiAgICBjdXN0b20/OiBzdHJpbmc7XHJcbiAgfTtcclxuICBvcHRpb25zPzoge1xyXG4gICAgZnJvbT86IHN0cmluZztcclxuICAgIGdhc1ByaWNlPzogYW55O1xyXG4gICAgZ2FzPzogbnVtYmVyO1xyXG4gICAgZGF0YT86IHN0cmluZztcclxuICB9O1xyXG59XHJcblxyXG4vKiogT3B0aW9ucyBvZiB0aGUgY29udHJhY3Qgb25jZSBpbnN0YW5jaWF0ZWQgKi9cclxuZXhwb3J0IGludGVyZmFjZSBDb250cmFjdE9wdGlvbnMge1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxuICBqc29uSW50ZXJmYWNlOiBBQklEZWZpbml0aW9uW107XHJcbiAgZGF0YTogc3RyaW5nO1xyXG4gIGZyb206IHN0cmluZztcclxuICBnYXNQcmljZTogc3RyaW5nO1xyXG4gIGdhczogbnVtYmVyO1xyXG59XHJcblxyXG4vKiogQW4gZXZlbnQtbG9nIHJldHVybmVkIGJ5IEV0aGVyZXVtICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRMb2c8VCBleHRlbmRzIG9iamVjdD4ge1xyXG4gIHJldHVyblZhbHVlczogVDtcclxuICByYXc6IHtcclxuICAgIGRhdGE6IHN0cmluZztcclxuICAgIHRvcGljczogc3RyaW5nW107XHJcbiAgfTtcclxuICBldmVudDogc3RyaW5nO1xyXG4gIHNpZ25hdHVyZTogc3RyaW5nO1xyXG4gIGxvZ0luZGV4OiBudW1iZXI7XHJcbiAgdHJhbnNhY3Rpb25JbmRleDogbnVtYmVyO1xyXG4gIHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nO1xyXG4gIGJsb2NrSGFzaDogc3RyaW5nO1xyXG4gIGJsb2NrTnVtYmVyOiBudW1iZXI7XHJcbiAgYWRkcmVzczogc3RyaW5nO1xyXG59XHJcblxyXG4vKiogVGhlIG9wdGlvbnMgb2YgdGhlIGNvbnRyYWN0LiBTb21lIGFyZSB1c2VkIGFzIGZhbGxiYWNrcyBmb3IgY2FsbHMgYW5kIHRyYW5zYWN0aW9uczogKi9cclxuZXhwb3J0IGludGVyZmFjZSBDb250cmFjdFR4T3B0aW9ucyB7XHJcbiAgLyoqIFRoZSBhZGRyZXNzIHRyYW5zYWN0aW9ucyBzaG91bGQgYmUgbWFkZSBmcm9tLiAqL1xyXG4gIGZyb20/OiBzdHJpbmc7XHJcbiAgLyoqIFRoZSBnYXMgcHJpY2UgaW4gd2VpIHRvIHVzZSBmb3IgdHJhbnNhY3Rpb25zLiAqL1xyXG4gIGdhc1ByaWNlPzogYW55O1xyXG4gIC8qKiBUaGUgbWF4aW11bSBnYXMgcHJvdmlkZWQgZm9yIGEgdHJhbnNhY3Rpb24gKGdhcyBsaW1pdCkuICovXHJcbiAgZ2FzPzogbnVtYmVyO1xyXG4gIC8qKiBUaGUgYnl0ZSBjb2RlIG9mIHRoZSBjb250cmFjdC4gVXNlZCB3aGVuIHRoZSBjb250cmFjdCBnZXRzIGRlcGxveWVkLiAqL1xyXG4gIGRhdGE/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKiBUaGUgZXZlbnQgZW1pdHRlciBvYmplY3QgcmV0dXJuZWQgYnkgd2ViMyAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50RW1pdHRlcjxUIGV4dGVuZHMgb2JqZWN0PiB7XHJcbiAgb24odHlwZTogJ2RhdGEnLCBoYW5kbGVyOiAoZXZlbnQ6IEV2ZW50TG9nPFQ+KSA9PiB2b2lkKTogRXZlbnRFbWl0dGVyPFQ+O1xyXG4gIG9uKHR5cGU6ICdjaGFuZ2VkJywgaGFuZGxlcjogKHJlY2VpcHQ6IEV2ZW50TG9nPFQ+KSA9PiB2b2lkKTogRXZlbnRFbWl0dGVyPFQ+O1xyXG4gIG9uKHR5cGU6ICdlcnJvcicsIGhhbmRsZXI6IChlcnJvcjogRXJyb3IpID0+IHZvaWQpOiBFdmVudEVtaXR0ZXI8VD47XHJcbiAgb24oXHJcbiAgICB0eXBlOiAnZXJyb3InIHwgJ2RhdGEnIHwgJ2NoYW5nZWQnLFxyXG4gICAgaGFuZGxlcjogKGVycm9yOiBFcnJvciB8IFRyYW5zYWN0aW9uUmVjZWlwdCB8IHN0cmluZykgPT4gdm9pZFxyXG4gICk6IEV2ZW50RW1pdHRlcjxUPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFdmVudEZpbHRlciB7XHJcbiAgZmlsdGVyOiBPYmplY3Q7XHJcbiAgZnJvbUJsb2NrOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNhY3Rpb25PYmplY3Q8VD4ge1xyXG4gIGFyZ3VtZW50czogYW55W107XHJcbiAgY2FsbCh0eD86IFR4KTogUHJvbWlzZTxUPjtcclxuICBzZW5kKHR4PzogVHgpOiBQcm9taUV2ZW50PFQ+O1xyXG4gIGVzdGltYXRlR2FzKHR4PzogVHgpOiBQcm9taXNlPG51bWJlcj47XHJcbiAgZW5jb2RlQUJJKCk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIFByb21pRXZlbnQ8VD4gZXh0ZW5kcyBQcm9taXNlPFQ+IHtcclxuICBvbmNlKFxyXG4gICAgdHlwZTogJ3RyYW5zYWN0aW9uSGFzaCcsXHJcbiAgICBoYW5kbGVyOiAocmVjZWlwdDogc3RyaW5nKSA9PiB2b2lkXHJcbiAgKTogUHJvbWlFdmVudDxUPjtcclxuICBvbmNlKFxyXG4gICAgdHlwZTogJ3JlY2VpcHQnLFxyXG4gICAgaGFuZGxlcjogKHJlY2VpcHQ6IFRyYW5zYWN0aW9uUmVjZWlwdCkgPT4gdm9pZFxyXG4gICk6IFByb21pRXZlbnQ8VD47XHJcbiAgb25jZShcclxuICAgIHR5cGU6ICdjb25maXJtYXRpb24nLFxyXG4gICAgaGFuZGxlcjogKGNvbmZOdW1iZXI6IG51bWJlciwgcmVjZWlwdDogVHJhbnNhY3Rpb25SZWNlaXB0KSA9PiB2b2lkXHJcbiAgKTogUHJvbWlFdmVudDxUPjtcclxuICBvbmNlKHR5cGU6ICdlcnJvcicsIGhhbmRsZXI6IChlcnJvcjogRXJyb3IpID0+IHZvaWQpOiBQcm9taUV2ZW50PFQ+O1xyXG4gIG9uY2UoXHJcbiAgICB0eXBlOiAnZXJyb3InIHwgJ2NvbmZpcm1hdGlvbicgfCAncmVjZWlwdCcgfCAndHJhbnNhY3Rpb25IYXNoJyxcclxuICAgIGhhbmRsZXI6IChlcnJvcjogRXJyb3IgfCBUcmFuc2FjdGlvblJlY2VpcHQgfCBzdHJpbmcpID0+IHZvaWRcclxuICApOiBQcm9taUV2ZW50PFQ+O1xyXG4gIG9uKFxyXG4gICAgdHlwZTogJ3RyYW5zYWN0aW9uSGFzaCcsXHJcbiAgICBoYW5kbGVyOiAocmVjZWlwdDogc3RyaW5nKSA9PiB2b2lkXHJcbiAgKTogUHJvbWlFdmVudDxUPjtcclxuICBvbihcclxuICAgIHR5cGU6ICdyZWNlaXB0JyxcclxuICAgIGhhbmRsZXI6IChyZWNlaXB0OiBUcmFuc2FjdGlvblJlY2VpcHQpID0+IHZvaWRcclxuICApOiBQcm9taUV2ZW50PFQ+O1xyXG4gIG9uKFxyXG4gICAgdHlwZTogJ2NvbmZpcm1hdGlvbicsXHJcbiAgICBoYW5kbGVyOiAoY29uZk51bWJlcjogbnVtYmVyLCByZWNlaXB0OiBUcmFuc2FjdGlvblJlY2VpcHQpID0+IHZvaWRcclxuICApOiBQcm9taUV2ZW50PFQ+O1xyXG4gIG9uKHR5cGU6ICdlcnJvcicsIGhhbmRsZXI6IChlcnJvcjogRXJyb3IpID0+IHZvaWQpOiBQcm9taUV2ZW50PFQ+O1xyXG4gIG9uKFxyXG4gICAgdHlwZTogJ2Vycm9yJyB8ICdjb25maXJtYXRpb24nIHwgJ3JlY2VpcHQnIHwgJ3RyYW5zYWN0aW9uSGFzaCcsXHJcbiAgICBoYW5kbGVyOiAoZXJyb3I6IEVycm9yIHwgVHJhbnNhY3Rpb25SZWNlaXB0IHwgc3RyaW5nKSA9PiB2b2lkXHJcbiAgKTogUHJvbWlFdmVudDxUPjtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQmxvY2tUeXBlID0gJ2xhdGVzdCcgfCAncGVuZGluZycgfCAnZ2VuZXNpcycgfCBudW1iZXI7XHJcblxyXG4vKioqKipcclxuICogRFVQTElDQVRFIFdJVEggUFJPVklERVJcclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFR4IHtcclxuICBub25jZT86IHN0cmluZyB8IG51bWJlcjtcclxuICBjaGFpbklkPzogc3RyaW5nIHwgbnVtYmVyO1xyXG4gIGZyb20/OiBzdHJpbmc7XHJcbiAgdG8/OiBzdHJpbmc7XHJcbiAgZGF0YT86IHN0cmluZztcclxuICB2YWx1ZT86IHN0cmluZyB8IG51bWJlcjtcclxuICBnYXM/OiBzdHJpbmcgfCBudW1iZXI7XHJcbiAgZ2FzUHJpY2U/OiBzdHJpbmcgfCBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNhY3Rpb25SZWNlaXB0IHtcclxuICB0cmFuc2FjdGlvbkhhc2g6IHN0cmluZztcclxuICB0cmFuc2FjdGlvbkluZGV4OiBudW1iZXI7XHJcbiAgYmxvY2tIYXNoOiBzdHJpbmc7XHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxuICBmcm9tOiBzdHJpbmc7XHJcbiAgdG86IHN0cmluZztcclxuICBjb250cmFjdEFkZHJlc3M6IHN0cmluZztcclxuICBjdW11bGF0aXZlR2FzVXNlZDogbnVtYmVyO1xyXG4gIGdhc1VzZWQ6IG51bWJlcjtcclxuICBsb2dzPzogQXJyYXk8TG9nPjtcclxuICBldmVudHM/OiB7XHJcbiAgICBbZXZlbnROYW1lOiBzdHJpbmddOiBFdmVudExvZzxhbnk+O1xyXG4gIH07XHJcbiAgc3RhdHVzOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9nIHtcclxuICBhZGRyZXNzOiBzdHJpbmc7XHJcbiAgZGF0YTogc3RyaW5nO1xyXG4gIHRvcGljczogc3RyaW5nW107XHJcbiAgbG9nSW5kZXg6IG51bWJlcjtcclxuICB0cmFuc2FjdGlvbkhhc2g6IHN0cmluZztcclxuICB0cmFuc2FjdGlvbkluZGV4OiBudW1iZXI7XHJcbiAgYmxvY2tIYXNoOiBzdHJpbmc7XHJcbiAgYmxvY2tOdW1iZXI6IG51bWJlcjtcclxufVxyXG4iXX0=