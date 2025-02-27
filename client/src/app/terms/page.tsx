import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const sections = [
	{
		title: "1. Acceptance of Terms",
		content: `By accessing and using UniMarket, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.`,
	},
	{
		title: "2. User Eligibility",
		content: `You must be a currently enrolled student, faculty member, or staff of a recognized educational institution to use UniMarket. You must be at least 18 years old or the age of majority in your jurisdiction.`,
	},
	{
		title: "3. Account Registration",
		content: `To use certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.`,
	},
	{
		title: "4. User Conduct",
		content: `You agree not to:
    • Post illegal, harmful, threatening, abusive, or discriminatory content
    • Impersonate any person or entity
    • Post false or misleading information
    • Attempt to gain unauthorized access to other user accounts
    • Use the platform for any illegal or unauthorized purpose`,
	},
	{
		title: "5. Listing Guidelines",
		content: `All listings must:
    • Be accurate and truthful
    • Include clear images of the actual item
    • Specify the condition of the item
    • Not violate any intellectual property rights
    • Not include prohibited items as defined in our policies`,
	},
	{
		title: "6. Transactions",
		content: `UniMarket is a platform that facilitates transactions between users. We:
    • Do not guarantee the quality of items
    • Are not responsible for the completion of transactions
    • Recommend meeting in safe, public locations for in-person transactions
    • Encourage using secure payment methods`,
	},
	{
		title: "7. Privacy",
		content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using UniMarket, you agree to our Privacy Policy.`,
	},
	{
		title: "8. Intellectual Property",
		content: `The platform, including its original content, features, and functionality, is owned by UniMarket and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`,
	},
	{
		title: "9. Termination",
		content: `We reserve the right to terminate or suspend your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.`,
	},
	{
		title: "10. Limitation of Liability",
		content: `UniMarket is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform or any transactions conducted through the platform.`,
	},
	{
		title: "11. Changes to Terms",
		content: `We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform. Your continued use of UniMarket after such modifications constitutes acceptance of the updated terms.`,
	},
	{
		title: "12. Governing Law",
		content: `These terms are governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law principles.`,
	},
];

export default function TermsPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
				<Card>
					<CardContent className="p-6">
						<p className="text-muted-foreground mb-6">
							Last updated: {new Date().toLocaleDateString()}
						</p>
						<ScrollArea className="h-[600px] pr-4">
							<div className="space-y-8">
								{sections.map((section, index) => (
									<div key={index}>
										<h2 className="text-xl font-semibold mb-4">
											{section.title}
										</h2>
										<p className="text-muted-foreground whitespace-pre-line">
											{section.content}
										</p>
										{index < sections.length - 1 && (
											<Separator className="mt-8" />
										)}
									</div>
								))}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
