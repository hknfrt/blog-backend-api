'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Navbar from '@/app/components/Navbar';
import { postsApi } from '@/lib/posts';
import { UpdatePostData, Post } from '@/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [originalPost, setOriginalPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<UpdatePostData>({
    title: '',
    content: '',
    published: false,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const response = await postsApi.getPost(postId);
        const post = response.post;
        
        // Check if current user is the author (additional security)
        setOriginalPost(post);
        setFormData({
          title: post.title,
          content: post.content,
          published: post.published,
        });
        setCharCount(post.content.length);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError('Post not found');
        } else if (error.response?.status === 403) {
          setError('You can only edit your own posts');
        } else {
          setError('Failed to load post');
        }
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }

    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    if (!formData.content?.trim()) {
      setError('Content is required');
      return;
    }

    if (formData.content.trim().length < 10) {
      setError('Content must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await postsApi.updatePost(postId, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        published: formData.published,
      });
      
      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 403) {
        setError('You can only edit your own posts');
      } else if (error.response?.status === 404) {
        setError('Post not found');
      } else {
        const errorMessage = error.response?.data?.error || 'Failed to update post';
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      
      // Update character count for content
      if (name === 'content') {
        setCharCount(value.length);
      }
    }
  };

  const handleSaveAsDraft = async () => {
    const draftData = {
      ...formData,
      published: false,
    };
    
    // Update form data to draft mode
    setFormData(draftData);
    
    // Submit as draft
    const event = new Event('submit') as any;
    handleSubmit(event);
  };

  // Show loading state while fetching post
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-xl text-gray-600">Loading post...</div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show error state if post couldn't be loaded
  if (error && !originalPost) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-xl text-red-600 mb-4">{error}</div>
              <Link
                href="/dashboard"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Post
                </h1>
                <p className="text-gray-600 mt-2">
                  Update your post &quot;{originalPost?.title}&quot;
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href={`/post/${postId}`}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  View Post
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && originalPost && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Original vs Current Status */}
              {originalPost && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-blue-900">Original Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        originalPost.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {originalPost.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="text-blue-700">
                      Created: {new Date(originalPost.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your post title..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(formData.title || '').length}/100 characters
                </p>
              </div>

              {/* Content Textarea */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={12}
                  value={formData.content || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  placeholder="Write your post content here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {charCount} characters • Minimum 10 characters required
                </p>
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  Published
                  <span className="text-gray-500 text-xs block">
                    {formData.published 
                      ? 'This post will be visible to everyone' 
                      : 'This post will be saved as draft'
                    }
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  disabled={isSubmitting || !formData.title?.trim() || !formData.content?.trim()}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save as Draft
                </button>

                <div className="flex space-x-4">
                  <Link
                    href="/dashboard"
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title?.trim() || !formData.content?.trim()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Update Info */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-900 mb-3">
              📝 Editing Tips
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Your changes will be saved immediately after clicking &quot;Update Post&quot;</li>
              <li>• Use &quot;Save as Draft&quot; to unpublish a live post</li>
              <li>• You can preview your changes by clicking &quot;View Post&quot; after saving</li>
              <li>• All changes are tracked with timestamps</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}