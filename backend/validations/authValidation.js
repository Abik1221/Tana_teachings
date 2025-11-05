import Joi from "joi";

export const registerValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("parent", "mentor", "admin").required(),
  profile: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,}$/),
  }).required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
