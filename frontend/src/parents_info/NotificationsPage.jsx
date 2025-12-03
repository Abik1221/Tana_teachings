import React, { useEffect, useState } from "react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(stored);
  }, []);

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  if (notifications.length === 0)
    return <div className="text-gray-500 p-4">No notifications yet.</div>;

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 rounded shadow flex justify-between items-center ${
            n.read ? "bg-gray-100" : "bg-indigo-100"
          }`}
        >
          <div>
            <p className="font-medium">{n.text}</p>
            <p className="text-xs text-gray-500">
              {n.date && new Date(n.date).toLocaleString()}
            </p>
          </div>
          <button
            className="text-sm text-red-600 hover:underline"
            onClick={() => deleteNotification(n.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
