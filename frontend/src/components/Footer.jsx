import React from "react";
import { ArrowRight, Globe, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const navigation = {
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-indigo-600  shadow-blue-300 z-10">
      {/* 1. Main Call to Action (Kept from original design) */}
      <div className="relative  sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Secure Your Vetted, Long-Term Educational Partnership
          </h2>
          <p className="mt-4 text-xl text-indigo-300 max-w-3xl mx-auto">
            Take the final step towards a transformative mentorship experience.
            We provide the structure and quality assurance for lasting academic
            growth.
          </p>
        </div>
      </div>

      {/* 2. Main Footer Content (Navigation & Info) */}
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-2 xl:gap-10">
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
        <div className="mt-10 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
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
