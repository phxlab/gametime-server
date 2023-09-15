import mongoose from 'mongoose';

const dbConnect = async () => {
  const MONGO_URI = Bun.env.MONGO_URI as string;

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected...`);
  } catch (err) {
    console.error(err);
    throw new Error('Failed to connect to the database');
  }
};

export default dbConnect;
