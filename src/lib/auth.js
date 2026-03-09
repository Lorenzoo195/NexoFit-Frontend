// Authentication utilities

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setAuthData(user, accessToken, refreshToken) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearAuthData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function getUserRole() {
  const user = getUser();
  return user?.role || null;
}

export function isClient() {
  return getUserRole() === "client";
}

export function isInstructor() {
  return getUserRole() === "instructor" || getUserRole() === "admin";
}

export function redirectIfNotAuthenticated(targetUrl = "/login") {
  if (typeof window === "undefined") return false;

  // Prevent redirect loops
  const isRedirecting = sessionStorage.getItem("isRedirecting");
  if (isRedirecting === "true") {
    sessionStorage.removeItem("isRedirecting");
    return false;
  }

  if (!isAuthenticated()) {
    sessionStorage.setItem("isRedirecting", "true");
    window.location.href = targetUrl;
    return true;
  }
  return false;
}

export function redirectIfAuthenticated(targetUrl = "/dashboard") {
  if (typeof window === "undefined") return false;

  // Prevent redirect loops
  const isRedirecting = sessionStorage.getItem("isRedirecting");
  if (isRedirecting === "true") {
    sessionStorage.removeItem("isRedirecting");
    return false;
  }

  if (isAuthenticated()) {
    sessionStorage.setItem("isRedirecting", "true");
    window.location.href = targetUrl;
    return true;
  }
  return false;
}
