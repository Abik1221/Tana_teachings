import React, { useState, useEffect } from 'react';

const JobFinder = ({ jobListings, handleJobApply, onApplyNowClick }) => {
  const [filters, setFilters] = useState({
    location: 'All Locations',
    gender: 'All Genders',
    course: 'All Courses'
  });

  const [filteredJobs, setFilteredJobs] = useState([]);

  // Filter jobs based on selected filters
  useEffect(() => {
    let filtered = jobListings.filter(job => {
      const matchesLocation = filters.location === 'All Locations' || 
        job.location?.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesGender = filters.gender === 'All Genders' ||
        (filters.gender === 'Female' && job.gender?.includes('Female')) ||
        (filters.gender === 'Male' && job.gender?.includes('Male')) ||
        (filters.gender === 'Any' && (job.gender === 'Any' || !job.gender));
      
      const matchesCourse = filters.course === 'All Courses' ||
        job.course?.toLowerCase().includes(filters.course.toLowerCase());

      return matchesLocation && matchesGender && matchesCourse;
    });
    
    setFilteredJobs(filtered);
  }, [jobListings, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyClick = (job) => {
    // Use the new function to redirect to applications
    if (onApplyNowClick) {
      onApplyNowClick(job);
    } else {
      // Fallback to old behavior
      handleJobApply(job.id);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Find Mentoring Jobs</h2>
            <p className="text-gray-600 mt-2">Browse tutoring opportunities from parents</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="p-2 lg:p-3 border border-gray-300 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-gray-400 text-sm lg:text-base"
            >
              <option>All Locations</option>
              <option>Addis Ababa</option>
              <option>Remote</option>
              <option>Bole</option>
              <option>Megenagna</option>
              <option>Other Cities</option>
            </select>
            <select 
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="p-2 lg:p-3 border border-gray-300 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-gray-400 text-sm lg:text-base"
            >
              <option>All Genders</option>
              <option>Male</option>
              <option>Female</option>
              <option>Any</option>
            </select>
            <select 
              value={filters.course}
              onChange={(e) => handleFilterChange('course', e.target.value)}
              className="p-2 lg:p-3 border border-gray-300 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-gray-400 text-sm lg:text-base"
            >
              <option>All Courses</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>General Tutoring</option>
            </select>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-gray-800 font-semibold">
              Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} matching your criteria
            </p>
            <div className="flex gap-2 text-sm">
              {filters.location !== 'All Locations' && (
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">Location: {filters.location}</span>
              )}
              {filters.gender !== 'All Genders' && (
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">Gender: {filters.gender}</span>
              )}
              {filters.course !== 'All Courses' && (
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">Course: {filters.course}</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more opportunities</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg lg:rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-lg lg:text-xl font-bold text-gray-800">{job.title}</h3>
                        <p className="text-gray-600 font-semibold text-sm lg:text-base">
                          {job.company} • {job.location}
                        </p>
                      </div>
                      <span className="text-xs lg:text-sm text-gray-500">Posted {job.postedDate}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 lg:gap-2 mt-3">
                      <span className="bg-gray-100 text-gray-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                        {job.type}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                        {job.salary}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                        {job.gender}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                        {job.course}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Job Description</h4>
                    <p className="text-gray-600 mb-4 text-sm lg:text-base">{job.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm">
                      <div>
                        <span className="text-gray-500">Students:</span>
                        <span className="text-gray-800 font-semibold ml-2">{job.studentCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-gray-800 font-semibold ml-2">{job.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Days/Week:</span>
                        <span className="text-gray-800 font-semibold ml-2">{job.schedule.daysPerWeek}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Daily Hours:</span>
                        <span className="text-gray-800 font-semibold ml-2">{job.schedule.dailyHours}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Student Details</h4>
                    {job.parentJobData?.students?.map((student, index) => (
                      <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
                        <p className="font-medium text-sm">Student {index + 1}: Grade {student.class}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Subjects: {student.subjects.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Subjects Needed:</h4>
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {job.requirements.map((req, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200 gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${
                      job.applied 
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.applied ? 'Application Submitted' : 'Open for Applications'}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-500">
                      {job.studentCount} student{job.studentCount !== 1 ? 's' : ''} • {job.duration}
                    </span>
                  </div>
                  
                  {!job.applied && (
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 lg:px-6 rounded-lg lg:rounded-xl transition-colors text-sm lg:text-base w-full sm:w-auto"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobFinder;