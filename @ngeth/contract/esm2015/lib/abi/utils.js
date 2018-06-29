/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Create an array of params based on the size of the array in the ABI and the model
 * @param {?} size The amount of elements in the array
 * @param {?} param The model of param to based the new array on
 * @return {?}
 */
export function paramFromArray(size, param) {
    const /** @type {?} */ type = nestedType(param.type);
    const /** @type {?} */ paramModel = Object.assign({}, param, { name: '', type: type }); // Remove name to avoid conflict
    return Array(size).fill(paramModel);
}
/**
 * Return the size of the fixed array ask by the ABI
 * @param {?} type The type of the array
 * @return {?}
 */
export function fixedArraySize(type) {
    const /** @type {?} */ lastArrayStr = nestedArray(type).pop();
    const /** @type {?} */ lastArray = JSON.parse(lastArrayStr);
    if (lastArray.length === 0) {
        throw new Error(`Array of type ${type} is not a fixed array`);
    }
    return parseInt(lastArray[0], 10);
}
/**
 * Check if the tuple is static
 * @param {?} tuple The tuple object
 * @return {?}
 */
export function isStaticTuple(tuple) {
    return (tuple.type === 'tuple' // Prevent type to be 'tuple[]'
        && tuple.components
        && tuple.components.filter(param => !isStatic(param)).length === 0);
}
/**
 * Check if the array is static
 * @param {?} arr The array object
 * @return {?}
 */
export function isStaticArray(arr) {
    return (isFixedArray(arr.type)
        && isStatic(Object.assign({}, arr, { type: nestedType(arr.type) })) // Nested Type is static
    );
}
/**
 * Check if the output is static
 * @param {?} output The output defined in the abi
 * @return {?}
 */
export function isStatic(output) {
    const /** @type {?} */ type = output.type;
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
 * @param {?} type Type of the array
 * @return {?}
 */
export function isFixedArray(type) {
    return /\[[0-9]\]/.test(type);
}
/**
 * Remove last [] in type
 * \@example int[32] => int
 * \@example int[2][3] => int[2]
 * @param {?} type The type to modify
 * @return {?}
 */
export function nestedType(type) {
    const /** @type {?} */ arrays = nestedArray(type);
    if (!arrays) {
        return type;
    }
    const /** @type {?} */ lastArray = arrays[arrays.length - 1];
    return type.substring(0, type.length - lastArray.length);
}
/**
 * Should return array of nested types
 * \@example int[2][3][] => [[2], [3], []]
 * \@example int[] => [[]]
 * \@example int => null
 * @param {?} type The type to match
 * @return {?}
 */
export function nestedArray(type) {
    return type.match(/(\[[0-9]*\])/g);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvY29udHJhY3QvIiwic291cmNlcyI6WyJsaWIvYWJpL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxNQUFNLHlCQUF5QixJQUFZLEVBQUUsS0FBZTtJQUMxRCx1QkFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyx1QkFBTSxVQUFVLHFCQUFRLEtBQUssSUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEdBQUUsQ0FBQztJQUN0RCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztDQUNyQzs7Ozs7O0FBTUQsTUFBTSx5QkFBeUIsSUFBWTtJQUN6Qyx1QkFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzdDLHVCQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixJQUFJLHVCQUF1QixDQUFDLENBQUM7S0FDL0Q7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztDQUNuQzs7Ozs7O0FBTUQsTUFBTSx3QkFBd0IsS0FBZTtJQUMzQyxNQUFNLENBQUMsQ0FDTCxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU87V0FDbkIsS0FBSyxDQUFDLFVBQVU7V0FDaEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQ25FLENBQUM7Q0FDSDs7Ozs7O0FBTUQsTUFBTSx3QkFBd0IsR0FBYTtJQUN6QyxNQUFNLENBQUMsQ0FDTCxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztXQUNuQixRQUFRLG1CQUFLLEdBQUcsSUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBRTtLQUNsRCxDQUFDO0NBQ0g7Ozs7OztBQU1ELE1BQU0sbUJBQW1CLE1BQWdCO0lBQ3ZDLHVCQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3pCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O1FBRWIsS0FBSyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM1QixNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUUvQixLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN6QixNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlCOztRQUVELEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUM7O1FBRWYsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ2Y7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0NBQ2I7Ozs7OztBQU1ELE1BQU0sdUJBQXVCLElBQVk7SUFDdkMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDL0I7Ozs7Ozs7O0FBUUQsTUFBTSxxQkFBcUIsSUFBWTtJQUNyQyx1QkFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FBRTtJQUM3Qix1QkFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQzFEOzs7Ozs7Ozs7QUFTRCxNQUFNLHNCQUFzQixJQUFZO0lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0NBQ3BDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQUJJSW5wdXQgfSBmcm9tICdAbmdldGgvdXRpbHMnO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhbiBhcnJheSBvZiBwYXJhbXMgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIGFycmF5IGluIHRoZSBBQkkgYW5kIHRoZSBtb2RlbFxyXG4gKiBAcGFyYW0gc2l6ZSBUaGUgYW1vdW50IG9mIGVsZW1lbnRzIGluIHRoZSBhcnJheVxyXG4gKiBAcGFyYW0gcGFyYW0gVGhlIG1vZGVsIG9mIHBhcmFtIHRvIGJhc2VkIHRoZSBuZXcgYXJyYXkgb25cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJhbUZyb21BcnJheShzaXplOiBudW1iZXIsIHBhcmFtOiBBQklJbnB1dCkge1xyXG4gIGNvbnN0IHR5cGUgPSBuZXN0ZWRUeXBlKHBhcmFtLnR5cGUpO1xyXG4gIGNvbnN0IHBhcmFtTW9kZWwgPSB7IC4uLnBhcmFtLCBuYW1lOiAnJywgdHlwZTogdHlwZSB9OyAgLy8gUmVtb3ZlIG5hbWUgdG8gYXZvaWQgY29uZmxpY3RcclxuICByZXR1cm4gQXJyYXkoc2l6ZSkuZmlsbChwYXJhbU1vZGVsKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgc2l6ZSBvZiB0aGUgZml4ZWQgYXJyYXkgYXNrIGJ5IHRoZSBBQklcclxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIGFycmF5XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZml4ZWRBcnJheVNpemUodHlwZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICBjb25zdCBsYXN0QXJyYXlTdHIgPSBuZXN0ZWRBcnJheSh0eXBlKS5wb3AoKTtcclxuICBjb25zdCBsYXN0QXJyYXkgPSBKU09OLnBhcnNlKGxhc3RBcnJheVN0cik7XHJcbiAgaWYgKGxhc3RBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQXJyYXkgb2YgdHlwZSAke3R5cGV9IGlzIG5vdCBhIGZpeGVkIGFycmF5YCk7XHJcbiAgfVxyXG4gIHJldHVybiBwYXJzZUludChsYXN0QXJyYXlbMF0sIDEwKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSB0dXBsZSBpcyBzdGF0aWNcclxuICogQHBhcmFtIHR1cGxlIFRoZSB0dXBsZSBvYmplY3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXRpY1R1cGxlKHR1cGxlOiBBQklJbnB1dCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICB0dXBsZS50eXBlID09PSAndHVwbGUnICAvLyBQcmV2ZW50IHR5cGUgdG8gYmUgJ3R1cGxlW10nXHJcbiAgICAmJiB0dXBsZS5jb21wb25lbnRzXHJcbiAgICAmJiB0dXBsZS5jb21wb25lbnRzLmZpbHRlcihwYXJhbSA9PiAhaXNTdGF0aWMocGFyYW0pKS5sZW5ndGggPT09IDBcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIGFycmF5IGlzIHN0YXRpY1xyXG4gKiBAcGFyYW0gYXJyIFRoZSBhcnJheSBvYmplY3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXRpY0FycmF5KGFycjogQUJJSW5wdXQpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgaXNGaXhlZEFycmF5KGFyci50eXBlKVxyXG4gICAgJiYgaXNTdGF0aWMoey4uLmFyciwgdHlwZTogbmVzdGVkVHlwZShhcnIudHlwZSl9KSAvLyBOZXN0ZWQgVHlwZSBpcyBzdGF0aWNcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIG91dHB1dCBpcyBzdGF0aWNcclxuICogQHBhcmFtIG91dHB1dCBUaGUgb3V0cHV0IGRlZmluZWQgaW4gdGhlIGFiaVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhdGljKG91dHB1dDogQUJJSW5wdXQpOiBib29sZWFuIHtcclxuICBjb25zdCB0eXBlID0gb3V0cHV0LnR5cGU7XHJcbiAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAvLyBBcnJheVxyXG4gICAgY2FzZSAvXFxbKFswLTldKilcXF0vLnRlc3QodHlwZSk6XHJcbiAgICAgIHJldHVybiBpc1N0YXRpY0FycmF5KG91dHB1dCk7XHJcbiAgICAvLyBUdXBsZVxyXG4gICAgY2FzZSAvdHVwbGU/Ly50ZXN0KHR5cGUpOiB7XHJcbiAgICAgIHJldHVybiBpc1N0YXRpY1R1cGxlKG91dHB1dCk7XHJcbiAgICB9XHJcbiAgICAvLyBEeW5hbWljXHJcbiAgICBjYXNlIC9zdHJpbmc/Ly50ZXN0KHR5cGUpOlxyXG4gICAgY2FzZSAvYnl0ZXM/XFxiLy50ZXN0KHR5cGUpOlxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyBTdGF0aWNcclxuICAgIGNhc2UgL2J5dGVzPy8udGVzdCh0eXBlKTpcclxuICAgIGNhc2UgL2ludD8vLnRlc3QodHlwZSk6XHJcbiAgICBjYXNlIC9hZGRyZXNzPy8udGVzdCh0eXBlKTpcclxuICAgIGNhc2UgL2Jvb2w/Ly50ZXN0KHR5cGUpOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgYXJyYXkgaXMgZml4ZWRcclxuICogQHBhcmFtIHR5cGUgVHlwZSBvZiB0aGUgYXJyYXlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0ZpeGVkQXJyYXkodHlwZTogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIC9cXFtbMC05XVxcXS8udGVzdCh0eXBlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBsYXN0IFtdIGluIHR5cGVcclxuICogQGV4YW1wbGUgaW50WzMyXSA9PiBpbnRcclxuICogQGV4YW1wbGUgaW50WzJdWzNdID0+IGludFsyXVxyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB0byBtb2RpZnlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBuZXN0ZWRUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgYXJyYXlzID0gbmVzdGVkQXJyYXkodHlwZSk7XHJcbiAgaWYgKCFhcnJheXMpIHsgcmV0dXJuIHR5cGU7IH1cclxuICBjb25zdCBsYXN0QXJyYXkgPSBhcnJheXNbYXJyYXlzLmxlbmd0aCAtIDFdO1xyXG4gIHJldHVybiB0eXBlLnN1YnN0cmluZygwLCB0eXBlLmxlbmd0aCAtIGxhc3RBcnJheS5sZW5ndGgpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdWxkIHJldHVybiBhcnJheSBvZiBuZXN0ZWQgdHlwZXNcclxuICogQGV4YW1wbGUgaW50WzJdWzNdW10gPT4gW1syXSwgWzNdLCBbXV1cclxuICogQGV4YW1wbGUgaW50W10gPT4gW1tdXVxyXG4gKiBAZXhhbXBsZSBpbnQgPT4gbnVsbFxyXG4gKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB0byBtYXRjaFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG5lc3RlZEFycmF5KHR5cGU6IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICByZXR1cm4gdHlwZS5tYXRjaCgvKFxcW1swLTldKlxcXSkvZyk7XHJcbn1cclxuXHJcbiJdfQ==