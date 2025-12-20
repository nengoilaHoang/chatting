import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  },
  pool: { min: 0, max: 7 }
});

db.raw('SELECT 1')
  .then(() => {
    console.log('kết nối db thành công');
  })
  .catch((err) => {
    console.error('kết nối db thất bại:', err);
});

export default db;