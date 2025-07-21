import { Router } from "express";
import { createPost, getAllPosts, getMyPosts, getPostById, deletePost,updatePost } from "../controllers/postController";
import { authenticateToken } from "../middleware/auth";

const router = Router()

// Public routes
router.get("/", getAllPosts)    // GET /api/posts
router.get("/:id", getPostById)   // GET /api/posts/:id