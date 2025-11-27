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

// Family profile schema
const familyProfileSchema = Joi.object({
  familyName: Joi.string().trim().min(1).max(100).required(),
  address: addressSchema.required(),
  preferredContactMethod: Joi.string().valid('email', 'phone', 'text').default('email'),
  timezone: Joi.string().trim().default('America/New_York')
});

// Student profile schema
const studentProfileSchema = Joi.object({
  dateOfBirth: Joi.date().required().max('now'),
  gradeLevel: Joi.string().required(),
  subjects: Joi.array().items(
    Joi.object({
      subject: Joi.string().required(),
      level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Honors', 'AP'),
      focusAreas: Joi.array().items(Joi.string())
    })
  ).min(1),
  family: Joi.string().required() // Family user ID
});

// Mentor profile schema (for future)
const mentorProfileSchema = Joi.object({
  bio: Joi.string().max(1000),
  expertise: Joi.array().items(
    Joi.object({
      subject: Joi.string().required(),
      level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Honors', 'AP').required(),
      yearsOfExperience: Joi.number().min(0),
      hourlyRate: Joi.number().min(0).required()
    })
  ).min(1),
  education: Joi.array().items(
    Joi.object({
      degree: Joi.string(),
      institution: Joi.string(),
      year: Joi.number()
    })
  ),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      issuer: Joi.string(),
      year: Joi.number()
    })
  )
});

// Enhanced register schema with role-based profiles
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid(...Object.values(ROLES)).required(),
  phone: Joi.string().optional().allow(''),
  
  // Role-specific profile data
  profileData: Joi.when('role', {
    is: ROLES.FAMILY,
    then: familyProfileSchema.required(),
    otherwise: Joi.when('role', {
      is: ROLES.STUDENT,
      then: studentProfileSchema.required(),
      otherwise: Joi.when('role', {
        is: ROLES.MENTOR,
        then: mentorProfileSchema.required(),
        otherwise: Joi.forbidden() // No profile data for admin
      })
    })
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required()
});

// Validation middleware (same as before)
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