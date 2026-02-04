require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('🔍 Testing MongoDB connection...');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connection successful!');

    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    console.log(`🔗 Port: ${mongoose.connection.port}`);

    // Test a simple query
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`📦 Collections: ${collections.length}`);

    await mongoose.connection.close();
    console.log('📤 Connection closed.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
