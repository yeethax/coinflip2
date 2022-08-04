import React from 'react';

interface Props {
  height?: number;
  width?: number;
  className?: string;
  onClick?: () => void;
  ref?: any
  id?: string
  color?: string
}

export default function BookIcon({ width, height, className, onClick, ref, id, color }: Props) {
  return (
    <svg
      // style={{ margin: 0 }}
      className={className ? className : "h-6 w-6"}
      width={width ? width : 24}
      height={height ? height : 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      stroke={color ? color : "currentColor"}
      strokeWidth="2"
      ref={ref}
      id={id}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}