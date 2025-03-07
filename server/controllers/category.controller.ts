import { Response } from "express";
import { Req } from "../utils/types";
import { StatusCodes } from "http-status-codes";
import CategoryService from "../services/category.service";

class CategoryController {
	service = new CategoryService();

	getCategories = async (req: Req, res: Response) => {
		const {
			query: { limit = 10, page = 1 },
		} = req;
		const categories = await this.service.getCategories(
			Number(limit),
			Number(page)
		);

		return res.status(StatusCodes.OK).json({
			success: true,
			data: { categories },
		});
	};

	getCategoryProducts = async (req: Req, res: Response) => {
		const {
			params: { categoryId },
			query: { limit = 10, page = 1 },
		} = req;

		const products = await this.service.getProducts(categoryId, {
			limit: Number(limit),
			page: Number(page),
		});

		return res.status(StatusCodes.OK).json({
			success: true,
			data: { products },
		});
	};
}

export default CategoryController;
