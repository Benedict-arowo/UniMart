import express from "express";
import Wrapper from "../middlewears/Wrapper";
import PaymentController from "../controllers/payment.controller";

const router = express.Router();
const controller = new PaymentController();

router.get("/", Wrapper(controller.getPayments));
router.get("/:id", Wrapper(controller.getPayment));
router.post("/webhook", Wrapper(controller.paystackWebhook));

export default {
	routeUrl: "payment",
	Router: router,
};
