import mongoose, { Document, Schema } from 'mongoose';

interface IOtp extends Document {
  email: string;
  otp: number;
  createdAt: Date;
  expiresAt: Date;
}

const otpSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Otp = mongoose.models.Otp || mongoose.model<IOtp>('Otp', otpSchema);

export default Otp;
