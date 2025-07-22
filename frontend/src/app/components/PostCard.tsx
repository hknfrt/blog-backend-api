'use client';

import Link from 'next/link';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  isOwner?: boolean;
}

export default function PostCard({ post, onEdit, onDelete, isOwner = false }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/post/${post.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">
              {post.title}
            </h3>
          </Link>
          <p className="text-gray-600 mt-2">
            {truncateContent(post.content)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            post.published 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {post.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
      <div>
    <span>By {post.author?.username || 'Unknown'}</span>
    <span className="mx-2">•</span>
    <span>{formatDate(post.createdAt)}</span>
    {post.createdAt !== post.updatedAt && (
      <>
        <span className="mx-2">•</span>
        <span>Updated {formatDate(post.updatedAt)}</span>
      </>
    )}
  </div>

        {isOwner && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(post)}
              className="text-indigo-600 hover:text-indigo-900 font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="text-red-600 hover:text-red-900 font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}