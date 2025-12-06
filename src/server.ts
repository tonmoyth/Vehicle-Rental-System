import express, { Request, Response } from "express";
import initDB from "./database/db";
import { authenticationRouter } from "./moduler/Authentication/authentication.route";
import { vehiclesRouter } from "./moduler/Vehicles/vehicles.route";

const app = express();
const port = 5000;

// middleware
app.use(express.json());

// database
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello vehicle rental system!");
});

app.use("/api/v1/auth", authenticationRouter);

app.use("/api/v1/vehicles", vehiclesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
