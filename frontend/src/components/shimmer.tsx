import React from 'react';

const Shimmer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8 animate-pulse">
        {/* Title Placeholder */}
        <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-6"></div>

        {/* Author Section */}
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded-md w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded-md w-20"></div>
          </div>
        </div>

        {/* Featured Image Placeholder */}
        <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>

        {/* Content Placeholders */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded-md w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;