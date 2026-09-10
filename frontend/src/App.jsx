import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages (Eagerly load HomePage for instantaneous first contentful paint)
import { HomePage } from './pages/HomePage';

// Code-split pages (dynamically loaded on demand)
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage').then(m => ({ default: m.CaseStudyPage })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects').then(m => ({ default: m.AdminProjects })));
const AdminProjectEdit = lazy(() => import('./pages/admin/AdminProjectEdit').then(m => ({ default: m.AdminProjectEdit })));
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience').then(m => ({ default: m.AdminExperience })));
const AdminEducation = lazy(() => import('./pages/admin/AdminEducation').then(m => ({ default: m.AdminEducation })));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills').then(m => ({ default: m.AdminSkills })));
const AdminCertifications = lazy(() => import('./pages/admin/AdminCertifications').then(m => ({ default: m.AdminCertifications })));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia').then(m => ({ default: m.AdminMedia })));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages').then(m => ({ default: m.AdminMessages })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const RouteLoadingFallback = () => (
  <div className="min-h-screen bg-[#090a0d] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              {/* Public Portfolio Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:slug" element={<CaseStudyPage />} />

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin CMS Dashboard Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/new" element={<AdminProjectEdit />} />
                <Route path="projects/:id/edit" element={<AdminProjectEdit />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="certifications" element={<AdminCertifications />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
