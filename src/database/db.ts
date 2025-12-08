import { Pool, types } from "pg";
import config from "../config";

types.setTypeParser(1082, (val) => val);

export const pool = new Pool({
  connectionString: `${config.connection_db_string}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password TEXT NOT NULL CHECK (length(password) >= 6),
      phone VARCHAR(20),
      role VARCHAR(15)
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    daily_rent_price INT NOT NULL CHECK(daily_rent_price >0),
    availability_status VARCHAR(20) NOT NULL
    )
    `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date) 
    )
    `);
};

export default initDB;
