import config from './config.js';

const tearDown = async () => {
  if (config.Memory) {
    const instance = global.__MONGOINSTANCE;
    await instance.stop();
  }

  await global.app.close();
};

export default tearDown;
