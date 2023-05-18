// Adapted from code by Chris Ferdinandi. Original copyright:
// (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com

/*!
 * Get an object value from a specific path
 * @param  {Object}       obj  The object
 * @param  {String|Array} path The path
 * @param  {*}            def  A default value to return [optional]
 * @return {*}                 The value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = function (obj: any, path: string | string[], def?: any) {
  /**
   * If the path is a string, convert it to an array
   * @param  {String|Array} path The path
   * @return {Array}             The path array
   */
  const stringToPath = function (path: string | string[]) {
    // If the path isn't a string, return it
    if (typeof path !== 'string') return path;

    // Create new array
    const output: string[] = [];

    // Split to an array with dot notation
    path.split('.').forEach(function (item) {
      // Split to an array with bracket notation
      item.split(/\[([^}]+)\]/g).forEach(function (key) {
        // Push to the new array
        if (key.length > 0) {
          output.push(key);
        }
      });
    });

    return output;
  };

  // Get the path as an array
  path = stringToPath(path);

  // Cache the current object
  let current = obj;

  // For each item in the path, dig into the object
  for (let i = 0; i < path.length; i++) {
    // If the item isn't found, return the default (or null)
    if (!current[path[i]]) return def;

    // Otherwise, update the current  value
    current = current[path[i]];
  }

  return current;
};
