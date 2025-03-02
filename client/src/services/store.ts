import API from "@/middlewear/axios";

export const getStores = async (
	limit: number = 10,
	page: number = 1,
	active = undefined,
	featured = undefined
) => {
	try {
		const response = await API.get(`/stores`, {
			params: {
				limit,
				page,
				active: active ? active : undefined,
				featured: featured ? featured : undefined,
			},
		});

		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching stores:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch stores."
		);
	}
};
