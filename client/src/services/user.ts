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
