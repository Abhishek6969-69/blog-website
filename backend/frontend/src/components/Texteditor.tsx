import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';
// @ts-ignore
import ImageUploader from "quill-image-uploader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "./config";

Quill.register("modules/imageUploader", ImageUploader);

interface TextEditorState {
  text: string;
  firstName: string;
  imageUrl: string | "";
}

class TextEditor extends Component<{ navigate: (path: string) => void }, TextEditorState> {
  constructor(props: { navigate: (path: string) => void }) {
    super(props);
    this.state = {
      text: "",
      firstName: "",
      imageUrl: "",
    };
  }

  modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
    imageUploader: {
      upload: (file: any) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", file);

          fetch("https://api.imgbb.com/1/upload?key=232b3cef46c25c737aeb716f0ec2aff1", {
            method: "POST",
            body: formData,
          })
            .then(response => response.json())
            .then(result => {
              const imageUrl = result.data.url;
              this.setState({ imageUrl });
              resolve(imageUrl);
            })
            .catch(error => {
              reject("Upload failed");
              console.error("Error:", error);
            });
        });
      }
    }
  };

  formats = [
    "header", "bold", "italic", "underline", "strike",
    "blockquote", "list", "bullet", "indent", "link", "image",
    "color", "background", "align", "code-block"
  ];

  handleChange = (value: string) => {
    this.setState({ text: value });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ firstName: e.target.value });
  };

  handleSubmit = async () => {
    const { text, firstName, imageUrl } = this.state;

    try {
      const token1 = localStorage.getItem('token') || null;
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
        content: text,  // Send the full HTML content
        title: firstName,
        imageurl: imageUrl
      }, {
        headers: {
          Authorization: token1 ? ` ${token1}` : undefined,
        },
      });

      if (!response) {
        throw new Error("Network response was not ok");
      }

      const blogId = response.data.id;
      this.props.navigate(`/blog/${blogId}`);
      
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  render() {
    return (
      <div>
        <div className="p-2">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
          <input 
            type="text" 
            id="first_name" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="Title of the blog" 
            required 
            onChange={this.handleInputChange}
          />
        </div>
        
        <ReactQuill
          theme="snow"
          modules={this.modules}
          formats={this.formats}
          value={this.state.text}
          onChange={this.handleChange}
          className=" h-96"
        />
        
        <button 
          onClick={this.handleSubmit} 
          className="mt-16 p-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>
    );
  }
}

const TextEditorWrapper = () => {
  const navigate = useNavigate();
  return <TextEditor navigate={navigate} />;
};

export default TextEditorWrapper;
