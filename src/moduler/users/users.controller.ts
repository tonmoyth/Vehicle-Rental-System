import { Request, Response } from "express";
import { usersServices } from "./users.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.getUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const updatedUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.updatedUsers(req);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result?.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const deletedUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.deletedUsers(
      req,res
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

export const usersController = {
  getUsers,
  updatedUsers,
  deletedUsers,
};
