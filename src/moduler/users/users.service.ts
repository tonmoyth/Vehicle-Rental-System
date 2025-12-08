import { Request, Response } from "express";
import { pool } from "../../database/db";

const getUsers = async () => {
  const result = await pool.query(
    `
    SELECT * FROM users
    `
  );

  result.rows.forEach((user) => {
    delete user.password;
  });
  return result;
};

const updatedUsers = async (req: Request) => {
  const { name, email, phone, role } = req.body;
  const checkRole = req?.user?.role;

  if (checkRole === "admin") {
    const result = await pool.query(
      `
      UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING *
      `,
      [name, email, phone, role, req.params.userId]
    );
    return result;
  }

  if (checkRole === "customer") {
    const customerEmail = req?.user?.email;
    const result = await pool.query(
      `
      UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE email=$5 RETURNING *
      `,
      [name, email, phone, role, customerEmail]
    );
    return result;
  }
};

const deletedUsers = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const isBookingUser = await pool.query(
    `
    SELECT * FROM bookings WHERE customer_id=$1
    `,
    [userId]
  );

  if (isBookingUser.rows[0]) {
    return res.status(400).json({
      success: false,
      message: "This user already vehicle active",
    });
  }
  const result = await pool.query(
    `
    DELETE FROM users WHERE id=$1
    `,
    [userId]
  );

  return result;
};

export const usersServices = {
  getUsers,
  updatedUsers,
  deletedUsers,
};
