/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { utf8ToHex, toChecksumAddress } from '@ngeth/utils';
import { ProvidersModule } from './../providers.module';
import { MainProvider } from '../provider';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../provider";
import * as i2 from "../providers.module";
export class Account {
    /**
     * @param {?} provider
     */
    constructor(provider) {
        this.provider = provider;
        this.currentAccount = new BehaviorSubject(null);
        this.account$ = this.currentAccount.asObservable();
    }
    /**
     * Get the default account
     * @return {?}
     */
    get defaultAccount() {
        return this.currentAccount.getValue();
    }
    /**
     * Set the default account
     * @param {?} account
     * @return {?}
     */
    set defaultAccount(account) {
        this.currentAccount.next(toChecksumAddress(account));
    }
    /**
     * Get the list of accounts available on the node
     * @return {?}
     */
    getAccounts() {
        return this.provider.rpc('eth_accounts');
    }
    /**
     * Send a transaction to the node
     * @template T
     * @param {?} tx The transaction to pass to the node
     * @param {?=} blockTag The block to target
     * @return {?}
     */
    sendTransaction(tx, blockTag = 'latest') {
        return this.provider.rpc('eth_sendTransaction', [tx, blockTag]);
    }
    /**
     * @param {?} address
     * @param {?=} blockTag
     * @return {?}
     */
    getBalance(address, blockTag) {
        return this.provider.rpc('eth_getBalance', [address, blockTag || 'latest']);
    }
    /**
     * @param {?} address
     * @param {?=} blockTag
     * @return {?}
     */
    getTransactionCount(address, blockTag) {
        return this.provider.rpc('eth_getTransactionCount', [
            address,
            blockTag || 'latest'
        ]);
    }
    /**
     * @param {?} message
     * @param {?} address
     * @param {?} pwd
     * @return {?}
     */
    sign(message, address, pwd) {
        const /** @type {?} */ msg = utf8ToHex(message);
        const /** @type {?} */ method = this.provider.type === 'web3' ? 'personal_sign' : 'eth_sign';
        const /** @type {?} */ params = this.provider.type === 'web3' ? [address, msg, pwd] : [msg, address];
        return this.provider.rpc(method, params);
    }
}
Account.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
Account.ctorParameters = () => [
    { type: MainProvider, },
];
/** @nocollapse */ Account.ngInjectableDef = i0.defineInjectable({ factory: function Account_Factory() { return new Account(i0.inject(i1.MainProvider)); }, token: Account, providedIn: i2.ProvidersModule });
function Account_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    Account.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    Account.ctorParameters;
    /** @type {?} */
    Account.prototype.currentAccount;
    /** @type {?} */
    Account.prototype.account$;
    /** @type {?} */
    Account.prototype.provider;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC9wcm92aWRlci8iLCJzb3VyY2VzIjpbImxpYi9zdWJwcm92aWRlcnMvYWNjb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQVksU0FBUyxFQUFZLGlCQUFpQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRTNDLE9BQU8sRUFBYyxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFHbkQsTUFBTTs7OztJQUlKLFlBQW9CLFFBQXNCO1FBQXRCLGFBQVEsR0FBUixRQUFRLENBQWM7OEJBSGpCLElBQUksZUFBZSxDQUFTLElBQUksQ0FBQzt3QkFDeEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUU7S0FFTjs7Ozs7SUFHOUMsSUFBSSxjQUFjO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3ZDOzs7Ozs7SUFHRCxJQUFJLGNBQWMsQ0FBQyxPQUFlO1FBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDdEQ7Ozs7O0lBR00sV0FBVztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQVcsY0FBYyxDQUFDLENBQUM7Ozs7Ozs7OztJQVE5QyxlQUFlLENBQ3BCLEVBQVksRUFDWixXQUFxQixRQUFRO1FBRTdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBSSxxQkFBcUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0lBRzlELFVBQVUsQ0FBQyxPQUFlLEVBQUUsUUFBNEI7UUFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFTLGdCQUFnQixFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0lBRy9FLG1CQUFtQixDQUFDLE9BQWUsRUFBRSxRQUE0QjtRQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQVMseUJBQXlCLEVBQUU7WUFDMUQsT0FBTztZQUNQLFFBQVEsSUFBSSxRQUFRO1NBQ3JCLENBQUMsQ0FBQzs7Ozs7Ozs7SUFHRSxJQUFJLENBQUMsT0FBZSxFQUFFLE9BQWUsRUFBRyxHQUFXO1FBQ3hELHVCQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsdUJBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDNUUsdUJBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQVMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDOzs7O1lBakRwRCxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUcsZUFBZSxFQUFFOzs7O1lBSm5DLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFR4T2JqZWN0LCB1dGY4VG9IZXgsIEJsb2NrVGFnLCB0b0NoZWNrc3VtQWRkcmVzcyB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSB9IGZyb20gJy4vLi4vcHJvdmlkZXJzLm1vZHVsZSc7XHJcbmltcG9ydCB7IE1haW5Qcm92aWRlciB9IGZyb20gJy4uL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgQXV0aCB9IGZyb20gJy4uL2F1dGgnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbiA6IFByb3ZpZGVyc01vZHVsZSB9KVxyXG5leHBvcnQgY2xhc3MgQWNjb3VudCBpbXBsZW1lbnRzIEF1dGgge1xyXG4gIHByaXZhdGUgY3VycmVudEFjY291bnQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4obnVsbCk7XHJcbiAgcHVibGljIGFjY291bnQkID0gdGhpcy5jdXJyZW50QWNjb3VudC5hc09ic2VydmFibGUoKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm92aWRlcjogTWFpblByb3ZpZGVyKSB7fVxyXG5cclxuICAvKiogR2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBnZXQgZGVmYXVsdEFjY291bnQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRBY2NvdW50LmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogU2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBzZXQgZGVmYXVsdEFjY291bnQoYWNjb3VudDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRBY2NvdW50Lm5leHQodG9DaGVja3N1bUFkZHJlc3MoYWNjb3VudCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCB0aGUgbGlzdCBvZiBhY2NvdW50cyBhdmFpbGFibGUgb24gdGhlIG5vZGUgKi9cclxuICBwdWJsaWMgZ2V0QWNjb3VudHMoKTogT2JzZXJ2YWJsZTxzdHJpbmdbXT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZ1tdPignZXRoX2FjY291bnRzJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGEgdHJhbnNhY3Rpb24gdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHBhc3MgdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tUYWcgVGhlIGJsb2NrIHRvIHRhcmdldFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVHJhbnNhY3Rpb248VD4oXHJcbiAgICB0eDogVHhPYmplY3QsXHJcbiAgICBibG9ja1RhZzogQmxvY2tUYWcgPSAnbGF0ZXN0J1xyXG4gICk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPFQ+KCdldGhfc2VuZFRyYW5zYWN0aW9uJywgW3R4LCBibG9ja1RhZ10pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEJhbGFuY2UoYWRkcmVzczogc3RyaW5nLCBibG9ja1RhZz86IEJsb2NrVGFnIHwgbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX2dldEJhbGFuY2UnLCBbYWRkcmVzcywgYmxvY2tUYWcgfHwgJ2xhdGVzdCddKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRUcmFuc2FjdGlvbkNvdW50KGFkZHJlc3M6IHN0cmluZywgYmxvY2tUYWc/OiBCbG9ja1RhZyB8IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4oJ2V0aF9nZXRUcmFuc2FjdGlvbkNvdW50JywgW1xyXG4gICAgICBhZGRyZXNzLFxyXG4gICAgICBibG9ja1RhZyB8fCAnbGF0ZXN0J1xyXG4gICAgXSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2lnbihtZXNzYWdlOiBzdHJpbmcsIGFkZHJlc3M6IHN0cmluZywgIHB3ZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IG1zZyA9IHV0ZjhUb0hleChtZXNzYWdlKTtcclxuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMucHJvdmlkZXIudHlwZSA9PT0gJ3dlYjMnID8gJ3BlcnNvbmFsX3NpZ24nIDogJ2V0aF9zaWduJztcclxuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucHJvdmlkZXIudHlwZSA9PT0gJ3dlYjMnID8gW2FkZHJlc3MsIG1zZywgcHdkXSA6IFttc2csIGFkZHJlc3NdO1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4obWV0aG9kLCBwYXJhbXMpO1xyXG4gIH1cclxufVxyXG4iXX0=