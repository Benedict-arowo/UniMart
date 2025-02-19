import { StatusCodes } from "http-status-codes";
import AuthService from "../services/auth.service";
import validate from "../middlewears/validator/index";
import {
	changePasswordSchema,
	forgetPasswordSchema,
	loginSchema,
	registrationSchema,
	resendVerificationCodeSchema,
	verifyUserSchema,
} from "../middlewears/validator/auth.validator";
import { Request, Response } from "express";
import Wrapper from "../middlewears/Wrapper";
import CONFIG from "../utils/config";

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
			secure: CONFIG.env.NODE_ENV === "production",
			expires: new Date(CONFIG.env.ACCESS_TOKEN_EXPIRATION * 60 * 1000), // Coverts minutes to milliseconds
		});

		res.cookie(CONFIG.env.REFRESH_TOKEN, refresh_token, {
			httpOnly: true,
			sameSite: "none",
			secure: CONFIG.env.NODE_ENV === "production",
			expires: new Date(CONFIG.env.REFRESH_TOKEN_EXPIRATION * 60 * 1000), // Coverts minutes to milliseconds
		});

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { user } });
	});

	changePassword = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, changePasswordSchema);
		const {
			body: { email },
		} = req;

		await this.service.changePassword({
			email,
			...req.body,
		});

		return res.status(StatusCodes.OK).json({ success: true });
	});

	initForgetPassword = Wrapper(async (req: Request, res: Response) => {
		const {
			body: { email },
		} = req;
		await this.service.initForgetPassword(email);
		return res.status(StatusCodes.OK).json({ success: true });
	});

	resendVerificationCode = Wrapper(async (req: Request, res: Response) => {
		const {
			body: { email },
		} = req;
		validate(req.body, resendVerificationCodeSchema);
		await this.service.resendVerificationCode(email);
		return res.status(StatusCodes.OK).json({ success: true });
	});

	verifyUser = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, verifyUserSchema);
		await this.service.verifyUser({
			...req.body,
		});
		return res.status(StatusCodes.OK).json({ success: true });
	});

	forgetPassword = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, forgetPasswordSchema);

		await this.service.forgetPassword(req.body);

		return res.status(StatusCodes.OK).json({ success: true });
	});

	deleteAccount = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, loginSchema);
		const {
			body: { email, password },
		} = req;
		await this.service.deleteAccount(email, password);
		return res.status(StatusCodes.NO_CONTENT).json();
	});
}

export default AuthController;
