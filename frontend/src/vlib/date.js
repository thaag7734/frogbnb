(() => {
  const months = [
    { long: 'January', short: 'Jan' },
    { long: 'February', short: 'Feb' },
    { long: 'March', short: 'Mar' },
    { long: 'April', short: 'Apr' },
    { long: 'May', short: 'May' },
    { long: 'June', short: 'Jun' },
    { long: 'July', short: 'Jul' },
    { long: 'August', short: 'Aug' },
    { long: 'September', short: 'Sep' },
    { long: 'October', short: 'Oct' },
    { long: 'November', short: 'Nov' },
    { long: 'December', short: 'Dec' },
  ];

  /**
   * Returns a string containing the full name of the month represented by this Date
   * @returns { string }
   */
  Date.prototype.getMonthString = function() {
    return months[this.getMonth()].long;
  };

  /**
   * Returns a string containing the short name of the month represented by this Date
   * @returns { string }
   */
  Date.prototype.getShortMonthString = function() {
    return months[this.getMonth()].short;
  };
})();
