import API from "@/middlewear/axios";

export const getCategories = async (limit: number = 10, page: number = 1) => {
	try {
		const response = await API.get(`/category`, {
			params: { limit, page},
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