import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
});

// Interceptor to add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor to catch 401 Unauthorized and clear token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('portfolio_access_token');
        localStorage.removeItem('portfolio_refresh_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const portfolioApi = {
  // Public APIs
  getProfile: () => api.get('/profile/'),
  getSkills: () => api.get('/skills/'),
  getProjects: (params = {}) => api.get('/projects/', { params }),
  getProjectDetail: (slug) => api.get(`/projects/${slug}/`),
  getExperience: () => api.get('/experience/'),
  getEducation: () => api.get('/education/'),
  getCertifications: () => api.get('/certifications/'),
  sendContactMessage: (data) => api.post('/contact/', data),

  // Auth APIs
  login: (username, password) => api.post('/auth/token/', { username, password }),
  getMe: () => api.get('/auth/me/'),

  // Admin Overview
  getAdminStats: () => api.get('/admin/stats/'),
  getAdminProfile: () => api.get('/admin/profile/'),
  updateAdminProfile: (formData) => api.put('/admin/profile/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Admin Projects CRUD
  getAdminProjects: () => api.get('/admin/projects/'),
  getAdminProject: (id) => api.get(`/admin/projects/${id}/`),
  createAdminProject: (formData) => api.post('/admin/projects/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateAdminProject: (id, formData) => api.patch(`/admin/projects/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAdminProject: (id) => api.delete(`/admin/projects/${id}/`),

  // Admin Case Study Sections
  getAdminSections: (projectId) => api.get('/admin/case-study-sections/', { params: { project_id: projectId } }),
  createAdminSection: (formData) => api.post('/admin/case-study-sections/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateAdminSection: (id, formData) => api.patch(`/admin/case-study-sections/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAdminSection: (id) => api.delete(`/admin/case-study-sections/${id}/`),

  // Admin Gallery Images
  getAdminGalleryImages: (projectId) => api.get('/admin/gallery-images/', { params: { project_id: projectId } }),
  createAdminGalleryImage: (formData) => api.post('/admin/gallery-images/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAdminGalleryImage: (id) => api.delete(`/admin/gallery-images/${id}/`),

  // Admin Experience CRUD
  getAdminExperience: () => api.get('/admin/experience/'),
  createExperience: (formData) => api.post('/admin/experience/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateExperience: (id, formData) => api.patch(`/admin/experience/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteExperience: (id) => api.delete(`/admin/experience/${id}/`),

  // Admin Education CRUD
  getAdminEducation: () => api.get('/admin/education/'),
  createEducation: (data) => api.post('/admin/education/', data),
  updateEducation: (id, data) => api.patch(`/admin/education/${id}/`, data),
  deleteEducation: (id) => api.delete(`/admin/education/${id}/`),

  // Admin Skills CRUD
  getAdminSkills: () => api.get('/admin/skills/'),
  createSkill: (data) => api.post('/admin/skills/', data),
  updateSkill: (id, data) => api.patch(`/admin/skills/${id}/`, data),
  deleteSkill: (id) => api.delete(`/admin/skills/${id}/`),

  // Admin Certifications CRUD
  getAdminCertifications: () => api.get('/admin/certifications/'),
  createCertification: (formData) => api.post('/admin/certifications/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateCertification: (id, formData) => api.patch(`/admin/certifications/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteCertification: (id) => api.delete(`/admin/certifications/${id}/`),

  // Admin Media Library
  getAdminMedia: () => api.get('/admin/media/'),
  uploadAdminMedia: (formData) => api.post('/admin/media/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAdminMedia: (id) => api.delete(`/admin/media/${id}/`),

  // Admin Contact Inquiries
  getAdminInquiries: () => api.get('/admin/inquiries/'),
  markInquiryRead: (id, is_read) => api.patch(`/admin/inquiries/${id}/`, { is_read }),
  deleteInquiry: (id) => api.delete(`/admin/inquiries/${id}/`),
};

export default api;
