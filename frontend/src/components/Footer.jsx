import React from "react";
import { ArrowRight, Globe, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const navigation = {
    solution: [
      { name: "How It Works", href: "#how-it-works" },
      { name: "For Parents", href: "/parents" },
      { name: "For Mentors", href: "/mentors" },
      { name: "Vetting Process", href: "/vetting" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Testimonials", href: "#testimonials" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-blue-950 border-t border-gray-800">
      {/* 1. Main Call to Action (Kept from original design) */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Secure Your Vetted, Long-Term Educational Partnership
          </h2>
          <p className="mt-4 text-xl text-indigo-300 max-w-3xl mx-auto">
            Take the final step towards a transformative mentorship experience.
            We provide the structure and quality assurance for lasting academic
            growth.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/parent-signup"
              className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-2xl text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
            >
              Initiate Vetted Matching (Parents)
              <ArrowRight className="ml-3 h-5 w-5" />
            </a>
            <a
              href="/mentor-signup"
              className="inline-flex items-center justify-center px-10 py-4 border border-indigo-400 text-lg font-semibold rounded-xl shadow-2xl text-white bg-transparent hover:bg-indigo-800 transition duration-300"
            >
              Apply to Join Our Expert Network (Mentors)
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content (Navigation & Info) */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-4 xl:col-span-1">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-teal-400 mr-3" />
              <p className="text-2xl font-bold text-white">Tanatut</p>
            </div>
            <p className="text-sm text-gray-400">
              Global Mentors for Future Minds.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Solutions
              </h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.solution.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-base text-gray-400 hover:text-indigo-400 transition duration-150"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Company
              </h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-base text-gray-400 hover:text-indigo-400 transition duration-150"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 xl:mt-0 xl:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Contact
            </h3>
            <ul role="list" className="mt-4 space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                <a
                  href="mailto:support@tanatut.com"
                  className="text-base text-gray-400 hover:text-indigo-400 transition duration-150"
                >
                  support@tanatut.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-base text-gray-400">+251972602570</p>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-base text-gray-400">
                  Ethiopia <br />
                  Global City,
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal/Copyright Row */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex space-x-6">
            {navigation.legal.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-base text-gray-500 hover:text-indigo-400 transition duration-150"
              >
                {item.name}
              </a>
            ))}
          </div>
          <p className="mt-8 sm:mt-0 text-base text-gray-500">
            A Tanatut Inc. Project
          </p>

          <p className="text-sm text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} Tanatut, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// To make this component runnable in a single React file environment
export default Footer;
