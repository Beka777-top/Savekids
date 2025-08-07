const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://begarys:Mtgj8mhpY6LrjurGwssTho9bRmBZd6ZS@dpg-d2a1j28gjchc73e52qpg-a.oregon-postgres.render.com/savekids_db_m8y4',
  ssl:{ rejectUnauthorized: false }
  // user: 'postgres',
  // host: 'localhost',
  // database: 'SaveKidsDB',
  // password: '123456',
  // port: 5432,
});


module.exports = pool;
