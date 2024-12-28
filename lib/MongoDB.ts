import mongoose, { Connection } from 'mongoose';

const { MONGODB_URI } = process.env;

export const connectDB = async (): Promise<Connection> => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (error: Error) => {
      console.error("Mongoose connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection closed due to app termination");
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    }
    throw error;  
  }
};
