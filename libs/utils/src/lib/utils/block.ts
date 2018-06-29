/**
 * Returns true if given string is a valid Ethereum block header bloom.
 * @method isBloom
 * @param hex encoded bloom filter
 */
function isBloom(bloom: string): boolean {
  if (!/^(0x)?[0-9a-f]{512}$/i.test(bloom)) {
    return false;
  } else if (
    /^(0x)?[0-9a-f]{512}$/.test(bloom) ||
    /^(0x)?[0-9A-F]{512}$/.test(bloom)
  ) {
    return true;
  }
  return false;
}

/**
 * Returns true if given string is a valid log topic.
 * @method isTopic
 * @param hex encoded topic
 */
export function isTopic(topic: string): boolean {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
    return false;
  } else if (
    /^(0x)?[0-9a-f]{64}$/.test(topic) ||
    /^(0x)?[0-9A-F]{64}$/.test(topic)
  ) {
    return true;
  }
  return false;
}
