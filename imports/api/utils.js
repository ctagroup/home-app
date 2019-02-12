export function fullName(user) {
  if (!user) {
    return undefined;
  }
  const parts = [];
  if (user.firstName) {
    parts.push(user.firstName);
  }
  if (user.middleName) {
    parts.push(user.middleName);
  }
  if (user.lastName) {
    parts.push(user.lastName);
  }
  return parts.join(' ').trim();
}

export function getSchemaFromLink(link, defaultValue = '') {
  try {
    const regex = /\/(v\d{4})\//g;
    return regex.exec(link)[1];
  } catch (e) {
    return defaultValue;
  }
}

export function getClientSchemaFromLinks(links, defaultValue = '') {
  try {
    const link = links[0];
    const regex = /\/(v\d{4})\//g;
    let match;
    switch (link.rel) {
      case 'client':
        match = regex.exec(link.href);
        return match[1];
      default:
        return defaultValue;
    }
  } catch (e) {
    return defaultValue;
  }
}

export function escapeKeys(obj) {
  const newObj = {};
  _.each(obj, (value, key) => {
    const key2 = key.replace(/\./g, '::');
    newObj[key2] = value;
  });
  return newObj;
}

export function unescapeKeys(obj) {
  const newObj = {};
  _.each(obj, (value, key) => {
    const key2 = key.replace(/::/g, '.');
    newObj[key2] = value;
  });
  return newObj;
}

export function trimText(str = '', maxLen = 50) {
  if (str.length > maxLen) {
    return `${str.substring(0, maxLen - 3)}...`;
  }
  return str;
}

export function stringContains(str, query = '') {
  if (!str) return false;
  const strLower = str.toLowerCase();
  const queryLower = query.toLowerCase();
  return strLower.indexOf(queryLower) !== -1;
}


// Remove undef., null and empty string.
// Via: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
// extended with empty string comparasion
export const removeEmpty = (obj) =>
Object.keys(obj)
.filter(k => obj[k] !== null && obj[k] !== undefined && obj[k] !== '')
.reduce((newObj, k) => (
  typeof obj[k] === 'object' ?
    Object.assign(newObj, { [k]: removeEmpty(obj[k]) }) :  // Recurse.
    Object.assign(newObj, { [k]: obj[k] })),  // Copy value.
  {});

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
