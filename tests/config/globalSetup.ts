import { importData } from '../../seeder';
import mongoServer from './mogoServer';

const setUp = async () => {
  await mongoServer.start();
  await importData();
};

export default setUp;
