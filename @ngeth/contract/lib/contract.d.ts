import { ABIDefinition, ContractModel } from '@ngeth/utils';
import { ContractProvider } from '@ngeth/provider';
import { ABIEncoder, ABIDecoder } from './abi';
import { Observable } from 'rxjs';
export declare class ContractClass<T extends ContractModel> {
    protected encoder: ABIEncoder;
    protected decoder: ABIDecoder;
    protected provider: ContractProvider;
    private abi;
    address: string;
    calls: {
        [P in keyof T['calls']]: T['calls'][P];
    };
    sends: {
        [P in keyof T['sends']]: T['sends'][P];
    };
    events: {
        [P in keyof T['events']]: T['events'][P];
    };
    constructor(encoder: ABIEncoder, decoder: ABIDecoder, provider: ContractProvider, abi: ABIDefinition[], address?: string);
    /**
     * Deploy the contract on the blockchain
     * @param bytes The bytes of the contract
     * @param params Params to pass into the constructor
     */
    deploy(bytes: string, ...params: any[]): Observable<never>;
    /**
     * Used for 'call' methods
     * @param method The method to call
     * @param params The params given by the user
     */
    private callMethod(method, ...params);
    /**
     * Used for 'send' methods
     * @param method The method to send
     * @param params The params given by the user
     */
    private sendMethod(method, ...params);
    /**
     * Used for 'event' definition
     * @param event The event definition in the ABI
     */
    private eventMethod(event);
    /**
     * Fill the estimated amount of gas and gasPrice to use for a transaction
     * @param tx The raw transaction to estimate the gas from
     */
    private fillGas(tx);
}
