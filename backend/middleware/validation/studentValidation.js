import Joi from 'joi';

const subjectSchema = Joi.object({
  subject: Joi.string().trim().min(1).max(100).required(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').default('Beginner'),
  notes: Joi.string().trim().max(500).allow('')
});

export const createStudentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  dateOfBirth: Joi.date().less('now').required(),
  gradeLevel: Joi.string().trim().min(1).max(50).required(),
  school: Joi.string().trim().min(1).max(200).required(),
  subjects: Joi.array().items(subjectSchema).min(1).required(),
  learningGoals: Joi.string().trim().min(1).max(1000).required(),
  specialNeeds: Joi.string().trim().max(500).allow(''),
  notes: Joi.string().trim().max(2000).allow('')
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  dateOfBirth: Joi.date().less('now'),
  gradeLevel: Joi.string().trim().min(1).max(50),
  school: Joi.string().trim().min(1).max(200),
  subjects: Joi.array().items(subjectSchema).min(1),
  learningGoals: Joi.string().trim().min(1).max(1000),
  specialNeeds: Joi.string().trim().max(500).allow(''),
  notes: Joi.string().trim().max(2000).allow('')
});