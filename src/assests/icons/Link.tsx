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

export default function LinkIcon({ width, height, className, onClick, ref, id, color }: Props) {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
