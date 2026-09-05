import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit3, Trash2, GraduationCap, X, Loader2 } from 'lucide-react';

export const AdminEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: '',
    end_year: '',
    description: '',
    order: 0,
  });

  const { success, error } = useToast();

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAdminEducation();
      setEducation(res.data);
    } catch (err) {
      console.error('Failed to load education:', err);
      error('Failed to fetch education list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      institution: '',
      degree: '',
      field_of_study: '',
      start_year: '',
      end_year: '',
      description: '',
      order: education.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      institution: item.institution,
      degree: item.degree,
      field_of_study: item.field_of_study || '',
      start_year: item.start_year,
      end_year: item.end_year,
      description: item.description || '',
      order: item.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        const res = await portfolioApi.updateEducation(editingItem.id, formData);
        setEducation(education.map(e => e.id === editingItem.id ? res.data : e));
        success('Education updated.');
      } else {
        const res = await portfolioApi.createEducation(formData);
        setEducation([...education, res.data]);
        success('Education added.');
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save education:', err);
      error('Failed to save education entry.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    try {
      await portfolioApi.deleteEducation(target.id);
      setEducation(prev => prev.filter(e => e.id !== target.id));
      success('Education entry deleted.');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete education:', err);
      error('Failed to delete education entry.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Education</h2>
          <p className="text-xs text-slate-400">Manage academic degrees, universities, and specializations.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-mono">Loading education records...</p>
          </div>
        ) : education.length === 0 ? (
          <div className="py-16 text-center bg-[#121318] border border-white/10 rounded-2xl text-slate-500 text-sm">
            No education entries found.
          </div>
        ) : (
          education.map((edu) => (
            <div
              key={edu.id}
              className="p-6 rounded-2xl bg-[#121318] border border-white/10 hover:border-indigo-500/30 transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                  <p className="text-xs font-medium text-indigo-400 mt-0.5">
                    {edu.institution} {edu.field_of_study ? `• ${edu.field_of_study}` : ''}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    {edu.start_year} — {edu.end_year}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-slate-400 mt-2 max-w-2xl">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => openEditModal(edu)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all"
                  title="Edit entry"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(edu)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
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
              {editingItem ? 'Edit Education' : 'Add Education Record'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Degree / Program <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Institution / University <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. University of California, Berkeley"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={formData.field_of_study}
                  onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                  placeholder="e.g. Human-Centered Design"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Start Year <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.start_year}
                    onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                    placeholder="2015"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    End Year <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.end_year}
                    onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                    placeholder="2019"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Highlights & Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Graduated Magna Cum Laude; research in HCI and interactive graphics..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
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
                  {saving ? 'Saving...' : 'Save Record'}
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
        title="Delete Education Record"
        message={`Are you sure you want to delete "${deleteTarget?.degree} at ${deleteTarget?.institution}"?`}
        confirmText="Delete Record"
        isDestructive={true}
      />
    </div>
  );
};
