import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();
colors.enable();

import Store from './src/blueprints/stores/model.js'
// import Item from './src/blueprints/items/model.js'
// import Category from './src/blueprints/categories/model.js';


const stores = JSON.parse(fs.readFileSync('./__data__/stores.json', 'utf-8'));
// const items = JSON.parse(fs.readFileSync(`${__dirname}/__data__/items.json`, 'utf-8'));
// const categories = JSON.parse(fs.readFileSync(`${__dirname}/__data__/categories.json`, 'utf-8'));

export const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Store.create(stores);
    console.log('Database seeded'.green);
    await mongoose.connection.close();
  } catch (err) {
    console.error(err.red);
  }
};

const deleteData = async () => {
  try {
    await Store.deleteMany();
    console.log('Database removed'.red);
    process.exit(1)
  } catch (err) {
    console.error(err.red);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
