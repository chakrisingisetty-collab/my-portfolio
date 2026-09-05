import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Layout, Code, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutSection = ({ profile }) => {
  const pillars = [
    {
      icon: Layout,
      title: 'UI/UX & Product Design',
      description: 'From exploratory user research and wireframing to high-fidelity Figma components and interactive prototypes.',
    },
    {
      icon: Code,
      title: 'Frontend Engineering',
      description: 'Translating design tokens into scalable React architecture with Tailwind CSS, TypeScript, and fluid animations.',
    },
    {
      icon: Compass,
      title: 'Design Systems',
      description: 'Creating cohesive multi-brand token frameworks, component documentation, and cross-team design parity.',
    },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="About Me"
          title="Bridging design aesthetics & code"
          subtitle="A hybrid product designer and frontend developer focused on crafting interfaces that feel intuitive, fast, and memorable."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Bio card */}
          <div className="lg:col-span-7 bg-[#121318] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>{profile?.full_name || 'Singisetti Chakri'}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {profile?.location || 'San Francisco, CA'}
              </span>
            </h3>

            <p className="text-slate-300 text-base leading-relaxed mb-6 whitespace-pre-line">
              {profile?.bio || 'I combine user-centric design principles with modern frontend technologies to build products that solve real-world problems. Whether building complex SaaS platforms or polished consumer apps, I obsess over details, speed, and usability.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
              <div>
                <span className="block text-2xl font-extrabold text-white">6+</span>
                <span className="text-xs text-slate-400">Years Experience</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-white">40+</span>
                <span className="text-xs text-slate-400">Shipped Projects</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-white">100%</span>
                <span className="text-xs text-slate-400">Dynamic CMS</span>
              </div>
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#121318] border border-white/10 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
