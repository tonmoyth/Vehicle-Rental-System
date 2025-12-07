import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import { auth } from "../../middleware/auth";


const router = Router();

router.post("/", auth("admin"), vehiclesController.createdVehicles);

router.get("/", vehiclesController.getVehicles);

router.get("/:vehicleId", vehiclesController.getSingleVehicles);

router.put("/:vehicleId", auth("admin"), vehiclesController.UpdatedVehicles);

router.delete("/:vehicleId",auth("admin"), vehiclesController.DeletedVehicles);

export const vehiclesRouter = router;
