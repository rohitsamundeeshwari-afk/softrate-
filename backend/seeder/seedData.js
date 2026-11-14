const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB, isMongoConnected } = require('../config/db');
const { initStore } = require('../data/store');

async function runSeed() {
  console.log('--- Initializing Data Seeder ---');
  await connectDB();
  await initStore();
  console.log('--- Data Seeder Completed Successfully ---');
  process.exit(0);
}

runSeed();
