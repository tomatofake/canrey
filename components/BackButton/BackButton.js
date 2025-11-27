'use client';
import { FaArrowLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

const BackButton = ({ className = '', label = 'Назад' }) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={label}
      className={`
        inline-flex items-center justify-center select-none
        bg-black/50 text-white/95 backdrop-blur-sm
        shadow-sm transition hover:bg-black/65 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25
        h-12 w-12 rounded-full
        sm:h-9 sm:w-20 sm:px-3 sm:rounded-xl
        xl:h-10 xl:w-[100px] xl:rounded-2xl xl:mt-2
        ${className}
      `}
    >
      <FaArrowLeft className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden xl:inline ml-2 gap-4 font-medium text-lg">{label}</span>
    </button>
  );
};

export default BackButton;