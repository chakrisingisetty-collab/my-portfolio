import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit3, Trash2, X, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';

const CATEGORIES = [
  'UI/UX Design',
  'Frontend Development',
  'Tools & Workflow',
  'Backend & Database',
];

export const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'UI/UX Design',
    icon_name: 'Palette',
    level_percentage: 90,
    order: 0,
  });

  const { success, error } = useToast();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAdminSkills();
      setSkills(res.data);
    } catch (err) {
      console.error('Failed to load skills:', err);
      error('Failed to fetch skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'UI/UX Design',
      icon_name: 'Palette',
      level_percentage: 90,
      order: skills.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      icon_name: item.icon_name || 'Palette',
      level_percentage: item.level_percentage,
      order: item.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        const res = await portfolioApi.updateSkill(editingItem.id, formData);
        setSkills(skills.map(s => s.id === editingItem.id ? res.data : s));
        success('Skill updated.');
      } else {
        const res = await portfolioApi.createSkill(formData);
        setSkills([...skills, res.data]);
        success('Skill added.');
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save skill:', err);
      error('Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await portfolioApi.deleteSkill(deleteTarget.id);
      setSkills(skills.filter(s => s.id !== deleteTarget.id));
      success('Skill deleted.');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete skill:', err);
      error('Failed to delete skill.');
    }
  };

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Sparkles;
    return <IconComponent className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Skills & Technical Stack</h2>
          <p className="text-xs text-slate-400">Manage design proficiencies, frontend libraries, and developer tools.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="bg-[#121318] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-mono">Loading skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No skills added yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#16171e]/60 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Skill Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Proficiency</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {skills.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                          {renderIcon(s.icon_name)}
                        </div>
                        <span className="font-bold text-white text-sm">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            style={{ width: `${s.level_percentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-400">{s.level_percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {s.order}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all"
                          title="Edit skill"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                          title="Delete skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15161b] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {editingItem ? 'Edit Skill' : 'Add New Skill'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Skill Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Figma, React, Tailwind CSS"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="Palette, Code, Layers..."
                    className="w-full px-3 py-2 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Proficiency Level
                  </label>
                  <span className="text-xs font-mono text-indigo-400 font-bold">
                    {formData.level_percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.level_percentage}
                  onChange={(e) => setFormData({ ...formData, level_percentage: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#181920] rounded-lg appearance-none cursor-pointer accent-indigo-500"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
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
                  {saving ? 'Saving...' : 'Save Skill'}
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
        title="Delete Skill"
        message={`Are you sure you want to delete the skill "${deleteTarget?.name}"?`}
        confirmText="Delete Skill"
        isDestructive={true}
      />
    </div>
  );
};
