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

export default function ArrowDownIcon({ width, height, className, onClick, ref, id, color }: Props) {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}