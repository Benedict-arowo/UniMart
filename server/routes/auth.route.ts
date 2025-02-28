import express from "express";
import AuthController from "../controllers/auth.controller";
import Wrapper from "../middlewears/Wrapper";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new AuthController();

router.post("/register", Wrapper(controller.register));
router.post("/login", Wrapper(controller.login));
router.post(
	"/change-password",
	authenticatedOnly,
	Wrapper(controller.changePassword)
);
router.post("/verify", authenticatedOnly, Wrapper(controller.verifyUser));
router.post(
	"/resend-code",
	authenticatedOnly,
	Wrapper(controller.resendVerificationCode)
);

router.delete(
	"/delete-account",
	authenticatedOnly,
	Wrapper(controller.deleteAccount)
);

router.post("/init-reset-password", Wrapper(controller.initForgetPassword));
router.post("/forget-password", Wrapper(controller.forgetPassword));
router.post("/logout", authenticatedOnly, Wrapper(controller.logout));

export default {
	routeUrl: "auth",
	Router: router,
};
