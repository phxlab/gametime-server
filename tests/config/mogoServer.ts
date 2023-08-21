import { MongoMemoryServer } from 'mongodb-memory-server';

class MongoServerManager {
  private instance: MongoMemoryServer | null = null;

  async start() {
    this.instance = await MongoMemoryServer.create();
    process.env.MONGO_URI = this.instance.getUri();
  }

  async stop() {
    if (this.instance) {
      await this.instance.stop();
      this.instance = null;
    }
  }

  getInstance(): MongoMemoryServer | null {
    return this.instance;
  }
}

export default new MongoServerManager();
