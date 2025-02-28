import { Response } from "express";
import { Req } from "../utils/types";
import { StatusCodes } from "http-status-codes";
import UserService from "../services/user.service";

class UserController {
	service = new UserService();

	me = async (req: Req, res: Response) => {
		const {
			user: { id: userId },
		} = req;

		const user = await this.service.getUser(userId);
		return res.status(StatusCodes.OK).json({ success: true, data: user });
	};
}

export default UserController;
