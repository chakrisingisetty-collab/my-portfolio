import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit3, Trash2, Award, ExternalLink, Calendar, X, Loader2 } from 'lucide-react';

export const AdminCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    issue_date: '',
    verification_url: '',
    order: 0,
  });

  const { success, error } = useToast();

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAdminCertifications();
      setCertifications(res.data);
    } catch (err) {
      console.error('Failed to load certifications:', err);
      error('Failed to fetch certifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      organization: '',
      issue_date: '',
      verification_url: '',
      order: certifications.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      organization: item.organization,
      issue_date: item.issue_date,
      verification_url: item.verification_url || '',
      order: item.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        const res = await portfolioApi.updateCertification(editingItem.id, formData);
        setCertifications(certifications.map(c => c.id === editingItem.id ? res.data : c));
        success('Certification updated.');
      } else {
        const res = await portfolioApi.createCertification(formData);
        setCertifications([...certifications, res.data]);
        success('Certification added.');
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save certification:', err);
      error('Failed to save certification.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    try {
      await portfolioApi.deleteCertification(target.id);
      setCertifications(prev => prev.filter(c => c.id !== target.id));
      success('Certification deleted.');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete certification:', err);
      error('Failed to delete certification.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Certifications & Honors</h2>
          <p className="text-xs text-slate-400">Manage verified UX, Frontend, and Design credentials.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-mono">Loading certifications...</p>
          </div>
        ) : certifications.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-[#121318] border border-white/10 rounded-2xl text-slate-500 text-sm">
            No certifications added yet.
          </div>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl bg-[#121318] border border-white/10 hover:border-indigo-500/30 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {cert.issue_date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{cert.name}</h3>
                <p className="text-xs font-medium text-indigo-400 mt-1">
                  {cert.organization}
                </p>
                {cert.verification_url && (
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white mt-3"
                  >
                    <span>View credential link</span>
                    <ExternalLink className="w-3 h-3 text-indigo-400" />
                  </a>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(cert)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all text-xs flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(cert)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15161b] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {editingItem ? 'Edit Certification' : 'Add Certification'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Certificate Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nielsen Norman Group UX Master Certified"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Issuing Organization <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Nielsen Norman Group"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    placeholder="e.g. Oct 2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  value={formData.verification_url}
                  onChange={(e) => setFormData({ ...formData, verification_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  {saving ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Certification"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete Certificate"
        isDestructive={true}
      />
    </div>
  );
};
