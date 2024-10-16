(() => {
  /**
   * Checks a string to see if it ends with one of many substrings, short-circuiting
   * and returning `true` when a match is found, or `false` if no matches
   * @param { string[] } substrings An array of endings to check the string for
   * @returns { boolean }
   */
  String.prototype.endsWithOne = function(substrings) {
    for (const sub of substrings) {
      if (this.endsWith(sub)) return true;
    }

    return false;
  }
})();
