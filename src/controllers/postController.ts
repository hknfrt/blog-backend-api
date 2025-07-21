import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

//AuthRequest interface(For JWT middleware)
interface AuthRequest extends Request {
    userId?:string;
}

// Create new post
export const createPost = async (req: AuthRequest, res: Response) => {
   try {
    const {title, content, published} = req.body;
    const userId = req.userId; // this comes from middleware
    
    // Validation
    if(!title || !content) {
        return res.status(400).json({
            error:"Title and content are required"
        });
    }

    if(title.trim().length<3){
        return res.status(400).json({
            error:"Title must be at least 3 characters"
        });
    }
    
    if(content.trim().length <10){
        return res.status(400).json({
            error:"Content must be at least 10 characters"
        });
    }

    // Create post
    const newPost = await prisma.post.create({
        data:{
            title: title.trim(),
            content: content.trim(),
            published: published || false, // Default: false(draft)
            authorId: userId!
        },
        include:{
            author:{
                select:{
                    id:true,
                    username:true,
                    email:true
                }
            }
        }
    });

    res.status(201).json({
        message:"Post create succsessfully",
        post: newPost
    })

   } catch (error) {
    console.error("Create post error: ", error)
    res.status(500).json({
        error:"Server Error"
    })
    
   }
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