import React from "react";

const HeroSection = () => {
  return (
    <div className="relative bg-gray-100 h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden pt-16 md:pt-32">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/image3.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-indigo-900 opacity-60"></div>
      </div>

      <div className="relative text-center p-8 sm:p-8 max-w-4xl mx-auto text-white">
        <h1 className="text-2xl sm:text-2xl lg:text-3xl font-extrabold leading-tight mb-4 tracking-tight">
          We Build Educational Partnerships That Create Real Academic
          Transformation
        </h1>

        <p className="text-lg sm:text-xl font-medium mb-8 opacity-70">
          A dedicated platform connecting students with qualified mentors
          through careful, human-vetted matching and a focus on long-term
          mentorship relationships.
        </p>

        <a
          href="/signup/parent"
          className="inline-block bg-orange-500 text-white text-lg font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-lg hover:bg-orange-600 transition duration-300 shadow-xl transform hover:scale-105"
        >
          Start Your Partnership
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
