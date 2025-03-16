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
			throw new Error("Network error: Unable to reach server.");
		} else {
			throw new Error("Something went wrong, please try again.");
		}
	}
};

export const register = async (data: { email: string; password: string }) => {
	try {
		const response = await API.post("/auth/register", {
			email: data.email,
			password: data.password,
		});

		return response.data;
	} catch (error: any) {
		if (error.response) {
			console.log(error.response);
			switch (error.response.status) {
				case 400:
					throw new Error(
						error.response.data.message ||
							"Error while trying to create user."
					);
				case 500:
					throw new Error("Server error, please try again later.");
				default:
					throw new Error(
						error.response.data?.message || "An error occurred."
					);
			}
		} else if (error.request) {
			throw new Error("Network error: Unable to reach server.");
		} else {
			throw new Error("Something went wrong, please try again.");
		}
	}
};

export const initforgotPassword = async (data: { email: string }) => {
	try {
		const response = await API.post("/auth/init-reset-password", {
			email: data.email,
		});

		return response.data.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data?.message || "An error occurred."
			);
		} else if (error.request) {
			throw new Error("Network error: Unable to reach server.");
		} else {
			throw new Error("Something went wrong, please try again.");
		}
	}
};

export const forgotPassword = async ({
	password,
	code,
	email,
}: {
	password: string;
	code: string;
	email: string;
}) => {
	try {
		const response = await API.post("/auth/forget-password", {
			newPassword: password,
			code,
			email,
		});

		return response.data.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data?.message || "An error occurred."
			);
		} else if (error.request) {
			throw new Error("Network error: Unable to reach server.");
		} else {
			throw new Error("Something went wrong, please try again.");
		}
	}
};

export const changePassword = async (data: {
	oldPassword: string;
	newPassword: string;
}) => {
	try {
		const response = await API.post("/auth/change-password", {
			oldPassword: data.oldPassword,
			newPassword: data.newPassword,
		});

		return response.data.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data?.message || "An error occurred."
			);
		} else if (error.request) {
			throw new Error("Network error: Unable to reach server.");
		} else {
			throw new Error("Something went wrong, please try again.");
		}
	}
};

export const resendVerificationCode = async () => {
	try {
		const response = await API.post("/auth/resend-code");
		return response.data.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data?.message || "An error occurred."
			);
		} else if (error.request) {
			throw new Error("Network error: Unable to reach server.");
		} else {
			throw new Error("Something went wrong, please try again.");
		}
	}
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
