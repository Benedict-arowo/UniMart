import API from "@/middlewear/axios";

export const login = async (data: { email: string; password: string }) => {
	try {
		const response = await API.post("/auth/login", {
			email: data.email,
			password: data.password,
		});

		return response.data.data;
	} catch (error: any) {
		if (error.response) {
			console.log(error.response);
			switch (error.response.status) {
				case 400:
					throw new Error(
						error.response.data.message ||
							"Invalid email or password."
					);
				case 500:
					throw new Error("Server error, please try again later.");
				default:
					throw new Error(
						error.response.data?.message || "An error occurred."
					);
			}
		} else if (error.request) {
			// No response received
			throw new Error("Network error: Unable to reach server.");
		} else {
			// Other unexpected errors
			throw new Error("Something went wrong, please try again.");
		}
	}
};

export const register = async (data: { email: string; password: string }) => {
	const response = await API.post("/auth/register", {
		email: data.email,
		password: data.password,
	});

	return response.data;
};

export const logout = async () => {
	try {
		await API.post("/auth/logout");
		return;
	} catch (error: any) {
		console.error(
			"Logout failed:",
			error.response?.data?.message || "Unknown error"
		);
		return error;
	}
};

export const verifyEmail = async (token: string) => {
	try {
		const response = await API.post("/auth/verify", {
			code: Number(token),
		});
		return response.data;
	} catch (error: any) {
		console.error(
			"Email verification failed:",
			error.response?.data?.message || "Unknown error"
		);

		// Optionally, return a structured error response instead of throwing
		return {
			success: false,
			message:
				error.response?.data?.message || "Email verification failed.",
		};
	}
};
