import { ABIInput } from '@ngeth/utils';

/**
 * Create an array of params based on the size of the array in the ABI and the model
 * @param size The amount of elements in the array
 * @param param The model of param to based the new array on
 */
export function paramFromArray(size: number, param: ABIInput) {
  const type = nestedType(param.type);
  const paramModel = { ...param, name: '', type: type };  // Remove name to avoid conflict
  return Array(size).fill(paramModel);
}

/**
 * Return the size of the fixed array ask by the ABI
 * @param type The type of the array
 */
export function fixedArraySize(type: string): number {
  const lastArrayStr = nestedArray(type).pop();
  const lastArray = JSON.parse(lastArrayStr);
  if (lastArray.length === 0) {
    throw new Error(`Array of type ${type} is not a fixed array`);
  }
  return parseInt(lastArray[0], 10);
}

/**
 * Check if the tuple is static
 * @param tuple The tuple object
 */
export function isStaticTuple(tuple: ABIInput): boolean {
  return (
    tuple.type === 'tuple'  // Prevent type to be 'tuple[]'
    && tuple.components
    && tuple.components.filter(param => !isStatic(param)).length === 0
  );
}

/**
 * Check if the array is static
 * @param arr The array object
 */
export function isStaticArray(arr: ABIInput): boolean {
  return (
    isFixedArray(arr.type)
    && isStatic({...arr, type: nestedType(arr.type)}) // Nested Type is static
  );
}

/**
 * Check if the output is static
 * @param output The output defined in the abi
 */
export function isStatic(output: ABIInput): boolean {
  const type = output.type;
  switch (true) {
    // Array
    case /\[([0-9]*)\]/.test(type):
      return isStaticArray(output);
    // Tuple
    case /tuple?/.test(type): {
      return isStaticTuple(output);
    }
    // Dynamic
    case /string?/.test(type):
    case /bytes?\b/.test(type):
      return false;
    // Static
    case /bytes?/.test(type):
    case /int?/.test(type):
    case /address?/.test(type):
    case /bool?/.test(type):
      return true;
  }
  return true;
}

/**
 * Check if the array is fixed
 * @param type Type of the array
 */
export function isFixedArray(type: string) {
  return /\[[0-9]\]/.test(type);
}

/**
 * Remove last [] in type
 * @example int[32] => int
 * @example int[2][3] => int[2]
 * @param type The type to modify
 */
export function nestedType(type: string): string {
  const arrays = nestedArray(type);
  if (!arrays) { return type; }
  const lastArray = arrays[arrays.length - 1];
  return type.substring(0, type.length - lastArray.length);
}

/**
 * Should return array of nested types
 * @example int[2][3][] => [[2], [3], []]
 * @example int[] => [[]]
 * @example int => null
 * @param type The type to match
 */
export function nestedArray(type: string): string[] {
  return type.match(/(\[[0-9]*\])/g);
}

