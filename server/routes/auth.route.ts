import express from "express";
import AuthController from "../controllers/auth.controller";
import Wrapper from "../middlewears/Wrapper";

const router = express.Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", Wrapper(controller.login));
router.post("/change-password", Wrapper(controller.changePassword));
router.post("/verify", Wrapper(controller.verifyUser));
router.post("/resend-code", Wrapper(controller.resendVerificationCode));

router.delete("/delete-account", Wrapper(controller.deleteAccount));

router.post("/init-reset-password", Wrapper(controller.initForgetPassword));
router.post("/forget-password", Wrapper(controller.forgetPassword));

export default {
	routeUrl: "auth",
	Router: router,
};
