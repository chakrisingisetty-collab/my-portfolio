import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../services/api';
import { Navbar } from '../components/common/Navbar';
import { HeroSection } from '../components/portfolio/HeroSection';
import { AboutSection } from '../components/portfolio/AboutSection';
import { SkillsSection } from '../components/portfolio/SkillsSection';
import { ProjectsSection } from '../components/portfolio/ProjectsSection';
import { ExperienceSection } from '../components/portfolio/ExperienceSection';
import { EducationSection } from '../components/portfolio/EducationSection';
import { CertificationsSection } from '../components/portfolio/CertificationsSection';
import { ContactSection } from '../components/portfolio/ContactSection';
import { Footer } from '../components/common/Footer';
import { Loader2 } from 'lucide-react';

export const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          profileRes,
          skillsRes,
          projectsRes,
          expRes,
          eduRes,
          certRes,
        ] = await Promise.all([
          portfolioApi.getProfile(),
          portfolioApi.getSkills(),
          portfolioApi.getProjects(),
          portfolioApi.getExperience(),
          portfolioApi.getEducation(),
          portfolioApi.getCertifications(),
        ]);

        setProfile(profileRes.data);
        setSkills(skillsRes.data);
        setProjects(projectsRes.data);
        setExperience(expRes.data);
        setEducation(eduRes.data);
        setCertifications(certRes.data);
      } catch (err) {
        console.error('Failed to load portfolio content from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
          <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            Loading Portfolio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-200">
      <Navbar profile={profile} />
      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experience={experience} />
        <EducationSection education={education} />
        <CertificationsSection certifications={certifications} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};
