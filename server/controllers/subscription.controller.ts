import { Response } from "express";
import { Req } from "../utils/types";
import { StatusCodes } from "http-status-codes";
import SubscriptionService from "../services/subscription.service";

class SubscriptionController {
	service = new SubscriptionService();

	subscribe = async (req: Req, res: Response) => {
		const {
			params: { planId },
			user: { id: userId, email: userEmail },
		} = req;

		const subscription = await this.service.subscribe(
			planId,
			userId,
			userEmail
		);
		return res
			.status(StatusCodes.OK)
			.json({ success: true, data: subscription });
	};

	unsubscribe = async (req: Req, res: Response) => {
		const {
			params: { subscriptionId },
			// user: { id: userId },
		} = req;
		await this.service.unsubscribe(subscriptionId, "test1@gmail.com");
		return res.status(StatusCodes.OK).json({ success: true });
	};
}

export default SubscriptionController;
