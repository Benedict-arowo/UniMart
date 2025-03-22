import { Response } from "express";
import { Req } from "../utils/types";
import { StatusCodes } from "http-status-codes";
import AdsService from "../services/ads.service";

class AdsController {
	service = new AdsService();

	getAllAds = async (req: Req, res: Response) => {
		try {
			// if (!req.user || req.user.role !== "ADMIN") {
			// 	return res
			// 		.status(StatusCodes.FORBIDDEN)
			// 		.json({ success: false, message: "Access denied." });
			// }

			const { limit = 10, page = 1 } = req.query;
			const ads = await this.service.getAds({
				limit: Number(limit),
				page: Number(page),
			});
			return res
				.status(StatusCodes.OK)
				.json({ success: true, data: { ads } });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	getAd = async (req: Req, res: Response) => {
		try {
			const { id } = req.params;
			const ad = await this.service.getAd(id);
			return res
				.status(StatusCodes.OK)
				.json({ success: true, data: { ad } });
		} catch (error: any) {
			return res
				.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	getUserAds = async (req: Req, res: Response) => {
		try {
			if (!req.user) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					success: false,
					message: "Authentication required.",
				});
			}

			const { limit = 10, page = 1 } = req.query;
			const ads = await this.service.getUserAds({
				userId: req.user.id,
				limit: Number(limit),
				page: Number(page),
			});
			return res
				.status(StatusCodes.OK)
				.json({ success: true, data: { ads } });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	getActiveAds = async (req: Req, res: Response) => {
		try {
			const { limit = 10, page = 1 } = req.query;
			const ads = await this.service.getActiveAds({
				limit: Number(limit),
				page: Number(page),
			});
			return res
				.status(StatusCodes.OK)
				.json({ success: true, data: { ads } });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	createAd = async (req: Req, res: Response) => {
		try {
			const { body, user } = req;
			const ad = await this.service.createAd({ data: body, user });
			return res
				.status(StatusCodes.CREATED)
				.json({ success: true, data: { ad } });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	updateAd = async (req: Req, res: Response) => {
		try {
			const { id } = req.params;
			const { body, user } = req;
			const ad = await this.service.updateAd({ id, data: body, user });
			return res
				.status(StatusCodes.OK)
				.json({ success: true, data: { ad } });
		} catch (error: any) {
			return res
				.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	deleteAd = async (req: Req, res: Response) => {
		try {
			const { id } = req.params;
			const { user } = req;
			await this.service.deleteAd({ id, user });
			return res.sendStatus(StatusCodes.NO_CONTENT);
		} catch (error: any) {
			return res
				.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};
}

export default AdsController;
