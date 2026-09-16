import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export const registerUser = async({
    name,
    email,
    password,
}: RegisterInput) => {
    const existingUser = await User.findOne({
        where: {
            email
        }
    })
    if(existingUser) throw new Error("USER_Already_Exists");

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    }, {
        raw: true
    });
    console.log('user', user)
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    }
}

export const loginUser = async({
    email,
    password
}: LoginInput) => {
    const user = await User.findOne({
        where: {
            email
        }
    })
    if(!user) throw new Error("INVALID_CREDENTIALS")

    const passwordMatches = await bcrypt.compare(password, user.password)
    if(!passwordMatches) throw new Error("INVALID_CREDENTIALS")
    
    const token = jwt.sign({
        userId: user.id,
        email: user.email,
    },
    process.env.JWT_SECRET!,
    {
        expiresIn: "1h"
    })
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
}