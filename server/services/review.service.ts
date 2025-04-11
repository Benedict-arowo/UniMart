import { ForbiddenError, NotFoundError } from "../middlewears/error";
import prisma from "../prisma";

class ReviewService {
	async getReviews(
		productId: string,
		page: number,
		limit: number,
		recent: boolean
	) {
		if (recent) {
			return prisma.review.findMany({
				where: { productId },
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
			where: { productId },
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

	async deleteReview(id: string, user: any) {
		const review = await prisma.review.findUnique({ where: { id } });

		if (!review) throw new NotFoundError("Review not found");

		if (review.userId !== user.id) {
			throw new ForbiddenError("Not authorized to delete this comment");
		}

		await prisma.review.delete({ where: { id } });
	}

	async createReview(
		productId: string,
		userId: string,
		content: string,
		rating: number
	) {
		return await prisma.review.create({
			data: { productId, userId, content, rating },
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
		});
	}
}

export default ReviewService;
