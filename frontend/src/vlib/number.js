import { padString } from "./util";

(() => {
  /**
   * Returns a string representation of the number to display up to `max` decimal places,
   * trimming insignificant decimal places from the end
   * @param { number } min The minimum number of decimal places to display
   * @param { number } max The maximum number of (significant) decimal places to display
   * @param { 'up' | 'down' | 'auto' } round The direction to round the number, if necessary
   * @returns { string }
   */
  Number.prototype.toDynamic = function(max, min = 0, round = 'auto') {
    if (!['auto', 'up', 'down'].includes(round)) {
      throw new Error(
        'Argument round to Number.prototype.toDynamic must be "auto", "up", or "down"'
      );
    }

    const numStr = this.toString();
    const split = numStr.split('.');

    if (split.length === 1 && min === 0) return numStr;

    const decimals = split[1] || '';

    if (min <= decimals.length && decimals.length <= max) return numStr;

    if (decimals.length >= min) {
      let rightmostNonzeroIdx;
      const loopStartIdx = min === 0 ? min : min - 1

      for (let i = loopStartIdx; i < max; i++) {
        if (decimals[i] !== '0') rightmostNonzeroIdx = i;
      }

      const decider = parseInt(decimals[rightmostNonzeroIdx + 1]);

      if (round === 'down' || (round === 'auto' && decider < 5)) {
        return split[0]
          + '.'
          + decimals.substring(0, rightmostNonzeroIdx + 1);
      }

      if (round === 'up' || (round === 'auto' && decider >= 5)) {
        return split[0]
          + '.'
          + decimals.substring(0, rightmostNonzeroIdx)
          + (parseInt(decimals[rightmostNonzeroIdx]) + 1);
      }
    }

    return split[0] + '.' + padString(decimals, min, '0', 'right');
  }
})();
