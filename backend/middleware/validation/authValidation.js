import Joi from 'joi';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ROLES } from '../../config/constants.js';

// Address schema (reusable)
const addressSchema = Joi.object({
  street: Joi.string().trim().min(1).max(200).required(),
  city: Joi.string().trim().min(1).max(100).required(),
  state: Joi.string().trim().min(1).max(50).required(),
  zipCode: Joi.string().trim().min(1).max(20).required(),
  country: Joi.string().trim().default('United States')
});

// Family profile schema (for POST-registration)
const familyProfileSchema = Joi.object({
  familyName: Joi.string().trim().min(1).max(100).required(),
  address: addressSchema.required(),
  contactPhone: Joi.string().optional(),
  preferredContactMethod: Joi.string().valid('email', 'phone', 'text').default('email'),
  timezone: Joi.string().trim().default('America/New_York')
});

// Student profile schema (for POST-registration)
const studentProfileSchema = Joi.object({
  dateOfBirth: Joi.date().required().max('now'),
  gradeLevel: Joi.string().required(),
  familyId: Joi.string().required(), // Family document ID
  subjects: Joi.array().items(
    Joi.object({
      subject: Joi.string().required(),
      level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Honors', 'AP'),
      focusAreas: Joi.array().items(Joi.string())
    })
  ).min(1)
});

// Mentor profile schema (for POST-registration)
const mentorProfileSchema = Joi.object({
  bio: Joi.string().max(1000),
  expertise: Joi.array().items(Joi.string()).min(1).required(),
  qualifications: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('degree', 'certification', 'license', 'award', 'other').required(),
      title: Joi.string().required(),
      institution: Joi.string().required(),
      year: Joi.number().min(1950).max(new Date().getFullYear()),
      documentUrl: Joi.string().uri(),
      isVerified: Joi.boolean().default(false)
    })
  ),
  experience: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.object({
      years: Joi.number().min(0).default(0),
      description: Joi.string().max(500).default(''),
      previousRoles: Joi.array().items(
        Joi.object({
          position: Joi.string(),
          organization: Joi.string(),
          duration: Joi.string(),
          description: Joi.string()
        })
      )
    })
  ),
  education: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      institution: Joi.string().required(),
      fieldOfStudy: Joi.string().required(),
      year: Joi.number().min(1950).max(new Date().getFullYear()),
      isVerified: Joi.boolean().default(false)
    })
  ),
  hourlyRate: Joi.number().min(0).default(0),
  availability: Joi.array().items(
    Joi.object({
      day: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required(),
      slots: Joi.array().items(
        Joi.object({
          start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
          end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
          isAvailable: Joi.boolean().default(true)
        })
      )
    })
  ),
  subjects: Joi.array().items(
    Joi.object({
      subject: Joi.string().required(),
      levels: Joi.array().items(Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Honors', 'AP', 'College')).required(),
      hourlyRate: Joi.number().min(0),
      experience: Joi.number().min(0).default(0)
    })
  )
});

// REGISTRATION SCHEMA - COMMON DATA ONLY (NO profileData)
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid(...Object.values(ROLES)).required(),
  phone: Joi.string().optional().allow('')
  // NO profileData during registration
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required()
});

// Profile creation schemas (for after login)
export const createFamilyProfileSchema = familyProfileSchema;
export const createStudentProfileSchema = studentProfileSchema;
export const createMentorProfileSchema = mentorProfileSchema;

// Validation middleware
export const validateRegistration = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
  }

  req.validatedData = value;
  next();
};

export const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
  }

  req.validatedData = value;
  next();
};

export const validateFamilyProfile = (req, res, next) => {
  const { error, value } = createFamilyProfileSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
  }

  req.validatedData = value;
  next();
};

export const validateStudentProfile = (req, res, next) => {
  const { error, value } = createStudentProfileSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
  }

  req.validatedData = value;
  next();
};

export const validateMentorProfile = (req, res, next) => {
  const { error, value } = createMentorProfileSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
  }

  req.validatedData = value;
  next();
};