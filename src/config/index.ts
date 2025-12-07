import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  connection_db_string: process.env.DB_SECTRET_KEY,
  jwt_secret: process.env.JWT_SECRET,
  port:process.env.PORT
};

export default config;
