import { Request, Response } from "express";
import { pool } from "../../database/db";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

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

const loginUsers = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User Not Found!",
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({
      success: false,
      message: "Incorrect password",
    });
  }

  const payload = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
  const token = jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: "7d",
  });
  delete user.password;
  return { user, token };
};

export const authenticationService = {
  createdUsers,
  loginUsers,
};
