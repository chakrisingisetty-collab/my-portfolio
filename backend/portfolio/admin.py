from django.contrib import admin
from .models import (
    SiteProfile, Skill, Project, ProjectGalleryImage,
    CaseStudySection, Experience, Education, Certification,
    MediaAsset, ContactInquiry
)


class ProjectGalleryInline(admin.TabularInline):
    model = ProjectGalleryImage
    extra = 1


class CaseStudySectionInline(admin.StackedInline):
    model = CaseStudySection
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "is_published", "is_featured", "order", "updated_at")
    list_filter = ("is_published", "is_featured", "category")
    search_fields = ("title", "short_description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [CaseStudySectionInline, ProjectGalleryInline]


@admin.register(SiteProfile)
class SiteProfileAdmin(admin.ModelAdmin):
    list_display = ("full_name", "title", "email", "is_available_for_hire")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "level_percentage", "order")
    list_filter = ("category",)
    list_editable = ("level_percentage", "order")


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("role", "company", "start_date", "end_date", "is_current", "order")
    list_editable = ("order",)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("degree", "institution", "start_year", "end_year", "order")
    list_editable = ("order",)


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ("name", "organization", "issue_date", "order")
    list_editable = ("order",)


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("name", "file_type", "file_size", "uploaded_at")


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "is_read", "created_at")
    list_filter = ("is_read",)
