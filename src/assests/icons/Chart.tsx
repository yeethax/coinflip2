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

export default function ChartIcon({ width, height, className, onClick, ref, id, color }: Props) {
  return (
    <svg
      // style={{ margin: 0 }}
      className={className ? className : "h-6 w-6"}
      width={width ? width : 20}
      height={height ? height : 20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      ref={ref}
      id={id}
      stroke={color ? color : "currentColor"}
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );
}