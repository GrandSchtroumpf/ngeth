import { Injectable, Inject } from '@angular/core';
import { MixinInjectable } from './decorator-factory';
import { NgContract, INgContract } from './models';
import { decodeOutPutStruct } from './utils/struct-decoder';
import { ABIDefinition, Tx, PromiEvent, Contract, Eth } from 'web3/types';
import { ETH } from '../token';

import { from, bindNodeCallback, Observable } from 'rxjs';


export interface ContractMetadata {
    abi: ABIDefinition[];    
    addresses?: {
        main?: string;
        ropsten?: string;
        koven?: string;
        rinkeby?: string;
        custom?: string;
    },
    options?: {
        from?: string;
        gasPrice?: any;
        gas?: number;
        data?: string;
    }
}

export interface Constructor<T = {}> {
    new(...args:any[]): T;
}


/**
 * Contract Decorator
 * @param options 
 */
export function Contract<T extends INgContract>(options?: ContractMetadata) {

    let contract: Contract = {} as Contract;
    let eth: Eth;

    /** Check if function returns a Struct */
    const hasTuple = (def: ABIDefinition): boolean => {
        const outputTypes = def.outputs.map((output) => output.type);
        return outputTypes.indexOf('tuple') !== -1 || outputTypes.indexOf('tuple[]') !== -1;
    }

    /** Set the call function for struct or array of struct Output */
    const setCallStruct = (name: string) => {
        return (args: any[] | any, tx?: Tx) => {
            const method = eth.call({
                to: contract.options.address,
                data: contract.methods[name](...args).encodeABI()
            }).then((hex: string) => decodeOutPutStruct(hex, options.abi, name));
            return from<any>(method);
        };
    }

    /** Set the call function for non struct output */
    const setCall = (name: string) => {
        return (args: any[] | any, tx?: Tx) => {
            const method = contract.methods[name];
            const call = method(...args)['call'];
            return bindNodeCallback<any>(call)();
        }
    }

    /** Set the call function for non struct output */
    const setSend = (name: string) => {
        return (args: any[] | any, tx?: Tx) => {
            const method = contract.methods[name];
            const send = method(...args)['send'](tx)
            return from<PromiEvent<any>>(send);
        }
    }

    /** Loop over the abi to create the contract's methods */
    const setMethods = () => {
        let methods = {};
        options.abi.forEach((def: ABIDefinition) => {
            // Call Functions
            if (def.type === 'function' && def.constant === true) {
                methods[def.name] = hasTuple(def) ? setCallStruct(def.name) : setCall(def.name);
            }
            // Send Functions 
            else if (def.type === 'function' && def.constant === false) {
                methods[def.name] = setSend(def.name);
            }
        });
        return methods;
    }

    /**
     * FACTORY
     */
    return function<TBase extends Constructor<NgContract<T>>>(Base: TBase): Constructor<NgContract<T>> {

        // The instance of the class
        @MixinInjectable(Inject(ETH))
        class ContractClass extends Base implements NgContract<T> {
            public options = contract.options;
            public deploy = contract.deploy as any; // TODO: Overwrite deploy to fit the definition
            public getPastEvents = contract.getPastEvents;
            public setProvider = contract.setProvider;

            public methods;
            public events;

            constructor(...args: any[]) {
                super();
                eth = args[0];
                contract = new eth.Contract(
                    options.abi,
                    this.getAddress((<any>eth.net).id),
                    options.options
                );
                this.methods = setMethods();
            }

            public getAddress(id: number): string {
                switch(id) {
                    case 1: return options.addresses.main;
                    case 3: return options.addresses.ropsten;
                    case 4: return options.addresses.rinkeby;
                    case 42: return options.addresses.main;
                    default: return options.addresses.custom;
                }
            }
        }
        return ContractClass;
    };
}
