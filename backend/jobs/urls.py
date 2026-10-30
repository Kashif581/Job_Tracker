from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import JobApplicationViewSet

router = DefaultRouter()

router.register(
    r"jobs",
    JobApplicationViewSet,
    basename="job"
)

urlpatterns = [
    path("", include(router.urls)),
]