const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // استخدام MongoDB في الذاكرة للتطوير (بدون تثبيت)
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ MongoDB Memory Server connected');
      console.log('📊 Database URI:', uri);
    } else {
      // استخدام MongoDB الحقيقي للإنتاج
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected');
    }
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
