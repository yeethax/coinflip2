import React from 'react';

import clsxm from '@/lib/clsxm';

interface Props {
  height?: number;
  width?: number;
  className?: string;
}

export default function Logo({ width, height, className }: Props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width ? width : 403}
      height={height ? height : 55}
      className={clsxm('', className)}
      viewBox="0 0 403 69"
    >
      <defs>
        <path
          d="M30.71 45.655c12.864 0 23.293-8.775 23.293-19.599 0-10.823-10.429-19.598-23.293-19.598-12.864 0-23.293 8.775-23.293 19.598 0 10.824 10.429 19.599 23.293 19.599z"
          id="a"
        />
        <mask
          id="b"
          maskContentUnits="userSpaceOnUse"
          maskUnits="objectBoundingBox"
          x={0}
          y={0}
          width={46.5851703}
          height={39.1961017}
          fill="#fff"
        >
          <use xlinkHref="#a" />
        </mask>
        <path
          d="M0 0c1.424 4.255 3.534 6.383 6.33 6.383 2.796 0 4.906-2.128 6.33-6.383H0z"
          id="c"
        />
        <filter
          x="-11.3%"
          y="-13.6%"
          width="122.6%"
          height="127.2%"
          filterUnits="objectBoundingBox"
          id="e"
        >
          <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            stdDeviation={1}
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0.872763813 0 0 0 0 0.872763813 0 0 0 0 0.872763813 0 0 0 0.5 0"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          x="-21.2%"
          y="-9.7%"
          width="142.4%"
          height="119.4%"
          filterUnits="objectBoundingBox"
          id="f"
        >
          <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            stdDeviation={1}
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0.872763813 0 0 0 0 0.872763813 0 0 0 0 0.872763813 0 0 0 0.5 0"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          x="-12.1%"
          y="-13.8%"
          width="124.2%"
          height="127.7%"
          filterUnits="objectBoundingBox"
          id="g"
        >
          <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            stdDeviation={1}
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0.872763813 0 0 0 0 0.872763813 0 0 0 0 0.872763813 0 0 0 0.5 0"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g transform="translate(3 3)">
          <ellipse
            fill="#07A05E"
            cx={30.7100476}
            cy={30.0651916}
            rx={29.1438626}
            ry={24.4975636}
          />
          <ellipse
            fill="#26E08F"
            cx={30.7100476}
            cy={26.2792046}
            rx={29.1438626}
            ry={24.4975636}
          />
          <use
            stroke="#40EDA2"
            mask="url(#b)"
            strokeWidth={2.88069729}
            strokeDasharray={2.160523018238056}
            xlinkHref="#a"
          />
          <g transform="translate(20.47 18.707)">
            <ellipse
              fill="#1A2C38"
              cx={19.4513054}
              cy={1.90660331}
              rx={1.92836217}
              ry={1.90660331}
            />
            <ellipse
              fill="#1A2C38"
              cx={1.92836217}
              cy={1.90660331}
              rx={1.92836217}
              ry={1.90660331}
            />
            <g transform="translate(4.527 8.538)">
              <mask id="d" fill="#fff">
                <use xlinkHref="#c" />
              </mask>
              <use fill="#1A2C38" xlinkHref="#c" />
              <ellipse
                fill="#DC4F58"
                mask="url(#d)"
                cx={4.30169393}
                cy={9.63082744}
                rx={8.93401249}
                ry={8.6969679}
              />
            </g>
          </g>
          <g filter="url(#e)" fill="#FFF">
            <path d="M26.26 4.416c1.069-.247 2.27-.37 3.602-.37 1.33 0 2.533.122 3.611.368a1.059 1.059 0 001.276-.837l.375-1.994A1.06 1.06 0 0034.245.34 28.835 28.835 0 0029.862 0c-1.477 0-2.967.182-4.469.546a1.058 1.058 0 00-.787 1.245l.38 1.81a1.059 1.059 0 001.274.815z" />
            <path
              d="M7.916 11.202c1.06-.24 2.252-.356 3.576-.346 1.313.01 2.504.14 3.573.394a1.057 1.057 0 001.28-.846l.36-2.012a1.059 1.059 0 00-.856-1.229l-.015-.002a28.392 28.392 0 00-4.373-.377 18.455 18.455 0 00-4.416.512c-.56.132-.913.688-.792 1.251l.396 1.849a1.06 1.06 0 001.267.806z"
              transform="rotate(-41 11.466 9.171)"
            />
            <path
              d="M-.485 25.85c1.047-.245 2.221-.366 3.523-.364 1.3.003 2.477.127 3.533.375a1.058 1.058 0 001.28-.841l.373-2.057a1.058 1.058 0 00-.857-1.227l-.017-.004a27.615 27.615 0 00-4.32-.352 18.086 18.086 0 00-4.394.544c-.552.135-.899.683-.785 1.24l.385 1.87c.12.573.68.94 1.253.821l.026-.006z"
              transform="rotate(-83 3.032 23.774)"
            />
          </g>
          <g
            filter="url(#f)"
            transform="matrix(-1 0 0 1 61.194 2.426)"
            fill="#FFF"
          >
            <path
              d="M9.581 7.187c1.055-.242 2.24-.361 3.555-.356 1.309.004 2.495.13 3.558.378a1.058 1.058 0 001.269-.795l.01-.044.365-2.005a1.057 1.057 0 00-.854-1.23l-.018-.003a28.238 28.238 0 00-4.344-.356 18.446 18.446 0 00-4.41.529 1.059 1.059 0 00-.786 1.247l.384 1.824a1.06 1.06 0 001.271.811z"
              transform="rotate(-37 13.124 5.144)"
            />
            <path
              d="M-.252 21.82c1.048-.245 2.224-.366 3.529-.364 1.298.001 2.476.124 3.532.37a1.06 1.06 0 001.282-.844l.368-2.016a1.06 1.06 0 00-.875-1.238 27.807 27.807 0 00-4.313-.347 18.222 18.222 0 00-4.392.543c-.553.134-.9.681-.786 1.239l.38 1.84a1.059 1.059 0 001.275.816z"
              transform="rotate(-80 3.272 19.755)"
            />
            <path
              d="M3.134 37.457c1.05-.248 2.226-.374 3.53-.378 1.304-.005 2.485.114 3.543.354a1.06 1.06 0 001.27-.794l.009-.039.38-2.022a1.058 1.058 0 00-.845-1.236l-.033-.006a27.881 27.881 0 00-4.31-.325c-1.46.005-2.931.193-4.416.565-.548.139-.891.683-.779 1.237l.371 1.828a1.06 1.06 0 001.28.816z"
              transform="rotate(-120 6.676 35.386)"
            />
          </g>
          <g
            filter="url(#g)"
            transform="scale(1 -1) rotate(25 147.628 4.164)"
            fill="#FFF"
          >
            <path
              d="M23.861 5.054c1.063-.245 2.256-.367 3.58-.365 1.319.002 2.513.126 3.583.372a1.058 1.058 0 001.277-.841l.37-1.993A1.058 1.058 0 0031.796.99a28.542 28.542 0 00-4.36-.346 18.69 18.69 0 00-4.437.539 1.058 1.058 0 00-.787 1.244l.381 1.811a1.057 1.057 0 001.27.816z"
              transform="rotate(-7 27.436 3.002)"
            />
            <path
              d="M8.682 12.16c1.054-.24 2.239-.358 3.554-.352 1.31.007 2.496.135 3.56.384a1.058 1.058 0 001.28-.846l.362-2a1.06 1.06 0 00-.875-1.236 28.243 28.243 0 00-4.347-.363 18.417 18.417 0 00-4.405.522c-.56.132-.91.687-.791 1.25l.387 1.828c.12.572.682.937 1.255.817l.02-.004z"
              transform="rotate(-41 12.219 10.122)"
            />
            <path
              d="M-.246 25.257c1.048-.244 2.225-.366 3.53-.363 1.3.002 2.477.126 3.533.372a1.057 1.057 0 001.27-.792l.01-.045.37-2.037a1.057 1.057 0 00-.854-1.229l-.018-.003a27.75 27.75 0 00-4.317-.35 18.175 18.175 0 00-4.394.542 1.058 1.058 0 00-.783 1.241l.38 1.844a1.057 1.057 0 001.273.82z"
              transform="rotate(-80 3.279 23.19)"
            />
          </g>
        </g>
        <text
          fontFamily="Gore-Regular, Gore"
          fontSize={40.5502804}
          fontWeight="normal"
          letterSpacing={-0.323324774}
          fill="#FFF"
          transform="translate(3 3)"
        >
          <tspan x={71.3608928} y={41.7389833}>
            {"JUST COIN FLIP"}
          </tspan>
        </text>
      </g>
    </svg>
  );
}
