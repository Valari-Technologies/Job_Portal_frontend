import { normalizeAuthError } from './authErrorNormalizer';

// Future Django Admin authentication:
// Normalize every rejected credential, account-state, and disallowed-role
// response to the public message "Invalid email or password."
// Do not expose account existence, role, status, or the incorrect field.
// SUPER_ADMIN -> /super-admin/overview
// ADMIN -> /admin/dashboard
// Candidate and Employer accounts must continue using /login.

export async function loginAdmin({ email, password }) {
  // Do not include sensitive authentication details in console logs
  console.log("Admin authentication request received for:", email, password ? "[Password provided]" : "[No password]");
  
  // Future API POST /api/v1/auth/admin/login/
  // When backend integration is enabled:
  // 1. Submit email and password securely over HTTPS.
  // 2. Read the verified role from response (SUPER_ADMIN or ADMIN).
  // 3. Reject Candidate / Employer accounts or disallowed roles with the generic message:
  //    "Invalid email or password."
  // 4. Redirect SUPER_ADMIN -> /super-admin/overview and ADMIN -> /admin/dashboard.

  return {
    success: false,
    ...normalizeAuthError({ status: 401 })
  };
}
