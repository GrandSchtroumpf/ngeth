/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule, InjectionToken, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MainProvider } from './provider';
export var /** @type {?} */ AUTH = new InjectionToken('auth');
var ProvidersModule = /** @class */ (function () {
    function ProvidersModule() {
    }
    /**
     * @param {?} Provider
     * @return {?}
     */
    ProvidersModule.forRoot = /**
     * @param {?} Provider
     * @return {?}
     */
    function (Provider) {
        return {
            ngModule: ProvidersModule,
            providers: [
                { provide: MainProvider, useExisting: Provider },
                {
                    provide: APP_INITIALIZER,
                    useFactory: function (provider) {
                        return function () { return provider.fetchId().then(function (id) { return provider.id = id; }); };
                    },
                    multi: true,
                    deps: [MainProvider]
                },
                { provide: AUTH, useClass: Provider.Auth },
            ]
        };
    };
    ProvidersModule.decorators = [
        { type: NgModule, args: [{
                    imports: [HttpClientModule]
                },] },
    ];
    return ProvidersModule;
}());
export { ProvidersModule };
function ProvidersModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ProvidersModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ProvidersModule.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC9wcm92aWRlci8iLCJzb3VyY2VzIjpbImxpYi9wcm92aWRlcnMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsUUFBUSxFQUVSLGNBQWMsRUFDZCxlQUFlLEVBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXhELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFMUMsTUFBTSxDQUFDLHFCQUFNLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBTSxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7SUFPM0MsdUJBQU87Ozs7SUFBZCxVQUFlLFFBQTZCO1FBQzFDLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRTtnQkFDaEQ7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxVQUFDLFFBQXNCO3dCQUNqQyxNQUFNLENBQUUsY0FBTSxPQUFBLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBaEIsQ0FBZ0IsQ0FBQyxFQUEvQyxDQUErQyxDQUFDO3FCQUMvRDtvQkFDRCxLQUFLLEVBQUUsSUFBSTtvQkFDWCxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQ3JCO2dCQUNELEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRTthQUMzQztTQUNGLENBQUM7S0FDSDs7Z0JBcEJGLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDNUI7OzBCQWZEOztTQWdCYSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBOZ01vZHVsZSxcclxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxyXG4gIEluamVjdGlvblRva2VuLFxyXG4gIEFQUF9JTklUSUFMSVpFUlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcic7XHJcblxyXG5leHBvcnQgY29uc3QgQVVUSCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdhdXRoJyk7XHJcblxyXG4vLyBAZHluYW1pY1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUHJvdmlkZXJzTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdChQcm92aWRlcjogdHlwZW9mIE1haW5Qcm92aWRlcik6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IFByb3ZpZGVyc01vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgeyBwcm92aWRlOiBNYWluUHJvdmlkZXIsIHVzZUV4aXN0aW5nOiBQcm92aWRlciB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcclxuICAgICAgICAgIHVzZUZhY3Rvcnk6IChwcm92aWRlcjogTWFpblByb3ZpZGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAgKCkgPT4gcHJvdmlkZXIuZmV0Y2hJZCgpLnRoZW4oaWQgPT4gcHJvdmlkZXIuaWQgPSBpZCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICAgICAgICBkZXBzOiBbTWFpblByb3ZpZGVyXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyBwcm92aWRlOiBBVVRILCB1c2VDbGFzczogUHJvdmlkZXIuQXV0aCB9LFxyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=