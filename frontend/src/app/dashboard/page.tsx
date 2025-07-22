'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Navbar from '@/app/components/Navbar';
import PostCard from '@/app/components/PostCard';
import { useAuthStore } from '@/store/authStore';
import { postsApi } from '@/lib/posts';
import { Post } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<boolean | undefined>(undefined);

  const fetchPosts = async (page = 1, published?: boolean) => {
    try {
      setIsLoading(true);
      const response = await postsApi.getMyPosts(page, 10, published);
      setPosts(response.posts);
      setStats(response.stats);
      setPagination(response.pagination);
    } catch (error: any) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, filter);
  }, [filter]);

  const handleEdit = (post: Post) => {
    router.push(`/dashboard/edit/${post.id}`);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsApi.deletePost(postId);
      // Refresh posts list
      fetchPosts(pagination.currentPage, filter);
    } catch (error: any) {
      alert('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage, filter);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your blog posts and create new content.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.publishedPosts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.draftPosts}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter(undefined)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === undefined
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Posts ({stats.totalPosts})
              </button>
              <button
                onClick={() => setFilter(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === true
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Published ({stats.publishedPosts})
              </button>
              <button
                onClick={() => setFilter(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === false
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Drafts ({stats.draftPosts})
              </button>
            </div>

            <button
              onClick={() => router.push('/dashboard/new')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              New Post
            </button>
          </div>

          {/* Posts List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-xl text-red-600">{error}</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">No posts found</div>
              <button
                onClick={() => router.push('/dashboard/new')}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Create your first post
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isOwner={true}
                />
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center space-x-4 mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}