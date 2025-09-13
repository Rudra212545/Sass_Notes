const mongoose = require('mongoose');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Tenant.deleteMany({});
    
    // Create tenants
    const acme = await Tenant.create({
      name: 'Acme',
      slug: 'acme',
      plan: 'FREE',
      noteLimit: 3
    });
    
    const globex = await Tenant.create({
      name: 'Globex',
      slug: 'globex', 
      plan: 'FREE',
      noteLimit: 3
    });
    
    // Create required test users (exact emails from assignment)
    const users = [
      { email: 'admin@acme.test', password: 'password', role: 'ADMIN', tenantId: acme._id },
      { email: 'user@acme.test', password: 'password', role: 'MEMBER', tenantId: acme._id },
      { email: 'admin@globex.test', password: 'password', role: 'ADMIN', tenantId: globex._id },
      { email: 'user@globex.test', password: 'password', role: 'MEMBER', tenantId: globex._id }
    ];
    
    for (let userData of users) {
      await User.create(userData);
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
