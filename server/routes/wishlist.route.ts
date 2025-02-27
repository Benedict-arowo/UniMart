import express from "express";
import Wrapper from "../middlewears/Wrapper";
import whishlistController from "../controllers/whishlist.controller";

const router = express.Router();
const controller = new whishlistController();

router.get("/", Wrapper(controller.getWishlist));
router.get("/:id", Wrapper(controller.getOtherWishlist));
router.post("/:productId", Wrapper(controller.addItem));
router.delete("/:productId", Wrapper(controller.removeItem));

export default {
	routeUrl: "whishlist",
	Router: router,
};
