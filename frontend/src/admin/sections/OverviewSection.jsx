import React, { useState, useMemo } from "react";
import { Users, Briefcase, FileText, ClipboardList } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const hideScrollbar = { scrollbarWidth: "none", msOverflowStyle: "none" };
const hideScrollbarWebkit = `
  ::-webkit-scrollbar { display: none; }
`;

export default function OverviewSection() {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const [statusFilter, setStatusFilter] = useState("All"); // New filter state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const stats = [
    {
      label: "Users",
      value: 1240,
      icon: <Users className="text-indigo-600" size={24} />,
      color: "bg-gradient-to-r from-indigo-100 to-indigo-200",
    },
    {
      label: "Active mentors",
      value: 1240,
      icon: <Users className="text-green-600" size={24} />,
      color: "bg-gradient-to-r from-green-100 to-green-200",
    },
    {
      label: "Active Families",
      value: 1240,
      icon: <Users className="text-blue-600" size={24} />,
      color: "bg-gradient-to-r from-blue-100 to-blue-200",
    },
    {
      label: "Jobs",
      value: 342,
      icon: <Briefcase className="text-green-700" size={24} />,
      color: "bg-gradient-to-r from-green-200 to-green-300",
    },
    {
      label: "Applications",
      value: 875,
      icon: <FileText className="text-yellow-600" size={24} />,
      color: "bg-gradient-to-r from-yellow-100 to-yellow-200",
    },
    {
      label: "Reports",
      value: 56,
      icon: <ClipboardList className="text-red-600" size={24} />,
      color: "bg-gradient-to-r from-red-100 to-red-200",
    },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Jobs",
        data: [30, 50, 40, 60, 70, 50],
        backgroundColor: "#6366F1",
      },
      {
        label: "Applications",
        data: [20, 40, 50, 45, 60, 55],
        backgroundColor: "#FBBF24",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Jobs vs Applications" },
    },
    maintainAspectRatio: false,
  };

  const activities = [
    {
      user: "John Doe",
      action: "Applied for Job",
      date: "2025-12-02",
      status: "Success",
    },
    {
      user: "Jane Smith",
      action: "New Job Posted",
      date: "2025-12-01",
      status: "Pending",
    },
    {
      user: "Mark Lee",
      action: "Profile Updated",
      date: "2025-11-30",
      status: "Info",
    },
    {
      user: "Anna Taylor",
      action: "Applied for Job",
      date: "2025-11-29",
      status: "Success",
    },
    {
      user: "Peter Pan",
      action: "Profile Updated",
      date: "2025-11-28",
      status: "Info",
    },
    {
      user: "Lucy Liu",
      action: "New Job Posted",
      date: "2025-11-27",
      status: "Pending",
    },
  ];

  const filteredActivities = useMemo(() => {
    let filtered = activities.filter(
      (a) =>
        a.user.toLowerCase().includes(search.toLowerCase()) ||
        a.action.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [activities, search, sortConfig, statusFilter]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split("-");
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 shadow transition">
          Generate Report
        </button>
      </div>

      {/* Stats Cards */}
      <div
        className="flex space-x-4 overflow-x-auto py-2"
        style={hideScrollbar}
      >
        <style>{hideScrollbarWebkit}</style>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex-shrink-0 w-64 flex items-center justify-between p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">
                {stat.label}
              </span>
              <span className="text-2xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
            <div
              className={`p-4 rounded-full ${stat.color} flex items-center justify-center shadow-inner`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl shadow-md bg-white h-[400px]">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="p-4 rounded-xl shadow-md bg-white overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activities
        </h2>

        {/* Filters + Sort + Status */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 px-3 py-2 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Info">Info</option>
          </select>
          <select
            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={handleSortChange}
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="user-asc">User: A-Z</option>
            <option value="user-desc">User: Z-A</option>
            <option value="action-asc">Action: A-Z</option>
            <option value="action-desc">Action: Z-A</option>
            <option value="status-asc">Status: A-Z</option>
            <option value="status-desc">Status: Z-A</option>
          </select>
        </div>

        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              {["User", "Action", "Date", "Status"].map((header) => (
                <th key={header} className="py-2 px-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((a, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="py-2 px-3">{a.user}</td>
                <td className="py-2 px-3">{a.action}</td>
                <td className="py-2 px-3">{a.date}</td>
                <td
                  className={`py-2 px-3 font-semibold rounded-full text-center ${
                    a.status === "Success"
                      ? "bg-green-100 text-green-700"
                      : a.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {a.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2 items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Prev
          </button>
          <span className="px-2 py-1 font-medium">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
