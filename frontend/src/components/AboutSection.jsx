import React from "react";

// Icons using Lucide for visual appeal
import { Award, Zap, Users, BookOpenCheck } from "lucide-react";

const AboutSection = () => {
  // Key feature data extracted from the Tanatut document
  const features = [
    {
      icon: Users,
      title: "Human-Curated Matching",
      description:
        "We go beyond algorithms. Every job post and mentor application is manually vetted by our team to ensure true compatibility and quality.",
    },
    {
      icon: BookOpenCheck,
      title: "Focus on Long-Term Growth",
      description:
        "Our platform is built for sustained success. We facilitate meaningful educational partnerships, not just one-time sessions, with continuous progress tracking.",
    },
    {
      icon: Award,
      title: "Expert Vetting & Quality",
      description:
        "Parents save time searching through unvetted tutors. We ensure every mentor is qualified and committed to fostering real academic transformation.",
    },
    {
      icon: Zap,
      title: "Efficient & Structured",
      description:
        "We provide all the tools for clear scheduling, session tracking, and regular check-ins, eliminating the administrative hassle for parents and mentors alike.",
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-indigo-600 font-semibold tracking-wide uppercase">
            Our Mission
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Building Educational Partnerships, Not Just Lessons
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
            Tanatut is the dedicated platform connecting students with qualified
            mentors committed to **long-term mentorship relationships**. We
            exist to solve the core problems of trust, quality, and commitment
            in education.
          </p>
        </div>

        {/* Core Value Proposition / Differentiators */}
        <div className="mt-16">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="pt-6 text-center">
                <div className="flow-root bg-white rounded-xl px-6 pb-8 shadow-lg h-full transition duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <div className="-mt-6">
                    <div>
                      {/* Icon Container with Gradient Border */}
                      <span className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 shadow-xl ring-4 ring-white">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl font-bold tracking-tight text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action based on the final quote */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="max-w-4xl mx-auto p-8 bg-indigo-50 rounded-2xl shadow-inner border-l-4 border-indigo-500">
            <p className="text-xl italic text-gray-700 leading-relaxed text-center">
              &ldquo;We don't just connect students with mentors &mdash; we
              build educational partnerships that create real academic
              transformation through careful matching and ongoing
              support.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// To make this component runnable in a single React file environment
export default AboutSection;
