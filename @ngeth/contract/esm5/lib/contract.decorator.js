/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ContractProvider } from '@ngeth/provider';
import { ABIEncoder, ABIDecoder } from './abi';
import { ContractModule } from './contract.module';
import { ContractClass } from './contract';
/**
 * @template T
 * @param {?} metadata
 * @return {?}
 */
export function Contract(metadata) {
    var abi = metadata.abi, addresses = metadata.addresses;
    var /** @type {?} */ jsonInterace = typeof abi === 'string' ? JSON.parse(abi) : abi;
    /**
     * Get the address of the contract depending on the id of the network
     * @param id The id of the network
     */
    var /** @type {?} */ getAddress = function (id) {
        switch (id) {
            case 1: return addresses['mainnet'];
            case 3: return addresses['ropsten'];
            case 4: return addresses['rinkeby'];
            case 42: return addresses['kovan'];
            default: return addresses['mainnet'];
        }
    };
    return function (Base) {
        var ContractDecorated = /** @class */ (function (_super) {
            tslib_1.__extends(ContractDecorated, _super);
            function ContractDecorated(encoder, decoder, provider) {
                var _this = _super.call(this, encoder, decoder, provider, jsonInterace, getAddress(provider.id)) || this;
                _this.encoder = encoder;
                _this.decoder = decoder;
                _this.provider = provider;
                return _this;
            }
            ContractDecorated.decorators = [
                { type: Injectable, args: [{ providedIn: ContractModule },] },
            ];
            /** @nocollapse */
            ContractDecorated.ctorParameters = function () { return [
                { type: ABIEncoder, },
                { type: ABIDecoder, },
                { type: ContractProvider, },
            ]; };
            return ContractDecorated;
        }(ContractClass));
        function ContractDecorated_tsickle_Closure_declarations() {
            /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
            ContractDecorated.decorators;
            /**
             * @nocollapse
             * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
             */
            ContractDecorated.ctorParameters;
            /** @type {?} */
            ContractDecorated.prototype.encoder;
            /** @type {?} */
            ContractDecorated.prototype.decoder;
            /** @type {?} */
            ContractDecorated.prototype.provider;
        }
        return /** @type {?} */ (ContractDecorated);
    };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL2NvbnRyYWN0LyIsInNvdXJjZXMiOlsibGliL2NvbnRyYWN0LmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDL0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7Ozs7OztBQUUzQyxNQUFNLG1CQUE0QyxRQVNqRDtJQUNTLElBQUEsa0JBQUcsRUFBRSw4QkFBUyxDQUFjO0lBQ3BDLHFCQUFNLFlBQVksR0FBVSxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs7Ozs7SUFNNUUscUJBQU0sVUFBVSxHQUFHLFVBQUMsRUFBVTtRQUM1QixNQUFNLENBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1YsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsS0FBSyxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQyxTQUFTLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEM7S0FDRixDQUFBO0lBRUQsTUFBTSxDQUFDLFVBQVMsSUFBSTs7WUFFYyw2Q0FBZ0I7WUFDOUMsMkJBQ1ksT0FBbUIsRUFDbkIsT0FBbUIsRUFDbkIsUUFBMEI7Z0JBSHRDLFlBS0Usa0JBQU0sT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsU0FDekU7Z0JBTFcsYUFBTyxHQUFQLE9BQU8sQ0FBWTtnQkFDbkIsYUFBTyxHQUFQLE9BQU8sQ0FBWTtnQkFDbkIsY0FBUSxHQUFSLFFBQVEsQ0FBa0I7O2FBR3JDOzt3QkFSRixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFOzs7O3dCQWhDckMsVUFBVTt3QkFBRSxVQUFVO3dCQUR0QixnQkFBZ0I7O29DQUZ6QjtVQW9Db0MsYUFBYTs7Ozs7Ozs7Ozs7Ozs7OztRQVM3QyxNQUFNLG1CQUFDLGlCQUF3QixFQUFDO0tBQ2pDLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRyYWN0TW9kZWwgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyYWN0UHJvdmlkZXIgfSBmcm9tICdAbmdldGgvcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBBQklFbmNvZGVyLCBBQklEZWNvZGVyIH0gZnJvbSAnLi9hYmknO1xyXG5pbXBvcnQgeyBDb250cmFjdE1vZHVsZSB9IGZyb20gJy4vY29udHJhY3QubW9kdWxlJztcclxuaW1wb3J0IHsgQ29udHJhY3RDbGFzcyB9IGZyb20gJy4vY29udHJhY3QnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENvbnRyYWN0PFQgZXh0ZW5kcyBDb250cmFjdE1vZGVsPihtZXRhZGF0YToge1xyXG4gIHByb3ZpZGVyPzogVHlwZTxDb250cmFjdFByb3ZpZGVyPjsgIC8vIFRPRE8gOiBVc2UgZm9yIGN1c3RvbSBwcm92aWRlciAod2l0aCBBdXRoKVxyXG4gIGFiaTogYW55W10gfCBzdHJpbmc7XHJcbiAgYWRkcmVzc2VzPzoge1xyXG4gICAgbWFpbm5ldD86IHN0cmluZztcclxuICAgIHJvcHN0ZW4/OiBzdHJpbmc7XHJcbiAgICByaW5rZWJ5Pzogc3RyaW5nO1xyXG4gICAga292YW4/OiBzdHJpbmc7XHJcbiAgfTtcclxufSkge1xyXG4gIGNvbnN0IHsgYWJpLCBhZGRyZXNzZXMgfSA9IG1ldGFkYXRhO1xyXG4gIGNvbnN0IGpzb25JbnRlcmFjZTogYW55W10gPSB0eXBlb2YgYWJpID09PSAnc3RyaW5nJyA/IEpTT04ucGFyc2UoYWJpKSA6IGFiaTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBhZGRyZXNzIG9mIHRoZSBjb250cmFjdCBkZXBlbmRpbmcgb24gdGhlIGlkIG9mIHRoZSBuZXR3b3JrXHJcbiAgICogQHBhcmFtIGlkIFRoZSBpZCBvZiB0aGUgbmV0d29ya1xyXG4gICAqL1xyXG4gIGNvbnN0IGdldEFkZHJlc3MgPSAoaWQ6IG51bWJlcik6IHN0cmluZyA9PiB7XHJcbiAgICBzd2l0Y2goaWQpIHtcclxuICAgICAgY2FzZSAxOiByZXR1cm4gYWRkcmVzc2VzWydtYWlubmV0J107XHJcbiAgICAgIGNhc2UgMzogcmV0dXJuIGFkZHJlc3Nlc1sncm9wc3RlbiddO1xyXG4gICAgICBjYXNlIDQ6IHJldHVybiBhZGRyZXNzZXNbJ3JpbmtlYnknXTtcclxuICAgICAgY2FzZSA0MjogcmV0dXJuIGFkZHJlc3Nlc1sna292YW4nXTtcclxuICAgICAgZGVmYXVsdDogcmV0dXJuIGFkZHJlc3Nlc1snbWFpbm5ldCddO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKEJhc2UpIHtcclxuICAgIEBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogQ29udHJhY3RNb2R1bGUgfSlcclxuICAgIGNsYXNzIENvbnRyYWN0RGVjb3JhdGVkIGV4dGVuZHMgQ29udHJhY3RDbGFzczxUPiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByb3RlY3RlZCBlbmNvZGVyOiBBQklFbmNvZGVyLFxyXG4gICAgICAgIHByb3RlY3RlZCBkZWNvZGVyOiBBQklEZWNvZGVyLFxyXG4gICAgICAgIHByb3RlY3RlZCBwcm92aWRlcjogQ29udHJhY3RQcm92aWRlclxyXG4gICAgICApIHtcclxuICAgICAgICBzdXBlcihlbmNvZGVyLCBkZWNvZGVyLCBwcm92aWRlciwganNvbkludGVyYWNlLCBnZXRBZGRyZXNzKHByb3ZpZGVyLmlkKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBDb250cmFjdERlY29yYXRlZCBhcyBhbnk7XHJcbiAgfTtcclxufVxyXG4iXX0=