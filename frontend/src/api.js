const TOKEN_KEY = "dazyhub_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || "请求失败");
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function sendCode(email) {
  return apiRequest("/api/auth/send-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function login(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchMe() {
  return apiRequest("/api/me");
}

export async function updateProfile(payload) {
  return apiRequest("/api/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateSettings(payload) {
  return apiRequest("/api/me/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getEmailConfig() {
  return apiRequest("/api/admin/email-config");
}

export async function updateEmailConfig(payload) {
  return apiRequest("/api/admin/email-config", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function uploadAvatar(file) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest("/api/me/avatar", {
    method: "POST",
    body,
  });
}

export async function fetchUsers(search = "") {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest(`/api/admin/users${params}`);
}

export async function updateUser(id, payload) {
  return apiRequest(`/api/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id) {
  return apiRequest(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}

export async function resetUserPassword(id) {
  return apiRequest(`/api/admin/users/${id}/reset-password`, {
    method: "POST",
  });
}
