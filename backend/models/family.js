const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
  // One parent owns one family (1:1)
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One family per parent
    index: true
  },

  familyName: {
    type: String,
    required: [true, 'Family name is required'],
    trim: true,
    minlength: [2, 'Family name too short'],
    maxlength: [50, 'Family name too long']
  },

  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
  },

  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },

  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'United States' },
    zipCode: String
  },

  timezone: {
    type: String,
    required: [true, 'Timezone is required for scheduling'],
    default: 'America/New_York'
  },

  // For future features: multiple parents, guardians, etc.
  additionalContacts: [{
    name: String,
    email: String,
    phone: String,
    relationship: String // e.g., Mother, Guardian
  }],

  // Soft delete
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Compound index for fast lookup by parent + active status
FamilySchema.index({ parent: 1, isDeleted: 1 });

module.exports = mongoose.model('Family', FamilySchema);