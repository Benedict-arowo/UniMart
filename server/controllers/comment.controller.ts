import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Req } from "../utils/types";
import CommentService from "../services/comment.service";
import validator from "../middlewears/validator";
import { createCommentSchema } from "../middlewears/validator/comment.validator";

class CommentController {
	service = new CommentService();

	getComments = async (req: Req, res: Response) => {
		const { productId } = req.params;
		let { page = 1, limit = 10, recent } = req.query;

		page = isNaN(Number(page)) ? 1 : Number(page);
		limit = isNaN(Number(limit)) ? 10 : Number(limit);

		const comments = await this.service.getComments(
			productId,
			Number(page),
			Number(limit),
			recent === "true"
		);

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { comments } });
	};

	deleteComment = async (req: Req, res: Response) => {
		const { productId: id } = req.params;
		try {
			await this.service.deleteComment(id, req.user);
			return res.status(StatusCodes.NO_CONTENT).send();
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	editComment = async (req: Req, res: Response) => {
		validator(req.body, createCommentSchema);
		const { productId: id } = req.params;
		const { content } = req.body;

		try {
			const updatedComment = await this.service.editComment(
				id,
				content,
				req.user
			);
			return res
				.status(StatusCodes.OK)
				.json({ success: true, data: { updatedComment } });
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	createComment = async (req: Req, res: Response) => {
		validator(req.body, createCommentSchema);
		const { productId } = req.params;
		const { content } = req.body;

		const comment = await this.service.createComment(
			productId,
			req.user.id,
			content
		);

		return res.status(StatusCodes.CREATED).json({
			success: true,
			data: { comment },
		});
	};
}

export default CommentController;
