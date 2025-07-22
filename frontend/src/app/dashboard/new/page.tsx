'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Navbar from '@/app/components/Navbar';
import { postsApi } from '@/lib/posts';
import { CreatePostData } from '@/types';

export default function NewPostPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    published: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (formData.content.trim().length < 10) {
      setError('Content must be at least 10 characters');
      return;
    }

    setIsLoading(true);

    try {
      await postsApi.createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        published: formData.published,
      });
      
      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create post';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
                  Create New Post
                </h1>
                <p className="text-gray-600 mt-2">
                  Share your thoughts with the world
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
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
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your post title..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
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
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  placeholder="Write your post content here... You can use line breaks and basic formatting."
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
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  Publish immediately
                  <span className="text-gray-500 text-xs block">
                    Uncheck to save as draft
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
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
                    disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      formData.published ? 'Publishing...' : 'Saving...'
                    ) : (
                      formData.published ? 'Publish Post' : 'Save Post'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Writing Tips */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              ✍️ Writing Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a compelling title that summarizes your main point</li>
              <li>• Start with an engaging opening paragraph</li>
              <li>• Break up long paragraphs for better readability</li>
              <li>• Save as draft first, then review before publishing</li>
              <li>• You can always edit your post later from the dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}