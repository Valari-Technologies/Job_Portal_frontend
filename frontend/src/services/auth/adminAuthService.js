export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export function setAuthItem(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {}

  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Storage quota exceeded in setAuthItem, evicting temporary caches...", e);
    try {
      // Clear non-essential large keys to restore quota
      localStorage.removeItem('statejobz_candidate_resume_analyses');
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('tnjobz_candidate_avatar_') || k.includes('resume_analyses') || k.includes('_heavy_'))) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem(key, value);
    } catch (retryErr) {
      console.error("Failed to write auth storage item even after cache eviction", retryErr);
    }
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

function validateExpectedRole(userRole, expectedRole) {
  if (!expectedRole) return null;

  const exp = expectedRole.toUpperCase().trim();
  const isAdminRole = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  if (exp === 'CANDIDATE' && userRole !== 'CANDIDATE') {
    if (isAdminRole) {
      return "Access denied. Admin accounts must log in at /admin.";
    }
    return (userRole === 'HR' || userRole === 'RECRUITER')
      ? "This account is registered as an HR / Recruiter. Please switch to the 'HR / Recruiter' tab to login."
      : "Access denied. Candidate login only.";
  }

  if ((exp === 'HR' || exp === 'RECRUITER') && userRole !== 'HR' && userRole !== 'RECRUITER') {
    if (isAdminRole) {
      return "Access denied. Admin accounts must log in at /admin.";
    }
    return userRole === 'CANDIDATE'
      ? "This account is registered as a Candidate. Please switch to the 'Candidate' tab to login."
      : "Access denied. HR / Recruiter login only.";
  }

  if ((exp === 'ADMIN' || exp === 'SUPER_ADMIN' || exp === 'ADMIN_PORTAL') && !isAdminRole) {
    return "Access denied. Candidate and HR users must log in at /login.";
  }

  return null;
}

export async function loginAdmin({ email, password, expectedRole }) {
  try {
    const payload = {
      email: typeof email === 'string' ? email.trim() : '',
      password: password,
    };
    if (expectedRole) {
      payload.expected_role = expectedRole;
    }

    const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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

    // Client-side role mismatch safeguard before persisting any session tokens
    const roleError = validateExpectedRole(user.role, expectedRole);
    if (roleError) {
      return {
        success: false,
        message: roleError,
      };
    }

    if (user.role === 'SUPER_ADMIN') {
      setAuthItem('super_admin_access_token', access);
      setAuthItem('super_admin_refresh_token', refresh);
      setAuthItem('super_admin_auth_user', JSON.stringify(user));
      setAuthItem('super_admin_auth_role', user.role);
      setAuthItem('auth_user', JSON.stringify(user));
    } else if (user.role === 'ADMIN') {
      setAuthItem('admin_access_token', access);
      setAuthItem('admin_refresh_token', refresh);
      setAuthItem('admin_auth_user', JSON.stringify(user));
      setAuthItem('admin_auth_role', user.role);
      setAuthItem('auth_user', JSON.stringify(user));
    } else if (user.role === 'HR' || user.role === 'RECRUITER') {
      setAuthItem('public_access_token', access);
      setAuthItem('public_refresh_token', refresh);
      setAuthItem('public_auth_user', JSON.stringify(user));
      setAuthItem('public_auth_role', user.role);
      setAuthItem('auth_user', JSON.stringify(user));
    } else if (user.role === 'CANDIDATE') {
      setAuthItem('candidate_access_token', access);
      setAuthItem('candidate_refresh_token', refresh);
      setAuthItem('candidate_auth_user', JSON.stringify(user));
      setAuthItem('candidate_auth_role', user.role);
      setAuthItem('auth_user', JSON.stringify(user));
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

export async function loginWithGoogle({ token, expectedRole }) {
  try {
    const endpoint = `${API_BASE_URL}/accounts/google/`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s for Render cold start

    let response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data?.detail ||
        (Array.isArray(data?.token) ? data.token[0] : data?.token) ||
        'Google authentication failed. Please try again.';

      return {
        success: false,
        message: errorMessage,
      };
    }

    const { access, refresh, user } = data;

    if (!access || !user || !user.role) {
      return {
        success: false,
        message: 'Invalid response format received from Google auth.',
      };
    }

    const roleError = validateExpectedRole(user.role, expectedRole);
    if (roleError) {
      return {
        success: false,
        message: roleError,
      };
    }

    if (user.role === 'SUPER_ADMIN') {
      setAuthItem('super_admin_access_token', access);
      setAuthItem('super_admin_refresh_token', refresh);
      setAuthItem('super_admin_auth_user', JSON.stringify(user));
      setAuthItem('super_admin_auth_role', user.role);
      setAuthItem('auth_user', JSON.stringify(user));
    } else if (user.role === 'ADMIN') {
      setAuthItem('admin_access_token', access);
      setAuthItem('admin_refresh_token', refresh);
      setAuthItem('admin_auth_user', JSON.stringify(user));
      setAuthItem('admin_auth_role', user.role);
      setAuthItem('auth_user', JSON.stringify(user));
    } else if (user.role === 'HR' || user.role === 'RECRUITER') {
      setAuthItem('public_access_token', access);
      setAuthItem('public_refresh_token', refresh);
      setAuthItem('public_auth_user', JSON.stringify(user));
      setAuthItem('public_auth_role', user.role);
      setAuthItem('auth_user', JSON.stringify(user));
    } else if (user.role === 'CANDIDATE') {
      setAuthItem('candidate_access_token', access);
      setAuthItem('candidate_refresh_token', refresh);
      setAuthItem('candidate_auth_user', JSON.stringify(user));
      setAuthItem('candidate_auth_role', user.role);
      setAuthItem('auth_user', JSON.stringify(user));
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
      message: 'Unable to connect to backend server for Google login. Please ensure Django server is running.',
    };
  }
}

export function setAuthenticatedUser(user, role = null) {
  if (!user) return;
  const userRole = role || user.role || 'HR';
  const userStr = typeof user === 'string' ? user : JSON.stringify(user);
  if (userRole === 'SUPER_ADMIN') {
    setAuthItem('super_admin_auth_user', userStr);
  } else if (userRole === 'ADMIN') {
    setAuthItem('admin_auth_user', userStr);
  } else if (userRole === 'HR' || userRole === 'RECRUITER') {
    setAuthItem('public_auth_user', userStr);
  } else if (userRole === 'CANDIDATE') {
    setAuthItem('candidate_auth_user', userStr);
  }
  setAuthItem('auth_user', userStr);
}

export function clearRoleAuthTokens(role) {
  const normalized = (role || '').toUpperCase().trim();
  let keysToRemove = [];

  if (normalized === 'SUPER_ADMIN') {
    keysToRemove = [
      'super_admin_access_token',
      'super_admin_refresh_token',
      'super_admin_auth_user',
      'super_admin_auth_role',
      'auth_user',
    ];
  } else if (normalized === 'ADMIN') {
    keysToRemove = [
      'admin_access_token',
      'admin_refresh_token',
      'admin_auth_user',
      'admin_auth_role',
      'auth_user',
    ];
  } else if (normalized === 'HR' || normalized === 'RECRUITER') {
    keysToRemove = [
      'public_access_token',
      'public_refresh_token',
      'public_auth_user',
      'public_auth_role',
      'auth_user',
    ];
  } else if (normalized === 'CANDIDATE') {
    keysToRemove = [
      'candidate_access_token',
      'candidate_refresh_token',
      'candidate_auth_user',
      'candidate_auth_role',
      'auth_user',
    ];
  } else {
    clearAllAuthTokens();
    return;
  }

  keysToRemove.forEach((key) => removeAuthItem(key));
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
  clearRoleAuthTokens('SUPER_ADMIN');
  clearRoleAuthTokens('ADMIN');
}

export function logoutPublic(role = 'HR') {
  clearRoleAuthTokens(role);
}

export function getAuthenticatedUser() {
  try {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    if (pathname.startsWith('/super-admin')) {
      const stored = getAuthItem('super_admin_auth_user');
      if (stored) return typeof stored === 'string' ? JSON.parse(stored) : stored;
    } else if (pathname.startsWith('/admin')) {
      const stored = getAuthItem('admin_auth_user');
      if (stored) return typeof stored === 'string' ? JSON.parse(stored) : stored;
    } else if (pathname.startsWith('/recruiter') || pathname.startsWith('/employer')) {
      const stored = getAuthItem('public_auth_user');
      if (stored) return typeof stored === 'string' ? JSON.parse(stored) : stored;
    } else if (pathname.startsWith('/candidate')) {
      const stored = getAuthItem('candidate_auth_user');
      if (stored) return typeof stored === 'string' ? JSON.parse(stored) : stored;
    }

    const fallback = getAuthItem('public_auth_user') || getAuthItem('candidate_auth_user') || getAuthItem('admin_auth_user') || getAuthItem('super_admin_auth_user') || getAuthItem('auth_user');
    return fallback ? (typeof fallback === 'string' ? JSON.parse(fallback) : fallback) : null;
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
  } else if (pathname.startsWith('/recruiter') || pathname.startsWith('/employer')) {
    return getAuthItem('public_auth_role') || 'HR';
  } else if (pathname.startsWith('/candidate')) {
    return getAuthItem('candidate_auth_role') || 'CANDIDATE';
  }
  return getAuthItem('public_auth_role') || getAuthItem('candidate_auth_role');
}

export async function fetchWithAuth(url, options = {}) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  let tokenKey = 'public_access_token';
  let refreshKey = 'public_refresh_token';

  if (pathname.startsWith('/super-admin') || pathname.startsWith('/super_admin')) {
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

  // Fallback to super_admin or admin tokens if calling admin API
  if (!token && (url.includes('/accounts/admin/') || pathname.includes('admin'))) {
    token = getAuthItem('super_admin_access_token') || getAuthItem('admin_access_token');
    refreshToken = getAuthItem('super_admin_refresh_token') || getAuthItem('admin_refresh_token');
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
