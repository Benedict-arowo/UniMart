import API from "@/middlewear/axios";

export const getChats = async () => {
	try {
		const response = await API.get(`/chat`);
		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching chats:",
			error?.response?.data?.message || "Unknown error"
		);
		throw new Error(
			error.response?.data?.message || "Failed to fetch chats."
		);
	}
};
