const API_BASE_URL = 'http://127.0.0.1:8000';

export async function loginAdmin({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: typeof email === 'string' ? email.trim() : '',
        password: password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data?.detail ||
        data?.non_field_errors?.[0] ||
        (Array.isArray(data?.email) ? data.email[0] : data?.email) ||
        (Array.isArray(data?.password) ? data.password[0] : data?.password) ||
        'Invalid email or password.';

      return {
        success: false,
        message: errorMessage,
      };
    }

    const { access, refresh, user } = data;

    if (!access || !user || !user.role) {
      return {
        success: false,
        message: 'Invalid response format received from server.',
      };
    }

    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      localStorage.setItem('admin_access_token', access);
      localStorage.setItem('admin_refresh_token', refresh);
      localStorage.setItem('admin_auth_user', JSON.stringify(user));
      localStorage.setItem('admin_auth_role', user.role);
    } else {
      localStorage.setItem('public_access_token', access);
      localStorage.setItem('public_refresh_token', refresh);
      localStorage.setItem('public_auth_user', JSON.stringify(user));
      localStorage.setItem('public_auth_role', user.role);
    }

    // Default fallback keys
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_role', user.role);

    return {
      success: true,
      user,
      role: user.role,
      access,
      refresh,
    };
  } catch {
    return {
      success: false,
      message: 'Unable to connect to backend server. Please ensure Django server is running.',
    };
  }
}

export function clearAllAuthTokens() {
  const keysToRemove = [
    'admin_access_token',
    'admin_refresh_token',
    'admin_auth_user',
    'admin_auth_role',
    'public_access_token',
    'public_refresh_token',
    'public_auth_user',
    'public_auth_role',
    'access_token',
    'refresh_token',
    'auth_user',
    'auth_role',
    'recruiter_token',
    'recruiter_user',
    'candidate_token',
    'candidate_user',
  ];
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  sessionStorage.clear();
}

export function logoutAdmin() {
  clearAllAuthTokens();
}

export function logoutPublic() {
  clearAllAuthTokens();
}

export function getAuthenticatedUser() {
  try {
    const isAdminPath = typeof window !== 'undefined' && (window.location.pathname.startsWith('/super-admin') || window.location.pathname.startsWith('/admin'));
    if (isAdminPath) {
      const adminStored = localStorage.getItem('admin_auth_user');
      if (adminStored) return JSON.parse(adminStored);
    } else {
      const publicStored = localStorage.getItem('public_auth_user');
      if (publicStored) return JSON.parse(publicStored);
    }
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getAuthenticatedRole() {
  const user = getAuthenticatedUser();
  if (user?.role) return user.role;
  const isAdminPath = typeof window !== 'undefined' && (window.location.pathname.startsWith('/super-admin') || window.location.pathname.startsWith('/admin'));
  if (isAdminPath) {
    return localStorage.getItem('admin_auth_role') || localStorage.getItem('auth_role');
  }
  return localStorage.getItem('public_auth_role') || localStorage.getItem('auth_role');
}

export async function fetchWithAuth(url, options = {}) {
  const isAdminPath = typeof window !== 'undefined' && (window.location.pathname.startsWith('/super-admin') || window.location.pathname.startsWith('/admin'));

  let token = null;
  let refreshToken = null;
  if (isAdminPath) {
    token = localStorage.getItem('admin_access_token') || localStorage.getItem('access_token');
    refreshToken = localStorage.getItem('admin_refresh_token') || localStorage.getItem('refresh_token');
  } else {
    token = localStorage.getItem('public_access_token') || localStorage.getItem('access_token') || localStorage.getItem('admin_access_token');
    refreshToken = localStorage.getItem('public_refresh_token') || localStorage.getItem('refresh_token') || localStorage.getItem('admin_refresh_token');
  }

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (isAdminPath) {
          localStorage.setItem('admin_access_token', refreshData.access);
        } else {
          localStorage.setItem('public_access_token', refreshData.access);
        }
        localStorage.setItem('access_token', refreshData.access);
        headers['Authorization'] = `Bearer ${refreshData.access}`;
        response = await fetch(url, { ...options, headers });
      }
    } catch {
      // Do not clear tokens or force redirect here; return response for caller handling
    }
  }

  return response;
}
