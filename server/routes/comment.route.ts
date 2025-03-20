import express from "express";
import Wrapper from "../middlewears/Wrapper";
import CommentController from "../controllers/comment.controller";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new CommentController();

router.get("/:productId", Wrapper(controller.getComments));
router.post(
	"/:productId",
	authenticatedOnly,
	Wrapper(controller.createComment)
);
router.patch("/:productId", authenticatedOnly, Wrapper(controller.editComment));
router.delete(
	"/:productId",
	authenticatedOnly,
	Wrapper(controller.deleteComment)
);

export default {
	routeUrl: "comment",
	Router: router,
};
