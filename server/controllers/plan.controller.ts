import { Response } from "express";
import { Req } from "../utils/types";
import { StatusCodes } from "http-status-codes";
import PlanService from "../services/plan.service";

class PlanController {
	service = new PlanService();

	getPlans = async (req: Req, res: Response) => {
		const {
			query: { activeOnly },
		} = req;
		const plans = await this.service.getPlans(activeOnly ? true : false);

		return res.status(StatusCodes.OK).json({ success: true, data: plans });
	};

	getPlan = async (req: Req, res: Response) => {
		const {
			params: { id },
		} = req;
		const plan = await this.service.getPlanById(id);

		return res.status(StatusCodes.OK).json({ success: true, data: plan });
	};

	createPlan = async (req: Req, res: Response) => {
		const { body } = req;
		const plan = await this.service.createPlan(body);

		return res.status(StatusCodes.CREATED).json({
			success: true,
			data: plan,
		});
	};

	updatePlan = async (req: Req, res: Response) => {
		const {
			params: { id },
			body,
		} = req;
		const plan = await this.service.updatePlan(id, body);

		return res.status(StatusCodes.OK).json({ success: true, data: plan });
	};

	deletePlan = async (req: Req, res: Response) => {
		const {
			params: { id },
		} = req;
		await this.service.deletePlan(id);
		return res.status(StatusCodes.NO_CONTENT).json();
	};
}

export default PlanController;
