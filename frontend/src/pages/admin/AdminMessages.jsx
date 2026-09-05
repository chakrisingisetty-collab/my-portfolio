import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  MessageSquare, Mail, Calendar, Trash2,
  CheckCircle, CheckCircle2, Clock, Loader2
} from 'lucide-react';

export const AdminMessages = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { success, error } = useToast();

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await portfolioApi.getAdminInquiries();
      setInquiries(res.data);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      error('Failed to fetch contact inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleRead = async (item) => {
    try {
      const updated = !item.is_read;
      await portfolioApi.markInquiryRead(item.id, updated);
      setInquiries(inquiries.map(i => i.id === item.id ? { ...i, is_read: updated } : i));
      success(`Marked message as ${updated ? 'read' : 'unread'}.`);
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
      error('Failed to update status.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await portfolioApi.deleteInquiry(deleteTarget.id);
      setInquiries(inquiries.filter(i => i.id !== deleteTarget.id));
      success('Inquiry deleted.');
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
      error('Failed to delete inquiry.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Contact Inquiries & Messages</h2>
          <p className="text-xs text-slate-400">Review incoming client inquiries and contract proposals.</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-mono">Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center bg-[#121318] border border-white/10 rounded-2xl text-slate-500 text-sm">
            No contact messages received yet.
          </div>
        ) : (
          inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`p-6 rounded-2xl border transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                inq.is_read
                  ? 'bg-[#121318] border-white/5 opacity-80'
                  : 'bg-[#15161f] border-indigo-500/30 ring-1 ring-indigo-500/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${inq.is_read ? 'bg-white/5 text-slate-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">{inq.name}</h3>
                    <a
                      href={`mailto:${inq.email}`}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      {inq.email}
                    </a>
                    {!inq.is_read && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        New
                      </span>
                    )}
                  </div>

                  {inq.subject && (
                    <p className="text-xs font-semibold text-slate-200 mt-1">
                      Subject: {inq.subject}
                    </p>
                  )}

                  <p className="text-xs text-slate-300 mt-2 whitespace-pre-line leading-relaxed max-w-3xl">
                    {inq.message}
                  </p>

                  <span className="text-[10px] font-mono text-slate-500 mt-3 block">
                    Received on {new Date(inq.created_at).toLocaleDateString()} at {new Date(inq.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleToggleRead(inq)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                    inq.is_read
                      ? 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{inq.is_read ? 'Mark Unread' : 'Mark Read'}</span>
                </button>

                <button
                  onClick={() => setDeleteTarget(inq)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all text-xs"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Contact Inquiry"
        message={`Are you sure you want to delete the message from "${deleteTarget?.name}"?`}
        confirmText="Delete Message"
        isDestructive={true}
      />
    </div>
  );
};
