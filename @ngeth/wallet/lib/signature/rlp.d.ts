/// <reference types="node" />
/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * This private takes in a data, convert it to buffer if not, and a length for recursion
 *
 * @param data - will be converted to buffer
 * @returns  - returns buffer of encoded data
 **/
export declare class RLP {
    encode(input: Buffer | string | number | Array<any>): Buffer;
    private safeParseInt(v, base);
    private encodeLength(len, offset);
    /**
     * RLP Decoding based on: {@link https://github.com/ethereum/wiki/wiki/RLP}
     * @param data - will be converted to buffer
     * @returns - returns decode Array of Buffers containg the original message
     **/
    decode(input: Buffer | string, stream?: boolean): Buffer | Array<any>;
    getLength(input: string | Buffer): number | Buffer;
    private _decode(input);
    /**
     * HELPERS : TO REMOVE
     */
    private isHexPrefixed(str);
    private stripHexPrefix(str);
    private intToHex(i);
    private padToEven(a);
    private intToBuffer(i);
    private toBuffer(v);
}
