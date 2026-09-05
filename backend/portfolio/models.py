from django.db import models
from django.utils.text import slugify


class SiteProfile(models.Model):
    """Singleton model representing the site owner's profile & settings."""
    full_name = models.CharField(max_length=150, default="Singisetti Chakri")
    title = models.CharField(max_length=200, default="UI/UX Designer & Frontend Developer")
    tagline = models.TextField(default="Crafting delightful digital experiences through thoughtful design systems and pixel-perfect engineering.")
    bio = models.TextField(default="I bridge the gap between design and engineering. With 5+ years of experience designing intuitive interfaces and turning them into performant, accessible web applications, I help startups and tech companies bring ideas to life.")
    avatar = models.ImageField(upload_to="profile/", null=True, blank=True)
    resume_file = models.FileField(upload_to="resumes/", null=True, blank=True)
    resume_url = models.URLField(max_length=500, blank=True, null=True, help_text="Direct link to resume (Google Drive, Dropbox, or PDF)")
    email = models.EmailField(default="chakrisingisetty@gmail.com")
    phone = models.CharField(max_length=50, blank=True, default="+91 77780345893")
    location = models.CharField(max_length=150, default="San Francisco, CA (Open to Remote)")
    is_available_for_hire = models.BooleanField(default=True)
    
    # Social and professional links
    github_url = models.URLField(max_length=500, blank=True, default="https://github.com/chakrisingisetty-collab/internship")
    linkedin_url = models.URLField(max_length=500, blank=True, default="https://www.linkedin.com/in/chakri-singisetty-00845a364?utm_source=share_via&utm_content=profile&utm_medium=member_android")
    figma_url = models.URLField(max_length=500, blank=True, default="https://figma.com")
    twitter_url = models.URLField(max_length=500, blank=True, default="https://twitter.com")
    dribbble_url = models.URLField(max_length=500, blank=True, default="https://dribbble.com")
    
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Site Profile"
        verbose_name_plural = "Site Profile"


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("UI/UX Design", "UI/UX Design"),
        ("Frontend Development", "Frontend Development"),
        ("Tools & Workflow", "Tools & Workflow"),
        ("Backend & Database", "Backend & Database"),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="UI/UX Design")
    icon_name = models.CharField(max_length=50, default="Palette", help_text="Lucide icon identifier (e.g. Figma, Layout, Code, Terminal, Database)")
    level_percentage = models.PositiveIntegerField(default=90, help_text="Skill proficiency percentage (1-100)")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"


class Project(models.Model):
    CATEGORY_CHOICES = [
        ("UI/UX Design", "UI/UX Design"),
        ("Web Development", "Web Development"),
        ("Design Systems", "Design Systems"),
        ("Mobile App Design", "Mobile App Design"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    short_description = models.TextField(help_text="Punchy 1-2 sentence description displayed on project cards")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="UI/UX Design")
    tools_used = models.JSONField(default=list, help_text="List of tools/technologies e.g. ['Figma', 'React', 'Tailwind CSS']")
    project_date = models.CharField(max_length=50, blank=True, default="2025")
    
    # Media
    thumbnail = models.ImageField(upload_to="projects/thumbnails/", null=True, blank=True)
    
    # External Links
    live_url = models.URLField(max_length=500, blank=True, null=True)
    github_url = models.URLField(max_length=500, blank=True, null=True)
    figma_url = models.URLField(max_length=500, blank=True, null=True)
    
    # Status flags
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "project"
            candidate = base_slug
            counter = 1
            while Project.objects.filter(slug=candidate).exclude(id=self.id).exists():
                candidate = f"{base_slug}-{counter}"
                counter += 1
            self.slug = candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectGalleryImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="projects/gallery/")
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.project.title} - Image #{self.id}"


class CaseStudySection(models.Model):
    SECTION_TYPES = [
        ("overview", "Project Overview"),
        ("problem", "Problem Statement"),
        ("research", "User Research"),
        ("findings", "Research Findings"),
        ("personas", "User Personas"),
        ("user_journey", "User Journey & Mapping"),
        ("information_architecture", "Information Architecture"),
        ("user_flow", "User Flow"),
        ("wireframes", "Wireframes & Low-Fi"),
        ("ui_design", "UI Design & High-Fi"),
        ("design_system", "Design System & Components"),
        ("prototype", "Interactive Prototype"),
        ("solution", "Final Solution"),
        ("results", "Results & Impact"),
        ("learnings", "Learnings & Reflections"),
        ("custom", "Custom Section"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="case_study_sections")
    section_type = models.CharField(max_length=50, choices=SECTION_TYPES, default="overview")
    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Detailed markdown or rich narrative for this section")
    image = models.ImageField(upload_to="projects/case_studies/", null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.project.title} - {self.title}"


class Experience(models.Model):
    company = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    location = models.CharField(max_length=150, blank=True)
    start_date = models.CharField(max_length=50, help_text="e.g. 'Jan 2023' or '2023-01'")
    end_date = models.CharField(max_length=50, blank=True, help_text="e.g. 'Present' or 'Dec 2024'")
    is_current = models.BooleanField(default=False)
    description = models.TextField(help_text="Responsibilities, achievements, and impact (supports markdown bullet points)")
    company_logo = models.ImageField(upload_to="experience/logos/", null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-id"]

    def __str__(self):
        return f"{self.role} at {self.company}"


class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=150, blank=True)
    start_year = models.CharField(max_length=20)
    end_year = models.CharField(max_length=20)
    description = models.TextField(blank=True, help_text="Key coursework, honors, or thesis")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-end_year"]

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Certification(models.Model):
    name = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    issue_date = models.CharField(max_length=50, help_text="e.g. 'Oct 2024'")
    verification_url = models.URLField(max_length=500, blank=True)
    certificate_file = models.FileField(upload_to="certifications/", null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-id"]

    def __str__(self):
        return f"{self.name} by {self.organization}"


class MediaAsset(models.Model):
    """Central media library for uploaded images and documents."""
    file = models.FileField(upload_to="media_library/")
    name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(default=0, help_text="Size in bytes")
    file_type = models.CharField(max_length=50, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.name


class ContactInquiry(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Inquiry from {self.name} ({self.email})"
