const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

let dbInstance = null;
let initPromise = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const pgHost = process.env.DB_HOST || 'localhost';
    const pgPort = parseInt(process.env.DB_PORT || '5432');
    let useExternal = false;

    // 1. Try external PostgreSQL if available (Render, Neon, Supabase, or local PG)
    try {
      const { Pool } = require('pg');
      const connectionString = process.env.DATABASE_URL;
      const isCloudOrSSL = Boolean(connectionString) || process.env.DB_SSL === 'true';

      const poolConfig = connectionString
        ? {
            connectionString,
            ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000,
          }
        : {
            host: pgHost,
            port: pgPort,
            database: process.env.DB_NAME || 'pulseplate',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            ssl: isCloudOrSSL ? { rejectUnauthorized: false } : false,
            connectionTimeoutMillis: 2000,
          };

      const testPool = new Pool(poolConfig);
      await testPool.query('SELECT 1');
      console.log('✅ Connected to external PostgreSQL database');

      // Check if external database needs schema & seed data
      let needsInit = false;
      try {
        const check = await testPool.query("SELECT 1 FROM information_schema.tables WHERE table_name = 'users'");
        if (check.rows.length === 0) needsInit = true;
      } catch {
        needsInit = true;
      }

      if (needsInit) {
        console.log('📦 Bootstrapping external PostgreSQL schema and seed data...');
        const schemaPath = path.join(__dirname, '../../../database/schema.sql');
        const seedPath = path.join(__dirname, '../../../database/seed.sql');

        let schema = fs.readFileSync(schemaPath, 'utf8');
        await testPool.query(schema);

        let seed = fs.readFileSync(seedPath, 'utf8');
        await testPool.query(seed);

        const passwords = {
          AO: await bcrypt.hash('AO@KPRIET', 10),
          ADMIN94: await bcrypt.hash('23EC094', 10),
          ADMIN15: await bcrypt.hash('23EC115', 10),
          ADMINL3: await bcrypt.hash('23ECL03', 10),
          DRIVER: await bcrypt.hash('Driver1', 10),
          STUDENT: await bcrypt.hash('Student1', 10),
        };

        await testPool.query(`UPDATE users SET password_hash = $1 WHERE email = 'riyashmoorthy@gmail.com'`, [passwords.AO]);
        await testPool.query(`UPDATE users SET password_hash = $1 WHERE email = '23ec094@kpriet.ac.in'`, [passwords.ADMIN94]);
        await testPool.query(`UPDATE users SET password_hash = $1 WHERE email = '23ec115@kpriet.ac.in'`, [passwords.ADMIN15]);
        await testPool.query(`UPDATE users SET password_hash = $1 WHERE email = '23ecl03@kpriet.ac.in'`, [passwords.ADMINL3]);
        await testPool.query(`UPDATE users SET password_hash = $1 WHERE role = 'DRIVER'`, [passwords.DRIVER]);
        await testPool.query(`UPDATE users SET password_hash = $1 WHERE role = 'STUDENT'`, [passwords.STUDENT]);

        console.log('✅ External Database initialized with all demo users and credentials!');
      }

      dbInstance = testPool;
      useExternal = true;
    } catch (err) {
      console.log('ℹ️ External PostgreSQL connection not available (' + err.message + '), falling back to PGlite...');
      useExternal = false;
    }

    // 2. Fall back to embedded persistent PGlite (PostgreSQL WASM with disk storage)
    if (!useExternal) {
      console.log('⚡ Using Embedded PostgreSQL (PGlite)...');
      const { PGlite } = require('@electric-sql/pglite');
      const dataDir = path.join(__dirname, '../../../database/pgdata');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const pglite = new PGlite(dataDir);

      let needsInit = false;
      try {
        const check = await pglite.query('SELECT COUNT(*) FROM users');
        if (parseInt(check.rows[0].count, 10) === 0) needsInit = true;
      } catch {
        needsInit = true;
      }

      if (needsInit) {
        console.log('📦 Bootstrapping database schema and seed data...');
        const schemaPath = path.join(__dirname, '../../../database/schema.sql');
        const seedPath = path.join(__dirname, '../../../database/seed.sql');

        let schema = fs.readFileSync(schemaPath, 'utf8');
        schema = schema.replace(/CREATE EXTENSION IF NOT EXISTS "uuid-ossp";/g, '');
        schema = schema.replace(/uuid_generate_v4\(\)/g, 'gen_random_uuid()');
        await pglite.exec(schema);

        let seed = fs.readFileSync(seedPath, 'utf8');
        await pglite.exec(seed);

        // Update real password hashes
        const passwords = {
          AO: await bcrypt.hash('AO@KPRIET', 10),
          ADMIN94: await bcrypt.hash('23EC094', 10),
          ADMIN15: await bcrypt.hash('23EC115', 10),
          ADMINL3: await bcrypt.hash('23ECL03', 10),
          DRIVER: await bcrypt.hash('Driver1', 10),
          STUDENT: await bcrypt.hash('Student1', 10),
        };

        await pglite.query(`UPDATE users SET password_hash = $1 WHERE email = 'riyashmoorthy@gmail.com'`, [passwords.AO]);
        await pglite.query(`UPDATE users SET password_hash = $1 WHERE email = '23ec094@kpriet.ac.in'`, [passwords.ADMIN94]);
        await pglite.query(`UPDATE users SET password_hash = $1 WHERE email = '23ec115@kpriet.ac.in'`, [passwords.ADMIN15]);
        await pglite.query(`UPDATE users SET password_hash = $1 WHERE email = '23ecl03@kpriet.ac.in'`, [passwords.ADMINL3]);
        await pglite.query(`UPDATE users SET password_hash = $1 WHERE role = 'DRIVER'`, [passwords.DRIVER]);
        await pglite.query(`UPDATE users SET password_hash = $1 WHERE role = 'STUDENT'`, [passwords.STUDENT]);

        console.log('✅ Embedded Database initialized with all demo users and credentials!');
      } else {
        console.log('✅ Embedded PostgreSQL database loaded.');
      }

      dbInstance = pglite;
    }

    return dbInstance;
  })();

  return initPromise;
}

const pool = {
  query: async (text, params) => {
    const db = await getDb();
    return db.query(text, params);
  },
  on: (event, handler) => {
    if (event === 'connect') {
      getDb().then(() => handler()).catch(() => {});
    }
  },
};

module.exports = pool;
