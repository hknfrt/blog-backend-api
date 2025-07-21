import { Router } from "express";
import { createPost, getAllPosts, getMyPosts, getPostById, deletePost,updatePost } from "../controllers/postController";
import { authenticateToken } from "../middleware/auth";

const router = Router()

// Public routes
router.get("/", getAllPosts)    // GET /api/posts
router.get("/:id", getPostById)   // GET /api/posts/:id

// Protected routes
router.post('/', authenticateToken, createPost);        // POST /api/posts
router.put('/:id', authenticateToken, updatePost);      // PUT /api/posts/:id  
router.delete('/:id', authenticateToken, deletePost);   // DELETE /api/posts/:id
router.get('/my/posts', authenticateToken, getMyPosts); // GET /api/posts/my/posts

export default router;