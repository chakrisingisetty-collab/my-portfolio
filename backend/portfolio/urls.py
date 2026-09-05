from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicProfileView, PublicSkillListView, PublicProjectListView,
    PublicProjectDetailView, PublicExperienceListView, PublicEducationListView,
    PublicCertificationListView, PublicContactCreateView,
    AdminDashboardStatsView, AdminProfileView, AdminProjectViewSet,
    AdminCaseStudySectionViewSet, AdminProjectGalleryImageViewSet,
    AdminExperienceViewSet, AdminEducationViewSet, AdminSkillViewSet,
    AdminCertificationViewSet, AdminMediaAssetViewSet,
    AdminContactInquiryViewSet
)

router = DefaultRouter()
router.register(r'admin/projects', AdminProjectViewSet, basename='admin-projects')
router.register(r'admin/case-study-sections', AdminCaseStudySectionViewSet, basename='admin-sections')
router.register(r'admin/gallery-images', AdminProjectGalleryImageViewSet, basename='admin-gallery')
router.register(r'admin/experience', AdminExperienceViewSet, basename='admin-experience')
router.register(r'admin/education', AdminEducationViewSet, basename='admin-education')
router.register(r'admin/skills', AdminSkillViewSet, basename='admin-skills')
router.register(r'admin/certifications', AdminCertificationViewSet, basename='admin-certifications')
router.register(r'admin/media', AdminMediaAssetViewSet, basename='admin-media')
router.register(r'admin/inquiries', AdminContactInquiryViewSet, basename='admin-inquiries')

urlpatterns = [
    # Public endpoints
    path('profile/', PublicProfileView.as_view(), name='public-profile'),
    path('skills/', PublicSkillListView.as_view(), name='public-skills'),
    path('projects/', PublicProjectListView.as_view(), name='public-projects'),
    path('projects/<slug:slug>/', PublicProjectDetailView.as_view(), name='public-project-detail'),
    path('experience/', PublicExperienceListView.as_view(), name='public-experience'),
    path('education/', PublicEducationListView.as_view(), name='public-education'),
    path('certifications/', PublicCertificationListView.as_view(), name='public-certifications'),
    path('contact/', PublicContactCreateView.as_view(), name='public-contact'),

    # Admin custom endpoints
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('admin/profile/', AdminProfileView.as_view(), name='admin-profile'),

    # Admin router endpoints
    path('', include(router.urls)),
]
