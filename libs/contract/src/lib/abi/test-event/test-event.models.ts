import { ContractModel } from '@ngeth/utils';
import { Observable } from 'rxjs';

export interface ITestEventContract extends ContractModel {
  name: 'TestEvent';
  // Sends methods
  sends: {
    triggerIndexedEventString: () => Observable<any>;
    triggerIndexedEventUintString: () => Observable<any>;
    triggerOnlyStaticStructEvent: () => Observable<any>;
    triggerNormalStructEvent: () => Observable<any>;
    triggerIndexedEventUint: () => Observable<any>;
    triggerSeveralEvent: () => Observable<any>;
    triggerNormalAndOnlyStatictStructEvent: () => Observable<any>;
    triggerNonIndexedEvent: () => Observable<any>;
    triggerMaxLimitIndexedEvent: () => Observable<any>;
  }

  // Events
  events: {
    NonIndexedEvent: () => Observable<void>
    IndexedEventUint: () => Observable<void>
    IndexedEventString: () => Observable<void>
    IndexedEventUintString: () => Observable<void>
    MaxLimitIndexedEvent: () => Observable<void>
    NormalStructEvent: () => Observable<void>
    OnlyStaticStructEvent: () => Observable<void>
    NormalAndOnlyStatictStructEvent: () => Observable<void>
  }
}

export interface NormalStruct {
  nom: string;
  contractAddress: string;
  num: number;
}

export interface OnlyStaticStruct {
  contractAddress: string;
  num: number;
}

