const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL;
  let client;

  if (connectionString) {
    client = new Client({
      connectionString,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    });
  } else {
    // First connect without specifying database to create it
    const adminClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: 'postgres',
    });

    try {
      await adminClient.connect();
      console.log('✅ Connected to PostgreSQL server');

      // Create database if not exists
      const dbName = process.env.DB_NAME || 'pulseplate';
      const result = await adminClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );

      if (result.rows.length === 0) {
        await adminClient.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Database '${dbName}' created`);
      } else {
        console.log(`ℹ️  Database '${dbName}' already exists`);
      }

      await adminClient.end();
    } catch (e) {
      console.log('ℹ️ Admin connection note:', e.message);
    }

    // Connect to the target database
    client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'pulseplate',
    });
  }

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Run schema
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);
    console.log('✅ Schema applied');

    // Hash passwords and run seed
    const bcrypt = require('bcryptjs');
    const passwords = {
      AO: 'AO@KPRIET',
      ADMIN94: '23EC094',
      ADMIN15: '23EC115',
      ADMINL3: '23ECL03',
      DRIVER: 'Driver1',
      STUDENT: 'Student1',
    };

    const hashes = {};
    for (const [key, pw] of Object.entries(passwords)) {
      hashes[key] = await bcrypt.hash(pw, 10);
    }
    console.log('✅ Passwords hashed');

    // Run seed with correct hashes
    const seedPath = path.join(__dirname, '../../../database/seed.sql');
    let seed = fs.readFileSync(seedPath, 'utf8');

    // Replace placeholder hashes with real ones
    seed = seed.replace(
      /'\$2b\$10\$92IXUNpkjO0rOQ5byMi\.Ye4oKoEa3Ro9llC\/\.og\/at2\.uheWG\/igi'/g,
      `'${hashes.DRIVER}'`
    );

    await client.query(seed);
    console.log('✅ Seed data inserted');

    // Update specific users with correct passwords
    await client.query(`UPDATE users SET password_hash = $1 WHERE email = 'riyashmoorthy@gmail.com'`, [hashes.AO]);
    await client.query(`UPDATE users SET password_hash = $1 WHERE email = '23ec094@kpriet.ac.in'`, [hashes.ADMIN94]);
    await client.query(`UPDATE users SET password_hash = $1 WHERE email = '23ec115@kpriet.ac.in'`, [hashes.ADMIN15]);
    await client.query(`UPDATE users SET password_hash = $1 WHERE email = '23ecl03@kpriet.ac.in'`, [hashes.ADMINL3]);
    await client.query(
      `UPDATE users SET password_hash = $1 WHERE role = 'STUDENT'`,
      [hashes.STUDENT]
    );

    console.log('✅ Passwords updated correctly');
    console.log('');
    console.log('🎉 PULSE PLATE database setup complete!');
    console.log('');
    console.log('Demo Credentials:');
    console.log('  AO:      riyashmoorthy@gmail.com / AO@KPRIET');
    console.log('  Admin 1: 23ec094@kpriet.ac.in   / 23EC094');
    console.log('  Admin 2: 23ec115@kpriet.ac.in   / 23EC115');
    console.log('  Admin 3: 23ecl03@kpriet.ac.in   / 23ECL03');
    console.log('  Driver:  driver1@kpriet.ac.in   / Driver1');
    console.log('  Student: student1@kpriet.ac.in  / Student1');

    await client.end();
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupDatabase();
