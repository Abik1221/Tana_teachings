import React from "react";
// Icon for star ratings
import { Star } from "lucide-react";

// Component for a single star rating display
const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
        aria-hidden="true"
      />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "Tanatut completely changed our academic journey. The human-vetted matching process meant we weren't just hiring a tutor; we found a true, long-term mentor who genuinely understood our daughter's unique learning needs. The progress tracking is fantastic.",
      name: "Sarah K.",
      role: "Parent of a Grade 9 Student",
      rating: 5,
    },
    {
      quote:
        "As a mentor, Tanatut provides access to serious clients committed to long-term success. The platform eliminates the administrative headache, and the human oversight ensures I'm matched with students where I can make the biggest impact. It feels like a partnership, not just a job board.",
      name: "Dr. Ethan H.",
      role: "Physics & Calculus Mentor",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-teal-600 font-semibold tracking-wide uppercase">
            What Our Community Says
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by Parents and Top Mentors
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
            Hear from the people who are experiencing the Tanatut difference.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex-1 p-8 bg-white flex flex-col justify-between">
                <div>
                  <StarRating rating={testimonial.rating} />
                  <blockquote className="mt-6">
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </blockquote>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100">
                  <p className="text-lg font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-base text-indigo-600">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Rating Snippet (Fictional Example) */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg">
            **Overall Platform Rating:**{" "}
            <span className="font-bold text-gray-900 ml-2">4.9/5</span> based on
            <span className="text-indigo-600 font-medium ml-1">
              1,200+ Mentorships
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

// To make this component runnable in a single React file environment
export default TestimonialsSection;
