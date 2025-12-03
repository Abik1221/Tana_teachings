import mongoose from 'mongoose';
import { ROLES, USER_STATUS } from '../config/constants.js';

// Define Experience as a Sub-Schema to handle the structure cleanly
const experienceSchema = new mongoose.Schema({
  years: {
    type: Number,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true,
    default: ''
  },
  previousRoles: [{
    position: String,
    organization: String,
    duration: String,
    description: String
  }]
}, { _id: false });

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    default: ''
  },
  expertise: {
    type: [String],
    default: [], // Allow empty array for initial creation
    validate: {
      validator: function(expertise) {
        // Only validate if profile is being updated (not initial empty creation)
        return this.isNew ? true : (expertise && expertise.length > 0);
      },
      message: 'At least one expertise area is required for completed profiles'
    }
  },
  qualifications: [{
    type: {
      type: String,
      required: true,
      enum: ['degree', 'certification', 'license', 'award', 'other']
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear()
    },
    documentUrl: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  experience: {
    type: experienceSchema,
    default: () => ({ years: 0 }),
    set: function(value) {
      if (typeof value === 'number') {
        return { years: value, description: '', previousRoles: [] };
      }
      return value;
    }
  },
  education: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear()
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  hourlyRate: {
    type: Number,
    min: [0, 'Hourly rate cannot be negative'],
    default: 0
  },
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    slots: [{
      start: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format']
      },
      end: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format']
      },
      isAvailable: {
        type: Boolean,
        default: true
      }
    }]
  }],
  subjects: [{
    subject: {
      type: String,
      required: true,
      trim: true
    },
    levels: [{
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Honors', 'AP', 'College'],
      required: true
    }],
    hourlyRate: {
      type: Number,
      min: 0
    },
    experience: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      comment: {
        type: String,
        maxlength: 500,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  stats: {
    totalApplications: {
      type: Number,
      default: 0
    },
    hiredApplications: {
      type: Number,
      default: 0
    },
    completedSessions: {
      type: Number,
      default: 0
    },
    studentSatisfaction: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileCompletion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  searchVisibility: {
    type: Boolean,
    default: false // Default to false until profile is complete
  },
  // Add a field to track if profile is completed
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for performance
mentorSchema.index({ user: 1 });
mentorSchema.index({ expertise: 1 });
mentorSchema.index({ 'subjects.subject': 1 });
mentorSchema.index({ 'subjects.levels': 1 });
mentorSchema.index({ hourlyRate: 1 });
mentorSchema.index({ isVerified: 1, isActive: 1 });
mentorSchema.index({ rating: -1 });
mentorSchema.index({ profileCompletion: -1 });

// Virtual for success rate
mentorSchema.virtual('successRate').get(function() {
  if (this.stats.totalApplications === 0) return 0;
  return (this.stats.hiredApplications / this.stats.totalApplications * 100).toFixed(1);
});

// Pre-save middleware to calculate profile completion and update search visibility
mentorSchema.pre('save', function(next) {
  let completion = 0;
  
  const hasExperience = this.experience && (this.experience.years > 0 || (this.experience.description && this.experience.description.length > 0));

  const fields = [
    this.bio && this.bio.length > 0 ? 1 : 0,
    this.expertise && this.expertise.length > 0 ? 1 : 0,
    this.qualifications && this.qualifications.length > 0 ? 1 : 0,
    hasExperience ? 1 : 0,
    this.education && this.education.length > 0 ? 1 : 0,
    this.subjects && this.subjects.length > 0 ? 1 : 0,
    this.availability && this.availability.length > 0 ? 1 : 0,
    this.hourlyRate > 0 ? 1 : 0
  ];
  
  if (fields.length > 0) {
    completion = (fields.reduce((sum, field) => sum + field, 0) / fields.length) * 100;
  }
  
  this.profileCompletion = Math.round(completion);
  this.isProfileComplete = this.profileCompletion >= 70;
  this.searchVisibility = this.isProfileComplete; // Only show in search when profile is complete
  
  next();
});

// Instance methods
mentorSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

mentorSchema.methods.addApplication = async function() {
  this.stats.totalApplications += 1;
  return this.save();
};

mentorSchema.methods.addHiredApplication = async function() {
  this.stats.hiredApplications += 1;
  return this.save();
};

mentorSchema.methods.addReview = async function(reviewData) {
  this.rating.reviews.push(reviewData);
  
  const totalRating = this.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = (totalRating / this.rating.reviews.length).toFixed(1);
  this.rating.count = this.rating.reviews.length;
  
  return this.save();
};

// Static methods
mentorSchema.statics.findByUserId = function(userId) {
  return this.findOne({ user: userId })
    .populate('user', 'name email avatar phone status');
};

mentorSchema.statics.findActiveMentors = function() {
  return this.find({ 
    isActive: true, 
    isProfileComplete: true, // Use the new field
    isVerified: true 
  })
    .populate('user', 'name email avatar')
    .sort({ profileCompletion: -1, rating: -1 });
};

mentorSchema.statics.findByExpertise = function(expertise) {
  return this.find({
    isActive: true,
    isProfileComplete: true, // Use the new field
    expertise: { $in: [expertise] },
    searchVisibility: true
  })
    .populate('user', 'name email avatar')
    .sort({ rating: -1, profileCompletion: -1 });
};

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;