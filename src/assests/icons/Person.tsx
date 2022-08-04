import React from 'react';

interface Props {
  height?: number;
  width?: number;
  className?: string;
  onClick?: () => void;
  ref?: any
  id?: string
}

export default function Person({ width, height, className, onClick, ref, id }: Props) {
  return (
    <svg
      className={className ? className : "h-5 w-5"}
      width={width ? width : 20}
      height={height ? height : 20}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      ref={ref}
      id={id}
    >
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
    </svg>
  );
}