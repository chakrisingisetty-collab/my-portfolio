import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Layout, Code, Compass, Sparkles, MapPin } from 'lucide-react';
import defaultProfilePhoto from '../../assets/profile.jpg';

export const AboutSection = ({ profile }) => {
  const pillars = [
    {
      icon: Layout,
      title: 'UI/UX & Product Design',
      description: 'From exploratory user research and wireframing to high-fidelity Figma components, interactive prototypes, and usable design systems.',
    },
    {
      icon: Code,
      title: 'Frontend Engineering',
      description: 'Translating design tokens into scalable React architecture with Tailwind CSS, responsive layouts, and fluid micro-animations.',
    },
    {
      icon: Compass,
      title: 'Design Systems & Tokens',
      description: 'Creating cohesive multi-brand token frameworks, accessible components (a11y), and zero-friction cross-team design parity.',
    },
  ];

  const photoSrc = profile?.avatar
    ? (profile.avatar.startsWith('http') ? profile.avatar : (profile.avatar.startsWith('/') ? profile.avatar : `/${profile.avatar}`))
    : defaultProfilePhoto;

  return (
    <section id="about" className="py-24 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="About Me"
          title="Bridging design aesthetics & code"
          subtitle="A hybrid product designer and frontend developer focused on crafting interfaces that feel intuitive, fast, and memorable."
        />

        {/* Top Profile Card & Portrait Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          {/* Portrait Photo Column */}
          <div className="lg:col-span-5 relative group">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />

            <div className="relative h-full rounded-3xl overflow-hidden border border-white/10 bg-[#121318] p-3 shadow-2xl flex flex-col justify-between">
              <div className="relative w-full h-[440px] sm:h-[480px] lg:h-[480px] rounded-2xl overflow-hidden">
                <img
                  src={photoSrc}
                  alt={profile?.full_name || 'Singisetti Chakri'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultProfilePhoto;
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f15] via-[#0e0f15]/20 to-transparent" />

                {/* Availability indicator badge pill */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#0d0e14]/80 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-medium text-slate-200 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Available for work</span>
                </div>

                {/* Floating bottom identity card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#121318]/90 backdrop-blur-md border border-white/10 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {profile?.full_name || 'Singisetti Chakri'}
                      </h4>
                      <p className="text-xs text-indigo-400 font-medium">
                        {profile?.title || 'UI/UX Designer & Frontend Developer'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-300">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      <span>{profile?.location || 'San Francisco, CA'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio and Metrics Column */}
          <div className="lg:col-span-7 bg-[#121318] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>UI/UX Designer & Frontend Engineer</span>
                </span>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  {profile?.location || 'Open to Worldwide Remote'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-5 tracking-tight leading-snug">
                Turning complex product ideas into intuitive, high-performance web experiences.
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line">
                {profile?.bio || 'I combine user-centric design principles with modern frontend technologies to build products that solve real-world problems. Whether building complex SaaS platforms or polished consumer apps, I obsess over details, speed, and usability.'}
              </p>

              {/* Focus tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['User Research', 'Wireframing & Prototyping', 'Design Systems', 'React & Next.js', 'Tailwind CSS', 'Accessible Web (a11y)', 'REST APIs'].map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-300 font-medium hover:border-indigo-500/30 hover:text-white transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics Counters */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">6+</span>
                <span className="text-xs text-slate-400">Years Experience</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">40+</span>
                <span className="text-xs text-slate-400">Shipped Projects</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">100%</span>
                <span className="text-xs text-slate-400">Dynamic CMS</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-[#121318] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
