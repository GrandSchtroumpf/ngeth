import { Inject } from '@angular/core';
// Code from Artsiom Kuts https://medium.com/@artsiomkuts/typescript-mixins-with-angular2-di-671a9b159d47 

/**
 * Get the parameters out of the params types et raw parameters
 * @param target the class we are targeting
 * @param paramTypes types of the parameters in the constructor of the target
 * @param rawParameters Metadata set by decorators in the parameters in the constructor
 * @example constructor(private test: Test, @Inject(TOKEN) token: string)
 * // paramType: [Test(), String()]
 * // rawParameters: Array[1] -> rawParameters[0]: InjectMetadata

const getParamTypesAndParameters = function(target: Function, paramTypes: Function[], rawParameters: any[]) {
    var parameters = Array(paramTypes.length).fill(null);
    if(rawParameters) {
        rawParameters.slice(0, paramTypes.length).forEach((el, i) => {
            parameters[i] = el;
        });
    }
    return [paramTypes, parameters];
};
 */

/**
 * Put the parent class's params into the child class's constructor
 * @param paramTypes types of the decorator
 */
export function MixinInjectable(...paramTypes: any[]) {

    return function (contractTarget: Function) {
        if(paramTypes) {
            paramTypes.forEach((param, index) => {
                // this code is needed to make @Inject work
                if (param && param.annotation && param.annotation instanceof Inject) {
                    param(contractTarget, void 0, index);
                }
            });
        }
        // resolveParameters(contractTarget, paramTypes);
        (<any>Reflect).defineMetadata('design:paramtypes', paramTypes, contractTarget);
        (<any>Reflect).defineMetadata('parameters', paramTypes, contractTarget);

    }
}