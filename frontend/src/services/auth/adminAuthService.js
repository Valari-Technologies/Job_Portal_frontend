const API_BASE_URL = 'http://127.0.0.1:8000';

export function setAuthItem(key, value) {
  try {
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  } catch (e) {
    console.error("Failed to write auth storage item", e);
  }
}

export function getAuthItem(key) {
  try {
    const sessionVal = sessionStorage.getItem(key);
    if (sessionVal !== null && sessionVal !== undefined) {
      return sessionVal;
    }
    const localVal = localStorage.getItem(key);
    if (localVal !== null && localVal !== undefined) {
      try { sessionStorage.setItem(key, localVal); } catch {}
      return localVal;
    }
    return null;
  } catch {
    return null;
  }
}

export function removeAuthItem(key) {
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export async function registerCandidate({ fullName, mobileNumber, email, password, confirmPassword }) {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/register/candidate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: typeof fullName === 'string' ? fullName.trim() : '',
        phoneNumber: typeof mobileNumber === 'string' ? mobileNumber.trim() : '',
        mobileNumber: typeof mobileNumber === 'string' ? mobileNumber.trim() : '',
        email: typeof email === 'string' ? email.trim() : '',
        password: password,
        confirmPassword: confirmPassword || password,
        agreeToTerms: true,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data?.detail ||
        data?.fullName?.[0] ||
        data?.email?.[0] ||
        data?.phoneNumber?.[0] ||
        data?.mobileNumber?.[0] ||
        data?.password?.[0] ||
        data?.non_field_errors?.[0] ||
        'Candidate account creation failed.';

      return {
        success: false,
        message: errorMessage,
        errors: data,
      };
    }

    return {
      success: true,
      message: data.message || 'Account created successfully.',
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Unable to connect to backend server. Please check your connection.',
    };
  }
}

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

    if (user.role === 'SUPER_ADMIN') {
      setAuthItem('super_admin_access_token', access);
      setAuthItem('super_admin_refresh_token', refresh);
      setAuthItem('super_admin_auth_user', JSON.stringify(user));
      setAuthItem('super_admin_auth_role', user.role);
    } else if (user.role === 'ADMIN') {
      setAuthItem('admin_access_token', access);
      setAuthItem('admin_refresh_token', refresh);
      setAuthItem('admin_auth_user', JSON.stringify(user));
      setAuthItem('admin_auth_role', user.role);
    } else if (user.role === 'HR' || user.role === 'RECRUITER') {
      setAuthItem('public_access_token', access);
      setAuthItem('public_refresh_token', refresh);
      setAuthItem('public_auth_user', JSON.stringify(user));
      setAuthItem('public_auth_role', user.role);
    } else if (user.role === 'CANDIDATE') {
      setAuthItem('candidate_access_token', access);
      setAuthItem('candidate_refresh_token', refresh);
      setAuthItem('candidate_auth_user', JSON.stringify(user));
      setAuthItem('candidate_auth_role', user.role);
    }

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
    'super_admin_access_token',
    'super_admin_refresh_token',
    'super_admin_auth_user',
    'super_admin_auth_role',
    'admin_access_token',
    'admin_refresh_token',
    'admin_auth_user',
    'admin_auth_role',
    'public_access_token',
    'public_refresh_token',
    'public_auth_user',
    'public_auth_role',
    'candidate_access_token',
    'candidate_refresh_token',
    'candidate_auth_user',
    'candidate_auth_role',
    'access_token',
    'refresh_token',
    'auth_user',
    'auth_role',
  ];
  keysToRemove.forEach((key) => removeAuthItem(key));
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
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    if (pathname.startsWith('/super-admin')) {
      const stored = getAuthItem('super_admin_auth_user');
      if (stored) return JSON.parse(stored);
    } else if (pathname.startsWith('/admin')) {
      const stored = getAuthItem('admin_auth_user');
      if (stored) return JSON.parse(stored);
    } else if (pathname.startsWith('/recruiter') || pathname.startsWith('/employer')) {
      const stored = getAuthItem('public_auth_user');
      if (stored) return JSON.parse(stored);
    } else if (pathname.startsWith('/candidate')) {
      const stored = getAuthItem('candidate_auth_user') || getAuthItem('public_auth_user');
      if (stored) return JSON.parse(stored);
    }

    const fallback = getAuthItem('admin_auth_user') || getAuthItem('super_admin_auth_user') || getAuthItem('public_auth_user') || getAuthItem('candidate_auth_user');
    return fallback ? JSON.parse(fallback) : null;
  } catch {
    return null;
  }
}

export function getAuthenticatedRole() {
  const user = getAuthenticatedUser();
  if (user?.role) return user.role;
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  if (pathname.startsWith('/super-admin')) {
    return getAuthItem('super_admin_auth_role') || 'SUPER_ADMIN';
  } else if (pathname.startsWith('/admin')) {
    return getAuthItem('admin_auth_role') || 'ADMIN';
  }
  return getAuthItem('public_auth_role') || getAuthItem('candidate_auth_role');
}

export async function fetchWithAuth(url, options = {}) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  let tokenKey = 'admin_access_token';
  let refreshKey = 'admin_refresh_token';

  if (pathname.startsWith('/super-admin')) {
    tokenKey = 'super_admin_access_token';
    refreshKey = 'super_admin_refresh_token';
  } else if (pathname.startsWith('/admin')) {
    tokenKey = 'admin_access_token';
    refreshKey = 'admin_refresh_token';
  } else if (pathname.startsWith('/recruiter') || pathname.startsWith('/employer')) {
    tokenKey = 'public_access_token';
    refreshKey = 'public_refresh_token';
  } else if (pathname.startsWith('/candidate')) {
    tokenKey = 'candidate_access_token';
    refreshKey = 'candidate_refresh_token';
  }

  let token = getAuthItem(tokenKey);
  let refreshToken = getAuthItem(refreshKey);

  // Fallback for paths if role-specific key is not set
  if (!token) {
    if (pathname.startsWith('/super-admin')) {
      token = getAuthItem('super_admin_access_token') || getAuthItem('admin_access_token');
      refreshToken = getAuthItem('super_admin_refresh_token') || getAuthItem('admin_refresh_token');
    } else if (pathname.startsWith('/admin')) {
      token = getAuthItem('admin_access_token');
      refreshToken = getAuthItem('admin_refresh_token');
    } else {
      token = getAuthItem('public_access_token') || getAuthItem('candidate_access_token');
      refreshToken = getAuthItem('public_refresh_token') || getAuthItem('candidate_refresh_token');
    }
  }

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

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
        setAuthItem(tokenKey, refreshData.access);
        headers['Authorization'] = `Bearer ${refreshData.access}`;
        response = await fetch(url, { ...options, headers });
      }
    } catch {
      // Do not clear tokens or force redirect here; return response for caller handling
    }
  }

  return response;
}

export const authenticatedFetch = fetchWithAuth;
