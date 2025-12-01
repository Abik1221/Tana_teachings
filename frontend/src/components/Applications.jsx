import React, { useState, useEffect } from 'react';

const Applications = ({ jobListings, profile, handleJobApplication, selectedJob }) => {
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    hourlyRate: '',
    availability: '',
    qualifications: ''
  });

  // Auto-select the job if coming from JobFinder
  useEffect(() => {
    if (selectedJob) {
      setSelectedJobId(selectedJob.id);
      // You can pre-fill some application data based on the selected job
      setApplicationData(prev => ({
        ...prev,
        coverLetter: `I'm interested in applying for the ${selectedJob.title} position...`,
        hourlyRate: profile.hourlyRate || ''
      }));
    }
  }, [selectedJob, profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedJobId) {
      alert('Please select a job to apply for');
      return;
    }
    
    handleJobApplication(selectedJobId, applicationData);
    // Reset form after submission
    setSelectedJobId('');
    setApplicationData({
      coverLetter: '',
      hourlyRate: '',
      availability: '',
      qualifications: ''
    });
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Job Applications</h2>
        <p className="text-gray-600 mb-6">Apply to jobs that match your skills and experience</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Job to Apply For
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
              required
            >
              <option value="">Choose a job...</option>
              {jobListings
                .filter(job => !job.applied)
                .map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.company} ({job.location})
                  </option>
                ))
              }
            </select>
          </div>

          {/* If a job is selected from JobFinder, show a confirmation message */}
          {selectedJob && selectedJobId === selectedJob.id && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-green-600 font-semibold">
                You're applying for: <strong>{selectedJob.title}</strong>
              </p>
            </div>
          )}

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter
            </label>
            <textarea
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData(prev => ({
                ...prev,
                coverLetter: e.target.value
              }))}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="Explain why you're a good fit for this position..."
              required
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Hourly Rate (ETB)
            </label>
            <input
              type="number"
              value={applicationData.hourlyRate}
              onChange={(e) => setApplicationData(prev => ({
                ...prev,
                hourlyRate: e.target.value
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your expected hourly rate"
              required
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Availability
            </label>
            <textarea
              value={applicationData.availability}
              onChange={(e) => setApplicationData(prev => ({
                ...prev,
                availability: e.target.value
              }))}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="Describe your available days and times..."
              required
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Qualifications
            </label>
            <textarea
              value={applicationData.qualifications}
              onChange={(e) => setApplicationData(prev => ({
                ...prev,
                qualifications: e.target.value
              }))}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
              placeholder="List any additional qualifications or experience..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Applications;