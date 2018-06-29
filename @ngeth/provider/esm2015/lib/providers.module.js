/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule, InjectionToken, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MainProvider } from './provider';
export const /** @type {?} */ AUTH = new InjectionToken('auth');
export class ProvidersModule {
    /**
     * @param {?} Provider
     * @return {?}
     */
    static forRoot(Provider) {
        return {
            ngModule: ProvidersModule,
            providers: [
                { provide: MainProvider, useExisting: Provider },
                {
                    provide: APP_INITIALIZER,
                    useFactory: (provider) => {
                        return () => provider.fetchId().then(id => provider.id = id);
                    },
                    multi: true,
                    deps: [MainProvider]
                },
                { provide: AUTH, useClass: Provider.Auth },
            ]
        };
    }
}
ProvidersModule.decorators = [
    { type: NgModule, args: [{
                imports: [HttpClientModule]
            },] },
];
function ProvidersModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ProvidersModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ProvidersModule.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ2V0aC9wcm92aWRlci8iLCJzb3VyY2VzIjpbImxpYi9wcm92aWRlcnMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsUUFBUSxFQUVSLGNBQWMsRUFDZCxlQUFlLEVBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXhELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFMUMsTUFBTSxDQUFDLHVCQUFNLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBTSxNQUFNLENBQUMsQ0FBQztBQU1wRCxNQUFNOzs7OztJQUNKLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBNkI7UUFDMUMsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLGVBQWU7WUFDekIsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFO2dCQUNoRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsVUFBVSxFQUFFLENBQUMsUUFBc0IsRUFBRSxFQUFFO3dCQUNyQyxNQUFNLENBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7cUJBQy9EO29CQUNELEtBQUssRUFBRSxJQUFJO29CQUNYLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDckI7Z0JBQ0QsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFO2FBQzNDO1NBQ0YsQ0FBQztLQUNIOzs7WUFwQkYsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO2FBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBOZ01vZHVsZSxcclxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxyXG4gIEluamVjdGlvblRva2VuLFxyXG4gIEFQUF9JTklUSUFMSVpFUlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuaW1wb3J0IHsgTWFpblByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcic7XHJcblxyXG5leHBvcnQgY29uc3QgQVVUSCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdhdXRoJyk7XHJcblxyXG4vLyBAZHluYW1pY1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUHJvdmlkZXJzTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdChQcm92aWRlcjogdHlwZW9mIE1haW5Qcm92aWRlcik6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IFByb3ZpZGVyc01vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgeyBwcm92aWRlOiBNYWluUHJvdmlkZXIsIHVzZUV4aXN0aW5nOiBQcm92aWRlciB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcclxuICAgICAgICAgIHVzZUZhY3Rvcnk6IChwcm92aWRlcjogTWFpblByb3ZpZGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAgKCkgPT4gcHJvdmlkZXIuZmV0Y2hJZCgpLnRoZW4oaWQgPT4gcHJvdmlkZXIuaWQgPSBpZCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICAgICAgICBkZXBzOiBbTWFpblByb3ZpZGVyXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyBwcm92aWRlOiBBVVRILCB1c2VDbGFzczogUHJvdmlkZXIuQXV0aCB9LFxyXG4gICAgICBdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=