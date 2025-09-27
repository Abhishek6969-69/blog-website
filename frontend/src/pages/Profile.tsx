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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar name={storedUser.name} w={80} h={80} />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{storedUser.name}</h1>
              <p className="text-gray-600 mb-4">{storedUser.email}</p>
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
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Your Stories</h2>
            <button 
              onClick={() => navigate('/createblog')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Write New Story
            </button>
          </div>
          
          {filtereditem.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">No stories yet</h3>
              <p className="text-xl text-gray-600 mb-8">Start writing your first story to share with the community!</p>
              <button 
                onClick={() => navigate('/createblog')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Create Your First Story
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtereditem.map((post) => (
                <div 
                  key={post.id} 
                  className="group p-8 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Published {dayjs(post.publishdate).format('MMM DD, YYYY')}</span>
                        <span>•</span>
                        <span>{Math.ceil(post.content.length / 100)} min read</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600 group-hover:text-indigo-700 transition-colors">
                      <span className="text-sm font-medium">View</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
