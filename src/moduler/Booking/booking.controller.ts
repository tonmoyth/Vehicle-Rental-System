import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createdBooking = async (req: Request, res: Response) => {
  try {
    const result: any = await bookingServices.createdBooking(req, res);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
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

export const controllerBooking = {
  createdBooking,
};
