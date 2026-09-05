import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { ExternalLink, ArrowRight, Star, Layers } from 'lucide-react';
import { Github, Figma } from '../common/BrandIcons';

export const ProjectsSection = ({ projects = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Selected Works"
          title="Case Studies & Featured Projects"
          subtitle="A curated selection of end-to-end design systems, interactive web applications, and digital product case studies."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#121318] border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-xl"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[#1a1c24] overflow-hidden border-b border-white/5">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#181a24] to-[#0f1118] text-slate-500">
                    <Layers className="w-10 h-10 text-indigo-400/40 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono tracking-wider uppercase text-slate-400">
                      {project.category}
                    </span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                    {project.category}
                  </span>
                  {project.is_featured && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      Featured
                    </span>
                  )}
                </div>

                {project.project_date && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 backdrop-blur-md text-slate-400 border border-white/10">
                    {project.project_date}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-2 leading-snug">
                    <Link to={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                    {project.short_description}
                  </p>

                  {/* Tools / Tech Stack */}
                  {project.tools_used && project.tools_used.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tools_used.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-slate-300 border border-white/5"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Links & Case Study CTA */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
                        title="Live Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.figma_url && (
                      <a
                        href={project.figma_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
                        title="Figma Prototype"
                      >
                        <Figma className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group/link"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">
            No projects found in this category.
          </div>
        )}
      </div>
    </section>
  );
};
