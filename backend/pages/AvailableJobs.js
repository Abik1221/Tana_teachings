import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/mentors/jobs/available');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.map((job) => (
        <div key={job._id} className="card mb-3">
          <div className="card-body">
            <h5>{job.subject}</h5>
            <p>{job.description}</p>
            <Link to={`/mentor/apply/${job._id}`} className="btn btn-primary">Apply</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableJobs;