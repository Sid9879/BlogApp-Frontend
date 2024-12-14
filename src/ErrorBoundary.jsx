import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console or an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-300 text-center px-6">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">We are sorry, something went wrong.</h1>
          <p className="text-gray-600 mb-6">
            An unexpected error occurred. Our team is working to resolve the issue. Please try again later.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
      
      );
    }

    return this.props.children; // Render the children components if no error
  }
}

export default ErrorBoundary;
