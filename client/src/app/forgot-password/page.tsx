"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { forgotPassword, initforgotPassword } from "@/services/auth";

export default function ForgotPasswordPage() {
	const [stage, setStage] = useState<1 | 2>(1);
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);
	const [resendSuccess, setResendSuccess] = useState(false);
	const router = useRouter();

	const handleInitiateForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await initforgotPassword({ email });
			setStage(2);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}

		try {
            await forgotPassword({password: newPassword, code, email});
			setSuccess(true);
			setTimeout(() => router.push("/login"), 3000);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleResendEmail = async () => {
		setResendLoading(true);
		setError(null);
		setResendSuccess(false);

		try {
			await initforgotPassword({ email });
			setResendSuccess(true);
		} catch (error) {
			setError(error.message);
		} finally {
			setResendLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[450px]">
				<CardHeader>
					<CardTitle>
						{stage === 1 ? "Forgot Password" : "Reset Password"}
					</CardTitle>
					<CardDescription>
						{stage === 1
							? "Enter your email to receive a reset code."
							: "Enter the code sent to your email and set a new password."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{success ? (
						<p className="text-green-500 text-center">
							Password reset successfully! Redirecting to login...
						</p>
					) : stage === 1 ? (
						<form onSubmit={handleInitiateForgotPassword}>
							<div className="flex flex-col space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							{error && (
								<p className="text-red-500 text-center mt-2">
									{error}
								</p>
							)}
							<Button
								className="w-full mt-4"
								type="submit"
								disabled={loading}>
								{loading ? "Sending..." : "Send Reset Code"}
							</Button>
						</form>
					) : (
						<form
							onSubmit={handleResetPassword}
							className="flex flex-col gap-3">
							<div className="flex flex-col space-y-2">
								<Label htmlFor="code">Verification Code</Label>
								<Input
									id="code"
									type="text"
									placeholder="Enter code"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									required
								/>
							</div>
							<div className="flex flex-col space-y-2">
								<Label htmlFor="newPassword">
									New Password
								</Label>
								<Input
									id="newPassword"
									type="password"
									placeholder="Enter new password"
									value={newPassword}
									onChange={(e) =>
										setNewPassword(e.target.value)
									}
									required
								/>
							</div>
							<div className="flex flex-col space-y-2">
								<Label htmlFor="confirmPassword">
									Confirm Password
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Confirm new password"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									required
								/>
							</div>
							{error && (
								<p className="text-red-500 text-center mt-2">
									{error}
								</p>
							)}
							<Button
								className="w-full mt-4"
								type="submit"
								disabled={loading}>
								{loading ? "Resetting..." : "Reset Password"}
							</Button>

							<div className="mt-4 text-center">
								<p>Didn’t receive a code?</p>
								<Button
									variant="link"
									className="text-blue-600"
									onClick={handleResendEmail}
									disabled={resendLoading}>
									{resendLoading
										? "Resending..."
										: "Resend Code"}
								</Button>
								{resendSuccess && (
									<p className="text-green-500 text-center">
										New code sent to your email!
									</p>
								)}
							</div>
						</form>
					)}
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button
						variant="link"
						onClick={() => router.push("/login")}>
						Back to Login
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
