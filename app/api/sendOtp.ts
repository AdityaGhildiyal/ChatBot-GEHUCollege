
import nodemailer from 'nodemailer'
import { NextApiRequest, NextApiResponse } from 'next'

let otpStore: Record<string, number> = {}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  const otp = Math.floor(100000 + Math.random() * 900000) 
  otpStore[email] = otp 

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP for signup is ${otp}`,
    })

    res.status(200).json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Error sending OTP:', error)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}
