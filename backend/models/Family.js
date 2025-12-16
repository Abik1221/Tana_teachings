import mongoose from 'mongoose';
import { ROLES } from '../config/constants.js';

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  state: { type: String, trim: true, default: '' },
  zipCode: { type: String, trim: true, default: '' },
  country: { type: String, default: 'United States' }
}, { _id: false });

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true , pattern: /^\+?[\d\s-()]+$/, default: '' },
  relationship: { type: String, trim: true, default: '' }
}, { _id: false });

const familySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  familyName: {
    type: String,
    trim: true,
    default: '',
    maxlength: [100, 'Family name cannot exceed 100 characters']
  },
  address: {
    type: addressSchema,
    default: () => ({})
  },
  contactPhone: {
    type: String,
    trim: true,
    default: ''
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'sms'],
    default: 'email'
  },
  timezone: {
    type: String,
    default: 'America/New_York'
  },
  emergencyContact: {
    type: emergencyContactSchema,
    default: () => ({})
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  billingInfo: {
    paymentMethodId: { type: String, default: null },
    billingAddress: { type: addressSchema, default: () => ({}) }
  },
  stats: {
    totalStudents: { type: Number, default: 0 },
    activeJobs: { type: Number, default: 0 },
    completedSessions: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isProfileComplete: { type: Boolean, default: false },
  profileCompletion: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
familySchema.index({ user: 1 });
familySchema.index({ isProfileComplete: 1, isActive: 1 });

// Virtual for student count
familySchema.virtual('studentCount').get(function() {
  return this.students?.length || 0;
});

// Pre-save middleware to calculate profile completion
familySchema.pre('save', function(next) {
  const required = [
    this.familyName && this.familyName.length > 0,
    this.address?.street?.length > 0 && this.address?.city?.length > 0,
    this.contactPhone?.length > 0
  ];
  this.profileCompletion = Math.round((required.filter(Boolean).length / required.length) * 100);
  this.isProfileComplete = this.profileCompletion >= 80;
  next();
});

// Instance methods
familySchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

familySchema.methods.addStudent = async function(studentId) {
  if (!this.students.includes(studentId)) {
    this.students.push(studentId);
    this.stats.totalStudents = this.students.length;
    await this.save();
  }
  return this;
};

familySchema.methods.removeStudent = async function(studentId) {
  this.students.pull(studentId);
  this.stats.totalStudents = this.students.length;
  await this.save();
  return this;
};

// Static methods
familySchema.statics.findByUserId = function(userId) {
  return this.findOne({ user: userId })
    .populate('students', 'name gradeLevel subjects isActive profileCompletion')
    .populate('user', 'name email avatar phone');
};

const Family = mongoose.model('Family', familySchema);
export default Family;