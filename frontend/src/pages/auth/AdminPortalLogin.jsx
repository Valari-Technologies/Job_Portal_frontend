import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPortalLoginForm from '../../components/auth/admin/AdminPortalLoginForm';
import saBg from '../../assets/login/SA-BG.png';

export default function AdminPortalLogin() {
  const navigate = useNavigate();

  useEffect(() => {
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

    if (token && user) {
      if (role === 'SUPER_ADMIN') {
        navigate('/super-admin/overview', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  return (
    <main className="min-h-screen w-full bg-[#F4F7FE] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden font-sans select-none">
      {/* Super Admin Background Artwork Image (SA-BG.png) */}
      <img
        src={saBg}
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 opacity-95"
      />

      {/* Decorative Corner Ambient Glow */}
      <div 
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <div 
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-md">
        <AdminPortalLoginForm />
      </div>
    </main>
  );
}
