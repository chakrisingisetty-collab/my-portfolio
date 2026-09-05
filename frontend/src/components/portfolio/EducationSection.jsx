import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';

export const EducationSection = ({ education = [] }) => {
  return (
    <section id="education" className="py-24 relative border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Academics"
          title="Education & Background"
          subtitle="Foundations in Human-Computer Interaction, Software Engineering, and Design Thinking."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-[#121318] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-indigo-500/30 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 text-slate-300 border border-white/5">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    {edu.start_year} — {edu.end_year}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {edu.degree}
                </h3>
                <p className="text-sm font-medium text-indigo-400 mt-1">
                  {edu.institution}
                </p>

                {edu.field_of_study && (
                  <p className="text-xs text-slate-400 mt-1">
                    Major in {edu.field_of_study}
                  </p>
                )}

                {edu.description && (
                  <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed pt-4 border-t border-white/5">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {education.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No education entries added yet.
          </div>
        )}
      </div>
    </section>
  );
};
