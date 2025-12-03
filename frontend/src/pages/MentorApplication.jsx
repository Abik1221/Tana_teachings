import React, { useState } from 'react';

const MentorApplication = ({ onApplicationSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    highestEducation: '',
    institution: '',
    degree: '',
    expertise: [],
    yearsExperience: '',
    bio: '',
    hourlyRate: '',
    languages: ['English'] // Default language
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleExpertiseChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(subject)
        ? prev.expertise.filter(item => item !== subject)
        : [...prev.expertise, subject]
    }));

    // Clear error when user selects expertise
    if (errors.expertise) {
      setErrors(prev => ({
        ...prev,
        expertise: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    if (step === 2) {
      if (!formData.highestEducation) newErrors.highestEducation = 'Education level is required';
      if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
      if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
    }

    if (step === 3) {
      if (formData.expertise.length === 0) newErrors.expertise = 'Please select at least one expertise area';
      if (!formData.yearsExperience) newErrors.yearsExperience = 'Years of experience is required';
    }

    if (step === 4) {
      if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required';
      if (!formData.bio.trim()) newErrors.bio = 'Professional bio is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(4)) {
      console.log('Application submitted:', formData);
      
      // Create mentor profile from application data
      const mentorProfile = {
        name: formData.fullName,
        title: `${formData.degree} | ${formData.expertise[0]} Expert`,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        gender: '', // Can be updated later in profile
        bio: formData.bio,
        hourlyRate: parseInt(formData.hourlyRate) || 0,
        languages: formData.languages,
        expertise: formData.expertise,
        education: [
          {
            degree: formData.degree,
            university: formData.institution,
            year: ''
          }
        ],
        experience: [
          {
            position: 'Mentor',
            company: 'Tana Tetoural',
            period: 'Present'
          }
        ],
        profileImage: null
      };

      // Store mentor data in localStorage or context
      localStorage.setItem('mentorProfile', JSON.stringify(mentorProfile));
      localStorage.setItem('mentorApplied', 'true');
      
      setSubmitted(true);
      
      // Redirect to mentor dashboard after 2 seconds
      setTimeout(() => {
        if (onApplicationSuccess) {
          onApplicationSuccess(mentorProfile);
        }
      }, 2000);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const expertiseAreas = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Economics', 'Business', 'Psychology',
    'Civics', 'Medicine', 'General Science', 'Arts', 'Music',
    'Web Development', 'Data Science', 'Mobile Development', 'Cloud Computing'
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Application Submitted Successfully!
          </h1>
          <div className="space-y-3 mb-6">
            <p className="text-gray-600">
              Welcome to Tana Tetoural! Your application has been approved.
            </p>
            <p className="text-gray-600">
              Redirecting you to your mentor dashboard...
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <span className="text-2xl text-white">👨‍🏫</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Become a Mentor
          </h1>
          <p className="text-gray-600">
            Join our platform and start mentoring students today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Progress Bar */}
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-sm ${
                      currentStep >= step 
                        ? 'bg-white border-white text-gray-800' 
                        : 'border-gray-400 text-gray-400 bg-transparent'
                    }`}>
                      {step}
                    </div>
                    <span className={`text-xs font-semibold mt-1 ${
                      currentStep >= step ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step === 1 && 'Personal'}
                      {step === 2 && 'Education'}
                      {step === 3 && 'Expertise'}
                      {step === 4 && 'Mentorship'}
                    </span>
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 rounded-full ${
                      currentStep > step ? 'bg-white' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Education Background */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Education Background</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Highest Education *
                      </label>
                      <select
                        name="highestEducation"
                        value={formData.highestEducation}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.highestEducation ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select education level</option>
                        <option value="high_school">High School</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">PhD/Doctorate</option>
                      </select>
                      {errors.highestEducation && <p className="text-red-500 text-xs mt-1">{errors.highestEducation}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution *
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.institution ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degree/Field of Study *
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.degree ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Previous
                    </button>
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Professional Experience */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Professional Experience</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Areas of Expertise *
                      </label>
                      <div 
                        className={`w-full p-3 border rounded-lg cursor-pointer ${
                          errors.expertise ? 'border-red-500' : 'border-gray-300'
                        }`}
                        onClick={() => setShowExpertiseDropdown(!showExpertiseDropdown)}
                      >
                        <span className="text-gray-600">
                          {formData.expertise.length === 0 
                            ? 'Select expertise areas...' 
                            : `${formData.expertise.length} area(s) selected`}
                        </span>
                      </div>

                      {showExpertiseDropdown && (
                        <div className="mt-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                          <div className="space-y-2">
                            {expertiseAreas.map((subject, index) => (
                              <label key={index} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.expertise.includes(subject)}
                                  onChange={() => handleExpertiseChange(subject)}
                                  className="w-4 h-4 text-gray-600"
                                />
                                <span className="text-sm">{subject}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.expertise && <p className="text-red-500 text-xs mt-1">{errors.expertise}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <select
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.yearsExperience ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                      {errors.yearsExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsExperience}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Previous
                    </button>
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Mentorship Details */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Mentorship Details</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Hourly Rate (ETB) *
                      </label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Bio *
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        required
                        rows="4"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 ${
                          errors.bio ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Previous
                    </button>
                    <button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorApplication;