import express from "express";
import Wrapper from "../middlewears/Wrapper";
import PlanController from "../controllers/plan.controller";

const router = express.Router();
const controller = new PlanController();

router.post("/", Wrapper(controller.createPlan));
router.get("/", Wrapper(controller.getPlans));
router.get("/:id", Wrapper(controller.getPlan));
router.put("/:id", Wrapper(controller.updatePlan));
router.delete("/:id", Wrapper(controller.deletePlan));

export default {
	routeUrl: "plan",
	Router: router,
};
