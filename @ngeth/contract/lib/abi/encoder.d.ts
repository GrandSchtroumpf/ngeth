import { ABIInput, ABIDefinition } from '@ngeth/utils';
export declare class EncodedParam {
    head: string;
    tail: string;
    constructor(head?: string, tail?: string);
}
export declare class ABIEncoder {
    constructor();
    /**
     * Encode the constructor method for deploying
     * @param constructor The constructor param defined in the ABI
     * @param bytes The content of the contract
     * @param args The arguments to pass into the constructor if any
     */
    encodeConstructor(constructor: ABIDefinition, bytes: string, args?: any[]): string;
    /**
     * Encode the whole method
     * @param mehtod The method the encode has defined in the ABI
     * @param args The list of arguments given by the user
     */
    encodeMethod(method: ABIDefinition, args: any[]): string;
    /**
     * Encode an event
     * @param event The event to encode
     */
    encodeEvent(event: ABIDefinition): string;
    /*******************************************
     *************** SIGNATURE *****************
     *******************************************/
    /**
     * Create a string for the signature based on the params in the ABI
     * @param params The params given by the ABI.
     */
    private signInputs(inputs);
    /** Return the type of a tuple needed for the signature */
    private tupleType(tuple);
    /**
     * Sign a specific method based on the ABI
     * @param mehtod The method the encode has defined in the ABI
     */
    private signMethod(method);
    /*******************************************
     **************** ENCODE *******************
     *******************************************/
    /**
     * Map to the right encoder depending on the type
     * @param arg the arg of the input
     * @param input the input defined in the ABI
     */
    encode(arg: any, input: ABIInput): string;
    /*******************
     * STATIC OR DYNAMIC
     *******************/
    /**
     * Encode a list of inputs
     * @param args The arguments given by the users
     * @param inputs The inputs defined in the ABI
     */
    encodeInputs(args: any[], inputs: ABIInput[]): EncodedParam;
    /**
     * Encode an array
     * @param args The argument given by the user for this array
     * @param input The input defined in the ABI
     */
    private encodeArray(args, input);
    /**
     * Encode the tuple
     * @param args Arguments of this tuple
     * @param inputs Inputs defined in the ABI
     */
    private encodeTuple(args, inputs);
    /*********
     * DYNAMIC
     *********/
    /** Encode a string */
    private encodeString(arg);
    /**
     * Encode a dynamic bytes
     * @example bytes
     */
    private encodeDynamicBytes(arg);
    /********
     * STATIC
     ********/
    /**
     * Encode a static bytes
     * @example bytes3, bytes32
     */
    private encodeStaticBytes(arg);
    /**
     * Encode int or uint
     * @example int, int32, uint256
     */
    private encodeInt(arg, input);
    /** Encode an address */
    private encodeAddress(arg);
    /** Encode a boolean */
    private encodeBool(arg);
    /***
     * PadStart / PadEnd
     */
    private padStart(target, targetLength, padString);
    private padEnd(target, targetLength, padString);
}
