"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { initforgotPassword } from "@/services/auth";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const { user, isLoading } = useAuth();
	const [error, setError] = useState<null | string>();
	const [responseLoading, setResponseLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setResponseLoading(() => true);
		try {
			const response = await initforgotPassword({ email });
			console.log(response);
			setError(null);
		} catch (error) {
			setError(error.message);
		} finally {
			setResponseLoading(() => false);
		}
		setIsSubmitted(true);
	};

	useEffect(() => {
		if (!isLoading && user !== null && user.email) return router.back();
	}, [user]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Forgot Password</CardTitle>
					<CardDescription>
						Enter your email to reset your password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{!isSubmitted ? (
						<form onSubmit={handleSubmit}>
							<div className="grid w-full items-center gap-4">
								<div className="flex flex-col space-y-1.5">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										required
									/>
								</div>
							</div>
							<Button className="w-full mt-4" type="submit">
								Reset Password
							</Button>
						</form>
					) : 
					error ? <p className="text-red-400 text-center">{error}</p> : <p className="text-green-400">An email has been sent to your email address.</p>
					}
				</CardContent>
				<CardFooter className="flex justify-center">
					<Link
						href="/login"
						className="text-sm text-blue-600 hover:underline">
						Back to Login
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
