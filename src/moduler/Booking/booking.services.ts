import { Request, Response } from "express";
import { pool } from "../../database/db";
import { autoMark } from "../../helpers/automerks";

const createdBooking = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

  const vehicleStatusCheck = await pool.query(
    `
    SELECT * FROM vehicles WHERE id=$1
    `,
    [vehicle_id]
  );

  if (vehicleStatusCheck.rows[0].availability_status === "booked") {
    return res.status(400).json({
      success: false,
      message: "This vehicle already booked!",
    });
  }
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
    const now = new Date();
    const endDay = new Date(book.rent_end_date);
    if (endDay < now) {
      autoMark(book.vehicle_id);
    }
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

const UpdatedBooking = async (req: Request, res: Response) => {
  const { status } = req.body;
  const { bookingId } = req.params;

  const result = await pool.query(
    `
    SELECT * FROM bookings WHERE id=$1
    `,
    [bookingId]
  );

  const getVehicle = await pool.query(
    `
    SELECT * FROM vehicles WHERE id=$1
    `,
    [result.rows[0].vehicle_id]
  );

  const bookingVehicle = getVehicle.rows[0];

  if (status === "cancelled") {
    const startDate = new Date(result.rows[0].rent_start_date);
    const currentDate = new Date();

    startDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate > startDate) {
      return res.status(400).json({
        success: false,
        message: "Time expire",
      });
    }

    await pool.query(
      `
    UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *
    `,
      [status, result.rows[0].vehicle_id]
    );

    const dailyRent = bookingVehicle.daily_rent_price;

    const startDay = new Date(result.rows[0].rent_start_date) as any;
    const endDay = new Date(result.rows[0].rent_end_date) as any;
    const oneDay = 24 * 60 * 60 * 1000;

    const numberOfDay = Math.ceil((endDay - startDay) / oneDay);

    const total_price = numberOfDay * dailyRent;
    result.rows[0].total_price = total_price;

    result.rows[0].status = "cancelled";
  }

  if (status === "returned") {
    await pool.query(
      `
    UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *
    `,
      ["available", result.rows[0].vehicle_id]
    );

    const dailyRent = bookingVehicle.daily_rent_price;

    const startDay = new Date(result.rows[0].rent_start_date) as any;
    const endDay = new Date(result.rows[0].rent_end_date) as any;
    const oneDay = 24 * 60 * 60 * 1000;

    const numberOfDay = Math.ceil((endDay - startDay) / oneDay);

    const total_price = numberOfDay * dailyRent;
    result.rows[0].total_price = total_price;

    result.rows[0].status = "returned";
    result.rows[0].vehicle = {
      availability_status: "available",
    };
  }

  return result.rows[0];
};

export const bookingServices = {
  createdBooking,
  getBooking,
  UpdatedBooking,
};
