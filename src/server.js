import dotenv from 'dotenv';
import colors from 'colors';
import app from './app.js';
import dbConnect from './config/db.js';

dotenv.config();
colors.enable();

const PORT = process.env.NODE_PORT;

dbConnect()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`.green);
    });

    process.on('Unhandled Rejection Error', (err) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error(`Error connecting to database: ${err}`.red);
  });
