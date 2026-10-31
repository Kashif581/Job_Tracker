from django.db import models
from django.contrib.auth.models import User

# This file defines the structure of our database.
# In Django, we use python calsses called models to represent database tables.
# for our job tacker, we have two main models:
# 1 - JobApplication
# 2 - Resume

# models.Model tells Django that Resume is a database model. Django will create a corresponding database table for it.
# ForeignKey: This establishes a relationship between Resume and Django's built-in User model
# on_delete=models.CASCADE means that if the user is deleted, their associated resume database records are also deleted
# s3_key is to store the location/key of the resume in Amazon S3.
# def __str__(self):
#   return self.original_filename
# it provide a human-readable representation of the object
# instead of seeing: Resume object (1) we see: CV_AI.pdf
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


# This represent a job application that a user wants to track
# Field	Meaning
# CharField	Short text
# TextField	Longer text
# URLField	URL
# DateField	Date
# DecimalField	Decimal numbers
# DateTimeField	Date and time
# ForeignKey	Relationship with another table
# what are choices?
# we don't want users entering random application statuses. we use Django's TextChoices to define an allowed set of values. This helps maintain consistency in our database and application

#  what happens when we change a model?
# suppose we add a new field. 
# company_website = models.URLField(blank=True)
# our python code has changes, but the postgresql table hasn't changed yet. that's why we use Django migrations
# migrations/ - Database schema history
# This folder contains files that descirbe changes to our database structure.
# suppose intially our JobApplication model contains
# company, position, status
# later, we add
# salary, deadline, location
# we need to update the actual database table.
# we run python manage.py makemigrations Django generates a migration file inside jobs/migrations/ then python manage.py migrate
# Command	Responsibility
# makemigrations	Generates migration instructions
# migrate	Applies migration instructions to the database
# showmigrations	Shows which migrations have been applied

# Think of migrations as version history for your database structure.

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
