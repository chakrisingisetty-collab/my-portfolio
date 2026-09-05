import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Menu, Plus, ExternalLink, ShieldCheck } from 'lucide-react';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname === '/admin') return 'Dashboard Overview';
    if (pathname.startsWith('/admin/projects/new')) return 'Create New Project';
    if (pathname.includes('/edit')) return 'Edit Project';
    if (pathname.startsWith('/admin/projects')) return 'Manage Projects';
    if (pathname.startsWith('/admin/experience')) return 'Work Experience';
    if (pathname.startsWith('/admin/education')) return 'Education';
    if (pathname.startsWith('/admin/skills')) return 'Skills & Tech Stack';
    if (pathname.startsWith('/admin/certifications')) return 'Certifications';
    if (pathname.startsWith('/admin/media')) return 'Media Asset Library';
    if (pathname.startsWith('/admin/messages')) return 'Contact Inquiries';
    if (pathname.startsWith('/admin/settings')) return 'Site & Profile Settings';
    return 'Admin CMS';
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-200">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#0d0e12]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 border border-white/10"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/projects/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Live Site</span>
            </a>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
