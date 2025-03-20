import { InternalServerError, NotFoundError } from "../middlewears/error";
import prisma from "../prisma";

class WishlistService {
	getWishlist = async (userId: string) => {
		try {
			const wishlist = await prisma.wishlist.findUnique({
				where: { ownerId: userId },
				include: {
					products: true,
				},
			});

			if (!wishlist) throw new NotFoundError("Wishlist not found.");

			return wishlist.products;
		} catch (error) {
			throw new InternalServerError("Failed to fetch wishlist.");
		}
	};

	addItem = async (userId: string, productId: string) => {
		try {
			const product = await prisma.product.findUnique({
				where: { id: productId },
			});
			if (!product) throw new NotFoundError("Product not found.");

			await prisma.wishlist.upsert({
				where: { ownerId: userId },
				update: {
					products: {
						connect: { id: productId },
					},
				},
				create: {
					ownerId: userId,
					products: {
						connect: { id: productId },
					},
				},
			});
		} catch (error) {
			throw new InternalServerError("Failed to add item to wishlist.");
		}
	};

	removeItem = async (userId: string, productId: string) => {
		try {
			const wishlist = await prisma.wishlist.findUnique({
				where: { ownerId: userId },
			});

			if (!wishlist) throw new NotFoundError("Wishlist not found.");

			await prisma.wishlist.update({
				where: { ownerId: userId },
				data: {
					products: {
						disconnect: { id: productId },
					},
				},
			});
		} catch (error) {
			throw new InternalServerError(
				"Failed to remove item from wishlist."
			);
		}
	};
}

export default WishlistService;
