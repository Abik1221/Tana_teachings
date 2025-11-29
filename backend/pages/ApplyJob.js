import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ApplyJob = () => {
  const { jobId } = useParams();
  const [coverLetter, setCoverLetter] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/mentors/applications', { jobId, coverLetter });
      alert('Application submitted!');
      navigate('/mentor/jobs');
    } catch (err) {
      alert('Error applying');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Apply to Job {jobId}</h2>
      <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Cover Letter" required />
      <button type="submit">Submit Application</button>
    </form>
  );
};

export default ApplyJob;