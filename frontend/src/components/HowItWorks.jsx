import React from "react";
// Icons using Lucide for visual appeal
import {
  FileText,
  UserCheck,
  Search,
  Users,
  Rocket,
  ArrowLeft,
} from "lucide-react";

const HowItWorks = () => {
  // 5 core steps based on the Tanatut process (Parent's journey simplified)
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Submit Detailed Profile",
      description:
        "Parents fill out a comprehensive form detailing the student's needs, academic level, goals, and desired mentor qualifications.",
      color: "text-indigo-600",
    },
    {
      number: 2,
      icon: UserCheck,
      title: "Expert Vetting & Posting",
      description:
        "Our team manually reviews the job request to ensure clarity and quality before posting it to our pool of qualified mentors.",
      color: "text-teal-600",
    },
    {
      number: 3,
      icon: Search,
      title: "Curated Mentor Shortlist",
      description:
        "Mentors apply for the job, and our team reviews applications to provide a hand-selected shortlist based on actual fit and relevance.",
      color: "text-purple-600",
    },
    {
      number: 4,
      icon: Users,
      title: "Parent Makes Final Choice",
      description:
        "Parents review the top candidates' detailed profiles, conduct interviews, and choose the perfect long-term mentor for their student.",
      color: "text-yellow-600",
    },
    {
      number: 5,
      icon: Rocket,
      title: "Structured Mentorship Begins",
      description:
        "Utilize our platform tools for scheduling, session tracking, and progress monitoring to facilitate a successful, long-term educational partnership.",
      color: "text-red-600",
    },
  ];

  return (
    <section id="how-it-works" className=" sm:py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* --- Back Button Updated for smaller size and left alignment --- */}

        {/* ------------------------- */}

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-semibold tracking-wide uppercase">
            Our Process
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Your Path to Quality Mentorship
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
            We replace the confusion of searching with a structured,
            human-vetted process focused purely on long-term compatibility and
            success.
          </p>
        </div>

        {/* Step Grid with Connectors */}
        <div className="relative">
          {/* Desktop/Tablet Connector Line (Hidden on Mobile) */}
          <div
            className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gray-200 lg:mx-20"
            aria-hidden="true"
          ></div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 md:gap-x-8 md:gap-y-0 text-center">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative z-10 flex flex-col items-center"
              >
                {/* Icon & Number */}
                <div className="flex flex-col items-center">
                  {/* Circular Background for Step Number */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-xl`}
                    style={{
                      backgroundColor:
                        step.color === "text-indigo-600"
                          ? "#4f46e5"
                          : step.color === "text-teal-600"
                          ? "#0d9488"
                          : step.color === "text-purple-600"
                          ? "#9333ea"
                          : step.color === "text-yellow-600"
                          ? "#eab308"
                          : "#ef4444",
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Icon beneath the number */}
                  <div className="mt-4 inline-flex items-center justify-center p-3 rounded-xl bg-gray-100 shadow-md ring-4 ring-white">
                    <step.icon
                      className={`h-6 w-6 ${step.color}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-bold tracking-tight text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-gray-500 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA after the steps */}
        <div className="mt-20 flex justify-center">
          <a
            href="/signup"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Start Your Mentorship Journey
          </a>
        </div>
      </div>
    </section>
  );
};

// To make this component runnable in a single React file environment
export default HowItWorks;
