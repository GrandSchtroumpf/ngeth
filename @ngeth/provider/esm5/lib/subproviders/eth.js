/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { numberToHex, Block, Transaction, TxReceipt, toBN } from '@ngeth/utils';
import { ProvidersModule } from '../providers.module';
import { MainProvider } from '../provider';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../provider";
import * as i2 from "../providers.module";
var Eth = /** @class */ (function () {
    function Eth(provider) {
        this.provider = provider;
    }
    /**
     * @return {?}
     */
    Eth.prototype.getBlockNumber = /**
     * @return {?}
     */
    function () {
        return this.provider
            .rpc('eth_blockNumber')
            .pipe(map(function (block) { return toBN(block).toString(10); }));
        ;
    };
    /**
     * @return {?}
     */
    Eth.prototype.getGasPrice = /**
     * @return {?}
     */
    function () {
        return this.provider
            .rpc('eth_gasPrice')
            .pipe(map(function (block) { return toBN(block).toString(10); }));
    };
    /**
     * ***
     * BLOCK
     * @param {?} blockNumber
     * @return {?}
     */
    Eth.prototype.getBlockByNumber = /**
     * ***
     * BLOCK
     * @param {?} blockNumber
     * @return {?}
     */
    function (blockNumber) {
        var /** @type {?} */ isNumber = typeof blockNumber === 'number';
        var /** @type {?} */ params = isNumber ? numberToHex(blockNumber) : blockNumber;
        return this.provider
            .rpc('eth_getBlockByNumber', [params, true])
            .pipe(map(function (block) { return (block ? new Block(block) : null); }));
    };
    /**
     * @param {?} blockHash
     * @return {?}
     */
    Eth.prototype.getBlockByHash = /**
     * @param {?} blockHash
     * @return {?}
     */
    function (blockHash) {
        return this.provider
            .rpc('eth_getBlockByNumber', [blockHash, true])
            .pipe(map(function (block) { return (block ? new Block(block) : null); }));
    };
    /**
     * **********
     * TRANSACTION
     * @param {?} transactionHash
     * @return {?}
     */
    Eth.prototype.getTransaction = /**
     * **********
     * TRANSACTION
     * @param {?} transactionHash
     * @return {?}
     */
    function (transactionHash) {
        return this.provider
            .rpc('eth_getTransactionByHash', [transactionHash])
            .pipe(map(function (tx) { return (tx ? new Transaction(tx) : null); }));
    };
    /**
     * @param {?} transactionHash
     * @return {?}
     */
    Eth.prototype.getTransactionReceipt = /**
     * @param {?} transactionHash
     * @return {?}
     */
    function (transactionHash) {
        return this.provider
            .rpc('eth_getTransactionReceipt', [transactionHash])
            .pipe(map(function (receipt) { return (receipt ? new TxReceipt(receipt) : null); }));
    };
    /**
     * ************
     * SUBSCRIPTIONS
     * @return {?}
     */
    Eth.prototype.onNewBlock = /**
     * ************
     * SUBSCRIPTIONS
     * @return {?}
     */
    function () {
        return this.provider.rpcSub(['newHeads']).pipe(map(function (res) { return new Block(res); }));
    };
    /**
     * @return {?}
     */
    Eth.prototype.isSyncing = /**
     * @return {?}
     */
    function () {
        return this.provider.rpcSub(['syncing']);
    };
    Eth.decorators = [
        { type: Injectable, args: [{ providedIn: ProvidersModule },] },
    ];
    /** @nocollapse */
    Eth.ctorParameters = function () { return [
        { type: MainProvider, },
    ]; };
    /** @nocollapse */ Eth.ngInjectableDef = i0.defineInjectable({ factory: function Eth_Factory() { return new Eth(i0.inject(i1.MainProvider)); }, token: Eth, providedIn: i2.ProvidersModule });
    return Eth;
}());
export { Eth };
function Eth_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    Eth.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    Eth.ctorParameters;
    /** @type {?} */
    Eth.prototype.provider;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3Byb3ZpZGVyLyIsInNvdXJjZXMiOlsibGliL3N1YnByb3ZpZGVycy9ldGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7OztJQU1uQyxhQUFvQixRQUFzQjtRQUF0QixhQUFRLEdBQVIsUUFBUSxDQUFjO0tBQUk7Ozs7SUFFdkMsNEJBQWM7Ozs7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQ2pCLEdBQUcsQ0FBUyxpQkFBaUIsQ0FBQzthQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLENBQUM7UUFBQSxDQUFDOzs7OztJQUc1Qyx5QkFBVzs7OztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVE7YUFDakIsR0FBRyxDQUFTLGNBQWMsQ0FBQzthQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7O0lBTTNDLDhCQUFnQjs7Ozs7O2NBQUMsV0FBVztRQUNqQyxxQkFBTSxRQUFRLEdBQUcsT0FBTyxXQUFXLEtBQUssUUFBUSxDQUFDO1FBQ2pELHFCQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUTthQUNqQixHQUFHLENBQU0sc0JBQXNCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQWpDLENBQWlDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7SUFHcEQsNEJBQWM7Ozs7Y0FBQyxTQUFpQjtRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVE7YUFDakIsR0FBRyxDQUFNLHNCQUFzQixFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ25ELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7SUFNcEQsNEJBQWM7Ozs7OztjQUFDLGVBQXVCO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUTthQUNqQixHQUFHLENBQVMsMEJBQTBCLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDLENBQUM7Ozs7OztJQUdqRCxtQ0FBcUI7Ozs7Y0FBQyxlQUF1QjtRQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVE7YUFDakIsR0FBRyxDQUFTLDJCQUEyQixFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDM0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQXpDLENBQXlDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0lBTTlELHdCQUFVOzs7Ozs7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDNUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQzNCLENBQUE7Ozs7O0lBR0ksdUJBQVM7Ozs7UUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7Z0JBM0Q1QyxVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUcsZUFBZSxFQUFFOzs7O2dCQUxuQyxZQUFZOzs7Y0FIckI7O1NBU2EsR0FBRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgbnVtYmVyVG9IZXgsIEJsb2NrLCBUcmFuc2FjdGlvbiwgVHhSZWNlaXB0LCB0b0JOIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlIH0gZnJvbSAnLi4vcHJvdmlkZXJzLm1vZHVsZSdcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi4vcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW4gOiBQcm92aWRlcnNNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEV0aCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcikge31cclxuXHJcbiAgcHVibGljIGdldEJsb2NrTnVtYmVyKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPHN0cmluZz4oJ2V0aF9ibG9ja051bWJlcicpXHJcbiAgICAgIC5waXBlKG1hcChibG9jayA9PiB0b0JOKGJsb2NrKS50b1N0cmluZygxMCkpKTs7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0R2FzUHJpY2UoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8bnVtYmVyPignZXRoX2dhc1ByaWNlJylcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IHRvQk4oYmxvY2spLnRvU3RyaW5nKDEwKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKlxyXG4gICAqIEJMT0NLXHJcbiAgICovXHJcbiAgcHVibGljIGdldEJsb2NrQnlOdW1iZXIoYmxvY2tOdW1iZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgY29uc3QgaXNOdW1iZXIgPSB0eXBlb2YgYmxvY2tOdW1iZXIgPT09ICdudW1iZXInO1xyXG4gICAgY29uc3QgcGFyYW1zID0gaXNOdW1iZXIgPyBudW1iZXJUb0hleChibG9ja051bWJlcikgOiBibG9ja051bWJlcjtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8YW55PignZXRoX2dldEJsb2NrQnlOdW1iZXInLCBbcGFyYW1zLCB0cnVlXSlcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IChibG9jayA/IG5ldyBCbG9jayhibG9jaykgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEJsb2NrQnlIYXNoKGJsb2NrSGFzaDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8YW55PignZXRoX2dldEJsb2NrQnlOdW1iZXInLCBbYmxvY2tIYXNoLCB0cnVlXSlcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IChibG9jayA/IG5ldyBCbG9jayhibG9jaykgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKipcclxuICAgKiBUUkFOU0FDVElPTlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRUcmFuc2FjdGlvbih0cmFuc2FjdGlvbkhhc2g6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPG51bWJlcj4oJ2V0aF9nZXRUcmFuc2FjdGlvbkJ5SGFzaCcsIFt0cmFuc2FjdGlvbkhhc2hdKVxyXG4gICAgICAucGlwZShtYXAodHggPT4gKHR4ID8gbmV3IFRyYW5zYWN0aW9uKHR4KSA6IG51bGwpKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0VHJhbnNhY3Rpb25SZWNlaXB0KHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8bnVtYmVyPignZXRoX2dldFRyYW5zYWN0aW9uUmVjZWlwdCcsIFt0cmFuc2FjdGlvbkhhc2hdKVxyXG4gICAgICAucGlwZShtYXAocmVjZWlwdCA9PiAocmVjZWlwdCA/IG5ldyBUeFJlY2VpcHQocmVjZWlwdCkgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKlxyXG4gICAqIFNVQlNDUklQVElPTlNcclxuICAgKi9cclxuICBwdWJsaWMgb25OZXdCbG9jaygpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwY1N1YihbJ25ld0hlYWRzJ10pLnBpcGUoXHJcbiAgICAgIG1hcChyZXMgPT4gbmV3IEJsb2NrKHJlcykpXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNTeW5jaW5nKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjU3ViKFsnc3luY2luZyddKTtcclxuICB9XHJcbn1cclxuIl19