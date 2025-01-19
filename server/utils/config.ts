require("dotenv").config({
	path: ".env",
});

import { cleanEnv, str, port, bool, num } from "envalid";

const env = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ["development", "production", "test"] }),
	PORT: port({ default: 8000 }),
	DATABASE_URL: str(),
	DEBUG_MODE: bool({ default: false }),
	ROUTE_PREFIX: str({ default: "/api" }),
	MAIL_SERVICE: str(),
	MAIL_HOST: str(),
	MAIL_PORT: port(),
	MAIL_SECURE: bool(),
	MAIL_AUTH_USERNAME: str(),
	MAIL_AUTH_PASSWORD: str(),
	VERIFICATION_CODE_EXPIRATION: num({ default: 5 }), // In minutes
	PASSWORD_CODE_EXPIRATION: num({ default: 5 }), // In minutes
});

const CONFIG = {
	env,
};

export default CONFIG;
