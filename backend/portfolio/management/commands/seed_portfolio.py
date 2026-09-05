import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from portfolio.models import (
    SiteProfile, Skill, Project, CaseStudySection,
    Experience, Education, Certification, ContactInquiry
)


class Command(BaseCommand):
    help = "Seeds initial portfolio data and admin user."

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding...")

        # 1. Superuser (configurable via environment variables)
        username = os.getenv("DJANGO_SUPERUSER_USERNAME", "chakri@1521")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD")
        email = os.getenv("DJANGO_SUPERUSER_EMAIL", "chakrisingisetty@gmail.com")

        # Disable/remove legacy default admin account
        User.objects.filter(username="admin").delete()

        if username and password:
            if not User.objects.filter(username=username).exists():
                User.objects.create_superuser(username=username, email=email, password=password)
                self.stdout.write(self.style.SUCCESS(f"Created superuser '{username}'"))
            else:
                u = User.objects.get(username=username)
                u.set_password(password)
                u.is_staff = True
                u.is_superuser = True
                u.save()
                self.stdout.write(self.style.SUCCESS(f"Updated password for superuser '{username}'"))
        else:
            self.stdout.write(self.style.NOTICE(
                f"Superuser creation skipped for '{username}'. Set DJANGO_SUPERUSER_PASSWORD environment variable, "
                "or run 'python manage.py createsuperuser' to create an admin account."
            ))

        # 2. Site Profile
        profile, created = SiteProfile.objects.get_or_create(id=1)
        profile.full_name = "Singisetti Chakri"
        profile.title = "Senior UI/UX Designer & Frontend Developer"
        profile.tagline = "Designing intuitive human-centered products and building high-performance web applications with precision."
        profile.bio = (
            "I specialize in bridging the gap between product strategy, interactive design, and modern frontend engineering. "
            "With over 6 years of experience across high-growth startups and design studios, I build design systems from zero to one "
            "and craft clean, accessible React interfaces that users love."
        )
        profile.email = "chakrisingisetty@gmail.com"
        profile.phone = "+91 77780345893"
        profile.location = "San Francisco, CA (Open to Worldwide Remote)"
        profile.is_available_for_hire = True
        profile.github_url = "https://github.com/chakrisingisetty-collab/internship"
        profile.linkedin_url = "https://www.linkedin.com/in/chakri-singisetty-00845a364?utm_source=share_via&utm_content=profile&utm_medium=member_android"
        profile.figma_url = "https://figma.com"
        profile.twitter_url = "https://twitter.com"
        profile.dribbble_url = "https://dribbble.com"
        profile.save()
        self.stdout.write(self.style.SUCCESS("Seeded Site Profile"))

        # 3. Skills
        skills_data = [
            # UI/UX Design
            ("Figma & FigJam", "UI/UX Design", "Figma", 98, 1),
            ("Design Systems & Tokens", "UI/UX Design", "Layers", 95, 2),
            ("Wireframing & Prototyping", "UI/UX Design", "Layout", 96, 3),
            ("User Research & Usability Testing", "UI/UX Design", "Users", 90, 4),
            ("Information Architecture", "UI/UX Design", "GitBranch", 88, 5),
            ("Micro-interactions & Animation", "UI/UX Design", "Sparkles", 92, 6),
            
            # Frontend Development
            ("React & Next.js", "Frontend Development", "Code", 95, 10),
            ("JavaScript & TypeScript", "Frontend Development", "FileCode", 92, 11),
            ("Tailwind CSS", "Frontend Development", "Palette", 96, 12),
            ("Framer Motion & GSAP", "Frontend Development", "Play", 90, 13),
            ("HTML5 / Accessible Web (a11y)", "Frontend Development", "CheckCircle", 94, 14),
            ("REST & GraphQL APIs", "Frontend Development", "Globe", 88, 15),

            # Tools & Workflow
            ("Git & GitHub", "Tools & Workflow", "GitPullRequest", 92, 20),
            ("Vite & Webpack", "Tools & Workflow", "Cpu", 88, 21),
            ("Chrome DevTools & Lighthouse", "Tools & Workflow", "Search", 94, 22),
            ("Linear, Jira & Agile", "Tools & Workflow", "Kanban", 90, 23),

            # Backend & Database
            ("Django & REST Framework", "Backend & Database", "Server", 85, 30),
            ("PostgreSQL & Supabase", "Backend & Database", "Database", 82, 31),
        ]

        Skill.objects.all().delete()
        for name, category, icon, level, order in skills_data:
            Skill.objects.create(
                name=name,
                category=category,
                icon_name=icon,
                level_percentage=level,
                order=order
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(skills_data)} skills"))

        # 4. Projects & Case Studies
        Project.objects.all().delete()

        # Project 1: UrbanNest
        urbannest = Project.objects.create(
            title="UrbanNest: Smart Rental & Coliving Platform",
            slug="urbannest",
            short_description="An end-to-end UX case study and responsive web app for next-generation urban coliving discovery, roommate matching, and 3D floorplan tours.",
            category="UI/UX Design",
            tools_used=["Figma", "React", "Tailwind CSS", "Framer Motion", "Design Systems"],
            project_date="2025",
            live_url="https://urbannest-demo.example.com",
            github_url="https://github.com/example/urbannest",
            figma_url="https://figma.com/@urbannest",
            is_featured=True,
            is_published=True,
            order=1,
        )

        CaseStudySection.objects.create(
            project=urbannest,
            section_type="overview",
            title="Project Overview & Challenge",
            content=(
                "Finding modern, verified coliving spaces in dense urban hubs is notoriously fragmented. "
                "Young professionals face deceptive listings, high broker fees, and stressful lease transitions. "
                "UrbanNest was designed to reimagine this process into a seamless digital journey featuring 3D virtual tours, "
                "verified lifestyle compatibility matching, and transparent lease agreements signed in minutes."
            ),
            order=1
        )
        CaseStudySection.objects.create(
            project=urbannest,
            section_type="problem",
            title="Problem Statement",
            content=(
                "**Core friction points identified:**\n"
                "- 68% of urban renters reported that photos in traditional listings were outdated or misleading.\n"
                "- Roommate disputes accounted for over 40% of early lease terminations in shared living setups.\n"
                "- The average onboarding time from searching to signing an apartment lease required 14 days and 5 in-person visits."
            ),
            order=2
        )
        CaseStudySection.objects.create(
            project=urbannest,
            section_type="research",
            title="User Research & Discovery",
            content=(
                "We conducted 24 semi-structured interviews with urban renters aged 22-36 across San Francisco, New York, and Austin. "
                "Additionally, we analyzed usability patterns across competing real estate portals.\n\n"
                "**Key Takeaways:**\n"
                "1. **Trust is paramount**: Renters prioritize verified host badges and resident video testimonials.\n"
                "2. **Spatial awareness**: Standard 2D photos fail to convey sunlight, layout flow, and room proportions.\n"
                "3. **Speed of booking**: Users demand upfront cost breakdowns without hidden utility fees."
            ),
            order=3
        )
        CaseStudySection.objects.create(
            project=urbannest,
            section_type="personas",
            title="User Persona: Maya Chen",
            content=(
                "**Role:** Remote Product Designer, 28\n"
                "**Goal:** Relocating to Seattle for 6 months; desires a curated private studio with shared community spaces and high-speed fiber internet.\n"
                "**Frustrations:** Wasting weekends visiting apartments that don't match the listing photos; navigating complex paper applications."
            ),
            order=4
        )
        CaseStudySection.objects.create(
            project=urbannest,
            section_type="wireframes",
            title="Wireframes & Information Architecture",
            content=(
                "We drafted low-fidelity wireframes exploring two navigational models:\n"
                "1. A split map-and-feed layout for desktop, prioritizing spatial context.\n"
                "2. A bottom-sheet card gesture pattern for mobile devices, enabling one-handed neighborhood exploration."
            ),
            order=5
        )
        CaseStudySection.objects.create(
            project=urbannest,
            section_type="design_system",
            title="Design System & Component Architecture",
            content=(
                "Built an accessible, multi-theme design system in Figma using auto-layout 5.0 and component properties:\n"
                "- **Color Palette:** Warm stone backgrounds with emerald accent tones for verified trust cues.\n"
                "- **Typography:** Inter for clean readability across data-dense property comparison sheets.\n"
                "- **Interactive Elements:** Micro-animated filter pills, interactive budget sliders, and responsive image carousels."
            ),
            order=6
        )
        CaseStudySection.objects.create(
            project=urbannest,
            section_type="results",
            title="Results, Impact & Key Metrics",
            content=(
                "Upon releasing the beta prototype to 300 early testers:\n"
                "- **+48% increase in tour booking conversion rate** compared to industry benchmarks.\n"
                "- **Average time to lease decreased from 14 days down to 3.2 days.**\n"
                "- **4.9 / 5.0 user satisfaction score** for the interactive roommate compatibility questionnaire."
            ),
            order=7
        )

        # Project 2: Smart Print Kiosk
        kiosk = Project.objects.create(
            title="Smart Print Kiosk: Next-Gen Self-Service UI",
            slug="smart-print-kiosk",
            short_description="An ergonomic touchscreen kiosk operating system and mobile companion app designed for university campuses and public libraries.",
            category="UI/UX Design",
            tools_used=["Figma", "React", "Tailwind CSS", "IoT Interfaces", "Touch UX"],
            project_date="2024",
            live_url="https://kiosk-demo.example.com",
            github_url="https://github.com/example/smart-print-kiosk",
            figma_url="https://figma.com/@smart-kiosk",
            is_featured=True,
            is_published=True,
            order=2,
        )

        CaseStudySection.objects.create(
            project=kiosk,
            section_type="overview",
            title="Executive Overview",
            content=(
                "Smart Print Kiosk modernizes university printing infrastructure by replacing sluggish legacy hardware "
                "with an ultra-responsive 24-inch touch terminal. Students tap their NFC student ID or scan a QR code "
                "to instantly print cloud documents from Google Drive, Canvas, or OneDrive in seconds."
            ),
            order=1
        )
        CaseStudySection.objects.create(
            project=kiosk,
            section_type="problem",
            title="Problem & Physical Usability Constraints",
            content=(
                "Kiosks in high-traffic student centers face intense peak-hour congestion between classes. "
                "Key challenges included:\n"
                "- Accommodating wheelchair accessibility guidelines (ADA Compliance, height reach under 48 inches).\n"
                "- High ambient glare in glass-walled library atriums.\n"
                "- Reducing the average print transaction time from 180 seconds to under 45 seconds."
            ),
            order=2
        )
        CaseStudySection.objects.create(
            project=kiosk,
            section_type="ui_design",
            title="Touch Ergonomics & High-Contrast Interface",
            content=(
                "Designed oversized 64px tap targets with tactile sound and visual ripple feedback. "
                "Engineered dynamic high-contrast mode for outdoor and bright sunlight environments. "
                "Implemented auto-timeout security safeguards with visual countdown rings to protect sensitive student documents."
            ),
            order=3
        )
        CaseStudySection.objects.create(
            project=kiosk,
            section_type="results",
            title="Measurable Outcomes",
            content=(
                "- **Average checkout duration reduced from 180 seconds to 34 seconds.**\n"
                "- **92% reduction in paper jam service tickets** due to proactive visual troubleshooting animations.\n"
                "- Successfully deployed across 18 campus locations serving 25,000+ weekly active students."
            ),
            order=4
        )

        # Project 3: Pulse Analytics
        pulse = Project.objects.create(
            title="Pulse Analytics: Realtime Cloud Monitoring Dashboard",
            slug="pulse-analytics",
            short_description="A high-density developer observability platform featuring customizable widgets, real-time log streaming, and sub-second anomaly detection.",
            category="Web Development",
            tools_used=["React", "TypeScript", "Tailwind CSS", "Recharts", "Framer Motion"],
            project_date="2024",
            live_url="https://pulse-analytics.example.com",
            github_url="https://github.com/example/pulse-analytics",
            figma_url="https://figma.com/@pulse",
            is_featured=True,
            is_published=True,
            order=3,
        )

        CaseStudySection.objects.create(
            project=pulse,
            section_type="overview",
            title="System Overview",
            content=(
                "Pulse Analytics provides engineering teams with immediate visual telemetry across microservices. "
                "Designed with dark mode by default, the interface prioritizes color-coded severity tiers, rapid keyboard navigation, "
                "and customizable drag-and-drop dashboard grids."
            ),
            order=1
        )
        CaseStudySection.objects.create(
            project=pulse,
            section_type="ui_design",
            title="Data Visualization & Performance",
            content=(
                "Rendered high-frequency time-series charts capable of displaying 50,000+ datapoints at 60 FPS. "
                "Implemented a modular component library for metric cards, latency heatmaps, and distributed tracing graphs."
            ),
            order=2
        )

        self.stdout.write(self.style.SUCCESS("Seeded 3 detailed Projects and Case Studies"))

        # 5. Experience
        Experience.objects.all().delete()
        exp_data = [
            (
                "Nova Labs",
                "Senior UI/UX Designer & Frontend Lead",
                "San Francisco, CA",
                "Jan 2023",
                "Present",
                True,
                "• Directed design and frontend engineering for core SaaS product, scaling from 10k to 120k monthly active users.\n"
                "• Architected complete Figma design system and paired React component library, boosting team sprint velocity by 35%.\n"
                "• Mentored 5 junior and mid-level designers and engineers in accessibility and modern frontend standards.",
                1
            ),
            (
                "Apex Interactive Studio",
                "Product Designer & UI Engineer",
                "Remote",
                "Mar 2021",
                "Dec 2022",
                False,
                "• Designed client web applications, e-commerce experiences, and enterprise dashboards for Fortune 500 clients.\n"
                "• Conducted generative user interviews, usability audits, and interactive prototyping in Figma and React.\n"
                "• Decreased client average bounce rates by 28% through UX refactoring and page performance optimization.",
                2
            ),
            (
                "PixelCraft Tech",
                "Frontend Developer",
                "Austin, TX",
                "Jun 2019",
                "Feb 2021",
                False,
                "• Built responsive interfaces using React, JavaScript, and Tailwind CSS.\n"
                "• Integrated REST APIs, managed complex client state, and implemented cross-browser accessibility compliance.\n"
                "• Improved Lighthouse performance scores from 64 to 98 across company web platforms.",
                3
            ),
        ]
        for company, role, loc, start, end, curr, desc, order in exp_data:
            Experience.objects.create(
                company=company,
                role=role,
                location=loc,
                start_date=start,
                end_date=end,
                is_current=curr,
                description=desc,
                order=order
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(exp_data)} Experience records"))

        # 6. Education
        Education.objects.all().delete()
        edu_data = [
            (
                "University of California, Berkeley",
                "Bachelor of Science",
                "Computer Science & Human-Centered Design",
                "2015",
                "2019",
                "Graduated Magna Cum Laude. Focused on Human-Computer Interaction (HCI), Software Architecture, and Interactive Computer Graphics.",
                1
            ),
            (
                "Stanford Continuing Studies",
                "Certificate of Specialization",
                "Design Thinking & Advanced UX Research",
                "2020",
                "2020",
                "Intensive coursework covering contextual inquiry, heuristic evaluations, and quantitative UX metrics.",
                2
            ),
        ]
        for inst, degree, field, start_yr, end_yr, desc, order in edu_data:
            Education.objects.create(
                institution=inst,
                degree=degree,
                field_of_study=field,
                start_year=start_yr,
                end_year=end_yr,
                description=desc,
                order=order
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(edu_data)} Education records"))

        # 7. Certifications
        Certification.objects.all().delete()
        cert_data = [
            (
                "Nielsen Norman Group (NN/g) UX Master Certified",
                "Nielsen Norman Group",
                "Oct 2024",
                "https://www.nngroup.com",
                1
            ),
            (
                "Meta Front-End Developer Professional Certificate",
                "Meta",
                "Aug 2023",
                "https://www.coursera.org/professional-certificates/meta-front-end-developer",
                2
            ),
            (
                "Google UX Design Professional Certificate",
                "Google",
                "May 2022",
                "https://grow.google/certificates/ux-design",
                3
            ),
        ]
        for name, org, date, url, order in cert_data:
            Certification.objects.create(
                name=name,
                organization=org,
                issue_date=date,
                verification_url=url,
                order=order
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(cert_data)} Certifications"))

        # 8. Seed Sample Inquiries
        ContactInquiry.objects.all().delete()
        ContactInquiry.objects.create(
            name="Elena Rostova",
            email="elena@designstudio.co",
            subject="Partnership on Fintech Web App Redesign",
            message="Hi Chakri! We love your work on UrbanNest and would love to discuss a 3-month contract to design and implement our upcoming investment dashboard.",
            is_read=False
        )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
