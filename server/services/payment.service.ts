import prisma from "../prisma";

class PaymentService {
	getPayments = async (limit: number, page: number) => {
		const payments = prisma.payment.findMany({
			take: limit,
			skip: (page - 1) * limit,
		});

		return payments;
	};

	getPaymentById = async (id: string) => {
		const payment = prisma.payment.findUniqueOrThrow({
			where: {
				id,
			},
		});

		return payment;
	};

	paystackWebhook = async (event: any) => {
		console.log(event);

		if (event.event === "charge.success") {
			const {
				metadata: { type, userId },
			} = event.data;

			if (type === "PlanSubscription") {
				const { subscriptionId, expiryInDays = 30 } =
					event.data.metadata;

				await prisma.subscription.update({
					where: {
						id: subscriptionId,
					},
					data: {
						isActive: true,
						expires: new Date(
							new Date().setDate(
								new Date().getDate() + expiryInDays
							)
						),
					},
				});

				const payment = await prisma.payment.create({
					data: {
						amount: Number(event.data.amount) / 100, // Converting back from Kobo to Naira
						status: event.data.status.toUpperCase(),
						paymentDate: event.data.paid_at,
						subscriptionId: subscriptionId,
						userId: userId,
					},
				});

				return payment;
			} else {
				const payment = await prisma.payment.create({
					data: {
						amount: event.data.amount,
						status: event.data.status,
						paymentDate: event.data.paid_at,
						userId: userId,
					},
				});

				return payment;
			}
			// TODO: Send Email to user
		} else {
			console.log(event.event);
		}
	};
}

// {
//     event: 'charge.success',
//     data: {
//       id: 4732581315,
//       domain: 'test',
//       status: 'success',
//       reference: '9na2f536o1',
//       amount: 350000,
//       message: null,
//       gateway_response: 'Successful',
//       paid_at: '2025-02-28T04:55:25.000Z',
//       created_at: '2025-02-28T04:55:20.000Z',
//       channel: 'card',
//       currency: 'NGN',
//       ip_address: '102.89.69.126',
//       metadata: {
//         subscriptionId: 'a0fc5102-1284-4ffe-b1e4-d63327de7f6d',
//         userId: '0582e028-87e8-4a5d-ab84-2e047824d7cc',
//         type: 'PlanSubscription'
//       },
//       fees_breakdown: null,
//       log: null,
//       fees: 15250,
//       fees_split: null,
//       authorization: {
//         authorization_code: 'AUTH_cx9snbn36z',
//         bin: '408408',
//         last4: '4081',
//         exp_month: '12',
//         exp_year: '2030',
//         channel: 'card',
//         card_type: 'visa ',
//         bank: 'TEST BANK',
//         country_code: 'NG',
//         brand: 'visa',
//         reusable: true,
//         signature: 'SIG_1tPdPaIyPB8NAuZM2NpT',
//         account_name: null,
//         receiver_bank_account_number: null,
//         receiver_bank: null
//       },
//       customer: {
//         id: 245904981,
//         first_name: null,
//         last_name: null,
//         email: 'test1@gmail.com',
//         customer_code: 'CUS_u6pzg81c7yz31tl',
//         phone: null,
//         metadata: null,
//         risk_action: 'default',
//         international_format_phone: null
//       },
//       plan: {},
//       subaccount: {},
//       split: {},
//       order_id: null,
//       paidAt: '2025-02-28T04:55:25.000Z',
//       requested_amount: 350000,
//       pos_transaction_data: null,
//       source: {
//         type: 'api',
//         source: 'merchant_api',
//         entry_point: 'transaction_initialize',
//         identifier: null
//       }
//     }
//   }

export default PaymentService;
