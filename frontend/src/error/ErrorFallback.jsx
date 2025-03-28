import React from 'react';

const ErrorFallbackPage = ({ error, errorInfo, onReset }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-700 mb-6">An unexpected error has occurred in the application.</p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error Details</h2>
          <p className="text-red-600 break-words">
            {error && error.toString()}
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            onClick={onReset}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Return to Home
          </button>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorFallbackPage;