import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi } from '../../services/api';
import {
  FolderGit2, CheckCircle2, FileEdit, Briefcase,
  Award, MessageSquare, Image as ImageIcon, Plus,
  ArrowRight, Clock, Loader2, ExternalLink
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await portfolioApi.getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-xs font-mono">Loading dashboard metrics...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.total_projects || 0,
      subtext: `${stats?.published_projects || 0} published • ${stats?.draft_projects || 0} drafts`,
      icon: FolderGit2,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      link: '/admin/projects',
    },
    {
      title: 'Published Projects',
      value: stats?.published_projects || 0,
      subtext: `${stats?.featured_projects || 0} featured on home`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      link: '/admin/projects',
    },
    {
      title: 'Draft Projects',
      value: stats?.draft_projects || 0,
      subtext: 'Unpublished work in progress',
      icon: FileEdit,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      link: '/admin/projects',
    },
    {
      title: 'Experience Entries',
      value: stats?.experience_count || 0,
      subtext: 'Career milestones',
      icon: Briefcase,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      link: '/admin/experience',
    },
    {
      title: 'Certifications',
      value: stats?.certifications_count || 0,
      subtext: 'Verified credentials',
      icon: Award,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      link: '/admin/certifications',
    },
    {
      title: 'Inquiries',
      value: stats?.total_inquiries || 0,
      subtext: `${stats?.unread_inquiries || 0} unread message(s)`,
      icon: MessageSquare,
      color: stats?.unread_inquiries > 0 ? 'text-rose-400' : 'text-slate-400',
      bgColor: stats?.unread_inquiries > 0 ? 'bg-rose-500/10' : 'bg-white/5',
      link: '/admin/messages',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#121318] to-[#121318] border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
            Admin Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Portfolio Content Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Manage projects, upload case study assets, edit skills, and review contact messages in real time without modifying source code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>

          <Link
            to="/admin/media"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            <span>Media Library</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="p-6 rounded-2xl bg-[#121318] border border-white/10 hover:border-indigo-500/30 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-white tracking-tight mb-1">
                  {card.value}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {card.subtext}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Hub & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-8 bg-[#121318] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Recent Project Activity
            </h3>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              stats.recent_activity.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#181920] border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div>
                      <p className="text-sm font-semibold text-white">{act.title}</p>
                      <p className="text-[11px] text-slate-500">Updated {act.time}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    act.status === 'Published'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {act.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No recent activity.
              </div>
            )}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#121318] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Quick Shortcuts</h3>
            <div className="space-y-2">
              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
              >
                <span>Edit Site Profile & Bio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/admin/skills"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
              >
                <span>Manage Technical Skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/admin/messages"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
              >
                <span>Check Inbox Inquiries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 text-xs font-medium transition-all"
              >
                <span>Preview Public Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
