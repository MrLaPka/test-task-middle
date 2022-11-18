import mongoose from 'mongoose';

// callback gets triggered when a connection is open
export const connectToDb = async (
  db_url: string,
  callback: () => void,
): Promise<typeof mongoose | undefined> => {
  try {
    const db = mongoose.connection;
    db.on('connecting', () => {
      console.info('Connecting to MongoDB...');
    });

    db.on('error', (error) => {
      console.error(`Error in MongoDb connection: ${error}`);
      mongoose.disconnect();
    });
    db.once('open', () => {
      console.info('MongoDB connection opened!');
      setTimeout(callback, 1000);
    });
    db.on('reconnected', () => {
      console.info('MongoDB reconnected!');
    });
    db.on('disconnected', () => {
      console.info('MongoDB disconnected!');
      mongoose.connect(db_url);
    });
    return mongoose.connect(db_url);
  } catch (error: any) {
    console.error(`Error when connecting to MongoDb: ${error?.message}`, { stack: error?.stack });
  }
};
