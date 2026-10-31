from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

from .models import JobApplication
from .serializers import JobApplicationSerializer

# this file connects our URLs, serializers, models
# A ViewSet groups related API operations together.

# Without a ModelViewSet, we could write separate views for:
# - GET all applications.
# - POST a new application.
# - GET one application.
# - PUT/PATCH an application.
# - DELETE an application.
# ModelViewSet provides these standard CRUD actions automatically.

# what is serializer_class?
# it tells the viewset which serializer to use when validating incoming data and formatting responses

# What is permission_classes?
# it ensures that only authenticated users can access this API

# What is get_queryset()?
#  Suppose our database contains:
# ID	Company	User
# 1	Google	Kashif
# 2	Microsoft	Ali
# 3	Amazon	Kashif

# When Kashif logs in, the API only returns:
# Google
# Amazon

# What is perform_create()?
# When someone creates a job application, we automatically associate it with the currently authenticated user.

class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = JobApplication.objects.filter(
            user=self.request.user
        )

        # Exact filtering
        status = self.request.query_params.get("status")
        if status:
            queryset = queryset.filter(status=status.upper())

        job_type = self.request.query_params.get("job_type")
        if job_type:
            queryset = queryset.filter(job_type=job_type.upper())

        return queryset.order_by("-created_at")

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    search_fields = [
        "company",
        "position"
    ]

    ordering_fields = [
        "company",
        "position",
        "status",
        "created_at",
        "updated_at",
        "applied_date",
        "deadline",
    ]

    ordering = ["-created_at"]

    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ModelViewSet gives us these opterations automatically
# Create your views here.

