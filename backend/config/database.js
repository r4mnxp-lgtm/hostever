import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "69.166.232.50",
  port: process.env.DB_PORT || 16640,
  user: process.env.DB_USER || "nhdbadmin",
  password: process.env.DB_PASSWORD || "oxRvI7jGR97DGhPU4gIvFmyS9qfnHWlb",
  database: process.env.DB_DATABASE || "defaultdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connection successful to Hostever database");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    return false;
  }
}

export default pool;
