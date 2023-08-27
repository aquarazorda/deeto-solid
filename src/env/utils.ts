export function setCookie(name: string, value?: string, expirationDate?: Date) {
  const cookieValue = value
    ? `${name}=${value}; path=/;`
    : `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
  document.cookie = cookieValue;
  return value;
}
