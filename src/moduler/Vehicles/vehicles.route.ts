import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import { vehicles } from "../../middleware/middleware.vehicles";

const router = Router();

router.post("/", vehicles("admin"), vehiclesController.createdVehicles);

router.get("/", vehiclesController.getVehicles);

router.get("/:vehicleId", vehiclesController.getSingleVehicles);

router.put("/:vehicleId", vehicles("admin"), vehiclesController.UpdatedVehicles);

router.delete("/:vehicleId",vehicles("admin"), vehiclesController.DeletedVehicles);

export const vehiclesRouter = router;
