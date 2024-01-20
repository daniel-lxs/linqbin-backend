import mongoose from 'mongoose';

export async function initConnection() {
  const mongoDbURI = process.env.MONGODB_URI;
  const mongoDbUser = process.env.MONGODB_USER;
  const mongoDbPassword = process.env.MONGODB_PASSWORD;
  if (!mongoDbURI) {
    throw new Error('MONGODB_URI not set');
  }

  const options = {
    user: mongoDbUser,
    pass: mongoDbPassword,
    authSource: 'admin',
  };

  console.log(`Connecting to MongoDB: ${mongoDbURI}`);

  try {
    await mongoose.connect(mongoDbURI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', JSON.stringify(error));
    throw error;
  }
}
