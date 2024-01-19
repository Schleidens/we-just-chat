// db.js
import postgres from 'postgres';

const sql = postgres({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
} as any);

export default sql;
