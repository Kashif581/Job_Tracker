from django.test import TestCase

# Create your tests here.

from django.contrib.auth.models import User
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import JobApplication


class JobApplicationAPITests(APITestCase):

    def setUp(self):
        # Create two users for testing.
        self.user1 = User.objects.create_user(
            username="kashif",
            password="testpassword123"
        )

        self.user2 = User.objects.create_user(
            username="ali",
            password="testpassword123"
        )

        # Authenticate as user1 by default.
        self.client.force_authenticate(user=self.user1)

        self.job_list_url = reverse("job-list")

        # Create a job belonging to user1.
        self.job = JobApplication.objects.create(
            user=self.user1,
            company="Google",
            position="AI Engineer",
            status="APPLIED"
        )

    def test_create_job_application(self):
        """An authenticated user can create a job application."""

        data = {
            "company": "Microsoft",
            "position": "Software Engineer",
            "status": "SAVED",
            "location": "Remote"
        }

        response = self.client.post(
            self.job_list_url,
            data,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            JobApplication.objects.count(),
            2
        )

        # The new job should belong to the logged-in user.
        new_job = JobApplication.objects.get(
            company="Microsoft"
        )

        self.assertEqual(new_job.user, self.user1)

    def test_get_job_applications(self):
        """A user can retrieve their own applications."""

        response = self.client.get(self.job_list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(response.data["count"], 1)

    def test_update_job_status(self):
        """A user can update an application's status."""

        url = reverse(
            "job-detail",
            kwargs={"pk": self.job.id}
        )

        response = self.client.patch(
            url,
            {"status": "INTERVIEW"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.job.refresh_from_db()

        self.assertEqual(
            self.job.status,
            "INTERVIEW"
        )

    def test_filter_jobs_by_status(self):
        """A user can filter applications by status."""

        JobApplication.objects.create(
            user=self.user1,
            company="Amazon",
            position="ML Engineer",
            status="INTERVIEW"
        )

        response = self.client.get(
            self.job_list_url,
            {"status": "INTERVIEW"}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(response.data["count"], 1)

        self.assertEqual(
            response.data["results"][0]["status"],
            "INTERVIEW"
        )

    def test_user_cannot_see_another_users_jobs(self):
        """A user cannot retrieve another user's application."""

        other_job = JobApplication.objects.create(
            user=self.user2,
            company="Amazon",
            position="Backend Developer"
        )

        url = reverse(
            "job-detail",
            kwargs={"pk": other_job.id}
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_user_cannot_update_another_users_jobs(self):
        """A user cannot modify another user's application."""

        other_job = JobApplication.objects.create(
            user=self.user2,
            company="Amazon",
            position="Backend Developer"
        )

        url = reverse(
            "job-detail",
            kwargs={"pk": other_job.id}
        )

        response = self.client.patch(
            url,
            {"status": "OFFER"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )
