export const tokenKey = "deepshield_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenKey);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(tokenKey, token);
  document.cookie = `${tokenKey}=${token}; path=/;`;
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(tokenKey);
  document.cookie = `${tokenKey}=; path=/; max-age=0`;
}
