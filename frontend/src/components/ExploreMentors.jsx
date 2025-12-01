import React from "react";
import { Mail, Phone } from "lucide-react";

const ExploreMentors = ({ onSelectMentor }) => {
  const mentors = [
    {
      id: 1,
      fullName: "Amanuel Bekele",
      email: "amanuel@example.com",
      phone: "+251911223344",
      expertise: "Mathematics",
      experience: "5 years",
      bio: "Passionate about helping students master problem-solving and logical thinking.",
      image: "/images/person1.png",
    },
    {
      id: 2,
      fullName: "Mimi Tadesse",
      email: "mimi@example.com",
      phone: "+251922334455",
      expertise: "Science",
      experience: "3 years",
      bio: "Dedicated science educator who loves experiments and inquiry-based learning.",
      image: "/images/person2.png",
    },
    {
      id: 3,
      fullName: "Kebede Alemu",
      email: "kebede@example.com",
      phone: "+251933445566",
      expertise: "English Language",
      experience: "7 years",
      bio: "Focused on communication skills and creative writing for all age groups.",
      image: "/images/person1.png",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor) => (
        <div
          key={mentor.id}
          className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex justify-center -mt-16 mb-4">
            <img
              src={mentor.image}
              alt={mentor.fullName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>

          <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">
            {mentor.fullName}
          </h2>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Expertise:</strong> {mentor.expertise}
            </p>
            <p>
              <strong>Experience:</strong> {mentor.experience}
            </p>
            <p className="text-gray-700">{mentor.bio}</p>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-3 flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail size={15} className="text-indigo-500" />
              <span>{mentor.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={15} className="text-indigo-500" />
              <span>{mentor.phone}</span>
            </div>
          </div>

          {/* Select Button */}
          <button
            onClick={() => onSelectMentor(mentor)}
            className="mt-4 w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Select Mentor
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExploreMentors;
