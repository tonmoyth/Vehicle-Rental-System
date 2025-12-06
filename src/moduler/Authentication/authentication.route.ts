import { Router } from "express";
import { authenticationControllers } from "./authentication.controllers";

const router = Router();

router.post("/signup", authenticationControllers.createdUsers);

export default router;