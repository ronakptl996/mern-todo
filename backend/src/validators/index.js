import Joi from "joi";

const addTaskValidator = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().min(10).max(500).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 500 characters",
    "any.required": "Description is required",
  }),
  status: Joi.string().valid("to-do", "progress", "done").required().messages({
    "any.only": "Status must be one of: to-do, progress, done",
    "any.required": "Status is required",
  }),
});

const updateTaskValidate = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "ID must be a valid 24-character hexadecimal string",
      "string.empty": "ID is required",
    }),
});

export { addTaskValidator, updateTaskValidate };
