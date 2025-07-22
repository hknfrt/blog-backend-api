'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PublicNavbar from '@/app/components/PublicNavbar';
import { postsApi } from '@/lib/posts';
import { Post } from '@/types';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const response = await postsApi.getPost(postId);
        setPost(response.post);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError('Post not found');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const formatContent = (content: string) => {
    // Basic formatting - convert line breaks to paragraphs
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph.trim()}
        </p>
      );
    }).filter(Boolean);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'Post not found' ? 'Post Not Found' : 'Something went wrong'}
            </h1>
            <p className="text-gray-600 mb-8">
              {error === 'Post not found' 
                ? "The post you're looking for doesn't exist or has been removed."
                : 'We had trouble loading this post. Please try again.'
              }
            </p>
            <div className="space-x-4">
              <Link
                href="/"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
              >
                ← Back to Blog
              </Link>
              {error !== 'Post not found' && (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      
      {/* Article Container */}
      <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* Author and Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-lg">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {post.author.username}
                </p>
                <p className="text-sm text-gray-600">
                  {post.author.email}
                </p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center space-x-4">
                <span>📅 {formatDate(post.createdAt)}</span>
                <span>⏱️ {estimateReadingTime(post.content)} min read</span>
              </div>
              {post.createdAt !== post.updatedAt && (
                <div className="text-xs text-gray-500">
                  Updated: {formatDate(post.updatedAt)} at {formatTime(post.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 text-lg leading-relaxed">
              {formatContent(post.content)}
            </div>
          </div>
        </div>

        {/* Article Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {/* Author Card */}
            <div className="bg-white rounded-lg border p-6 mb-6 sm:mb-0 sm:mr-8 flex-1">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold text-xl">
                    {post.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Written by {post.author.username}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {post.author.email}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Member since {formatDate(post.author.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 text-center"
              >
                Read More Posts
              </Link>
              <button
                onClick={() => window.print()}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300 text-center"
              >
                🖨️ Print Article
              </button>
            </div>
          </div>
        </footer>

        {/* Share Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            📢 Enjoyed this post?
          </h3>
          <p className="text-blue-800 text-sm mb-4">
            Share it with your friends and help more people discover great content!
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const url = window.location.href;
                const text = `Check out this post: ${post.title}`;
                if (navigator.share) {
                  navigator.share({ title: post.title, text, url });
                } else {
                  navigator.clipboard.writeText(`${text} ${url}`);
                  alert('Link copied to clipboard!');
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              📋 Copy Link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500"
            >
              🐦 Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              💼 LinkedIn
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}