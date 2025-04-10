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

export const getSimilarProducts = async (
	id: string,
	limit: number = 10,
	page: number = 1
) => {
	try {
		const response = await API.get(`/products/similar/${id}`, {
			params: {
				limit,
				page,
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
		const formData = new FormData();

		for (const key in data) {
			if (key !== "media") {
				if (Array.isArray(data[key])) {
					data[key].forEach((value) => {
						formData.append(`${key}[]`, value);
					});
				} else formData.append(key, data[key]);
			}
		}

		if (Array.isArray(data.media)) {
			data.media.forEach((mediaItem) => {
				if (mediaItem.public_id instanceof File) {
					formData.append("images", mediaItem.public_id);
				}
			});
		}

		const response = await API.patch(`/products/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

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

export const deleteProduct = async (id: string) => {
	try {
		const response = await API.delete(`/products/${id}`);
		return response.data;
	} catch (error: any) {
		console.error(
			"Error deleting product:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to delete product."
		);
	}
};

export const deleteProductImage = async (id: string) => {
	try {
		const response = await API.delete(`/products/image/${id}`);
		return response.data;
	} catch (error: any) {
		console.error(
			"Error deleting product:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to delete product."
		);
	}
};

export const createProduct = async (data: any) => {
	try {
		const formData = new FormData();

		for (const key in data) {
			if (key !== "media") {
				if (Array.isArray(data[key])) {
					data[key].forEach((value) => {
						formData.append(`${key}[]`, value);
					});
				} else formData.append(key, data[key]);
			}
		}

		if (Array.isArray(data.media)) {
			data.media.forEach((mediaItem) => {
				if (mediaItem.public_id instanceof File) {
					formData.append("images", mediaItem.public_id);
				}
			});
		}

		const response = await API.post(`/products`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	} catch (error: any) {
		console.error(
			"Error creating product:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to create product."
		);
	}
};
