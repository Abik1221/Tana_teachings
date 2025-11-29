import Joi from 'joi';

// Mentor profile validation
export const validateMentorProfile = (req, res, next) => {
  const availabilitySlotSchema = Joi.object({
    start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    isAvailable: Joi.boolean().default(true)
  });

  const availabilitySchema = Joi.object({
    day: Joi.string().valid(
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ).required(),
    slots: Joi.array().items(availabilitySlotSchema).min(1).required()
  });

  const qualificationSchema = Joi.object({
    type: Joi.string().valid('degree', 'certification', 'license', 'award', 'other').required(),
    title: Joi.string().trim().max(100).required(),
    institution: Joi.string().trim().max(100).required(),
    year: Joi.number().integer().min(1950).max(new Date().getFullYear()),
    documentUrl: Joi.string().uri().optional()
  });

  const educationSchema = Joi.object({
    degree: Joi.string().trim().max(100).required(),
    institution: Joi.string().trim().max(100).required(),
    fieldOfStudy: Joi.string().trim().max(100).required(),
    year: Joi.number().integer().min(1950).max(new Date().getFullYear())
  });

  const subjectSchema = Joi.object({
    subject: Joi.string().trim().max(50).required(),
    levels: Joi.array().items(
      Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Honors', 'AP', 'College')
    ).min(1).required(),
    hourlyRate: Joi.number().min(0),
    experience: Joi.number().min(0).default(0)
  });

  const experienceSchema = Joi.object({
    years: Joi.number().min(0).default(0),
    description: Joi.string().max(500).trim().optional(),
    previousRoles: Joi.array().items(Joi.object({
      position: Joi.string().trim().max(100),
      organization: Joi.string().trim().max(100),
      duration: Joi.string().trim().max(50),
      description: Joi.string().max(300).trim()
    })).optional()
  });

  const schema = Joi.object({
    bio: Joi.string().max(1000).trim().allow(''),
    expertise: Joi.array().items(Joi.string().trim().max(50)).min(1).required(),
    qualifications: Joi.array().items(qualificationSchema).optional(),
    education: Joi.array().items(educationSchema).optional(),
    experience: experienceSchema.optional(),
    hourlyRate: Joi.number().min(0).default(0),
    availability: Joi.array().items(availabilitySchema).optional(),
    subjects: Joi.array().items(subjectSchema).optional(),
    searchVisibility: Joi.boolean().default(true)
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMessage
    });
  }

  req.body = value;
  next();
};

// Job application validation
export const validateJobApplication = (req, res, next) => {
  const schema = Joi.object({
    jobId: Joi.string().required(),
    applicationText: Joi.string().min(50).max(2000).required().trim(),
    whyFit: Joi.string().min(30).max(1000).required().trim(),
    proposedApproach: Joi.string().max(1000).trim().optional().allow('')
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  req.body = value;
  next();
};