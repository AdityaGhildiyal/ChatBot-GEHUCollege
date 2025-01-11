import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/MongoDB";
import User from "@/models/UserModel";

interface OtpStore {
  [email: string]: number;
}

let otpStore: OtpStore = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const { email, otp, name, password, provider } = req.body;

    if (!email || !otp || !name || !password || !provider) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!otpStore[email]) {
      return res.status(400).json({ message: "OTP not requested or expired" });
    }

    if (otpStore[email] !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    try {
      // Connect to the database
      await connectToDatabase();

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate a unique userId
      const userId = `user_${Math.random().toString(36).substring(2, 10)}`;

      // Create a new user
      const newUser = await User.create({
        name,
        email,
        userId,
        password: hashedPassword,
        provider,
      });

      // Remove OTP from store after successful verification
      delete otpStore[email];

      // Respond with the newly created user (excluding password)
      const { password: _, ...userData } = newUser.toObject();
      res.status(201).json({ message: "User created successfully", user: userData });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
