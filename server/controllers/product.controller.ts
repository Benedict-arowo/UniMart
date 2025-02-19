import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import ProductService from "../services/product.service";
import { Req } from "../utils/types";
import validator from "../middlewears/validator";
import {
	createProductSchema,
	IProduct,
	updateProductSchema,
} from "../middlewears/validator/product.validator";

class ProductController {
	service = new ProductService();

	getProducts = async (req: Req, res: Response) => {
		const {
			query: { limit = 10, page = 1, search, storeName },
			user,
		} = req;

		const products = await this.service.getProducts({
			limit: limit as number,
			page: page as number,
			search: search as string | undefined,
			storeName: storeName as string | undefined,
			user,
		});

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { products } });
	};

	createProduct = async (req: Req, res: Response) => {
		validator(req.body, createProductSchema);
		const product = await this.service.createProduct(
			req.body as IProduct,
			req.user
		);
		return res
			.status(StatusCodes.CREATED)
			.json({ success: true, data: { product } });
	};

	updateProduct = async (req: Req, res: Response) => {
		validator(req.body, updateProductSchema);
		const product = await this.service.updateProduct(
			req.params.id,
			req.body as IProduct,
			req.user
		);
		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { product } });
	};

	deleteProduct = async (req: Req, res: Response) => {
		await this.service.deleteProduct(req.params.id, req.user);
		return res.status(StatusCodes.NO_CONTENT).send();
	};

	getProductById = async (req: Req, res: Response) => {
		const product = await this.service.getProductById(
			req.params.id,
			req.user
		);
		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { product } });
	};
}

export default ProductController;
