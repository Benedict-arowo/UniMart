import API from "@/middlewear/axios";

export const getWishlist = async () => {
	try {
		const response = await API.get("/wishlist");
		return response.data.data;
	} catch (error: any) {
		console.error(
			"Error fetching wishlist:",
			error.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch wishlist."
		);
	}
};

export const addToWishlist = async (id: string) => {
	try {
		await API.post(`/wishlist/${id}`);
	} catch (error: any) {
		console.error(
			"Error adding product to wishlist:",
			error.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message ||
				"Failed to add product to wishlist."
		);
	}
};

export const removeFromWishlist = async (id: string) => {
	try {
		await API.delete(`/wishlist/${id}`);
	} catch (error: any) {
		console.error(
			"Error removing product from wishlist:",
			error.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message ||
				"Failed to remove product from wishlist."
		);
	}
};
