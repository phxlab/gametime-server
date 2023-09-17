import mongoose from 'mongoose';

export const startMongoose = async () => {
  const options = {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'gametime',
  };

  await mongoose.connect('mongodb://root:password@localhost:27017/', options);
};

export const closeMongoose = async () => {
  await mongoose.connection.close();
};
