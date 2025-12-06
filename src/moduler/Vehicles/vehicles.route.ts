import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import { vehicles } from "../../middleware/middleware.vehicles";

const router = Router();

router.post("/", vehicles("admin"), vehiclesController.createdVehicles);

export const vehiclesRouter = router;
