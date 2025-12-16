import Joi from 'joi';

const addressSchema = Joi.object({
  street: Joi.string().trim().min(1).max(200).required(),
  city: Joi.string().trim().min(1).max(100).required(),
  state: Joi.string().trim().min(1).max(100).required(),
  zipCode: Joi.string().trim().min(1).max(20).required(),
  country: Joi.string().trim().default('United States')
});

const emergencyContactSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  phone: Joi.string().trim().pattern(/^\+?[\d\s-()]+$/).required(),
  relationship: Joi.string().trim().min(1).max(50).required()
});

const createFamilySchema = Joi.object({
  familyName: Joi.string().trim().min(2).max(100).required(),
  address: addressSchema.required(),
  contactPhone: Joi.string().trim().pattern(/^\+?[\d\s-()]+$/).required(),
  preferredContactMethod: Joi.string().valid('email', 'phone', 'sms').default('email'),
  timezone: Joi.string().default('America/New_York'),
  emergencyContact: emergencyContactSchema.required()
});

const updateFamilySchema = Joi.object({
  familyName: Joi.string().trim().min(2).max(100),
  address: addressSchema,
  contactPhone: Joi.string().trim().pattern(/^\+?[\d\s-()]+$/),
  preferredContactMethod: Joi.string().valid('email', 'phone', 'sms'),
  timezone: Joi.string(),
  emergencyContact: emergencyContactSchema
});

export { createFamilySchema, updateFamilySchema }