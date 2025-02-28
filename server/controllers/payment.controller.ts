import { StatusCodes } from "http-status-codes";
import { Req } from "../utils/types";
import crypto from "crypto";
import { Response } from "express";
import CONFIG from "../utils/config";
import PaymentService from "../services/payment.service";

class PaymentController {
	service = new PaymentService();

	getPayments = async (req: Req, res: Response) => {
		const {
			query: { limit = 10, page = 1 },
		} = req;
		const payments = await this.service.getPayments(
			Number(limit),
			Number(page)
		);

		return res.status(StatusCodes.OK).json({
			success: true,
			data: payments,
		});
	};

	getPayment = async (req: Req, res: Response) => {
		const {
			params: { paymentId },
		} = req;

		const payment = await this.service.getPaymentById(paymentId);

		return res.status(StatusCodes.OK).json({
			success: true,
			data: payment,
		});
	};

	paystackWebhook = async (req: Req, res: Response) => {
		const hash = crypto
			.createHmac("sha512", CONFIG.env.PAYSTACK_SECRET_KEY)
			.update(JSON.stringify(req.body))
			.digest("hex");

		if (hash == req.headers["x-paystack-signature"]) {
			const event = req.body;
			await this.service.paystackWebhook(event);
		}

		return res.status(StatusCodes.OK).json({ success: true });
	};
}

export default PaymentController;
