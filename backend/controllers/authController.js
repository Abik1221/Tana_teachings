import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { sendTokenResponse } from "../utils/helpers.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/authValidation.js";

export const register = async (req, res, next) => {
  try {
    const { error, value } = registerValidation.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { email, password, role, profile } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists with this email", 409));
    }

    const user = await User.create({
      email,
      password,
      role,
      profile,
    });

    sendTokenResponse(user, 201, res, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error, value } = loginValidation.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { email, password } = value;

    const user = await User.findOne({ email, isActive: true }).select(
      "+password"
    );

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    sendTokenResponse(user, 200, res, "Login successful");
  } catch (error) {
    next(new AppError(error.message, 401));
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
