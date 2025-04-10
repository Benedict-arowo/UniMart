"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, Mail } from "lucide-react";
import { resendVerificationCode } from "@/services/auth";

export default function EmailVerificationBanner() {
	const { user } = useAuth();
	const [isVisible, setIsVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (user && !user.verified) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, [user]);

	const handleVerify = async () => {
		setLoading(true);
		setError(null);
		try {
			await resendVerificationCode();
			setEmailSent(true);
		} catch (error: any) {
			setError("Failed to send verification email. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (!isVisible) return null;

	return (
		<div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-3 py-1 flex items-center justify-between rounded-md shadow-md w-full max-w-3xl mx-auto mt-4 fixed z-50 right-0 left-0">
			{emailSent ? (
				<div className="flex items-center gap-2 text-green-700 text-sm">
					<CheckCircle size={18} />
					<p>Email sent! Check your inbox and spam folder.</p>
				</div>
			) : (
				<div className="flex items-center gap-3">
					<Mail className="text-yellow-600" size={22} />

					<p className="text-sm">
						<strong>Email Not Verified:</strong> Please verify your
						email to access all features.
					</p>
				</div>
			)}

			<div className="flex items-center gap-3">
				{!emailSent && (
					<Button
						onClick={handleVerify}
						disabled={loading}
						variant="outline"
						className="text-sm">
						{loading ? "Sending..." : "Resend Email"}
					</Button>
				)}

				<button
					onClick={() => setIsVisible(false)}
					className="text-yellow-600 hover:text-yellow-800">
					<X size={20} />
				</button>
			</div>
		</div>
	);
}
