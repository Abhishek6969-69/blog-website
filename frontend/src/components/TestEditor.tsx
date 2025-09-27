import React from 'react';

const TestEditor: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Test Editor</h1>
        <p className="text-gray-600">This is a test component to check if the routing works.</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p>If you can see this, the component is rendering correctly.</p>
        </div>
      </div>
    </div>
  );
};

export default TestEditor;