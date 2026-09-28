import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRouteGuard({ children }) {
  const adminToken = localStorage.getItem('admin_access_token');
  const adminUserStr = localStorage.getItem('admin_auth_user');
  let adminUser = null;
  if (adminUserStr) {
    try {
      adminUser = JSON.parse(adminUserStr);
    } catch {
      adminUser = null;
    }
  }

  const token = adminToken || localStorage.getItem('access_token');
  let user = adminUser;
  if (!user) {
    const userStr = localStorage.getItem('auth_user');
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {
      user = null;
    }
  }

  const role = user?.role || localStorage.getItem('admin_auth_role') || localStorage.getItem('auth_role');
  const status = user?.status || 'ACTIVE';

  if (!token || !user) {
    return <Navigate to="/admin" replace />;
  }

  if (role === 'SUPER_ADMIN') {
    return <Navigate to="/super-admin/overview" replace />;
  }

  if (role === 'HR') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  if (role === 'CANDIDATE') {
    return <Navigate to="/candidate/dashboard" replace />;
  }

  if (role !== 'ADMIN' || status !== 'ACTIVE') {
    return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}
