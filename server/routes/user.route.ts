import express from "express";
import Wrapper from "../middlewears/Wrapper";
import UserController from "../controllers/user.controller";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new UserController();

router.get("/", authenticatedOnly, Wrapper(controller.me));

export default {
	routeUrl: "user",
	Router: router,
};
