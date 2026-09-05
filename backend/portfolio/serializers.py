import json
from rest_framework import serializers
from .models import (
    SiteProfile, Skill, Project, ProjectGalleryImage,
    CaseStudySection, Experience, Education, Certification,
    MediaAsset, ContactInquiry
)


class SiteProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteProfile
        fields = "__all__"


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class ProjectGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectGalleryImage
        fields = "__all__"


class CaseStudySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudySection
        fields = "__all__"


class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "short_description", "category",
            "tools_used", "project_date", "thumbnail", "live_url",
            "github_url", "figma_url", "is_featured", "is_published",
            "order", "created_at"
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    gallery_images = ProjectGalleryImageSerializer(many=True, read_only=True)
    case_study_sections = CaseStudySectionSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "short_description", "category",
            "tools_used", "project_date", "thumbnail", "live_url",
            "github_url", "figma_url", "is_featured", "is_published",
            "order", "created_at", "updated_at", "gallery_images",
            "case_study_sections"
        ]


class ProjectAdminWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"

    def to_internal_value(self, data):
        # Allow tools_used to be passed as JSON string or comma-separated string or list
        ret = super().to_internal_value(data)
        tools = data.get("tools_used")
        if isinstance(tools, str):
            try:
                ret["tools_used"] = json.loads(tools)
            except Exception:
                ret["tools_used"] = [t.strip() for t in tools.split(",") if t.strip()]
        elif isinstance(tools, list):
            ret["tools_used"] = tools
        return ret


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = "__all__"


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = "__all__"


class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = "__all__"


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = "__all__"
        read_only_fields = ["is_read", "created_at"]
