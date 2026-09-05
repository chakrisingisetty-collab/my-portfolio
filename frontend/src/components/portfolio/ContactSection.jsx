import React, { useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { portfolioApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';

export const ContactSection = ({ profile }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      error('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      await portfolioApi.sendContactMessage(formData);
      setSubmitted(true);
      success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      error('Failed to send message. Please try again or email directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Inquiries"
          title="Let's build something remarkable"
          subtitle="Have a design challenge, contract project, or full-time opportunity? Send a message and let's discuss."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Contact Information
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Feel free to reach out via the contact form or directly through email. I typically respond within 24 hours.
              </p>

              <div className="space-y-4 pt-4">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#121318] border border-white/10 hover:border-indigo-500/40 transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Email Me</span>
                      <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                        {profile.email}
                      </span>
                    </div>
                  </a>
                )}

                {profile?.phone && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#121318] border border-white/10">
                    <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Phone / WhatsApp</span>
                      <span className="text-sm font-medium text-white">
                        {profile.phone}
                      </span>
                    </div>
                  </div>
                )}

                {profile?.location && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#121318] border border-white/10">
                    <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400">Current Base</span>
                      <span className="text-sm font-medium text-white">
                        {profile.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 mt-8">
              <span className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                Direct CMS Sync
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Messages submitted here are immediately logged into the admin inbox dashboard with instant status tracking.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-[#121318] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-sm text-slate-400 max-w-sm mb-6">
                    Thank you for reaching out. Your inquiry has been received and I will reply to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Name <span className="text-indigo-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Maya Chen"
                        className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Email <span className="text-indigo-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="maya@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Web App Redesign Project"
                      className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Message <span className="text-indigo-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, goals, and timeline..."
                      className="w-full px-4 py-3 rounded-xl bg-[#181920] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
