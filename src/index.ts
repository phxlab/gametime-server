import dbConnect from './lib/config/db';
import app from './app';

process.env.TZ = 'America/Los_Angeles';

dbConnect()
  .then(() => {
    Bun.serve(app);
    console.log('Server Running');
  })
  .catch((error) => {
    console.error(error);
  });
