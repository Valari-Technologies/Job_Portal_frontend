import { Navigate } from 'react-router-dom';
import { getAuthItem } from '../../../services/auth/adminAuthService';

export default function SuperAdminRouteGuard({ children }) {
  const superAdminToken = getAuthItem('super_admin_access_token') || getAuthItem('admin_access_token');
  const superAdminUserStr = getAuthItem('super_admin_auth_user') || getAuthItem('admin_auth_user');
  let superAdminUser = null;
  if (superAdminUserStr) {
    try {
      superAdminUser = JSON.parse(superAdminUserStr);
    } catch {
      superAdminUser = null;
    }
  }

  const token = superAdminToken;
  const user = superAdminUser;
  const role = user?.role || getAuthItem('super_admin_auth_role');

  if (!token || !user || role !== 'SUPER_ADMIN') {
    // If standard Admin is logged in, redirect to Admin dashboard
    const adminToken = getAuthItem('admin_access_token');
    const adminRole = getAuthItem('admin_auth_role');
    if (adminToken && adminRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // If HR/Recruiter is logged in, redirect to Recruiter dashboard
    const hrToken = getAuthItem('public_access_token');
    const hrRole = getAuthItem('public_auth_role');
    if (hrToken && (hrRole === 'HR' || hrRole === 'RECRUITER')) {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    // If Candidate is logged in, redirect to Candidate dashboard
    const candToken = getAuthItem('candidate_access_token');
    const candRole = getAuthItem('candidate_auth_role');
    if (candToken && candRole === 'CANDIDATE') {
      return <Navigate to="/candidate/dashboard" replace />;
    }

    return <Navigate to="/admin" replace />;
  }

  return children;
}
