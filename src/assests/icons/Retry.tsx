import React from 'react';

interface Props {
  height?: number;
  width?: number;
  className?: string;
  onClick?: () => void;
}

export default function RetryIcon({ width, height, className, onClick }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className ? className : "h-6 w-6"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="#4ae288"
      strokeWidth={2}
      onClick={onClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}



