import { Response, NextFunction } from "express";
import CONFIG from "../utils/config";
import { UnauthorizedError } from "./error";
import { Req } from "../utils/types";
import AuthService from "../services/auth.service";

const authService = new AuthService();

const authenticatedOnly = (req: Req, res: Response, next: NextFunction) => {
	try {
		const access_token = req.cookies?.[CONFIG.env.ACCESS_TOKEN];

		if (!access_token) {
			return next(
				new UnauthorizedError("Unauthorized - No access token")
			);
		}

		const userData = authService.verifyToken(access_token, "ACCESS");

		if (!userData) {
			return next(
				new UnauthorizedError("Unauthorized - Invalid or expired token")
			);
		}

		req["user"] = userData;

		next();
	} catch (error) {
		return next(
			new UnauthorizedError("Unauthorized - Token verification failed")
		);
	}
};

export default authenticatedOnly;
