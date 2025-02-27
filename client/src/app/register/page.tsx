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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userType, setUserType] = useState("buyer");
	const [gender, setGender] = useState("");
	const [hostel, setHostel] = useState("");
	const [roomNumber, setRoomNumber] = useState("");
	const [address, setAddress] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send a request to your API to register the user
		console.log("Registration attempt with:", {
			email,
			password,
			userType,
			...(userType === "seller" && {
				gender,
				hostel,
				...(hostel ? { roomNumber } : { address }),
			}),
		});
		// If registration is successful, redirect to the pricing page for sellers
		if (userType === "seller") {
			router.push("/pricing");
		} else {
			// For buyers, redirect to the home page or a welcome page
			router.push("/");
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
							<div className="flex flex-col space-y-1.5">
								<Label>User Type</Label>
								<RadioGroup
									defaultValue="buyer"
									onValueChange={setUserType}>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="buyer"
											id="buyer"
										/>
										<Label htmlFor="buyer">Buyer</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="seller"
											id="seller"
										/>
										<Label htmlFor="seller">Seller</Label>
									</div>
								</RadioGroup>
							</div>
							{userType === "seller" && (
								<>
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="gender">Gender</Label>
										<Select onValueChange={setGender}>
											<SelectTrigger>
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="male">
													Male
												</SelectItem>
												<SelectItem value="female">
													Female
												</SelectItem>
												<SelectItem value="other">
													Other
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="hostel">Hostel</Label>
										<Select onValueChange={setHostel}>
											<SelectTrigger>
												<SelectValue placeholder="Select hostel" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="hostel1">
													Hostel 1
												</SelectItem>
												<SelectItem value="hostel2">
													Hostel 2
												</SelectItem>
												<SelectItem value="none">
													Not staying in a hostel
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									{hostel && hostel !== "none" ? (
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="roomNumber">
												Room Number
											</Label>
											<Input
												id="roomNumber"
												placeholder="Enter your room number"
												value={roomNumber}
												onChange={(e) =>
													setRoomNumber(
														e.target.value
													)
												}
											/>
										</div>
									) : (
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="address">
												Address
											</Label>
											<Input
												id="address"
												placeholder="Enter your address"
												value={address}
												onChange={(e) =>
													setAddress(e.target.value)
												}
											/>
										</div>
									)}
								</>
							)}
						</div>
						<Button className="w-full mt-4" type="submit">
							Register
						</Button>
					</form>
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
