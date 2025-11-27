import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS } from "../../config/environment.js";

export class PasswordService {
  static async hashPassword(password) {
    return await bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }

    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }

    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }

    if (!hasNumbers) {
      return "Password must contain at least one number";
    }

    return null;
  }
}
