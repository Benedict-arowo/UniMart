import express from "express";
import Wrapper from "../middlewears/Wrapper";
import ProductController from "../controllers/product.controller";
import { upload } from "../middlewears/upload";

const router = express.Router();
const controller = new ProductController();

router.get("/", Wrapper(controller.getProducts));
router.post("/", upload.array("images", 10), Wrapper(controller.createProduct));
router.put("/:id", Wrapper(controller.updateProduct));
router.delete("/:id", Wrapper(controller.deleteProduct));

export default {
	routeUrl: "products",
	Router: router,
};
