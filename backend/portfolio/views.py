from rest_framework import generics, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import (
    SiteProfile, Skill, Project, ProjectGalleryImage,
    CaseStudySection, Experience, Education, Certification,
    MediaAsset, ContactInquiry
)
from .serializers import (
    SiteProfileSerializer, SkillSerializer, ProjectListSerializer,
    ProjectDetailSerializer, ProjectAdminWriteSerializer,
    ProjectGalleryImageSerializer, CaseStudySectionSerializer,
    ExperienceSerializer, EducationSerializer, CertificationSerializer,
    MediaAssetSerializer, ContactInquirySerializer
)


# ============================================================================
# Public API Views (No Auth Required)
# ============================================================================

class PublicProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        profile = SiteProfile.objects.first()
        if not profile:
            profile = SiteProfile.objects.create()
        serializer = SiteProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)


class PublicSkillListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class PublicProjectListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        qs = Project.objects.filter(is_published=True)
        category = self.request.query_params.get("category")
        featured = self.request.query_params.get("featured")
        if category and category != "All":
            qs = qs.filter(category__iexact=category)
        if featured == "true":
            qs = qs.filter(is_featured=True)
        return qs


class PublicProjectDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProjectDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        # Allow viewing published projects, or any project if staff
        if self.request.user and self.request.user.is_staff:
            return Project.objects.all()
        return Project.objects.filter(is_published=True)


class PublicExperienceListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class PublicEducationListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Education.objects.all()
    serializer_class = EducationSerializer


class PublicCertificationListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer


class PublicContactCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer


# ============================================================================
# Admin API Views (Protected by IsAdminUser)
# ============================================================================

class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_projects = Project.objects.count()
        published_projects = Project.objects.filter(is_published=True).count()
        draft_projects = Project.objects.filter(is_published=False).count()
        featured_projects = Project.objects.filter(is_featured=True).count()
        experience_count = Experience.objects.count()
        education_count = Education.objects.count()
        skills_count = Skill.objects.count()
        certifications_count = Certification.objects.count()
        media_count = MediaAsset.objects.count()
        total_inquiries = ContactInquiry.objects.count()
        unread_inquiries = ContactInquiry.objects.filter(is_read=False).count()

        # Build recent activity feed
        recent_projects = Project.objects.order_by("-updated_at")[:5]
        recent_activity = [
            {
                "id": f"proj-{p.id}",
                "type": "project",
                "title": p.title,
                "status": "Published" if p.is_published else "Draft",
                "time": p.updated_at.strftime("%b %d, %Y %H:%M"),
            }
            for p in recent_projects
        ]

        return Response({
            "total_projects": total_projects,
            "published_projects": published_projects,
            "draft_projects": draft_projects,
            "featured_projects": featured_projects,
            "experience_count": experience_count,
            "education_count": education_count,
            "skills_count": skills_count,
            "certifications_count": certifications_count,
            "media_count": media_count,
            "total_inquiries": total_inquiries,
            "unread_inquiries": unread_inquiries,
            "recent_activity": recent_activity,
        })


class AdminProfileView(APIView):
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        profile = SiteProfile.objects.first()
        if not profile:
            profile = SiteProfile.objects.create()
        serializer = SiteProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)

    def put(self, request):
        profile = SiteProfile.objects.first()
        if not profile:
            profile = SiteProfile.objects.create()
        serializer = SiteProfileSerializer(profile, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = Project.objects.all().order_by("order", "-created_at")
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.action in ["retrieve"]:
            return ProjectDetailSerializer
        return ProjectAdminWriteSerializer


class AdminCaseStudySectionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = CaseStudySection.objects.all()
    serializer_class = CaseStudySectionSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = CaseStudySection.objects.all()
        project_id = self.request.query_params.get("project_id")
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs.order_by("order", "id")


class AdminProjectGalleryImageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = ProjectGalleryImage.objects.all()
    serializer_class = ProjectGalleryImageSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = ProjectGalleryImage.objects.all()
        project_id = self.request.query_params.get("project_id")
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs.order_by("order", "id")


class AdminExperienceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = Experience.objects.all().order_by("order", "-id")
    serializer_class = ExperienceSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminEducationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = Education.objects.all().order_by("order", "-id")
    serializer_class = EducationSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminSkillViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = Skill.objects.all().order_by("order", "name")
    serializer_class = SkillSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminCertificationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = Certification.objects.all().order_by("order", "-id")
    serializer_class = CertificationSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminMediaAssetViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = MediaAsset.objects.all().order_by("-uploaded_at")
    serializer_class = MediaAssetSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        # Support single or multiple file uploads
        files = request.FILES.getlist("file")
        if not files:
            file_obj = request.FILES.get("file")
            if file_obj:
                files = [file_obj]
            else:
                return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        created_assets = []
        for f in files:
            asset = MediaAsset.objects.create(
                file=f,
                name=f.name,
                file_size=f.size,
                file_type=f.content_type or ""
            )
            created_assets.append(asset)

        serializer = MediaAssetSerializer(created_assets, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminContactInquiryViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = ContactInquiry.objects.all().order_by("-created_at")
    serializer_class = ContactInquirySerializer

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
