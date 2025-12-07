import { Request } from "express";
import { pool } from "../../database/db";

const getUsers = async () => {
  const result = await pool.query(
    `
    SELECT * FROM users
    `
  );

  return result;
};

const updatedUsers = async (req: Request) => {
  const { name, email, phone, role } = req.body;

  const result = await pool.query(
    `
    UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING *
    `,
    [name, email, phone, role, req.params.userId]
  );

  return result;
};

export const usersServices = {
  getUsers,
  updatedUsers,
};
