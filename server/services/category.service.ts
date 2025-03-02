import prisma from "../prisma";

class CategoryService {
	getCategories = async (limit = 10, page = 1) => {
		const categories = await prisma.category.findMany({
			select: {
				name: true,
				_count: true,
			},
			orderBy: {
				products: {
					_count: "desc"
				}
			},
			skip: limit * (page - 1),
			take: limit,
		});

		return categories;
	};

	getProducts = async (
		categoryId: string,
		{ limit, page }: { limit: number; page: number }
	) => {
		const products = await prisma.product.findMany({
			where: {
				category: {
					some: {
						id: categoryId,
					},
				},
			},
			take: limit,
			skip: limit * (page - 1),
		});

		return products;
	};
}

export default CategoryService;
