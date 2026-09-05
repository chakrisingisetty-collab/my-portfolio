# Modern Portfolio Website & Admin Content Management System (CMS)

A production-ready personal portfolio website and full-featured admin CMS built for a **UI/UX Designer + Frontend Developer**.

You can add, edit, and delete projects, case studies, career experience, education, skills, certifications, and media files from the `/admin` dashboard **without modifying frontend source code**.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, React Router v6
- **Backend**: Django 5.x, Django REST Framework, SimpleJWT (JWT Authentication), Django CORS Headers, Pillow
- **Database**: PostgreSQL (Production) / SQLite (Zero-config local fallback via `dj-database-url`)
- **Storage**: Local persistent media storage with seamless Cloudinary support via environment variables

---

## Getting Started

Both the backend and frontend dev servers are currently pre-configured and running.

### Default Admin Credentials
- **URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Username**: `admin`
- **Password**: `admin123456`

*(A "Fill default credentials" button is also provided on the login page for convenience)*

---

## Starting Servers Manually

### 1. Start the Backend (Django API)
```powershell
cd backend
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```
The Django REST API runs at `http://127.0.0.1:8000/api/`.

To re-seed the initial dataset with realistic case studies, skills, experience, and certifications:
```powershell
.\venv\Scripts\python.exe manage.py seed_portfolio
```

### 2. Start the Frontend (React + Vite)
```powershell
cd frontend
npm run dev
```
The portfolio will be live at `http://localhost:5173/`.

---

## Architecture & Features

### 1. Public Portfolio (`/`)
- **Hero / Intro**: Dynamic title, name, availability indicator badge, CTAs, and direct social profile links.
- **About Section**: Highlighting design/development philosophy, years of experience, and metric callouts.
- **Skills Matrix**: Grouped by *UI/UX Design*, *Frontend Development*, *Tools & Workflow*, and *Backend & Database* with proficiency indicators.
- **Projects Showcase**: Filterable by category, featured badge indicators, tech tags, and links to live demos / GitHub / Figma.
- **Dedicated Case Study Pages (`/projects/:slug`)**:
  - Immersive case studies with table of contents navigation.
  - Supports: Problem statement, user research, personas, user journeys, wireframes, UI design, design systems, prototypes, and impact metrics.
- **Experience Timeline**: Career history with roles, companies, dates, current status, and achievements.
- **Education**: Degrees, universities, graduation years, and honors.
- **Certifications**: Verified credentials with links to certificate issuers.
- **Contact Section**: Working contact form that submits directly to the admin inquiries database.

### 2. Admin CMS Dashboard (`/admin`)
- **Overview Dashboard**: Real-time metrics (Total projects, published, drafts, inquiries) and recent activity log.
- **Projects Manager**: Add, edit, delete, publish/unpublish toggle, featured toggle, and thumbnail replacement.
- **Case Study Builder**: Add, edit, and reorder case study narrative sections and upload diagrams/images between sections.
- **Gallery Manager**: Upload multiple extra mockups and screenshots.
- **Experience Manager**: Add, edit, and delete job records.
- **Education Manager**: Add, edit, and delete academic milestones.
- **Skills Manager**: Add, edit, and delete technical skills with proficiency sliders.
- **Certifications Manager**: Add, edit, and delete certificates and verification URLs.
- **Media Asset Library**: Multi-file upload with 1-click "Copy Direct URL" button to embed images anywhere.
- **Contact Inquiries**: Review submissions from visitors, toggle read/unread status, and delete inquiries.
- **Site & Profile Settings**: Edit personal identity, hero tagline, bio narrative, contact email, and social handles.

---

## Environment Configuration

### Backend (`backend/.env`)
```ini
DEBUG=True
SECRET_KEY=django-insecure-portfolio-super-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Optional: Connect to PostgreSQL
# DATABASE_URL=postgres://user:password@localhost:5432/portfolio_db

# Optional: Connect to Cloudinary
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```
