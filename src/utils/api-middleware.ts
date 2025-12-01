/**
 * API Middleware - Automatically adds authentication token to all requests
 */

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Fetch wrapper that automatically adds authentication token
 * @param url - API endpoint URL
 * @param options - Fetch options (method, headers, body, etc.)
 * @param requiresAuth - Whether this request requires authentication (default: true)
 * @returns Promise<Response>
 */
export const apiFetch = async (
  url: string,
  options: FetchOptions = {},
  requiresAuth: boolean = true
): Promise<Response> => {
  const { headers = {}, requiresAuth: optRequiresAuth, ...restOptions } = options;
  
  // Determine if auth is required
  const needsAuth = optRequiresAuth !== undefined ? optRequiresAuth : requiresAuth;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Prepare headers
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization token if required and available
  if (needsAuth && token) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge user-provided headers with defaults
  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };
  
  // Make the fetch request
  const response = await fetch(url, {
    ...restOptions,
    headers: mergedHeaders,
  });
  
  return response;
};

/**
 * Convenience wrapper for GET requests
 */
export const apiGet = async (url: string, requiresAuth: boolean = true): Promise<Response> => {
  return apiFetch(url, { method: 'GET' }, requiresAuth);
};

/**
 * Convenience wrapper for POST requests
 */
export const apiPost = async (
  url: string,
  data?: any,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiFetch(
    url,
    {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    },
    requiresAuth
  );
};

/**
 * Convenience wrapper for PUT requests
 */
export const apiPut = async (
  url: string,
  data?: any,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiFetch(
    url,
    {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    },
    requiresAuth
  );
};

/**
 * Convenience wrapper for DELETE requests
 */
export const apiDelete = async (url: string, requiresAuth: boolean = true): Promise<Response> => {
  return apiFetch(url, { method: 'DELETE' }, requiresAuth);
};

/**
 * Convenience wrapper for PATCH requests
 */
export const apiPatch = async (
  url: string,
  data?: any,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiFetch(
    url,
    {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    },
    requiresAuth
  );
};

/**
 * Convenience wrapper for file upload requests (multipart/form-data)
 */
export const apiPostFile = async (
  url: string,
  formData: FormData,
  requiresAuth: boolean = true
): Promise<Response> => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {};
  
  // Add authorization token if required and available
  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData - browser will set it with boundary
  return fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
};

