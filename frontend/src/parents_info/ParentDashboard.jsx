import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ParentProfile from "./ParentProfile";
import ParentJobsResponses from "../parents_info/ParentJobsResponses";
import ExploreMentors from "../components/ExploreMentors";
import ParentPostJob from "../parents_info/ParentPostJob";

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState("ParentJobsResponses");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [suggestedSubjects, setSuggestedSubjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [parentInfo, setParentInfo] = useState({ fullName: "", email: "" });
  const [notifications, setNotifications] = useState([]);

  // Load parent info, jobs, notifications
  useEffect(() => {
    const storedParentName =
      localStorage.getItem("fullName") ||
      localStorage.getItem("parentName") ||
      "Parent";
    const storedEmail = localStorage.getItem("email") || "";
    setParentInfo({ fullName: storedParentName, email: storedEmail });

    const storedJobs = JSON.parse(localStorage.getItem("parentJobs") || "[]");
    setJobs(storedJobs);

    const allSubjects = storedJobs.flatMap((job) =>
      job.students ? job.students.flatMap((s) => s.subjects) : []
    );
    setSuggestedSubjects(allSubjects);

    const storedNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    setNotifications(storedNotifications);
  }, []);

  const addNotification = (mentor, jobId) => {
    const newNotification = {
      id: Date.now(),
      mentorName: mentor.mentorName || mentor.fullName,
      jobId,
      date: new Date().toISOString(),
      read: false,
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const pageTitles = {
    ParentProfile: "Parent Profile",
    ParentPostJob: "Post a Job",
    ParentJobsResponses: "Jobs & Responses",
    ExploreMentors: "Explore Mentors",
    Notifications: "Notifications",
  };

  const handleJobPosted = (payload) => {
    const updatedJobs = [...jobs, payload];
    setJobs(updatedJobs);

    const allSubjects = updatedJobs.flatMap((job) =>
      job.students ? job.students.flatMap((s) => s.subjects) : []
    );
    setSuggestedSubjects(allSubjects);

    setActiveTab("ExploreMentors");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (activeTab) {
      case "ParentProfile":
        return <ParentProfile parentInfo={parentInfo} />;

      case "ParentJobsResponses":
        return (
          <ParentJobsResponses jobs={jobs} onNewMentor={addNotification} />
        );

      case "ParentPostJob":
        return <ParentPostJob onJobPosted={handleJobPosted} />;

      case "ExploreMentors":
        return (
          <div>
            {suggestedSubjects.length > 0 && (
              <div className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 mb-4">
                Suggested mentors based on your selected subjects.
              </div>
            )}
            <ExploreMentors
              suggestedSubjects={suggestedSubjects}
              onSelectMentor={(mentor) =>
                alert(`Selected mentor: ${mentor.fullName}`)
              }
            />
          </div>
        );

      case "Notifications":
        return (
          <div>
            {notifications.length === 0 && <p>No notifications yet.</p>}
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-2 rounded ${
                    n.read ? "bg-gray-200" : "bg-yellow-200"
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  Mentor <strong>{n.mentorName}</strong> applied to your job.
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return <ParentProfile parentInfo={parentInfo} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 w-full h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        userName={parentInfo.fullName || "Parent"}
        userEmail={parentInfo.email || ""}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        notifications={notifications}
      />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Page title inside main content */}
        <div className="p-4 md:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            {pageTitles[activeTab] || "Dashboard"}
          </h1>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
