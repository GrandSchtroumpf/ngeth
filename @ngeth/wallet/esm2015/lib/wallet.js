/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
export class Wallet {
    /**
     * @param {?} provider
     * @param {?} signer
     * @param {?} accounts
     */
    constructor(provider, signer, accounts) {
        this.provider = provider;
        this.signer = signer;
        this.accounts = accounts;
        this.localKeystore = new BehaviorSubject(null);
        this.currentAccount = new BehaviorSubject(null);
        this.keystores$ = this.localKeystore.asObservable();
        this.account$ = this.currentAccount.asObservable();
        this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
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
     * Return the keystore map from the localstore
     * @return {?}
     */
    getKeystoreMapFromLocalStorage() {
        return new Array(localStorage.length).fill(null)
            .reduce((keyMap, none, i) => {
            const /** @type {?} */ key = localStorage.key(i);
            return checkAddressChecksum(key)
                ? Object.assign({}, keyMap, { [key]: this.getKeystore(key) }) : Object.assign({}, keyMap);
        }, {});
    }
    /**
     * Get a specific keystore depending on its address
     * @param {?} address The address of the keystore
     * @return {?}
     */
    getKeystore(address) {
        const /** @type {?} */ checkSum = toChecksumAddress(address);
        return JSON.parse(localStorage.getItem(checkSum));
    }
    /**
     * Return the list of addresses available in the localStorage
     * @return {?}
     */
    getAccounts() {
        return this.keystores$.pipe(map(keyMap => Object.keys(keyMap)));
    }
    /**
     * Create an account
     * @return {?}
     */
    create() {
        return this.accounts.create();
    }
    /**
     * Save an account into the localstorage
     * @param {?} account The key pair account
     * @param {?} password The password to encrypt the account with
     * @return {?}
     */
    save(account, password) {
        const { address, privateKey } = account;
        const /** @type {?} */ keystore = this.encrypt(privateKey, password);
        // Update allKeystore
        localStorage.setItem(address, JSON.stringify(keystore));
        this.localKeystore.next(this.getKeystoreMapFromLocalStorage());
    }
    /**
     * Encrypt an private key into a keystore
     * @param {?} privateKey The private key to encrypt
     * @param {?} password The password to encrypt the private key with
     * @param {?=} options A list of options to encrypt the private key
     * @return {?}
     */
    encrypt(privateKey, password, options) {
        return this.accounts.encrypt(privateKey, password, options);
    }
    /**
     * Decrypt a keystore object
     * @param {?} keystore The keystore object
     * @param {?} password The password to decrypt the keystore with
     * @return {?}
     */
    decrypt(keystore, password) {
        return this.accounts.decrypt(keystore, password);
    }
    /**
     * Send a transaction by signing it
     * @param {?} tx The transaction to send
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    sendTransaction(tx, privateKey) {
        const { rawTransaction } = this.signTx(tx, privateKey);
        return this.sendRawTransaction(rawTransaction);
    }
    /**
     * Send a transaction to the node
     * @param {?} rawTx The signed transaction data.
     * @return {?}
     */
    sendRawTransaction(rawTx) {
        return this.provider.rpc('eth_sendRawTransaction', [rawTx]);
    }
    /**
     * Sign a transaction with a private key
     * @param {?} tx The transaction to sign
     * @param {?} privateKey The private key to sign the transaction with
     * @return {?}
     */
    signTx(tx, privateKey) {
        return this.signer.signTx(privateKey, tx, this.provider.id);
    }
    /**
     * Sign a message
     * @param {?} message the message to sign
     * @param {?} address the address to sign the message with
     * @param {?} password the password needed to decrypt the private key
     * @return {?}
     */
    sign(message, address, password) {
        return this.keystores$.pipe(map(keystores => keystores[address]), map(keystore => this.decrypt(keystore, password)), map(ethAccount => this.signMessage(message, ethAccount.privateKey)));
    }
    /**
     * Sign a message with the private key
     * @param {?} message The message to sign
     * @param {?} privateKey The private key to sign the message with
     * @return {?}
     */
    signMessage(message, privateKey) {
        const /** @type {?} */ messageHash = this.signer.hashMessage(message);
        const { r, s, v, signature } = this.signer.sign(privateKey, messageHash);
        return { message, messageHash, v, r, s, signature };
    }
}
Wallet.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
Wallet.ctorParameters = () => [
    { type: MainProvider, },
    { type: Signer, },
    { type: Accounts, },
];
/** @nocollapse */ Wallet.ngInjectableDef = i0.defineInjectable({ factory: function Wallet_Factory() { return new Wallet(i0.inject(i1.MainProvider), i0.inject(i2.Signer), i0.inject(i3.Accounts)); }, token: Wallet, providedIn: i1.ProvidersModule });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3dhbGxldC8iLCJzb3VyY2VzIjpbImxpYi93YWxsZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQVEsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RSxPQUFPLEVBQVksaUJBQWlCLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFakYsT0FBTyxFQUFFLFFBQVEsRUFBd0MsTUFBTSxXQUFXLENBQUM7QUFDM0UsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTVDLE9BQU8sRUFBYyxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbkQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7Ozs7OztBQU9yQyxNQUFNOzs7Ozs7SUFNSixZQUNVLFVBQ0EsUUFDQTtRQUZBLGFBQVEsR0FBUixRQUFRO1FBQ1IsV0FBTSxHQUFOLE1BQU07UUFDTixhQUFRLEdBQVIsUUFBUTs2QkFSTSxJQUFJLGVBQWUsQ0FBYyxJQUFJLENBQUM7OEJBQ3JDLElBQUksZUFBZSxDQUFTLElBQUksQ0FBQzswQkFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO1FBT2xELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDLENBQUM7S0FDaEU7Ozs7O0lBR0QsSUFBSSxjQUFjO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3ZDOzs7Ozs7SUFHRCxJQUFJLGNBQWMsQ0FBQyxPQUFlO1FBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFD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LENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ3pCLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUNwQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUNqRCxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FDcEUsQ0FBQzs7Ozs7Ozs7SUFRRyxXQUFXLENBQUMsT0FBZSxFQUFFLFVBQWtCO1FBQ3BELHVCQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxNQUFNLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFDLENBQUM7Ozs7WUFuSnJELFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUM7Ozs7WUFiaEIsWUFBWTtZQUk3QixNQUFNO1lBRE4sUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlLCBNYWluUHJvdmlkZXIsIEF1dGggfSBmcm9tICdAbmdldGgvcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBUeE9iamVjdCwgdG9DaGVja3N1bUFkZHJlc3MsIGNoZWNrQWRkcmVzc0NoZWNrc3VtIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuXHJcbmltcG9ydCB7IEFjY291bnRzLCBFbmNyeXB0T3B0aW9ucywgS2V5c3RvcmUsIEV0aEFjY291bnQgfSBmcm9tICcuL2FjY291bnQnO1xyXG5pbXBvcnQgeyBTaWduZXIgfSBmcm9tICcuL3NpZ25hdHVyZS9zaWduZXInO1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgS2V5c3RvcmVNYXAge1xyXG4gIFthZGRyZXNzOiBzdHJpbmddOiBLZXlzdG9yZTtcclxufVxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBQcm92aWRlcnNNb2R1bGV9KVxyXG5leHBvcnQgY2xhc3MgV2FsbGV0IGltcGxlbWVudHMgQXV0aCB7XHJcbiAgcHJpdmF0ZSBsb2NhbEtleXN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxLZXlzdG9yZU1hcD4obnVsbCk7XHJcbiAgcHJpdmF0ZSBjdXJyZW50QWNjb3VudCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPihudWxsKTtcclxuICBwdWJsaWMga2V5c3RvcmVzJCA9IHRoaXMubG9jYWxLZXlzdG9yZS5hc09ic2VydmFibGUoKTtcclxuICBwdWJsaWMgYWNjb3VudCQgPSB0aGlzLmN1cnJlbnRBY2NvdW50LmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcixcclxuICAgIHByaXZhdGUgc2lnbmVyOiBTaWduZXIsXHJcbiAgICBwcml2YXRlIGFjY291bnRzOiBBY2NvdW50c1xyXG4gICkge1xyXG4gICAgdGhpcy5sb2NhbEtleXN0b3JlLm5leHQodGhpcy5nZXRLZXlzdG9yZU1hcEZyb21Mb2NhbFN0b3JhZ2UoKSk7XHJcbiAgfVxyXG5cclxuICAvKiogR2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBnZXQgZGVmYXVsdEFjY291bnQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRBY2NvdW50LmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogU2V0IHRoZSBkZWZhdWx0IGFjY291bnQgKi9cclxuICBzZXQgZGVmYXVsdEFjY291bnQoYWNjb3VudDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRBY2NvdW50Lm5leHQodG9DaGVja3N1bUFkZHJlc3MoYWNjb3VudCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqIFJldHVybiB0aGUga2V5c3RvcmUgbWFwIGZyb20gdGhlIGxvY2Fsc3RvcmUgKi9cclxuICBwcml2YXRlIGdldEtleXN0b3JlTWFwRnJvbUxvY2FsU3RvcmFnZSgpOiBLZXlzdG9yZU1hcCB7XHJcbiAgICByZXR1cm4gbmV3IEFycmF5KGxvY2FsU3RvcmFnZS5sZW5ndGgpLmZpbGwobnVsbClcclxuICAgICAgLnJlZHVjZSgoa2V5TWFwOiBLZXlzdG9yZU1hcCwgbm9uZTogbnVsbCwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gbG9jYWxTdG9yYWdlLmtleShpKTtcclxuICAgICAgICByZXR1cm4gY2hlY2tBZGRyZXNzQ2hlY2tzdW0oa2V5KVxyXG4gICAgICAgICAgPyB7Li4ua2V5TWFwLCBba2V5XTogdGhpcy5nZXRLZXlzdG9yZShrZXkpIH1cclxuICAgICAgICAgIDogey4uLmtleU1hcH07XHJcbiAgICAgIH0sIHt9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBhIHNwZWNpZmljIGtleXN0b3JlIGRlcGVuZGluZyBvbiBpdHMgYWRkcmVzc1xyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIG9mIHRoZSBrZXlzdG9yZVxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRLZXlzdG9yZShhZGRyZXNzOiBzdHJpbmcpOiBLZXlzdG9yZSB7XHJcbiAgICBjb25zdCBjaGVja1N1bSA9IHRvQ2hlY2tzdW1BZGRyZXNzKGFkZHJlc3MpO1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY2hlY2tTdW0pKTtcclxuICB9XHJcblxyXG4gIC8qKiBSZXR1cm4gdGhlIGxpc3Qgb2YgYWRkcmVzc2VzIGF2YWlsYWJsZSBpbiB0aGUgbG9jYWxTdG9yYWdlICovXHJcbiAgcHVibGljIGdldEFjY291bnRzKCk6IE9ic2VydmFibGU8c3RyaW5nW10+IHtcclxuICAgIHJldHVybiB0aGlzLmtleXN0b3JlcyQucGlwZShtYXAoa2V5TWFwID0+IE9iamVjdC5rZXlzKGtleU1hcCkpKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYW4gYWNjb3VudFxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50cy5jcmVhdGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNhdmUgYW4gYWNjb3VudCBpbnRvIHRoZSBsb2NhbHN0b3JhZ2VcclxuICAgKiBAcGFyYW0gYWNjb3VudCBUaGUga2V5IHBhaXIgYWNjb3VudFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdG8gZW5jcnlwdCB0aGUgYWNjb3VudCB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNhdmUoYWNjb3VudDogRXRoQWNjb3VudCwgcGFzc3dvcmQ6IHN0cmluZykge1xyXG4gICAgY29uc3QgeyBhZGRyZXNzLCBwcml2YXRlS2V5IH0gPSBhY2NvdW50O1xyXG4gICAgY29uc3Qga2V5c3RvcmUgPSB0aGlzLmVuY3J5cHQocHJpdmF0ZUtleSwgcGFzc3dvcmQpO1xyXG4gICAgLy8gVXBkYXRlIGFsbEtleXN0b3JlXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShhZGRyZXNzLCBKU09OLnN0cmluZ2lmeShrZXlzdG9yZSkpO1xyXG4gICAgdGhpcy5sb2NhbEtleXN0b3JlLm5leHQodGhpcy5nZXRLZXlzdG9yZU1hcEZyb21Mb2NhbFN0b3JhZ2UoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmNyeXB0IGFuIHByaXZhdGUga2V5IGludG8gYSBrZXlzdG9yZVxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBlbmNyeXB0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0byBlbmNyeXB0IHRoZSBwcml2YXRlIGtleSB3aXRoXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgQSBsaXN0IG9mIG9wdGlvbnMgdG8gZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKi9cclxuICBwdWJsaWMgZW5jcnlwdChwcml2YXRlS2V5OiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYXJ0aWFsPEVuY3J5cHRPcHRpb25zPikge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudHMuZW5jcnlwdChwcml2YXRlS2V5LCBwYXNzd29yZCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWNyeXB0IGEga2V5c3RvcmUgb2JqZWN0XHJcbiAgICogQHBhcmFtIGtleXN0b3JlIFRoZSBrZXlzdG9yZSBvYmplY3RcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRvIGRlY3J5cHQgdGhlIGtleXN0b3JlIHdpdGhcclxuICAgKi9cclxuICBwdWJsaWMgZGVjcnlwdChrZXlzdG9yZTogS2V5c3RvcmUsIHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLmFjY291bnRzLmRlY3J5cHQoa2V5c3RvcmUsIHBhc3N3b3JkKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqXHJcbiAgICogVFJBTlNBQ1RJT05cclxuICAgKioqKioqKioqKioqKi9cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhIHRyYW5zYWN0aW9uIGJ5IHNpZ25pbmcgaXRcclxuICAgKiBAcGFyYW0gdHggVGhlIHRyYW5zYWN0aW9uIHRvIHNlbmRcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgdHJhbnNhY3Rpb24gd2l0aFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kVHJhbnNhY3Rpb24odHg6IFR4T2JqZWN0LCBwcml2YXRlS2V5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHsgcmF3VHJhbnNhY3Rpb24gfSA9IHRoaXMuc2lnblR4KHR4LCBwcml2YXRlS2V5KTtcclxuICAgIHJldHVybiB0aGlzLnNlbmRSYXdUcmFuc2FjdGlvbihyYXdUcmFuc2FjdGlvbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIGEgdHJhbnNhY3Rpb24gdG8gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gcmF3VHggVGhlIHNpZ25lZCB0cmFuc2FjdGlvbiBkYXRhLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZW5kUmF3VHJhbnNhY3Rpb24ocmF3VHg6IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlci5ycGM8c3RyaW5nPignZXRoX3NlbmRSYXdUcmFuc2FjdGlvbicsIFtyYXdUeF0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIHRyYW5zYWN0aW9uIHdpdGggYSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSB0eCBUaGUgdHJhbnNhY3Rpb24gdG8gc2lnblxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IFRoZSBwcml2YXRlIGtleSB0byBzaWduIHRoZSB0cmFuc2FjdGlvbiB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNpZ25UeCh0eDogVHhPYmplY3QsIHByaXZhdGVLZXk6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMuc2lnbmVyLnNpZ25UeChwcml2YXRlS2V5LCB0eCwgdGhpcy5wcm92aWRlci5pZCk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKipcclxuICAgKiBTSUdOQVRVUkVcclxuICAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogU2lnbiBhIG1lc3NhZ2VcclxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byBzaWduXHJcbiAgICogQHBhcmFtIGFkZHJlc3MgdGhlIGFkZHJlc3MgdG8gc2lnbiB0aGUgbWVzc2FnZSB3aXRoXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIHRoZSBwYXNzd29yZCBuZWVkZWQgdG8gZGVjcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKi9cclxuICBwdWJsaWMgc2lnbihtZXNzYWdlOiBzdHJpbmcsIGFkZHJlc3M6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMua2V5c3RvcmVzJC5waXBlKFxyXG4gICAgICBtYXAoa2V5c3RvcmVzID0+IGtleXN0b3Jlc1thZGRyZXNzXSksXHJcbiAgICAgIG1hcChrZXlzdG9yZSA9PiB0aGlzLmRlY3J5cHQoa2V5c3RvcmUsIHBhc3N3b3JkKSksXHJcbiAgICAgIG1hcChldGhBY2NvdW50ID0+IHRoaXMuc2lnbk1lc3NhZ2UobWVzc2FnZSwgZXRoQWNjb3VudC5wcml2YXRlS2V5KSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaWduIGEgbWVzc2FnZSB3aXRoIHRoZSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHNpZ25cclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBUaGUgcHJpdmF0ZSBrZXkgdG8gc2lnbiB0aGUgbWVzc2FnZSB3aXRoXHJcbiAgICovXHJcbiAgcHVibGljIHNpZ25NZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgcHJpdmF0ZUtleTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBtZXNzYWdlSGFzaCA9IHRoaXMuc2lnbmVyLmhhc2hNZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgY29uc3Qge3IsIHMsIHYsIHNpZ25hdHVyZX0gPSB0aGlzLnNpZ25lci5zaWduKHByaXZhdGVLZXksIG1lc3NhZ2VIYXNoKTtcclxuICAgIHJldHVybiB7bWVzc2FnZSwgbWVzc2FnZUhhc2gsIHYsIHIsIHMsIHNpZ25hdHVyZX07XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=