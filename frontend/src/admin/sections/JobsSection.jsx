import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export default function JobsSection() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const jobsPerPage = 10;

  const statusColors = {
    pending_approval: "bg-yellow-100 text-yellow-700",
    open: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const priorityColors = {
    High: "bg-red-200 text-red-800",
    Medium: "bg-yellow-200 text-yellow-800",
    Low: "bg-green-200 text-green-800",
  };

  const urgencyColors = {
    Urgent: "bg-red-100 text-red-700",
    Normal: "bg-green-100 text-green-700",
  };

  useEffect(() => {
    const mockJobs = Array.from({ length: 20 }, (_, i) => ({
      _id: i + 1,
      title: `Job Title ${i + 1}`,
      family: { familyName: `Family ${i + 1}`, contactPhone: "123-456-7890" },
      student: {
        name: `Student ${i + 1}`,
        gradeLevel: `Grade ${(i % 12) + 1}`,
      },
      status:
        i % 3 === 0 ? "pending_approval" : i % 3 === 1 ? "open" : "rejected",
      priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
      urgency: i % 2 === 0 ? "Urgent" : "Normal",
      applicationCount: Math.floor(Math.random() * 10),
      notes: "Some notes for admin review",
    }));
    setJobs(mockJobs);
  }, []);

  // Filtering and searching
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.family.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.student.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || job.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const currentJobs = filteredJobs.slice(
    indexOfLastJob - jobsPerPage,
    indexOfLastJob
  );
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Mock approve/reject functions
  const approveJob = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? { ...j, status: "open" } : j))
    );
    setSelectedJob(null);
  };

  const rejectJob = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? { ...j, status: "rejected" } : j))
    );
    setSelectedJob(null);
  };

  // Inline updates for priority and urgency
  const updateJobField = (jobId, field, value) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? { ...j, [field]: value } : j))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search job or family/student..."
              className="pl-10 pr-3 py-2 border rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="All">All Status</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="open">Open</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-left table-auto border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="py-3 px-4 border-b">Title</th>
              <th className="py-3 px-4 border-b">Family</th>
              <th className="py-3 px-4 border-b">Student</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Priority</th>
              <th className="py-3 px-4 border-b">Urgency</th>
              <th className="py-3 px-4 border-b">Applications</th>
              <th className="py-3 px-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4">{job.title}</td>
                <td className="py-3 px-4">{job.family.familyName}</td>
                <td className="py-3 px-4">{job.student.name}</td>
                <td className="py-3 px-4">
                  <select
                    value={job.status}
                    onChange={(e) =>
                      updateJobField(job._id, "status", e.target.value)
                    }
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[job.status]
                    }`}
                  >
                    <option value="pending_approval">Pending Approval</option>
                    <option value="open">Open</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={job.priority}
                    onChange={(e) =>
                      updateJobField(job._id, "priority", e.target.value)
                    }
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      priorityColors[job.priority]
                    }`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={job.urgency}
                    onChange={(e) =>
                      updateJobField(job._id, "urgency", e.target.value)
                    }
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      urgencyColors[job.urgency]
                    }`}
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Normal">Normal</option>
                  </select>
                </td>
                <td className="py-3 px-4">{job.applicationCount}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    onClick={() => setSelectedJob(job)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal onClose={() => setSelectedJob(null)}>
          <h3 className="text-lg font-bold mb-3">{selectedJob.title}</h3>
          <p>
            <strong>Family:</strong> {selectedJob.family.familyName} (
            {selectedJob.family.contactPhone})
          </p>
          <p>
            <strong>Student:</strong> {selectedJob.student.name} -{" "}
            {selectedJob.student.gradeLevel}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                statusColors[selectedJob.status]
              }`}
            >
              {selectedJob.status.replace("_", " ").toUpperCase()}
            </span>
          </p>
          <p>
            <strong>Priority:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                priorityColors[selectedJob.priority]
              }`}
            >
              {selectedJob.priority}
            </span>
          </p>
          <p>
            <strong>Urgency:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                urgencyColors[selectedJob.urgency]
              }`}
            >
              {selectedJob.urgency}
            </span>
          </p>
          <p className="mt-2">
            <strong>Admin Notes:</strong> {selectedJob.notes}
          </p>

          {/* Approve/Reject Actions */}
          {selectedJob.status === "pending_approval" && (
            <div className="flex gap-3 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => approveJob(selectedJob._id)}
              >
                Approve
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => rejectJob(selectedJob._id)}
              >
                Reject
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// Modal component
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </div>
  );
}
