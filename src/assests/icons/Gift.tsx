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

export default function GiftIcon({ width, height, className, onClick, ref, id, color }: Props) {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  );
}