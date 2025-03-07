import API from "@/middlewear/axios";

export const getCategories = async (limit: number = 10, page: number = 1) => {
	try {
		const response = await API.get(`/category`, {
			params: { limit, page },
		});

		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching categories:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch categories."
		);
	}
};

export const getItemsInCategory = async (
	category: string,
	limit: number = 10,
	page: number = 1
) => {
	try {
		const response = await API.get(`/category/products/${category}`, {
			params: { limit, page },
		});

		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching products:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch products."
		);
	}
};
