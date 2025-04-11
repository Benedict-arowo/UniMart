import express from "express";
import Wrapper from "../middlewears/Wrapper";
import authenticatedOnly from "../middlewears/authenticated";
import StoreController from "../controllers/store.controller";
import { upload } from "../middlewears/upload";

const router = express.Router();
const controller = new StoreController();

router.get("/", Wrapper(controller.getStores));
router.get("/:id", Wrapper(controller.getStore));
router.get("/products/:id", Wrapper(controller.getUserStoreProducts));
router.post("/", authenticatedOnly, Wrapper(controller.createStore));
router.patch(
	"/:id",
	authenticatedOnly,
	upload.single("banner"),
	Wrapper(controller.updateStore)
);
router.delete("/:id", authenticatedOnly, Wrapper(controller.deleteStore));

export default {
	routeUrl: "stores",
	Router: router,
};
