const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper for API calls
 * @param {string} endpoint - API endpoint (e.g., '/api/leads')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} - Parsed JSON response
 */
export async function apiFetch(endpoint, options = {}) {
  const { body, ...customConfig } = options;
  const headers = { 'Content-Type': 'application/json', ...customConfig.headers };

  // Set up auth token if available (prepared for authentication phase)
  // const token = localStorage.getItem('token');
  // if (token) {
  //   headers.Authorization = `Bearer ${token}`;
  // }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'API request failed');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Lead API methods
 */
export const leadApi = {
  discover: (data) => apiFetch('/api/leads/discover', { body: data }),
  save: (data) => apiFetch('/api/leads/save', { body: data }),
  getAll: () => apiFetch('/api/leads'),
  update: (id, data) => apiFetch(`/api/leads/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiFetch(`/api/leads/${id}`, { method: 'DELETE' }),
  analyze: (id) => apiFetch(`/api/leads/${id}/analyze`, { method: 'POST' }),
  getFilters: () => apiFetch('/api/leads/filters'),
};

export const listApi = {
  getAll: () => apiFetch('/api/lists'),
  getOptions: () => apiFetch('/api/lists/options'),
  create: (data) => apiFetch('/api/lists', { method: 'POST', body: data }),
  update: (id, data) => apiFetch(`/api/lists/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiFetch(`/api/lists/${id}`, { method: 'DELETE' }),
  getOne: (id) => apiFetch(`/api/lists/${id}`),
};

export default apiFetch;
