/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { toChecksumAddress } from '@ngeth/utils';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
// unsupported: template constraints.
/**
 * @template T
 */
var 
// unsupported: template constraints.
/**
 * @template T
 */
ContractClass = /** @class */ (function () {
    function ContractClass(encoder, decoder, provider, abi, address) {
        var _this = this;
        this.encoder = encoder;
        this.decoder = decoder;
        this.provider = provider;
        this.abi = abi;
        this.address = address;
        this.calls = /** @type {?} */ ({});
        this.sends = /** @type {?} */ ({});
        this.events = /** @type {?} */ ({});
        if (!this.abi) {
            throw new Error('Please add an abi to the contract');
        }
        if (this.address) {
            this.address = toChecksumAddress(address);
        }
        var /** @type {?} */ calls = [];
        var /** @type {?} */ sends = [];
        var /** @type {?} */ events = [];
        try {
            for (var _a = tslib_1.__values(this.abi), _b = _a.next(); !_b.done; _b = _a.next()) {
                var def = _b.value;
                if (def.type === 'function' && def.constant === true) {
                    calls.push(def);
                }
                if (def.type === 'function' && def.constant === false) {
                    sends.push(def);
                }
                if (def.type === 'event') {
                    events.push(def);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        calls.forEach(function (def) { return (_this.calls[def.name] = _this.callMethod.bind(_this, def)); });
        sends.forEach(function (def) { return (_this.sends[def.name] = _this.sendMethod.bind(_this, def)); });
        events.forEach(function (def) { return (_this.events[def.name] = _this.eventMethod.bind(_this, def)); });
        var e_1, _c;
    }
    /**
     * Deploy the contract on the blockchain
     * @param {?} bytes The bytes of the contract
     * @param {...?} params Params to pass into the constructor
     * @return {?}
     */
    ContractClass.prototype.deploy = /**
     * Deploy the contract on the blockchain
     * @param {?} bytes The bytes of the contract
     * @param {...?} params Params to pass into the constructor
     * @return {?}
     */
    function (bytes) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var /** @type {?} */ constructor = this.abi.find(function (def) { return def.type === 'constructor'; });
        var /** @type {?} */ noParam = params.length === 0;
        var /** @type {?} */ data = noParam ? bytes : this.encoder.encodeConstructor(constructor, bytes, params);
        return this.fillGas(tslib_1.__assign({}, this.provider.defaultTx, { data: data }))
            .pipe(switchMap(function (tx) { return _this.provider.sendTransaction(tx); }));
    };
    /**
     * Used for 'call' methods
     * @param {?} method The method to call
     * @param {...?} params The params given by the user
     * @return {?}
     */
    ContractClass.prototype.callMethod = /**
     * Used for 'call' methods
     * @param {?} method The method to call
     * @param {...?} params The params given by the user
     * @return {?}
     */
    function (method) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var /** @type {?} */ data = this.encoder.encodeMethod(method, params);
        return this.provider
            .call(this.address, data)
            .pipe(map(function (result) { return _this.decoder.decodeOutputs(result, method.outputs); }), map(function (result) { return result[Object.keys(result)[0]]; }));
    };
    /**
     * Used for 'send' methods
     * @param {?} method The method to send
     * @param {...?} params The params given by the user
     * @return {?}
     */
    ContractClass.prototype.sendMethod = /**
     * Used for 'send' methods
     * @param {?} method The method to send
     * @param {...?} params The params given by the user
     * @return {?}
     */
    function (method) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var _a = { to: this.address, data: this.encoder.encodeMethod(method, params) }, to = _a.to, data = _a.data;
        return this.fillGas(tslib_1.__assign({}, this.provider.defaultTx, { to: to, data: data }))
            .pipe(switchMap(function (tx) { return _this.provider.sendTransaction(tx); }));
    };
    /**
     * Used for 'event' definition
     * @param {?} event The event definition in the ABI
     * @return {?}
     */
    ContractClass.prototype.eventMethod = /**
     * Used for 'event' definition
     * @param {?} event The event definition in the ABI
     * @return {?}
     */
    function (event) {
        var _this = this;
        var /** @type {?} */ topics = this.encoder.encodeEvent(event);
        return this.provider.event(this.address, [topics]).pipe(map(function (logs) { return _this.decoder.decodeEvent(logs.topics, logs.data, event.inputs); }));
    };
    /**
     * Fill the estimated amount of gas and gasPrice to use for a transaction
     * @param {?} tx The raw transaction to estimate the gas from
     * @return {?}
     */
    ContractClass.prototype.fillGas = /**
     * Fill the estimated amount of gas and gasPrice to use for a transaction
     * @param {?} tx The raw transaction to estimate the gas from
     * @return {?}
     */
    function (tx) {
        return forkJoin(this.provider.estimateGas(tx), this.provider.gasPrice()).pipe(map(function (_a) {
            var _b = tslib_1.__read(_a, 2), gas = _b[0], gasPrice = _b[1];
            return tslib_1.__assign({}, tx, { gas: gas, gasPrice: gasPrice });
        }));
    };
    return ContractClass;
}());
// unsupported: template constraints.
/**
 * @template T
 */
export { ContractClass };
function ContractClass_tsickle_Closure_declarations() {
    /** @type {?} */
    ContractClass.prototype.calls;
    /** @type {?} */
    ContractClass.prototype.sends;
    /** @type {?} */
    ContractClass.prototype.events;
    /** @type {?} */
    ContractClass.prototype.encoder;
    /** @type {?} */
    ContractClass.prototype.decoder;
    /** @type {?} */
    ContractClass.prototype.provider;
    /** @type {?} */
    ContractClass.prototype.abi;
    /** @type {?} */
    ContractClass.prototype.address;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvY29udHJhY3QvIiwic291cmNlcyI6WyJsaWIvY29udHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQWlCLGlCQUFpQixFQUE0QixNQUFNLGNBQWMsQ0FBQztBQUkxRixPQUFPLEVBQWMsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxHQUFHLEVBQUcsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBRWpEOzs7OztBQUFBO0lBS0UsdUJBQ1ksT0FBbUIsRUFDbkIsT0FBbUIsRUFDbkIsUUFBMEIsRUFDNUIsS0FDRDtRQUxULGlCQTBCQztRQXpCVyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDNUIsUUFBRyxHQUFILEdBQUc7UUFDSixZQUFPLEdBQVAsT0FBTzt1Q0FUNEMsRUFBUzt1Q0FDVCxFQUFTO3dDQUNOLEVBQVM7UUFTdEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztTQUFFO1FBQ3hFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUFFO1FBQ2hFLHFCQUFNLEtBQUssR0FBVSxFQUFFLENBQUM7UUFDeEIscUJBQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztRQUN4QixxQkFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDOztZQUN6QixHQUFHLENBQUMsQ0FBYyxJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQSxnQkFBQTtnQkFBckIsSUFBTSxHQUFHLFdBQUE7Z0JB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NUUsQ0FBQzs7Ozs7OztJQU9JLCtCQUFPOzs7OztjQUFDLEVBQXNCO1FBQ3BDLE1BQU0sQ0FBQyxRQUFRLENBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEVBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQ3pCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQWU7Z0JBQWYsMEJBQWUsRUFBZCxXQUFHLEVBQUUsZ0JBQVE7WUFDdEIsTUFBTSxzQkFBTSxFQUFFLElBQUUsR0FBRyxLQUFBLEVBQUUsUUFBUSxVQUFBLElBQUU7U0FDaEMsQ0FBQyxDQUNILENBQUM7O3dCQXJHTjtJQXdHQyxDQUFBOzs7OztBQWpHRCx5QkFpR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBQklEZWZpbml0aW9uLCB0b0NoZWNrc3VtQWRkcmVzcywgQ29udHJhY3RNb2RlbCwgSVR4T2JqZWN0IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgQ29udHJhY3RQcm92aWRlciB9IGZyb20gJ0BuZ2V0aC9wcm92aWRlcic7XHJcbmltcG9ydCB7IEFCSUVuY29kZXIsIEFCSURlY29kZXIgfSBmcm9tICcuL2FiaSc7XHJcblxyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsICBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJhY3RDbGFzczxUIGV4dGVuZHMgQ29udHJhY3RNb2RlbD4ge1xyXG4gIHB1YmxpYyBjYWxsczogeyBbUCBpbiBrZXlvZiBUWydjYWxscyddXTogVFsnY2FsbHMnXVtQXTsgfSA9IHt9IGFzIGFueTtcclxuICBwdWJsaWMgc2VuZHM6IHsgW1AgaW4ga2V5b2YgVFsnc2VuZHMnXV06IFRbJ3NlbmRzJ11bUF07IH0gPSB7fSBhcyBhbnk7XHJcbiAgcHVibGljIGV2ZW50czogeyBbUCBpbiBrZXlvZiBUWydldmVudHMnXV06IFRbJ2V2ZW50cyddW1BdOyB9ID0ge30gYXMgYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByb3RlY3RlZCBlbmNvZGVyOiBBQklFbmNvZGVyLFxyXG4gICAgcHJvdGVjdGVkIGRlY29kZXI6IEFCSURlY29kZXIsXHJcbiAgICBwcm90ZWN0ZWQgcHJvdmlkZXI6IENvbnRyYWN0UHJvdmlkZXIsXHJcbiAgICBwcml2YXRlIGFiaTogQUJJRGVmaW5pdGlvbltdLFxyXG4gICAgcHVibGljIGFkZHJlc3M/OiBzdHJpbmdcclxuICApIHtcclxuICAgIGlmICghdGhpcy5hYmkpIHsgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgYWRkIGFuIGFiaSB0byB0aGUgY29udHJhY3QnKTsgfVxyXG4gICAgaWYgKHRoaXMuYWRkcmVzcykgeyB0aGlzLmFkZHJlc3MgPSB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzKTsgfVxyXG4gICAgY29uc3QgY2FsbHM6IGFueVtdID0gW107XHJcbiAgICBjb25zdCBzZW5kczogYW55W10gPSBbXTtcclxuICAgIGNvbnN0IGV2ZW50czogYW55W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgZGVmIG9mIHRoaXMuYWJpKSB7XHJcbiAgICAgIGlmIChkZWYudHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWYuY29uc3RhbnQgPT09IHRydWUpIHtcclxuICAgICAgICBjYWxscy5wdXNoKGRlZik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRlZi50eXBlID09PSAnZnVuY3Rpb24nICYmIGRlZi5jb25zdGFudCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBzZW5kcy5wdXNoKGRlZik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRlZi50eXBlID09PSAnZXZlbnQnKSB7XHJcbiAgICAgICAgZXZlbnRzLnB1c2goZGVmKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2FsbHMuZm9yRWFjaChkZWYgPT4gKHRoaXMuY2FsbHNbZGVmLm5hbWVdID0gdGhpcy5jYWxsTWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gICAgc2VuZHMuZm9yRWFjaChkZWYgPT4gKHRoaXMuc2VuZHNbZGVmLm5hbWVdID0gdGhpcy5zZW5kTWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gICAgZXZlbnRzLmZvckVhY2goZGVmID0+ICh0aGlzLmV2ZW50c1tkZWYubmFtZV0gPSB0aGlzLmV2ZW50TWV0aG9kLmJpbmQodGhpcywgZGVmKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVwbG95IHRoZSBjb250cmFjdCBvbiB0aGUgYmxvY2tjaGFpblxyXG4gICAqIEBwYXJhbSBieXRlcyBUaGUgYnl0ZXMgb2YgdGhlIGNvbnRyYWN0XHJcbiAgICogQHBhcmFtIHBhcmFtcyBQYXJhbXMgdG8gcGFzcyBpbnRvIHRoZSBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHB1YmxpYyBkZXBsb3koYnl0ZXM6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgY29uc3QgY29uc3RydWN0b3IgPSB0aGlzLmFiaS5maW5kKGRlZiA9PiBkZWYudHlwZSA9PT0gJ2NvbnN0cnVjdG9yJyk7XHJcbiAgICBjb25zdCBub1BhcmFtID0gcGFyYW1zLmxlbmd0aCA9PT0gMDtcclxuICAgIGNvbnN0IGRhdGEgPSBub1BhcmFtID8gYnl0ZXMgOiB0aGlzLmVuY29kZXIuZW5jb2RlQ29uc3RydWN0b3IoY29uc3RydWN0b3IsIGJ5dGVzLCBwYXJhbXMpO1xyXG4gICAgcmV0dXJuIHRoaXMuZmlsbEdhcyh7IC4uLnRoaXMucHJvdmlkZXIuZGVmYXVsdFR4LCBkYXRhIH0pXHJcbiAgICAgIC5waXBlKHN3aXRjaE1hcCh0eCA9PiB0aGlzLnByb3ZpZGVyLnNlbmRUcmFuc2FjdGlvbih0eCkpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVzZWQgZm9yICdjYWxsJyBtZXRob2RzXHJcbiAgICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIGNhbGxcclxuICAgKiBAcGFyYW0gcGFyYW1zIFRoZSBwYXJhbXMgZ2l2ZW4gYnkgdGhlIHVzZXJcclxuICAgKi9cclxuICBwcml2YXRlIGNhbGxNZXRob2QobWV0aG9kOiBBQklEZWZpbml0aW9uLCAuLi5wYXJhbXM6IGFueVtdKSB7XHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5lbmNvZGVyLmVuY29kZU1ldGhvZChtZXRob2QsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAuY2FsbDxzdHJpbmc+KHRoaXMuYWRkcmVzcywgZGF0YSlcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgbWFwKHJlc3VsdCA9PiB0aGlzLmRlY29kZXIuZGVjb2RlT3V0cHV0cyhyZXN1bHQsIG1ldGhvZC5vdXRwdXRzKSksXHJcbiAgICAgICAgbWFwKHJlc3VsdCA9PiByZXN1bHRbT2JqZWN0LmtleXMocmVzdWx0KVswXV0pXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIGZvciAnc2VuZCcgbWV0aG9kc1xyXG4gICAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCB0byBzZW5kXHJcbiAgICogQHBhcmFtIHBhcmFtcyBUaGUgcGFyYW1zIGdpdmVuIGJ5IHRoZSB1c2VyXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZW5kTWV0aG9kKG1ldGhvZDogQUJJRGVmaW5pdGlvbiwgLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgY29uc3QgeyB0bywgZGF0YSB9ID0geyB0bzogdGhpcy5hZGRyZXNzLCBkYXRhOiB0aGlzLmVuY29kZXIuZW5jb2RlTWV0aG9kKG1ldGhvZCwgcGFyYW1zKSB9O1xyXG4gICAgcmV0dXJuIHRoaXMuZmlsbEdhcyh7IC4uLnRoaXMucHJvdmlkZXIuZGVmYXVsdFR4LCB0bywgZGF0YSB9KVxyXG4gICAgICAucGlwZShzd2l0Y2hNYXAodHggPT4gdGhpcy5wcm92aWRlci5zZW5kVHJhbnNhY3Rpb24odHgpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VkIGZvciAnZXZlbnQnIGRlZmluaXRpb25cclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IGRlZmluaXRpb24gaW4gdGhlIEFCSVxyXG4gICAqL1xyXG4gIHByaXZhdGUgZXZlbnRNZXRob2QoZXZlbnQ6IEFCSURlZmluaXRpb24pIHtcclxuICAgIGNvbnN0IHRvcGljcyA9IHRoaXMuZW5jb2Rlci5lbmNvZGVFdmVudChldmVudCk7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ldmVudCh0aGlzLmFkZHJlc3MsIFt0b3BpY3NdKS5waXBlKFxyXG4gICAgICBtYXAobG9ncyA9PiB0aGlzLmRlY29kZXIuZGVjb2RlRXZlbnQobG9ncy50b3BpY3MsIGxvZ3MuZGF0YSwgZXZlbnQuaW5wdXRzKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGaWxsIHRoZSBlc3RpbWF0ZWQgYW1vdW50IG9mIGdhcyBhbmQgZ2FzUHJpY2UgdG8gdXNlIGZvciBhIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIHR4IFRoZSByYXcgdHJhbnNhY3Rpb24gdG8gZXN0aW1hdGUgdGhlIGdhcyBmcm9tXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBmaWxsR2FzKHR4OiBQYXJ0aWFsPElUeE9iamVjdD4pOiBPYnNlcnZhYmxlPFBhcnRpYWw8SVR4T2JqZWN0Pj4ge1xyXG4gICAgcmV0dXJuIGZvcmtKb2luKFxyXG4gICAgICB0aGlzLnByb3ZpZGVyLmVzdGltYXRlR2FzKHR4KSxcclxuICAgICAgdGhpcy5wcm92aWRlci5nYXNQcmljZSgpXHJcbiAgICApLnBpcGUobWFwKChbZ2FzLCBnYXNQcmljZV0pID0+IHtcclxuICAgICAgICByZXR1cm4geyAuLi50eCwgZ2FzLCBnYXNQcmljZSB9XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn1cclxuIl19