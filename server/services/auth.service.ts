import argon from "argon2";
import {
	BadrequestError,
	InternalServerError,
	NotFoundError,
} from "../middlewears/error";
import prisma from "../prisma";
import CONFIG from "../utils/config";
import crypto from "crypto";

class AuthService {
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

			// sendMail to verify the code.
			// Maybe store information about the user eg: IP...
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

		return;
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

		if (user.isDeleted)
			throw new NotFoundError("User account has been deleted.");

		if (!(await argon.verify(user.password, oldPassword)))
			throw new BadrequestError("Invalid password provided.");

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

		await prisma.user.update({
			where: { email },
			data: {
				verificationCode,
				verificationCodeExpiration: new Date(
					new Date().setMinutes(
						CONFIG.env.VERIFICATION_CODE_EXPIRATION +
							new Date().getMinutes()
					)
				),
			},
		});
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

		prisma.user.update({
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

	async deleteAccount(email: string) {
		await prisma.user.update({
			where: { email },
			data: {
				isDeleted: new Date(),
			},
		});

		return;
	}
}

export default AuthService;
