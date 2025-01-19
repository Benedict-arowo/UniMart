import { StatusCodes } from "http-status-codes";
import AuthService from "../services/auth.service";
import validate from "../middlewears/validator/index";
import {
	changePasswordSchema,
	forgetPasswordSchema,
	loginSchema,
	registrationSchema,
	verifyUserSchema,
} from "../middlewears/validator/auth.validator";
import { Request, Response } from "express";
import Wrapper from "../middlewears/Wrapper";

class AuthController {
	service = new AuthService();

	register = Wrapper(async (req: Request, res: Response) => {
		validate(req.body, registrationSchema);
		await this.service.createUser(req.body);

		return res.status(StatusCodes.CREATED).json({ success: true });
	});

	async login(req: Request, res: Response) {
		validate(req.body, loginSchema);

		const user = this.service.loginUser(req.body);
		const access_token = "";

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { user, access_token } });
	}

	async changePassword(req: Request, res: Response) {
		validate(req.body, changePasswordSchema);
		const {
			body: { email },
		} = req;

		this.service.changePassword({ email, ...req.body });

		return res.status(StatusCodes.OK).json({ success: true });
	}

	async initForgetPassword(req: Request, res: Response) {
		const {
			body: { email },
		} = req;
		this.service.initForgetPassword(email);
		return res.status(StatusCodes.OK).json({ success: true });
	}

	async resendVerificationCode(req: Request, res: Response) {
		const {
			body: { email },
		} = req;
		this.service.resendVerificationCode(email);
		return res.status(StatusCodes.OK).json({ success: true });
	}

	async verifyUser(req: Request, res: Response) {
		validate(req.body, verifyUserSchema);

		this.service.verifyUser(req.body);
		return res.status(StatusCodes.OK).json({ success: true });
	}

	async forgetPassword(req: Request, res: Response) {
		validate(req.body, forgetPasswordSchema);

		this.service.forgetPassword(req.body);

		return res.status(StatusCodes.OK).json({ success: true });
	}

	async deleteAccount(req: Request, res: Response) {
		const {
			body: { email },
		} = req;
		this.service.deleteAccount(email);
		return res.status(StatusCodes.NO_CONTENT);
	}
}

export default AuthController;
