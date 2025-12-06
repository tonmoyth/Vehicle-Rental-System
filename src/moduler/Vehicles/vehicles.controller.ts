import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const createdVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.createdVehicles(req);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
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

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehicles();

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
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

export const vehiclesController = {
  createdVehicles,
  getVehicles,
};
