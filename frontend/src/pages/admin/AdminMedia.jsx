import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  UploadCloud, Copy, Check, Trash2, Eye,
  FileImage, Search, X, Loader2
} from 'lucide-react';

export const AdminMedia = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const { success, error } = useToast();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAdminMedia();
      setMediaItems(res.data);
    } catch (err) {
      console.error('Failed to load media assets:', err);
      error('Failed to fetch media assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }

      const res = await portfolioApi.uploadAdminMedia(formData);
      setMediaItems(prev => [...res.data, ...prev]);
      success(`${files.length} file(s) uploaded to media library.`);
    } catch (err) {
      console.error('Upload failed:', err);
      error('Failed to upload file(s).');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    try {
      await portfolioApi.deleteAdminMedia(target.id);
      setMediaItems(prev => prev.filter(m => m.id !== target.id));
      success('Media asset removed.');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete media:', err);
      error('Failed to delete media asset.');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filtered = mediaItems.filter(m =>
    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Media Asset Manager</h2>
          <p className="text-xs text-slate-400">
            Upload, preview, organize, and copy direct links for portfolio images and case study assets.
          </p>
        </div>
      </div>

      {/* Drag and Drop Upload Area */}
      <div className="p-8 rounded-3xl bg-[#121318] border-2 border-dashed border-white/10 hover:border-indigo-500/40 transition-all text-center relative group">
        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          disabled={uploading}
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            {uploading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            {uploading ? 'Uploading and optimizing assets...' : 'Drop files here or click to browse'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Supports single and multi-file uploads (PNG, JPG, WebP, SVG, PDF). Stored directly in persistent media storage.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121318] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <span className="text-xs font-mono text-slate-400">
          {filtered.length} Asset(s)
        </span>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
          <p className="text-xs font-mono">Loading media assets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-[#121318] border border-white/10 rounded-2xl text-slate-500 text-sm">
          No media files found. Upload images above to start your library!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden bg-[#121318] border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between group shadow-lg"
            >
              {/* Image Preview Box */}
              <div className="aspect-square bg-[#181920] relative overflow-hidden flex items-center justify-center">
                {item.file_type?.startsWith('image') || item.file?.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) ? (
                  <img
                    src={item.file}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <FileImage className="w-10 h-10 text-slate-600" />
                )}

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
                  <button
                    onClick={() => setPreviewTarget(item)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Zoom preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(item.file, item.id)}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                    title="Delete asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Asset Meta Footer */}
              <div className="p-3 border-t border-white/5 bg-[#0e0f13]">
                <p className="text-xs font-semibold text-white truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>{formatBytes(item.file_size)}</span>
                  <span>{item.file_type?.split('/')[1]?.toUpperCase() || 'IMG'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewTarget && (
        <div
          onClick={() => setPreviewTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] bg-[#121318] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#15161b]">
              <div className="truncate pr-4">
                <h4 className="text-sm font-bold text-white truncate">{previewTarget.name}</h4>
                <p className="text-[11px] font-mono text-slate-400">
                  {formatBytes(previewTarget.file_size)} • {previewTarget.file}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewTarget.file, previewTarget.id)}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1.5 px-3 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Direct URL</span>
                </button>
                <button
                  onClick={() => setPreviewTarget(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40">
              <img
                src={previewTarget.file}
                alt={previewTarget.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Media Asset"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? Any case studies using this image URL may be affected.`}
        confirmText="Delete Media"
        isDestructive={true}
      />
    </div>
  );
};
