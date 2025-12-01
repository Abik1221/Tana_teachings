// src/parents_info/ParentPostJob.jsx
import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  Home,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Info,
  User,
  Book,
  ChevronDown,
  X,
  Lock,
} from "lucide-react";
import { showSuccess, showError } from "../utils/toast";

const CLASS_SUBJECTS = {
  1: ["Reading", "Writing", "Math basics"],
  2: ["Reading", "Writing", "Math basics"],
  3: ["Math", "Science", "Amharic"],
  4: ["Math", "Science", "English"],
  5: ["Math", "Science", "English"],
  6: ["Math", "General Science", "English"],
  7: ["Math", "General Science", "English"],
  8: ["Math", "General Science", "English"],
  9: ["Algebra", "Biology", "English"],
  10: ["Algebra II", "Chemistry", "English"],
  11: ["Calculus", "Physics", "English"],
  12: ["Calculus", "Physics", "Advanced English"],
};

const initialJobState = {
  address: "",
  weeklyDays: "",
  dailyTime: "",
  subjects: [],
  salary: "",
  genderPreference: "",
  description: "",
  createdAt: null,
};

const ParentPostJob = ({ onJobPosted } = {}) => {
  const [step, setStep] = useState(1);
  const [job, setJob] = useState(initialJobState);
  const [numStudents, setNumStudents] = useState(1);
  const [students, setStudents] = useState([{ class: "", subjects: [] }]);
  const [submitting, setSubmitting] = useState(false);

  const syncStudentsWithCount = (count) => {
    setStudents((prev) => {
      const copy = [...prev];
      while (copy.length < count) copy.push({ class: "", subjects: [] });
      while (copy.length > count) copy.pop();
      return copy;
    });
  };

  const handleNumStudentsChange = (e) => {
    const v = parseInt(e.target.value || "0", 10);
    if (isNaN(v) || v < 1) return;
    setNumStudents(v);
    syncStudentsWithCount(v);
  };

  const handleStudentChange = (index, field, value) => {
    setStudents((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === "class") copy[index].subjects = [];
      return copy;
    });
  };

  const subjectsForClass = (classValue) => {
    if (!classValue) return [];
    const num = parseInt(classValue, 10);
    return CLASS_SUBJECTS[num] || [];
  };

  const validateStep1 = () => {
    if (!job.address?.trim()) return "Address is required";
    if (!job.weeklyDays) return "Number of days per week is required";
    if (!job.dailyTime?.trim()) return "Daily time is required";
    if (!job.salary) return "Salary is required";
    if (!job.description?.trim()) return "Description is required";
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        showError(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      for (let i = 0; i < students.length; i++) {
        if (!students[i].subjects.length) {
          showError(`Student #${i + 1}: Please select at least one subject`);
          return;
        }
      }
      setStep(3);
    }
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const fakePostJob = (payload) =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("Job posted:", payload);
        resolve({ data: payload });
      }, 1000)
    );

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      ...job,
      createdAt: new Date().toISOString(),
      numStudents,
      students,
      parentEmail: localStorage.getItem("email") || null,
      parentName:
        localStorage.getItem("fullName") ||
        localStorage.getItem("parentName") ||
        null,
    };
    try {
      await fakePostJob(payload);
      setSubmitting(false);
      showSuccess("Job posted successfully!");
      if (typeof onJobPosted === "function") onJobPosted(payload);
      setJob(initialJobState);
      setNumStudents(1);
      setStudents([{ class: "", subjects: [] }]);
      setStep(1);
    } catch (err) {
      setSubmitting(false);
      showError(err?.message || "Failed to post job");
    }
  };

  const scheduleText = useMemo(
    () =>
      `${job.weeklyDays || "N/A"} days/week · ${
        job.dailyTime || "N/A"
      } hours each day`,
    [job.weeklyDays, job.dailyTime]
  );

  const fieldIcons = {
    address: (
      <Home size={18} className="absolute left-3 top-3.5 text-gray-400" />
    ),
    weeklyDays: (
      <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
    ),
    dailyTime: (
      <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
    ),
    salary: (
      <DollarSign size={18} className="absolute left-3 top-3.5 text-gray-400" />
    ),
    genderPreference: (
      <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
    ),
    numStudents: (
      <Users size={18} className="absolute left-3 top-3.5 text-gray-400" />
    ),
    description: (
      <Info size={18} className="absolute left-3 top-3.5 text-gray-400" />
    ),
  };

  const MultiSelectDropdown = ({ selected, options, onChange }) => {
    const [open, setOpen] = useState(false);
    const toggleOption = (option) => {
      onChange(
        selected.includes(option)
          ? selected.filter((x) => x !== option)
          : [...selected, option]
      );
    };
    return (
      <div className="relative">
        <div
          className="border rounded-lg px-3 py-3 flex justify-between items-center cursor-pointer bg-white hover:border-indigo-500 transition"
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length ? (
              selected.map((s) => (
                <span
                  key={s}
                  className="bg-indigo-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                >
                  {s}{" "}
                  <X
                    size={12}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(s);
                    }}
                  />
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Select subjects</span>
            )}
          </div>
          <ChevronDown size={16} />
        </div>
        {open && options.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-auto">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => toggleOption(opt)}
                className={`px-3 py-2 cursor-pointer hover:bg-indigo-100 ${
                  selected.includes(opt) ? "bg-indigo-50 font-medium" : ""
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg space-y-6">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 relative">
              <div
                className={`w-full h-2 rounded-full ${
                  step >= i ? "bg-indigo-600" : "bg-gray-200"
                }`}
              ></div>
              <span
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                  step === i
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {i}
              </span>
            </div>
          ))}
        </div>
      </div>
      <h2 className="text-2xl font-bold">Post a Job</h2>
      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-gray-600">Fill in the job details below:</p>
          {[
            "address",
            "weeklyDays",
            "dailyTime",
            "salary",
            "genderPreference",
            "numStudents",
            "description",
          ].map((field) => {
            const Icon = fieldIcons[field];

            // Determine label text
            const labelText =
              field === "address"
                ? "Address"
                : field === "weeklyDays"
                ? "Number of days per week"
                : field === "dailyTime"
                ? "Daily time"
                : field === "salary"
                ? "Salary"
                : field === "genderPreference"
                ? "Select gender"
                : field === "numStudents"
                ? "Number of students"
                : field === "description"
                ? "Job description"
                : field;

            // Handle gender select
            if (field === "genderPreference") {
              return (
                <div key={field} className="mb-4">
                  <label className="m-2 font-bold">{labelText}:</label>
                  <div className="relative">
                    {Icon}
                    <select
                      value={job.genderPreference}
                      onChange={(e) =>
                        setJob({ ...job, genderPreference: e.target.value })
                      }
                      className="w-full pl-10 py-3 rounded-lg  focus:outline-none "
                    >
                      <option value="">No preference</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                    <div className="flex-grow h-px bg-gray-300"></div>
                  </div>
                </div>
              );
            }

            // Handle number of students
            if (field === "numStudents") {
              return (
                <div key={field} className="mb-4">
                  <label className="m-2 font-bold">{labelText}:</label>
                  <div className="relative">
                    {Icon}
                    <input
                      type="number"
                      min={1}
                      value={numStudents}
                      onChange={handleNumStudentsChange}
                      className="w-full pl-10 py-3 rounded-lg  focus:outline-none hover:border-indigo-500 transition"
                    />
                    <div className="flex-grow h-px bg-gray-300"></div>
                  </div>
                </div>
              );
            }

            // Handle all other fields (text, number, textarea)
            return (
              <div key={field} className="mb-4">
                <label className="m-2 font-bold">{labelText}:</label>
                <div className="relative">
                  {Icon}
                  {field === "description" ? (
                    <textarea
                      rows={4}
                      value={job.description}
                      onChange={(e) =>
                        setJob({ ...job, description: e.target.value })
                      }
                      className="w-full pl-10 py-3 rounded-lg border focus:outline-none hover:border-indigo-500 transition"
                      placeholder="Enter job description..."
                    />
                  ) : (
                    <input
                      type={
                        ["weeklyDays", "salary"].includes(field)
                          ? "number"
                          : "text"
                      }
                      value={job[field]}
                      onChange={(e) =>
                        setJob({ ...job, [field]: e.target.value })
                      }
                      className="w-full pl-10 py-3 rounded-lg  focus:outline-none hover:border-indigo-500 transition"
                      placeholder={`Enter ${labelText.toLowerCase()}`}
                    />
                  )}
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6">
          {students.map((s, idx) => (
            <div
              key={idx}
              className="p-4 border rounded bg-gray-50 space-y-4 shadow-sm"
            >
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <User size={18} /> Student #{idx + 1}
              </h4>
              <div className="relative">
                <Book
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />
                <select
                  value={s.class}
                  onChange={(e) =>
                    handleStudentChange(idx, "class", e.target.value)
                  }
                  className="w-full pl-10 py-3 rounded-lg  focus:outline-none hover:border-indigo-500 transition"
                >
                  <option value="">Select class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              <div>
                <span className="flex items-center gap-2 font-medium mb-1">
                  <Book size={16} /> Subjects
                </span>
                <MultiSelectDropdown
                  selected={s.subjects}
                  options={subjectsForClass(s.class)}
                  onChange={(val) => handleStudentChange(idx, "subjects", val)}
                />
              </div>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
          ))}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded border shadow-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setNumStudents((n) => Math.max(1, n - 1));
                  syncStudentsWithCount(Math.max(1, numStudents - 1));
                }}
                className="px-3 py-2 border rounded"
              >
                -
              </button>
              <button
                onClick={() => {
                  setNumStudents((n) => n + 1);
                  syncStudentsWithCount(numStudents + 1);
                }}
                className="px-3 py-2 border rounded"
              >
                +
              </button>
              <button
                onClick={handleNext}
                className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                <span>Review</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Review Job</h3>
          <div className="p-4 border rounded bg-gray-50 space-y-2 shadow-sm">
            <p>
              <strong>Address:</strong> {job.address}
            </p>
            <p>
              <strong>Schedule:</strong> {scheduleText}
            </p>
            <p>
              <strong>Salary:</strong> {job.salary}
            </p>
            <p>
              <strong>Gender preference:</strong>{" "}
              {job.genderPreference || "No preference"}
            </p>
            <p>
              <strong>Description:</strong> {job.description}
            </p>
            <p>
              <strong>Posted at:</strong>{" "}
              {job.createdAt
                ? new Date(job.createdAt).toLocaleString()
                : new Date().toLocaleString()}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">
              Students ({students.length})
            </h4>
            <div className="space-y-2 mt-2">
              {students.map((s, i) => (
                <div key={i} className="p-2 border rounded bg-white shadow-sm">
                  <p>
                    <strong>Class:</strong> {s.class}
                  </p>
                  <p>
                    <strong>Subjects:</strong> {s.subjects.join(", ")}
                  </p>
                  <p>
                    <strong>Posted at:</strong>{" "}
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleString()
                      : new Date().toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded border shadow-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
            >
              <Save size={16} />
              <span>{submitting ? "Posting..." : "Post Job"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentPostJob;
