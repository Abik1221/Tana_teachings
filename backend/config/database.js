import mongoose from "mongoose";
import env from "./environment.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoose.url);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
