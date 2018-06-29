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
export class Eth {
    /**
     * @param {?} provider
     */
    constructor(provider) {
        this.provider = provider;
    }
    /**
     * @return {?}
     */
    getBlockNumber() {
        return this.provider
            .rpc('eth_blockNumber')
            .pipe(map(block => toBN(block).toString(10)));
        ;
    }
    /**
     * @return {?}
     */
    getGasPrice() {
        return this.provider
            .rpc('eth_gasPrice')
            .pipe(map(block => toBN(block).toString(10)));
    }
    /**
     * ***
     * BLOCK
     * @param {?} blockNumber
     * @return {?}
     */
    getBlockByNumber(blockNumber) {
        const /** @type {?} */ isNumber = typeof blockNumber === 'number';
        const /** @type {?} */ params = isNumber ? numberToHex(blockNumber) : blockNumber;
        return this.provider
            .rpc('eth_getBlockByNumber', [params, true])
            .pipe(map(block => (block ? new Block(block) : null)));
    }
    /**
     * @param {?} blockHash
     * @return {?}
     */
    getBlockByHash(blockHash) {
        return this.provider
            .rpc('eth_getBlockByNumber', [blockHash, true])
            .pipe(map(block => (block ? new Block(block) : null)));
    }
    /**
     * **********
     * TRANSACTION
     * @param {?} transactionHash
     * @return {?}
     */
    getTransaction(transactionHash) {
        return this.provider
            .rpc('eth_getTransactionByHash', [transactionHash])
            .pipe(map(tx => (tx ? new Transaction(tx) : null)));
    }
    /**
     * @param {?} transactionHash
     * @return {?}
     */
    getTransactionReceipt(transactionHash) {
        return this.provider
            .rpc('eth_getTransactionReceipt', [transactionHash])
            .pipe(map(receipt => (receipt ? new TxReceipt(receipt) : null)));
    }
    /**
     * ************
     * SUBSCRIPTIONS
     * @return {?}
     */
    onNewBlock() {
        return this.provider.rpcSub(['newHeads']).pipe(map(res => new Block(res)));
    }
    /**
     * @return {?}
     */
    isSyncing() {
        return this.provider.rpcSub(['syncing']);
    }
}
Eth.decorators = [
    { type: Injectable, args: [{ providedIn: ProvidersModule },] },
];
/** @nocollapse */
Eth.ctorParameters = () => [
    { type: MainProvider, },
];
/** @nocollapse */ Eth.ngInjectableDef = i0.defineInjectable({ factory: function Eth_Factory() { return new Eth(i0.inject(i1.MainProvider)); }, token: Eth, providedIn: i2.ProvidersModule });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL3Byb3ZpZGVyLyIsInNvdXJjZXMiOlsibGliL3N1YnByb3ZpZGVycy9ldGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBSXJDLE1BQU07Ozs7SUFFSixZQUFvQixRQUFzQjtRQUF0QixhQUFRLEdBQVIsUUFBUSxDQUFjO0tBQUk7Ozs7SUFFdkMsY0FBYztRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVE7YUFDakIsR0FBRyxDQUFTLGlCQUFpQixDQUFDO2FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFBLENBQUM7Ozs7O0lBRzVDLFdBQVc7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQ2pCLEdBQUcsQ0FBUyxjQUFjLENBQUM7YUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7OztJQU0zQyxnQkFBZ0IsQ0FBQyxXQUFXO1FBQ2pDLHVCQUFNLFFBQVEsR0FBRyxPQUFPLFdBQVcsS0FBSyxRQUFRLENBQUM7UUFDakQsdUJBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDakUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQ2pCLEdBQUcsQ0FBTSxzQkFBc0IsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNoRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7OztJQUdwRCxjQUFjLENBQUMsU0FBaUI7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQ2pCLEdBQUcsQ0FBTSxzQkFBc0IsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNuRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7O0lBTXBELGNBQWMsQ0FBQyxlQUF1QjtRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVE7YUFDakIsR0FBRyxDQUFTLDBCQUEwQixFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7SUFHakQscUJBQXFCLENBQUMsZUFBdUI7UUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQ2pCLEdBQUcsQ0FBUywyQkFBMkIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7OztJQU05RCxVQUFVO1FBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQzNCLENBQUE7Ozs7O0lBR0ksU0FBUztRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Ozs7WUEzRDVDLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRyxlQUFlLEVBQUU7Ozs7WUFMbkMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgbnVtYmVyVG9IZXgsIEJsb2NrLCBUcmFuc2FjdGlvbiwgVHhSZWNlaXB0LCB0b0JOIH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJzTW9kdWxlIH0gZnJvbSAnLi4vcHJvdmlkZXJzLm1vZHVsZSdcclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi4vcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW4gOiBQcm92aWRlcnNNb2R1bGUgfSlcclxuZXhwb3J0IGNsYXNzIEV0aCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvdmlkZXI6IE1haW5Qcm92aWRlcikge31cclxuXHJcbiAgcHVibGljIGdldEJsb2NrTnVtYmVyKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPHN0cmluZz4oJ2V0aF9ibG9ja051bWJlcicpXHJcbiAgICAgIC5waXBlKG1hcChibG9jayA9PiB0b0JOKGJsb2NrKS50b1N0cmluZygxMCkpKTs7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0R2FzUHJpY2UoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8bnVtYmVyPignZXRoX2dhc1ByaWNlJylcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IHRvQk4oYmxvY2spLnRvU3RyaW5nKDEwKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKlxyXG4gICAqIEJMT0NLXHJcbiAgICovXHJcbiAgcHVibGljIGdldEJsb2NrQnlOdW1iZXIoYmxvY2tOdW1iZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgY29uc3QgaXNOdW1iZXIgPSB0eXBlb2YgYmxvY2tOdW1iZXIgPT09ICdudW1iZXInO1xyXG4gICAgY29uc3QgcGFyYW1zID0gaXNOdW1iZXIgPyBudW1iZXJUb0hleChibG9ja051bWJlcikgOiBibG9ja051bWJlcjtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8YW55PignZXRoX2dldEJsb2NrQnlOdW1iZXInLCBbcGFyYW1zLCB0cnVlXSlcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IChibG9jayA/IG5ldyBCbG9jayhibG9jaykgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEJsb2NrQnlIYXNoKGJsb2NrSGFzaDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8YW55PignZXRoX2dldEJsb2NrQnlOdW1iZXInLCBbYmxvY2tIYXNoLCB0cnVlXSlcclxuICAgICAgLnBpcGUobWFwKGJsb2NrID0+IChibG9jayA/IG5ldyBCbG9jayhibG9jaykgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKipcclxuICAgKiBUUkFOU0FDVElPTlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRUcmFuc2FjdGlvbih0cmFuc2FjdGlvbkhhc2g6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlclxyXG4gICAgICAucnBjPG51bWJlcj4oJ2V0aF9nZXRUcmFuc2FjdGlvbkJ5SGFzaCcsIFt0cmFuc2FjdGlvbkhhc2hdKVxyXG4gICAgICAucGlwZShtYXAodHggPT4gKHR4ID8gbmV3IFRyYW5zYWN0aW9uKHR4KSA6IG51bGwpKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0VHJhbnNhY3Rpb25SZWNlaXB0KHRyYW5zYWN0aW9uSGFzaDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyXHJcbiAgICAgIC5ycGM8bnVtYmVyPignZXRoX2dldFRyYW5zYWN0aW9uUmVjZWlwdCcsIFt0cmFuc2FjdGlvbkhhc2hdKVxyXG4gICAgICAucGlwZShtYXAocmVjZWlwdCA9PiAocmVjZWlwdCA/IG5ldyBUeFJlY2VpcHQocmVjZWlwdCkgOiBudWxsKSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKlxyXG4gICAqIFNVQlNDUklQVElPTlNcclxuICAgKi9cclxuICBwdWJsaWMgb25OZXdCbG9jaygpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJwY1N1YihbJ25ld0hlYWRzJ10pLnBpcGUoXHJcbiAgICAgIG1hcChyZXMgPT4gbmV3IEJsb2NrKHJlcykpXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNTeW5jaW5nKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIucnBjU3ViKFsnc3luY2luZyddKTtcclxuICB9XHJcbn1cclxuIl19