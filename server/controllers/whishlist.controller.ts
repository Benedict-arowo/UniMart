import { Response } from "express";
import { Req } from "../utils/types";
import { StatusCodes } from "http-status-codes";
import whishlistService from "../services/whishlist.service";

class WishlistController {
	service = new whishlistService();

	getWishlist = async (req: Req, res: Response) => {
		const {
			user: { id: userId },
			params: { page = 1, limit = 10 },
		} = req;
		const wishlist = await this.service.getWishlist(userId, {
			page: isNaN(Number(page)) ? 1 : Number(page),
			limit: isNaN(Number(limit)) ? 10 : Number(page),
		});

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: wishlist });
	};

	getOtherWishlist = async (req: Req, res: Response) => {
		const {
			params: { id: userId, page = 1, limit = 10 },
		} = req;
		const wishlist = await this.service.getWishlist(userId, {
			page: isNaN(Number(page)) ? 1 : Number(page),
			limit: isNaN(Number(limit)) ? 10 : Number(page),
		});

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: wishlist });
	};

	addItem = async (req: Req, res: Response) => {
		const {
			params: { productId },
			user: { id: userId },
		} = req;
		await this.service.addItem(userId, productId);
		return res.status(StatusCodes.OK).json({ success: true });
	};

	removeItem = async (req: Req, res: Response) => {
		const {
			params: { productId },
			user: { id: userId },
		} = req;
		await this.service.removeItem(userId, productId);
		return res.status(StatusCodes.OK).json({ success: true });
	};
}

export default new WishlistController();
