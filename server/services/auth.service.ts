import argon from "argon2";
import {
	BadrequestError,
	InternalServerError,
	NotFoundError,
} from "../middlewears/error";
import prisma from "../prisma";
import CONFIG from "../utils/config";
import crypto from "crypto";
import EmailService from "../middlewears/email";
import VerifyEmailTemplate from "../middlewears/email/VerifyEmailTemplate";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { RefineUser } from "../middlewears/validator/auth.validator";

class AuthService {
	emailService = new EmailService();

	async createUser({
		email,
		password,
		username,
	}: {
		email: string;
		password: string;
		username: string;
	}) {
		try {
			const verificationCode = Math.floor(Math.random() * 10000);
			const user = await prisma.user.create({
				data: {
					email,
					password: await argon.hash(password),
					username,
					isVerified: false,
					verificationCode,
					roles: {
						set: ["BUYER"],
					},
					verificationCodeExpiration: new Date(
						new Date().setMinutes(
							CONFIG.env.VERIFICATION_CODE_EXPIRATION +
								new Date().getMinutes()
						)
					),
				},
			});

			if (CONFIG.env.SEND_EMAILS)
				await this.emailService.sendEmail(
					VerifyEmailTemplate({
						user: { username: user.username, email: user.email },
						code: verificationCode,
						codeExpiresAt: user.verificationCodeExpiration!,
					})
				);
			else
				throw new InternalServerError(
					"Emails are currently disabled, please contact an administrator."
				);

			// TODO: Maybe store information about the user eg: IP...
		} catch (error: any) {
			if (error.code && error.code === "P2002")
				throw new BadrequestError("User already exists.");
			throw new InternalServerError(
				error.message || "Something went wrong."
			);
		}
	}

	async loginUser({ email, password }: { email: string; password: string }) {
		const user = await prisma.user.findUniqueOrThrow({ where: { email } });

		if (user.isDeleted)
			throw new NotFoundError("User account has been deleted.");

		if (!(await argon.verify(user.password, password)))
			throw new BadrequestError("Invalid password provided.");

		const access_token = this.generateToken(user, "ACCESS");
		const refresh_token = this.generateToken(user, "REFRESH");
		return { access_token, refresh_token, user: RefineUser(user) };
	}

	generateToken(user: User, type: "REFRESH" | "ACCESS") {
		const secret =
			type === "REFRESH"
				? CONFIG.env.REFRESH_TOKEN_SECRET
				: CONFIG.env.ACCESS_TOKEN_SECRET;
		const expiresIn =
			type === "REFRESH"
				? CONFIG.env.REFRESH_TOKEN_EXPIRATION
				: CONFIG.env.ACCESS_TOKEN_EXPIRATION;

		const payload = {
			id: user.id,
			email: user.email,
			roles: user.roles,
		};

		const token = jwt.sign(payload, secret, {
			expiresIn,
		});

		return token;
	}

	async changePassword({
		email,
		oldPassword,
		newPassword,
	}: {
		email: string;
		oldPassword: string;
		newPassword: string;
	}) {
		const user = await prisma.user.findUniqueOrThrow({
			where: { email: email },
		});

		if (user.isDeleted) {
			throw new NotFoundError("User account has been deleted.");
		}

		if (!(await argon.verify(user.password, oldPassword))) {
			throw new BadrequestError("Invalid password provided.");
		}

		await prisma.user.update({
			where: { email },
			data: {
				password: await argon.hash(newPassword),
			},
		});
	}

	async initForgetPassword(email: string) {
		const user = await prisma.user.findUniqueOrThrow({
			where: { email },
		});

		if (user.isDeleted)
			throw new NotFoundError("User account has been deleted.");

		const code = await argon.hash(crypto.randomBytes(32).toString("hex"));
		await prisma.user.update({
			where: { email },
			data: {
				resetPasswordToken: code,
				resetPasswordTokenExpires: new Date(
					new Date().setMinutes(
						CONFIG.env.PASSWORD_CODE_EXPIRATION +
							new Date().getMinutes()
					)
				),
			},
		});

		return;
	}

	async resendVerificationCode(email: string) {
		const user = await prisma.user.findUniqueOrThrow({
			where: { email },
		});

		if (user.isDeleted)
			throw new NotFoundError("User account has been deleted.");

		if (user.isVerified)
			throw new BadrequestError("User is already verified.");

		const verificationCode = Math.floor(Math.random() * 10000);

		if (CONFIG.env.SEND_EMAILS) {
			const verificationCodeExpiration = new Date(
				new Date().setMinutes(
					CONFIG.env.VERIFICATION_CODE_EXPIRATION +
						new Date().getMinutes()
				)
			);

			await prisma.user.update({
				where: { email },
				data: {
					verificationCode,
					verificationCodeExpiration,
				},
			});

			await this.emailService.sendEmail(
				VerifyEmailTemplate({
					user: { username: user.username, email: user.email },
					code: verificationCode,
					codeExpiresAt: verificationCodeExpiration,
				})
			);
		} else
			throw new InternalServerError(
				"Emails are currently disabled, please contact an administrator."
			);
	}

	async verifyUser({ email, code }: { email: string; code: number }) {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email,
			},
		});

		if (user.isDeleted)
			throw new NotFoundError("User account has been deleted.");

		if (user.isVerified)
			throw new BadrequestError("User is already verified");

		if (user.verificationCode !== code)
			throw new BadrequestError("Invalid code provided.");

		if (
			user.verificationCodeExpiration &&
			user.verificationCodeExpiration < new Date()
		)
			throw new BadrequestError("Verification Code expired");

		await prisma.user.update({
			where: {
				email,
			},
			data: {
				isVerified: true,
				verificationCode: null,
				verificationCodeExpiration: null,
			},
		});

		return;
	}

	async forgetPassword({
		email,
		code,
		newPassword,
	}: {
		email: string;
		code: string;
		newPassword: string;
	}) {
		const user = await prisma.user.findUniqueOrThrow({ where: { email } });

		if (user.isDeleted)
			throw new NotFoundError("User account has been deleted.");

		if (
			user.resetPasswordTokenExpires &&
			user.resetPasswordTokenExpires < new Date()
		)
			throw new BadrequestError("Verification Code expired");

		if (
			!user.resetPasswordToken ||
			!(await argon.verify(user.resetPasswordToken, code))
		)
			throw new BadrequestError("Invalid verification code provided.");

		await prisma.user.update({
			where: { email },
			data: {
				password: await argon.hash(newPassword),
				resetPasswordToken: undefined,
				resetPasswordTokenExpires: undefined,
			},
		});
	}

	async deleteAccount(email: string, password: string) {
		const user = await prisma.user.findUniqueOrThrow({ where: { email } });

		if (user.isDeleted)
			throw new NotFoundError("User account has been deleted.");

		if (!(await argon.verify(user.password, password)))
			throw new BadrequestError("Invalid password provided.");

		await prisma.user.update({
			where: { email },
			data: {
				isDeleted: new Date(),
			},
		});

		// send mail (30d before its fully deleted)

		return;
	}
}

export default AuthService;
