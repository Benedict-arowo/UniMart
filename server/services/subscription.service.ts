import { BadrequestError } from "../middlewears/error";
import prisma from "../prisma";
import CONFIG from "../utils/config";

class SubscriptionService {
	subscribe = async (planId: string, userId: string, userEmail: string) => {
		const plan = await prisma.plan.findUniqueOrThrow({
			where: { id: planId },
		});

		if (!plan.active)
			throw new BadrequestError("Plan selected is not active.");

		const userHasAnyPlan = await prisma.subscription.findMany({
			where: {
				userId,
				isActive: true,
			},
		});

		if (userHasAnyPlan.length > 0)
			throw new BadrequestError(
				"You are currently subscribed to another plan."
			);

		const subscription = await prisma.subscription.create({
			data: {
				isActive: false,
				planId,
				userId,
				created: new Date(),
			},
		});

		console.log(subscription.id);
		const response = await fetch(
			`${CONFIG.env.PAYSTACK_BASE_URL}/transaction/initialize`,
			{
				method: "POST",
				body: JSON.stringify({
					amount: (plan.amount * 100).toString(),
					email: userEmail,
					metadata: {
						subscriptionId: subscription.id,
						userId,
						type: "PlanSubscription",
						expiryInDays: plan.durationInDays,
					},
					// TODO: an idea... Store the subscription id inside metadata, if subscription creation fails, handle the exeception by deleting the subscription...
				}),
				headers: {
					[`Content-Type`]: "application/json",
					Authorization: `Bearer ${CONFIG.env.PAYSTACK_SECRET_KEY}`,
				},
			}
		);

		const data = await response.json();
		if (!response.ok) {
			throw new Error(
				`Paystack Error: ${data.message || "Unknown error"}`
			);
		}

		return data.data;
	};

	unsubscribe = async (subscriptionId: string, userId: string) => {
		const subscription = await prisma.subscription.findUniqueOrThrow({
			where: {
				id: subscriptionId,
			},
		});

		if (!subscription.isActive)
			throw new BadrequestError("Subscription is no longer active.");

		await prisma.subscription.update({
			where: { id: subscriptionId },
			data: {
				isActive: false,
				expires: new Date(),
			},
		});

		return;
	};
}

export default SubscriptionService;
