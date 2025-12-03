import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Calendar, ArrowUp, ArrowDown, Download } from "lucide-react";

// MOCK DATA
const mockReports = {
  kpis: {
    totalUsers: 1240,
    totalJobs: 342,
    totalApplications: 875,
  },
  registrationTrends: [
    { month: "Jan", users: 30 },
    { month: "Feb", users: 45 },
    { month: "Mar", users: 50 },
    { month: "Apr", users: 65 },
    { month: "May", users: 70 },
  ],
  mentorPerformance: [
    { name: "John Doe", score: 95 },
    { name: "Jane Smith", score: 88 },
    { name: "Alice Johnson", score: 92 },
    { name: "Bob Brown", score: 85 },
  ],
  platformGrowth: [
    { metric: "Users", value: 1240, trend: "up", percent: 12 },
    { metric: "Jobs", value: 342, trend: "up", percent: 8 },
    { metric: "Applications", value: 875, trend: "down", percent: 5 },
  ],
};

export default function ReportsSection() {
  const [reports, setReports] = useState(null);
  const [timeframe, setTimeframe] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 500); // simulate fetching
  }, [timeframe]);

  // const getBarWidth = (value, maxValue) => `${(value / maxValue) * 100}%`;

  // CSV export without libraries
  const exportCSV = () => {
    if (!reports) return;
    const rows = [
      ["Type", "Label", "Value", "Trend", "Percent"],
      ...reports.registrationTrends.map((r) => [
        "Registration Trends",
        r.month,
        r.users,
        "",
        "",
      ]),
      ...reports.mentorPerformance.map((r) => [
        "Mentor Performance",
        r.name,
        r.score,
        "",
        "",
      ]),
      ...reports.platformGrowth.map((r) => [
        "Platform Growth",
        r.metric,
        r.value,
        r.trend,
        r.percent,
      ]),
    ];
    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `reports_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF export using simple window.print
  const exportPDF = () => {
    if (!reports) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<h2>Reports & Insights</h2>");
    printWindow.document.write("<h3>KPIs</h3>");
    printWindow.document.write("<ul>");
    Object.entries(reports.kpis).forEach(([key, value]) => {
      printWindow.document.write(`<li>${key}: ${value}</li>`);
    });
    printWindow.document.write("</ul>");

    printWindow.document.write("<h3>Registration Trends</h3><ul>");
    reports.registrationTrends.forEach((r) => {
      printWindow.document.write(`<li>${r.month}: ${r.users}</li>`);
    });
    printWindow.document.write("</ul>");

    printWindow.document.write("<h3>Mentor Performance</h3><ul>");
    reports.mentorPerformance.forEach((r) => {
      printWindow.document.write(`<li>${r.name}: ${r.score}%</li>`);
    });
    printWindow.document.write("</ul>");

    printWindow.document.write("<h3>Platform Growth</h3><ul>");
    reports.platformGrowth.forEach((r) => {
      printWindow.document.write(
        `<li>${r.metric}: ${r.value} (${r.trend}, ${r.percent}%)</li>`
      );
    });
    printWindow.document.write("</ul>");
    printWindow.document.close();
    printWindow.print();
  };

  if (loading || !reports) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Insights</h1>
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            <Download size={16} /> CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(reports.kpis).map(([key, value], idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow flex flex-col hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-gray-500 text-sm capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </h2>
            <div className="text-2xl font-bold flex items-center gap-2">
              {value}
              {reports.platformGrowth[idx]?.trend === "up" ? (
                <ArrowUp className="text-green-600" size={18} />
              ) : (
                <ArrowDown className="text-red-600" size={18} />
              )}
            </div>
            {reports.platformGrowth[idx]?.percent && (
              <span className="text-sm text-gray-400">
                {reports.platformGrowth[idx].percent}%{" "}
                {reports.platformGrowth[idx].trend}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-2">Registration Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reports.registrationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-2">Mentor Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reports.mentorPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Growth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.platformGrowth.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow flex justify-between items-center hover:shadow-xl transition-shadow duration-300"
          >
            <div>
              <h2 className="text-gray-500 text-sm">{item.metric}</h2>
              <div className="text-xl font-bold">{item.value}</div>
            </div>
            <div className="flex items-center gap-1">
              {item.trend === "up" ? (
                <ArrowUp className="text-green-600" size={20} />
              ) : (
                <ArrowDown className="text-red-600" size={20} />
              )}
              <span
                className={`text-sm ${
                  item.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
