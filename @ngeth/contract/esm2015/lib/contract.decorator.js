/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
    const { abi, addresses } = metadata;
    const /** @type {?} */ jsonInterace = typeof abi === 'string' ? JSON.parse(abi) : abi;
    /**
     * Get the address of the contract depending on the id of the network
     * @param id The id of the network
     */
    const /** @type {?} */ getAddress = (id) => {
        switch (id) {
            case 1: return addresses['mainnet'];
            case 3: return addresses['ropsten'];
            case 4: return addresses['rinkeby'];
            case 42: return addresses['kovan'];
            default: return addresses['mainnet'];
        }
    };
    return function (Base) {
        class ContractDecorated extends ContractClass {
            /**
             * @param {?} encoder
             * @param {?} decoder
             * @param {?} provider
             */
            constructor(encoder, decoder, provider) {
                super(encoder, decoder, provider, jsonInterace, getAddress(provider.id));
                this.encoder = encoder;
                this.decoder = decoder;
                this.provider = provider;
            }
        }
        ContractDecorated.decorators = [
            { type: Injectable, args: [{ providedIn: ContractModule },] },
        ];
        /** @nocollapse */
        ContractDecorated.ctorParameters = () => [
            { type: ABIEncoder, },
            { type: ABIDecoder, },
            { type: ContractProvider, },
        ];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3QuZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nZXRoL2NvbnRyYWN0LyIsInNvdXJjZXMiOlsibGliL2NvbnRyYWN0LmRlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUMvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQzs7Ozs7O0FBRTNDLE1BQU0sbUJBQTRDLFFBU2pEO0lBQ0MsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFDcEMsdUJBQU0sWUFBWSxHQUFVLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOzs7OztJQU01RSx1QkFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFVLEVBQVUsRUFBRTtRQUN4QyxNQUFNLENBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1YsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsS0FBSyxFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQyxTQUFTLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdEM7S0FDRixDQUFBO0lBRUQsTUFBTSxDQUFDLFVBQVMsSUFBSTtRQUNsQix1QkFDd0IsU0FBUSxhQUFnQjs7Ozs7O1lBQzlDLFlBQ1ksT0FBbUIsRUFDbkIsT0FBbUIsRUFDbkIsUUFBMEI7Z0JBRXBDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUovRCxZQUFPLEdBQVAsT0FBTyxDQUFZO2dCQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFZO2dCQUNuQixhQUFRLEdBQVIsUUFBUSxDQUFrQjthQUdyQzs7O29CQVJGLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUU7Ozs7b0JBaENyQyxVQUFVO29CQUFFLFVBQVU7b0JBRHRCLGdCQUFnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7UUEyQ3JCLE1BQU0sbUJBQUMsaUJBQXdCLEVBQUM7S0FDakMsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udHJhY3RNb2RlbCB9IGZyb20gJ0BuZ2V0aC91dGlscyc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29udHJhY3RQcm92aWRlciB9IGZyb20gJ0BuZ2V0aC9wcm92aWRlcic7XHJcbmltcG9ydCB7IEFCSUVuY29kZXIsIEFCSURlY29kZXIgfSBmcm9tICcuL2FiaSc7XHJcbmltcG9ydCB7IENvbnRyYWN0TW9kdWxlIH0gZnJvbSAnLi9jb250cmFjdC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBDb250cmFjdENsYXNzIH0gZnJvbSAnLi9jb250cmFjdCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ29udHJhY3Q8VCBleHRlbmRzIENvbnRyYWN0TW9kZWw+KG1ldGFkYXRhOiB7XHJcbiAgcHJvdmlkZXI/OiBUeXBlPENvbnRyYWN0UHJvdmlkZXI+OyAgLy8gVE9ETyA6IFVzZSBmb3IgY3VzdG9tIHByb3ZpZGVyICh3aXRoIEF1dGgpXHJcbiAgYWJpOiBhbnlbXSB8IHN0cmluZztcclxuICBhZGRyZXNzZXM/OiB7XHJcbiAgICBtYWlubmV0Pzogc3RyaW5nO1xyXG4gICAgcm9wc3Rlbj86IHN0cmluZztcclxuICAgIHJpbmtlYnk/OiBzdHJpbmc7XHJcbiAgICBrb3Zhbj86IHN0cmluZztcclxuICB9O1xyXG59KSB7XHJcbiAgY29uc3QgeyBhYmksIGFkZHJlc3NlcyB9ID0gbWV0YWRhdGE7XHJcbiAgY29uc3QganNvbkludGVyYWNlOiBhbnlbXSA9IHR5cGVvZiBhYmkgPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShhYmkpIDogYWJpO1xyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGFkZHJlc3Mgb2YgdGhlIGNvbnRyYWN0IGRlcGVuZGluZyBvbiB0aGUgaWQgb2YgdGhlIG5ldHdvcmtcclxuICAgKiBAcGFyYW0gaWQgVGhlIGlkIG9mIHRoZSBuZXR3b3JrXHJcbiAgICovXHJcbiAgY29uc3QgZ2V0QWRkcmVzcyA9IChpZDogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuICAgIHN3aXRjaChpZCkge1xyXG4gICAgICBjYXNlIDE6IHJldHVybiBhZGRyZXNzZXNbJ21haW5uZXQnXTtcclxuICAgICAgY2FzZSAzOiByZXR1cm4gYWRkcmVzc2VzWydyb3BzdGVuJ107XHJcbiAgICAgIGNhc2UgNDogcmV0dXJuIGFkZHJlc3Nlc1sncmlua2VieSddO1xyXG4gICAgICBjYXNlIDQyOiByZXR1cm4gYWRkcmVzc2VzWydrb3ZhbiddO1xyXG4gICAgICBkZWZhdWx0OiByZXR1cm4gYWRkcmVzc2VzWydtYWlubmV0J107XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oQmFzZSkge1xyXG4gICAgQEluamVjdGFibGUoeyBwcm92aWRlZEluOiBDb250cmFjdE1vZHVsZSB9KVxyXG4gICAgY2xhc3MgQ29udHJhY3REZWNvcmF0ZWQgZXh0ZW5kcyBDb250cmFjdENsYXNzPFQ+IHtcclxuICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJvdGVjdGVkIGVuY29kZXI6IEFCSUVuY29kZXIsXHJcbiAgICAgICAgcHJvdGVjdGVkIGRlY29kZXI6IEFCSURlY29kZXIsXHJcbiAgICAgICAgcHJvdGVjdGVkIHByb3ZpZGVyOiBDb250cmFjdFByb3ZpZGVyXHJcbiAgICAgICkge1xyXG4gICAgICAgIHN1cGVyKGVuY29kZXIsIGRlY29kZXIsIHByb3ZpZGVyLCBqc29uSW50ZXJhY2UsIGdldEFkZHJlc3MocHJvdmlkZXIuaWQpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIENvbnRyYWN0RGVjb3JhdGVkIGFzIGFueTtcclxuICB9O1xyXG59XHJcbiJdfQ==