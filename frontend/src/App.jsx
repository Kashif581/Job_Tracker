
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  FileText,
  Settings,
  Search,
  Bell,
  Plus,
  MapPin,
  CalendarDays,
  ExternalLink,
  Pencil,
  Trash2,
  LogOut,
  X,
  ChevronDown,
  Building2,
  Clock3,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  Filter,
  Briefcase,
  LockKeyhole,
  Moon,
  Sun,
} from "lucide-react";

import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "./services/api";

import "./App.css";

const initialForm = {
  company: "",
  position: "",
  location: "",
  job_type: "",
  status: "SAVED",
  job_url: "",
  source: "",
  salary: "",
  applied_date: "",
  deadline: "",
  notes: "",
};

const statusOptions = [
  { value: "SAVED", label: "Saved" },
  { value: "APPLIED", label: "Applied" },
  { value: "ASSESSMENT", label: "Assessment" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

const jobTypeOptions = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
  { value: "REMOTE", label: "Remote" },
];

const statusLabels = {
  SAVED: "Saved",
  APPLIED: "Applied",
  ASSESSMENT: "Assessment",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(company = "") {
  return company
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "?";
}

function getStatusClass(status) {
  return (status || "SAVED").toLowerCase();
}

function getJobTypeLabel(value) {
  return jobTypeOptions.find((item) => item.value === value)?.label || "—";
}

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={21} />
      </div>

      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h2>{value}</h2>
        <span className="stat-description">{description}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      <span className="status-dot" />
      {statusLabels[status] || status}
    </span>
  );
}

function ApplicationModal({
  formData,
  editingJob,
  submitting,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="application-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">APPLICATION DETAILS</span>
            <h2>{editingJob ? "Update application" : "Add new application"}</h2>
            <p>
              {editingJob
                ? "Make changes to your job application."
                : "Keep track of a new opportunity in your job search."}
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="company">Company name *</label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={onChange}
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Job position *</label>
                <input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={onChange}
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={onChange}
                  placeholder="e.g. Lahore, Pakistan"
                />
              </div>

              <div className="form-group">
                <label htmlFor="job_type">Employment type</label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={onChange}
                >
                  <option value="">Select type</option>
                  {jobTypeOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Application status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  required
                >
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="source">Where did you find this job?</label>
                <input
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={onChange}
                  placeholder="e.g. LinkedIn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="applied_date">Date applied</label>
                <input
                  id="applied_date"
                  name="applied_date"
                  type="date"
                  value={formData.applied_date}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="deadline">Application deadline</label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">Expected salary</label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={onChange}
                  placeholder="e.g. 100000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="job_url">Job posting URL</label>
                <input
                  id="job_url"
                  name="job_url"
                  type="url"
                  value={formData.job_url}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={onChange}
                  placeholder="Add interview details, reminders, or other notes..."
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingJob
                  ? "Save changes"
                  : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("careerflow-theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("careerflow-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light");
  };

  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingJob, setEditingJob] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadJobs = async () => {
    const data = await getJobs(username, password);
    setJobs(data.results || data);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await getJobs(username, password);
      setJobs(data.results || data);
      setIsAuthenticated(true);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Invalid username or password."
          : "Unable to connect to the server. Please check that your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setJobs([]);
    setSearchTerm("");
    setStatusFilter("ALL");
    setShowModal(false);
    setError("");
    setSuccess("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingJob(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company || "",
      position: job.position || "",
      location: job.location || "",
      job_type: job.job_type || "",
      status: job.status || "SAVED",
      job_url: job.job_url || "",
      source: job.source || "",
      salary: job.salary || "",
      applied_date: job.applied_date || "",
      deadline: job.deadline || "",
      notes: job.notes || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingJob(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const payload = {
      ...formData,
      salary: formData.salary ? formData.salary : null,
      applied_date: formData.applied_date || null,
      deadline: formData.deadline || null,
    };

    try {
      if (editingJob) {
        await updateJob(editingJob.id, payload, username, password);
        setSuccess("Application updated successfully.");
      } else {
        await createJob(payload, username, password);
        setSuccess("Application added successfully.");
      }

      await loadJobs();
      setShowModal(false);
      setEditingJob(null);
      setFormData(initialForm);
    } catch (err) {
      const responseData = err.response?.data;

      setError(
        typeof responseData === "object"
          ? Object.entries(responseData)
              .map(([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`
              )
              .join(" | ")
          : "Unable to save the application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteJob(jobId, username, password);
      setJobs((previous) => previous.filter((job) => job.id !== jobId));
      setSuccess("Application deleted successfully.");
    } catch {
      setError("Unable to delete this application. Please try again.");
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        job.company?.toLowerCase().includes(search) ||
        job.position?.toLowerCase().includes(search) ||
        job.location?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const count = (status) =>
      jobs.filter((job) => job.status === status).length;

    return {
      total: jobs.length,
      interviews: count("INTERVIEW"),
      offers: count("OFFER"),
      rejected: count("REJECTED"),
    };
  }, [jobs]);

  const pipeline = useMemo(() => {
    return statusOptions.map((item) => ({
      ...item,
      count: jobs.filter((job) => job.status === item.value).length,
    }));
  }, [jobs]);

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-brand">
          <div className="brand-mark">
            <BriefcaseBusiness size={24} />
          </div>
          <span>CareerFlow</span>
        </div>

        <div className="login-card">
          <div className="login-icon">
            <LockKeyhole size={24} />
          </div>

          <span className="eyebrow">WELCOME BACK</span>
          <h1>Sign in to CareerFlow</h1>
          <p className="login-subtitle">
            Manage your job search and keep every opportunity organized.
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button
              type="submit"
              className="button button-primary login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login-footer">
            Your personal workspace for a more organized job search.
          </p>
        </div>

        <p className="login-copyright">
          © 2026 CareerFlow. Built to support your next career move.
        </p>
      </div>
    );
  }

  return (
    <div className={`app-shell ${theme === "dark" ? "dark-theme" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">
            <BriefcaseBusiness size={21} />
          </div>
          <span>CareerFlow</span>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">WORKSPACE</span>

          <nav className="sidebar-nav">
            <button className="nav-item active" type="button">
              <LayoutDashboard size={19} />
              <span>Overview</span>
            </button>

            <button
              className="nav-item"
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                document
                  .getElementById("applications-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Briefcase size={19} />
              <span>Applications</span>
              <span className="nav-count">{jobs.length}</span>
            </button>

            <button
              className="nav-item"
              type="button"
              onClick={() => setSuccess("Resume management will be added in a future step.")}
            >
              <FileText size={19} />
              <span>My Resumes</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon">
              <TrendingUp size={18} />
            </div>
            <h4>Keep moving forward</h4>
            <p>Small steps every day bring you closer to your next opportunity.</p>
          </div>

          <button className="nav-item" type="button" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>Overview</strong>
          </div>

          <div className="topbar-right">
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
              <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </button>

            <span className="topbar-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            <div className="profile-divider" />

            <div className="profile-menu">
              <div className="profile-avatar">
                {getInitials(username)}
              </div>
              <div className="profile-info">
                <strong>{username}</strong>
                <span>Personal workspace</span>
              </div>
              <ChevronDown size={16} className="profile-chevron" />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-section">
            <div>
              <span className="eyebrow">YOUR CAREER DASHBOARD</span>
              <h1>Good to see you, {username}!</h1>
              <p>
                Here's an overview of your job search. Keep track of your
                opportunities and stay organized.
              </p>
            </div>

            <button
              className="button button-primary add-button"
              onClick={openAddModal}
              type="button"
            >
              <Plus size={19} />
              Add application
            </button>
          </section>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
              <button type="button" onClick={() => setError("")}>
                <X size={16} />
              </button>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span>{success}</span>
              <button type="button" onClick={() => setSuccess("")}>
                <X size={16} />
              </button>
            </div>
          )}

          <section className="stats-grid">
            <StatCard
              title="Applications loaded"
              value={stats.total}
              description="Records on this page"
              icon={BriefcaseBusiness}
              color="blue"
            />

            <StatCard
              title="Interviews"
              value={stats.interviews}
              description="Interview stage"
              icon={Users}
              color="purple"
            />

            <StatCard
              title="Offers"
              value={stats.offers}
              description="Offers received"
              icon={CheckCircle2}
              color="green"
            />

            <StatCard
              title="Rejected"
              value={stats.rejected}
              description="Unsuccessful applications"
              icon={XCircle}
              color="orange"
            />
          </section>

          <section className="dashboard-grid">
            <div className="panel pipeline-panel">
              <div className="panel-heading">
                <div>
                  <h2>Application pipeline</h2>
                  <p>See where your applications stand.</p>
                </div>
                <div className="panel-heading-icon">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="pipeline-list">
                {pipeline.map((item) => {
                  const percentage =
                    jobs.length > 0
                      ? (item.count / jobs.length) * 100
                      : 0;

                  return (
                    <div className="pipeline-row" key={item.value}>
                      <div className="pipeline-label">
                        <span>{item.label}</span>
                        <strong>{item.count}</strong>
                      </div>

                      <div className="pipeline-track">
                        <div
                          className={`pipeline-fill ${getStatusClass(item.value)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="panel-footnote">
                Based on the applications currently loaded.
              </p>
            </div>

            <div className="panel quick-panel">
              <div className="panel-heading">
                <div>
                  <h2>Job search snapshot</h2>
                  <p>A quick look at your activity.</p>
                </div>
                <div className="panel-heading-icon">
                  <CalendarDays size={18} />
                </div>
              </div>

              <div className="snapshot-item">
                <div className="snapshot-icon blue">
                  <BriefcaseBusiness size={18} />
                </div>
                <div>
                  <strong>{stats.total} applications</strong>
                  <span>Currently loaded in your workspace</span>
                </div>
              </div>

              <div className="snapshot-item">
                <div className="snapshot-icon purple">
                  <Clock3 size={18} />
                </div>
                <div>
                  <strong>{stats.interviews} interviews</strong>
                  <span>Opportunities progressing</span>
                </div>
              </div>

              <div className="snapshot-item">
                <div className="snapshot-icon green">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <strong>{stats.offers} offers</strong>
                  <span>Potential next career moves</span>
                </div>
              </div>

              <button
                className="text-button"
                type="button"
                onClick={openAddModal}
              >
                Track a new opportunity <Plus size={16} />
              </button>
            </div>
          </section>

          <section className="panel applications-panel" id="applications-section">
            <div className="applications-heading">
              <div>
                <h2>My applications</h2>
                <p>Manage and monitor your job opportunities.</p>
              </div>

              <button
                className="button button-primary table-add-button"
                type="button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Add new
              </button>
            </div>

            <div className="table-toolbar">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search company, position or location..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="filter-box">
                <Filter size={17} />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="ALL">All statuses</option>
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>COMPANY & POSITION</th>
                    <th>LOCATION</th>
                    <th>TYPE</th>
                    <th>DATE APPLIED</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div className="company-cell">
                          <div className="company-avatar">
                            {getInitials(job.company)}
                          </div>

                          <div className="company-details">
                            <strong>{job.company}</strong>
                            <span>{job.position}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="location-cell">
                          <MapPin size={15} />
                          {job.location || "Not specified"}
                        </div>
                      </td>

                      <td>
                        <span className="type-label">
                          {getJobTypeLabel(job.job_type)}
                        </span>
                      </td>

                      <td>
                        <span className="date-cell">
                          {formatDate(job.applied_date)}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={job.status} />
                      </td>

                      <td>
                        <div className="table-actions">
                          {job.job_url && (
                            <a
                              className="action-icon"
                              href={job.job_url}
                              target="_blank"
                              rel="noreferrer"
                              title="Open job posting"
                              aria-label="Open job posting"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}

                          <button
                            type="button"
                            className="action-icon"
                            onClick={() => handleEditClick(job)}
                            title="Edit application"
                            aria-label="Edit application"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="action-icon delete-action"
                            onClick={() => handleDeleteJob(job.id)}
                            title="Delete application"
                            aria-label="Delete application"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan="6">
                        <div className="empty-state">
                          <div className="empty-icon">
                            <Building2 size={25} />
                          </div>
                          <h3>
                            {jobs.length === 0
                              ? "No applications yet"
                              : "No matching applications"}
                          </h3>
                          <p>
                            {jobs.length === 0
                              ? "Add your first job application to start tracking your career journey."
                              : "Try changing your search or status filter."}
                          </p>

                          {jobs.length === 0 && (
                            <button
                              className="button button-primary"
                              type="button"
                              onClick={openAddModal}
                            >
                              <Plus size={17} />
                              Add your first application
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                Showing {filteredJobs.length} of {jobs.length} loaded applications
              </span>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>CareerFlow · Your job search, organized.</span>
            <span>Keep learning. Keep applying. Keep growing.</span>
          </footer>
        </div>
      </main>

      {showModal && (
        <ApplicationModal
          formData={formData}
          editingJob={editingJob}
          submitting={submitting}
          onChange={handleChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default App;
