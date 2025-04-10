import { User } from "@prisma/client";
import Joi from "joi";

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const registrationSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
	oldPassword: Joi.string().required(),
	newPassword: Joi.string().required(),
});

export const verifyUserSchema = Joi.object({
	code: Joi.number().required(),
});

export const forgetPasswordSchema = Joi.object({
	newPassword: Joi.string().required(),
	email: Joi.string().email().required(),
	code: Joi.string().required(),
});

export const initforgetPasswordSchema = Joi.object({
	email: Joi.string().email().required(),
});

export const deleteAccountSchema = Joi.object({
	password: Joi.string().required(),
});

export const RefineUser = (
	user: User & {
		store: {
			id: string;
			name: string;
			description: string;
			customUrl: string | null;
			isActive: boolean;
			isBoosted: boolean | null;
			boostedAt: Date | null;
			boostExpiresAt: Date | null;
		} | null;
	}
) => ({
	id: user.id,
	username: user.username,
	email: user.email,
	verified: user.isVerified,
	roles: user.roles,
	isOnline: user.isOnline,
	lastOnline: user.lastOnline,
	createdAt: user.createdAt,
	store: user.store,
});
