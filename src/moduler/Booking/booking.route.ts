import { Router } from "express";
import { controllerBooking } from "./booking.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), controllerBooking.createdBooking);

router.get("/", auth("admin", "customer"), controllerBooking.getBooking);

export const bookingRoute = router;