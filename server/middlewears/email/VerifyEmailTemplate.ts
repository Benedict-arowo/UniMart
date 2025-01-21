import { EmailOptions } from ".";

const VerifyEmailTemplate = ({
	user,
	code,
	codeExpiresAt,
}: IEmailTemplate): EmailOptions => {
	const subject = "Verify your email address || Marketplace";
	const text = `Code expires in ${codeExpiresAt.toString()}`;
	const html =
		"<div style='background-color: #f4f4f4; padding: 20px;'><h1 style='color: #333;'>Hello, " +
		user.username +
		"</h1><p style='color: #333;'>Please verify your email address by entering the following code: <strong>" +
		code +
		"</strong></p><p style='color: #333;'>If you did not request this code, please ignore this email.</p></div>";

	return { to: user.email, subject, text, html };
};

interface IEmailTemplate {
	user: { username: string; email: string };
	code: number;
	codeExpiresAt: Date;
}

export default VerifyEmailTemplate;
