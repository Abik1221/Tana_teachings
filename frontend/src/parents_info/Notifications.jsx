import React, { useState, useEffect } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const allResponses =
      JSON.parse(localStorage.getItem("mentorResponses") || "[]") || [];

    // Filter only notifications for this parent
    const parentNotifications = allResponses
      .filter((r) => {
        const allJobs = JSON.parse(localStorage.getItem("parentJobs") || "[]");
        const job = allJobs.find((j) => j.id === r.jobId);
        return job?.parentEmail === email;
      })
      .map((r) => ({
        id: r.id,
        mentorName: r.mentorName,
        jobId: r.jobId,
        read: r.read || false,
        date: new Date().toISOString(),
      }));

    setNotifications(parentNotifications);
  }, []);

  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);

    const allResponses =
      JSON.parse(localStorage.getItem("mentorResponses") || "[]") || [];
    const updatedResponses = allResponses.map((r) =>
      r.id === id ? { ...r, read: true } : r
    );
    localStorage.setItem("mentorResponses", JSON.stringify(updatedResponses));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Notifications</h2>

      {notifications.length === 0 && <p>No notifications yet.</p>}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 rounded border cursor-pointer ${
            n.read ? "bg-gray-100" : "bg-indigo-50"
          }`}
          onClick={() => markAsRead(n.id)}
        >
          <p>
            <strong>{n.mentorName}</strong> applied to your job #{n.jobId}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(n.date).toLocaleString()}
          </p>
          {!n.read && (
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
