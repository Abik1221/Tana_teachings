import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../config/environment.js";

export class TokenService {
  static generateToken(payload, options = {}) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "mentorship-platform",
      ...options,
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  static generateAuthTokens(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateToken(payload);

    return {
      access: {
        token: accessToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    };
  }
}
