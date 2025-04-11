import axios from "axios";

const API = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add an interceptor to attach tokens to requests
// API.interceptors.request.use(
// 	(config) => {
// 		const token = localStorage.getItem("accessToken");
// 		if (token) {
// 			config.headers.Authorization = `Bearer ${token}`;
// 		}
// 		return config;
// 	},
// 	(error) => Promise.reject(error)
// );

// Handle global response errors
API.interceptors.response.use(
	(response) => response,
	(error) => {
		// Get the request URL
		const requestUrl = error.config?.url;

		// Exception: Do NOT redirect if it's the /user endpoint
		if (
			error.response?.status === 401 &&
			requestUrl !== "/user" &&
			requestUrl !== "/wishlist" &&
			requestUrl !== "/chat"
		) {
			console.error("Unauthorized! Redirecting to login...");
			window.location.href = "/login";
		}

		return Promise.reject(error);
	}
);

export default API;
