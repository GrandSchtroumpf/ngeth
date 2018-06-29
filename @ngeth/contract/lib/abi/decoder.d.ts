import { ABIOutput, ABIInput } from '@ngeth/utils';
export declare class DecodedParam {
    result: DecodedParam;
    offset: number;
    constructor(result: DecodedParam, offset: number);
}
export declare class ABIDecoder {
    /**
     * Decode an event output
     * @param topics The topics of the logs (indexed values)
     * @param data The data of the logs (bytes)
     * @param inputs The inputs givent by the ABI
     */
    decodeEvent(topics: string[], data: string, inputs: ABIInput[]): any;
    /**
     * Remap the bytes to decode depending on its type
     * @param bytes The bytes to decode
     * @param output The output described in the Abi
     */
    decodeBytes(bytes: string, output: ABIOutput): any;
    /**
     * Decode the outputs : Start from the last to the first (to know the length of the tail)
     * @param bytes The bytes of the outputs
     * @param outputs The outputs from the abi
     */
    decodeOutputs(bytes: string, outputs: (ABIOutput | ABIInput)[]): any;
    /**
     * Decode a array
     * @param bytes The bytes of this array
     * @param output The output object defined in the abi
     */
    decodeArray(bytes: string, output: ABIOutput): any[];
    /** Decode a tuple */
    decodeTuple(bytes: string, outputs: ABIOutput[]): any;
    /** Decode a string */
    decodeString(bytes: string): string;
    /** Decode a dynamic byte */
    decodeDynamicBytes(bytes: string): string;
    /** Decode a static byte */
    decodeStaticBytes(bytes: string): string;
    /**
     * Decode a uint or int
     * WARNING : Return a string
     */
    decodeInt(bytes: string): string;
    /** Decode an address */
    decodeAddress(bytes: string): string;
    /** Decode a boolean */
    decodeBool(bytes: string): boolean;
    /******
     * HEAD
     ******/
    /**
     * Return the head part of the output
     * @param bytes The bytes of the outputS
     * @param outputs The list of outputs
     * @param index The index of the output to check in the outputs
     */
    private getHead(bytes, outputs, index);
    /**
     * Get the size of a static array
     * @param bytes Bytes starting at the beginning of the array
     * @param output The array model
     */
    private staticArraySize(bytes, output);
    /**
     * Get all heads from static arrays or tuples
     * @param bytes Bytes starting at the beginning of the array or tuple
     * @param outputs The outputs given by the ABI for this array or tuple
     */
    private getAllHeads(bytes, outputs);
}
