import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.number().integer().min(6).max(15).required(),
  email: Joi.string().email(),
  isFafourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});
