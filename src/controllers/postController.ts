import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";


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
   try {
     // Query parameters(for pages)
     const page = parseInt(req.query.page as string) || 1;
     const limit = parseInt(req.query.limit as string) || 10;
     const skip = (page-1)*limit;

     // Get published posts with author info
     const posts = await prisma.post.findMany({
        where:{
            published:true // only published articles/posts
        }, include:{
            author:{
                select:{
                    id:true,
                    username:true,
                    email:true
                }
            }
        },orderBy:{
            createdAt:"desc" // newest to the top
        },
        skip:skip, // for pages
        take:limit // for pages
     });

     // Total count (total post number)
     const totalPosts = await prisma.post.count({
        where:{
            published:true
        }
     });

     // Pagination info
     const totalPages = Math.ceil(totalPosts/limit);
     const hasNextPage = page<totalPages;
     const hasPreviousPage = page>1;
     
     res.status(200).json({
        message:"Posts retrieved successfully",
        posts,
        pagination:{
            currentPage:page,
            totalPages,
            totalPosts,
            postsPerPage: limit,
            hasNextPage,
            hasPreviousPage
        }
     });

   } catch (error) {
    console.error("Gel all posts error: ", error);
    res.status(500).json({
        error: "Server Error"
    }); 
   }
};

// Get single post by ID (public)
export const getPostById = async (req: Request, res: Response) => {
   try {
     const {id} = req.params; // Get post ID from URL

     // Input validation
     if(!id) {
        return res.status(400).json({
            error:"Post ID is required"
        });
     }

     // Find post by ID
     const post = await prisma.post.findUnique({
        where:{id},
        include:{
            author:{
                select:{
                    id:true,
                    username:true,
                    email:true,
                    createdAt:true
                }
            }
        }
     });


     if(!post) {
        return res.status(404).json({
            error:"Post not found"
        });
     }

     res.status(200).json({
        message:"Post retrieved successfully",
        post
     })

   } catch (error) {
    console.log("Get post by ID error: ", error)

    // Prisma error
    if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code ==="P2023"){
            return res.status(400).json({
                error:"Invalid post ID format"
            });
        }

    }
    
    res.status(500).json({
        error:"Server Error"
    });
    
   }
};

// Update post (sadece yazı sahibi)
export const updatePost = async (req: AuthRequest, res: Response) => {
   try {

    const {id} = req.params; // Post ID
    const userId = req.userId;
    const {title, content, published} = req.body;

    if(!id){
        return res.status(400).json({
            error:"Post ID is required"
        });
    }

    // Find post
    const existingPost =  await prisma.post.findUnique({
        where:{id}
    });

    if(!existingPost){
        return res.status(404).json({
            error:"Post not found"
        });
    }

    // AUTHORIZATION: Only post owner can edit
    if(existingPost.authorId !==userId){
        return res.status(403).json({
            error:"You can only edit your own posts"
        });
    }

    // Validation
    if(title !== undefined){
        if(typeof content !== "string" || content.trim().length<10){
            return res.status(400).json({
                error:"Content must be at least 10 characters"
            });
        }
    }

    if(published !== undefined){
        if(typeof published !== "boolean"){
            return res.status(400).json({
                error:"Published field must be boolean"
            });
        }
    }

    // Make data ready to update
    const updateData:any ={};
    
    if (title !== undefined) {
        updateData.title = title.trim();
    }
    
    if (content !== undefined) {
        updateData.content = content.trim();
    }
    
    if (published !== undefined) {
        updateData.published = published;
    }

    // If there is no data
    if(Object.keys(updateData).length===0){
        return res.status(400).json({
            error: "At least one field  (title, content or published) is required"
        });
    }

    // Update post
    const updatePost = await prisma.post.update({
        where:{id},
        data:updateData,
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

    res.status(200).json({
        message:"Post updated successfully",
        post:updatePost
    })
    
   } catch (error) {

    console.error("Update post error: ", error)

    if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code ==="P2023"){
            return res.status(400).json({
                error:"Invalid post ID format"
            });
        }

        if(error.code ==="P2025"){
            return res.status(404).json({
                error:"Post not found"
            });
        }
    }

    res.status(500).json({
        error:"Server Error"
    })
    
   }
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