const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const TOKEN_KEY = "stylesense_token";
const USER_KEY = "stylesense_user";
const LOCAL_RECOMMENDATIONS_KEY = "stylesense_recommendations";
const PENDING_RECOMMENDATION_KEY = "stylesense_pending_recommendation";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(authResponse) {
  localStorage.setItem(TOKEN_KEY, authResponse.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      email: authResponse.email,
      firstName: authResponse.firstName,
      role: authResponse.role,
    })
  );
  window.dispatchEvent(new Event("stylesense-auth-change"));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("stylesense-auth-change"));
}

function getUserRecommendationKey() {
  const user = getStoredUser();
  const userKey = user?.email || user?.firstName || "";
  return userKey ? `${LOCAL_RECOMMENDATIONS_KEY}:${userKey.toLowerCase()}` : null;
}

export function getLocalRecommendations() {
  const key = getUserRecommendationKey();
  if (!key) {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

export function saveLocalRecommendation(recommendation, context = {}) {
  if (!recommendation) {
    return;
  }

  const key = getUserRecommendationKey();
  if (!key) {
    return;
  }

  const savedAt = new Date().toISOString();
  const saved = {
    ...recommendation,
    localId: `local-${savedAt}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt,
    createdAt: recommendation.createdAt || savedAt,
    context,
  };
  const existing = getLocalRecommendations();
  const next = [saved, ...existing].slice(0, 20);

  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event("stylesense-recommendations-change"));
}

export function savePendingRecommendation(recommendation, context = {}) {
  if (!recommendation) return;
  sessionStorage.setItem(
    PENDING_RECOMMENDATION_KEY,
    JSON.stringify({ recommendation, context, savedAt: new Date().toISOString() })
  );
}

export function getPendingRecommendation() {
  try {
    const raw = sessionStorage.getItem(PENDING_RECOMMENDATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    sessionStorage.removeItem(PENDING_RECOMMENDATION_KEY);
    return null;
  }
}

export function clearPendingRecommendation() {
  sessionStorage.removeItem(PENDING_RECOMMENDATION_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getProducts: () => request("/api/products/public/all"),

  searchProducts: (query) =>
    request(`/api/products/public/search?q=${encodeURIComponent(query)}`),

  generateRecommendation: (payload) =>
    request("/api/recommendations/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getRecommendationHistory: () => request("/api/recommendations/history"),

  uploadOutfit: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/api/recommendations/upload-outfit", {
      method: "POST",
      body: formData,
    });
  },

  createOrder: (payload) =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyOrders: () => request("/api/orders/my"),
};
