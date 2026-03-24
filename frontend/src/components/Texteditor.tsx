import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import ReactQuill from 'react-quill';
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
  insertText: (index: number, text: string, source?: string) => void;
  setSelection: (index: number, length?: number, source?: string) => void;
  focus: () => void;
}

interface QuillHandler {
  quill: QuillInstance;
}

// ReactQuill is now imported directly

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

      if (response.status === 200 && response.data.url) {
        console.log('Upload successful, URL:', response.data.url);
        toast.success('Image uploaded successfully');
        return response.data.url;
      }

      toast.error(response.data.message || 'Failed to upload image');
      return null;
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED') {
          toast.error('Upload timed out. Please check if the backend server is running.');
        } else if (!error.response) {
          toast.error('Network error. Please check your connection and ensure the backend server is running.');
        } else {
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
}) => {
  const quillRef = React.useRef<ReactQuill>(null);
  
  // Handle maintaining focus after operations
  const handleChange = React.useCallback((content: string) => {
    onChange(content);
  }, [onChange]);

  try {
    return (
      <div className="relative w-full">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          placeholder="Start writing your amazing story..."
        />
        {!value && (
          <div className="absolute top-20 left-6 pointer-events-none text-gray-400 text-lg">
            ✨ Share your thoughts, experiences, and insights...
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('QuillEditor Error:', error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Editor failed to load. Please refresh the page.</p>
      </div>
    );
  }
});

const BlogEditor: React.FC = () => {
  console.log('BlogEditor rendering...');
  
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);
  
  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  // Simplified and working modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: function(this: QuillHandler) {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
              const url = await ImageHandler.upload(file);
              if (url) {
                const range = this.quill.getSelection(true);
                if (range) {
                  // Insert the image at current cursor position
                  this.quill.insertEmbed(range.index, 'image', url);
                  
                  // Move cursor to after the image and add paragraph breaks for better text flow
                  const newIndex = range.index + 1;
                  
                  // Insert a line break after the image
                  this.quill.insertText(newIndex, '\n', 'user');
                  
                  // Set cursor position after the line break
                  this.quill.setSelection(newIndex + 1, 0);
                  
                  // Focus the editor with a slight delay to ensure proper cursor positioning
                  setTimeout(() => {
                    this.quill.focus();
                    // Ensure cursor is at the right position
                    this.quill.setSelection(newIndex + 1, 0);
                  }, 50);
                }
              }
            }
          };
        }
      }
    }
  }), []);

  // Add clean, modern styling with proper fixes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Reset and base styles */
      .ql-toolbar, .ql-container {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      }

      /* Toolbar base styling */
      .ql-toolbar.ql-snow {
        border: none !important;
        border-bottom: 1px solid #e5e7eb !important;
        padding: 12px 0 !important;
        background: white !important;
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 4px !important;
        min-height: 48px !important;
        box-shadow: none !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin-bottom: 12px !important;
      }

      /* Format group containers with better definition */
      .ql-toolbar .ql-formats {
        display: flex !important;
        align-items: center !important;
        margin: 0 8px !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        border-radius: 4px !important;
        gap: 2px !important;
        position: relative !important;
        visibility: visible !important;
      }

      .ql-toolbar .ql-formats:hover {
        border-color: transparent !important;
        box-shadow: none !important;
      }

      /* Add separators between format groups */
      .ql-toolbar .ql-formats:not(:last-child)::after {
        content: '' !important;
        position: absolute !important;
        right: -10px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 1px !important;
        height: 24px !important;
        background: #e5e7eb !important;
      }

      /* Toolbar buttons with better definition */
      .ql-toolbar button {
        width: 36px !important;
        height: 36px !important;
        border: none !important;
        border-radius: 4px !important;
        background: transparent !important;
        color: #4b5563 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 2px 0 !important;
        padding: 0 !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        visibility: visible !important;
        line-height: 1 !important;
      }

      .ql-toolbar button:hover {
        background: #f3f4f6 !important;
        color: #1f2937 !important;
      }

      .ql-toolbar button.ql-active {
        background: #e8e8e8 !important;
        color: #1f2937 !important;
      }

      /* Bold button */
      .ql-toolbar button.ql-bold {
        font-weight: 700 !important;
      }

      .ql-toolbar button.ql-bold::before {
        content: 'B' !important;
        font-weight: 700 !important;
      }

      /* Italic button */
      .ql-toolbar button.ql-italic::before {
        content: 'I' !important;
        font-style: italic !important;
        font-weight: 500 !important;
      }

      /* Underline button */
      .ql-toolbar button.ql-underline::before {
        content: 'U' !important;
        text-decoration: underline !important;
      }

      /* Strike button */
      .ql-toolbar button.ql-strike::before {
        content: 'S' !important;
        text-decoration: line-through !important;
      }

      /* List buttons */
      .ql-toolbar button.ql-list[value="ordered"]::before {
        content: '1.' !important;
        font-size: 12px !important;
        font-weight: 600 !important;
      }

      .ql-toolbar button.ql-list[value="bullet"]::before {
        content: '•' !important;
        font-size: 16px !important;
      }

      /* Link button */
      .ql-toolbar button.ql-link::before {
        content: '🔗' !important;
        font-size: 12px !important;
      }

      /* Image button */
      .ql-toolbar button.ql-image::before {
        content: '🖼️' !important;
        font-size: 12px !important;
      }

      /* Blockquote button */
      .ql-toolbar button.ql-blockquote::before {
        content: '❝' !important;
        font-size: 16px !important;
      }

      /* List buttons */
      .ql-toolbar button[value="ordered"]::before {
        content: '1.' !important;
        font-size: 12px !important;
        font-weight: 600 !important;
      }

      .ql-toolbar button[value="bullet"]::before {
        content: '•' !important;
        font-size: 16px !important;
        font-weight: 600 !important;
      }

      /* Code block button */
      .ql-toolbar button.ql-code-block::before {
        content: '</>' !important;
        font-size: 10px !important;
        font-family: monospace !important;
      }

      /* Clean button */
      .ql-toolbar button.ql-clean::before {
        content: '🧹' !important;
        font-size: 12px !important;
      }

      /* Hide SVG icons to avoid duplicates */
      .ql-toolbar button svg {
        display: none !important;
      }

      /* Picker dropdowns with better styling */
      .ql-toolbar .ql-picker {
        position: relative !important;
        background: transparent !important;
        border: none !important;
        border-radius: 4px !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        min-width: 80px !important;
        max-width: 120px !important;
        box-shadow: none !important;
        transition: all 0.2s ease !important;
        padding: 6px 8px !important;
        color: #4b5563 !important;
      }

      .ql-toolbar .ql-picker:hover {
        border-color: transparent !important;
        box-shadow: none !important;
        background: #f3f4f6 !important;
      }

      .ql-toolbar .ql-picker.ql-expanded {
        border: 1px solid #e5e7eb !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        background: white !important;
      }

      .ql-toolbar .ql-picker-label {
        padding: 0 !important;
        color: #4b5563 !important;
        cursor: pointer !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        display: flex !important;
        align-items: center !important;
      }

      .ql-toolbar .ql-picker-label::before {
        font-size: 13px !important;
        line-height: 1.4 !important;
      }

      /* Dropdown arrow */
      .ql-toolbar .ql-picker-label::after {
        content: '' !important;
        display: none !important;
        border: none !important;
        margin-left: 4px !important;
      }

      .ql-picker.ql-expanded .ql-picker-label::after {
        display: none !important;
      }

      /* Dropdown options container */
      .ql-picker-options {
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        right: 0 !important;
        background: white !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        z-index: 10000 !important;
        margin-top: 4px !important;
        padding: 6px !important;
        max-height: 200px !important;
        overflow-y: auto !important;
        display: none !important;
        min-width: 140px !important;
      }

      .ql-picker.ql-expanded .ql-picker-options {
        display: block !important;
      }

      /* Dropdown items */
      .ql-picker-item {
        padding: 8px 12px !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        color: #4b5563 !important;
        cursor: pointer !important;
        border-radius: 4px !important;
        transition: background-color 0.15s ease !important;
        white-space: nowrap !important;
        margin-bottom: 2px !important;
      }

      .ql-picker-item:hover {
        background: #f3f4f6 !important;
      }

      .ql-picker-item.ql-selected {
        background: #e8e8e8 !important;
        color: #1f2937 !important;
      }

      /* Header dropdown specific styles */
      .ql-header .ql-picker-item[data-value="1"] {
        font-size: 14px !important;
        font-weight: 700 !important;
      }

      .ql-header .ql-picker-item[data-value="2"] {
        font-size: 13px !important;
        font-weight: 600 !important;
      }

      .ql-header .ql-picker-item[data-value="3"] {
        font-size: 12px !important;
        font-weight: 600 !important;
      }

      .ql-header .ql-picker-item:not([data-value]) {
        font-size: 12px !important;
        font-weight: 400 !important;
      }

      /* Color picker labels with proper visual indicators */
      .ql-color .ql-picker-label,
      .ql-background .ql-picker-label {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
        min-width: 55px !important;
        max-width: 55px !important;
        padding: 6px 4px !important;
        overflow: hidden !important;
      }

      .ql-color .ql-picker-label::before {
        content: 'A' !important;
        font-weight: bold !important;
        font-size: 14px !important;
        color: #000 !important;
        margin-right: 4px !important;
      }

      .ql-color .ql-picker-label::after {
        content: '' !important;
        width: 12px !important;
        height: 3px !important;
        background: #000 !important;
        position: absolute !important;
        bottom: 4px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
      }

      .ql-background .ql-picker-label::before {
        content: '🎨' !important;
        font-size: 12px !important;
        margin-right: 2px !important;
        line-height: 1 !important;
        display: inline-block !important;
      }

      /* Alignment picker with proper icons */
      .ql-align .ql-picker-label {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-width: 50px !important;
        padding: 6px 8px !important;
      }

      .ql-align .ql-picker-label::before {
        content: '≡' !important;
        font-size: 16px !important;
        font-weight: bold !important;
        color: #374151 !important;
      }

      .ql-align .ql-picker-label[data-value="center"]::before {
        content: '≡' !important;
        text-align: center !important;
      }

      .ql-align .ql-picker-label[data-value="right"]::before {
        content: '≡' !important;
        text-align: right !important;
      }

      .ql-align .ql-picker-label[data-value="justify"]::before {
        content: '≡' !important;
      }

      /* Color picker dropdown styling */
      .ql-color .ql-picker-options,
      .ql-background .ql-picker-options {
        padding: 12px !important;
        display: none !important;
        grid-template-columns: repeat(8, 1fr) !important;
        gap: 6px !important;
        width: 200px !important;
        min-height: 120px !important;
      }

      .ql-color.ql-expanded .ql-picker-options,
      .ql-background.ql-expanded .ql-picker-options {
        display: grid !important;
      }

      .ql-color .ql-picker-item,
      .ql-background .ql-picker-item {
        width: 20px !important;
        height: 20px !important;
        padding: 0 !important;
        border-radius: 4px !important;
        border: 2px solid #fff !important;
        box-shadow: 0 0 0 1px #e5e7eb !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }

      .ql-color .ql-picker-item:hover,
      .ql-background .ql-picker-item:hover {
        transform: scale(1.15) !important;
        box-shadow: 0 0 0 2px #4f46e5 !important;
        z-index: 1 !important;
      }

      /* Alignment dropdown items with proper icons */
      .ql-align .ql-picker-options {
        padding: 8px !important;
        min-width: 140px !important;
        background: white !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
      }

      .ql-align .ql-picker-item {
        display: flex !important;
        align-items: center !important;
        padding: 8px 12px !important;
        font-size: 13px !important;
        color: #374151 !important;
        border-radius: 4px !important;
        margin-bottom: 2px !important;
        cursor: pointer !important;
        transition: background-color 0.15s ease !important;
      }

      .ql-align .ql-picker-item:hover {
        background: #f3f4f6 !important;
      }

      .ql-align .ql-picker-item.ql-selected {
        background: #ede9fe !important;
        color: #4f46e5 !important;
      }

      .ql-align .ql-picker-item::before {
        content: '' !important;
        width: 16px !important;
        height: 2px !important;
        background: #374151 !important;
        margin-right: 8px !important;
      }

      .ql-align .ql-picker-item[data-value=""]::before,
      .ql-align .ql-picker-item:not([data-value])::before {
        width: 20px !important;
      }

      .ql-align .ql-picker-item[data-value=""]::after,
      .ql-align .ql-picker-item:not([data-value])::after {
        content: 'Left' !important;
        margin-left: 8px !important;
      }

      .ql-align .ql-picker-item[data-value="center"]::before {
        width: 16px !important;
        margin-left: 2px !important;
      }

      .ql-align .ql-picker-item[data-value="center"]::after {
        content: 'Center' !important;
        margin-left: 8px !important;
      }

      .ql-align .ql-picker-item[data-value="right"]::before {
        width: 14px !important;
        margin-left: 6px !important;
      }

      .ql-align .ql-picker-item[data-value="right"]::after {
        content: 'Right' !important;
        margin-left: 8px !important;
      }

      .ql-align .ql-picker-item[data-value="justify"]::before {
        width: 20px !important;
        height: 8px !important;
        background: repeating-linear-gradient(
          to bottom,
          #374151 0px,
          #374151 2px,
          transparent 2px,
          transparent 4px
        ) !important;
      }

      .ql-align .ql-picker-item[data-value="justify"]::after {
        content: 'Justify' !important;
        margin-left: 8px !important;
      }

      /* Editor content area */
      .ql-editor {
        padding: 24px !important;
        min-height: 400px !important;
        font-size: 16px !important;
        line-height: 1.7 !important;
        color: #1f2937 !important;
        background: white !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      }

      .ql-editor:focus {
        outline: none !important;
      }
      
      /* Ensure proper cursor behavior */
      .ql-editor p {
        margin-bottom: 1em !important;
      }
      
      .ql-editor p:empty {
        min-height: 1.5em !important;
      }

      .ql-editor img {
        max-width: 100% !important;
        height: auto !important;
        display: block !important;
        margin: 1.5em auto !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        cursor: pointer !important;
      }
      
      /* Ensure proper text flow after images */
      .ql-editor p + img + p {
        margin-top: 1em !important;
      }
      
      /* Better cursor visibility */
      .ql-editor .ql-cursor {
        display: block !important;
      }

      .ql-editor h1 {
        font-size: 2.5em !important;
        font-weight: 700 !important;
        margin: 1.5em 0 0.5em !important;
        color: #111827 !important;
      }

      .ql-editor h2 {
        font-size: 2em !important;
        font-weight: 600 !important;
        margin: 1.2em 0 0.4em !important;
        color: #111827 !important;
      }

      .ql-editor h3 {
        font-size: 1.5em !important;
        font-weight: 600 !important;
        margin: 1em 0 0.3em !important;
        color: #111827 !important;
      }

      .ql-editor blockquote {
        border-left: 4px solid #4f46e5 !important;
        background: #f8fafc !important;
        margin: 1.5em 0 !important;
        padding: 1em 1.5em !important;
        border-radius: 0 8px 8px 0 !important;
        font-style: italic !important;
        color: #4b5563 !important;
      }

      .ql-editor pre {
        background: #1f2937 !important;
        color: #f9fafb !important;
        padding: 1.5em !important;
        border-radius: 8px !important;
        overflow-x: auto !important;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace !important;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .ql-toolbar.ql-snow {
          padding: 8px 12px !important;
          gap: 4px !important;
          min-height: 56px !important;
          overflow-x: auto !important;
          overflow-y: visible !important;
        }

        .ql-toolbar .ql-formats {
          padding: 4px 6px !important;
          gap: 2px !important;
          flex-shrink: 0 !important;
        }

        .ql-toolbar button {
          width: 28px !important;
          height: 28px !important;
          font-size: 12px !important;
          margin: 0 !important;
        }

        .ql-toolbar button svg {
          width: 12px !important;
          height: 12px !important;
        }

        .ql-toolbar .ql-picker {
          min-width: 60px !important;
          max-width: 100px !important;
          font-size: 11px !important;
        }

        .ql-toolbar .ql-picker-label {
          padding: 4px 6px !important;
          font-size: 11px !important;
        }

        .ql-picker-item {
          padding: 6px 8px !important;
          font-size: 12px !important;
        }

        .ql-color .ql-picker-options,
        .ql-background .ql-picker-options {
          width: 180px !important;
          grid-template-columns: repeat(6, 1fr) !important;
        }

        .ql-editor {
          padding: 16px !important;
          min-height: 300px !important;
          font-size: 15px !important;
        }

        /* Hide separators on mobile */
        .ql-toolbar .ql-formats::after {
          display: none !important;
        }
      }

      /* Ensure proper stacking */
      .ql-container {
        position: relative !important;
        border: none !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        overflow: visible !important;
      }

      .ql-container.ql-snow {
        border: none !important;
        overflow: visible !important;
      }

      .ql-editor {
        padding: 0 !important;
        min-height: 400px !important;
        font-size: 16px !important;
        line-height: 1.7 !important;
        color: #1f2937 !important;
        background: transparent !important;
        position: relative !important;
        z-index: 1 !important;
        pointer-events: auto !important;
        visibility: visible !important;
        overflow: visible !important;
      }

      .ql-editor.ql-blank::before {
        color: #d1d5db !important;
        font-style: italic !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'ordered', 'color', 'background', 'align',
    'blockquote', 'code-block', 'link', 'image'
  ], []);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  // Helper function to extract the first image from HTML content
  const extractFirstImage = useCallback((html: string): string => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const img = tmp.querySelector("img");
    return img ? img.src : 'https://via.placeholder.com/150';
  }, []);

  const handleSubmit = useCallback(async () => {
    const toastId = toast.loading("Publishing blog post...");

    if (title.length > 200) {
      toast.dismiss(toastId);
      toast.error("Title must be less than 200 characters");
      setError('Title must be less than 200 characters');
      return;
    }

    const sanitizedContent = DOMPurify.sanitize(content);
    if (!title.trim() || !sanitizedContent.trim()) {
      toast.dismiss(toastId);
      toast.error("Title and content are required");
      setError('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.dismiss(toastId);
        toast.error("You must be logged in to publish a post");
        setError('You must be logged in to publish a post');
        navigate('/signin');
        return;
      }

      // Extract first image from content for thumbnail
      const firstImageUrl = extractFirstImage(sanitizedContent);

      const payload: Omit<Blog, 'id'> = {
        title,
        content: sanitizedContent,
        author: { name: 'Anonymous' },
        publishdate: new Date().toISOString().split('T')[0],
        imageurl: firstImageUrl,
      };

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
      toast.success("Blog post published successfully!");
      navigate(`/blog/${blogId}`);
    } catch (error: unknown) {
      console.error('Submit error:', error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to create blog post. Please check the server and try again.';
        toast.dismiss(toastId);
        toast.error(errorMessage);
        setError(errorMessage);
      } else if (error instanceof Error) {
        toast.dismiss(toastId);
        toast.error(error.message || 'Something went wrong. Please try again.');
        setError(error.message || 'Something went wrong. Please try again.');
      } else {
        toast.dismiss(toastId);
        toast.error('An unexpected error occurred. Please try again.');
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, navigate, extractFirstImage]);

  console.log('About to render BlogEditor JSX...');
  
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header Section */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-500">Share your thoughts and knowledge with the world</p>
        </div>
      </div>

      {/* Editor Header Section */}
      <div className="bg-black border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-1">Create Your Story</h2>
          <p className="text-gray-400">Write something amazing</p>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
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
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full px-0 py-2 text-3xl font-bold border-0 focus:border-0 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent hover:bg-gray-50 focus:bg-white"
              placeholder="Give your story a compelling title..."
              disabled={isSubmitting}
              maxLength={200}
            />
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
              <p>Write a clear, engaging title for your article</p>
              <span className={`font-medium ${
                title.length > 180 ? 'text-red-500' : title.length > 150 ? 'text-yellow-500' : 'text-gray-400'
              }`}>
                {title.length}/200
              </span>
            </div>
          </div>

          {/* Content Editor Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <label className="text-lg font-semibold text-gray-900">
                Article Content
              </label>
            </div>
            
            <div className="border-0">
              <MemoizedQuill
                value={content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                readOnly={isSubmitting}
              />
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
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSubmit}
                className={`px-8 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center min-w-[140px] ${
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