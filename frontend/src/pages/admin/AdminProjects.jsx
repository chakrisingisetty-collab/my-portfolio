import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus, Search, Edit3, Trash2, ExternalLink,
  Star, CheckCircle2, XCircle, Layers, Loader2
} from 'lucide-react';

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAdminProjects();
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
      error('Failed to fetch projects list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublish = async (project) => {
    try {
      const updated = !project.is_published;
      await portfolioApi.updateAdminProject(project.id, { is_published: updated });
      setProjects(projects.map(p => p.id === project.id ? { ...p, is_published: updated } : p));
      success(`Project ${updated ? 'published' : 'moved to drafts'}.`);
    } catch (err) {
      console.error('Failed to update project status:', err);
      error('Failed to change publish status.');
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      const updated = !project.is_featured;
      await portfolioApi.updateAdminProject(project.id, { is_featured: updated });
      setProjects(projects.map(p => p.id === project.id ? { ...p, is_featured: updated } : p));
      success(`Project ${updated ? 'marked as featured' : 'unmarked from featured'}.`);
    } catch (err) {
      console.error('Failed to update featured status:', err);
      error('Failed to change featured status.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setIsDeleting(true);
    try {
      await portfolioApi.deleteAdminProject(target.id);
      setProjects(prev => prev.filter(p => p.id !== target.id));
      success(`Project "${target.title}" deleted successfully.`);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
      error('Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = projects.filter(p =>
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header bar with search and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121318] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-[#121318] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-mono">Loading projects...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No projects found. Click "Create New Project" to add your first work!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#16171e]/60 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg bg-[#1a1c24] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {proj.thumbnail ? (
                            <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                          ) : (
                            <Layers className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/admin/projects/${proj.id}/edit`}
                            className="font-bold text-white hover:text-indigo-400 transition-colors block text-sm"
                          >
                            {proj.title}
                          </Link>
                          <span className="text-[11px] text-slate-500 font-mono">
                            /projects/{proj.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 border border-white/5 text-slate-300">
                        {proj.category}
                      </span>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                          proj.is_published
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {proj.is_published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(proj)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          proj.is_featured
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-white/5 text-slate-500 border-white/5 hover:text-white'
                        }`}
                        title={proj.is_featured ? 'Featured on homepage' : 'Mark as featured'}
                      >
                        <Star className={`w-3.5 h-3.5 ${proj.is_featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {proj.project_date || '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/projects/${proj.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
                          title="View Case Study Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/projects/${proj.id}/edit`}
                          className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all"
                          title="Edit Project & Case Study"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => setDeleteTarget(proj)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently remove the project, its thumbnail, gallery images, and all case study narrative sections.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Project'}
        isDestructive={true}
      />
    </div>
  );
};
