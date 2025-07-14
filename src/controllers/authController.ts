import {Request, Response} from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { asyncWrapProviders } from "async_hooks"

// Prisma client instance
const prisma = new PrismaClient()

//Register function
export const register = async (req:Request, res:Response) => {

    res.json({message:"Register Function Response"})
}

//Login function
export const login = async(req:Request, res:Response) => {
    
    res.json({message:"Login Function Response"})
}

//Get current user info 
export const getCurrentUser = async(req:Request, res:Response) => {

    res.json({message:"GetCurrentUser Function Response"})
}