"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			toast({
				title: "Message sent successfully!",
				description: "We'll get back to you as soon as possible.",
			});

			// Reset form
			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
		} catch {
			toast({
				title: "Error sending message",
				description: "Please try again later.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Contact Us</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Have questions about UniMarket? We're here to help! Choose
					your preferred way to reach us.
				</p>
			</div>

			<div className="grid md:grid-cols-3 gap-8 mb-12">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Phone className="mr-2 h-5 w-5 text-primary" />
							Phone
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Mon-Fri from 8am to 5pm</p>
						<p className="font-semibold">+234 123 456 7890</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Mail className="mr-2 h-5 w-5 text-primary" />
							Email
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p>We'll respond within 24 hours</p>
						<p className="font-semibold">support@unimarket.com</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<MapPin className="mr-2 h-5 w-5 text-primary" />
							Office
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Student Union Building</p>
						<p className="font-semibold">University Campus</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				<Card>
					<CardHeader>
						<CardTitle>Send us a Message</CardTitle>
						<CardDescription>
							Fill out the form below and we'll get back to you as
							soon as possible.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									placeholder="Your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="subject">Subject</Label>
								<Select
									value={subject}
									onValueChange={setSubject}
									required>
									<SelectTrigger>
										<SelectValue placeholder="Select a subject" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="general">
											General Inquiry
										</SelectItem>
										<SelectItem value="support">
											Technical Support
										</SelectItem>
										<SelectItem value="billing">
											Billing Question
										</SelectItem>
										<SelectItem value="feedback">
											Feedback
										</SelectItem>
										<SelectItem value="other">
											Other
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="message">Message</Label>
								<Textarea
									id="message"
									placeholder="Your message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className="min-h-[150px]"
									required
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isSubmitting}>
								{isSubmitting ? (
									"Sending..."
								) : (
									<>
										<Send className="mr-2 h-4 w-4" /> Send
										Message
									</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Office Hours</CardTitle>
						<CardDescription>
							When you can visit us on campus
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-start space-x-4">
								<Clock className="h-5 w-5 text-primary mt-1" />
								<div>
									<h3 className="font-semibold">
										Regular Hours
									</h3>
									<p>Monday - Friday: 8:00 AM - 5:00 PM</p>
									<p>Saturday: 9:00 AM - 2:00 PM</p>
									<p>Sunday: Closed</p>
								</div>
							</div>

							<div className="flex items-start space-x-4">
								<MapPin className="h-5 w-5 text-primary mt-1" />
								<div>
									<h3 className="font-semibold">Location</h3>
									<p>Student Union Building</p>
									<p>2nd Floor, Room 205</p>
									<p>University Campus</p>
									<p>Lagos, Nigeria</p>
								</div>
							</div>

							{/* Map placeholder - In a real app, you'd integrate with Google Maps or similar */}
							<div className="aspect-video mt-4 bg-muted rounded-lg flex items-center justify-center">
								<MapPin className="h-8 w-8 text-muted-foreground" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="mt-12 text-center">
				<h2 className="text-2xl font-bold mb-4">
					Frequently Asked Questions
				</h2>
				<p className="text-muted-foreground">
					Can't find what you're looking for? Check our{" "}
					<a href="/faq" className="text-primary hover:underline">
						FAQ page
					</a>{" "}
					for quick answers to common questions.
				</p>
			</div>
		</div>
	);
}
