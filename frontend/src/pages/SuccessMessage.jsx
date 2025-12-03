import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SuccessMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || { name: "", email: "" };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg p-8 space-y-6 text-center">
        <div className="text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          You’re on the list!
        </h1>
        <p className="text-gray-600">
          You have been added to the waiting list successfully! In the meantime,
          if you don’t have an account yet, please create one and add your
          child/children to the platform.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>E-mail:</strong> {email}
          </p>
          <p>I agree to the privacy policy and terms of service.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/password-fields")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Already have an account? Log in
          </button>
        </div>

        <div className="text-left mt-6 space-y-2">
          <h3 className="font-semibold text-gray-800">
            Here’s what happens next:
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>
              Our team will contact you soon to learn more about your child.
            </li>
            <li>
              We’ll discuss how we can support them and build a personalized
              plan.
            </li>
            <li>Feel free to call or message us at any time.</li>
          </ul>
        </div>

        <div className="mt-4 text-gray-700">
          <p className="font-semibold">Our contact info:</p>
          <p>+1 (202) 386-2702</p>
          <p>tutoring@evangadi.com</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
