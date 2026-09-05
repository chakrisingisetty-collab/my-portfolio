import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, FileDown } from 'lucide-react';
import { Github, Linkedin, Figma, Twitter, Dribbble } from '../common/BrandIcons';

export const HeroSection = ({ profile }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#15161d] border border-white/10 shadow-lg text-xs font-medium text-slate-300 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{profile?.is_available_for_hire ? 'Available for new projects & full-time roles' : 'Focused on ongoing work'}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
        >
          Designing intuitive interfaces. <br className="hidden sm:block" />
          <span className="text-gradient-accent">Engineering high-impact web apps.</span>
        </motion.h1>

        {/* Tagline / Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 font-normal leading-relaxed mb-10"
        >
          {profile?.tagline || 'Crafting delightful digital experiences through thoughtful design systems, human-centered research, and pixel-perfect frontend code.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <a
            href="#projects"
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>View Case Studies</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-medium text-sm transition-all flex items-center gap-2"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {(profile?.resume_url || profile?.resume_file) && (
            <a
              href={profile.resume_url || profile.resume_file}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-medium text-sm transition-all flex items-center gap-2"
            >
              <FileDown className="w-4 h-4 text-indigo-400" />
              <span>Resume</span>
            </a>
          )}
        </motion.div>

        {/* Social Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-3"
        >
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {profile?.figma_url && (
            <a
              href={profile.figma_url}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110"
              title="Figma"
            >
              <Figma className="w-4 h-4" />
            </a>
          )}
          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {profile?.twitter_url && (
            <a
              href={profile.twitter_url}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110"
              title="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {profile?.dribbble_url && (
            <a
              href={profile.dribbble_url}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-110"
              title="Dribbble"
            >
              <Dribbble className="w-4 h-4" />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};
