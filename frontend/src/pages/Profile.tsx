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
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar name={storedUser.name} w={80} h={80} />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{storedUser.name}</h1>
              <p className="text-gray-500 mb-4">{storedUser.email}</p>
              <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {filtereditem.length} Posts Published
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Member since {dayjs(filtereditem[0]?.publishdate).format('YYYY') || 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="bg-white border border-gray-100 rounded-xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Stories</h2>
            <button 
              onClick={() => navigate('/createblog')}
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Write New Story
            </button>
          </div>
          
          {filtereditem.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">No stories yet</h3>
              <p className="text-xl text-gray-500 mb-8">Start writing your first story to share with the community!</p>
              <button 
                onClick={() => navigate('/createblog')}
                className="px-8 py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Create Your First Story
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtereditem.map((post) => (
                <div 
                  key={post.id} 
                  className="p-6 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Published {dayjs(post.publishdate).format('MMM DD, YYYY')}</span>
                        <span>•</span>
                        <span>{Math.ceil(post.content.length / 100)} min read</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-sm font-medium">View</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
