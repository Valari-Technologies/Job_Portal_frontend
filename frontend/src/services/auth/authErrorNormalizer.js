// Future Django authentication:
// Normalize every rejected credential, account-state, and disallowed-role
// response to the public message "Invalid email or password."
// Do not expose account existence, role, status, or the incorrect field.

export function normalizeAuthError(error) {
  if (!error) {
    return { message: "Invalid email or password." };
  }

  // Handle network / connectivity failure
  if (
    error.code === 'ERR_NETWORK' || 
    error.message === 'Network Error' || 
    (typeof navigator !== 'undefined' && !navigator.onLine)
  ) {
    return { message: "Unable to connect. Check your connection and try again." };
  }

  const status = error.response?.status || error.status;

  // Handle rate limiting (HTTP 429)
  if (status === 429) {
    return { message: "Too many login attempts. Please try again later." };
  }

  // Handle server unavailable (HTTP 500, 502, 503, 504)
  if (status >= 500) {
    return { message: "Unable to sign in right now. Please try again later." };
  }

  // Default for all rejected credentials, unknown accounts, wrong passwords,
  // inactive/locked accounts, and disallowed portal roles (HTTP 400/401/403/404):
  return { message: "Invalid email or password." };
}
