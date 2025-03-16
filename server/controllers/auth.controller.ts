import { StatusCodes } from "http-status-codes";
import AuthService from "../services/auth.service";
import validate from "../middlewears/validator/index";
import {
	changePasswordSchema,
	deleteAccountSchema,
	forgetPasswordSchema,
	initforgetPasswordSchema,
	loginSchema,
	registrationSchema,
	verifyUserSchema,
} from "../middlewears/validator/auth.validator";
import { Request, Response } from "express";
import Wrapper from "../middlewears/Wrapper";
import CONFIG from "../utils/config";
import { Req } from "../utils/types";

class AuthController {
	service = new AuthService();

	register = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, registrationSchema);
		await this.service.createUser(req.body);

		return res.status(StatusCodes.CREATED).json({ success: true });
	});

	login = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, loginSchema);

		const { access_token, refresh_token, user } =
			await this.service.loginUser(req.body);

		res.cookie(CONFIG.env.ACCESS_TOKEN, access_token, {
			httpOnly: true,
			sameSite: "none",
			// secure: CONFIG.env.NODE_ENV === "production" ? true : false,
			secure: true,
			expires: new Date(
				Date.now() + CONFIG.env.ACCESS_TOKEN_EXPIRATION * 60 * 1000
			), // Coverts minutes to milliseconds
		});

		res.cookie(CONFIG.env.REFRESH_TOKEN, refresh_token, {
			httpOnly: true,
			sameSite: "none",
			// secure: CONFIG.env.NODE_ENV === "production" ? true : false,
			secure: true,
			expires: new Date(
				Date.now() + CONFIG.env.REFRESH_TOKEN_EXPIRATION * 60 * 1000
			), // Coverts minutes to milliseconds
		});

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { user } });
	});

	changePassword = Wrapper(async (req: Req, res: Response) => {
		validate(req.body, changePasswordSchema);
		const {
			user: { email },
		} = req;

		await this.service.changePassword({
			email,
			...req.body,
		});

		return res.status(StatusCodes.OK).json({ success: true });
	});

	initForgetPassword = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, initforgetPasswordSchema);
		const {
			body: { email },
		} = req;
		await this.service.initForgetPassword(email);
		return res.status(StatusCodes.OK).json({ success: true });
	});

	resendVerificationCode = Wrapper(async (req: Req, res: Response) => {
		const {
			user: { email },
		} = req;
		await this.service.resendVerificationCode(email);
		return res.status(StatusCodes.OK).json({ success: true });
	});

	verifyUser = Wrapper(async (req: Req, res: Response) => {
		validate(req.body, verifyUserSchema);
		await this.service.verifyUser({
			code: req.body.code,
			email: req.user.email,
		});
		return res.status(StatusCodes.OK).json({ success: true });
	});

	forgetPassword = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, forgetPasswordSchema);

		await this.service.forgetPassword(req.body);

		return res.status(StatusCodes.OK).json({ success: true });
	});

	deleteAccount = Wrapper(async (req: Req, res: Response) => {
		validate(req.body, deleteAccountSchema);
		const {
			body: { password },
			user: { email },
		} = req;
		await this.service.deleteAccount(email, password);
		return res.status(StatusCodes.NO_CONTENT).json();
	});

	logout = Wrapper(async (req: Req, res: Response) => {
		await this.service.logout(res);
		return res.status(StatusCodes.NO_CONTENT).json();
	});
}

export default AuthController;
