import {Request, Response} from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { asyncWrapProviders } from "async_hooks"
import { error } from "console"

// Prisma client instance
const prisma = new PrismaClient()

// Register function
export const register = async (req:Request, res:Response) => {

    try {
        // Get inputs
    const {email, username, password} = req.body;


    // Validation input
    if(!email || !username || !password) {
        return res.status(400).json({
            error: "Email, username and password are require"
        })
    };

    if(password.length<6){
        res.status(400).json({
            error: "Password must be at least 6 characters"
        });
    };

    //Check user is exist
    const existingUser = await prisma.user.findFirst({
        where:{
            OR:[
                {email:email},
                {username: username}
            ]
        }
    });

    if(existingUser){
        return res.status(400).json({
            error:"This username or email already exist"
        });
    };

    // Hash password
    const saltRounds = 10;
    const hashedPassword =  await bcrypt.hash(password, saltRounds);

    // Save to DB
    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            password:hashedPassword
        }
    });

    // Create JWT token
    const token = jwt.sign({userId:newUser.id}, process.env.JTW_SECRET!,{expiresIn: "7d"});

    //Response to Frontend
    const userResponse = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        createdAt: newUser.createdAt
    };

    res.status(201).json({
        message:"User added successfully",
        user: userResponse,
        token
    });

    } catch (error) {
        console.error("Register error: ", error)
        res.status(500).json({
            error:"Server Error"
        });
        
    };
    
}

// Login function
export const login = async(req:Request, res:Response) => {
    
    res.json({message:"Login Function Response"})
}

// Get current user info 
export const getCurrentUser = async(req:Request, res:Response) => {

    res.json({message:"GetCurrentUser Function Response"})
}