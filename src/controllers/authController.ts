import {Request, Response} from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


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

    try {
        // Get Info
    const {email, password} = req.body;

    // Validation 
    if(!email || password){
        return res.status(400).json({
            error: "Email and Password are require"
        })
    };

    // Check the User 
    const user = await prisma.user.findUnique({
        where:{email}
    })

    if(!user){
        return res.status(401).json({
            error: "Email is incorrect"
        })
    };

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            error:"Password is incorrect"
        })
    };

    // create token
    const token = jwt.sign({userId:user.id}, process.env.JWT_SECRET!, {expiresIn:"7d"})

    const userResponse = {
        id: user.id,
        email:user.email,
        username: user.username,
        createdAt: user.createdAt
    }

    res.status(200).json({
        message:"Login is successful",
        user:userResponse,
        token
    });


    } catch (error) {
        console.error("Login error: ", error)
        res.status(500).json({
            error:"Server error"
        })
        
    }


}

// Get current user info 
export const getCurrentUser = async(req:Request, res:Response) => {

    res.json({message:"GetCurrentUser Function Response"})
}