import prisma from "../prisma";

class WishlistService {
	getWishlist = async (
		userId: string,
		filters: { limit: number; page: number }
	) => {
		// const user = await prisma.user.findUniqueOrThrow({
		// 	where: { id: userId },
		// 	select: {
		// 		wishlist: {
		// 			skip: filters.page * filters.limit,
		// 			take: filters.limit,
		// 		},
		// 	},
		// });
		// return user.wishlist;
	};

	addItem = async (userId: string, productId: string) => {
		const product = await prisma.product.findUniqueOrThrow({
			where: { id: productId },
		});
	};
	removeItem = async (userId: string, productId: string) => {};
}

export default WishlistService;
