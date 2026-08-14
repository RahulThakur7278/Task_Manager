import dns from 'dns';
import mongoose from 'mongoose';

// Attempt to use Google DNS for SRV resolution fallback if available
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore if custom DNS servers cannot be set
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB Disconnected. Reconnecting...');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Connection Event Error: ${err.message}`);
});

export default connectDB;