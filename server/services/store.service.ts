import prisma from "../prisma";
import { Req } from "../utils/types";

class StoreService {
	getStores = async ({ limit, page, search, user }: IGetStores) => {
		const stores = await prisma.store.findMany({
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
				],
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
		});

		return store;
	};

	createStore = async (data: any, user: Req["user"]) => {
		const newStore = await prisma.store.create({
			data: {
				...data,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		return newStore;
	};

	updateStore = async (id: string, store: any, user: Req["user"]) => {
		const updatedStore = await prisma.store.update({
			where: {
				id,
			},
			data: store,
		});

		return updatedStore;
	};

	deleteStore = async (id: string, user: Req["user"]) => {
		await prisma.store.delete({
			where: {
				id,
			},
		});
	};
}

export default StoreService;

interface IGetStores {
	limit: number;
	page: number;
	search: string | undefined;
	user: any;
}
