import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { ROLES, USER_STATUS } from "../config/constants.js";

// Base User Schema - Stores ONLY common identity data
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      // Note: We keep this to know which separate collection (Family/Student/Mentor) to query
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isMobilePhone(v, "any");
        },
        message: "Please provide a valid phone number",
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
 },
    },
  }
);

// Indexes
userSchema.index({ role: 1, status: 1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if user is active
userSchema.methods.isActive = function () {
  return this.status === USER_STATUS.ACTIVE;
};

// Static method to find active user by email
userSchema.statics.findActiveByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase(),
    status: USER_STATUS.ACTIVE,
  }).select("+password");
};

const User = mongoose.model("User", userSchema);

export default User;
