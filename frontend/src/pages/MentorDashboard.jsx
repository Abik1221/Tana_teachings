import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardStats from "../components/DashboardStats";
import Profile from "../components/Profile";
import JobFinder from "../components/JobFinder";
import Applications from "../components/Applications";

const MentorDashboard = ({ mentorProfile }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Use the mentorProfile prop or fallback to default
  const [profile, setProfile] = useState({
    name: 'Dr. Selamawit Bekele',
    title: 'Senior Software Engineer & Tech Mentor',
    email: 'selamawit.bekele@tanatetoural.com',
    phone: '+251 91 123 4567',
    location: 'Addis Ababa, Ethiopia',
    gender: 'Female',
    bio: 'Passionate software engineer with 8+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Committed to helping aspiring Ethiopian developers achieve their career goals through personalized mentorship and practical training.',
    hourlyRate: 450,
    languages: ['Amharic', 'English', 'Afan Oromo'],
    expertise: ['React', 'JavaScript', 'Node.js', 'Python', 'AWS', 'MongoDB', 'Mobile Development'],
    education: [
      {
        degree: 'MSc Computer Science',
        university: 'Addis Ababa University',
        year: '2016'
      }
    ],
    experience: [
      {
        position: 'Senior Software Engineer',
        company: 'EthioTech Solutions',
        period: '2020 - Present'
      }
    ],
    profileImage: null
  });

  const [stats, setStats] = useState({
    totalStudents: 12,
    completedSessions: 45,
    upcomingSessions: 8,
    averageRating: 4.8,
    monthlyEarnings: 8500,
    hoursTaught: 67,
    pendingApplications: 0,
    jobsApplied: 1
  });

  // Job Listings Data
  const [jobListings, setJobListings] = useState([
    {
      id: 1,
      title: 'Web Development Mentor Needed',
      company: 'EthioTech Academy',
      location: 'Addis Ababa, Bole',
      type: 'Part-time',
      salary: 'ETB 400 per hour',
      postedDate: '2024-01-15',
      description: 'Looking for an experienced web development mentor to guide students through full-stack development courses. Must be patient and have good communication skills.',
      requirements: ['React', 'Node.js', 'MongoDB', 'Teaching Experience'],
      status: 'open',
      applied: false,
      gender: 'Any',
      course: 'Full-Stack Web Development',
      schedule: {
        monday: ['4:00 PM - 6:00 PM'],
        tuesday: ['4:00 PM - 6:00 PM'],
        wednesday: ['4:00 PM - 6:00 PM'],
        thursday: ['4:00 PM - 6:00 PM'],
        friday: ['4:00 PM - 6:00 PM'],
        saturday: ['9:00 AM - 12:00 PM'],
        sunday: []
      },
      studentCount: 15,
      duration: '3 months'
    },
    {
      id: 2,
      title: 'Python Data Science Tutor',
      company: 'Data Science Ethiopia',
      location: 'Remote',
      type: 'Contract',
      salary: 'ETB 35,000 monthly',
      postedDate: '2024-01-14',
      description: 'Seeking a data science expert to mentor professionals transitioning into data roles. Focus on Python, pandas, and machine learning fundamentals.',
      requirements: ['Python', 'Pandas', 'Machine Learning', 'Statistics'],
      status: 'open',
      applied: true,
      gender: 'Female Preferred',
      course: 'Data Science Professional',
      schedule: {
        monday: ['6:00 PM - 8:00 PM'],
        tuesday: ['6:00 PM - 8:00 PM'],
        wednesday: ['6:00 PM - 8:00 PM'],
        thursday: [],
        friday: [],
        saturday: ['2:00 PM - 5:00 PM'],
        sunday: ['2:00 PM - 5:00 PM']
      },
      studentCount: 8,
      duration: '4 months'
    },
    {
      id: 3,
      title: 'Mobile App Development Mentor',
      company: 'AppDev Ethiopia',
      location: 'Remote',
      type: 'Part-time',
      salary: 'ETB 500 per hour',
      postedDate: '2024-01-16',
      description: 'Looking for a mobile development expert to mentor students in React Native and Flutter development.',
      requirements: ['React', 'Mobile Development', 'JavaScript', 'Teaching Experience'],
      status: 'open',
      applied: false,
      gender: 'Any',
      course: 'Mobile Development',
      schedule: {
        monday: ['3:00 PM - 5:00 PM'],
        wednesday: ['3:00 PM - 5:00 PM'],
        friday: ['3:00 PM - 5:00 PM'],
        tuesday: [],
        thursday: [],
        saturday: ['10:00 AM - 1:00 PM'],
        sunday: []
      },
      studentCount: 10,
      duration: '2 months'
    }
  ]);

  const [editForm, setEditForm] = useState({ ...profile });
  const [imagePreview, setImagePreview] = useState(null);

  // Update profile when mentorProfile changes (from application)
  useEffect(() => {
    if (mentorProfile) {
      setProfile(mentorProfile);
      setEditForm(mentorProfile);
    }
    setIsLoading(false);
  }, [mentorProfile]);

  // Helper to update edit form fields
  const handleEditChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setEditForm(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image remove
  const handleRemoveImage = () => {
    setImagePreview(null);
    setEditForm(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  // Job Application Handler (for JobFinder component)
  const handleJobApply = (jobId) => {
    setJobListings(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, applied: true }
        : job
    ));
    
    setStats(prev => ({
      ...prev,
      jobsApplied: prev.jobsApplied + 1
    }));

    // Get the job details for the alert message
    const job = jobListings.find(j => j.id === jobId);
    alert(`Application submitted successfully for ${job.title} at ${job.company}!`);
  };

  // Job Application Handler with additional information (for Applications component)
  const handleJobApplication = (jobId, applicationData) => {
    setJobListings(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            applied: true, 
            applicationData,
            applicationDate: new Date().toISOString().split('T')[0]
          }
        : job
    ));
    
    setStats(prev => ({
      ...prev,
      jobsApplied: prev.jobsApplied + 1
    }));

    const job = jobListings.find(j => j.id === jobId);
    alert(`Application submitted successfully for ${job.title} at ${job.company}! We will review your application and get back to you soon.`);
    setSelectedJob(null);
  };

  // Handle Apply Now click from JobFinder
  const handleApplyNowClick = (job) => {
    setSelectedJob(job);
    setActiveSection('applications');
  };

  const handleSave = () => {
    const normalized = {
      ...editForm,
      languages: typeof editForm.languages === 'string' 
        ? editForm.languages.split(',').map(s => s.trim()).filter(Boolean)
        : editForm.languages,
      expertise: typeof editForm.expertise === 'string'
        ? editForm.expertise.split(',').map(s => s.trim()).filter(Boolean)
        : editForm.expertise,
      profileImage: editForm.profileImage
    };

    setProfile(normalized);
    setIsEditing(false);
    setImagePreview(null);

    // Update localStorage with the new profile
    localStorage.setItem('mentorProfile', JSON.stringify(normalized));
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
    setImagePreview(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardStats stats={stats} profile={profile} setActiveSection={setActiveSection} />;
      case 'jobfinder':
        return (
          <JobFinder 
            jobListings={jobListings} 
            handleJobApply={handleJobApply}
            onApplyNowClick={handleApplyNowClick}
          />
        );
      case 'profile':
        return (
          <Profile 
            profile={profile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editForm={editForm}
            handleEditChange={handleEditChange}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            imagePreview={imagePreview}
            handleSave={handleSave}
            handleCancel={handleCancel}
            stats={stats}
          />
        );
      case 'applications':
        return (
          <Applications 
            jobListings={jobListings}
            profile={profile}
            handleJobApplication={handleJobApplication}
            selectedJob={selectedJob}
          />
        );
      case 'students':
        return (
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-6 lg:p-8 text-center">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">My Students</h3>
            <p className="text-gray-600 text-sm lg:text-base">Manage your current students and track their progress</p>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Student management features coming soon!</p>
            </div>
          </div>
        );
      default:
        return <DashboardStats stats={stats} profile={profile} setActiveSection={setActiveSection} />;
    }
  };

  const getSectionTitle = () => {
    const titles = {
      dashboard: 'Mentor Dashboard',
      jobfinder: 'Find Jobs',
      profile: 'My Profile',
      students: 'My Students',
      applications: 'Job Applications'
    };
    return titles[activeSection] || 'Mentor Dashboard';
  };

  const getSectionDescription = () => {
    const descriptions = {
      dashboard: 'Overview of your mentorship and job search activities',
      jobfinder: 'Discover job opportunities that match your expertise',
      profile: 'Manage your professional mentor profile',
      students: 'View and manage your current students',
      applications: 'Apply to jobs that match your skills and preferences'
    };
    return descriptions[activeSection] || 'Overview of your mentorship and job search activities';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        profile={profile}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Main Content - Fixed height to prevent scrolling */}
      <div className="flex-1 lg:ml-80 flex flex-col min-h-screen">
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">
              {getSectionTitle()}
            </h1>
            <p className="text-base lg:text-xl text-gray-600">
              {getSectionDescription()}
            </p>
          </div>

          {/* Content - Limited height to prevent scrolling */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;