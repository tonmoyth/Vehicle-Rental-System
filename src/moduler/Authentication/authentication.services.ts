import { Request } from "express";
import { pool } from "../../database/db";
import bcrypt from "bcryptjs";

const createdUsers = async (req: Request) => {
  const { name, email, password, phone, role } = req.body;
  const hashPass = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *
    `,
    [name, email, hashPass, phone, role]
  );

  return result;
};

export const authenticationService = {
  createdUsers,
};
