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
import { BadrequestError } from "../middlewears/error";

class AuthController {
	service = new AuthService();

	register = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, registrationSchema);
		await this.service.createUser(req.body);

		return res.status(StatusCodes.CREATED).json({ success: true });
	});

	login = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, loginSchema);

		const user = await this.service.loginUser(req.body);
		const access_token = "";
		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { user, access_token } });
	});

	changePassword = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, changePasswordSchema);
		const {
			body: { email },
		} = req;

		await this.service.changePassword({
			email: "test1@gmail.com",
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
			email: "test1@gmail.com",
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
		const {
			body: { email },
		} = req;
		await this.service.deleteAccount(email);
		return res.status(StatusCodes.NO_CONTENT);
	});
}

export default AuthController;
