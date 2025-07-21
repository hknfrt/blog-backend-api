import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

//AuthRequest interface(For JWT middleware)
interface AuthRequest extends Request {
    userId?:string;
}

// Create new post
export const createPost = async (req: AuthRequest, res: Response) => {
    // Burayı sonraki adımda dolduracağız
    res.json({ message: "Create post function - henüz boş" });
};

// Get all posts (public - herkes görebilir)
export const getAllPosts = async (req: Request, res: Response) => {
    // Burayı sonraki adımda dolduracağız
    res.json({ message: "Get all posts function - henüz boş" });
};

// Get single post by ID (public)
export const getPostById = async (req: Request, res: Response) => {
    // Burayı sonraki adımda dolduracağız
    res.json({ message: "Get post by ID function - henüz boş" });
};

// Update post (sadece yazı sahibi)
export const updatePost = async (req: AuthRequest, res: Response) => {
    // Burayı sonraki adımda dolduracağız
    res.json({ message: "Update post function - henüz boş" });
};

// Delete post (sadece yazı sahibi)
export const deletePost = async (req: AuthRequest, res: Response) => {
    // Burayı sonraki adımda dolduracağız
    res.json({ message: "Delete post function - henüz boş" });
};

// Get current user's posts (kendi yazılarını getir)
export const getMyPosts = async (req: AuthRequest, res: Response) => {
    // Burayı sonraki adımda dolduracağız
    res.json({ message: "Get my posts function - henüz boş" });
};