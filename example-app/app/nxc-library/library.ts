import { INgContract, NgMethod } from '../../../packages/eth/src/contract/models';

export interface LibraryContract extends INgContract {
    methods: {
        getAllAssets: NgMethod<null, Asset>;
    };
}

export interface Asset {
    name: string;
    assetAddress: string;
    code: number;
    symbol: string;
    decimals: number;
    createdSupply: number;
    totalSupply: number,
    burnAddress: string;
    isLocked: boolean;
    identifier: string;
    assetType: string;
    version: string;
    origin: string;
    registerDate: number;
}