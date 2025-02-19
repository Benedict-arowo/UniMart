import { StatusCodes } from "http-status-codes";
import validator from "../middlewears/validator";
import { Req } from "../utils/types";
import { Response } from "express";
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
			query: { limit = 10, page = 1, search },
			user,
		} = req;

		const stores = await this.service.getStores({
			limit: limit as number,
			page: page as number,
			search: search as string | undefined,
			user,
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
			.json({ success: true, data: { store } });
	};

	updateStore = async (req: Req, res: Response) => {
		validator(req.body, updateStoreSchema);
		const store = await this.service.updateStore(
			req.params.id,
			req.body as IStore,
			req.user
		);
		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { store } });
	};

	deleteStore = async (req: Req, res: Response) => {
		await this.service.deleteStore(req.params.id, req.user);
		return res.status(StatusCodes.NO_CONTENT).send();
	};
}

export default StoreController;
