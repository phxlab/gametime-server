import mongoose from 'mongoose';

const dbConnect = async () => {
  let MONGO_URI = Bun.env.MONGO_URI as string;

  const options = {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'gametime',
  };

  try {
    await mongoose.connect(MONGO_URI, options);

    console.log(`MongoDB Connected...`);
  } catch (err) {
    console.error(err);
    throw new Error('Failed to connect to the database');
  }
};

export default dbConnect;
