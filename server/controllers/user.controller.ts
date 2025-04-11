import { Request, Response } from "express";
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

	getUser = async (req: Req, res: Response) => {
		const {
			params: { id: userId },
		} = req;

		const user = await this.service.getUser(userId);
		return res.status(StatusCodes.OK).json({ success: true, data: user });
	};

	getOtherUserProducts = async (req: Req, res: Response) => {
		const {
			query: { limit = 10, page = 1, search, active, featured },
			params: { userId },
		} = req;

		const products = await this.service.getProducts({
			user: userId,
			limit: isNaN(Number(limit)) ? 10 : Number(limit),
			page: isNaN(Number(page)) ? 1 : Number(page),
			search: search as string | undefined,
			active: active ? (active === "true" ? true : false) : undefined,
			featured: featured
				? featured === "true"
					? true
					: false
				: undefined,
		});

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { products } });
	};
	getUserProducts = async (req: Req, res: Response) => {
		const {
			query: { limit = 10, page = 1, search, active, featured },
			user,
		} = req;

		const products = await this.service.getProducts({
			user: user.id,
			limit: isNaN(Number(limit)) ? 10 : Number(limit),
			page: isNaN(Number(page)) ? 1 : Number(page),
			search: search as string | undefined,
			active: active ? (active === "true" ? true : false) : undefined,
			featured: featured
				? featured === "true"
					? true
					: false
				: undefined,
		});

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { products } });
	};

	getUserStore = async (req: Req, res: Response) => {};
	getReviews = async (req: Request, res: Response) => {
		const { id: userId } = req.params;
		let { page = 1, limit = 10, recent } = req.query;

		page = isNaN(Number(page)) ? 1 : Number(page);
		limit = isNaN(Number(limit)) ? 10 : Number(limit);

		const reviews = await this.service.getReviews(
			userId,
			Number(page),
			Number(limit),
			recent === "true"
		);

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { reviews } });
	};
}

export default UserController;
