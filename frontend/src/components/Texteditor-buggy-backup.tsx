import React, { useState, useCallback, useEffect, memo, Suspense, useMemo } from 'react';
import { lazy } from 'react';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import DOMPurify from 'dompurify';
import { BACKEND_URL } from './config';
import { toast } from 'sonner';


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
  <div className="relative">
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      readOnly={readOnly}
      className="modern-quill-editor"
      placeholder="Start writing your amazing story..."
    />
    {!value && (
      <div className="absolute top-20 left-6 pointer-events-none text-gray-400 text-lg">
        ✨ Share your thoughts, experiences, and insights...
      </div>
    )}
  </div>
));

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate word count and reading time
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);
  
  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed: 200 words per minute
  }, [wordCount]);

  // Memoize modules and formats
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }, { align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
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

  // Add modern custom styles for the editor and handle dropdown behavior
  useEffect(() => {
    const style = document.createElement('style');
    
    // Handle color picker dropdown behavior
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const colorPickers = document.querySelectorAll('.ql-color-picker, .ql-picker');
      
      colorPickers.forEach((picker) => {
        if (!picker.contains(target)) {
          picker.classList.remove('ql-expanded');
        }
      });
    };
    
    // Add event listener for clicking outside
    document.addEventListener('click', handleClickOutside);
    
    style.textContent = `
      /* Modern Quill Editor Styling */
      .ql-container {
        border: none !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 16px;
        line-height: 1.6;
      }
      
      .ql-toolbar {
        border: none !important;
        border-bottom: 2px solid #e2e8f0 !important;
        padding: 16px 20px;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);
        border-radius: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(12px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;
        min-height: 60px;
        overflow-x: auto;
        overflow-y: visible;
      }
      
      .ql-toolbar .ql-formats {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 8px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        transition: all 0.2s ease;
        flex-shrink: 0;
        min-height: 44px;
        position: relative;
      }
      
      .ql-toolbar .ql-formats:hover {
        background: rgba(255, 255, 255, 0.95);
        border-color: #c7d2fe;
        box-shadow: 0 4px 16px rgba(79, 70, 229, 0.1);
        transform: translateY(-1px);
      }
      
      /* Removed format group labels to prevent overflow */
      
      /* Add subtle animations */
      .ql-toolbar .ql-formats {
        position: relative;
      }
      
      @keyframes toolbarPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      
      .ql-toolbar .ql-formats:hover {
        animation: toolbarPulse 0.6s ease-in-out;
      }
      
      /* Modern Toolbar Buttons */
      .ql-toolbar button {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid transparent;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        margin: 0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
      }
      
      .ql-toolbar button::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        opacity: 0;
        transition: opacity 0.25s ease;
        z-index: -1;
      }
      
      .ql-toolbar button:hover {
        color: white;
        transform: translateY(-1px) scale(1.02);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        border-color: #4f46e5;
      }
      
      .ql-toolbar button:hover::before {
        opacity: 1;
      }
      
      .ql-toolbar button.ql-active {
        color: white;
        border-color: #4f46e5;
        box-shadow: 0 4px 16px rgba(79, 70, 229, 0.4);
      }
      
      .ql-toolbar button.ql-active::before {
        opacity: 1;
      }
      
      .ql-toolbar .ql-picker {
        border-radius: 8px;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border: 1px solid #e2e8f0;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        min-width: 60px;
        max-width: 120px;
        flex-shrink: 0;
      }
      
      .ql-toolbar .ql-picker:hover {
        border-color: #4f46e5;
        box-shadow: 0 4px 16px rgba(79, 70, 229, 0.15);
        transform: translateY(-1px);
      }
      
      .ql-toolbar .ql-picker.ql-expanded {
        border-color: #4f46e5;
        box-shadow: 0 4px 20px rgba(79, 70, 229, 0.2);
      }
      
      .ql-toolbar .ql-picker-label {
        padding: 6px 10px;
        border-radius: 6px;
        font-weight: 500;
        color: #374151;
        font-size: 12px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100px;
      }
      
      .ql-toolbar .ql-picker-label:hover {
        color: #4f46e5;
      }
      
      /* Custom dropdown arrow */
      .ql-toolbar .ql-picker-label::after {
        content: '▼';
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 10px;
        color: #6b7280;
        transition: all 0.2s ease;
      }
      
      .ql-toolbar .ql-picker.ql-expanded .ql-picker-label::after {
        transform: translateY(-50%) rotate(180deg);
        color: #4f46e5;
      }
      
      /* Editor Content Area */
      .ql-editor {
        padding: 24px;
        min-height: 400px;
        font-size: 16px;
        line-height: 1.7;
        color: #1f2937;
        background: white;
        border-radius: 0 0 16px 16px;
      }
      
      .ql-editor:focus {
        outline: none;
      }
      
      .ql-editor img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 2em auto;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      
      .ql-editor h1 {
        font-size: 2.25em;
        font-weight: 700;
        color: #111827;
        margin: 1.5em 0 0.5em;
        line-height: 1.2;
      }
      
      .ql-editor h2 {
        font-size: 1.875em;
        font-weight: 600;
        color: #111827;
        margin: 1.2em 0 0.4em;
        line-height: 1.3;
      }
      
      .ql-editor h3 {
        font-size: 1.5em;
        font-weight: 600;
        color: #111827;
        margin: 1em 0 0.3em;
      }
      
      .ql-editor p {
        margin: 1em 0;
      }
      
      .ql-editor blockquote {
        border-left: 4px solid #4f46e5;
        background: #f8fafc;
        margin: 1.5em 0;
        padding: 1em 1.5em;
        border-radius: 0 8px 8px 0;
        font-style: italic;
        color: #4b5563;
      }
      
      .ql-editor pre {
        background: #1f2937;
        color: #f9fafb;
        padding: 1.5em;
        border-radius: 12px;
        overflow-x: auto;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        margin: 1.5em 0;
      }
      
      .ql-editor ul, .ql-editor ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      
      .ql-editor li {
        margin: 0.5em 0;
        line-height: 1.6;
      }
      
      .ql-editor a {
        color: #4f46e5;
        text-decoration: none;
        border-bottom: 1px solid #c7d2fe;
        transition: all 0.2s ease;
      }
      
      .ql-editor a:hover {
        color: #3730a3;
        border-bottom-color: #4f46e5;
      }
      
      /* Dropdown Menus */
      .ql-picker-options {
        background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(12px);
        padding: 8px;
        animation: dropdownSlide 0.2s ease-out;
      }
      
      @keyframes dropdownSlide {
        from {
          opacity: 0;
          transform: translateY(-8px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .ql-picker-item {
        padding: 8px 12px;
        border-radius: 8px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 500;
        color: #374151;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        min-width: max-content;
      }
      
      /* Special styling for header options */
      .ql-picker-item[data-value="1"] {
        font-size: 2em;
        font-weight: 700;
      }
      
      .ql-picker-item[data-value="2"] {
        font-size: 1.5em;
        font-weight: 600;
      }
      
      .ql-picker-item[data-value="3"] {
        font-size: 1.25em;
        font-weight: 600;
      }
      
      .ql-picker-item[data-value="4"] {
        font-size: 1.1em;
        font-weight: 500;
      }
      
      .ql-picker-item[data-value="5"] {
        font-size: 1em;
        font-weight: 500;
      }
      
      .ql-picker-item[data-value="6"] {
        font-size: 0.9em;
        font-weight: 500;
      }
      
      .ql-picker-item::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: -1;
      }
      
      .ql-picker-item:hover {
        color: white;
        transform: translateX(4px);
      }
      
      .ql-picker-item:hover::before {
        opacity: 1;
      }
      
      /* Fix dropdown behavior for all pickers */
      .ql-picker {
        position: relative;
      }
      
      .ql-picker-options {
        display: none !important;
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        z-index: 9999 !important;
        min-width: 200px;
        max-height: 300px;
        overflow-y: auto;
        white-space: nowrap;
      }
      
      .ql-picker.ql-expanded .ql-picker-options {
        display: block !important;
      }
      
      /* Ensure dropdowns appear above everything */\n      .ql-toolbar .ql-formats:has(.ql-picker.ql-expanded) {\n        z-index: 10000;\n        overflow: visible;\n      }\n      \n      /* Force visibility for expanded pickers */\n      .ql-picker.ql-expanded {\n        z-index: 10001 !important;\n      }\n      \n      /* Prevent toolbar from clipping dropdowns */\n      .ql-container.ql-snow {\n        overflow: visible;\n      }\n      \n      /* Header picker specific fixes */\n      .ql-header .ql-picker-options {\n        min-width: 180px;\n      }\n      \n      .ql-header .ql-picker-item {\n        padding: 12px 16px;\n        border-bottom: 1px solid #f1f5f9;\n      }\n      \n      .ql-header .ql-picker-item:last-child {\n        border-bottom: none;\n      }\n      \n      /* Font picker fixes */\n      .ql-font .ql-picker-options {\n        min-width: 160px;\n      }\n      \n      /* Size picker fixes */\n      .ql-size .ql-picker-options {\n        min-width: 120px;\n      }"
      
      .ql-color-picker .ql-picker-options {
        display: none !important;
        grid-template-columns: repeat(8, 1fr);
        gap: 4px;
        padding: 12px;
        min-width: 250px;
      }
      
      .ql-color-picker.ql-expanded .ql-picker-options {
        display: grid !important;
      }
      
      /* Close dropdown when clicking outside */
      .ql-picker:not(.ql-expanded) .ql-picker-options {
        display: none !important;
      }
      
      /* Color picker specific styling */
      .ql-color-picker .ql-picker-item {
        width: 20px;
        height: 20px;
        border-radius: 6px;
        margin: 2px;
        border: 2px solid transparent;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      
      .ql-color-picker .ql-picker-item::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 10px;
        background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899);
        opacity: 0;
        z-index: -1;
        transition: opacity 0.3s ease;
      }
      
      .ql-color-picker .ql-picker-item:hover {
        transform: scale(1.15) rotate(3deg);
        border-color: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10;
      }
      
      .ql-color-picker .ql-picker-item:hover::before {
        opacity: 1;
      }
      
      .ql-color-picker .ql-picker-item:active {
        transform: scale(1.1) rotate(0deg);
      }
      
      /* Background color picker styling */
      .ql-background .ql-picker-options {
        display: none !important;
        grid-template-columns: repeat(8, 1fr);
        gap: 4px;
        padding: 12px;
        min-width: 250px;
      }
      
      .ql-background.ql-expanded .ql-picker-options {
        display: grid !important;
      }
      
      /* Prevent overflow issues */
      .ql-toolbar {
        overflow: visible;
        position: relative;
      }
      
      /* Ensure dropdowns appear above content */
      .ql-picker-options {
        z-index: 2000 !important;
      }
      
      /* Tooltip Animations */
      .ql-tooltip {
        background: #1f2937;
        color: white;
        border-radius: 8px;
        border: none;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(8px);
      }
      
      .ql-tooltip input {
        background: #374151;
        border: 1px solid #4b5563;
        border-radius: 6px;
        color: white;
        padding: 8px 12px;
      }
      
      /* Custom Scrollbar */
      .ql-editor::-webkit-scrollbar {
        width: 8px;
      }
      
      .ql-editor::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      
      .ql-editor::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      
      .ql-editor::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      
      /* Loading State */
      .ql-editor.ql-disabled {
        background: #f9fafb;
        color: #9ca3af;
      }
      
      /* Focus Indicators */
      .ql-container.ql-snow {
        border: 2px solid transparent;
        transition: all 0.3s ease;
      }
      
      .ql-container.ql-snow:focus-within {
        border-color: #4f46e5;
        box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
      }
      
      /* Modern Placeholder Styling */
      .ql-editor.ql-blank::before {
        color: #9ca3af;
        font-style: normal;
        font-weight: 400;
        opacity: 0.7;
      }
      
      /* Word Count and Statistics */
      .editor-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        background: #f8fafc;
        border-top: 1px solid #e5e7eb;
        font-size: 14px;
        color: #6b7280;
      }
      
      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        .ql-toolbar {
          padding: 12px 16px;
          gap: 6px;
          justify-content: flex-start;
          overflow-x: auto;
          overflow-y: visible;
        }
        
                .ql-toolbar .ql-formats {\n          padding: 4px 6px;\n          gap: 3px;\n          min-height: 36px;\n          position: relative;\n        }
        
        .ql-editor {
          padding: 16px 12px;
          min-height: 300px;
          font-size: 15px;
        }
        
        .ql-toolbar button {
          width: 28px;
          height: 28px;
        }
        
        .ql-toolbar .ql-picker {
          min-width: 50px;
          max-width: 80px;
        }
        
        .ql-toolbar .ql-picker-label {
          padding: 4px 6px;
          font-size: 11px;
          max-width: 60px;
        }
        
        .editor-stats {
          flex-direction: column;
          gap: 8px;
          align-items: flex-start;
          padding: 16px 20px;
        }
        
        /* Mobile color picker adjustments */
        .ql-color-picker .ql-picker-options,
        .ql-background .ql-picker-options {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          max-width: 85vw;
          max-height: 70vh;
          overflow-y: auto;
          z-index: 9999 !important;
        }
        
        .ql-picker-options {
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25) !important;
        }
      }
      
      /* Tablet responsiveness */
      @media (max-width: 1024px) and (min-width: 769px) {
        .ql-toolbar {
          padding: 14px 18px;
          gap: 8px;
        }
        
                .ql-toolbar .ql-formats {\n          padding: 5px 8px;\n          gap: 4px;\n          min-height: 40px;\n          position: relative;\n        }
        
        .ql-color-picker .ql-picker-options,
        .ql-background .ql-picker-options {
          grid-template-columns: repeat(6, 1fr);
          min-width: 180px;
        }
        
        .ql-toolbar button {
          width: 30px;
          height: 30px;
        }
        
        .ql-toolbar .ql-picker {
          min-width: 55px;
          max-width: 100px;
        }
      }
      
      /* Large screen optimizations */
      @media (min-width: 1440px) {
        .ql-toolbar {
          padding: 18px 24px;
          gap: 12px;
        }
        
                .ql-toolbar .ql-formats {\n          padding: 8px 12px;\n          gap: 6px;\n          min-height: 48px;\n          position: relative;\n        }
        
        .ql-toolbar button {
          width: 36px;
          height: 36px;
        }
        
        .ql-toolbar .ql-picker {
          min-width: 80px;
          max-width: 140px;
        }
        
        .ql-toolbar .ql-picker-label {
          padding: 8px 12px;
          font-size: 13px;
          max-width: 120px;
        }
      }
      
      /* Dark Mode Support */
      @media (prefers-color-scheme: dark) {
        .ql-toolbar {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          border-bottom-color: #374151;
        }
        
        .ql-editor {
          background: #1f2937;
          color: #f9fafb;
        }
        
        .ql-toolbar button {
          background: #374151;
          color: #e5e7eb;
          border-color: #4b5563;
        }
        
        .ql-toolbar button:hover {
          background: #4f46e5;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const formats = useMemo(() => [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'script',
    'list', 'bullet', 'indent', 'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
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
    <div className="max-w-5xl mx-auto">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Story</h2>
          <p className="text-indigo-100">Share your thoughts and insights with the world</p>
        </div>
        
        {/* Content Section */}
        <div className="p-6 md:p-8">
          {error && (
            <div id="error-message" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold mb-1">Error</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <label htmlFor="title" className="text-lg font-semibold text-gray-900">
                Article Title
              </label>
            </div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-6 py-4 text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 placeholder-gray-400 bg-gray-50/50 hover:bg-white focus:bg-white"
              placeholder="Give your story a compelling title..."
              disabled={isSubmitting}
              maxLength={200}
              aria-describedby={error ? 'error-message' : undefined}
            />
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm text-gray-500">Write a clear, engaging title for your article</p>
              <span className={`text-sm font-medium ${
                title.length > 180 ? 'text-red-500' : title.length > 150 ? 'text-yellow-500' : 'text-gray-400'
              }`}>
                {title.length}/200
              </span>
            </div>
          </div>

          {/* Content Editor Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <label htmlFor="content" className="text-lg font-semibold text-gray-900">
                Article Content
              </label>
            </div>
            
            <div className="relative">
              {/* Toolbar Header */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-100 px-6 py-3 border-b border-gray-200 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-4 text-sm font-medium text-gray-600">Rich Text Editor</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Use toolbar to format your content</span>
                  </div>
                </div>
              </div>
              
              <div className="border-2 border-gray-200 border-t-0 rounded-b-2xl overflow-hidden transition-all duration-300 hover:border-gray-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 bg-white shadow-lg">
                <Suspense fallback={
                  <div className="min-h-[32rem] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500 font-medium">Loading editor...</p>
                    </div>
                  </div>
                }>
                  <MemoizedQuill
                    value={content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    readOnly={isSubmitting}
                  />
                </Suspense>
              </div>
              
              {/* Writing Tips */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Writing Tips
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use headings to structure your content</li>
                  <li>• Add images to make your story more engaging</li>
                  <li>• Use blockquotes for important highlights</li>
                  <li>• Keep paragraphs concise and readable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Auto-saved</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 focus:ring-4 focus:ring-gray-500/20 focus:outline-none"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                type="button"
                className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200 focus:ring-4 focus:ring-gray-500/20 focus:outline-none"
                disabled={isSubmitting}
              >
                Save Draft
              </button>
              
              <button
                onClick={handleSubmit}
                className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-indigo-500/30 focus:outline-none flex items-center justify-center min-w-[140px] ${
                  !title.trim() || !content.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting || !title.trim() || !content.trim()}
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Publish Story
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BlogEditor);