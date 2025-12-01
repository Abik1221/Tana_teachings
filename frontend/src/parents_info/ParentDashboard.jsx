import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ParentProfile from "./ParentProfile";
import ParentJobsResponses from "../parents_info/ParentJobsResponses";
import ExploreMentors from "../components/ExploreMentors";

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64">
        {activeTab === "ParentProfile" && <ParentProfile />}
        {activeTab === "ParentJobsResponses" && <ParentJobsResponses />}
        {activeTab === "ExploreMentors" && <ExploreMentors />}
      </main>
    </div>
  );
};

export default ParentDashboard;
