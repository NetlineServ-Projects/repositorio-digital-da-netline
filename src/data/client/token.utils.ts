
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { ConfigValue } from '../../config';

export const AUTH_TOKEN_KEY = ConfigValue.AUTH_TOKEN_KEY;

type DecodedToken = {
  sub: string;
  exp: number;
  role: string;
  id: string;
};
export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const getUserId = () => {
  if (typeof window === "undefined") {
    return "";
  }
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (!token) {
    return "";
  }
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.sub;
  } catch (error) {
    return "";
  }
}

export function setAuthToken(token: string) {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 1 });
}

export function removeAuthToken() {
  Cookies.remove(AUTH_TOKEN_KEY);
}
export function checkHasAuthToken() {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (!token) return false;
  return true;
}