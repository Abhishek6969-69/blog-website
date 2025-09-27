import React from 'react';

const Shimmer: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {/* Image placeholder */}
            <div className="h-48 md:h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
            
            {/* Content placeholder */}
            <div className="p-6">
              {/* Author info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"></div>
                  <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"></div>
                </div>
              </div>
              
              {/* Title */}
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
              </div>
              
              {/* Content preview */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/6"></div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"></div>
                <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shimmer;