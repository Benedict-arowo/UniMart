import express from "express";
import Wrapper from "../middlewears/Wrapper";
import ReviewController from "../controllers/review.controller";
import { upload } from "../middlewears/upload";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new ReviewController();

router.get("/:productId", Wrapper(controller.getProductReviews));
router.delete(
	"/:reviewId",
	authenticatedOnly,
	Wrapper(controller.deleteProductReview)
);
router.post(
	"/:reviewId",
	authenticatedOnly,
	Wrapper(controller.createProductReview)
);

export default {
	routeUrl: "review",
	Router: router,
};
