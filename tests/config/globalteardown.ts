import mongoServer from './mogoServer'

const tearDown = async () => {
    await mongoServer.stop();
};

export default tearDown;
