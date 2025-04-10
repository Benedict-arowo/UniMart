import API from "@/middlewear/axios";

export const getReviews = async (
	productId: string,
	limit: number = 10,
	page: number = 1,
	recent: boolean = false
) => {
	try {
		const response = await API.get(`/review/${productId}`, {
			params: { limit, page, recent: recent ? "true" : "false" },
		});

		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching reviews:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch reviews."
		);
	}
};

export const createReview = async (
	productId: string,
	content: string,
	rating: number
) => {
	try {
		const response = await API.post(`/review/${productId}`, {
			content,
			rating,
		});

		return response.data;
	} catch (error: any) {
		console.error(
			"Error creating review:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to create review."
		);
	}
};

// export const editReview = async (
// 	reviewId: string,
// 	content: string,
// 	rating: number
// ) => {
// 	try {
// 		const response = await API.patch(`/review/${reviewId}`, {
// 			content,
// 			rating,
// 		});

// 		return response.data;
// 	} catch (error: any) {
// 		console.error(
// 			"Error updating review:",
// 			error?.response?.data?.message || "Unknown error"
// 		);
// 		throw new Error(
// 			error.response?.data?.message || "Failed to update review."
// 		);
// 	}
// };

export const deleteReview = async (reviewId: string) => {
	try {
		await API.delete(`/review/${reviewId}`);

		return { success: true };
	} catch (error: any) {
		console.error(
			"Error deleting review:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to delete review."
		);
	}
};
