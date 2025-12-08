import { Request, Response } from "express";
import { pool } from "../../database/db";

const createdVehicles = async (req: Request) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  const result = await pool.query(
    `
    INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getVehicles = async () => {
  const result = await pool.query(
    `
    SELECT * FROM vehicles
    `
  );

  return result;
};

const getSingleVehicles = async (vehicleId: string) => {
  const result = await pool.query(
    `
    SELECT * FROM vehicles WHERE id=$1 
    `,
    [vehicleId]
  );

  return result;
};

const UpdatedVehicles = async (req: Request) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  const result = await pool.query(
    `
    UPDATE vehicles SET vehicle_name=$1,type=$2,registration_number=$3,daily_rent_price=$4,availability_status=$5 WHERE id=$6 RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      req.params.vehicleId,
    ]
  );

  return result;
};

const DeletedVehicles = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  const isBooked = await pool.query(
    `
    SELECT * FROM vehicles WHERE id=$1 
    `,
    [vehicleId]
  );
  if (isBooked.rows.length === 0) {
    return res.status(400).json({
      success: false,
      message: "This vehicle not exist!!",
    });
  }
  if (isBooked.rows[0].availability_status === "booked") {
    return res.status(400).json({
      success: false,
      message: "This vehicle already booked",
    });
  }

  const result = await pool.query(
    `
    DELETE FROM vehicles WHERE id=$1
    `,
    [vehicleId]
  );

  return result;
};

export const vehiclesServices = {
  createdVehicles,
  getVehicles,
  getSingleVehicles,
  UpdatedVehicles,
  DeletedVehicles,
};
