import express from "express";
import Wrapper from "../middlewears/Wrapper";
import whishlistController from "../controllers/whishlist.controller";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new whishlistController();

router.get("/", authenticatedOnly, Wrapper(controller.getWishlist));
router.get("/:id", Wrapper(controller.getOtherWishlist));
router.post("/:productId", authenticatedOnly, Wrapper(controller.addItem));
router.delete("/:productId", authenticatedOnly, Wrapper(controller.removeItem));

export default {
	routeUrl: "wishlist",
	Router: router,
};
