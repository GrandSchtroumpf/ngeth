/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Returns true if given string is a valid Ethereum block header bloom.
 * \@method isBloom
 * @param {?} bloom
 * @return {?}
 */
function isBloom(bloom) {
    if (!/^(0x)?[0-9a-f]{512}$/i.test(bloom)) {
        return false;
    }
    else if (/^(0x)?[0-9a-f]{512}$/.test(bloom) ||
        /^(0x)?[0-9A-F]{512}$/.test(bloom)) {
        return true;
    }
    return false;
}
/**
 * Returns true if given string is a valid log topic.
 * \@method isTopic
 * @param {?} topic
 * @return {?}
 */
export function isTopic(topic) {
    if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
        return false;
    }
    else if (/^(0x)?[0-9a-f]{64}$/.test(topic) ||
        /^(0x)?[0-9A-F]{64}$/.test(topic)) {
        return true;
    }
    return false;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2suanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmdldGgvdXRpbHMvIiwic291cmNlcyI6WyJsaWIvdXRpbHMvYmxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUtBLGlCQUFpQixLQUFhO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQ2Q7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ1Isc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDYjtJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7Q0FDZDs7Ozs7OztBQU9ELE1BQU0sa0JBQWtCLEtBQWE7SUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDZDtJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDUixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2pDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztLQUNiO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztDQUNkIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiBnaXZlbiBzdHJpbmcgaXMgYSB2YWxpZCBFdGhlcmV1bSBibG9jayBoZWFkZXIgYmxvb20uXHJcbiAqIEBtZXRob2QgaXNCbG9vbVxyXG4gKiBAcGFyYW0gaGV4IGVuY29kZWQgYmxvb20gZmlsdGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Jsb29tKGJsb29tOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICBpZiAoIS9eKDB4KT9bMC05YS1mXXs1MTJ9JC9pLnRlc3QoYmxvb20pKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSBlbHNlIGlmIChcclxuICAgIC9eKDB4KT9bMC05YS1mXXs1MTJ9JC8udGVzdChibG9vbSkgfHxcclxuICAgIC9eKDB4KT9bMC05QS1GXXs1MTJ9JC8udGVzdChibG9vbSlcclxuICApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgZ2l2ZW4gc3RyaW5nIGlzIGEgdmFsaWQgbG9nIHRvcGljLlxyXG4gKiBAbWV0aG9kIGlzVG9waWNcclxuICogQHBhcmFtIGhleCBlbmNvZGVkIHRvcGljXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNUb3BpYyh0b3BpYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgaWYgKCEvXigweCk/WzAtOWEtZl17NjR9JC9pLnRlc3QodG9waWMpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSBlbHNlIGlmIChcclxuICAgIC9eKDB4KT9bMC05YS1mXXs2NH0kLy50ZXN0KHRvcGljKSB8fFxyXG4gICAgL14oMHgpP1swLTlBLUZdezY0fSQvLnRlc3QodG9waWMpXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbiJdfQ==