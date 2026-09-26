import { Navigate } from 'react-router-dom';

export default function SuperAdminRouteGuard({ children }) {
  const token = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('auth_user');
  let user;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }
  const role = user?.role || localStorage.getItem('auth_role');

  if (!token || !user) {
    return <Navigate to="/admin" replace />;
  }

  if (role !== 'SUPER_ADMIN') {
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'HR') return <Navigate to="/recruiter/dashboard" replace />;
    if (role === 'CANDIDATE') return <Navigate to="/candidate/dashboard" replace />;
    return <Navigate to="/admin" replace />;
  }

  return children;
}
