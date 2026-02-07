import joi from "joi";

export const validateRegisterInput = (data) => {
    const schema = joi.object({
        username: joi.string().min(6).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    })

    return schema.validate(data)
} 