import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="text-center text-red-500 font-semibold mt-4">
      {message}
    </div>
  );
};

export default ErrorMessage;