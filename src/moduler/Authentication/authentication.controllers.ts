import { Request, Response } from "express";
import { authenticationService } from "./authentication.services";

const createdUsers = async (req: Request, res: Response) => {
  try {
    const result = await authenticationService.createdUsers(req);
    delete result.rows[0].password;
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

const loginUsers = async (req: Request, res: Response) => {
  try {
    const result = await authenticationService.loginUsers(req, res);
    res.status(201).json({
      success: true,
      message: "User Login successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

export const authenticationControllers = {
  createdUsers,
  loginUsers,
};
