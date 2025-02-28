import { v2 as cloudinary } from "cloudinary";
import CONFIG from "../utils/config";
import fs from "fs";

cloudinary.config({
	cloud_name: CONFIG.env.CLOUDINARY_CLOUD_NAME,
	api_key: CONFIG.env.CLOUDINARY_API_KEY,
	api_secret: CONFIG.env.CLOUDINARY_API_SECRET,
});

const generateUniqueId = (): string => {
	const now = new Date();

	// Get date components
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two digits
	const day = String(now.getDate()).padStart(2, "0");

	// Get time components
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");

	// Generate a random 6-digit number
	const randomNum = Math.floor(100000 + Math.random() * 900000);

	// Combine all parts
	return `${year}${month}${day}-${hours}${minutes}${seconds}-${randomNum}`;
};

export const upload = async (files: Express.Multer.File[]) => {
	if (!files || files.length === 0) return undefined;

	const uploadResults = await Promise.all(
		files.map((file) => {
			return new Promise<{
				url: string;
				format: string;
				resource_type: string;
				public_id: string;
			}>((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{ folder: "uploads/products" },
					(error, result) => {
						if (error) {
							console.error("Cloudinary Upload Error:", error);
							reject(error);
						} else if (result) {
							resolve({
								url: result.secure_url,
								format: result.format,
								resource_type: result.resource_type,
								public_id: result.public_id,
							});
						} else {
							reject(
								new Error("Unexpected Cloudinary response.")
							);
						}
					}
				);
				uploadStream.end(file.buffer);
			});
		})
	);

	return uploadResults;
};

export const optimizeUpload = (public_id: string) => {
	// Optimize delivery by resizing and applying auto-format and auto-quality
	const optimizeUrl = cloudinary.url(public_id, {
		fetch_format: "auto",
		quality: "auto",
	});

	return optimizeUrl;
};

export const cropUpload = (public_id: string, width = 200, height = 200) => {
	// Transform the image: auto-crop to square aspect_ratio
	const autoCropUrl = cloudinary.url(public_id, {
		crop: "auto",
		gravity: "auto",
		width,
		height,
	});

	return autoCropUrl;
};
