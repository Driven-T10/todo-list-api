import joi from "joi"

export const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
})

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
})


// USER
// _id
// name
// email
// password