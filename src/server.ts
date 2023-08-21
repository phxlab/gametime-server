import dotenv from 'dotenv';
import colors from 'colors';

import app from './app';
import dbConnect from './config/db';

dotenv.config();
colors.enable();

const PORT: number = process.env.NODE_PORT
  ? parseInt(process.env.NODE_PORT, 10)
  : 3000;

dbConnect()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`.green);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  })
  .catch((err: Error) => {
    console.error(`Error connecting to database: ${err}`.red);
  });
