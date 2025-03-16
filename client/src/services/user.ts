import API from "@/middlewear/axios";

export const getUser = async () => {
	try {
		const response = await API.get("/user");
		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching user:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch user."
		);
	}
};

export const getOtherUser = async (id: string) => {
	try {
		const response = await API.get(`/user/${id}`);
		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching user:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch user."
		);
	}
};

export const getOtherUserProducts = async (
	id: string,
	limit: number = 10,
	page: number = 1,
	active = undefined,
	featured = undefined
) => {
	try {
		const response = await API.get(`/user/products/${id}`, {
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
			"Error fetching products:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch products."
		);
	}
};


export const getUserProducts = async (
	limit: number = 10,
	page: number = 1,
	active = undefined,
	featured = undefined
) => {
	try {
		const response = await API.get(`/user/products`, {
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
			"Error fetching products:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch products."
		);
	}
};
