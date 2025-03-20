import express from "express";
import Wrapper from "../middlewears/Wrapper";
import authenticatedOnly from "../middlewears/authenticated";
import AdsController from "../controllers/ads.controller";

const router = express.Router();
const controller = new AdsController();

router.get("/all", authenticatedOnly, Wrapper(controller.getAllAds)); // Admin-only route
router.get("/active", Wrapper(controller.getActiveAds));
router.get("/:id", authenticatedOnly, Wrapper(controller.getAd));
router.patch("/:id", authenticatedOnly, Wrapper(controller.updateAd));
router.delete("/:id", authenticatedOnly, Wrapper(controller.deleteAd));
router.post("/", authenticatedOnly, Wrapper(controller.createAd));

export default {
	routeUrl: "ads",
	Router: router,
};
