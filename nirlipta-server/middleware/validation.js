const Joi = require("joi");

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return res.status(400).json({
                message: "Validation error",
                errors,
            });
        }

        req.body = value;
        next();
    };
};

// Common validation schemas
const schemas = {
    // User registration
    register: Joi.object({
        name: Joi.string().trim().min(2).max(100).optional(),
        email: Joi.string().email().required(),
        username: Joi.string().trim().alphanum().min(3).max(30).optional(),
        phone: Joi.string().trim().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).optional(),
        password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).optional().messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
        gender: Joi.string().valid("male", "female", "other").optional(),
        role: Joi.string().valid("student", "admin").default("student"),
        medical_conditions: Joi.array().items(Joi.string()).default([]),
        dob: Joi.date().max("now").optional(),
    }),

    // Login
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),

    // Workshop creation/update
    workshop: Joi.object({
        title: Joi.string().trim().min(3).max(200).required(),
        description: Joi.string().trim().max(5000).optional(),
        difficulty_level: Joi.string().valid("beginner", "intermediate", "advanced").required(),
        price: Joi.number().positive().required(),
        discount_price: Joi.number().positive().less(Joi.ref("price")).optional(),
        classroom_info: Joi.string().trim().max(500).optional(),
        address: Joi.string().trim().max(500).optional(),
        map_location: Joi.string().uri().optional(),
        category: Joi.string().required(),
        newCategory: Joi.string().trim().min(2).max(100).optional(),
        modules: Joi.alternatives().try(
            Joi.array().items(
                Joi.object({
                    name: Joi.string().trim().min(1).max(200).required(),
                    duration: Joi.number().positive().required(),
                })
            ),
            Joi.string() // Allow JSON string
        ).optional(),
    }),

    // Category creation/update
    category: Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        description: Joi.string().trim().max(1000).optional(),
    }),

    // Password reset
    resetPassword: Joi.object({
        email: Joi.string().email().required(),
    }),

    resetPasswordMobile: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).pattern(/^\d+$/).required(),
        newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
    }),

    // Enrollment
    enrollment: Joi.object({
        workshop_id: Joi.string().required(),
        user_id: Joi.string().optional(), // Usually from token
    }),

    // Payment
    payment: Joi.object({
        type: Joi.string().valid("workshop", "retreat", "accommodation", "booking").required(),
        reference_id: Joi.string().required(),
        amount: Joi.number().positive().required(),
        payment_method: Joi.string().valid("credit_card", "paypal", "bank_transfer", "cash").required(),
        transaction_id: Joi.string().trim().optional(),
        notes: Joi.string().trim().max(1000).optional(),
    }),
};

// Sanitize input to prevent XSS
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === "string") {
            // Remove potentially dangerous characters but keep valid content
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                .trim();
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (obj && typeof obj === "object") {
            const sanitized = {};
            for (const key in obj) {
                sanitized[key] = sanitize(obj[key]);
            }
            return sanitized;
        }
        return obj;
    };

    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query);
    }
    if (req.params) {
        req.params = sanitize(req.params);
    }

    next();
};

module.exports = {
    validate,
    schemas,
    sanitizeInput,
};

