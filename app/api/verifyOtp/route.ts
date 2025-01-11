import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/MongoDB";
import User from "@/models/UserModel";
import Otp from "@/models/OtpModel";

export async function POST(req: NextRequest) {
  const { email, otp, name, password } = await req.json();

  if (!email || !otp || !name || !password) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const otpRecord = await Otp.findOne({ email, otp: parseInt(otp) });

    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ message: "Expired OTP" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = `user_${Math.random().toString(36).substring(2, 10)}`;

    const newUser = await User.create({
      name,
      email,
      userId,
      password: hashedPassword,
      provider: "email",
    });

    await Otp.deleteOne({ email });

    const { password: _, ...userData } = newUser.toObject();
    return NextResponse.json({ message: "User created successfully", user: userData }, { status: 201 });
  } catch (error) {
    console.error("Error during user creation:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export function OPTIONS(req: NextRequest) {
  return NextResponse.json({ message: `Method ${req.method} not allowed` }, { status: 405 });
}
