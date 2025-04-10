import Joi from "joi";

export const createReviewSchema = Joi.object({
	content: Joi.string().min(3),
	rating: Joi.number().max(5).min(0),
});
