"use client";

import { useState } from "react";
import Link from "next/link";
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
import { register } from "@/services/auth";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<null | string>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			await register({ email, password });
			router.push("/login");
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred");
			}
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[400px]">
				<CardHeader>
					<CardTitle>Register</CardTitle>
					<CardDescription>Create a new account.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
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
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>
						</div>
						<Button className="w-full mt-4" type="submit">
							Register
						</Button>
					</form>
					{error && (
						<p className="text-red-500 text-center mt-4">{error}</p>
					)}
				</CardContent>
				<CardFooter className="flex justify-center">
					<div className="text-sm">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-blue-600 hover:underline">
							Login
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
