from django.contrib import admin
from .models import JobApplication, Resume

# Register your models here.
# This file is responsible to register models in Django Admin

admin.site.register(JobApplication)
admin.site.register(Resume)


