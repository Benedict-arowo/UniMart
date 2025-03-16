import API from "@/middlewear/axios";

export const getProducts = async (
	limit: number = 10,
	page: number = 1,
	active = undefined,
	featured = undefined
) => {
	try {
		const response = await API.get(`/products`, {
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

export const getProduct = async (id: string) => {
	try {
		const response = await API.get(`/products/${id}`);

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

export const updateProduct = async (id: string, data: any) => {
	try {
		const response = await API.patch(`/products/${id}`, data);
		return response.data;
	} catch (error: any) {
		console.error(
			"Error updating product:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to update product."
		);
	}
};
