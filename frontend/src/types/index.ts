export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: string;
  }
  
  export interface Post {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    author: User;
  }
  
  export interface AuthResponse {
    message: string;
    user: User;
    token: string;
  }
  
  export interface PostsResponse {
    message: string;
    posts: Post[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      postsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }
  
  export interface CreatePostData {
    title: string;
    content: string;
    published: boolean;
  }
  
  export interface UpdatePostData {
    title?: string;
    content?: string;
    published?: boolean;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    email: string;
    username: string;
    password: string;
  }