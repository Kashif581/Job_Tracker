from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import JobApplicationViewSet

# DefaultRouter: Normally, we would manually define every endpoint. But DRF's router automatically generates routes for our ViewSet.


router = DefaultRouter()

router.register(
    r"jobs",
    JobApplicationViewSet,
    basename="job"
)

urlpatterns = [
    path("", include(router.urls)),
]

# Instead of manually creating six URLs, DRF's router generates them automatically.