// import React from 'react';
import { Avatar } from "@/components/Blogcards";
import { useBlogs } from "@/components/hooks";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
const ProfilePage = () => {
  // Mock user data (replace with API call in production)
  const {  blog } = useBlogs();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
 
  const filtereditem=blog.filter((i)=>i.author.name===storedUser.name)
 
 const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          <Avatar name={storedUser.name} w={50} h={50} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{storedUser.name}</h1>
            <p className="text-gray-600">{storedUser.email}</p>
            {/* <p className="text-sm text-gray-500 mt-2">{user.bio}</p> */}
          </div>
        </div>

        {/* User Posts */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700">Your Blog Posts</h2>
          <ul className="mt-4 space-y-3">
            {filtereditem.map((post) => (
              <li key={post.id} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-bold text-blue-600" onClick={()=>{
                    navigate(`/blog/${post.id}`)
                }}>{post.title}</h3>
                <p className="text-sm text-gray-500">Published on {dayjs(post.
publishdate).format('dddd, D[th] MMMM, YYYY')
}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
