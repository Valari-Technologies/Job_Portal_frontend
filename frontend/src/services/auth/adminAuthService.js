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

export function logoutAdmin() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_role');
  sessionStorage.clear();
}

export function getAuthenticatedUser() {
  try {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getAuthenticatedRole() {
  const user = getAuthenticatedUser();
  return user?.role || localStorage.getItem('auth_role') || null;
}

export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('access_token');
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('access_token', refreshData.access);
          headers['Authorization'] = `Bearer ${refreshData.access}`;
          response = await fetch(url, { ...options, headers });
        } else {
          logoutAdmin();
          window.location.href = '/login';
        }
      } catch {
        logoutAdmin();
        window.location.href = '/login';
      }
    } else {
      logoutAdmin();
      window.location.href = '/login';
    }
  }

  return response;
}
