import { ContractModel } from '@ngeth/utils';
import { Observable } from 'rxjs';

export interface IEncoderTestContract extends ContractModel {
  name: 'EncoderTest';
  calls: {
    getFixedStringArray: (arr: string[]) => Observable<string[]>;
    getStaticBytes: (staticBytes: string) => Observable<string>;
    getStaticTupleArrayInsideTupleArray: (staticTuple: StaticTuple[]) => Observable<StaticTuple[]>;
    getDynamicTupleArrayInsideTupleArray: (dynamicTuple: DynamicTuple[]) => Observable<DynamicTuple[]>;
    getFixedStaticTupleArray: (arr: Static[]) => Observable<Static[]>;
    getUnfixedStaticTupleArray: (arr: Static[]) => Observable<Static[]>;
    getBool: (isTrue: boolean) => Observable<boolean>;
    getDynamicBytes: (dynamicBytes: string) => Observable<string>;
    getStaticTupleArrayInsideTuple: (staticTuple: StaticTuple) => Observable<StaticTuple>;
    getDynamicTupleArrayInsideTuple: (dynamicTuple: DynamicTuple) => Observable<DynamicTuple>;
    getString: (str: string) => Observable<string>;
    getFixedDynamicTupleArray: (arr: Dynamic[]) => Observable<Dynamic[]>;
    getUnfixedUintArray: (arr: number[]) => Observable<number[]>;
    getUint: (num: number) => Observable<number>;
    getAddress: (to: string) => Observable<string>;
    getDynamicTuple: (dynamicTuple: Dynamic) => Observable<Dynamic>;
    getInt: (num: number) => Observable<number>;
    getUnfixedDynamicTupleArray: (arr: Dynamic[]) => Observable<Dynamic[]>;
    getUnfixedStringArray: (arr: string[]) => Observable<string[]>;
    getFixedUintArray: (arr: number[]) => Observable<number[]>;
    getStaticTuple: (staticTuple: Static) => Observable<Static>;
  }

}

export interface StaticTuple {
  isTrue: boolean;
  staticTuple: Static[];
}

export interface DynamicTuple {
  isTrue: boolean;
  dynamicTuple: Dynamic[];
}

export interface Static {
  num: number;
  isTrue: boolean;
  to: string;
}

export interface Dynamic {
  num: number;
  str: string;
  dynamicBytes: string;
}
