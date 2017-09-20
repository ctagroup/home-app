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
