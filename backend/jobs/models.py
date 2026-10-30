from django.db import models
from django.contrib.auth.models import User

# Create your models here.
# In this file we are defining our Database Structure
# Django already provides a built-in User model through django.contrib.auth.

class Resume(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="resumes"
    )

    original_filename = models.CharField(max_length=255)
    s3_key = models.CharField(max_length=500, unique=True)

    content_type = models.CharField(max_length=100)

    file_size = models.BigIntegerField()

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.original_filename


class JobApplication(models.Model):

    class Status(models.TextChoices):
        SAVED = "SAVED", "Saved"
        APPLIED = "APPLIED", "Applied"
        ASSESMENT = "ASSESSMENT", "Assessment"
        INTERVIEW = "INTERVIEW", "Interview"
        OFFER = "OFFER", "offer"
        REJECTED = "REJECTED", "Rejected"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"

    class JobType(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full_time"
        PART_TIME = "PART_TIME", "Part_time"
        INTERNSHIP = "INTERNSHIP", "Internship"
        CONTRACT = "CONTRACT", "Contract"
        REMOTE = "REMOTE", "Remote"


    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="job_applications"
    )

    resume = models.ForeignKey(
        Resume,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="applications"
    )

    company = models.CharField(max_length=150)

    position = models.CharField(max_length=150)

    location = models.CharField(max_length=150, blank=True)

    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SAVED
    )

    job_url = models.URLField(blank=True)
    source = models.CharField(max_length=100, blank=True)

    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    applied_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.position} at {self.company}"
