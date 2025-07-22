import { apiClient } from './api';
import { PostsResponse, Post, CreatePostData, UpdatePostData } from '@/types';

export const postsApi = {
  // Get all posts (public)
  getAllPosts: async (page = 1, limit = 10): Promise<PostsResponse> => {
    const response = await apiClient.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single post (public)
  getPost: async (id: string): Promise<{ post: Post; message: string }> => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  // Get my posts (protected)
  getMyPosts: async (page = 1, limit = 10, published?: boolean): Promise<PostsResponse & { stats: { totalPosts: number; publishedPosts: number; draftPosts: number } }> => {
    let url = `/posts/my/posts?page=${page}&limit=${limit}`;
    if (published !== undefined) {
      url += `&published=${published}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // Create post (protected)
  createPost: async (data: CreatePostData): Promise<{ post: Post; message: string }> => {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },

  // Update post (protected)
  updatePost: async (id: string, data: UpdatePostData): Promise<{ post: Post; message: string }> => {
    const response = await apiClient.put(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post (protected)
  deletePost: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },
};