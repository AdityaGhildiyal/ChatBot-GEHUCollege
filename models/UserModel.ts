import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, unique: true, required: true }, 
  userId: { type: String, unique: true, required: true },
  password: { type: String, required: true }, 
  provider: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

export default mongoose.models.User || mongoose.model('User', UserSchema,'User');
