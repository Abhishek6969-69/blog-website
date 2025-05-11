import React, { useState, useCallback, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import DOMPurify from 'dompurify';
import { BACKEND_URL } from './config';
import { toast } from 'sonner';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught:', error);
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      console.log('Rendering ErrorBoundary fallback:', this.state.error?.message);
      return (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <h2>Something went wrong in the editor.</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface Blog {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  publishdate: string;
  imageurl: string;
}

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Log rendering
  console.log('BlogEditor rendered:', { title, content, isSubmitting, error });

  // Log state changes
  useEffect(() => {
    console.log('State updated:', { title, content });
  }, [title, content]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'background',
    'align',
    'code-block',
  ];

  const handleContentChange = useCallback((value: string) => {
    console.log('Content changed:', value);
    setContent(value);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Title changed:', e.target.value);
    setTitle(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    const toastId = toast.loading("Publishing blog post...", {
      style: { background: "#e0e0e0", color: "#333" },
    });

    if (title.length > 200) {
      toast.dismiss(toastId);
      toast.error("Title must be less than 200 characters", {
        style: { background: "#f44336", color: "#fff" },
      });
      setError('Title must be less than 200 characters');
      return;
    }

    const sanitizedContent = DOMPurify.sanitize(content);
    if (!title.trim() || !sanitizedContent.trim()) {
      toast.dismiss(toastId);
      toast.error("Title and content are required", {
        style: { background: "#f44336", color: "#fff" },
      });
      setError('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.dismiss(toastId);
        toast.error("You must be logged in to publish a post", {
          style: { background: "#f44336", color: "#fff" },
        });
        setError('You must be logged in to publish a post');
        navigate('/signin');
        return;
      }

      const payload: Omit<Blog, 'id'> = {
        title,
        content: sanitizedContent,
        author: { name: 'Anonymous' },
        publishdate: new Date().toISOString().split('T')[0],
        imageurl: 'https://via.placeholder.com/150',
      };
      console.log('Submitting to:', `${BACKEND_URL}/api/v1/blog`);
      console.log('Payload:', payload);
      console.log('Headers:', { Authorization: token, 'Content-Type': 'application/json' });

      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, payload, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      const blogId = response.data.id;
      if (!blogId) {
        throw new Error('No blog ID returned from server');
      }

      toast.dismiss(toastId);
      toast.success("Blog post published successfully!", {
        style: { background: "#4caf50", color: "#fff" },
      });
      navigate(`/blog/${blogId}`);
    } catch (error: unknown) {
      console.error('Submit error:', error);
      if (error instanceof AxiosError) {
        console.log('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          message: error.message,
          request: {
            url: error.config?.url,
            headers: error.config?.headers,
            data: error.config?.data,
          },
        });
        const errorMessage =
          error.response?.data?.message ||
          'Failed to create blog post. Please check the server and try again.';
        toast.dismiss(toastId);
        toast.error(errorMessage, {
          style: { background: "#f44336", color: "#fff" },
        });
        setError(errorMessage);
      } else if (error instanceof Error) {
        toast.dismiss(toastId);
        toast.error(error.message || 'Something went wrong. Please try again.', {
          style: { background: "#f44336", color: "#fff" },
        });
        setError(error.message || 'Something went wrong. Please try again.');
      } else {
        toast.dismiss(toastId);
        toast.error('An unexpected error occurred. Please try again.', {
          style: { background: "#f44336", color: "#fff" },
        });
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, navigate]);

  return (
    <ErrorBoundary>
      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Blog Post</h1>
        {error && (
          <div id="error-message" className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your blog title"
            disabled={isSubmitting}
            aria-describedby={error ? 'error-message' : undefined}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuill
              id="content"
              theme="snow"
              modules={modules}
              formats={formats}
              value={content}
              onChange={handleContentChange}
              className="min-h-[24rem]"
              readOnly={isSubmitting}
              aria-describedby={error ? 'error-message' : undefined}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Publishing...
              </>
            ) : (
              'Publish Post'
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              toast.info("Test toast working!", {
                style: { background: "#2196f3", color: "#fff" },
              })
            }
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            disabled={isSubmitting}
          >
            Test Toast
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default memo(BlogEditor);