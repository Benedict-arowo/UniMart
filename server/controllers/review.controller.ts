import { Request, Response } from "express";
import { Req } from "../utils/types";
import validator from "../middlewears/validator";
import { StatusCodes } from "http-status-codes";
import { createReviewSchema } from "../middlewears/validator/review.validator";
import ReviewService from "../services/review.service";

class ReviewController {
	service = new ReviewService();

	getProductReviews = async (req: Request, res: Response) => {
		const { productId } = req.params;
		let { page = 1, limit = 10, recent } = req.query;

		page = isNaN(Number(page)) ? 1 : Number(page);
		limit = isNaN(Number(limit)) ? 10 : Number(limit);

		const reviews = await this.service.getReviews(
			productId,
			Number(page),
			Number(limit),
			recent === "true"
		);

		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: { reviews } });
	};

	deleteProductReview = async (req: Req, res: Response) => {
		const { reviewId: id } = req.params;
		try {
			await this.service.deleteReview(id, req.user);
			return res.status(StatusCodes.NO_CONTENT).json();
		} catch (error: any) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: error.message });
		}
	};

	createProductReview = async (req: Req, res: Response) => {
		validator(req.body, createReviewSchema);
		const { reviewId } = req.params;

		const review = await this.service.createReview(
			reviewId,
			req.user.id,
			req.body.content,
			req.body.rating
		);

		return res.status(StatusCodes.CREATED).json({
			success: true,
			data: { review },
		});
	};
}

export default ReviewController;
