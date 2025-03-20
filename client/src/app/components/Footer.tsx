import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-primary text-primary-foreground">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4">
							About UniMart
						</h3>
						<p className="text-sm">
							UniMart is your one-stop shop for all university
							needs. Connect with student sellers and find great
							deals on campus.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Quick Links
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/about"
									className="text-sm hover:underline">
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-sm hover:underline">
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm hover:underline">
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-sm hover:underline">
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Categories
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/category/textbooks"
									className="text-sm hover:underline">
									Textbooks
								</Link>
							</li>
							<li>
								<Link
									href="/category/electronics"
									className="text-sm hover:underline">
									Electronics
								</Link>
							</li>
							<li>
								<Link
									href="/category/dorm-essentials"
									className="text-sm hover:underline">
									Dorm Essentials
								</Link>
							</li>
							<li>
								<Link
									href="/category/clothing"
									className="text-sm hover:underline">
									Clothing
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Connect With Us
						</h3>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-primary-foreground hover:text-secondary">
								<Facebook size={24} />
							</a>
							<a
								href="#"
								className="text-primary-foreground hover:text-secondary">
								<Twitter size={24} />
							</a>
							<a
								href="#"
								className="text-primary-foreground hover:text-secondary">
								<Instagram size={24} />
							</a>
							<a
								href="#"
								className="text-primary-foreground hover:text-secondary">
								<Linkedin size={24} />
							</a>
						</div>
					</div>
				</div>
				<div className="mt-8 pt-8 border-t border-primary-foreground/10 text-center">
					<p className="text-sm">
						&copy; 2025 UniMart. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
