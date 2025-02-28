import express from "express";
import Wrapper from "../middlewears/Wrapper";
import SubscriptionController from "../controllers/subscription.controller";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new SubscriptionController();

router.post("/subscribe/:planId", Wrapper(controller.subscribe));
router.patch(
	"/unsubscribe/:subscriptionId",
	authenticatedOnly,
	Wrapper(controller.unsubscribe)
);

export default {
	routeUrl: "subscription",
	Router: router,
};
