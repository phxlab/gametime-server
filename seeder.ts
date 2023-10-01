import mongoose from 'mongoose';
import { Org, Store, Wave } from './src/models';

let MONGO_URI = Bun.env.MONGO_URI as string;
mongoose
  .connect(`${MONGO_URI}gametime`)
  .then(() => console.log('DB Connected'));

const importData = async () => {};

const deleteData = async () => {
  try {
    await Org.deleteMany();
    await Store.deleteMany();
    await Wave.deleteMany();
  } catch (e) {
    console.error(e);
  }
};

if (process.argv[2] === '-d') {
  deleteData().then(() => {
    console.log('Data deleted');
    process.exit();
  });
} else if (process.argv[2] === '-i') {
  importData().then();
}
