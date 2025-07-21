import {Request, Response} from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Prisma client instance
const prisma = new PrismaClient()

// AuthRequest interface
interface AuthRequest extends Request {
    userId?: string;
}

// Register function
export const register = async (req: Request, res: Response) => {
    try {
        const {email, username, password} = req.body;

        if(!email || !username || !password) {
            return res.status(400).json({
                error: "Email, username and password are required"
            });
        }

        if(password.length < 6){
            return res.status(400).json({
                error: "Password must be at least 6 characters"
            });
        }

        const existingUser = await prisma.user.findFirst({
            where:{
                OR:[
                    {email: email},
                    {username: username}
                ]
            }
        });

        if(existingUser){
            return res.status(400).json({
                error: "This username or email already exists"
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });

        const token = jwt.sign({userId: newUser.id}, process.env.JWT_SECRET!, {expiresIn: "7d"});

        const userResponse = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            message: "User added successfully",
            user: userResponse,
            token
        });

    } catch (error) {
        console.error("Register error: ", error);
        res.status(500).json({
            error: "Server Error"
        });
    }
}

// Login function
export const login = async(req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        // HATA DÜZELTİLDİ: !password yerine !email || !password
        if(!email || !password){
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const user = await prisma.user.findUnique({
            where: {email}
        });

        if(!user){
            // GÜVENLİK: Aynı mesaj (email/password ayırt etme)
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            // GÜVENLİK: Aynı mesaj (email/password ayırt etme)
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: "7d"});

        const userResponse = {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt
        };

        res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token
        });

    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({
            error: "Server Error"
        });
    }
}

// Get current user info 
export const getUser = async(req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if(!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json({
            message: "User info retrieved successfully",
            user
        });

    } catch (error) {
        console.error("GetUser error: ", error);
        res.status(500).json({
            error: "Server Error"
        });
    }
}