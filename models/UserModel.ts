import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's full name
  email: { type: String, unique: true, required: true }, // User's email
  userId: { type: String, unique: true, required: true }, // Unique identifier for the user
  password: { type: String, required: true }, // Plaintext password (not recommended for production)
  provider: { type: String, required: true }, // e.g., "google" or "local"
  createdAt: { type: Date, default: Date.now }, // Timestamp for user creation
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
