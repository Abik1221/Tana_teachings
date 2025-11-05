import React, { useState } from 'react'

const MentorApplication = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    highestEducation: '',
    institution: '',
    graduationYear: '',
    degree: '',
    expertise: [], // Changed to array for multiple selection
    yearsExperience: '',
    currentPosition: '',
    company: '',
    teachingStyle: '',
    availability: [],
    hourlyRate: '',
    studentsPreference: '',
    bio: '',
    resume: null,
    certifications: []
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }))
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleExpertiseChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(subject)
        ? prev.expertise.filter(item => item !== subject)
        : [...prev.expertise, subject]
    }))

    // Clear error when user selects expertise
    if (errors.expertise) {
      setErrors(prev => ({
        ...prev,
        expertise: ''
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    }

    if (step === 2) {
      if (!formData.highestEducation) newErrors.highestEducation = 'Education level is required'
      if (!formData.institution.trim()) newErrors.institution = 'Institution is required'
      if (!formData.degree.trim()) newErrors.degree = 'Degree is required'
    }

    if (step === 3) {
      if (formData.expertise.length === 0) newErrors.expertise = 'Please select at least one expertise area'
      if (!formData.yearsExperience) newErrors.yearsExperience = 'Years of experience is required'
    }

    if (step === 4) {
      if (formData.availability.length === 0) newErrors.availability = 'Please select at least one availability day'
      if (!formData.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required'
      if (!formData.bio.trim()) newErrors.bio = 'Professional bio is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateStep(4)) {
      console.log('Application submitted:', formData)
      setSubmitted(true)
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => setCurrentStep(prev => prev - 1)

  const expertiseAreas = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Economics', 'Business', 'Psychology',
    'Civics', 'Medicine', 'General Science', 'Arts', 'Music'
  ]

  const availabilityDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-emerald-100">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg">
            🎉
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
            Application Submitted!
          </h1>
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              Thank you for your interest in joining our mentor community.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We'll review your application and get back to you within 2-3 business days.
            </p>
          </div>
          <button 
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300"
            onClick={() => {
              setSubmitted(false)
              setCurrentStep(1)
              setFormData({
                fullName: '', email: '', phone: '', address: '', city: '', country: '',
                highestEducation: '', institution: '', graduationYear: '', degree: '',
                expertise: [], yearsExperience: '', currentPosition: '', company: '',
                teachingStyle: '', availability: [], hourlyRate: '', studentsPreference: '', bio: '',
                resume: null, certifications: []
              })
              setErrors({})
            }}
          >
            Apply Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-xl">
            <span className="text-3xl text-white">👨‍🏫</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-snug">
            Join Our Mentor Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Inspire the next generation of learners and share your expertise with passionate students
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-8">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 font-bold text-lg transition-all duration-500 ${
                      currentStep >= step 
                        ? 'bg-white border-white text-blue-600 shadow-lg' 
                        : 'border-blue-300 text-blue-300 bg-transparent'
                    }`}>
                      {step}
                    </div>
                    <span className={`text-sm font-semibold mt-3 ${
                      currentStep >= step ? 'text-white' : 'text-blue-100'
                    }`}>
                      {step === 1 && 'Personal Info'}
                      {step === 2 && 'Education'}
                      {step === 3 && 'Professional'}
                      {step === 4 && 'Mentorship'}
                    </span>
                  </div>
                  {step < 4 && (
                    <div className={`w-20 h-1 mx-6 rounded-full transition-all duration-500 ${
                      currentStep > step ? 'bg-white' : 'bg-blue-400'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-10">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">Personal Information</h2>
                    <p className="text-lg text-gray-600 mb-6">Tell us about yourself</p>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                          errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (555) 123-4567"
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address"
                        className="w-full h-14 px-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full h-14 px-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="w-full h-14 px-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-10 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!formData.fullName || !formData.email || !formData.phone}
                    >
                      <span>Continue to Education</span>
                      <span className="text-xl">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Education Background */}
              {currentStep === 2 && (
                <div className="space-y-10">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">Education Background</h2>
                    <p className="text-lg text-gray-600 mb-6">Share your academic journey</p>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Highest Education Level *
                      </label>
                      <select
                        name="highestEducation"
                        value={formData.highestEducation}
                        onChange={handleChange}
                        required
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                          errors.highestEducation ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Select education level</option>
                        <option value="high_school">High School</option>
                        <option value="associate">Associate Degree</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">PhD/Doctorate</option>
                        <option value="professional">Professional Certification</option>
                      </select>
                      {errors.highestEducation && <p className="text-red-500 text-sm mt-2">{errors.highestEducation}</p>}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Institution *
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        required
                        placeholder="University or College name"
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                          errors.institution ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.institution && <p className="text-red-500 text-sm mt-2">{errors.institution}</p>}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Degree/Field of Study *
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Computer Science, Mathematics"
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                          errors.degree ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.degree && <p className="text-red-500 text-sm mt-2">{errors.degree}</p>}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        placeholder="YYYY"
                        min="1950"
                        max="2030"
                        className="w-full h-14 px-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-10 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl border-2 border-gray-500"
                    >
                      <span className="text-xl">←</span>
                      <span>Previous</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!formData.highestEducation || !formData.institution || !formData.degree}
                    >
                      <span>Continue to Professional</span>
                      <span className="text-xl">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Professional Experience */}
              {currentStep === 3 && (
                <div className="space-y-10">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">Professional Experience</h2>
                    <p className="text-lg text-gray-600 mb-6">Tell us about your professional background</p>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Expertise Areas - Multiple Select Dropdown */}
                    <div className="space-y-4 relative">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Areas of Expertise *
                      </label>
                      
                      {/* Custom Dropdown Trigger */}
                      <div 
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md flex items-center justify-between cursor-pointer ${
                          errors.expertise ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        } ${showExpertiseDropdown ? 'ring-4 ring-blue-100 border-blue-500' : ''}`}
                        onClick={() => setShowExpertiseDropdown(!showExpertiseDropdown)}
                      >
                        <span className={`${formData.expertise.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                          {formData.expertise.length === 0 
                            ? 'Select expertise areas...' 
                            : `${formData.expertise.length} area(s) selected`}
                        </span>
                        <span className={`transform transition-transform duration-300 ${showExpertiseDropdown ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>

                      {/* Selected Tags */}
                      {formData.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.expertise.map((subject, index) => (
                            <span 
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                            >
                              <span>{subject}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleExpertiseChange(subject)
                                }}
                                className="text-blue-600 hover:text-blue-800 ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Dropdown Menu */}
                      {showExpertiseDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-10 max-h-60 overflow-y-auto">
                          <div className="p-4 space-y-2">
                            {expertiseAreas.map((subject, index) => (
                              <label 
                                key={index}
                                className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-all duration-200"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.expertise.includes(subject)}
                                  onChange={() => handleExpertiseChange(subject)}
                                  className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-700 font-medium">{subject}</span>
                              </label>
                            ))}
                          </div>
                          <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-2xl">
                            <button
                              type="button"
                              onClick={() => setShowExpertiseDropdown(false)}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {errors.expertise && <p className="text-red-500 text-sm mt-2">{errors.expertise}</p>}
                    </div>
                    
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Years of Experience *
                      </label>
                      <select
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={handleChange}
                        required
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                          errors.yearsExperience ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                      {errors.yearsExperience && <p className="text-red-500 text-sm mt-2">{errors.yearsExperience}</p>}
                    </div>
                    
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        Current Position
                      </label>
                      <input
                        type="text"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={handleChange}
                        placeholder="e.g., Software Engineer, Professor"
                        className="w-full h-14 px-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Current employer"
                        className="w-full h-14 px-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-10 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl border-2 border-gray-500"
                    >
                      <span className="text-xl">←</span>
                      <span>Previous</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={formData.expertise.length === 0 || !formData.yearsExperience}
                    >
                      <span>Continue to Mentorship</span>
                      <span className="text-xl">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Mentorship Details */}
              {currentStep === 4 && (
                <div className="space-y-10">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">Mentorship Details</h2>
                    <p className="text-lg text-gray-600 mb-6">Tell us about your mentoring approach</p>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="space-y-6">
                    <label className="block text-base font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                      Teaching/Mentoring Style
                    </label>
                    <textarea
                      name="teachingStyle"
                      value={formData.teachingStyle}
                      onChange={handleChange}
                      placeholder="Describe your approach to teaching and mentoring..."
                      rows="5"
                      className="w-full h-32 px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-vertical leading-relaxed"
                    />
                  </div>

                  <div className="space-y-6">
                    <label className="block text-base font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                      Availability *
                    </label>
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 p-8 rounded-3xl border-2 transition-all duration-300 ${
                      errors.availability ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {availabilityDays.map(day => (
                        <label key={day} className="flex items-center space-x-3 p-4 bg-white rounded-xl hover:bg-green-50 border-2 border-gray-200 hover:border-green-400 transition-all duration-300 cursor-pointer shadow-sm h-16">
                          <input
                            type="checkbox"
                            name="availability"
                            value={day}
                            checked={formData.availability.includes(day)}
                            onChange={handleChange}
                            className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm font-medium text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                    {errors.availability && <p className="text-red-500 text-sm mt-2">{errors.availability}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                        Expected Hourly Rate ($) *
                      </label>
                      <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        min="15"
                        max="200"
                        step="5"
                        required
                        placeholder="50"
                        className={`w-full h-14 px-5 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
                          errors.hourlyRate ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      />
                      {errors.hourlyRate && <p className="text-red-500 text-sm mt-2">{errors.hourlyRate}</p>}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                        Preferred Student Level
                      </label>
                      <select
                        name="studentsPreference"
                        value={formData.studentsPreference}
                        onChange={handleChange}
                        className="w-full h-14 px-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      >
                        <option value="">Any level</option>
                        <option value="elementary">Elementary School</option>
                        <option value="middle">Middle School</option>
                        <option value="high">High School</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-base font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                      Professional Bio *
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself, your passion for teaching, and why you want to be a mentor..."
                      rows="6"
                      required
                      className={`w-full h-40 px-5 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-vertical leading-relaxed ${
                        errors.bio ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    {errors.bio && <p className="text-red-500 text-sm mt-2">{errors.bio}</p>}
                  </div>

                  <div className="flex justify-between pt-10 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl border-2 border-gray-500"
                    >
                      <span className="text-xl">←</span>
                      <span>Previous</span>
                    </button>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={formData.availability.length === 0 || !formData.hourlyRate || !formData.bio}
                    >
                      <span>Submit Application</span>
                      <span className="text-xl">🚀</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              Why Mentor With Us?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join a community that values your expertise and supports your growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center transition-all duration-300 border-2 border-blue-200 shadow-lg h-64 flex flex-col justify-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6 shadow-md">
                💼
              </div>
              <h4 className="font-bold text-gray-800 mb-4 text-xl">Flexible Schedule</h4>
              <p className="text-gray-600 leading-relaxed">
                Choose your own hours and teach from anywhere in the world
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center transition-all duration-300 border-2 border-green-200 shadow-lg h-64 flex flex-col justify-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6 shadow-md">
                💰
              </div>
              <h4 className="font-bold text-gray-800 mb-4 text-xl">Competitive Pay</h4>
              <p className="text-gray-600 leading-relaxed">
                Earn what you deserve with our transparent pricing model
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 text-center transition-all duration-300 border-2 border-purple-200 shadow-lg h-64 flex flex-col justify-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center text-3zl text-white mx-auto mb-6 shadow-md">
                🌍
              </div>
              <h4 className="font-bold text-gray-800 mb-4 text-xl">Global Reach</h4>
              <p className="text-gray-600 leading-relaxed">
                Connect with students from diverse backgrounds worldwide
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 text-center transition-all duration-300 border-2 border-orange-200 shadow-lg h-64 flex flex-col justify-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6 shadow-md">
                📚
              </div>
              <h4 className="font-bold text-gray-800 mb-4 text-xl">Learning Resources</h4>
              <p className="text-gray-600 leading-relaxed">
                Access curated materials and teaching resources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorApplication