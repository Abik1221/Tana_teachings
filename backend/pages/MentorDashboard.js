import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const MentorDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Welcome, Mentor {user.email}!</h2>
      <Link to="/mentor/jobs" className="btn btn-primary">Browse Jobs</Link>
      <Link to="/mentor/sessions" className="btn btn-secondary ms-2">My Sessions</Link>
    </div>
  );
};

export default MentorDashboard;