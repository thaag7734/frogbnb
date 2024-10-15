/**
 * Pads a string until it matches the specified length
 * @param { string } str The string to be padded
 * @param { number } len The length to pad up to
 * @param { string } char The string to use as padding
 * @param { 'right' | 'left' } direction Which side of the string to add the padding to
 * @returns { string }
 */
export const padString = (str, len, char = '0', direction = 'right') => {
  if (direction === 'right') {
    while (str.length < len) str += char;

    return str;
  } else if (direction === 'left') {
    let padding = char;

    while (padding.length + str.length < len) padding += char;

    return padding + str;
  } else {
    throw new Error('Argument direction to padString must be either "left" or "right"');
  }
}
