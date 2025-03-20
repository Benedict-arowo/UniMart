import {
	InternalServerError,
	NotFoundError,
	UnauthorizedError,
} from "../middlewears/error";
import prisma from "../prisma";
import { Req } from "../utils/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class AdsService {
	async getAds({ limit, page }: { limit: number; page: number }) {
		const ads = await prisma.ad.findMany({
			skip: (page - 1) * limit,
			take: limit,
		});
		return ads;
	}

	async getUserAds({
		userId,
		limit,
		page,
	}: {
		userId: string;
		limit: number;
		page: number;
	}) {
		const ads = await prisma.ad.findMany({
			where: { sellerId: userId },
			skip: (page - 1) * limit,
			take: limit,
		});
		return ads;
	}

	async getActiveAds({ limit, page }: { limit: number; page: number }) {
		const ads = await prisma.ad.findMany({
			where: { status: "ACTIVE" }, // Only active ads
			skip: (page - 1) * limit,
			take: limit,
		});
		return ads;
	}

	async getAd(id: string) {
		try {
			const ad = await prisma.ad.findUniqueOrThrow({ where: { id } });
			return ad;
		} catch (error) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				throw new NotFoundError("Ad not found.");
			}
			throw new InternalServerError("Something went wrong.");
		}
	}

	async createAd({ data, user }: { data: any; user: Req["user"] }) {
		const ad = await prisma.ad.create({
			data: { ...data, sellerId: user.id },
		});
		return ad;
	}

	async updateAd({
		id,
		data,
		user,
	}: {
		id: string;
		data: any;
		user: Req["user"];
	}) {
		const ad = await prisma.ad.findUnique({ where: { id } });

		if (!ad) {
			throw new NotFoundError("Ad not found.");
		}

		// Ensure the user is the owner of the ad
		if (ad.sellerId !== user.id) {
			throw new UnauthorizedError(
				"You do not have permission to update this ad."
			);
		}

		const updatedAd = await prisma.ad.update({
			where: { id },
			data,
		});
		return updatedAd;
	}

	async deleteAd({ id, user }: { id: string; user: Req["user"] }) {
		const ad = await prisma.ad.findUnique({ where: { id } });

		if (!ad) {
			throw new NotFoundError("Ad not found.");
		}

		// Ensure the user is the owner of the ad
		if (ad.sellerId !== user.id) {
			throw new UnauthorizedError(
				"You do not have permission to delete this ad."
			);
		}

		await prisma.ad.delete({ where: { id } });
	}
}

export default AdsService;
