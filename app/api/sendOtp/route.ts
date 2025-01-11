import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import Otp from '@/models/OtpModel';  
import { connectToDatabase } from '@/lib/MongoDB'; 

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    await connectToDatabase();  

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);  

    const otpRecord = new Otp({ email, otp, expiresAt });
    await otpRecord.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code for the chatbot made by Aditya Ghildiyal',
      text: `Your OTP for signup is ${otp}`,
    });

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
  }
}
