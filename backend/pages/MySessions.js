import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/api/mentors/sessions/my-sessions');
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Sessions</h2>
      {sessions.map((session) => (
        <div key={session._id} className="card mb-3">
          <div className="card-body">
            <h5>Date: {new Date(session.date).toLocaleString()}</h5>
            <p>Duration: {session.duration} minutes</p>
            <p>Notes: {session.progressNotes || 'None'}</p>
            <Link to={`/mentor/sessions/${session._id}/progress`} className="btn btn-primary">Update Progress</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MySessions;