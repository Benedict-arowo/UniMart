import nodemailer, { Transporter } from "nodemailer";
import CONFIG from "../../utils/config";

export interface EmailOptions {
	to: string | string[]; // Recipient(s) email address
	subject: string; // Email subject
	text?: string; // Plain text body
	html?: string; // HTML body (optional)
	from?: string; // Sender email address (optional)
}

class EmailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: CONFIG.env.MAIL_SERVICE,
			host: CONFIG.env.MAIL_HOST,
			port: CONFIG.env.MAIL_PORT,
			secure: CONFIG.env.MAIL_SECURE,
			auth: {
				user: CONFIG.env.MAIL_AUTH_USERNAME,
				pass: CONFIG.env.MAIL_AUTH_PASSWORD,
			},
		});
	}

	public async sendEmail(options: EmailOptions): Promise<void> {
		const { to, subject, text, html, from } = options;

		const mailOptions = {
			from: from,
			to,
			subject,
			text,
			html,
		};

		try {
			await this.transporter.sendMail(mailOptions);
			console.log("Email sent successfully");
		} catch (error: any) {
			console.error("Failed to send email", error.message);
			throw new Error("Failed to send email");
		}
	}
}

export default EmailService;
