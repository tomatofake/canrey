'use client';
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

const BackButton = ({ className = '', children }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`px-4 py-1 flex items-center mr-2 bg-black text-primary rounded-full ${className}`}
    >
      {children || <FaArrowLeft className="mr-1" />}
    </button>
  );
};

export default BackButton;
