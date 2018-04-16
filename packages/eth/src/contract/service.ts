import { Injectable, Inject } from '@angular/core';
import { ETH } from '../token';
// import { Eth } from 'web3/types';
import { decodeOutPutStruct } from './utils/struct-decoder';

// Models
import { NgContract, INgContract, ContractOptions, NgMethod } from './models';
import { Contract, TransactionObject, ABIDefinition, PromiEvent, Tx } from '../types';

// ACTIONS
import { CallMethod, CallMethodSuccess, SendMethodSuccess, ContractError } from './actions';

// RXJS
import { Observable, of, from, bindNodeCallback } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable()
export class EthContract {

    /** Contracts stored Contract Service */
    public contracts: {
        [name: string]: NgContract<any>
    } = {};
    /** The types of all actions of all contacts link to a method */
    public actionTypes: {
        call: string[];
        send: string[];
        event: string[];
    } = { call: [], send: [], event: [] };
    
    constructor(@Inject(ETH) private eth) {}

    /**
     * Creates a new contract instance with all its methods and events defined in its json interface object.
     * @param name The name of the contract used to store in the service
     * @param abi The json interface for the contract to instantiate
     * @param address The address of the smart contract to call, can be added later using 
     * @param options The options of the contract. Some are used as fallbacks for calls and transactions:
     */
    public create<T extends INgContract>(name: string, abi: ABIDefinition[], address: string, options?: ContractOptions): NgContract<T> {
        const ngContract = this.createEmpty(abi, options);
        ngContract.options.address = address;
        this.contracts[name] = ngContract;
        return ngContract;
    }

    /**
     * Create a contract without setting the address, it is not stored
     * @param abi The json interface for the contract to instantiate
     * @param options The options of the contract. Some are used as fallbacks for calls and transactions:
     */
    public createEmpty<T extends INgContract>(abi: ABIDefinition[], options?: ContractOptions): NgContract<T> {
        const contract = new this.eth.Contract(abi, undefined, options);
        const ngContract: NgContract<T> = {
            ...contract,
            name: name,
            methods: {}
        } as any;
        
        /** Check if function returns a Struct */
        const hasTuple = (def: ABIDefinition): boolean => {
            const outputTypes = def.outputs.map((output) => output.type);
            return outputTypes.indexOf('tuple') !== -1 || outputTypes.indexOf('tuple[]') !== -1;
        }
        
        abi.forEach((def: ABIDefinition) => {
            if (def.type === 'function' && def.constant === true) {
                this.createActionType(name, def.name, 'call');
                // Call function
                if (hasTuple(def)) {
                    // Call Function returns a Struct or Array of Struct
                    const ngMethod = (args: any[] | any, tx?: Tx) => {
                        const method = this.eth.call({
                            to: ngContract.options.address, // WARNING: What happen if address is set later ?
                            data: contract.methods[def.name](...args).encodeABI()
                        }).then((hex: string) => decodeOutPutStruct(hex, abi, def.name));
                        return from<any>(method);
                    }
                    ngContract.methods[def.name] = ngMethod;
                } else {
                    // Call Function without Structs
                    const ngMethod = (args: any[] | any, tx?: Tx) => {
                        const method = contract.methods[def.name];
                        const call = method(...args)['call'];
                        return bindNodeCallback<any>(call)();
                    }
                    ngContract.methods[def.name] = ngMethod;
                }

            } else if (def.type === 'function' && def.constant === false) {
                this.createActionType(name, def.name, 'send');
                // Send function
                const ngMethod = (args: any[] | any, tx?: Tx) => {
                    const method = contract.methods[def.name];
                    const send = method(...args)['send'](tx)
                    return from<PromiEvent<any>>(send);
                }
                ngContract.methods[def.name] = ngMethod;
            }
        });
        return ngContract;
    }

    /**
     * Remove the contract from the service
     * @param contract The name of the contract
     */
    public remove(contract: string) {
        this.contracts[contract] = undefined;
    }

    /**
     * Register a new action for a method / event of a contract
     * @param contractName The name of the contract
     * @param method The name of the method
     * @param methodType call, send of event
     */
    private createActionType(contractName: string, methodName: string, methodType: 'call' | 'send' | 'event') {
        const type = `[Contract ${contractName}] ${methodType} ${methodName}`;
        this.actionTypes[methodType].push(type);
    }

    /**
     * Make a request on a method of a contract
     * @param contract The name of the contract
     * @param method The name of the method to call
     * @param args The arguments to use for this method
     */
    public method<T>(contract: string, method: string, args: any[] | any, tx?: Tx): Observable<T> {
        return this.contracts[contract].methods[method](args, tx);
    }

    /**
     * Create an action object based on arguments
     * @param contract The name of the contract
     * @param method The name of the method
     * @param args The arguments to use for this action
     */
    public action(contract: string, method: string, ...args: any[]) {
        return {
            type : `[Contract ${contract}] call ${method}`,
            payload: { contract, method, args }
        };
    }

    /**
     * Call a method and return an action (for @ngrx/effects implementations)
     * @param contract The name of the contract
     * @param type Is it a call or send method
     * @param method The name of the method
     * @param args The arguments to use for this action
     */
    public effect(contract: string, type: 'call' | 'send', method: string, ...args: any[]) {
        return this.method(contract, method, args).pipe(
            map((result: any) => {
                if (type === 'call') {
                    return new CallMethodSuccess({contract, method, result, args});
                } else if (type === 'send') {
                    console.log(result);
                    return new SendMethodSuccess('');
                }
            }),
            catchError((err: any) => of(new ContractError(err)))
        );
    }



}