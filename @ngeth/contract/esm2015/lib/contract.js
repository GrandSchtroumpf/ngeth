/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { toChecksumAddress } from '@ngeth/utils';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
// unsupported: template constraints.
/**
 * @template T
 */
export class ContractClass {
    /**
     * @param {?} encoder
     * @param {?} decoder
     * @param {?} provider
     * @param {?} abi
     * @param {?=} address
     */
    constructor(encoder, decoder, provider, abi, address) {
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
        const /** @type {?} */ calls = [];
        const /** @type {?} */ sends = [];
        const /** @type {?} */ events = [];
        for (const /** @type {?} */ def of this.abi) {
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
        calls.forEach(def => (this.calls[def.name] = this.callMethod.bind(this, def)));
        sends.forEach(def => (this.sends[def.name] = this.sendMethod.bind(this, def)));
        events.forEach(def => (this.events[def.name] = this.eventMethod.bind(this, def)));
    }
    /**
     * Deploy the contract on the blockchain
     * @param {?} bytes The bytes of the contract
     * @param {...?} params Params to pass into the constructor
     * @return {?}
     */
    deploy(bytes, ...params) {
        const /** @type {?} */ constructor = this.abi.find(def => def.type === 'constructor');
        const /** @type {?} */ noParam = params.length === 0;
        const /** @type {?} */ data = noParam ? bytes : this.encoder.encodeConstructor(constructor, bytes, params);
        return this.fillGas(Object.assign({}, this.provider.defaultTx, { data }))
            .pipe(switchMap(tx => this.provider.sendTransaction(tx)));
    }
    /**
     * Used for 'call' methods
     * @param {?} method The method to call
     * @param {...?} params The params given by the user
     * @return {?}
     */
    callMethod(method, ...params) {
        const /** @type {?} */ data = this.encoder.encodeMethod(method, params);
        return this.provider
            .call(this.address, data)
            .pipe(map(result => this.decoder.decodeOutputs(result, method.outputs)), map(result => result[Object.keys(result)[0]]));
    }
    /**
     * Used for 'send' methods
     * @param {?} method The method to send
     * @param {...?} params The params given by the user
     * @return {?}
     */
    sendMethod(method, ...params) {
        const { to, data } = { to: this.address, data: this.encoder.encodeMethod(method, params) };
        return this.fillGas(Object.assign({}, this.provider.defaultTx, { to, data }))
            .pipe(switchMap(tx => this.provider.sendTransaction(tx)));
    }
    /**
     * Used for 'event' definition
     * @param {?} event The event definition in the ABI
     * @return {?}
     */
    eventMethod(event) {
        const /** @type {?} */ topics = this.encoder.encodeEvent(event);
        return this.provider.event(this.address, [topics]).pipe(map(logs => this.decoder.decodeEvent(logs.topics, logs.data, event.inputs)));
    }
    /**
     * Fill the estimated amount of gas and gasPrice to use for a transaction
     * @param {?} tx The raw transaction to estimate the gas from
     * @return {?}
     */
    fillGas(tx) {
        return forkJoin(this.provider.estimateGas(tx), this.provider.gasPrice()).pipe(map(([gas, gasPrice]) => {
            return Object.assign({}, tx, { gas, gasPrice });
        }));
    }
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvY29udHJhY3QvIiwic291cmNlcyI6WyJsaWIvY29udHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBaUIsaUJBQWlCLEVBQTRCLE1BQU0sY0FBYyxDQUFDO0FBSTFGLE9BQU8sRUFBYyxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFFLEdBQUcsRUFBRyxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFFakQsTUFBTTs7Ozs7Ozs7SUFLSixZQUNZLE9BQW1CLEVBQ25CLE9BQW1CLEVBQ25CLFFBQTBCLEVBQzVCLEtBQ0Q7UUFKRyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDNUIsUUFBRyxHQUFILEdBQUc7UUFDSixZQUFPLEdBQVAsT0FBTzt1Q0FUNEMsRUFBUzt1Q0FDVCxFQUFTO3dDQUNOLEVBQVM7UUFTdEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztTQUFFO1FBQ3hFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUFFO1FBQ2hFLHVCQUFNLEtBQUssR0FBVSxFQUFFLENBQUM7UUFDeEIsdUJBQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztRQUN4Qix1QkFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxDQUFDLHVCQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFB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QUFFLElBQUUsR0FBRyxFQUFFLFFBQVEsSUFBRTtTQUNoQyxDQUFDLENBQ0gsQ0FBQzs7Q0FHTCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFCSURlZmluaXRpb24sIHRvQ2hlY2tzdW1BZGRyZXNzLCBDb250cmFjdE1vZGVsLCBJVHhPYmplY3QgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBDb250cmFjdFByb3ZpZGVyIH0gZnJvbSAnQG5nZXRoL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgQUJJRW5jb2RlciwgQUJJRGVjb2RlciB9IGZyb20gJy4vYWJpJztcclxuXHJcbmltcG9ydCB7IE9ic2VydmFibGUsIGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCwgIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250cmFjdENsYXNzPFQgZXh0ZW5kcyBDb250cmFjdE1vZGVsPiB7XHJcbiAgcHVibGljIGNhbGxzOiB7IFtQIGluIGtleW9mIFRbJ2NhbGxzJ11dOiBUWydjYWxscyddW1BdOyB9ID0ge30gYXMgYW55O1xyXG4gIHB1YmxpYyBzZW5kczogeyBbUCBpbiBrZXlvZiBUWydzZW5kcyddXTogVFsnc2VuZHMnXVtQXTsgfSA9IHt9IGFzIGFueTtcclxuICBwdWJsaWMgZXZlbnRzOiB7IFtQIGluIGtleW9mIFRbJ2V2ZW50cyddXTogVFsnZXZlbnRzJ11bUF07IH0gPSB7fSBhcyBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJvdGVjdGVkIGVuY29kZXI6IEFCSUVuY29kZXIsXHJcbiAgICBwcm90ZWN0ZWQgZGVjb2RlcjogQUJJRGVjb2RlcixcclxuICAgIHByb3RlY3RlZCBwcm92aWRlcjogQ29udHJhY3RQcm92aWRlcixcclxuICAgIHByaXZhdGUgYWJpOiBBQklEZWZpbml0aW9uW10sXHJcbiAgICBwdWJsaWMgYWRkcmVzcz86IHN0cmluZ1xyXG4gICkge1xyXG4gICAgaWYgKCF0aGlzLmFiaSkgeyB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBhZGQgYW4gYWJpIHRvIHRoZSBjb250cmFjdCcpOyB9XHJcbiAgICBpZiAodGhpcy5hZGRyZXNzKSB7IHRoaXMuYWRkcmVzcyA9IHRvQ2hlY2tzdW1BZGRyZXNzKGFkZHJlc3MpOyB9XHJcbiAgICBjb25zdCBjYWxsczogYW55W10gPSBbXTtcclxuICAgIGNvbnN0IHNlbmRzOiBhbnlbXSA9IFtdO1xyXG4gICAgY29uc3QgZXZlbnRzOiBhbnlbXSA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBkZWYgb2YgdGhpcy5hYmkpIHtcclxuICAgICAgaWYgKGRlZi50eXBlID09PSAnZnVuY3Rpb24nICYmIGRlZi5jb25zdGFudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGNhbGxzLnB1c2goZGVmKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGVmLnR5cGUgPT09ICdmdW5jdGlvbicgJiYgZGVmLmNvbnN0YW50ID09PSBmYWxzZSkge1xyXG4gICAgICAgIHNlbmRzLnB1c2goZGVmKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGVmLnR5cGUgPT09ICdldmVudCcpIHtcclxuICAgICAgICBldmVudHMucHVzaChkZWYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjYWxscy5mb3JFYWNoKGRlZiA9PiAodGhpcy5jYWxsc1tkZWYubmFtZV0gPSB0aGlzLmNhbGxNZXRob2QuYmluZCh0aGlzLCBkZWYpKSk7XHJcbiAgICBzZW5kcy5mb3JFYWNoKGRlZiA9PiAodGhpcy5zZW5kc1tkZWYubmFtZV0gPSB0aGlzLnNlbmRNZXRob2QuYmluZCh0aGlzLCBkZWYpKSk7XHJcbiAgICBldmVudHMuZm9yRWFjaChkZWYgPT4gKHRoaXMuZXZlbnRzW2RlZi5uYW1lXSA9IHRoaXMuZXZlbnRNZXRob2QuYmluZCh0aGlzLCBkZWYpKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZXBsb3kgdGhlIGNvbnRyYWN0IG9uIHRoZSBibG9ja2NoYWluXHJcbiAgICogQHBhcmFtIGJ5dGVzIFRoZSBieXRlcyBvZiB0aGUgY29udHJhY3RcclxuICAgKiBAcGFyYW0gcGFyYW1zIFBhcmFtcyB0byBwYXNzIGludG8gdGhlIGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgcHVibGljIGRlcGxveShieXRlczogc3RyaW5nLCAuLi5wYXJhbXM6IGFueVtdKSB7XHJcbiAgICBjb25zdCBjb25zdHJ1Y3RvciA9IHRoaXMuYWJpLmZpbmQoZGVmID0+IGRlZi50eXBlID09PSAnY29uc3RydWN0b3InKTtcclxuICAgIGNvbnN0IG5vUGFyYW0gPSBwYXJhbXMubGVuZ3RoID09PSAwO1xyXG4gICAgY29uc3QgZGF0YSA9IG5vUGFyYW0gPyBieXRlcyA6IHRoaXMuZW5jb2Rlci5lbmNvZGVDb25zdHJ1Y3Rvcihjb25zdHJ1Y3RvciwgYnl0ZXMsIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcy5maWxsR2FzKHsgLi4udGhpcy5wcm92aWRlci5kZWZhdWx0VHgsIGRhdGEgfSlcclxuICAgICAgLnBpcGUoc3dpdGNoTWFwKHR4ID0+IHRoaXMucHJvdmlkZXIuc2VuZFRyYW5zYWN0aW9uKHR4KSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXNlZCBmb3IgJ2NhbGwnIG1ldGhvZHNcclxuICAgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gY2FsbFxyXG4gICAqIEBwYXJhbSBwYXJhbXMgVGhlIHBhcmFtcyBnaXZlbiBieSB0aGUgdXNlclxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FsbE1ldGhvZChtZXRob2Q6IEFCSURlZmluaXRpb24sIC4uLnBhcmFtczogYW55W10pIHtcclxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmVuY29kZXIuZW5jb2RlTWV0aG9kKG1ldGhvZCwgcGFyYW1zKTtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5jYWxsPHN0cmluZz4odGhpcy5hZGRyZXNzLCBkYXRhKVxyXG4gICAgICAucGlwZShcclxuICAgICAgICBtYXAocmVzdWx0ID0+IHRoaXMuZGVjb2Rlci5kZWNvZGVPdXRwdXRzKHJlc3VsdCwgbWV0aG9kLm91dHB1dHMpKSxcclxuICAgICAgICBtYXAocmVzdWx0ID0+IHJlc3VsdFtPYmplY3Qua2V5cyhyZXN1bHQpWzBdXSlcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVzZWQgZm9yICdzZW5kJyBtZXRob2RzXHJcbiAgICogQHBhcmFtIG1ldGhvZCBUaGUgbWV0aG9kIHRvIHNlbmRcclxuICAgKiBAcGFyYW0gcGFyYW1zIFRoZSBwYXJhbXMgZ2l2ZW4gYnkgdGhlIHVzZXJcclxuICAgKi9cclxuICBwcml2YXRlIHNlbmRNZXRob2QobWV0aG9kOiBBQklEZWZpbml0aW9uLCAuLi5wYXJhbXM6IGFueVtdKSB7XHJcbiAgICBjb25zdCB7IHRvLCBkYXRhIH0gPSB7IHRvOiB0aGlzLmFkZHJlc3MsIGRhdGE6IHRoaXMuZW5jb2Rlci5lbmNvZGVNZXRob2QobWV0aG9kLCBwYXJhbXMpIH07XHJcbiAgICByZXR1cm4gdGhpcy5maWxsR2FzKHsgLi4udGhpcy5wcm92aWRlci5kZWZhdWx0VHgsIHRvLCBkYXRhIH0pXHJcbiAgICAgIC5waXBlKHN3aXRjaE1hcCh0eCA9PiB0aGlzLnByb3ZpZGVyLnNlbmRUcmFuc2FjdGlvbih0eCkpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVzZWQgZm9yICdldmVudCcgZGVmaW5pdGlvblxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgZGVmaW5pdGlvbiBpbiB0aGUgQUJJXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBldmVudE1ldGhvZChldmVudDogQUJJRGVmaW5pdGlvbikge1xyXG4gICAgY29uc3QgdG9waWNzID0gdGhpcy5lbmNvZGVyLmVuY29kZUV2ZW50KGV2ZW50KTtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLmV2ZW50KHRoaXMuYWRkcmVzcywgW3RvcGljc10pLnBpcGUoXHJcbiAgICAgIG1hcChsb2dzID0+IHRoaXMuZGVjb2Rlci5kZWNvZGVFdmVudChsb2dzLnRvcGljcywgbG9ncy5kYXRhLCBldmVudC5pbnB1dHMpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbGwgdGhlIGVzdGltYXRlZCBhbW91bnQgb2YgZ2FzIGFuZCBnYXNQcmljZSB0byB1c2UgZm9yIGEgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gdHggVGhlIHJhdyB0cmFuc2FjdGlvbiB0byBlc3RpbWF0ZSB0aGUgZ2FzIGZyb21cclxuICAgKi9cclxuICBwcml2YXRlIGZpbGxHYXModHg6IFBhcnRpYWw8SVR4T2JqZWN0Pik6IE9ic2VydmFibGU8UGFydGlhbDxJVHhPYmplY3Q+PiB7XHJcbiAgICByZXR1cm4gZm9ya0pvaW4oXHJcbiAgICAgIHRoaXMucHJvdmlkZXIuZXN0aW1hdGVHYXModHgpLFxyXG4gICAgICB0aGlzLnByb3ZpZGVyLmdhc1ByaWNlKClcclxuICAgICkucGlwZShtYXAoKFtnYXMsIGdhc1ByaWNlXSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IC4uLnR4LCBnYXMsIGdhc1ByaWNlIH1cclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=