import prisma from "../prisma";

class PlanService {
	getPlans = async (activeOnly: boolean | undefined) => {
		const plans = await prisma.plan.findMany({
			where: {
				active: activeOnly ? true : undefined,
			},
			orderBy: {
				amount: "asc",
			},
		});

		return plans;
	};

	createPlan = async (data: IPlan) => {
		const plan = await prisma.plan.create({
			data: {
				name: data.name!,
				durationInDays: data.durationInDays!,
				active: data.active!,
				amount: data.amount!,
			},
		});

		return plan;
	};

	getPlanById = async (planId: string) => {
		const plan = await prisma.plan.findUnique({
			where: { id: planId },
			select: {
				id: true,
				name: true,
				amount: true,
				active: true,
				durationInDays: true,
				_count: true,
			},
		});

		return plan;
	};

	updatePlan = async (planId: string, data: IPlan) => {
		const plan = await prisma.plan.update({
			where: { id: planId },
			data,
			select: {
				id: true,
				name: true,
				amount: true,
				active: true,
				durationInDays: true,
				_count: true,
			},
		});

		return plan;
	};

	deletePlan = async (planId: string) => {
		await prisma.plan.delete({
			where: { id: planId },
		});
	};
}

interface IPlan {
	name: string | undefined;
	durationInDays: number | undefined;
	amount: number | undefined;
	active: boolean | undefined;
}

export default PlanService;
