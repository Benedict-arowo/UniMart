import express from "express";
import Wrapper from "../middlewears/Wrapper";
import authenticatedOnly from "../middlewears/authenticated";
import StoreController from "../controllers/store.controller";

const router = express.Router();
const controller = new StoreController();

router.get("/", Wrapper(controller.getStores));
router.get("/:id", Wrapper(controller.getStore));
router.post("/", authenticatedOnly, Wrapper(controller.createStore));
router.put("/:id", authenticatedOnly, Wrapper(controller.updateStore));
router.delete("/:id", authenticatedOnly, Wrapper(controller.deleteStore));

export default {
	routeUrl: "stores",
	Router: router,
};
