import React, { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  Save,
  X,
  ChevronDown,
  Check,
  XCircle,
} from "lucide-react";
import { showSuccess, showError } from "../utils/toast";

const ParentJobsResponses = ({ addNotification }) => {
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  // Inside loadJobs or wherever you trigger notifications
  const loadJobs = () => {
    const email = localStorage.getItem("email");
    const allJobs = JSON.parse(localStorage.getItem("parentJobs") || "[]");
    const parentJobs = allJobs.filter((job) => job.parentEmail === email);
    setJobs(parentJobs);

    const allResponses = JSON.parse(
      localStorage.getItem("mentorResponses") || "[]"
    );

    parentJobs.forEach((job) => {
      allResponses.forEach((res) => {
        if (!res.notified && res.jobId === job.id && addNotification) {
          // Add parentEmail to notification
          const notification = {
            id: res.id,
            mentorName: res.mentorName,
            jobId: job.id,
            parentEmail: job.parentEmail, // <-- important
            date: new Date().toISOString(),
            read: false,
          };
          addNotification(notification);

          // Mark response as notified to prevent duplicates
          res.notified = true;
        }
      });
    });

    localStorage.setItem("mentorResponses", JSON.stringify(allResponses));
  };

  // Delete job
  // Delete job based on its createdAt or unique post id
  const handleDelete = (postId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    const allJobs = JSON.parse(localStorage.getItem("parentJobs") || "[]");

    // Filter out the job with the given post ID
    const updatedJobs = allJobs.filter((job) => job.createdAt !== postId);

    localStorage.setItem("parentJobs", JSON.stringify(updatedJobs));
    showSuccess("Job deleted successfully!");
    loadJobs(); // reload jobs after deletion
  };

  const startEdit = (job) => {
    setEditingJobId(job.id);
    setEditedJob({ ...job });
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setEditedJob({});
  };

  const handleSaveEdit = () => {
    if (!editedJob.address.trim()) return showError("Address is required!");

    let allJobs = JSON.parse(localStorage.getItem("parentJobs") || "[]");
    const updatedJobs = allJobs.map((job) =>
      job.id === editedJob.id ? editedJob : job
    );

    localStorage.setItem("parentJobs", JSON.stringify(updatedJobs));
    showSuccess("Job updated successfully!");
    cancelEdit();
    loadJobs();
  };

  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  // Accept/reject mentor response
  const handleMentorStatus = (jobId, responseId, status) => {
    let allResponses = JSON.parse(
      localStorage.getItem("mentorResponses") || "[]"
    );
    allResponses = allResponses.map((r) => {
      if (r.id === responseId && r.jobId === jobId) return { ...r, status };
      return r;
    });
    localStorage.setItem("mentorResponses", JSON.stringify(allResponses));
    showSuccess(`Mentor ${status}!`);
    loadJobs();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Manage My Posted Jobs
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet.</p>
      ) : (
        jobs.map((job) => {
          const mentorResponses = JSON.parse(
            localStorage.getItem("mentorResponses") || "[]"
          ).filter((r) => r.jobId === job.id);

          return (
            <div
              key={job.id}
              className="border p-5 rounded-lg bg-gray-50 space-y-4"
            >
              {editingJobId === job.id ? (
                <div className="space-y-2">
                  {/* Edit form */}
                  <input
                    className="w-full border px-3 py-2 rounded"
                    value={editedJob.address}
                    onChange={(e) =>
                      setEditedJob({ ...editedJob, address: e.target.value })
                    }
                    placeholder="Address"
                  />
                  <textarea
                    className="w-full border px-3 py-2 rounded"
                    value={editedJob.description}
                    onChange={(e) =>
                      setEditedJob({
                        ...editedJob,
                        description: e.target.value,
                      })
                    }
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    value={editedJob.salary}
                    onChange={(e) =>
                      setEditedJob({
                        ...editedJob,
                        salary: Number(e.target.value),
                      })
                    }
                    placeholder="Salary"
                  />

                  {editedJob.students?.map((student, idx) => (
                    <div key={idx} className="border p-2 rounded space-y-1">
                      <p className="font-semibold">Student #{idx + 1}</p>
                      <input
                        className="w-full border px-2 py-1 rounded"
                        value={student.name || ""}
                        onChange={(e) =>
                          setEditedJob((prev) => {
                            const students = [...prev.students];
                            students[idx].name = e.target.value;
                            return { ...prev, students };
                          })
                        }
                        placeholder="Student Name"
                      />
                      <input
                        className="w-full border px-2 py-1 rounded"
                        value={student.class || ""}
                        onChange={(e) =>
                          setEditedJob((prev) => {
                            const students = [...prev.students];
                            students[idx].class = e.target.value;
                            return { ...prev, students };
                          })
                        }
                        placeholder="Grade Level"
                      />
                      <input
                        className="w-full border px-2 py-1 rounded"
                        value={student.gender || ""}
                        onChange={(e) =>
                          setEditedJob((prev) => {
                            const students = [...prev.students];
                            students[idx].gender = e.target.value;
                            return { ...prev, students };
                          })
                        }
                        placeholder="Gender"
                      />
                      <input
                        className="w-full border px-2 py-1 rounded"
                        value={student.profilePicture || ""}
                        onChange={(e) =>
                          setEditedJob((prev) => {
                            const students = [...prev.students];
                            students[idx].profilePicture = e.target.value;
                            return { ...prev, students };
                          })
                        }
                        placeholder="Profile Picture URL"
                      />
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 text-white px-4 py-1 rounded flex items-center gap-1"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-4 py-1 rounded flex items-center gap-1"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Job Info */}
                  <div className="space-y-1">
                    <p>
                      <strong>Address:</strong> {job.address}
                    </p>
                    <p>
                      <strong>Description:</strong> {job.description}
                    </p>
                    <p>
                      <strong>Salary:</strong> {job.salary} ETB/month
                    </p>
                    <p>
                      <strong>Total Students:</strong>{" "}
                      {job.students?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Students */}
                  <div className="border-t pt-3 space-y-2">
                    <p className="font-semibold text-gray-800">
                      Students Details:
                    </p>
                    {job.students?.map((student, index) => (
                      <div
                        key={index}
                        className="bg-white border rounded-md p-3 shadow-sm flex items-center gap-4"
                      >
                        {student.profilePicture && (
                          <img
                            src={student.profilePicture}
                            alt={student.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p>
                            <strong>Name:</strong> {student.name}
                          </p>
                          <p>
                            <strong>Grade Level:</strong> {student.class}
                          </p>
                          <p>
                            <strong>Gender:</strong> {student.gender}
                          </p>
                          <p>
                            <strong>Subjects:</strong>{" "}
                            {student.subjects?.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mentor Responses */}
                  <div className="border-t pt-3 space-y-2">
                    <button
                      onClick={() => toggleExpand(job.id)}
                      className="flex items-center gap-2 text-indigo-600 font-semibold"
                    >
                      Mentor Responses ({mentorResponses.length})
                      <ChevronDown size={16} />
                    </button>

                    {expandedJobId === job.id && mentorResponses.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {mentorResponses.map((res) => (
                          <div
                            key={res.id}
                            className="border p-3 rounded-md bg-gray-100 flex justify-between items-center"
                          >
                            <div>
                              <p>
                                <strong>Mentor:</strong> {res.mentorName}
                              </p>
                              <p>
                                <strong>Email:</strong> {res.mentorEmail}
                              </p>
                              <p>
                                <strong>Grade Level:</strong> {res.gradeLevel}
                              </p>
                              <p>
                                <strong>Subjects:</strong>{" "}
                                {res.subjects.join(", ")}
                              </p>
                              <p>
                                <strong>Message:</strong> {res.message}
                              </p>
                              <p>
                                <strong>Status:</strong>{" "}
                                <span
                                  className={`${
                                    res.status === "accepted"
                                      ? "text-green-600"
                                      : res.status === "rejected"
                                      ? "text-red-600"
                                      : "text-yellow-600"
                                  } font-semibold`}
                                >
                                  {res.status || "pending"}
                                </span>
                              </p>
                            </div>
                            {res.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleMentorStatus(
                                      job.id,
                                      res.id,
                                      "accepted"
                                    )
                                  }
                                  className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                >
                                  <Check size={16} /> Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleMentorStatus(
                                      job.id,
                                      res.id,
                                      "rejected"
                                    )
                                  }
                                  className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                >
                                  <XCircle size={16} /> Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {expandedJobId === job.id &&
                      mentorResponses.length === 0 && (
                        <p className="text-gray-500 mt-2">
                          No mentor responses yet.
                        </p>
                      )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => startEdit(job)}
                      className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.createdAt)} // use createdAt as post ID
                      className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ParentJobsResponses;
