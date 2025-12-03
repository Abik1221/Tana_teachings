import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ApplicationsSection() {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);
  const [viewDetailsApp, setViewDetailsApp] = useState(null);
  const applicationsPerPage = 10;

  const statusColors = {
    pending_vetting: "bg-yellow-100 text-yellow-700",
    shortlisted: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  // Mock data setup
  useEffect(() => {
    const mockApplications = Array.from({ length: 20 }, (_, i) => ({
      _id: i + 1,
      student: {
        name: `mentor ${i + 1}`,
        email: `mentor${i + 1}@mail.com`,
        gradeLevel: `Grade ${(i % 12) + 1}`,
      },
      job: {
        title: `Job Title ${i + 1}`,
        family: { familyName: `Family ${i + 1}` },
      },
      status:
        i % 4 === 0
          ? "pending_vetting"
          : i % 4 === 1
          ? "shortlisted"
          : i % 4 === 2
          ? "approved"
          : "rejected",
      createdAt: `2025-12-${(i % 30) + 1}`,
      description: `This is the description of Job Title ${i + 1}.`,
    }));
    setApplications(mockApplications);
  }, []);

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLast = currentPage * applicationsPerPage;
  const currentApps = filteredApplications.slice(
    indexOfLast - applicationsPerPage,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage
  );

  // Mock vetting function
  const vetApplication = (appId, action) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === appId
          ? {
              ...app,
              status:
                action === "approve"
                  ? "approved"
                  : action === "reject"
                  ? "rejected"
                  : "shortlisted",
            }
          : app
      )
    );
    setConfirmAction(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          Application Vetting
        </h1>
        <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
          <input
            type="text"
            placeholder="Search applicant or job..."
            className="pl-3 pr-3 py-2 border rounded-lg shadow-sm text-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="All">All Status</option>
            <option value="pending_vetting">Pending Vetting</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm p-4">
        <table className="min-w-full text-left table-auto border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2 px-3">Applicant</th>
              <th className="py-2 px-3">Job</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Submitted</th>
              <th className="py-2 px-3 text-center">Actions</th>
              <th className="py-2 px-3 text-center">View Details</th>
            </tr>
          </thead>
          <tbody>
            {currentApps.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition">
                <td className="py-2 px-3">{app.student.name}</td>
                <td className="py-2 px-3">{app.job.title}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[app.status]
                    }`}
                  >
                    {app.status.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="py-2 px-3">{app.createdAt}</td>
                <td className="py-2 px-3 flex justify-center gap-2">
                  {app.status === "pending_vetting" && (
                    <select
                      className="border px-2 py-1 rounded text-xs cursor-pointer"
                      onChange={(e) =>
                        setConfirmAction({
                          appId: app._id,
                          action: e.target.value,
                        })
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Action
                      </option>
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                      <option value="shortlist">Shortlist</option>
                    </select>
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  <button
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700"
                    onClick={() => setViewDetailsApp(app)}
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
      <div className="flex justify-center gap-2 mt-3">
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

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setConfirmAction(null)}
            >
              <X size={22} />
            </button>
            <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
            <p className="mb-4">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {confirmAction.action.toUpperCase()}
              </span>{" "}
              this application?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() =>
                  vetApplication(confirmAction.appId, confirmAction.action)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsApp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setViewDetailsApp(null)}
            >
              <X size={22} />
            </button>
            <h3 className="text-lg font-bold mb-4">Application Details</h3>
            <p>
              <span className="font-semibold">Applicant:</span>{" "}
              {viewDetailsApp.student.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {viewDetailsApp.student.email}
            </p>
            <p>
              <span className="font-semibold">Grade Level:</span>{" "}
              {viewDetailsApp.student.gradeLevel}
            </p>
            <p>
              <span className="font-semibold">Job:</span>{" "}
              {viewDetailsApp.job.title}
            </p>
            <p>
              <span className="font-semibold">Family:</span>{" "}
              {viewDetailsApp.job.family.familyName}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {viewDetailsApp.status.replace("_", " ")}
            </p>
            <p>
              <span className="font-semibold">Submitted:</span>{" "}
              {viewDetailsApp.createdAt}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {viewDetailsApp.description}
            </p>

            {viewDetailsApp.status === "pending_vetting" && (
              <div className="mt-4 flex gap-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  onClick={() => {
                    setConfirmAction({
                      appId: viewDetailsApp._id,
                      action: "approve",
                    });
                    setViewDetailsApp(null); // automatically close modal
                  }}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  onClick={() => {
                    setConfirmAction({
                      appId: viewDetailsApp._id,
                      action: "reject",
                    });
                    setViewDetailsApp(null);
                  }}
                >
                  Reject
                </button>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  onClick={() => {
                    setConfirmAction({
                      appId: viewDetailsApp._id,
                      action: "shortlist",
                    });
                    setViewDetailsApp(null);
                  }}
                >
                  Shortlist
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
