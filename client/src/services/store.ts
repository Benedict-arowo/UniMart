import API from "@/middlewear/axios";
import axios from "axios";

export const getStores = async (
	limit: number = 10,
	page: number = 1,
	active?: boolean,
	featured?: boolean
) => {
	try {
		const response = await API.get(`/stores`, {
			params: {
				limit,
				page,
				active: typeof active === "boolean" ? active : undefined,
				featured: typeof featured === "boolean" ? featured : undefined,
			},
		});

		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error(
				"Error fetching stores:",
				error.response?.data?.message || "Unknown Axios error"
			);
			throw new Error(
				error.response?.data?.message || "Failed to fetch stores."
			);
		}

		console.error("Unknown error fetching stores", error);
		throw new Error("An unexpected error occurred while fetching stores.");
	}
};

export const getStore = async (id: string) => {
	try {
		const response = await API.get(`/stores/${id}`);
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error(
				"Error fetching store:",
				error.response?.data?.message || "Unknown Axios error"
			);
			throw new Error(
				error.response?.data?.message || "Failed to fetch store."
			);
		}

		console.error("Unknown error fetching store", error);
		throw new Error("An unexpected error occurred while fetching store.");
	}
};

export const getStoreProducts = async (
	storeId: string,
	limit: number = 10,
	page: number = 1,
	search = "",
	featured = undefined
) => {
	try {
		const response = await API.get(`/stores/products/${storeId}`, {
			params: {
				limit,
				page,
				search: search.length > 0 ? search : undefined,
				featured: featured ? featured : undefined,
			},
		});

		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching store products:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch store products."
		);
	}
};

export const createStore = async (name: string, description: string) => {
	try {
		const response = await API.post(`/stores`, { name, description });
		return response.data;
	} catch (error: any) {
		console.error(
			"Error creating store:",
			error?.response?.data?.message || error.message
		);
		throw new Error(
			error.response?.data?.message || "Failed to create store."
		);
	}
};

export const updateStore = async (
	id: string,
	name: string,
	description: string,
	banner?: File
) => {
	try {
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		if (banner) {
			formData.append("banner", banner);
		}

		const response = await API.patch(`/stores/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error: any) {
		console.error(
			"Error updating store:",
			error?.response?.data?.message || error.message
		);
		throw new Error(
			error.response?.data?.message || "Failed to update store."
		);
	}
};
