import { Router } from "express";
import { controllerBooking } from "./booking.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), controllerBooking.createdBooking);

export const bookingRoute = router;