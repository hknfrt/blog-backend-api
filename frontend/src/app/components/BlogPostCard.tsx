'use client';

import Link from 'next/link';
import { Post } from '@/types';

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <Link href={`/post/${post.id}`}>
            <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2">
              {post.title}
            </h2>
          </Link>
        </div>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateContent(post.content)}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-xs">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-gray-700">
                {post.author.username}
              </span>
            </div>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
            <span>•</span>
            <span>{estimateReadingTime(post.content)} min read</span>
          </div>

          <Link
            href={`/post/${post.id}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}