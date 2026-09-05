import React, { useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import * as Icons from 'lucide-react';

export const SkillsSection = ({ skills = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Dynamically extract unique categories
  const categories = ['All', ...new Set(skills.map(s => s.category).filter(Boolean))];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Sparkles;
    return <IconComponent className="w-5 h-5 text-indigo-400" />;
  };

  return (
    <section id="skills" className="py-24 relative border-t border-white/5 bg-[#090a0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Expertise"
          title="Skills & Technical Arsenal"
          subtitle="A comprehensive toolkit across design research, interactive prototyping, design system architecture, and modern full-stack development."
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-[#121318] border border-white/10 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
                    {renderIcon(skill.icon_name)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {skill.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">{skill.category}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-slate-400">
                  {skill.level_percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 group-hover:scale-x-105 origin-left"
                  style={{ width: `${skill.level_percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No skills found in this category.
          </div>
        )}
      </div>
    </section>
  );
};
