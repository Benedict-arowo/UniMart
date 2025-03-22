import API from "@/middlewear/axios";

export const getActiveAds = async () => {
    try {
        const response = await API.get("/ads/active");
        return response.data;
    } catch (error: any) {
        console.error(
            "Error fetching user:",
            error?.response?.data?.message || "Unknown error"
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch ads."
        );
    }
};