import API from "@/middlewear/axios";

export const getComments = async (
	productId: string,
	limit: number = 10,
	page: number = 1,
	recent: boolean = false
) => {
	try {
		const response = await API.get(`/comment/${productId}`, {
			params: { limit, page, recent: recent ? "true" : "false" },
		});

		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching comments:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch comments."
		);
	}
};

export const createComment = async (productId: string, content: string) => {
	try {
		const response = await API.post(`/comment/${productId}`, { content });

		return response.data;
	} catch (error: any) {
		console.error(
			"Error creating comment:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to create comment."
		);
	}
};

export const editComment = async (commentId: string, content: string) => {
	try {
		const response = await API.patch(`/comment/${commentId}`, { content });

		return response.data;
	} catch (error: any) {
		console.error(
			"Error updating comment:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to update comment."
		);
	}
};

export const deleteComment = async (commentId: string) => {
	try {
		await API.delete(`/comment/${commentId}`);

		return { success: true };
	} catch (error: any) {
		console.error(
			"Error deleting comment:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to delete comment."
		);
	}
};
