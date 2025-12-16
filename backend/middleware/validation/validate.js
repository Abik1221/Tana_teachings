import Joi from 'joi';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Higher-order function that returns a middleware to validate request body against a Joi schema
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against
 * @returns {Function} Express middleware
 */
export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
    }

    req.validatedData = value;
    next();
};
