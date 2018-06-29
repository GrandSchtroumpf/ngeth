import { Type } from '@angular/core';
import { MainProvider } from './provider';
export declare function Provider(options: {
    url: string;
    auth?: any;
}): (Base: Type<MainProvider>) => any;
