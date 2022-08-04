import React from 'react';

interface Props {
  height?: number;
  width?: number;
  className?: string;
  onClick?: () => void;
  ref?: any
  id?: string
}

export default function EditIcon({ width, height, className, onClick, ref, id }: Props) {
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
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
  );
}