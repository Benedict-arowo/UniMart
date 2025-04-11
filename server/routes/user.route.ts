import express from "express";
import Wrapper from "../middlewears/Wrapper";
import UserController from "../controllers/user.controller";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new UserController();

router.get("/", authenticatedOnly, Wrapper(controller.me));
router.get("/products", authenticatedOnly, Wrapper(controller.getUserProducts));
router.get("/store", authenticatedOnly, Wrapper(controller.getUserStore));
router.get("/:id", Wrapper(controller.getUser));
router.get("/products/:userId", Wrapper(controller.getOtherUserProducts));
router.get("/reviews/:id", Wrapper(controller.getReviews));

export default {
	routeUrl: "user",
	Router: router,
};
