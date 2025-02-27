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
	const uploadResults = await Promise.all(
		files.map(async (file) => {
			const tempPath = `./uploads/${Date.now()}-${file.originalname}`;
			fs.writeFileSync(tempPath, file.buffer);
			const result = await cloudinary.uploader.upload(tempPath, {
				folder: "uploads/products",
			});
			fs.unlinkSync(tempPath); // Delete temp file after upload
			console.log(result);
			return result.secure_url;
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
