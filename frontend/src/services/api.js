/**
 * CrimeLens Centralized API Service Client
 * Connects frontend views to the CrimeLens Intelligence Backend with graceful offline fallbacks.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('crimelens_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Return null or throw depending on caller handling
    console.warn(`[CrimeLens API Service] Backend request to ${endpoint} unavailable or failed:`, err.message);
    return null;
  }
}

export const api = {
  // Health
  checkHealth: async () => {
    return await request('/health');
  },

  // Auth APIs
  auth: {
    login: async (id, password) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ id, password })
      });
      if (res && res.token) {
        localStorage.setItem('crimelens_token', res.token);
        localStorage.setItem('crimelens_user', JSON.stringify(res.user));
      }
      return res;
    },
    register: async (id, name, password) => {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ id, name, password })
      });
      if (res && res.token) {
        localStorage.setItem('crimelens_token', res.token);
        localStorage.setItem('crimelens_user', JSON.stringify(res.user));
      }
      return res;
    },
    getCurrentUser: () => {
      try {
        const stored = localStorage.getItem('crimelens_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    },
    logout: () => {
      localStorage.removeItem('crimelens_token');
      localStorage.removeItem('crimelens_user');
    }
  },

  // Dashboard APIs
  dashboard: {
    getOverview: async () => {
      return await request('/dashboard/overview');
    },
    dispatchQuery: async (queryData) => {
      return await request('/dashboard/query', {
        method: 'POST',
        body: JSON.stringify(queryData)
      });
    }
  },

  // Entities APIs
  entities: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/entities${query ? `?${query}` : ''}`);
    },
    getById: async (id) => {
      return await request(`/entities/${id}`);
    }
  },

  // Network APIs
  network: {
    getClusters: async () => {
      return await request('/network/clusters');
    },
    getClusterById: async (clusterId) => {
      return await request(`/network/${clusterId}`);
    }
  },

  // Timeline APIs
  timeline: {
    getEvents: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/timeline${query ? `?${query}` : ''}`);
    }
  },

  // Cases APIs
  cases: {
    getAll: async () => {
      return await request('/cases');
    },
    create: async (caseData) => {
      return await request('/cases', {
        method: 'POST',
        body: JSON.stringify(caseData)
      });
    }
  },

  // AI Copilot Query API
  chat: {
    sendQuery: async (message, history = []) => {
      return await request('/chat/query', {
        method: 'POST',
        body: JSON.stringify({ message, history })
      });
    }
  },

  // Settings APIs
  settings: {
    get: async () => {
      return await request('/settings');
    },
    update: async (settingsData) => {
      return await request('/settings', {
        method: 'POST',
        body: JSON.stringify(settingsData)
      });
    }
  }
};

export default api;
