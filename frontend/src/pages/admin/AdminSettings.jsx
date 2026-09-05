import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Save, User, Mail, Globe, Loader2
} from 'lucide-react';

export const AdminSettings = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    tagline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    is_available_for_hire: true,
    github_url: '',
    linkedin_url: '',
    figma_url: '',
    twitter_url: '',
    dribbble_url: '',
    resume_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await portfolioApi.getAdminProfile();
        const p = res.data;
        setFormData({
          full_name: p.full_name || '',
          title: p.title || '',
          tagline: p.tagline || '',
          bio: p.bio || '',
          email: p.email || '',
          phone: p.phone || '',
          location: p.location || '',
          is_available_for_hire: !!p.is_available_for_hire,
          github_url: p.github_url || '',
          linkedin_url: p.linkedin_url || '',
          figma_url: p.figma_url || '',
          twitter_url: p.twitter_url || '',
          dribbble_url: p.dribbble_url || '',
          resume_url: p.resume_url || '',
        });
      } catch (err) {
        console.error('Failed to load settings:', err);
        error('Failed to load profile settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await portfolioApi.updateAdminProfile(data);
      success('Portfolio settings and profile saved successfully!');
    } catch (err) {
      console.error('Failed to save profile settings:', err);
      error('Failed to save profile settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
        <p className="text-xs font-mono">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Site & Profile Settings</h2>
        <p className="text-xs text-slate-400">
          Update your public profile, hero branding, contact coordinates, and social media handles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-white/10 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Personal Identity & Hero Copy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Professional Title <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Hero Tagline (Displays under main headline)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Bio / About Narrative (Supports paragraph breaks)
            </label>
            <textarea
              rows={5}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#181920] border border-white/5">
            <div>
              <span className="block text-xs font-semibold text-white">Availability Status</span>
              <span className="text-[11px] text-slate-400">
                Displays green pulsing availability indicator in hero
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.is_available_for_hire}
              onChange={(e) => setFormData({ ...formData, is_available_for_hire: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-[#121318] border-white/20"
            />
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-white/10 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            Contact Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Location Base
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Resume Document Link (URL to PDF, Google Drive, etc.)
            </label>
            <input
              type="url"
              value={formData.resume_url}
              onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Social & Professional Links */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            Social & Portfolio Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Figma Profile URL
              </label>
              <input
                type="url"
                value={formData.figma_url}
                onChange={(e) => setFormData({ ...formData, figma_url: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Twitter / X Profile URL
              </label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Dribbble Profile URL
              </label>
              <input
                type="url"
                value={formData.dribbble_url}
                onChange={(e) => setFormData({ ...formData, dribbble_url: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving profile settings...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile & Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
