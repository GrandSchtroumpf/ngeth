import { ABIInput } from '@ngeth/utils';
/**
 * Create an array of params based on the size of the array in the ABI and the model
 * @param size The amount of elements in the array
 * @param param The model of param to based the new array on
 */
export declare function paramFromArray(size: number, param: ABIInput): any[];
/**
 * Return the size of the fixed array ask by the ABI
 * @param type The type of the array
 */
export declare function fixedArraySize(type: string): number;
/**
 * Check if the tuple is static
 * @param tuple The tuple object
 */
export declare function isStaticTuple(tuple: ABIInput): boolean;
/**
 * Check if the array is static
 * @param arr The array object
 */
export declare function isStaticArray(arr: ABIInput): boolean;
/**
 * Check if the output is static
 * @param output The output defined in the abi
 */
export declare function isStatic(output: ABIInput): boolean;
/**
 * Check if the array is fixed
 * @param type Type of the array
 */
export declare function isFixedArray(type: string): boolean;
/**
 * Remove last [] in type
 * @example int[32] => int
 * @example int[2][3] => int[2]
 * @param type The type to modify
 */
export declare function nestedType(type: string): string;
/**
 * Should return array of nested types
 * @example int[2][3][] => [[2], [3], []]
 * @example int[] => [[]]
 * @example int => null
 * @param type The type to match
 */
export declare function nestedArray(type: string): string[];
