import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPortalLoginForm from '../../components/auth/admin/AdminPortalLoginForm';
import saBg from '../../assets/login/SA-BG.png';

export default function AdminPortalLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('auth_user');
    let user;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {
      user = null;
    }
    const role = user?.role || localStorage.getItem('auth_role');

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
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl z-0" 
      />
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl z-0" 
      />

      {/* Centered Login Card Container */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <AdminPortalLoginForm />
      </div>
    </main>
  );
}
