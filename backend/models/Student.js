import mongoose from 'mongoose';

const academicRecordSchema = new mongoose.Schema({
  subject: { type: String, trim: true, default: '' },
  grade: { type: String, trim: true, default: '' },
  date: { type: Date, default: Date.now },
  notes: { type: String, trim: true, default: '' }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  // NO user reference - students don't log in
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: [true, 'Student must belong to a family'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  dateOfBirth: {
    type: Date,
    default: null  // Will be filled later by family
  },
  gradeLevel: {
    type: String,
    trim: true,
    default: ''
  },
  school: {
    type: String,
    trim: true,
    default: ''
  },
  subjects: [{
    subject: { type: String, trim: true, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    notes: { type: String, trim: true, default: '' }
  }],
  learningGoals: {
    type: String,
    trim: true,
    maxlength: [1000, 'Learning goals cannot exceed 1000 characters'],
    default: ''
  },
  specialNeeds: {
    type: String,
    trim: true,
    maxlength: [500, 'Special needs description cannot exceed 500 characters'],
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    default: ''
  },
  academicRecords: [academicRecordSchema],
  preferences: {
    preferredLearningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
      default: 'visual'
    },
    preferredTimeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'afternoon'
    },
    specialInterests: [{ type: String, trim: true }]
  },
  stats: {
    totalSessions: { type: Number, default: 0 },
    completedSessions: { type: Number, default: 0 },
    cancelledSessions: { type: Number, default: 0 },
    averageSessionRating: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isProfileComplete: { type: Boolean, default: false },
  profileCompletion: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
studentSchema.index({ family: 1, isActive: 1 });
studentSchema.index({ gradeLevel: 1 });

// Virtual for age
studentSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const ageDiffMs = Date.now() - this.dateOfBirth.getTime();
  const ageDate = new Date(ageDiffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// Pre-save middleware to calculate profile completion
studentSchema.pre('save', function(next) {
  const required = [
    this.name && this.name.length > 0,
    this.dateOfBirth !== null,
    this.gradeLevel && this.gradeLevel.length > 0,
    this.school && this.school.length > 0,
    this.subjects && this.subjects.length > 0
  ];
  this.profileCompletion = Math.round((required.filter(Boolean).length / required.length) * 100);
  this.isProfileComplete = this.profileCompletion >= 75;
  next();
});

// Instance methods
studentSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

studentSchema.methods.addSession = async function(sessionType = 'completed') {
  this.stats.totalSessions += 1;
  if (sessionType === 'completed') {
    this.stats.completedSessions += 1;
  } else if (sessionType === 'cancelled') {
    this.stats.cancelledSessions += 1;
  }
  await this.save();
  return this;
};

// Static methods
studentSchema.statics.findByFamilyUserId = function(familyUserId) {
  return this.find({ family: familyUserId, isActive: true })
    .sort({ createdAt: -1 });
};

studentSchema.statics.findByFamilyId = function(familyId) {
  return this.find({ family: familyId, isActive: true })
    .sort({ createdAt: -1 });
};

const Student = mongoose.model('Student', studentSchema);
export default Student;