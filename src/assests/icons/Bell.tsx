import React from 'react';

interface Props {
  height?: number;
  width?: number;
  className?: string;
  onClick?: () => void;
  ref?: any
  id?: string
}

export default function Bell({ width, height, className, onClick, ref, id }: Props) {
  return (
    <svg
      // style={{ margin: 0 }}
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
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  );
}



