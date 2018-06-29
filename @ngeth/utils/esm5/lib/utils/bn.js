/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import BN from 'bn.js';
/**
 * Returns true if object is BN, otherwise false
 *
 * \@method isBN
 * @param {?} object
 * @return {?}
 */
export function isBN(object) {
    return (object instanceof BN ||
        (object && object.constructor && object.constructor.name === 'BN'));
}
/**
 * Returns true if object is BigNumber, otherwise false
 *
 * \@method isBigNumber
 * @param {?} object
 * @return {?}
 */
export function isBigNumber(object) {
    return (object && object.constructor && object.constructor.name === 'BigNumber');
}
/**
 * Takes an input and transforms it into an BN
 * @param {?} number
 * @return {?}
 */
export function toBN(number) {
    try {
        return numberToBN.apply(null, arguments);
    }
    catch (/** @type {?} */ e) {
        throw new Error(e + " + ' Given value: " + number + " ");
    }
}
/**
 * Takes and input transforms it into BN and if it is negative value, into two's complement
 *
 * \@method toTwosComplement
 * @param {?} number
 * @return {?}
 */
export function toTwosComplement(number) {
    return ('0x' +
        toBN(number)
            .toTwos(256)
            .toString(16, 64));
}
/**
 * Convert integer or hex integer numbers to BN.js object instances. Does not supprot decimal numbers.
 * @param {?} arg
 * @return {?}
 */
function numberToBN(arg) {
    if (typeof arg === 'string' || typeof arg === 'number') {
        var /** @type {?} */ multiplier = new BN(1);
        var /** @type {?} */ formattedString = String(arg)
            .toLowerCase()
            .trim();
        var /** @type {?} */ isPrefixed = formattedString.substr(0, 2) === '0x' ||
            formattedString.substr(0, 3) === '-0x';
        var /** @type {?} */ stringArg = stripHexPrefix(formattedString);
        if (stringArg.substr(0, 1) === '-') {
            stringArg = stripHexPrefix(stringArg.slice(1));
            multiplier = new BN(-1, 10);
        }
        stringArg = stringArg === '' ? '0' : stringArg;
        if ((!stringArg.match(/^-?[0-9]+$/) && stringArg.match(/^[0-9A-Fa-f]+$/)) ||
            stringArg.match(/^[a-fA-F]+$/) ||
            (isPrefixed === true && stringArg.match(/^[0-9A-Fa-f]+$/))) {
            return new BN(stringArg, 16).mul(multiplier);
        }
        if ((stringArg.match(/^-?[0-9]+$/) || stringArg === '') &&
            isPrefixed === false) {
            return new BN(stringArg, 10).mul(multiplier);
        }
    }
    else if (typeof arg === 'object' &&
        arg.toString &&
        (!arg['pop'] && !arg['push'])) {
        if (arg.toString().match(/^-?[0-9]+$/) &&
            (arg['mul'] || arg['dividedToIntegerBy'])) {
            return new BN(arg.toString(), 10);
        }
    }
    throw new Error("\n    [number-to-bn] while converting number " + JSON.stringify(arg) + " to BN.js instance,\n    error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance.\n    Note, decimals are not supported.\n  ");
}
/**
 * Removes '0x' from a given `String` if present
 * @param {?=} str the string value
 * @return {?} a string by pass if necessary
 */
function stripHexPrefix(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return isHexPrefixed(str) ? str.slice(2) : str;
}
/**
 * Returns a `Boolean` on whether or not the a `String` starts with '0x'
 * @throws if the str input is not a string
 * @param {?} str the string input value
 * @return {?} a boolean if it is or is not hex prefixed
 */
function isHexPrefixed(str) {
    if (typeof str !== 'string') {
        throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + typeof str + ", while checking isHexPrefixed.");
    }
    return str.slice(0, 2) === '0x';
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm4uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvdXRpbHMvIiwic291cmNlcyI6WyJsaWIvdXRpbHMvYm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLE9BQU8sQ0FBQzs7Ozs7Ozs7QUFPdkIsTUFBTSxlQUFlLE1BQWM7SUFDakMsTUFBTSxDQUFDLENBQ0wsTUFBTSxZQUFZLEVBQUU7UUFDcEIsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FDbkUsQ0FBQztDQUNIOzs7Ozs7OztBQVFELE1BQU0sc0JBQXNCLE1BQWM7SUFDeEMsTUFBTSxDQUFDLENBQ0wsTUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUN4RSxDQUFDO0NBQ0g7Ozs7OztBQU1ELE1BQU0sZUFBZSxNQUE0QjtJQUMvQyxJQUFJLENBQUM7UUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDMUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxpQkFBQSxDQUFDLEVBQUUsQ0FBQztRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUksQ0FBQywwQkFBcUIsTUFBTSxNQUFHLENBQUMsQ0FBQztLQUNyRDtDQUNGOzs7Ozs7OztBQVFELE1BQU0sMkJBQTJCLE1BQTRCO0lBQzNELE1BQU0sQ0FBQyxDQUNMLElBQUk7UUFDSixJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ1QsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQ3BCLENBQUM7Q0FDSDs7Ozs7O0FBTUQsb0JBQW9CLEdBQTZCO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLEdBQUcsS0FBSyxR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QUFDLENBQUMsR0FBRyxDQUFDO0NBQ2hEOzs7Ozs7O0FBUUQsdUJBQXVCLEdBQVc7SUFDaEMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLElBQUksS0FBSyxDQUNiLHNFQUFvRSxPQUFPLEdBQUcsb0NBQWlDLENBQ2hILENBQUM7S0FDSDtJQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUM7Q0FDakMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQk4gZnJvbSAnYm4uanMnO1xyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIG9iamVjdCBpcyBCTiwgb3RoZXJ3aXNlIGZhbHNlXHJcbiAqXHJcbiAqIEBtZXRob2QgaXNCTlxyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNCTihvYmplY3Q6IE9iamVjdCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBvYmplY3QgaW5zdGFuY2VvZiBCTiB8fFxyXG4gICAgKG9iamVjdCAmJiBvYmplY3QuY29uc3RydWN0b3IgJiYgb2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgPT09ICdCTicpXHJcbiAgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgQmlnTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcclxuICpcclxuICogQG1ldGhvZCBpc0JpZ051bWJlclxyXG4gKiBAcGFyYW0gb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNCaWdOdW1iZXIob2JqZWN0OiBPYmplY3QpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgb2JqZWN0ICYmIG9iamVjdC5jb25zdHJ1Y3RvciAmJiBvYmplY3QuY29uc3RydWN0b3IubmFtZSA9PT0gJ0JpZ051bWJlcidcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogVGFrZXMgYW4gaW5wdXQgYW5kIHRyYW5zZm9ybXMgaXQgaW50byBhbiBCTlxyXG4gKiBAcGFyYW0gbnVtYmVyLCBzdHJpbmcsIEhFWCBzdHJpbmcgb3IgQk5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0JOKG51bWJlcjogbnVtYmVyIHwgc3RyaW5nIHwgQk4pOiBCTiB7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBudW1iZXJUb0JOLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGAke2V9ICsgJyBHaXZlbiB2YWx1ZTogJHtudW1iZXJ9IGApO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRha2VzIGFuZCBpbnB1dCB0cmFuc2Zvcm1zIGl0IGludG8gQk4gYW5kIGlmIGl0IGlzIG5lZ2F0aXZlIHZhbHVlLCBpbnRvIHR3bydzIGNvbXBsZW1lbnRcclxuICpcclxuICogQG1ldGhvZCB0b1R3b3NDb21wbGVtZW50XHJcbiAqIEBwYXJhbSBudW1iZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0b1R3b3NDb21wbGVtZW50KG51bWJlcjogbnVtYmVyIHwgc3RyaW5nIHwgQk4pOiBzdHJpbmcge1xyXG4gIHJldHVybiAoXHJcbiAgICAnMHgnICtcclxuICAgIHRvQk4obnVtYmVyKVxyXG4gICAgICAudG9Ud29zKDI1NilcclxuICAgICAgLnRvU3RyaW5nKDE2LCA2NClcclxuICApO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBpbnRlZ2VyIG9yIGhleCBpbnRlZ2VyIG51bWJlcnMgdG8gQk4uanMgb2JqZWN0IGluc3RhbmNlcy4gRG9lcyBub3Qgc3VwcHJvdCBkZWNpbWFsIG51bWJlcnMuXHJcbiAqIEBwYXJhbSBhcmdcclxuICovXHJcbmZ1bmN0aW9uIG51bWJlclRvQk4oYXJnOiBzdHJpbmcgfCBudW1iZXIgfCBvYmplY3QpIHtcclxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcclxuICAgIGxldCBtdWx0aXBsaWVyID0gbmV3IEJOKDEpO1xyXG4gICAgY29uc3QgZm9ybWF0dGVkU3RyaW5nID0gU3RyaW5nKGFyZylcclxuICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgLnRyaW0oKTtcclxuICAgIGNvbnN0IGlzUHJlZml4ZWQgPVxyXG4gICAgICBmb3JtYXR0ZWRTdHJpbmcuc3Vic3RyKDAsIDIpID09PSAnMHgnIHx8XHJcbiAgICAgIGZvcm1hdHRlZFN0cmluZy5zdWJzdHIoMCwgMykgPT09ICctMHgnO1xyXG4gICAgbGV0IHN0cmluZ0FyZyA9IHN0cmlwSGV4UHJlZml4KGZvcm1hdHRlZFN0cmluZyk7XHJcbiAgICBpZiAoc3RyaW5nQXJnLnN1YnN0cigwLCAxKSA9PT0gJy0nKSB7XHJcbiAgICAgIHN0cmluZ0FyZyA9IHN0cmlwSGV4UHJlZml4KHN0cmluZ0FyZy5zbGljZSgxKSk7XHJcbiAgICAgIG11bHRpcGxpZXIgPSBuZXcgQk4oLTEsIDEwKTtcclxuICAgIH1cclxuICAgIHN0cmluZ0FyZyA9IHN0cmluZ0FyZyA9PT0gJycgPyAnMCcgOiBzdHJpbmdBcmc7XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICAoIXN0cmluZ0FyZy5tYXRjaCgvXi0/WzAtOV0rJC8pICYmIHN0cmluZ0FyZy5tYXRjaCgvXlswLTlBLUZhLWZdKyQvKSkgfHxcclxuICAgICAgc3RyaW5nQXJnLm1hdGNoKC9eW2EtZkEtRl0rJC8pIHx8XHJcbiAgICAgIChpc1ByZWZpeGVkID09PSB0cnVlICYmIHN0cmluZ0FyZy5tYXRjaCgvXlswLTlBLUZhLWZdKyQvKSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gbmV3IEJOKHN0cmluZ0FyZywgMTYpLm11bChtdWx0aXBsaWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoXHJcbiAgICAgIChzdHJpbmdBcmcubWF0Y2goL14tP1swLTldKyQvKSB8fCBzdHJpbmdBcmcgPT09ICcnKSAmJlxyXG4gICAgICBpc1ByZWZpeGVkID09PSBmYWxzZVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQk4oc3RyaW5nQXJnLCAxMCkubXVsKG11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoXHJcbiAgICB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJlxyXG4gICAgYXJnLnRvU3RyaW5nICYmXHJcbiAgICAoIWFyZ1sncG9wJ10gJiYgIWFyZ1sncHVzaCddKVxyXG4gICkge1xyXG4gICAgaWYgKFxyXG4gICAgICBhcmcudG9TdHJpbmcoKS5tYXRjaCgvXi0/WzAtOV0rJC8pICYmXHJcbiAgICAgIChhcmdbJ211bCddIHx8IGFyZ1snZGl2aWRlZFRvSW50ZWdlckJ5J10pXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIG5ldyBCTihhcmcudG9TdHJpbmcoKSwgMTApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhyb3cgbmV3IEVycm9yKGBcclxuICAgIFtudW1iZXItdG8tYm5dIHdoaWxlIGNvbnZlcnRpbmcgbnVtYmVyICR7SlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgIGFyZ1xyXG4gICAgKX0gdG8gQk4uanMgaW5zdGFuY2UsXHJcbiAgICBlcnJvcjogaW52YWxpZCBudW1iZXIgdmFsdWUuIFZhbHVlIG11c3QgYmUgYW4gaW50ZWdlciwgaGV4IHN0cmluZywgQk4gb3IgQmlnTnVtYmVyIGluc3RhbmNlLlxyXG4gICAgTm90ZSwgZGVjaW1hbHMgYXJlIG5vdCBzdXBwb3J0ZWQuXHJcbiAgYCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmVzICcweCcgZnJvbSBhIGdpdmVuIGBTdHJpbmdgIGlmIHByZXNlbnRcclxuICogQHBhcmFtIHN0ciB0aGUgc3RyaW5nIHZhbHVlXHJcbiAqIEByZXR1cm4gYSBzdHJpbmcgYnkgcGFzcyBpZiBuZWNlc3NhcnlcclxuICovXHJcbmZ1bmN0aW9uIHN0cmlwSGV4UHJlZml4KHN0cj86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gc3RyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzSGV4UHJlZml4ZWQoc3RyKSA/IHN0ci5zbGljZSgyKSA6IHN0cjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBgQm9vbGVhbmAgb24gd2hldGhlciBvciBub3QgdGhlIGEgYFN0cmluZ2Agc3RhcnRzIHdpdGggJzB4J1xyXG4gKiBAcGFyYW0gc3RyIHRoZSBzdHJpbmcgaW5wdXQgdmFsdWVcclxuICogQHJldHVybiAgYSBib29sZWFuIGlmIGl0IGlzIG9yIGlzIG5vdCBoZXggcHJlZml4ZWRcclxuICogQHRocm93cyBpZiB0aGUgc3RyIGlucHV0IGlzIG5vdCBhIHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gaXNIZXhQcmVmaXhlZChzdHI6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICBgW2lzLWhleC1wcmVmaXhlZF0gdmFsdWUgbXVzdCBiZSB0eXBlICdzdHJpbmcnLCBpcyBjdXJyZW50bHkgdHlwZSAke3R5cGVvZiBzdHJ9LCB3aGlsZSBjaGVja2luZyBpc0hleFByZWZpeGVkLmBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnO1xyXG59XHJcbiJdfQ==