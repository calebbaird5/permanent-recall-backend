import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

export default class MongooseService {
  private count = 0;

  constructor() {
    console.log('about to call connectWithRetry')
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = () => {
    console.log('Attempting MongoDB connection (will retry if needed)');
    log('Attempting MongoDB connection (will retry if needed)');
    mongoose
      .connect('mongodb://mongo:27017/permanent_recall')
      .then(() => {
        console.log('MongoDB is connected');
      })
      .catch((err) => {
        const retrySeconds = 5;
        console.log(
          `MongoDB connection unsuccessful (will retry #${++this
.count} after ${retrySeconds} seconds):`,
          err
        );
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}
