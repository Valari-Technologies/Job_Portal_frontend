import { Navigate, Outlet } from 'react-router-dom';
import { getAuthItem } from '../../../services/auth/adminAuthService';

export default function AdminRouteGuard({ children }) {
  const adminToken = getAuthItem('admin_access_token');
  const adminUserStr = getAuthItem('admin_auth_user');
  let adminUser = null;
  if (adminUserStr) {
    try {
      adminUser = JSON.parse(adminUserStr);
    } catch {
      adminUser = null;
    }
  }

  const token = adminToken;
  const user = adminUser;
  const role = user?.role || getAuthItem('admin_auth_role');
  const status = user?.status || 'ACTIVE';

  if (!token || !user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN') || status !== 'ACTIVE') {
    // If Super Admin is logged in, redirect to Super Admin overview
    const saToken = getAuthItem('super_admin_access_token');
    const saRole = getAuthItem('super_admin_auth_role');
    if (saToken && saRole === 'SUPER_ADMIN') {
      return <Navigate to="/super-admin/overview" replace />;
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

  return children ? children : <Outlet />;
}
