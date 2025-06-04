import React, { useState, useCallback, useEffect, memo, Suspense, useMemo } from 'react';
import { lazy } from 'react';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import DOMPurify from 'dompurify';
import { BACKEND_URL } from './config';
import { toast } from 'sonner';
import { Quill } from 'react-quill';

interface Blog {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  publishdate: string;
  imageurl: string;
}

interface QuillInstance {
  getSelection: (focus?: boolean) => { index: number; length: number } | null;
  insertEmbed: (index: number, type: string, url: string) => void;
}

interface QuillHandler {
  quill: QuillInstance;
}

const ReactQuill = lazy(() => import('react-quill'));

// Add custom image handler
const ImageHandler = {
  checkServerHealth: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/upload/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  },

  upload: async (file: File) => {
    console.log('Starting image upload for file:', file.name);
    
    // Check server health first
    const isServerHealthy = await ImageHandler.checkServerHealth();
    if (!isServerHealthy) {
      toast.error('Server is not responding. Please check if the backend is running.');
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      toast.error('Authentication required. Please sign in.');
      return null;
    }

    try {
      console.log('Sending upload request to:', `${BACKEND_URL}/api/v1/upload`);
      console.log('Request headers:', {
        'Content-Type': 'multipart/form-data',
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      });
      
      // Log the file details
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const response = await axios.post(`${BACKEND_URL}/api/v1/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        },
        maxContentLength: 5 * 1024 * 1024,
        maxBodyLength: 5 * 1024 * 1024,
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500;
        }
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response data:', response.data);
      
      if (response.status === 200 && response.data.url) {
        console.log('Upload successful, URL:', response.data.url);
        toast.success('Image uploaded successfully');
        return response.data.url;
}

      console.error('Upload failed:', {
        status: response.status,
        data: response.data
      });
      toast.error(response.data.message || 'Failed to upload image');
      return null;
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED') {
          console.error('Request timed out');
          toast.error('Upload timed out. Please check if the backend server is running.');
        } else if (!error.response) {
          console.error('Network error:', error.message);
          toast.error('Network error. Please check your connection and ensure the backend server is running.');
        } else {
          console.error('Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            config: {
              url: error.config?.url,
              headers: error.config?.headers,
              method: error.config?.method
            }
          });
          const errorMessage = error.response?.data?.message || error.message;
          toast.error('Failed to upload image: ' + errorMessage);
        }
      } else {
        toast.error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
      return null;
    }
  }
};

// Create a memoized editor component
const MemoizedQuill = memo(({ 
  value, 
  onChange, 
  modules, 
  formats, 
  readOnly 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  modules: Record<string, unknown>; 
  formats: string[]; 
  readOnly: boolean;
}) => (
  <ReactQuill
    theme="snow"
    value={value}
    onChange={onChange}
    modules={modules}
    formats={formats}
    readOnly={readOnly}
    className="min-h-[24rem]"
  />
));

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize modules and formats
  const modules = useMemo(() => ({
    toolbar: {
      container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
      handlers: {
        image: function(this: QuillHandler) {
          console.log('Image button clicked');
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
              console.log('File selected:', file.name);
              const url = await ImageHandler.upload(file);
              if (url) {
                console.log('Image uploaded successfully, inserting at cursor position');
                const range = this.quill.getSelection(true);
                if (range) {
                  this.quill.insertEmbed(range.index, 'image', url);
              setImageUrl(url);
                } else {
                  console.error('No cursor position found');
                  toast.error('Please click where you want to insert the image');
                }
              }
            }
          };
        }
      }
    }
  }), []);

  // Log rendering
  console.log('BlogEditor rendered:', { title, content, isSubmitting, error });

  // Log state changes
  useEffect(() => {
    console.log('State updated:', { title, content });
  }, [title, content]);

  // Add custom styles for images in the editor
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ql-editor img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1em 0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formats = useMemo(() => [
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
  ], []);

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
        imageurl: imageUrl || 'https://via.placeholder.com/150',
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
  }, [title, content, imageUrl, navigate]);

  return (
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
          <Suspense fallback={<div className="min-h-[24rem] bg-gray-200 animate-pulse"></div>}>
            <MemoizedQuill
              value={content}
              onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  readOnly={isSubmitting}
                />
          </Suspense>
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
  );
};

export default memo(BlogEditor);

