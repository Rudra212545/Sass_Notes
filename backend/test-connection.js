const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    console.log('📁 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test if we can create a simple collection
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection works' });
    await testCollection.deleteOne({ test: 'connection works' });
    console.log('✅ Database operations working!');
    
    await mongoose.disconnect();
    console.log('✅ Connection test complete!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('💡 Check your MONGODB_URI in .env file');
  }
};

testConnection();
