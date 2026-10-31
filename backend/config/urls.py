"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# This file is responsible for URL routing
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "message": "Welcome to Job Tracker API",
        "status": "Running"
    })

# when someone visits:
# http://localhost:8000/admin/
# Django directs the request to its built-in admin application.

# when someone visits:
# http://localhost:8000/api/
# Django forwards the routing responsibility to 
# include("jobs.urls")

# Because we don't want to put every API endpoint inside one central file.
# instead we keep project-level routes in config/urls.py and application-specific routes in jobs/urls.py.

urlpatterns = [
    path("", home),
    path('admin/', admin.site.urls),

    path('api/', include("jobs.urls"))
]
