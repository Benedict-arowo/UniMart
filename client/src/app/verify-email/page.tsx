"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { verifyEmail as verifyEmailService } from "@/services/auth";

export default function VerifyEmailPage() {
	const [isVerifying, setIsVerifying] = useState(true);
	const [isVerified, setIsVerified] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	useEffect(() => {
		const verifyEmail = async () => {
			if (token) {
				try {
					const response = await verifyEmailService(token);
					if (!response.success) throw new Error(response.message);
					setIsVerified(true);
				} catch (error) {
					console.error("Error verifying email:", error);
				} finally {
					setIsVerifying(false);
				}
			} else {
				setIsVerifying(false);
			}
		};

		verifyEmail();
	}, [token]);

	const handleContinue = () => {
		router.push("/profile");
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Email Verification</CardTitle>
					<CardDescription>
						Verifying your email address
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isVerifying ? (
						<p>Verifying your email...</p>
					) : isVerified ? (
						<p className="text-green-600">
							Your email has been successfully verified!
						</p>
					) : (
						<p className="text-red-600">
							Failed to verify your email. The link may be invalid
							or expired.
						</p>
					)}
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						onClick={handleContinue}
						disabled={isVerifying}>
						{isVerified ? "Continue" : "Back"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
