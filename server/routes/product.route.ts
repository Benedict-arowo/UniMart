import express from "express";
import Wrapper from "../middlewears/Wrapper";
import ProductController from "../controllers/product.controller";
import { upload } from "../middlewears/upload";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new ProductController();

router.get("/", Wrapper(controller.getProducts));
router.get("/:id", Wrapper(controller.getProductById));
router.post(
	"/",
	upload.array("images", 10),
	authenticatedOnly,
	Wrapper(controller.createProduct)
);
router.put("/:id", authenticatedOnly, Wrapper(controller.updateProduct));
router.delete("/:id", authenticatedOnly, Wrapper(controller.deleteProduct));

export default {
	routeUrl: "products",
	Router: router,
};
