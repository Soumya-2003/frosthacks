import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define a connection object to track the database state
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect() {
  // If already connected, reuse the existing connection
  if (connection.isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("Invalid Connection");
    }

    const db = await mongoose.connect(MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

export default dbConnect;