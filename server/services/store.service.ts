import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { Req } from "../utils/types";
import {
	BadrequestError,
	ForbiddenError,
	NotFoundError,
} from "../middlewears/error";
import { upload } from "../middlewears/cloudinary";

class StoreService {
	getStores = async ({
		limit,
		page,
		search,
		featured,
		active = true,
	}: IGetStores) => {
		const query: Prisma.StoreWhereInput = {};

		if (search) {
			query.OR = [
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
			];
		}

		if (featured) {
			query["isBoosted"] = true;
		}

		if (active) {
			query["isActive"] = active;
		}

		const stores = await prisma.store.findMany({
			where: query,
			include: {
				banner: {
					select: {
						id: true,
						type: true,
						url: true,
						createdAt: true,
					},
				},
			},
			take: limit,
			skip: (page - 1) * limit,
		});

		return stores;
	};

	getStore = async (id: string, user: Req["user"]) => {
		const store = await prisma.store.findUnique({
			where: {
				id,
			},
			include: {
				banner: {
					select: {
						id: true,
						type: true,
						url: true,
						createdAt: true,
					},
				},
			},
		});

		return store;
	};

	createStore = async (data: any, active_user: Req["user"]) => {
		const user = await prisma.user.findUnique({
			where: {
				id: active_user.id,
			},
			select: {
				store: true,
				isVerified: true,
			},
		});

		if (!user) throw new ForbiddenError("User not found.");
		if (!user.isVerified)
			throw new BadrequestError("User's email is not verified.");

		if (user.store) {
			throw new ForbiddenError("User already has a store.");
		}

		const newStore = await prisma.user.update({
			where: {
				id: active_user.id,
			},
			data: {
				roles: {
					push: "SELLER",
				},
				store: {
					create: {
						...data,
						isActive: true,
					},
				},
			},
			select: {
				store: true,
			},
		});

		return newStore;
	};

	updateStore = async ({
		id,
		body,
		user,
		banner,
	}: {
		id: string;
		body: any;
		user: Req["user"];
		banner?: Express.Multer.File;
	}) => {
		try {
			const store = await prisma.store.findUnique({
				where: {
					id: id,
				},
			});

			if (!store) throw new NotFoundError("Store not found.");
			if (store.ownerId !== user.id) {
				throw new ForbiddenError(
					"Not authorized to update this store."
				);
			}

			let bannerUrl: string | undefined;

			if (banner) {
				const item = await upload([banner]);
				console.log(item);
				bannerUrl = item![0].url;
			}

			const updatedStore = await prisma.store.update({
				where: {
					id,
					ownerId: user.id,
				},
				data: {
					...body,
					banner: bannerUrl
						? {
								create: {
									type: "IMAGE",
									url: bannerUrl,
								},
						  }
						: undefined,
				},
			});

			return updatedStore;
		} catch (error) {
			// TODO: Handle error for not found
			throw new BadrequestError("Failed to update store.");
		}
	};

	deleteStore = async (id: string, user: Req["user"]) => {
		await prisma.store.delete({
			where: {
				id,
			},
		});
	};

	getStoreProducts = async (
		storeId: string,
		limit: number,
		page: number,
		search?: string,
		featured?: Boolean
		// active?: Boolean
	) => {
		let query: Prisma.ProductWhereInput = {
			storeId,
			isActive: true,
		};

		if (featured) {
			query["isBoosted"] = true;
		}

		// if (active) {
		// 	query["isActive"] = true;
		// }

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
}

export default StoreService;

interface IGetStores {
	limit: number;
	page: number;
	search: string | undefined;
	featured?: boolean;
	active?: boolean;
}
