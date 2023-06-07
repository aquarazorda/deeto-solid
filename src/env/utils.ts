export function setCookie(name: string, value?: string, expirationDate?: Date) {
  const cookieValue = value
    ? `${name}=${value}; expires=${expirationDate?.toUTCString() || ""}; path=/`
    : "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
  document.cookie = cookieValue;
  return value;
}
