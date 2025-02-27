import { upload } from "../middlewears/cloudinary";
import { BadrequestError, NotFoundError } from "../middlewears/error";
import prisma from "../prisma";
import { Req } from "../utils/types";

class ProductService {
	getProducts = async ({
		limit,
		search,
		page,
		storeName,
		user,
	}: IGetProducts) => {
		const products = await prisma.product.findMany({
			where: {
				OR: [
					{
						name: {
							contains: search,
							mode: "insensitive",
						},
					},
					{
						description: {
							contains: search,
							mode: "insensitive",
						},
					},
					{
						category: {
							some: {
								name: {
									startsWith: search,
									mode: "insensitive",
								},
							},
						},
					},
					{
						store: {
							name: {
								contains: storeName,
							},
						},
					},
				],
			},
			take: limit,
			skip: (page - 1) * limit,
		});

		return products;
	};

	getProductById = async (id: string, user: Req["user"]) => {
		const product = await prisma.product.findUnique({
			where: {
				id,
			},
		});

		return product;
	};

	createProduct = async (
		data: any,
		user: Req["user"],
		files: Express.Multer.File[]
	) => {
		const uploaded_files = upload(files);
		console.log(uploaded_files)
		const product = await prisma.product.create({
			data: data,
		});

		return product;
	};

	updateProduct = async (id: string, data: any, user: Req["user"]) => {
		const product = await this.getProductById(id, user);

		if (!product) throw new NotFoundError("Product not found.");

		if (product.ownerId !== user.id)
			throw new BadrequestError(
				"You do not have permission to modify this product."
			);

		const updatedProduct = await prisma.product.update({
			where: {
				id,
			},
			data,
		});

		return updatedProduct;
	};

	deleteProduct = async (id: string, user: Req["user"]) => {
		const product = await this.getProductById(id, user);

		if (!product) throw new NotFoundError("Product not found.");

		if (product.ownerId !== user.id)
			throw new BadrequestError(
				"You do not have permission to modify this product."
			);

		await prisma.product.delete({
			where: {
				id,
			},
		});

		return;
	};
}

export default ProductService;

interface IGetProducts {
	limit: number;
	search: string | undefined;
	page: number;
	storeName: string | undefined;
	user: Req["user"];
}
