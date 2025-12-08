import express, { Request, Response } from "express";
import initDB from "./database/db";
import { authenticationRouter } from "./moduler/Authentication/authentication.route";
import { vehiclesRouter } from "./moduler/Vehicles/vehicles.route";
import { usersRoute } from "./moduler/users/users.route";
import { bookingRoute } from "./moduler/Booking/booking.route";

export const app = express();

// middleware
app.use(express.json());

// database
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello vehicle rental system!");
});

app.use("/api/v1/auth", authenticationRouter);

app.use("/api/v1/vehicles", vehiclesRouter);

app.use("/api/v1/users", usersRoute);

app.use("/api/v1/bookings",bookingRoute);




