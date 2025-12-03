// src/parents_info/ParentPostJob.jsx
import React, { useMemo, useState, useEffect } from "react";
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
  ChevronDown,
  X,
  Sidebar,
} from "lucide-react";
import { showSuccess, showError } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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

const ParentPostJob = ({ onJobPosted }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [job, setJob] = useState(initialJobState);
  const [numStudents, setNumStudents] = useState(1);
  const [students, setStudents] = useState([{ class: "", subjects: [] }]);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already posted jobs
  useEffect(() => {
    const previousJobs = JSON.parse(localStorage.getItem("parentJobs") || "[]");
    if (previousJobs.length > 0) {
      navigate("/ParentDashboard", { replace: true });
    }
  }, [navigate]);

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
      if (err) return showError(err);
      setStep(2);
    } else if (step === 2) {
      for (let i = 0; i < students.length; i++) {
        if (!students[i].subjects.length) {
          return showError(`Student #${i + 1}: Select at least one subject`);
        }
      }
      setStep(3);
    }
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const saveLocal = (payload) => {
    const previousJobs = JSON.parse(localStorage.getItem("parentJobs") || "[]");
    const updatedJobs = [...previousJobs, payload];
    localStorage.setItem("parentJobs", JSON.stringify(updatedJobs));
  };

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
      const previousJobs = JSON.parse(
        localStorage.getItem("parentJobs") || "[]"
      );
      const isFirstJob = previousJobs.length === 0;

      // Save job
      saveLocal(payload);

      // Notify dashboard
      if (onJobPosted) onJobPosted(payload);

      setSubmitting(false);
      showSuccess("Job posted successfully! 🎉");

      // Reset form
      setJob(initialJobState);
      setNumStudents(1);
      setStudents([{ class: "", subjects: [] }]);
      setStep(1);

      // Redirect if first job
      if (isFirstJob) {
        navigate("/ParentDashboard", { replace: true });
      }
    } catch (err) {
      setSubmitting(false);
      showError(err.message || "Failed to post job", "Error");
    }
  };

  const scheduleText = useMemo(
    () =>
      `${job.weeklyDays || "N/A"} days/week · ${
        job.dailyTime || "N/A"
      } hours/day`,
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

        {open && options?.length > 0 && (
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
    <>
      <Navbar></Navbar>{" "}
      <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg space-y-6">
        {/* Progress Header */}

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

        <h2 className="text-2xl font-bold">Post a Job</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
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
              const labelMap = {
                address: "Address",
                weeklyDays: "Days per week",
                dailyTime: "Daily time (hours)",
                salary: "Monthly salary",
                genderPreference: "Preferred tutor gender",
                numStudents: "Number of students",
                description: "Job Description",
              };

              if (field === "genderPreference") {
                return (
                  <div key={field}>
                    <label className="block font-bold mb-1">
                      {labelMap[field]}
                    </label>
                    <div className="relative">
                      {Icon}
                      <select
                        value={job.genderPreference}
                        onChange={(e) =>
                          setJob({ ...job, genderPreference: e.target.value })
                        }
                        className="w-full pl-10 py-3 rounded-lg bg-blue-50"
                      >
                        <option value="">No preference</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                  </div>
                );
              }

              if (field === "numStudents") {
                return (
                  <div key={field}>
                    <label className="block font-bold mb-1">
                      {labelMap[field]}
                    </label>
                    <div className="relative">
                      {Icon}
                      <input
                        type="number"
                        min={1}
                        value={numStudents}
                        onChange={handleNumStudentsChange}
                        className="w-full pl-10 py-3 rounded-lg bg-blue-50"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div key={field}>
                  <label className="block font-bold mb-1">
                    {labelMap[field]}
                  </label>
                  <div className="relative">
                    {Icon}
                    {field === "description" ? (
                      <textarea
                        rows={3}
                        value={job.description}
                        onChange={(e) =>
                          setJob({ ...job, description: e.target.value })
                        }
                        className="w-full pl-10 py-3 rounded-lg bg-blue-50"
                      />
                    ) : (
                      <input
                        type={field === "salary" ? "number" : "text"}
                        value={job[field]}
                        onChange={(e) =>
                          setJob({ ...job, [field]: e.target.value })
                        }
                        className="w-full pl-10 py-3 rounded-lg bg-blue-50"
                      />
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleNext}
              className="bg-indigo-600 text-white px-4 py-2 rounded inline-flex items-center"
            >
              Next <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            {students.map((s, idx) => (
              <div
                key={idx}
                className="border p-4 rounded bg-gray-50 space-y-3"
              >
                <h4 className="font-semibold text-lg">Student #{idx + 1}</h4>
                <select
                  value={s.class}
                  onChange={(e) =>
                    handleStudentChange(idx, "class", e.target.value)
                  }
                  className="w-full p-2 rounded border"
                >
                  <option value="">Select class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Class {i + 1}
                    </option>
                  ))}
                </select>
                <MultiSelectDropdown
                  selected={s.subjects}
                  options={subjectsForClass(s.class)}
                  onChange={(val) => handleStudentChange(idx, "subjects", val)}
                />
              </div>
            ))}
            <div className="flex justify-between">
              <button onClick={handleBack} className="px-4 py-2 border rounded">
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleNext}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Review <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Review Job Details</h3>
            <div className="bg-gray-50 p-4 rounded space-y-2">
              <p>
                <strong>Address:</strong> {job.address}
              </p>
              <p>
                <strong>Schedule:</strong> {scheduleText}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary} ETB
              </p>
              <p>
                <strong>Gender Preference:</strong>{" "}
                {job.genderPreference || "Any"}
              </p>
              <p>
                <strong>Description:</strong> {job.description}
              </p>
            </div>

            <h4 className="font-semibold text-lg mt-4">Students</h4>
            {students.map((s, idx) => (
              <div key={idx} className="p-3 border rounded bg-white">
                <p>
                  <strong>Class:</strong> {s.class}
                </p>
                <p>
                  <strong>Subjects:</strong> {s.subjects.join(", ")}
                </p>
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <button onClick={handleBack} className="px-4 py-2 border rounded">
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
              >
                {submitting ? "Posting..." : "Post Job"}{" "}
                <Save size={16} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ParentPostJob;
