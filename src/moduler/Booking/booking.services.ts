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

const getBooking = async () => {
  const result = await pool.query(
    `
    SELECT * FROM bookings
    `
  );

  const vehicles: any = [];

  for (const book of result.rows) {
    const vehicleId = book.vehicle_id;

    const vehRes = await pool.query(
      `
    SELECT * FROM vehicles WHERE id=$1
    `,
      [vehicleId]
    );

    vehicles.push(vehRes.rows[0]);
  }

  const users: any = [];

  for (const book of result.rows) {
    const customerId = book.customer_id;

    const vehRes = await pool.query(
      `
    SELECT * FROM users WHERE id=$1
    `,
      [customerId]
    );

    users.push(vehRes.rows[0]);
  }

  const calculate = result.rows.map((book) => {
    const findVehicle = vehicles.find((v: any) => v.id === book.vehicle_id);

    const dailyRent = findVehicle.daily_rent_price;

    const startDay = new Date(book.rent_start_date) as any;
    const endDay = new Date(book.rent_end_date) as any;
    const oneDay = 24 * 60 * 60 * 1000;

    const numberOfDay = Math.ceil((endDay - startDay) / oneDay);
    const total_price = numberOfDay * dailyRent;
    book.total_price = total_price;
    book.status = "Active";

    const bookingCustomer = users.find(
      (user: any) => user.id === book.customer_id
    );
    book.customer = {
      name: bookingCustomer.name,
      email: bookingCustomer.email,
    };

    book.vehicle = {
      vehicle_name: findVehicle.vehicle_name,
      registration_number: findVehicle.registration_number,
    };

    return book;
  });

  return calculate;
};

export const bookingServices = {
  createdBooking,
  getBooking,
};
