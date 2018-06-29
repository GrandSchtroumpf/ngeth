/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, Injectable } from '@angular/core';
import { TxLogs, TxObject, hexToNumber, hexToNumberString } from '@ngeth/utils';
import { ProvidersModule, AUTH } from '../providers.module';
import { MainProvider } from './../provider';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../providers.module";
import * as i2 from "../provider";
export class ContractProvider {
    /**
     * @param {?} auth
     * @param {?} provider
     */
    constructor(auth, provider) {
        this.auth = auth;
        this.provider = provider;
        this.currentTx = new BehaviorSubject(null);
        this.tx$ = this.currentTx.asObservable();
        this.auth.account$
            .subscribe(from => this.defaultTx = Object.assign({}, this.defaultTx, { from }));
        this.id = this.provider.id;
    }
    /**
     * @return {?}
     */
    get defaultTx() {
        return this.currentTx.getValue();
    }
    /**
     * @param {?} transaction
     * @return {?}
     */
    set defaultTx(transaction) {
        const /** @type {?} */ tx = Object.assign({}, this.currentTx.getValue(), transaction);
        this.currentTx.next(tx);
    }
    /**
     * Make a call to the node
     * @template T
     * @param {?} to The address of the contract to contact
     * @param {?} data The data of the call as bytecode
     * @param {?=} blockTag The block to target
     * @return {?}
     */
    call(to, data, blockTag = 'latest') {
        return this.provider.rpc('eth_call', [{ to, data }, blockTag]);
    }
    /**
     * Send a transaction to the node
     * @template T
     * @param {?} transaction
     * @param {...?} rest
     * @return {?}
     */
    sendTransaction(transaction, ...rest) {
        const /** @type {?} */ tx = new TxObject(transaction);
        return this.auth.sendTransaction(tx, rest);
    }
    /**
     * Create a RPC request for a subscription
     * @param {?} address The address of the contract
     * @param {?} topics The signature of the event
     * @return {?}
     */
    event(address, topics) {
        return this.provider.rpcSub(['logs', { address, topics }]).pipe(map(logs => new TxLogs(logs)));
    }
    /**
     * Estimate the amount of gas needed for transaction
     * @param {?} transaction The transaction to estimate the gas from
     * @return {?}
     */
    estimateGas(transaction) {
        const /** @type {?} */ tx = new TxObject(transaction);
        return this.provider.rpc('eth_estimateGas', [tx]).pipe(map(gas => hexToNumber(gas.replace('0x', ''))));
    }
    /**
     * Returns the current price per gas in wei
     * @return {?}
     */
    gasPrice() {
        return this.provider.rpc('eth_gasPrice', []).pipe(map(price => hexToNumberString(price.replace('0x', ''))));
    }
}
ContractProvider.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
ContractProvider.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [AUTH,] },] },
    { type: MainProvider, },
];
/** @nocollapse */ ContractProvider.ngInjectableDef = i0.defineInjectable({ factory: function ContractProvider_Factory() { return new ContractProvider(i0.inject(i1.AUTH), i0.inject(i2.MainProvider)); }, token: ContractProvider, providedIn: i1.ProvidersModule });
function ContractProvider_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ContractProvider.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ContractProvider.ctorParameters;
    /** @type {?} */
    ContractProvider.prototype.currentTx;
    /** @type {?} */
    ContractProvider.prototype.tx$;
    /** @type {?} */
    ContractProvider.prototype.id;
    /** @type {?} */
    ContractProvider.prototype.auth;
    /** @type {?} */
    ContractProvider.prototype.provider;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvcHJvdmlkZXIvIiwic291cmNlcyI6WyJsaWIvc3VicHJvdmlkZXJzL2NvbnRyYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQVksTUFBTSxFQUFhLFFBQVEsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDckcsT0FBTyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU1RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdDLE9BQU8sRUFBYyxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBR3JDLE1BQU07Ozs7O0lBS0osWUFBa0MsTUFBb0IsUUFBc0I7UUFBMUMsU0FBSSxHQUFKLElBQUk7UUFBZ0IsYUFBUSxHQUFSLFFBQVEsQ0FBYzt5QkFKeEQsSUFBSSxlQUFlLENBQXFCLElBQUksQ0FBQzttQkFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUU7UUFJeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQ2IsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMscUJBQVEsSUFBSSxDQUFDLFNBQVMsSUFBRSxJQUFJLEdBQUUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7S0FDNUI7Ozs7SUFFRCxJQUFJLFNBQVM7UUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNsQzs7Ozs7SUFFRCxJQUFJLFNBQVMsQ0FBQyxXQUErQjtRQUMzQyx1QkFBTSxFQUFFLHFCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUssV0FBVyxDQUFFLENBQUM7UUFDM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDekI7Ozs7Ozs7OztJQVFNLElBQUksQ0FDVCxFQUFVLEVBQ1YsSUFBWSxFQUNaLFdBQXFCLFFBQVE7UUFFN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFJLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7OztJQVE3RCxlQUFlLENBQ3BCLFdBQStCLEVBQy9CLEdBQUcsSUFBVztRQUVkLHVCQUFNLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDOzs7Ozs7OztJQVN0QyxLQUFLLENBQ1YsT0FBZSxFQUNmLE1BQWdCO1FBRWhCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNuRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUM5QixDQUFDOzs7Ozs7O0lBT0csV0FBVyxDQUFDLFdBQStCO1FBQ2hELHVCQUFNLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQVMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDNUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDL0MsQ0FBQzs7Ozs7O0lBTUcsUUFBUTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBUyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUN2RCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQ3pELENBQUM7Ozs7WUFoRkwsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFHLGVBQWUsRUFBRTs7Ozs0Q0FNN0IsTUFBTSxTQUFDLElBQUk7WUFWakIsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCbG9ja1RhZywgVHhMb2dzLCBJVHhPYmplY3QsIFR4T2JqZWN0LCBoZXhUb051bWJlciwgaGV4VG9OdW1iZXJTdHJpbmcgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBQcm92aWRlcnNNb2R1bGUsIEFVVEggfSBmcm9tICcuLi9wcm92aWRlcnMubW9kdWxlJztcclxuaW1wb3J0IHsgQXV0aCB9IGZyb20gJy4vLi4vYXV0aCc7XHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4vLi4vcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluIDogUHJvdmlkZXJzTW9kdWxlIH0pXHJcbmV4cG9ydCBjbGFzcyBDb250cmFjdFByb3ZpZGVyIHtcclxuICBwcml2YXRlIGN1cnJlbnRUeCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UGFydGlhbDxJVHhPYmplY3Q+PihudWxsKTtcclxuICBwdWJsaWMgdHgkID0gdGhpcy5jdXJyZW50VHguYXNPYnNlcnZhYmxlKCk7XHJcbiAgcHVibGljIGlkOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoQVVUSCkgcHJpdmF0ZSBhdXRoOiBBdXRoLCBwcml2YXRlIHByb3ZpZGVyOiBNYWluUHJvdmlkZXIpIHtcclxuICAgIHRoaXMuYXV0aC5hY2NvdW50JFxyXG4gICAgICAgIC5zdWJzY3JpYmUoZnJvbSA9PiB0aGlzLmRlZmF1bHRUeCA9IHsgLi4udGhpcy5kZWZhdWx0VHgsIGZyb20gfSk7XHJcbiAgICB0aGlzLmlkID0gdGhpcy5wcm92aWRlci5pZDtcclxuICB9XHJcblxyXG4gIGdldCBkZWZhdWx0VHgoKTogUGFydGlhbDxJVHhPYmplY3Q+IHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRUeC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRlZmF1bHRUeCh0cmFuc2FjdGlvbjogUGFydGlhbDxJVHhPYmplY3Q+KSB7XHJcbiAgICBjb25zdCB0eCA9IHsuLi50aGlzLmN1cnJlbnRUeC5nZXRWYWx1ZSgpLCAuLi50cmFuc2FjdGlvbiB9O1xyXG4gICAgdGhpcy5jdXJyZW50VHgubmV4dCh0eCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIGEgY2FsbCB0byB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSB0byBUaGUgYWRkcmVzcyBvZiB0aGUgY29udHJhY3QgdG8gY29udGFjdFxyXG4gICAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIG9mIHRoZSBjYWxsIGFzIGJ5dGVjb2RlXHJcbiAgICogQHBhcmFtIGJsb2NrVGFnIFRoZSBibG9jayB0byB0YXJnZXRcclxuICAgKi9cclxuICBwdWJsaWMgY2FsbDxUPihcclxuICAgIHRvOiBzdHJpbmcsXHJcbiAgICBkYXRhOiBzdHJpbmcsXHJcbiAgICBibG9ja1RhZzogQmxvY2tUYWcgPSAnbGF0ZXN0J1xyXG4gICk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPFQ+KCdldGhfY2FsbCcsIFt7IHRvLCBkYXRhIH0sIGJsb2NrVGFnXSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGEgdHJhbnNhY3Rpb24gdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHBhc3MgdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tUYWcgVGhlIGJsb2NrIHRvIHRhcmdldFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVHJhbnNhY3Rpb248VD4oXHJcbiAgICB0cmFuc2FjdGlvbjogUGFydGlhbDxJVHhPYmplY3Q+LFxyXG4gICAgLi4ucmVzdDogYW55W11cclxuICApOiBPYnNlcnZhYmxlPFQ+IHtcclxuICAgIGNvbnN0IHR4ID0gbmV3IFR4T2JqZWN0KHRyYW5zYWN0aW9uKTtcclxuICAgIHJldHVybiB0aGlzLmF1dGguc2VuZFRyYW5zYWN0aW9uKHR4LCByZXN0KTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBSUEMgcmVxdWVzdCBmb3IgYSBzdWJzY3JpcHRpb25cclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyBvZiB0aGUgY29udHJhY3RcclxuICAgKiBAcGFyYW0gdG9waWNzIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50XHJcbiAgICovXHJcbiAgcHVibGljIGV2ZW50KFxyXG4gICAgYWRkcmVzczogc3RyaW5nLFxyXG4gICAgdG9waWNzOiBzdHJpbmdbXVxyXG4gICk6IE9ic2VydmFibGU8VHhMb2dzPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGNTdWI8VHhMb2dzPihbJ2xvZ3MnLCB7YWRkcmVzcywgdG9waWNzfV0pLnBpcGUoXHJcbiAgICAgIG1hcChsb2dzID0+IG5ldyBUeExvZ3MobG9ncykpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXN0aW1hdGUgdGhlIGFtb3VudCBvZiBnYXMgbmVlZGVkIGZvciB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSB0cmFuc2FjdGlvbiBUaGUgdHJhbnNhY3Rpb24gdG8gZXN0aW1hdGUgdGhlIGdhcyBmcm9tXHJcbiAgICovXHJcbiAgcHVibGljIGVzdGltYXRlR2FzKHRyYW5zYWN0aW9uOiBQYXJ0aWFsPElUeE9iamVjdD4pOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xyXG4gICAgY29uc3QgdHggPSBuZXcgVHhPYmplY3QodHJhbnNhY3Rpb24pO1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4oJ2V0aF9lc3RpbWF0ZUdhcycsIFt0eF0pLnBpcGUoXHJcbiAgICAgIG1hcChnYXMgPT4gaGV4VG9OdW1iZXIoZ2FzLnJlcGxhY2UoJzB4JywgJycpKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHByaWNlIHBlciBnYXMgaW4gd2VpXHJcbiAgICovXHJcbiAgcHVibGljIGdhc1ByaWNlKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX2dhc1ByaWNlJywgW10pLnBpcGUoXHJcbiAgICAgIG1hcChwcmljZSA9PiBoZXhUb051bWJlclN0cmluZyhwcmljZS5yZXBsYWNlKCcweCcsICcnKSkpXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=