const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('❌ Missing NEON_DATABASE_URL in .env.local');
  process.exit(1);
}

async function runSQL(sql) {
  const db = neon(connectionString);
  try {
    await db(sql);
    return true;
  } catch (error) {
    console.error('SQL Error:', error.message);
    throw error;
  }
}

async function setupDatabase() {
  console.log('🔌 Connecting to Neon database...\n');
  
  // Read schema file
  const schemaPath = path.join(__dirname, 'neon_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  console.log('📋 Running schema SQL...');
  try {
    await runSQL(schema);
    console.log('✅ Tables created successfully!\n');
  } catch (error) {
    console.error('❌ Failed to create tables:', error.message);
    process.exit(1);
  }
  
  // Read seed file
  const seedPath = path.join(__dirname, 'supabase', 'seed.sql');
  const seed = fs.readFileSync(seedPath, 'utf-8');
  
  console.log('🌱 Running seed data...');
  try {
    await runSQL(seed);
    console.log('✅ Seed data inserted successfully!\n');
  } catch (error) {
    console.error('❌ Failed to insert seed data:', error.message);
    process.exit(1);
  }
  
  // Verify data
  console.log('🔍 Verifying data...');
  const db = neon(connectionString);
  const chapters = await db`SELECT COUNT(*) as count FROM chapters`;
  const challenges = await db`SELECT COUNT(*) as count FROM challenges`;
  
  console.log(`✅ Database setup complete!`);
  console.log(`   - Chapters: ${chapters[0].count}`);
  console.log(`   - Challenges: ${challenges[0].count}`);
}

setupDatabase().catch(err => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
