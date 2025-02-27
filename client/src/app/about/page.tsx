import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingBag, Shield, GraduationCap } from "lucide-react";

const stats = [
	{ label: "Active Users", value: "10,000+", icon: Users },
	{ label: "Products Listed", value: "50,000+", icon: ShoppingBag },
	{ label: "Universities", value: "50+", icon: GraduationCap },
	{ label: "Secure Transactions", value: "100,000+", icon: Shield },
];

const teamMembers = [
	{
		name: "Sarah Johnson",
		role: "Founder & CEO",
		image: "/placeholder.svg?height=200&width=200",
		bio: "Former student who experienced firsthand the need for a better campus marketplace.",
	},
	{
		name: "Michael Chen",
		role: "Head of Operations",
		image: "/placeholder.svg?height=200&width=200",
		bio: "Operations expert with 5 years of experience in e-commerce platforms.",
	},
	{
		name: "Aisha Patel",
		role: "Community Manager",
		image: "/placeholder.svg?height=200&width=200",
		bio: "Passionate about building strong student communities and sustainable practices.",
	},
];

export default function AboutPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			{/* Hero Section */}
			<section className="text-center mb-16">
				<h1 className="text-4xl font-bold mb-4">About UniMarket</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Connecting university students through a safe, efficient,
					and sustainable marketplace platform.
				</p>
			</section>

			{/* Mission Section */}
			<section className="grid md:grid-cols-2 gap-12 items-center mb-16">
				<div>
					<h2 className="text-3xl font-bold mb-4">Our Mission</h2>
					<p className="text-lg text-muted-foreground mb-6">
						UniMarket was founded with a simple mission: to make
						buying and selling within university communities easier,
						safer, and more sustainable. We believe in:
					</p>
					<ul className="space-y-4">
						<li className="flex items-start">
							<Badge variant="secondary" className="mt-1 mr-2">
								1
							</Badge>
							<span>
								Creating a trusted community marketplace for
								students
							</span>
						</li>
						<li className="flex items-start">
							<Badge variant="secondary" className="mt-1 mr-2">
								2
							</Badge>
							<span>
								Promoting sustainability through local buying
								and selling
							</span>
						</li>
						<li className="flex items-start">
							<Badge variant="secondary" className="mt-1 mr-2">
								3
							</Badge>
							<span>
								Supporting student entrepreneurs and small
								businesses
							</span>
						</li>
					</ul>
				</div>
				<div className="relative h-[400px]">
					<Image
						src="/placeholder.svg?height=400&width=600"
						alt="Students using UniMarket"
						fill
						className="object-cover rounded-lg"
					/>
				</div>
			</section>

			{/* Stats Section */}
			<section className="mb-16">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{stats.map((stat, index) => (
						<Card key={index}>
							<CardContent className="flex flex-col items-center justify-center p-6">
								<stat.icon className="h-8 w-8 mb-2 text-primary" />
								<p className="text-2xl font-bold">
									{stat.value}
								</p>
								<p className="text-sm text-muted-foreground">
									{stat.label}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Team Section */}
			<section>
				<h2 className="text-3xl font-bold text-center mb-8">
					Meet Our Team
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{teamMembers.map((member, index) => (
						<Card key={index}>
							<CardContent className="p-6">
								<div className="relative w-32 h-32 mx-auto mb-4">
									<Image
										src={member.image || "/placeholder.svg"}
										alt={member.name}
										fill
										className="object-cover rounded-full"
									/>
								</div>
								<h3 className="text-xl font-bold text-center mb-1">
									{member.name}
								</h3>
								<p className="text-primary text-center mb-3">
									{member.role}
								</p>
								<p className="text-muted-foreground text-center">
									{member.bio}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
