import React from 'react';

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Terjadi Kesalahan</h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Coba Lagi
      </button>
    </div>
  );
};

export default ErrorPage;
