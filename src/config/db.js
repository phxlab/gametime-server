import mongoose from 'mongoose';

const dbConnect = async () => {
  mongoose.set('strictQuery', false);

  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected: ${conn.connection.host}`.blue);
};

export default dbConnect;
