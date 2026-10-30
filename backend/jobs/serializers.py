from rest_framework import serializers
from .models import JobApplication

class JobApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at"
        ]

    def validate_resume(self, resume):
        request = self.context.get("request")

        if resume and resume.user != request.user:
            raise serializers.ValidationError(
                "You cannot use another user's resume"
            )

        return resume