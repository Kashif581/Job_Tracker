from django.contrib import admin
from .models import JobApplication, Resume

# Register your models here.
# This file is responsible to register models in Django Admin
# Django provides a built-in administration dashboard.
# By registering our models, we can manage database records through a web interface

admin.site.register(JobApplication)
admin.site.register(Resume)


