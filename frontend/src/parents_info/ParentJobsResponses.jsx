import React from "react";
//import { showSuccess, showError } from "../utils/toast";

const ParentJobsResponses = ({
  jobs,
  responses,
  loading,
  handleResponseAction,
}) => {
  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.description}</p>
            <p className="text-sm text-gray-500">
              Posted on: {new Date(job.datePosted).toLocaleDateString()}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Mentor Responses:</h3>

              {responses[job.id] && responses[job.id].length > 0 ? (
                <ul className="space-y-2">
                  {responses[job.id].map((resp) => (
                    <li
                      key={resp.id}
                      className="border rounded-lg p-3 bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{resp.mentorName}</p>
                        <p className="text-gray-600">{resp.message}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() =>
                            handleResponseAction(job.id, resp.id, "accept")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() =>
                            handleResponseAction(job.id, resp.id, "reject")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No responses yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ParentJobsResponses;
