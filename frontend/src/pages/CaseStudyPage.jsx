import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { portfolioApi } from '../services/api';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  ArrowLeft, ExternalLink, Calendar, Layers,
  CheckCircle2, Sparkles, AlertCircle, Compass, Users, Layout,
  Sliders, Award, ChevronRight, Loader2
} from 'lucide-react';
import { Github, Figma } from '../components/common/BrandIcons';

export const CaseStudyPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCaseStudy = async () => {
      setLoading(true);
      setError(null);
      try {
        const [projRes, profRes] = await Promise.all([
          portfolioApi.getProjectDetail(slug),
          portfolioApi.getProfile(),
        ]);
        setProject(projRes.data);
        setProfile(profRes.data);
      } catch (err) {
        console.error('Failed to load project case study:', err);
        setError('Case study not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudy();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            Loading Case Study...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#090a0d] flex items-center justify-center text-white px-4">
        <div className="max-w-md w-full text-center bg-[#121318] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {error || 'The requested case study could not be loaded.'}
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const getSectionIcon = (type) => {
    switch (type) {
      case 'problem': return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'research':
      case 'findings': return <Users className="w-5 h-5 text-indigo-400" />;
      case 'personas': return <Users className="w-5 h-5 text-violet-400" />;
      case 'user_journey':
      case 'user_flow': return <Compass className="w-5 h-5 text-cyan-400" />;
      case 'wireframes': return <Layout className="w-5 h-5 text-slate-300" />;
      case 'ui_design':
      case 'design_system': return <Sliders className="w-5 h-5 text-pink-400" />;
      case 'results': return <Award className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const sections = project.case_study_sections || [];

  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-200">
      <Navbar profile={profile} />

      <main className="pt-28 pb-24">
        {/* Top Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all projects
          </Link>
        </div>

        {/* Hero Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {project.category}
            </span>
            {project.project_date && (
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-slate-400 border border-white/5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {project.project_date}
              </span>
            )}
            {project.is_featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Featured Case Study
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            {project.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8">
            {project.short_description}
          </p>

          {/* Tools & Links */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
            {project.tools_used && project.tools_used.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono mr-1">
                  Tools:
                </span>
                {project.tools_used.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 text-slate-200 border border-white/10"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  <span>Live Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.figma_url && (
                <a
                  href={project.figma_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <Figma className="w-3.5 h-3.5 text-pink-400" />
                  <span>Figma File</span>
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <Github className="w-3.5 h-3.5 text-slate-300" />
                  <span>Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hero Thumbnail Banner */}
        {project.thumbnail && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#121318] aspect-video">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Case Study Sections Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sticky Table of Contents (Desktop) */}
            {sections.length > 0 && (
              <div className="hidden lg:block lg:col-span-4">
                <div className="sticky top-28 p-6 rounded-2xl bg-[#121318] border border-white/10 shadow-xl">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono">
                    Case Study Contents
                  </h3>
                  <nav className="space-y-1.5">
                    {sections.map((section, idx) => (
                      <a
                        key={section.id}
                        href={`#section-${section.id}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                      >
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-indigo-400">
                          0{idx + 1}
                        </span>
                        <span className="truncate">{section.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {/* Main Narrative Blocks */}
            <div className={`space-y-16 ${sections.length > 0 ? 'lg:col-span-8' : 'col-span-12'}`}>
              {sections.map((section, idx) => (
                <article
                  key={section.id}
                  id={`section-${section.id}`}
                  className="scroll-mt-32 p-8 sm:p-10 rounded-2xl bg-[#121318] border border-white/10 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      {getSectionIcon(section.section_type)}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 block">
                        Part 0{idx + 1} • {section.section_type.replace('_', ' ')}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line prose-invert mt-6 space-y-4">
                    {section.content}
                  </div>

                  {/* Section Image if uploaded */}
                  {section.image && (
                    <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-auto object-cover max-h-[500px]"
                      />
                    </div>
                  )}
                </article>
              ))}

              {/* Gallery Images if uploaded */}
              {project.gallery_images && project.gallery_images.length > 0 && (
                <div className="p-8 sm:p-10 rounded-2xl bg-[#121318] border border-white/10 shadow-xl">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Project Gallery & Screen Artifacts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery_images.map((gImg) => (
                      <div key={gImg.id} className="rounded-xl overflow-hidden border border-white/10 bg-black/30 group">
                        <img
                          src={gImg.image}
                          alt={gImg.caption || 'Project visual'}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {gImg.caption && (
                          <div className="p-2.5 text-xs text-slate-400 border-t border-white/5 bg-[#0e0f13]">
                            {gImg.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA to contact */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-b from-[#15161d] to-[#0d0e12] border border-white/10 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Like what you see?
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Let's collaborate on your next design system, product feature, or frontend web platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/#contact"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                Start a Conversation
              </Link>
              <Link
                to="/#projects"
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-semibold text-xs transition-all"
              >
                Explore More Case Studies
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
};
