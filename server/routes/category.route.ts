import express from "express";
import Wrapper from "../middlewears/Wrapper";
import CategoryController from "../controllers/category.controller";

const router = express.Router();
const controller = new CategoryController();

router.get("/", Wrapper(controller.getCategories));
router.get("/products", Wrapper(controller.getCategoryProducts));

export default {
	routeUrl: "category",
	Router: router,
};
