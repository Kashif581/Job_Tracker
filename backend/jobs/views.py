from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

from .models import JobApplication
from .serializers import JobApplicationSerializer

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

