export function deleteCookie(cookieName : string) {
    document.cookie = cookieName + "=; Max-Age=-1; path=/; SameSite=Strict";
  }