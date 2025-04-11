import { Prisma } from "@prisma/client";
import { BadrequestError } from "../middlewears/error";
import { RefineUser } from "../middlewears/validator/auth.validator";
import prisma from "../prisma";
import { Req } from "../utils/types";

class UserService {
	getUser = async (userId: string) => {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				store: {
					select: {
						id: true,
						name: true,
						description: true,
						customUrl: true,
						isActive: true,
						isBoosted: true,
						banner: true,
						boostedAt: true,
						boostExpiresAt: true,
						_count: true,
					},
				},
			},
		});

		if (!user) throw new BadrequestError("User not found.");

		return RefineUser(user);
	};

	getProducts = async ({
		user,
		limit,
		search,
		page,
		featured = false,
		active,
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

		const products = await prisma.product.findMany({
			where: { ...query, ownerId: user },
			take: limit,
			skip: (page - 1) * limit,
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

		return products;
	};

	async getReviews(
		userId: string,
		page: number,
		limit: number,
		recent: boolean
	) {
		if (recent) {
			return prisma.review.findMany({
				where: {
					product: {
						ownerId: userId,
					},
				},
				include: {
					reviewer: {
						select: {
							id: true,
							username: true,
							email: true,
							lastOnline: true,
							isOnline: true,
							isVerified: true,
							createdAt: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: limit,
			});
		}

		return prisma.review.findMany({
			where: {
				product: {
					ownerId: userId,
				},
			},
			include: {
				reviewer: {
					select: {
						id: true,
						username: true,
						email: true,
						lastOnline: true,
						isOnline: true,
						isVerified: true,
						createdAt: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * limit,
			take: limit,
		});
	}
}

export default UserService;

interface IGetProducts {
	limit: number;
	search?: string;
	page: number;
	storeName?: string;
	featured?: Boolean;
	active?: Boolean;
	user: string;
}
