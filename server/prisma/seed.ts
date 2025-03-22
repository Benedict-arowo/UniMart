import {
	PrismaClient,
	Role,
	AdStatus,
	PaymentStatus,
	MessageType,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding database...");

	// Create Users (5 Sellers, 10 Buyers)
	const users = [];
	for (let i = 0; i < 5; i++) {
		users.push(
			await prisma.user.create({
				data: {
					username: faker.internet.userName(),
					email: faker.internet.email(),
					password: faker.internet.password(),
					roles: [Role.SELLER],
					isOnline: faker.datatype.boolean(),
					isVerified: true,
				},
			})
		);
	}
	for (let i = 0; i < 10; i++) {
		users.push(
			await prisma.user.create({
				data: {
					username: faker.internet.userName(),
					email: faker.internet.email(),
					password: faker.internet.password(),
					roles: [Role.BUYER],
					isOnline: faker.datatype.boolean(),
					isVerified: faker.datatype.boolean(),
				},
			})
		);
	}
	console.log(`✅ Created ${users.length} Users`);

	await prisma.category.deleteMany();
	// Create Categories (6)
	const categoriesData = [
		{ name: "Electronics" },
		{ name: "Clothing" },
		{ name: "Groceries" },
		{ name: "Home & Kitchen" },
		{ name: "Books" },
		{ name: "Beauty & Personal Care" },
	];

	const categories = await prisma.category.createMany({
		data: categoriesData,
	});
	console.log(`✅ Created ${categoriesData.length} Categories`);

	// Create Stores (10)
	const sellers = users.filter((user) => user.roles.includes(Role.SELLER));

	const availableSellers = [...sellers]; // Copy array to track used sellers
	const stores = [];

	for (let i = 0; i < Math.min(10, availableSellers.length); i++) {
		const owner = availableSellers.pop(); // Get and remove a seller to avoid duplicate ownerId

		if (!owner) break; // Stop if there aren't enough sellers

		const store = await prisma.store.create({
			data: {
				name: faker.company.name(),
				description: faker.company.catchPhrase(),
				ownerId: owner.id, // Now unique
				isActive: true,
			},
		});

		stores.push(store);
	}
	console.log(`✅ Created ${stores.length} Stores`);

	await prisma.product.deleteMany();
	await prisma.ad.deleteMany();
	await prisma.media.deleteMany();

	// Create Products (50)
	const products = [];
	for (let i = 0; i < 50; i++) {
		const store = faker.helpers.arrayElement(stores);
		const categoryIndex = faker.number.int({
			min: 0,
			max: categoriesData.length - 1,
		});

		const category = await prisma.category.findFirst({
			skip: categoryIndex,
			take: 1,
			select: { id: true },
		});

		const product = await prisma.product.create({
			data: {
				name: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				quantity: faker.number.int({ min: 1, max: 100 }),
				price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
				isActive: true,
				storeId: store.id,
				ownerId: store.ownerId,
				category: { connect: { id: category?.id } },
				media: {
					create: {
						type: "IMAGE",
						url: faker.image.url(),
					},
				},
			},
		});
		products.push(product);
	}
	console.log(`✅ Created ${products.length} Products`);

	const media = [
		"https://res.cloudinary.com/dctbkswpr/image/upload/v1742630331/uploads/ads/ciax4blmpprzbmcjjvuk.jpg",
		"https://res.cloudinary.com/dctbkswpr/image/upload/v1742630264/uploads/ads/hjit4lyk8x4i51mgqcpo.jpg",
		"https://res.cloudinary.com/dctbkswpr/image/upload/v1742630263/uploads/ads/bbtj0ut0mrrmep8nytgd.jpg",
	];

	const getMedia = async () => {
		return await prisma.media.create({
			data: {
				type: "IMAGE",
				url: media[Math.floor(Math.random() * 3)],
			},
		});
	};

	// Create Ads (5)
	for (let i = 0; i < 5; i++) {
		await prisma.ad.create({
			data: {
				sellerId: faker.helpers.arrayElement(sellers).id,
				title: faker.company.name(),
				content: faker.lorem.sentence(),
				mediaId: (await getMedia()).id,
				status: faker.helpers.arrayElement([
					AdStatus.ACTIVE,
					AdStatus.PENDING,
				]),
				clicks: faker.number.int({ min: 0, max: 100 }),
			},
		});
	}
	console.log("✅ Created 5 Ads");

	// Create Payments (20)
	for (let i = 0; i < 20; i++) {
		const buyer = faker.helpers.arrayElement(
			users.filter((u) => u.roles.includes(Role.BUYER))
		);
		const product = faker.helpers.arrayElement(products);

		await prisma.payment.create({
			data: {
				amount: product.price,
				status: faker.helpers.arrayElement([
					PaymentStatus.PENDING,
					PaymentStatus.SUCCESS,
					PaymentStatus.FAILED,
				]),
				paymentDate: faker.date.past(),
				productId: product.id,
				userId: buyer.id,
			},
		});
	}
	console.log("✅ Created 20 Payments");

	// Create Chats (10 Conversations)
	for (let i = 0; i < 10; i++) {
		const user1 = faker.helpers.arrayElement(users);
		const user2 = faker.helpers.arrayElement(
			users.filter((u) => u.id !== user1.id)
		);

		const chat = await prisma.chat.create({
			data: {
				participants: { connect: [{ id: user1.id }, { id: user2.id }] },
			},
		});

		await prisma.message.createMany({
			data: [
				{
					content: faker.lorem.sentence(),
					type: MessageType.TEXT,
					senderId: user1.id,
					chatId: chat.id,
				},
				{
					content: faker.lorem.sentence(),
					type: MessageType.TEXT,
					senderId: user2.id,
					chatId: chat.id,
				},
			],
		});
	}
	console.log("✅ Created 10 Chats with Messages");

	console.log("🎉 Seeding completed successfully!");
}

// Run the seed script
main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
