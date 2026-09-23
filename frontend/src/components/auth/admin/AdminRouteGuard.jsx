import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRouteGuard({ children }) {
  const token = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('auth_user');
  let user;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }
  const role = user?.role || localStorage.getItem('auth_role');
  const status = user?.status || 'ACTIVE';

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  if (role === 'HR') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  if (role === 'CANDIDATE') {
    return <Navigate to="/candidate/dashboard" replace />;
  }

  if (role !== 'ADMIN' || status !== 'ACTIVE') {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
