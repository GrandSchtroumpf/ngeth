import { Inject } from '@angular/core';
/**
 * Put the parent class's params into the child class's constructor
 * @param paramTypes types of the decorator
 */
export function MixinInjectable(...paramTypes: any[]) {
  return function(contractTarget: Function) {
    if (paramTypes) {
      paramTypes.forEach((param, index) => {
        // this code is needed to make @Inject work
        if (param && param.annotation && param.annotation instanceof Inject) {
          param(contractTarget, void 0, index);
        }
      });
    }
    (<any>Reflect).defineMetadata(
      'design:paramtypes',
      paramTypes,
      contractTarget
    );
    (<any>Reflect).defineMetadata('parameters', paramTypes, contractTarget);
  };
}
