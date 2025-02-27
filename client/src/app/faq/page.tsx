"use client";

// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

const faqs = [
	{
		category: "General",
		questions: [
			{
				question: "What is UniMarket?",
				answer: "UniMarket is a dedicated marketplace platform for university students to buy and sell items within their campus community. It provides a safe, efficient, and sustainable way to trade textbooks, electronics, furniture, and other student essentials.",
			},
			{
				question: "Who can use UniMarket?",
				answer: "UniMarket is available to all verified university students, staff, and faculty members. You need a valid university email address to register.",
			},
			{
				question: "Is UniMarket free to use?",
				answer: "Basic buying and browsing is free for all users. Sellers can choose between different plans, including a free trial option for new sellers.",
			},
		],
	},
	{
		category: "Account & Security",
		questions: [
			{
				question: "How do I create an account?",
				answer: "Simply click the 'Register' button and sign up using your university email address. You'll need to verify your email and complete your profile before you can start buying or selling.",
			},
			{
				question: "How does UniMarket protect my personal information?",
				answer: "We use industry-standard encryption and security measures to protect your data. We never share your personal information with other users without your consent.",
			},
			{
				question: "What should I do if I forget my password?",
				answer: "Click the 'Forgot Password' link on the login page, and we'll send you instructions to reset your password to your registered email address.",
			},
		],
	},
	{
		category: "Buying",
		questions: [
			{
				question: "How do I purchase an item?",
				answer: "Browse listings, click on items you're interested in, and use the 'Chat with Seller' button to discuss the purchase. You can arrange payment and pickup/delivery with the seller directly.",
			},
			{
				question: "What payment methods are accepted?",
				answer: "Payment methods are arranged between buyers and sellers. We recommend using secure payment methods and meeting in safe, public locations for transactions.",
			},
			{
				question: "What if I have issues with my purchase?",
				answer: "Contact the seller first through our messaging system. If you can't resolve the issue, you can report it to our support team for assistance.",
			},
		],
	},
	{
		category: "Selling",
		questions: [
			{
				question: "How do I list an item for sale?",
				answer: "Click the 'Sell' button, fill out the item details, add photos, set your price, and publish your listing. Make sure to provide accurate descriptions and clear photos.",
			},
			{
				question: "What items are not allowed on UniMarket?",
				answer: "Prohibited items include illegal goods, weapons, alcohol, tobacco, prescription drugs, and any items that violate university policies or local laws.",
			},
			{
				question: "How long do listings stay active?",
				answer: "Listings remain active for 30 days by default. You can renew, edit, or remove your listings at any time from your seller dashboard.",
			},
		],
	},
];

export default function FAQPage() {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredFaqs = faqs
		.map((category) => ({
			...category,
			questions: category.questions.filter(
				(q) =>
					q.question
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					q.answer.toLowerCase().includes(searchQuery.toLowerCase())
			),
		}))
		.filter((category) => category.questions.length > 0);

	return (
		<div className="container mx-auto px-4 py-16">
			<h1 className="text-4xl font-bold text-center mb-8">
				Frequently Asked Questions
			</h1>

			{/* Search Bar */}
			<div className="max-w-md mx-auto mb-12 relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search FAQs..."
					className="pl-10"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			{/* FAQ Categories */}
			<div className="grid gap-8 max-w-3xl mx-auto">
				{filteredFaqs.map((category, index) => (
					<div key={index}>
						<h2 className="text-2xl font-bold mb-4">
							{category.category}
						</h2>
						<Accordion type="single" collapsible className="w-full">
							{category.questions.map((faq, faqIndex) => (
								<AccordionItem
									key={faqIndex}
									value={`${index}-${faqIndex}`}>
									<AccordionTrigger>
										{faq.question}
									</AccordionTrigger>
									<AccordionContent>
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				))}
			</div>

			{/* Contact Support */}
			<div className="text-center mt-12">
				<p className="text-muted-foreground">
					Can't find what you're looking for? Contact our support team
					at{" "}
					<a
						href="mailto:support@unimarket.com"
						className="text-primary hover:underline">
						support@unimarket.com
					</a>
				</p>
			</div>
		</div>
	);
}
