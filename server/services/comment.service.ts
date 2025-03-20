import { ForbiddenError, NotFoundError } from "../middlewears/error";
import prisma from "../prisma";

class CommentService {
	async getComments(
		productId: string,
		page: number,
		limit: number,
		recent: boolean
	) {
		if (recent) {
			return prisma.comment.findMany({
				where: { productId },
				include: { createdBy: true },
				orderBy: { createdAt: "desc" },
				take: limit,
			});
		}

		return prisma.comment.findMany({
			where: { productId },
			include: {
				createdBy: {
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

	async deleteComment(id: string, user: any) {
		const comment = await prisma.comment.findUnique({ where: { id } });

		if (!comment) throw new NotFoundError("Comment not found");

		if (comment.userId !== user.id) {
			throw new ForbiddenError("Not authorized to delete this comment");
		}

		await prisma.comment.delete({ where: { id } });
	}

	async createComment(productId: string, userId: string, content: string) {
		return await prisma.comment.create({
			data: { productId, userId, content },
			include: {
				createdBy: {
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

	async editComment(id: string, content: string, user: any) {
		const comment = await prisma.comment.findUnique({ where: { id } });

		if (!comment) throw new NotFoundError("Comment not found");

		if (comment.userId !== user.id) {
			throw new ForbiddenError("Not authorized to edit this comment");
		}

		return prisma.comment.update({
			where: { id },
			data: { content },
		});
	}
}

export default CommentService;
