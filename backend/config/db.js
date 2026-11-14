const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tech_blog';
  
  try {
    // Attempt Mongoose connection with a fast 1-second timeout
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 1000,
      connectTimeoutMS: 1000,
    });
    
    isConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}\x1b[0m`);
    return true;
  } catch (error) {
    isConnected = false;
    console.log(`\x1b[33m⚡ Notice: Local MongoDB service not active (${error.message}).\x1b[0m`);
    console.log(`\x1b[36mℹ Activated Built-in Persistent JSON Store fallback so the blog works immediately!\x1b[0m`);
    console.log(`\x1b[90m(To use real MongoDB, start your local mongod or set MONGODB_URI in backend/.env)\x1b[0m`);
    return false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB (Mongoose Native)' : 'Built-in Persistent JSON Store (Mongoose-Compatible)',
});

module.exports = {
  connectDB,
  getDBStatus,
  isMongoConnected: () => isConnected,
};
