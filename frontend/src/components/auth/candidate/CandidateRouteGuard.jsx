import { Navigate, Outlet } from 'react-router-dom';

export default function CandidateRouteGuard({ children }) {
  const publicToken = localStorage.getItem('public_access_token');
  const token = publicToken || localStorage.getItem('access_token');
  
  const publicUserStr = localStorage.getItem('public_auth_user');
  const userStr = publicUserStr || localStorage.getItem('auth_user');
  
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }

  const role = user?.role || localStorage.getItem('public_auth_role') || localStorage.getItem('auth_role');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'CANDIDATE') {
    if (role === 'SUPER_ADMIN') return <Navigate to="/super-admin/overview" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'HR' || role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
