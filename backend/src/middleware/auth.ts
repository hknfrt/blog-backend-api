import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient()

// Extends type of Request

interface AuthRequest extends Request {

    userId?:string;
}

export const authenticateToken = async(req:AuthRequest, res:Response, next: NextFunction) =>{
    
    try {
        
        // Get authorization header
        const authHeader = req.headers.authorization;
        
        if(!authHeader){
            return res.status(401).json({
                error:"Token is required"
            })
        };


        // Convert 'Bearer Token' to token format
        const token = authHeader.split(' ')[1];
        
        if(!token) {
            return res.status(401).json({
                error: "Token format is wrong"
            })
        };
      
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string}
        
        // Check user if it is existing
        const user = await prisma.user.findUnique({
            where:{id:decoded.userId}
        })

        if(!user){
            return res.status(401).json({
                error:"Wrong token"
            })
        };

        req.userId = decoded.userId

        next()


    } catch (error) {
        console.error("Token verification error: ", error)

        //JWT specific errors
        if(error instanceof jwt.JsonWebTokenError){
            return res.status(401).json({
                error:"Token is expired"
            })
        };
        return res.status(500).json({
            error:"Server error"
        });
        
    };
};