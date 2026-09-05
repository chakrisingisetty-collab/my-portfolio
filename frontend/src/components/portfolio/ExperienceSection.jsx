import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

export const ExperienceSection = ({ experience = [] }) => {
  return (
    <section id="experience" className="py-24 relative border-t border-white/5 bg-[#090a0d]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Career"
          title="Work Experience"
          subtitle="A track record of designing and architecting software products across agile development teams."
        />

        <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-12">
          {experience.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#121318] border-2 border-indigo-500 group-hover:bg-indigo-500 group-hover:scale-125 transition-all" />

              <div className="bg-[#121318] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-indigo-500/30 transition-all shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm mt-0.5">
                      <span>{exp.company}</span>
                      {exp.location && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400 flex items-center gap-1 text-xs">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 text-slate-300 border border-white/5">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                    </span>
                    {exp.is_current && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {experience.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No experience records added yet.
          </div>
        )}
      </div>
    </section>
  );
};
