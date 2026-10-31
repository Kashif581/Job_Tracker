from rest_framework import serializers
from .models import JobApplication

# serializers.py - The translator between python and JSON
# This is one of most important concepts in Django REST framework.
# our Django model uses python objects.
# But our React frontend communicates with the backend using HTTP and JSON.
# How do we convert between them
# we use serializers

# ModelSerializer
# This creates a serializer based on our Django model.
# Instead of manually defining every field, DRF generates serializer fields based on the model

# Serialization: Python object -> JSON-compatible data.
# Deserialization: incoming data -> validated python data.

# class JobApplicationSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = JobApplication
#         fields = "__all__"
#         read_only_fields = [
#             "id",
#             "created_at",
#             "updated_at"
#         ]

#     def validate_resume(self, resume):
#         request = self.context.get("request")

#         if resume and resume.user != request.user:
#             raise serializers.ValidationError(
#                 "You cannot use another user's resume"
#             )

#         return resume



from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobApplication
        fields = "__all__"

        # Django will assign these fields automatically.
        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

    def validate_resume(self, resume):
        request = self.context.get("request")

        if resume and resume.user != request.user:
            raise serializers.ValidationError(
                "You cannot use another user's resume."
            )

        return resume
