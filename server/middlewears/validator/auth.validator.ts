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
	password: Joi.string().required(),
});

export const deleteAccountSchema = Joi.object({
	password: Joi.string().required(),
});

export const RefineUser = (user: User) => ({
	id: user.id,
	username: user.username,
	email: user.email,
	verified: user.isVerified,
	roles: user.roles,
});
