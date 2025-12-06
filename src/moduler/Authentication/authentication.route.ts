import { Router } from "express";
import { authenticationControllers } from "./authentication.controllers";

const router = Router();

router.post("/signup", authenticationControllers.createdUsers);

router.post("/signin", authenticationControllers.loginUsers);

export const authenticationRouter = router;
