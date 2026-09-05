import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';

export const CertificationsSection = ({ certifications = [] }) => {
  return (
    <section id="certifications" className="py-24 relative border-t border-white/5 bg-[#090a0d]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Credentials"
          title="Certifications & Honors"
          subtitle="Accredited industry certifications in UX research, usability evaluation, and frontend architecture."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#121318] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  {cert.issue_date && (
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {cert.issue_date}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {cert.name}
                </h3>
                <p className="text-xs text-indigo-400 font-medium mt-1">
                  {cert.organization}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>

                {cert.verification_url && (
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {certifications.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No certifications added yet.
          </div>
        )}
      </div>
    </section>
  );
};
