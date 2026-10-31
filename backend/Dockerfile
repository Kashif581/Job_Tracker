
# Start with an official Python image.
FROM python:3.12-slim

# Set the working directory inside the container.
WORKDIR /app

# Prevent Python from creating unnecessary cache files.
ENV PYTHONDONTWRITEBYTECODE=1

# Show Python output immediately in Docker logs.
ENV PYTHONUNBUFFERED=1

# Copy dependency list first.
COPY requirements.txt .

# Install Python dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project into the container.
COPY . .

# Django development server port.
EXPOSE 8000

# Start Django so it accepts connections from outside the container.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
