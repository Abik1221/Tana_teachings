import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Download,
} from "lucide-react";

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [sortField, setSortField] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const statusColors = {
    Active: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Inactive: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {
          _id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "Mentor",
          status: "Active",
        },
        {
          _id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Parent",
          status: "Pending",
        },
        {
          _id: 3,
          name: "Mark Lee",
          email: "mark@example.com",
          role: "Mentor",
          status: "Inactive",
        },
        {
          _id: 4,
          name: "Chris Evans",
          email: "chris@example.com",
          role: "Parent",
          status: "Active",
        },
        {
          _id: 5,
          name: "Sarah Kim",
          email: "sarah@example.com",
          role: "Mentor",
          status: "Pending",
        },
        {
          _id: 6,
          name: "Ron Parker",
          email: "ron@example.com",
          role: "Parent",
          status: "Inactive",
        },
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || u.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (!sortField) return 0;
    return a[sortField].localeCompare(b[sortField]);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const currentUsers = sortedUsers.slice(
    indexOfLastUser - usersPerPage,
    indexOfLastUser
  );
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const updateStatusInline = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u))
    );
  };

  const handleDeleteUser = () => {
    setUsers(users.filter((u) => u._id !== deleteUser._id));
    setDeleteUser(null);
  };

  const exportCSV = () => {
    const header = "Name,Email,Role,Status\n";
    const rows = users
      .map((u) => `${u.name},${u.email},${u.role},${u.status}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex gap-1 items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm rounded-md"
          >
            <Download size={16} /> Export CSV
          </button>

          <select
            className="border px-3 py-2 rounded text-sm"
            value={sortField || ""}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="role">Role</option>
            <option value="status">Status</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search user..."
              className="pl-10 pr-3 py-2 border rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute top-2.5 left-3 text-gray-500"
              size={18}
            />
          </div>
          <div className="flex gap-3 items-center mb-3">
            <label className="text-sm font-medium">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded bg-white"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Role</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>

                    {/* Inline Status Dropdown */}
                    <td className="py-3 px-4">
                      <div className="relative inline-block">
                        <select
                          value={user.status}
                          onChange={(e) =>
                            updateStatusInline(user._id, e.target.value)
                          }
                          className={`appearance-none pl-3 pr-8 py-1 rounded-full
                            text-xs font-semibold border cursor-pointer transition-colors
                            ${statusColors[user.status]}
                            focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Inactive">Inactive</option>
                        </select>

                        <ChevronDown
                          size={15}
                          className="absolute right-2 top-1.5 text-gray-700 pointer-events-none"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right space-x-3">
                      <button
                        className="hover:text-indigo-600"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="hover:text-red-600"
                        onClick={() => setDeleteUser(user)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)}>
          <h3 className="font-semibold text-lg mb-3">User Details</h3>
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Role:</strong> {selectedUser.role}
          </p>
          <p>
            <strong>Status:</strong> {selectedUser.status}
          </p>
        </Modal>
      )}

      {deleteUser && (
        <Modal onClose={() => setDeleteUser(null)}>
          <h3 className="font-semibold text-lg mb-3 text-red-600">
            Confirm Delete
          </h3>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <strong>{deleteUser.name}</strong>?
          </p>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
            onClick={handleDeleteUser}
          >
            Yes, Delete
          </button>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-40 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </div>
  );
}
