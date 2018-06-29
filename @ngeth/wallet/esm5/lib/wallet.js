/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ProvidersModule, MainProvider } from '@ngeth/provider';
import { toChecksumAddress, checkAddressChecksum } from '@ngeth/utils';
import { Accounts } from './account';
import { Signer } from './signature/signer';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@ngeth/provider";
import * as i2 from "./signature/signer";
import * as i3 from "./account/account";
/**
 * @record
 */
export function KeystoreMap() { }
function KeystoreMap_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    [address: string]: Keystore;
    */
}
var Wallet = /** @class */ (function () {
    function Wallet(provider, signer, accounts) {
        this.provider = provider;
        this.signer = signer;
        this.accounts = accounts;
        this.localKeystore = new BehaviorSubject(null);
        this.currentAccount = new BehaviorSubject(null);
        this.keystores$ = this.localKeystore.asObservable();
        this.account$ = this.currentAccount.asObservable();
        this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
    }
    Object.defineProperty(Wallet.prototype, "defaultAccount", {
        /** Get the default account */
        get: /**
         * Get the default account
         * @return {?}
         */
        function () {
            return this.currentAccount.getValue();
        },
        /** Set the default account */
        set: /**
         * Set the default account
         * @param {?} account
         * @return {?}
         */
        function (account) {
            this.currentAccount.next(toChecksumAddress(account));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return the keystore map from the localstore
     * @return {?}
     */
    Wallet.prototype.getKeystoreMapFromLocalStorage = /**
     * Return the keystore map from the localstore
     * @return {?}
     */
    function () {
        var _this = this;
        return new Array(localStorage.length).fill(null)
            .reduce(function (keyMap, none, i) {
            var /** @type {?} */ key = localStorage.key(i);
            return checkAddressChecksum(key)
                ? tslib_1.__assign({}, keyMap, (_a = {}, _a[key] = _this.getKeystore(key), _a)) : tslib_1.__assign({}, keyMap);
            var _a;
        }, {});
    };
    /**
     * Get a specific keystore depending on its address
     * @param {?} address The address of the keystore
     * @return {?}
     */
    Wallet.prototype.getKeystore = /**
     * Get a specific keystore depending on its address
     * @param {?} address The address of the keystore
     * @return {?}
     */
    function (address) {
        var /** @type {?} */ checkSum = toChecksumAddress(address);
        return JSON.parse(localStorage.getItem(checkSum));
    };
    /**
     * Return the list of addresses available in the localStorage
     * @return {?}
     */
    Wallet.prototype.getAccounts = /**
     * Return the list of addresses available in the localStorage
     * @return {?}
     */
    function () {
        return this.keystores$.pipe(map(function (keyMap) { return Object.keys(keyMap); }));
    };
    /**
     * Create an account
     * @return {?}
     */
    Wallet.prototype.create = /**
     * Create an account
     * @return {?}
     */
    function () {
        return this.accounts.create();
    };
    /**
     * Save an account into the localstorage
     * @param {?} account The key pair account
     * @param {?} password The password to encrypt the account with
     * @return {?}
     */
    Wallet.prototype.save = /**
     * Save an account into the localstorage
     * @param {?} account The key pair account
     * @param {?} password The password to encrypt the account with
     * @return {?}
     */
    function (account, password) {
        var address = account.address, privateKey = account.privateKey;
        var /** @type {?} */ keystore = this.encrypt(privateKey, password);
        // Update allKeystore
        localStorage.setItem(address, JSON.stringify(keystore));
        this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
    };
    /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} options A list of options to encrypt the private key
     * @return {?}
     */
    Wallet.prototype.encrypt = /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} options A list of options to encrypt the private key
     * @return {?}
     */
    function (privateKey, password, options) {
        return this.accounts.encrypt(privateKey, password, options);
    };
    /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * @return {?}
     */
    Wallet.prototype.decrypt = /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * @return {?}
     */
    function (keystore, password) {
        return this.accounts.decrypt(keystore, password);
    };
    /**
     * Send a transaction by signing it
     * @param {?} tx The transaction to send
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    Wallet.prototype.sendTransaction = /**
     * Send a transaction by signing it
     * @param {?} tx The transaction to send
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    function (tx, privateKey) {
        var rawTransaction = this.signTx(tx, privateKey).rawTransaction;
        return this.sendRawTransaction(rawTransaction);
    };
    /**
     * Send a transaction to the node
     * @param {?} rawTx The signed transaction data.
     * @return {?}
     */
    Wallet.prototype.sendRawTransaction = /**
     * Send a transaction to the node
     * @param {?} rawTx The signed transaction data.
     * @return {?}
     */
    function (rawTx) {
        return this.provider.rpc('eth_sendRawTransaction', [rawTx]);
    };
    /**
     * Sign a transaction with a private key
     * @param {?} tx The transaction to sign
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    Wallet.prototype.signTx = /**
     * Sign a transaction with a private key
     * @param {?} tx The transaction to sign
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    function (tx, privateKey) {
        return this.signer.signTx(privateKey, tx, this.provider.id);
    };
    /**
     * Sign a message
     * @param {?} message the message to sign
     * @param {?} address the address to sign the message with
     * @param {?} password the password needed to decrypt the private key
     * @return {?}
     */
    Wallet.prototype.sign = /**
     * Sign a message
     * @param {?} message the message to sign
     * @param {?} address the address to sign the message with
     * @param {?} password the password needed to decrypt the private key
     * @return {?}
     */
    function (message, address, password) {
        var _this = this;
        return this.keystores$.pipe(map(function (keystores) { return keystores[address]; }), map(function (keystore) { return _this.decrypt(keystore, password); }), map(function (ethAccount) { return _this.signMessage(message, ethAccount.privateKey); }));
    };
    /**
     * Sign a message with the private key
     * @param {?} message The message to sign
     * @param {?} privateKey The private key to sign the message with
     * @return {?}
     */
    Wallet.prototype.signMessage = /**
     * Sign a message with the private key
     * @param {?} message The message to sign
     * @param {?} privateKey The private key to sign the message with
     * @return {?}
     */
    function (message, privateKey) {
        var /** @type {?} */ messageHash = this.signer.hashMessage(message);
        var _a = this.signer.sign(privateKey, messageHash), r = _a.r, s = _a.s, v = _a.v, signature = _a.signature;
        return { message: message, messageHash: messageHash, v: v, r: r, s: s, signature: signature };
    };
    Wallet.decorators = [
        { type: Injectable, args: [{ providedIn: ProvidersModule },] },
    ];
    /** @nocollapse */
    Wallet.ctorParameters = function () { return [
        { type: MainProvider, },
        { type: Signer, },
        { type: Accounts, },
    ]; };
    /** @nocollapse */ Wallet.ngInjectableDef = i0.defineInjectable({ factory: function Wallet_Factory() { return new Wallet(i0.inject(i1.MainProvider), i0.inject(i2.Signer), i0.inject(i3.Accounts)); }, token: Wallet, providedIn: i1.ProvidersModule });
    return Wallet;
}());
export { Wallet };
function Wallet_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    Wallet.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    Wallet.ctorParameters;
    /** @type {?} */
    Wallet.prototype.localKeystore;
    /** @type {?} */
    Wallet.prototype.currentAccount;
    /** @type {?} */
    Wallet.prototype.keystores$;
    /** @type {?} */
    Wallet.prototype.account$;
    /** @type {?} */
    Wallet.prototype.provider;
    /** @type {?} */
    Wallet.prototype.signer;
    /** @type {?} */
    Wallet.prototype.accounts;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3dhbGxldC8iLCJzb3VyY2VzIjpbImxpYi93YWxsZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFRLE1BQU0saUJBQWlCLENBQUM7QUFDdEUsT0FBTyxFQUFZLGlCQUFpQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRWpGLE9BQU8sRUFBRSxRQUFRLEVBQXdDLE1BQU0sV0FBVyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QyxPQUFPLEVBQWMsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0lBYW5DLGdCQUNVLFVBQ0EsUUFDQTtRQUZBLGFBQVEsR0FBUixRQUFRO1FBQ1IsV0FBTSxHQUFOLE1BQU07UUFDTixhQUFRLEdBQVIsUUFBUTs2QkFSTSxJQUFJLGVBQWUsQ0FBYyxJQUFJLENBQUM7OEJBQ3JDLElBQUksZUFBZSxDQUFTLElBQUksQ0FBQzswQkFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO1FBT2xELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDLENBQUM7S0FDaEU7SUFHRCxzQkFBSSxrQ0FBYztRQURsQiw4QkFBOEI7Ozs7O1FBQzlCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkM7UUFFRCw4QkFBOEI7Ozs7OztRQUM5QixVQUFtQixPQUFlO1lBQ2hDLElBQUksQ0FBQyxjQUFjLENB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TUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUN6QixHQUFHLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQWxCLENBQWtCLENBQUMsRUFDcEMsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQWhDLENBQWdDLENBQUMsRUFDakQsR0FBRyxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFoRCxDQUFnRCxDQUFDLENBQ3BFLENBQUM7Ozs7Ozs7O0lBUUcsNEJBQVc7Ozs7OztjQUFDLE9BQWUsRUFBRSxVQUFrQjtRQUNwRCxxQkFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsb0RBQU8sUUFBQyxFQUFFLFFBQUMsRUFBRSxRQUFDLEVBQUUsd0JBQVMsQ0FBOEM7UUFDdkUsTUFBTSxDQUFDLEVBQUMsT0FBTyxTQUFBLEVBQUUsV0FBVyxhQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsU0FBUyxXQUFBLEVBQUMsQ0FBQzs7O2dCQW5KckQsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBQzs7OztnQkFiaEIsWUFBWTtnQkFJN0IsTUFBTTtnQkFETixRQUFROzs7aUJBSmpCOztTQWVhLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByb3ZpZGVyc01vZHVsZSwgTWFpblByb3ZpZGVyLCBBdXRoIH0gZnJvbSAnQG5nZXRoL3Byb3ZpZGVyJztcclxuaW1wb3J0IHsgVHhPYmplY3QsIHRvQ2hlY2tzdW1BZGRyZXNzLCBjaGVja0FkZHJlc3NDaGVja3N1bSB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcblxyXG5pbXBvcnQgeyBBY2NvdW50cywgRW5jcnlwdE9wdGlvbnMsIEtleXN0b3JlLCBFdGhBY2NvdW50IH0gZnJvbSAnLi9hY2NvdW50JztcclxuaW1wb3J0IHsgU2lnbmVyIH0gZnJvbSAnLi9zaWduYXR1cmUvc2lnbmVyJztcclxuXHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEtleXN0b3JlTWFwIHtcclxuICBbYWRkcmVzczogc3RyaW5nXTogS2V5c3RvcmU7XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogUHJvdmlkZXJzTW9kdWxlfSlcclxuZXhwb3J0IGNsYXNzIFdhbGxldCBpbXBsZW1lbnRzIEF1dGgge1xyXG4gIHByaXZhdGUgbG9jYWxLZXlzdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8S2V5c3RvcmVNYXA+KG51bGwpO1xyXG4gIHByaXZhdGUgY3VycmVudEFjY291bnQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4obnVsbCk7XHJcbiAgcHVibGljIGtleXN0b3JlcyQgPSB0aGlzLmxvY2FsS2V5c3RvcmUuYXNPYnNlcnZhYmxlKCk7XHJcbiAgcHVibGljIGFjY291bnQkID0gdGhpcy5jdXJyZW50QWNjb3VudC5hc09ic2VydmFibGUoKTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHByb3ZpZGVyOiBNYWluUHJvdmlkZXIsXHJcbiAgICBwcml2YXRlIHNpZ25lcjogU2lnbmVyLFxyXG4gICAgcHJpdmF0ZSBhY2NvdW50czogQWNjb3VudHNcclxuICApIHtcclxuICAgIHRoaXMubG9jYWxLZXlzdG9yZS5uZXh0KHRoaXMuZ2V0S2V5c3RvcmVNYXBGcm9tTG9jYWxTdG9yYWdlKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCB0aGUgZGVmYXVsdCBhY2NvdW50ICovXHJcbiAgZ2V0IGRlZmF1bHRBY2NvdW50KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50QWNjb3VudC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNldCB0aGUgZGVmYXVsdCBhY2NvdW50ICovXHJcbiAgc2V0IGRlZmF1bHRBY2NvdW50KGFjY291bnQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5jdXJyZW50QWNjb3VudC5uZXh0KHRvQ2hlY2tzdW1BZGRyZXNzKGFjY291bnQpKTtcclxuICB9XHJcblxyXG4gIC8qKiBSZXR1cm4gdGhlIGtleXN0b3JlIG1hcCBmcm9tIHRoZSBsb2NhbHN0b3JlICovXHJcbiAgcHJpdmF0ZSBnZXRLZXlzdG9yZU1hcEZyb21Mb2NhbFN0b3JhZ2UoKTogS2V5c3RvcmVNYXAge1xyXG4gICAgcmV0dXJuIG5ldyBBcnJheShsb2NhbFN0b3JhZ2UubGVuZ3RoKS5maWxsKG51bGwpXHJcbiAgICAgIC5yZWR1Y2UoKGtleU1hcDogS2V5c3RvcmVNYXAsIG5vbmU6IG51bGwsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGxvY2FsU3RvcmFnZS5rZXkoaSk7XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrQWRkcmVzc0NoZWNrc3VtKGtleSlcclxuICAgICAgICAgID8gey4uLmtleU1hcCwgW2tleV06IHRoaXMuZ2V0S2V5c3RvcmUoa2V5KSB9XHJcbiAgICAgICAgICA6IHsuLi5rZXlNYXB9O1xyXG4gICAgICB9LCB7fSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYSBzcGVjaWZpYyBrZXlzdG9yZSBkZXBlbmRpbmcgb24gaXRzIGFkZHJlc3NcclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyBvZiB0aGUga2V5c3RvcmVcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0S2V5c3RvcmUoYWRkcmVzczogc3RyaW5nKTogS2V5c3RvcmUge1xyXG4gICAgY29uc3QgY2hlY2tTdW0gPSB0b0NoZWNrc3VtQWRkcmVzcyhhZGRyZXNzKTtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGNoZWNrU3VtKSk7XHJcbiAgfVxyXG5cclxuICAvKiogUmV0dXJuIHRoZSBsaXN0IG9mIGFkZHJlc3NlcyBhdmFpbGFibGUgaW4gdGhlIGxvY2FsU3RvcmFnZSAqL1xyXG4gIHB1YmxpYyBnZXRBY2NvdW50cygpOiBPYnNlcnZhYmxlPHN0cmluZ1tdPiB7XHJcbiAgICByZXR1cm4gdGhpcy5rZXlzdG9yZXMkLnBpcGUobWFwKGtleU1hcCA9PiBPYmplY3Qua2V5cyhrZXlNYXApKSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGFuIGFjY291bnRcclxuICAgKi9cclxuICBwdWJsaWMgY3JlYXRlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudHMuY3JlYXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTYXZlIGFuIGFjY291bnQgaW50byB0aGUgbG9jYWxzdG9yYWdlXHJcbiAgICogQHBhcmFtIGFjY291bnQgVGhlIGtleSBwYWlyIGFjY291bnRcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGVuY3J5cHQgdGhlIGFjY291bnQgd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzYXZlKGFjY291bnQ6IEV0aEFjY291bnQsIHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHsgYWRkcmVzcywgcHJpdmF0ZUtleSB9ID0gYWNjb3VudDtcclxuICAgIGNvbnN0IGtleXN0b3JlID0gdGhpcy5lbmNyeXB0KHByaXZhdGVLZXksIHBhc3N3b3JkKTtcclxuICAgIC8vIFVwZGF0ZSBhbGxLZXlzdG9yZVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYWRkcmVzcywgSlNPTi5zdHJpbmdpZnkoa2V5c3RvcmUpKTtcclxuICAgIHRoaXMubG9jYWxLZXlzdG9yZS5uZXh0KHRoaXMuZ2V0S2V5c3RvcmVNYXBGcm9tTG9jYWxTdG9yYWdlKCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jcnlwdCBhbiBwcml2YXRlIGtleSBpbnRvIGEga2V5c3RvcmVcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gZW5jcnlwdFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdG8gZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXkgd2l0aFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIEEgbGlzdCBvZiBvcHRpb25zIHRvIGVuY3J5cHQgdGhlIHByaXZhdGUga2V5XHJcbiAgICovXHJcbiAgcHVibGljIGVuY3J5cHQocHJpdmF0ZUtleTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBvcHRpb25zPzogUGFydGlhbDxFbmNyeXB0T3B0aW9ucz4pIHtcclxuICAgIHJldHVybiB0aGlzLmFjY291bnRzLmVuY3J5cHQocHJpdmF0ZUtleSwgcGFzc3dvcmQsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVjcnlwdCBhIGtleXN0b3JlIG9iamVjdFxyXG4gICAqIEBwYXJhbSBrZXlzdG9yZSBUaGUga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBkZWNyeXB0IHRoZSBrZXlzdG9yZSB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIGRlY3J5cHQoa2V5c3RvcmU6IEtleXN0b3JlLCBwYXNzd29yZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50cy5kZWNyeXB0KGtleXN0b3JlLCBwYXNzd29yZCk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKlxyXG4gICAqIFRSQU5TQUNUSU9OXHJcbiAgICoqKioqKioqKioqKiovXHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgYSB0cmFuc2FjdGlvbiBieSBzaWduaW5nIGl0XHJcbiAgICogQHBhcmFtIHR4IFRoZSB0cmFuc2FjdGlvbiB0byBzZW5kXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIHNpZ24gdGhlIHRyYW5zYWN0aW9uIHdpdGhcclxuICAgKi9cclxuICBwdWJsaWMgc2VuZFRyYW5zYWN0aW9uKHR4OiBUeE9iamVjdCwgcHJpdmF0ZUtleTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB7IHJhd1RyYW5zYWN0aW9uIH0gPSB0aGlzLnNpZ25UeCh0eCwgcHJpdmF0ZUtleSk7XHJcbiAgICByZXR1cm4gdGhpcy5zZW5kUmF3VHJhbnNhY3Rpb24ocmF3VHJhbnNhY3Rpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhIHRyYW5zYWN0aW9uIHRvIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHJhd1R4IFRoZSBzaWduZWQgdHJhbnNhY3Rpb24gZGF0YS5cclxuICAgKi9cclxuICBwdWJsaWMgc2VuZFJhd1RyYW5zYWN0aW9uKHJhd1R4OiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjPHN0cmluZz4oJ2V0aF9zZW5kUmF3VHJhbnNhY3Rpb24nLCBbcmF3VHhdKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSB0cmFuc2FjdGlvbiB3aXRoIGEgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgdHJhbnNhY3Rpb24gd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzaWduVHgodHg6IFR4T2JqZWN0LCBwcml2YXRlS2V5OiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLnNpZ25lci5zaWduVHgocHJpdmF0ZUtleSwgdHgsIHRoaXMucHJvdmlkZXIuaWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqXHJcbiAgICogU0lHTkFUVVJFXHJcbiAgICovXHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ24gYSBtZXNzYWdlXHJcbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gc2lnblxyXG4gICAqIEBwYXJhbSBhZGRyZXNzIHRoZSBhZGRyZXNzIHRvIHNpZ24gdGhlIG1lc3NhZ2Ugd2l0aFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCB0aGUgcGFzc3dvcmQgbmVlZGVkIHRvIGRlY3J5cHQgdGhlIHByaXZhdGUga2V5XHJcbiAgICovXHJcbiAgcHVibGljIHNpZ24obWVzc2FnZTogc3RyaW5nLCBhZGRyZXNzOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLmtleXN0b3JlcyQucGlwZShcclxuICAgICAgbWFwKGtleXN0b3JlcyA9PiBrZXlzdG9yZXNbYWRkcmVzc10pLFxyXG4gICAgICBtYXAoa2V5c3RvcmUgPT4gdGhpcy5kZWNyeXB0KGtleXN0b3JlLCBwYXNzd29yZCkpLFxyXG4gICAgICBtYXAoZXRoQWNjb3VudCA9PiB0aGlzLnNpZ25NZXNzYWdlKG1lc3NhZ2UsIGV0aEFjY291bnQucHJpdmF0ZUtleSkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIG1lc3NhZ2Ugd2l0aCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBzaWduXHJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgVGhlIHByaXZhdGUga2V5IHRvIHNpZ24gdGhlIG1lc3NhZ2Ugd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzaWduTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHByaXZhdGVLZXk6IHN0cmluZykge1xyXG4gICAgY29uc3QgbWVzc2FnZUhhc2ggPSB0aGlzLnNpZ25lci5oYXNoTWVzc2FnZShtZXNzYWdlKTtcclxuICAgIGNvbnN0IHtyLCBzLCB2LCBzaWduYXR1cmV9ID0gdGhpcy5zaWduZXIuc2lnbihwcml2YXRlS2V5LCBtZXNzYWdlSGFzaCk7XHJcbiAgICByZXR1cm4ge21lc3NhZ2UsIG1lc3NhZ2VIYXNoLCB2LCByLCBzLCBzaWduYXR1cmV9O1xyXG4gIH1cclxuXHJcbn1cclxuIl19