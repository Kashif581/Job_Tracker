
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Fetch all job applications.
export const getJobs = async (username, password) => {
    const response = await axios.get(
        `${API_BASE_URL}/jobs/`,
        {
            auth: {
                username,
                password,
            },
        }
    );

    return response.data;
};

// Create a new job application.
export const createJob = async (
    jobData,
    username,
    password
) => {
    const response = await axios.post(
        `${API_BASE_URL}/jobs/`,
        jobData,
        {
            auth: {
                username,
                password,
            },
        }
    );

    return response.data;
};

// Update an existing job application.
export const updateJob = async (
    jobId,
    jobData,
    username,
    password
) => {
    const response = await axios.patch(
        `${API_BASE_URL}/jobs/${jobId}/`,
        jobData,
        {
            auth: {
                username,
                password,
            },
        }
    );

    return response.data;
};

// Delete an existing job application.
export const deleteJob = async (
    jobId,
    username,
    password
) => {
    const response = await axios.delete(
        `${API_BASE_URL}/jobs/${jobId}/`,
        {
            auth: {
                username,
                password,
            },
        }
    );

    return response.status;
};
