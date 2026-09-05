import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  ArrowLeft, Save, Plus, Trash2, Edit3, Image as ImageIcon,
  Upload, Check, X, Layers, ExternalLink, Star, FileText,
  Loader2, AlertCircle, Eye
} from 'lucide-react';

const SECTION_TYPE_OPTIONS = [
  { value: 'overview', label: 'Project Overview' },
  { value: 'problem', label: 'Problem Statement' },
  { value: 'research', label: 'User Research' },
  { value: 'findings', label: 'Research Findings' },
  { value: 'personas', label: 'User Personas' },
  { value: 'user_journey', label: 'User Journey & Mapping' },
  { value: 'information_architecture', label: 'Information Architecture' },
  { value: 'user_flow', label: 'User Flow' },
  { value: 'wireframes', label: 'Wireframes & Low-Fi' },
  { value: 'ui_design', label: 'UI Design & High-Fi' },
  { value: 'design_system', label: 'Design System & Components' },
  { value: 'prototype', label: 'Interactive Prototype' },
  { value: 'solution', label: 'Final Solution' },
  { value: 'results', label: 'Results & Impact' },
  { value: 'learnings', label: 'Learnings & Reflections' },
  { value: 'custom', label: 'Custom Section' },
];

export const AdminProjectEdit = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'case_study' | 'gallery'
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Main Project Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    category: 'UI/UX Design',
    tools_used: ['Figma', 'React', 'Tailwind CSS'],
    project_date: new Date().getFullYear().toString(),
    live_url: '',
    github_url: '',
    figma_url: '',
    is_featured: false,
    is_published: true,
  });

  const [toolInput, setToolInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  // Case Study Sections State
  const [sections, setSections] = useState([]);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionFormData, setSectionFormData] = useState({
    section_type: 'overview',
    title: '',
    content: '',
    order: 0,
  });
  const [sectionImageFile, setSectionImageFile] = useState(null);
  const [sectionImagePreview, setSectionImagePreview] = useState('');
  const [deleteSectionTarget, setDeleteSectionTarget] = useState(null);

  // Gallery Images State
  const [galleryImages, setGalleryImages] = useState([]);
  const [newGalleryFile, setNewGalleryFile] = useState(null);
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [deleteGalleryTarget, setDeleteGalleryTarget] = useState(null);

  // Load project if editing
  useEffect(() => {
    if (!isNew) {
      const fetchProjectData = async () => {
        setLoading(true);
        try {
          const res = await portfolioApi.getAdminProject(id);
          const p = res.data;
          setFormData({
            title: p.title || '',
            slug: p.slug || '',
            short_description: p.short_description || '',
            category: p.category || 'UI/UX Design',
            tools_used: Array.isArray(p.tools_used) ? p.tools_used : [],
            project_date: p.project_date || '',
            live_url: p.live_url || '',
            github_url: p.github_url || '',
            figma_url: p.figma_url || '',
            is_featured: !!p.is_featured,
            is_published: !!p.is_published,
          });
          if (p.thumbnail) {
            setThumbnailPreview(p.thumbnail);
          }
          if (p.case_study_sections) {
            setSections(p.case_study_sections);
          }
          if (p.gallery_images) {
            setGalleryImages(p.gallery_images);
          }
        } catch (err) {
          console.error('Failed to load project details:', err);
          error('Failed to load project details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProjectData();
    }
  }, [id, isNew]);

  // Handle Title change and auto-generate slug for new projects
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: isNew || !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug
    }));
  };

  // Tool tags management
  const handleAddTool = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && toolInput.trim()) {
      e.preventDefault();
      const val = toolInput.trim().replace(',', '');
      if (!formData.tools_used.includes(val)) {
        setFormData(prev => ({
          ...prev,
          tools_used: [...prev.tools_used, val]
        }));
      }
      setToolInput('');
    }
  };

  const handleRemoveTool = (toolToRemove) => {
    setFormData(prev => ({
      ...prev,
      tools_used: prev.tools_used.filter(t => t !== toolToRemove)
    }));
  };

  // Thumbnail file selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Submit Project Details
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      error('Project title is required.');
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('slug', formData.slug);
      data.append('short_description', formData.short_description);
      data.append('category', formData.category);
      data.append('tools_used', JSON.stringify(formData.tools_used));
      data.append('project_date', formData.project_date);
      data.append('live_url', formData.live_url);
      data.append('github_url', formData.github_url);
      data.append('figma_url', formData.figma_url);
      data.append('is_featured', formData.is_featured);
      data.append('is_published', formData.is_published);

      if (thumbnailFile) {
        data.append('thumbnail', thumbnailFile);
      }

      if (isNew) {
        const res = await portfolioApi.createAdminProject(data);
        success('Project created successfully!');
        navigate(`/admin/projects/${res.data.id}/edit`);
      } else {
        await portfolioApi.updateAdminProject(id, data);
        success('Project updated successfully!');
      }
    } catch (err) {
      console.error('Failed to save project:', err);
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to save project.';
      error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Section Modal & Operations
  const openAddSectionModal = () => {
    setEditingSection(null);
    setSectionFormData({
      section_type: 'overview',
      title: 'Project Overview',
      content: '',
      order: sections.length + 1,
    });
    setSectionImageFile(null);
    setSectionImagePreview('');
    setSectionModalOpen(true);
  };

  const openEditSectionModal = (sec) => {
    setEditingSection(sec);
    setSectionFormData({
      section_type: sec.section_type,
      title: sec.title,
      content: sec.content,
      order: sec.order,
    });
    setSectionImageFile(null);
    setSectionImagePreview(sec.image || '');
    setSectionModalOpen(true);
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!id) {
      error('Please save the project first before adding case study sections.');
      return;
    }

    try {
      const data = new FormData();
      data.append('project', id);
      data.append('section_type', sectionFormData.section_type);
      data.append('title', sectionFormData.title);
      data.append('content', sectionFormData.content);
      data.append('order', sectionFormData.order);

      if (sectionImageFile) {
        data.append('image', sectionImageFile);
      }

      if (editingSection) {
        const res = await portfolioApi.updateAdminSection(editingSection.id, data);
        setSections(sections.map(s => s.id === editingSection.id ? res.data : s));
        success('Case study section updated.');
      } else {
        const res = await portfolioApi.createAdminSection(data);
        setSections([...sections, res.data]);
        success('New case study section added.');
      }
      setSectionModalOpen(false);
    } catch (err) {
      console.error('Failed to save section:', err);
      error('Failed to save section.');
    }
  };

  const confirmDeleteSection = async () => {
    if (!deleteSectionTarget) return;
    try {
      await portfolioApi.deleteAdminSection(deleteSectionTarget.id);
      setSections(sections.filter(s => s.id !== deleteSectionTarget.id));
      success('Section deleted.');
      setDeleteSectionTarget(null);
    } catch (err) {
      console.error('Failed to delete section:', err);
      error('Failed to delete section.');
    }
  };

  // Gallery Upload
  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (!newGalleryFile) {
      error('Please choose an image to upload.');
      return;
    }
    if (!id) {
      error('Please save the project first before uploading gallery images.');
      return;
    }

    setUploadingGallery(true);
    try {
      const data = new FormData();
      data.append('project', id);
      data.append('image', newGalleryFile);
      data.append('caption', newGalleryCaption);
      data.append('order', galleryImages.length + 1);

      const res = await portfolioApi.createAdminGalleryImage(data);
      setGalleryImages([...galleryImages, res.data]);
      setNewGalleryFile(null);
      setNewGalleryCaption('');
      success('Gallery image uploaded.');
    } catch (err) {
      console.error('Failed to upload gallery image:', err);
      error('Failed to upload gallery image.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const confirmDeleteGallery = async () => {
    if (!deleteGalleryTarget) return;
    try {
      await portfolioApi.deleteAdminGalleryImage(deleteGalleryTarget.id);
      setGalleryImages(galleryImages.filter(g => g.id !== deleteGalleryTarget.id));
      success('Gallery image deleted.');
      setDeleteGalleryTarget(null);
    } catch (err) {
      console.error('Failed to delete gallery image:', err);
      error('Failed to delete gallery image.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
        <p className="text-xs font-mono">Loading project data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isNew ? 'New Project' : `Edit: ${formData.title}`}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {formData.slug ? `/projects/${formData.slug}` : 'Draft URL'}
            </p>
          </div>
        </div>

        {!isNew && formData.slug && (
          <Link
            to={`/projects/${formData.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
          >
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Preview Case Study</span>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'details'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Project Details</span>
        </button>

        <button
          onClick={() => {
            if (isNew) {
              error('Please save the project first before customizing case study sections.');
              return;
            }
            setActiveTab('case_study');
          }}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'case_study'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Case Study Builder ({sections.length})</span>
        </button>

        <button
          onClick={() => {
            if (isNew) {
              error('Please save the project first before uploading gallery images.');
              return;
            }
            setActiveTab('gallery');
          }}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'gallery'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery Images ({galleryImages.length})</span>
        </button>
      </div>

      {/* TAB 1: PROJECT DETAILS */}
      {activeTab === 'details' && (
        <form onSubmit={handleSaveProject} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Core Fields */}
            <div className="lg:col-span-8 bg-[#121318] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Project Title <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. UrbanNest: Smart Rental Platform"
                  className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    URL Slug <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="urbannest"
                    className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Design Systems">Design Systems</option>
                    <option value="Mobile App Design">Mobile App Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Short Description (Displays on project cards) <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="A concise 1-2 sentence overview of the problem, solution, and impact..."
                  className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Tools Tag Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Technologies / Tools (Press Enter or comma to add)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[#181920] border border-white/10">
                  {formData.tools_used.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => handleRemoveTool(tool)}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={handleAddTool}
                    placeholder="Add tool (e.g. Next.js)..."
                    className="flex-1 min-w-[140px] bg-transparent text-white placeholder-slate-500 text-xs px-2 py-1 focus:outline-none"
                  />
                </div>
              </div>

              {/* External URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Live Project URL
                  </label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Figma URL
                  </label>
                  <input
                    type="url"
                    value={formData.figma_url}
                    onChange={(e) => setFormData({ ...formData, figma_url: e.target.value })}
                    placeholder="https://figma.com/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Thumbnail */}
            <div className="lg:col-span-4 space-y-6">
              {/* Publication Settings Card */}
              <div className="bg-[#121318] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white">Status & Visibility</h3>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#181920] border border-white/5">
                  <div>
                    <span className="block text-xs font-medium text-white">Published</span>
                    <span className="text-[11px] text-slate-400">Visible on public portfolio</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-[#121318] border-white/20"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#181920] border border-white/5">
                  <div>
                    <span className="block text-xs font-medium text-white">Featured Project</span>
                    <span className="text-[11px] text-slate-400">Highlighted in portfolio hero/grid</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-[#121318] border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Project Year / Date
                  </label>
                  <input
                    type="text"
                    value={formData.project_date}
                    onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Thumbnail Card */}
              <div className="bg-[#121318] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white">Project Thumbnail</h3>

                <div className="aspect-video rounded-xl bg-[#181920] border border-white/10 overflow-hidden flex items-center justify-center relative group">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4 text-slate-500">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                      <span className="text-[11px]">No thumbnail selected</span>
                    </div>
                  )}
                </div>

                <label className="block">
                  <span className="sr-only">Upload thumbnail</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving project...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isNew ? 'Create Project & Continue' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: CASE STUDY BUILDER */}
      {activeTab === 'case_study' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Case Study Narrative Sections</h3>
              <p className="text-xs text-slate-400">
                Construct structured deep-dives with Problem statements, Personas, Wireframes, and UI Design.
              </p>
            </div>
            <button
              onClick={openAddSectionModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Case Study Section</span>
            </button>
          </div>

          <div className="space-y-4">
            {sections.length === 0 ? (
              <div className="py-16 text-center bg-[#121318] border border-white/10 rounded-2xl text-slate-400">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-white mb-1">No sections created yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Add sections like Problem Statement, User Research, Wireframes, or Results to build your full case study.
                </p>
                <button
                  onClick={openAddSectionModal}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Create First Section
                </button>
              </div>
            ) : (
              sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-6 rounded-2xl bg-[#121318] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                      0{idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block">
                        {sec.section_type}
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {sec.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-2xl">
                        {sec.content}
                      </p>
                      {sec.image && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-2">
                          <ImageIcon className="w-3 h-3 text-indigo-400" /> Includes Section Image
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => openEditSectionModal(sec)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteSectionTarget(sec)}
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
        </div>
      )}

      {/* TAB 3: GALLERY IMAGES */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Project Gallery</h3>
            <p className="text-xs text-slate-400">
              Upload multiple screens, mockups, or UI components for this case study.
            </p>
          </div>

          {/* Upload Box */}
          <form onSubmit={handleUploadGallery} className="p-6 rounded-2xl bg-[#121318] border border-white/10 shadow-xl space-y-4">
            <h4 className="text-sm font-semibold text-white">Upload New Gallery Asset</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewGalleryFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  placeholder="e.g. Design token documentation sheet"
                  className="w-full px-3 py-2 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploadingGallery || !newGalleryFile}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2"
            >
              {uploadingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>Upload to Gallery</span>
            </button>
          </form>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryImages.map((gImg) => (
              <div key={gImg.id} className="rounded-2xl overflow-hidden bg-[#121318] border border-white/10 flex flex-col justify-between group">
                <div className="aspect-video bg-black/40 overflow-hidden relative">
                  <img src={gImg.image} alt={gImg.caption} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setDeleteGalleryTarget(gImg)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {gImg.caption && (
                  <p className="p-3 text-xs text-slate-400 border-t border-white/5">
                    {gImg.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION CREATE / EDIT MODAL */}
      {sectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15161b] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSectionModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {editingSection ? 'Edit Case Study Section' : 'Add Case Study Section'}
            </h3>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Section Type
                  </label>
                  <select
                    value={sectionFormData.section_type}
                    onChange={(e) => {
                      const sel = SECTION_TYPE_OPTIONS.find(o => o.value === e.target.value);
                      setSectionFormData({
                        ...sectionFormData,
                        section_type: e.target.value,
                        title: sectionFormData.title || sel?.label || ''
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {SECTION_TYPE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={sectionFormData.order}
                    onChange={(e) => setSectionFormData({ ...sectionFormData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181920] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Section Headline / Title <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sectionFormData.title}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, title: e.target.value })}
                  placeholder="e.g. User Research & Usability Testing"
                  className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Narrative / Content (Supports Markdown & Bullet Points) <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={sectionFormData.content}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, content: e.target.value })}
                  placeholder="Write the detailed design story, methodologies, findings, and metrics..."
                  className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Section Illustration / Diagram / Wireframe (Optional)
                </label>
                {sectionImagePreview && (
                  <div className="mb-2 max-h-40 rounded-xl overflow-hidden border border-white/10">
                    <img src={sectionImagePreview} alt="Section visual" className="w-full h-auto object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setSectionImageFile(f);
                      setSectionImagePreview(URL.createObjectURL(f));
                    }
                  }}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={!!deleteSectionTarget}
        onClose={() => setDeleteSectionTarget(null)}
        onConfirm={confirmDeleteSection}
        title="Delete Case Study Section"
        message={`Are you sure you want to delete "${deleteSectionTarget?.title}"?`}
        confirmText="Delete Section"
        isDestructive={true}
      />

      <ConfirmModal
        isOpen={!!deleteGalleryTarget}
        onClose={() => setDeleteGalleryTarget(null)}
        onConfirm={confirmDeleteGallery}
        title="Delete Gallery Image"
        message="Are you sure you want to delete this gallery image?"
        confirmText="Delete Image"
        isDestructive={true}
      />
    </div>
  );
};
