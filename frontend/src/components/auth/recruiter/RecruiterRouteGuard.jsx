import { Navigate, Outlet } from 'react-router-dom';

export default function RecruiterRouteGuard({ children }) {
  const publicToken = localStorage.getItem('public_access_token') || localStorage.getItem('access_token');
  const publicUserStr = localStorage.getItem('public_auth_user') || localStorage.getItem('auth_user');
  let publicUser = null;
  if (publicUserStr) {
    try {
      publicUser = JSON.parse(publicUserStr);
    } catch {
      publicUser = null;
    }
  }

  const token = publicToken;
  const user = publicUser;
  const role = user?.role || localStorage.getItem('public_auth_role') || localStorage.getItem('auth_role');

  if (!token || !user || (role !== 'HR' && role !== 'RECRUITER')) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
