import Joi from "joi";

export const createProductSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	price: Joi.number().required(),
	categories: Joi.array().items(Joi.string()).unique().optional(),
	quantity: Joi.number().required(),
	isActive: Joi.boolean().required(),
	discountedPrice: Joi.number().optional(),
});

export const updateProductSchema = Joi.object({
	name: Joi.string().optional(),
	description: Joi.string().optional(),
	price: Joi.number().optional(),
	categories: Joi.array().items(Joi.string()).unique().optional(),
	quantity: Joi.number().optional(),
	isActive: Joi.boolean().optional(),
	discountedPrice: Joi.number().optional(),
	images: Joi.array().optional(),
});

export interface IProduct {
	name: string;
	description: string;
	price: number;
	addToStore: boolean;
	categoryIds: string[];
	quantity: number;
	isActive: boolean;
}
