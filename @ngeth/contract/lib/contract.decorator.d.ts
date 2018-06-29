import { ContractModel } from '@ngeth/utils';
import { Type } from '@angular/core';
import { ContractProvider } from '@ngeth/provider';
export declare function Contract<T extends ContractModel>(metadata: {
    provider?: Type<ContractProvider>;
    abi: any[] | string;
    addresses?: {
        mainnet?: string;
        ropsten?: string;
        rinkeby?: string;
        kovan?: string;
    };
}): (Base: any) => any;
