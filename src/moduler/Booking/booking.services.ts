import { Request, Response } from "express";
import { pool } from "../../database/db";

const createdBooking = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

  const result = await pool.query(
    `
    INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date) VALUES($1,$2,$3,$4) RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date]
  );
  const booking = result.rows[0];

  const getVehicle = await pool.query(
    `
        SELECT * FROM vehicles WHERE id=$1
        `,
    [booking.vehicle_id]
  );

  if (getVehicle.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "vehicle not found!",
    });
  }
  const dailyRent = getVehicle.rows[0].daily_rent_price;

  const startDay = new Date(booking.rent_start_date) as any;
  const endDay = new Date(booking.rent_end_date) as any;
  const oneDay = 24 * 60 * 60 * 1000;

  const numberOfDay = Math.ceil((endDay - startDay) / oneDay);
  const total_price = numberOfDay * dailyRent;
  result.rows[0].total_price = total_price;

  await pool.query(
    `
    UPDATE vehicles SET availability_status=$1 WHERE id=$2
        `,
    ["booked", booking.vehicle_id]
  );
  result.rows[0].status = "Active";

  const bookingVehicles = await pool.query(
    `
        SELECT * FROM vehicles WHERE id=$1
        `,
    [booking.vehicle_id]
  );

  result.rows[0].vehicle = {
    vehicle_name: bookingVehicles.rows[0].vehicle_name,
    daily_rent_price: bookingVehicles.rows[0].daily_rent_price,
  };

  return result;
};

export const bookingServices = {
  createdBooking,
};
