import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { Github, Linkedin, Twitter, Dribbble } from './BrandIcons';

export const Footer = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/5 bg-[#07080a] py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-base font-bold text-white tracking-tight">
              {profile?.full_name || 'Singisetti Chakri'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              UI/UX Designer & Frontend Developer • Powered by dynamic CMS
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile?.twitter_url && (
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {profile?.dribbble_url && (
              <a
                href={profile.dribbble_url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                aria-label="Dribbble"
              >
                <Dribbble className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {profile?.full_name || 'Singisetti Chakri'}. All rights reserved. Content managed independently via portfolio CMS.
        </div>
      </div>
    </footer>
  );
};
