import { Prisma } from "@prisma/client";
import { cropUpload, optimizeUpload, upload } from "../middlewears/cloudinary";
import {
	BadrequestError,
	InternalServerError,
	NotFoundError,
} from "../middlewears/error";
import prisma from "../prisma";
import { Req } from "../utils/types";

class ProductService {
	getProducts = async ({
		limit,
		search,
		page,
		storeName,
		featured = false,
		active = true,
	}: IGetProducts) => {
		let query: Prisma.ProductWhereInput = {};

		if (featured) {
			query["isBoosted"] = true;
		}

		if (active) {
			query["isActive"] = true;
		}

		if (search) {
			query["OR"] = [
				{
					name: {
						mode: "insensitive",
						contains: search,
					},
				},
				{
					description: {
						mode: "insensitive",
						contains: search,
					},
				},
				{
					category: {
						some: {
							name: {
								mode: "insensitive",
								contains: search,
							},
						},
					},
				},
				{
					store: {
						name: {
							mode: "insensitive",
							contains: search,
						},
					},
				},
			];
		}

		if (storeName) {
			query["store"] = {
				name: {
					mode: "insensitive",
					contains: storeName,
				},
			};
		}

		const products = await prisma.product.findMany({
			where: query,
			take: limit,
			skip: (page - 1) * limit,
			include: {
				media: true,
				category: true,
			},
		});
		return products;
	};

	getProductById = async (id: string, user: Req["user"]) => {
		const product = await prisma.product.findUnique({
			where: {
				id,
			},
			include: {
				media: true,
				category: true,
				owner: {
					select: {
						id: true,
						username: true,
						email: true,
						isOnline: true,
						lastOnline: true,
						createdAt: true,
					},
				},
			},
		});

		return product;
	};

	getSimilarProducts = async ({
		productId,
		limit,
		page,
	}: {
		productId: string;
		limit: number;
		page: number;
	}) => {
		// Get the current product with its category
		const product = await prisma.product.findUnique({
			where: { id: productId },
			include: { category: true },
		});

		if (!product) throw new NotFoundError("Product not found.");

		const similarProducts = await prisma.product.findMany({
			where: {
				id: { not: productId }, // Exclude current product
				category: {
					some: { id: { in: product.category.map((cat) => cat.id) } },
				},
				isActive: true,
			},
			take: limit,
			skip: (page - 1) * limit,
			include: {
				media: true,
				category: true,
			},
		});

		return similarProducts;
	};

	createProduct = async (
		data: any,
		user: Req["user"],
		files: Express.Multer.File[]
	) => {
		try {
			// Process category connections
			let categoryConnections = null;
			if (data.categories) {
				categoryConnections = data.categories.map(
					(categoryName: string) => ({
						where: { name: categoryName.toLowerCase() },
						create: { name: categoryName.toLowerCase() },
					})
				);
			}

			const uploadedFiles = (await upload(files)) as {
				url: string;
				format: string;
				resource_type: string;
				public_id: string;
			}[];

			uploadedFiles.forEach((file) => {
				optimizeUpload(file.public_id);
				cropUpload(file.public_id);
			});
			console.log(uploadedFiles);

			// Create the product
			const product = await prisma.product.create({
				data: {
					name: data.name,
					description: data.description,
					quantity: Number(data.quantity),
					price: Number(data.price),
					discountedPrice: Number(data.discountedPrice),
					media: {
						createMany: {
							data: uploadedFiles.map((file) => ({
								url: file.url,
								type:
									file.resource_type === "image"
										? "IMAGE"
										: "VIDEO",
								public_id: file.public_id,
							})),
						},
					},
					// addToStore: data.addToStore as Boolean,
					isActive: false, //TODO: make it so it's toggleable upon creation.
					ownerId: user.id,
					category: data.categories
						? {
								connectOrCreate: categoryConnections,
						  }
						: undefined,
				},
			});

			return product;
		} catch (error) {
			console.error("Error creating product:", error);
			throw new Error("Failed to create product.");
		}
	};

	updateProduct = async (
		id: string,
		data: any,
		user: Req["user"],
		files: Express.Multer.File[]
	) => {
		const product = await this.getProductById(id, user);

		if (!product) throw new NotFoundError("Product not found.");

		if (product.ownerId !== user.id)
			throw new BadrequestError(
				"You do not have permission to modify this product."
			);

		let categoryConnections;

		if (data.categories) {
			categoryConnections = {
				set: {
					name: "",
				},
			};
		}

		const uploadedFiles = (await upload(files)) as {
			url: string;
			format: string;
			resource_type: string;
			public_id: string;
		}[];

		if (files.length > 0) {
			uploadedFiles.forEach((file) => {
				optimizeUpload(file.public_id);
				cropUpload(file.public_id);
			});
		}

		try {
			const updatedProduct = await prisma.product.update({
				where: {
					id: product.id,
				},
				data: {
					name: data.name,
					description: data.description,
					price: Number(data.price),
					discountedPrice: Number(data.discountedPrice),
					media:
						files.length > 0
							? {
									createMany: {
										data: uploadedFiles.map((file) => ({
											url: file.url,
											type:
												file.resource_type === "image"
													? "IMAGE"
													: "VIDEO",
											public_id: file.public_id,
										})),
									},
							  }
							: undefined,
					// category: data.categories ? categoryConnections : undefined,
					quantity: Number(data.quantity),
					isActive: data.isActive === "true" ? true : false,
				},
				select: {
					id: true,
					name: true,
					quantity: true,
					isActive: true,
					isBoosted: true,
					boostedAt: true,
					boostExpiresAt: true,
					description: true,
					discountedPrice: true,
					reviews: true,
					reports: true,
					likes: true,
					price: true,
					payments: true,
					store: true,
					media: true,
					category: true,
				},
			});
			return updatedProduct;
		} catch (error: any) {
			console.log(error);
			if (error.code === "P2025")
				throw new NotFoundError("Product not found.");
			throw new InternalServerError("Something went wrong...");
		}
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
	search?: string;
	page: number;
	storeName?: string;
	featured?: Boolean;
	active?: Boolean;
}
