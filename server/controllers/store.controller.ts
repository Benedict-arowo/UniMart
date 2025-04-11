import { StatusCodes } from "http-status-codes";
import validator from "../middlewears/validator";
import { Req } from "../utils/types";
import { Request, Response } from "express";
import StoreService from "../services/store.service";
import {
	createStoreSchema,
	IStore,
	updateStoreSchema,
} from "../middlewears/validator/store.validator";

class StoreController {
	service = new StoreService();

	getStores = async (req: Req, res: Response) => {
		const {
			query: { limit = 10, page = 1, search, featured, active },
		} = req;

		const stores = await this.service.getStores({
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
			.json({ success: true, data: { stores } });
	};

	getStore = async (req: Req, res: Response) => {
		const store = await this.service.getStore(req.params.id, req.user);
		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { store } });
	};

	createStore = async (req: Req, res: Response) => {
		validator(req.body, createStoreSchema);
		const store = await this.service.createStore(
			req.body as IStore,
			req.user
		);
		return res
			.status(StatusCodes.CREATED)
			.json({ success: true, data: store });
	};

	updateStore = async (req: Req, res: Response) => {
		validator(req.body, updateStoreSchema);
		const store = await this.service.updateStore({
			id: req.params.id,
			body: req.body as IStore,
			user: req.user,
			banner: req.file as Express.Multer.File | undefined,
		});
		return res.status(StatusCodes.OK).json({ success: true, data: store });
	};

	deleteStore = async (req: Req, res: Response) => {
		await this.service.deleteStore(req.params.id, req.user);
		return res.status(StatusCodes.NO_CONTENT).send();
	};

	getUserStoreProducts = async (req: Request, res: Response) => {
		const {
			query: { limit = 10, page = 1, search, featured },
			params: { id: storeId },
		} = req;

		const products = await this.service.getStoreProducts(
			storeId,
			isNaN(Number(limit)) ? 10 : Number(limit),
			isNaN(Number(page)) ? 1 : Number(page),
			search as string | undefined,
			featured ? (featured === "true" ? true : false) : undefined
		);

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { products } });
	};
}

export default StoreController;
