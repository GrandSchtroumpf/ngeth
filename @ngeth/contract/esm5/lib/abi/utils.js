/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * Create an array of params based on the size of the array in the ABI and the model
 * @param {?} size The amount of elements in the array
 * @param {?} param The model of param to based the new array on
 * @return {?}
 */
export function paramFromArray(size, param) {
    var /** @type {?} */ type = nestedType(param.type);
    var /** @type {?} */ paramModel = tslib_1.__assign({}, param, { name: '', type: type }); // Remove name to avoid conflict
    return Array(size).fill(paramModel);
}
/**
 * Return the size of the fixed array ask by the ABI
 * @param {?} type The type of the array
 * @return {?}
 */
export function fixedArraySize(type) {
    var /** @type {?} */ lastArrayStr = nestedArray(type).pop();
    var /** @type {?} */ lastArray = JSON.parse(lastArrayStr);
    if (lastArray.length === 0) {
        throw new Error("Array of type " + type + " is not a fixed array");
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
        && tuple.components.filter(function (param) { return !isStatic(param); }).length === 0);
}
/**
 * Check if the array is static
 * @param {?} arr The array object
 * @return {?}
 */
export function isStaticArray(arr) {
    return (isFixedArray(arr.type)
        && isStatic(tslib_1.__assign({}, arr, { type: nestedType(arr.type) })) // Nested Type is static
    );
}
/**
 * Check if the output is static
 * @param {?} output The output defined in the abi
 * @return {?}
 */
export function isStatic(output) {
    var /** @type {?} */ type = output.type;
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
    var /** @type {?} */ arrays = nestedArray(type);
    if (!arrays) {
        return type;
    }
    var /** @type {?} */ lastArray = arrays[arrays.length - 1];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvY29udHJhY3QvIiwic291cmNlcyI6WyJsaWIvYWJpL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsTUFBTSx5QkFBeUIsSUFBWSxFQUFFLEtBQWU7SUFDMUQscUJBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMscUJBQU0sVUFBVSx3QkFBUSxLQUFLLElBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxHQUFFLENBQUM7SUFDdEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Q0FDckM7Ozs7OztBQU1ELE1BQU0seUJBQXlCLElBQVk7SUFDekMscUJBQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM3QyxxQkFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBaUIsSUFBSSwwQkFBdUIsQ0FBQyxDQUFDO0tBQy9EO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDbkM7Ozs7OztBQU1ELE1BQU0sd0JBQXdCLEtBQWU7SUFDM0MsTUFBTSxDQUFDLENBQ0wsS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPO1dBQ25CLEtBQUssQ0FBQyxVQUFVO1dBQ2hCLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUNuRSxDQUFDO0NBQ0g7Ozs7OztBQU1ELE1BQU0sd0JBQXdCLEdBQWE7SUFDekMsTUFBTSxDQUFDLENBQ0wsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7V0FDbkIsUUFBUSxzQkFBSyxHQUFHLElBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUU7S0FDbEQsQ0FBQztDQUNIOzs7Ozs7QUFNRCxNQUFNLG1CQUFtQixNQUFnQjtJQUN2QyxxQkFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUN6QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztRQUViLEtBQUssY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDNUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7UUFFL0IsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDekIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5Qjs7UUFFRCxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDOztRQUVmLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLEtBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQztLQUNmO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztDQUNiOzs7Ozs7QUFNRCxNQUFNLHVCQUF1QixJQUFZO0lBQ3ZDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQy9COzs7Ozs7OztBQVFELE1BQU0scUJBQXFCLElBQVk7SUFDckMscUJBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQUU7SUFDN0IscUJBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUMxRDs7Ozs7Ozs7O0FBU0QsTUFBTSxzQkFBc0IsSUFBWTtJQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztDQUNwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFCSUlucHV0IH0gZnJvbSAnQG5nZXRoL3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYW4gYXJyYXkgb2YgcGFyYW1zIGJhc2VkIG9uIHRoZSBzaXplIG9mIHRoZSBhcnJheSBpbiB0aGUgQUJJIGFuZCB0aGUgbW9kZWxcclxuICogQHBhcmFtIHNpemUgVGhlIGFtb3VudCBvZiBlbGVtZW50cyBpbiB0aGUgYXJyYXlcclxuICogQHBhcmFtIHBhcmFtIFRoZSBtb2RlbCBvZiBwYXJhbSB0byBiYXNlZCB0aGUgbmV3IGFycmF5IG9uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcGFyYW1Gcm9tQXJyYXkoc2l6ZTogbnVtYmVyLCBwYXJhbTogQUJJSW5wdXQpIHtcclxuICBjb25zdCB0eXBlID0gbmVzdGVkVHlwZShwYXJhbS50eXBlKTtcclxuICBjb25zdCBwYXJhbU1vZGVsID0geyAuLi5wYXJhbSwgbmFtZTogJycsIHR5cGU6IHR5cGUgfTsgIC8vIFJlbW92ZSBuYW1lIHRvIGF2b2lkIGNvbmZsaWN0XHJcbiAgcmV0dXJuIEFycmF5KHNpemUpLmZpbGwocGFyYW1Nb2RlbCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIHNpemUgb2YgdGhlIGZpeGVkIGFycmF5IGFzayBieSB0aGUgQUJJXHJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBhcnJheVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZpeGVkQXJyYXlTaXplKHR5cGU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgY29uc3QgbGFzdEFycmF5U3RyID0gbmVzdGVkQXJyYXkodHlwZSkucG9wKCk7XHJcbiAgY29uc3QgbGFzdEFycmF5ID0gSlNPTi5wYXJzZShsYXN0QXJyYXlTdHIpO1xyXG4gIGlmIChsYXN0QXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEFycmF5IG9mIHR5cGUgJHt0eXBlfSBpcyBub3QgYSBmaXhlZCBhcnJheWApO1xyXG4gIH1cclxuICByZXR1cm4gcGFyc2VJbnQobGFzdEFycmF5WzBdLCAxMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgdHVwbGUgaXMgc3RhdGljXHJcbiAqIEBwYXJhbSB0dXBsZSBUaGUgdHVwbGUgb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNTdGF0aWNUdXBsZSh0dXBsZTogQUJJSW5wdXQpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHVwbGUudHlwZSA9PT0gJ3R1cGxlJyAgLy8gUHJldmVudCB0eXBlIHRvIGJlICd0dXBsZVtdJ1xyXG4gICAgJiYgdHVwbGUuY29tcG9uZW50c1xyXG4gICAgJiYgdHVwbGUuY29tcG9uZW50cy5maWx0ZXIocGFyYW0gPT4gIWlzU3RhdGljKHBhcmFtKSkubGVuZ3RoID09PSAwXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSBhcnJheSBpcyBzdGF0aWNcclxuICogQHBhcmFtIGFyciBUaGUgYXJyYXkgb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNTdGF0aWNBcnJheShhcnI6IEFCSUlucHV0KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGlzRml4ZWRBcnJheShhcnIudHlwZSlcclxuICAgICYmIGlzU3RhdGljKHsuLi5hcnIsIHR5cGU6IG5lc3RlZFR5cGUoYXJyLnR5cGUpfSkgLy8gTmVzdGVkIFR5cGUgaXMgc3RhdGljXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSBvdXRwdXQgaXMgc3RhdGljXHJcbiAqIEBwYXJhbSBvdXRwdXQgVGhlIG91dHB1dCBkZWZpbmVkIGluIHRoZSBhYmlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXRpYyhvdXRwdXQ6IEFCSUlucHV0KTogYm9vbGVhbiB7XHJcbiAgY29uc3QgdHlwZSA9IG91dHB1dC50eXBlO1xyXG4gIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgLy8gQXJyYXlcclxuICAgIGNhc2UgL1xcWyhbMC05XSopXFxdLy50ZXN0KHR5cGUpOlxyXG4gICAgICByZXR1cm4gaXNTdGF0aWNBcnJheShvdXRwdXQpO1xyXG4gICAgLy8gVHVwbGVcclxuICAgIGNhc2UgL3R1cGxlPy8udGVzdCh0eXBlKToge1xyXG4gICAgICByZXR1cm4gaXNTdGF0aWNUdXBsZShvdXRwdXQpO1xyXG4gICAgfVxyXG4gICAgLy8gRHluYW1pY1xyXG4gICAgY2FzZSAvc3RyaW5nPy8udGVzdCh0eXBlKTpcclxuICAgIGNhc2UgL2J5dGVzP1xcYi8udGVzdCh0eXBlKTpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gU3RhdGljXHJcbiAgICBjYXNlIC9ieXRlcz8vLnRlc3QodHlwZSk6XHJcbiAgICBjYXNlIC9pbnQ/Ly50ZXN0KHR5cGUpOlxyXG4gICAgY2FzZSAvYWRkcmVzcz8vLnRlc3QodHlwZSk6XHJcbiAgICBjYXNlIC9ib29sPy8udGVzdCh0eXBlKTpcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIGFycmF5IGlzIGZpeGVkXHJcbiAqIEBwYXJhbSB0eXBlIFR5cGUgb2YgdGhlIGFycmF5XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNGaXhlZEFycmF5KHR5cGU6IHN0cmluZykge1xyXG4gIHJldHVybiAvXFxbWzAtOV1cXF0vLnRlc3QodHlwZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgbGFzdCBbXSBpbiB0eXBlXHJcbiAqIEBleGFtcGxlIGludFszMl0gPT4gaW50XHJcbiAqIEBleGFtcGxlIGludFsyXVszXSA9PiBpbnRbMl1cclxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgdG8gbW9kaWZ5XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbmVzdGVkVHlwZSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGFycmF5cyA9IG5lc3RlZEFycmF5KHR5cGUpO1xyXG4gIGlmICghYXJyYXlzKSB7IHJldHVybiB0eXBlOyB9XHJcbiAgY29uc3QgbGFzdEFycmF5ID0gYXJyYXlzW2FycmF5cy5sZW5ndGggLSAxXTtcclxuICByZXR1cm4gdHlwZS5zdWJzdHJpbmcoMCwgdHlwZS5sZW5ndGggLSBsYXN0QXJyYXkubGVuZ3RoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3VsZCByZXR1cm4gYXJyYXkgb2YgbmVzdGVkIHR5cGVzXHJcbiAqIEBleGFtcGxlIGludFsyXVszXVtdID0+IFtbMl0sIFszXSwgW11dXHJcbiAqIEBleGFtcGxlIGludFtdID0+IFtbXV1cclxuICogQGV4YW1wbGUgaW50ID0+IG51bGxcclxuICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgdG8gbWF0Y2hcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBuZXN0ZWRBcnJheSh0eXBlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgcmV0dXJuIHR5cGUubWF0Y2goLyhcXFtbMC05XSpcXF0pL2cpO1xyXG59XHJcblxyXG4iXX0=