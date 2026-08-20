import mysql from 'mysql2/promise'
import { config } from 'dotenv'

config({ path: ['.env.local', '.env'] })

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_content_editor',
  waitForConnections: true,
  connectionLimit: 5,
  charset: 'utf8mb4',
})

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export async function checkDatabase() {
  await query('SELECT 1')
}
