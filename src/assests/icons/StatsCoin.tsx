import React from 'react';

interface Props {
  height?: number;
  width?: number;
  className?: string;
  onClick?: () => void;
}

export default function StatsCoin({ width, height, className, onClick }: Props) {
  return (
    <svg
      className={className}
      width={width ? width : 383}
      height={height ? height : 391}
      viewBox="0 0 340 300"
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      onClick={onClick}
    >
      <defs>
        <path
          d="M135.48 170.196c60.934.016 110.326-21.272 110.319-47.549-.007-26.276-49.41-45.782-110.345-45.798-60.935-.017-110.327 19.462-110.32 45.739.007 26.276 49.41 47.591 110.345 47.608z"
          id="a"
        />
        <filter
          x="-3.4%"
          y="-8.0%"
          width="106.8%"
          height="116.1%"
          filterUnits="objectBoundingBox"
          id="b"
        >
          <feOffset
            dx={15}
            dy={1}
            in="SourceAlpha"
            result="shadowOffsetInner1"
          />
          <feComposite
            in="shadowOffsetInner1"
            in2="SourceAlpha"
            operator="arithmetic"
            k2={-1}
            k3={1}
            result="shadowInnerInner1"
          />
          <feColorMatrix
            values="0 0 0 0 0.147300769 0 0 0 0 0.186014662 0 0 0 0 0.250537817 0 0 0 0.316133086 0"
            in="shadowInnerInner1"
          />
        </filter>
        <path
          d="M0 0c5.339 13.265 13.249 19.898 23.729 19.898 10.48 0 18.39-6.633 23.729-19.898H0z"
          id="c"
        />
      </defs>
      <g
        transform="translate(-1062 -657) rotate(67 166.426 1331.408)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path
          d="M38.744 112.214l258.665.07.01 35.749a51.326 51.326 0 01-11.605 32.52c-20.127 24.608-60.286 36.904-120.474 36.888-58.424-.016-96.885-11.622-115.383-34.817a51.345 51.345 0 01-11.203-32l-.01-38.41z"
          fill="#32435D"
          transform="rotate(-39 168.083 164.827)"
        />
        <path
          d="M137.166 184.86c71.428.019 129.325-26.537 129.316-59.315-.008-32.779-57.919-57.11-129.347-57.128-71.428-.02-129.326 24.28-129.317 57.058.009 32.778 57.92 59.366 129.348 59.385z"
          fill="#384A66"
          transform="rotate(-39 137.15 126.638)"
        />
        <g transform="rotate(-39 135.466 123.522)">
          <use fill="#32435D" xlinkHref="#a" />
          <use fill="#000" filter="url(#b)" xlinkHref="#a" />
        </g>
        <ellipse
          fill="#1A2C38"
          transform="rotate(-39 151.673 91.682)"
          cx={151.673294}
          cy={91.6821779}
          rx={7.27015955}
          ry={5.74092453}
        />
        <ellipse
          fill="#1A2C38"
          transform="rotate(-39 100.515 133.087)"
          cx={100.515001}
          cy={133.086547}
          rx={7.27015955}
          ry={5.74092453}
        />
        <g transform="rotate(-39 262.042 -99.038)">
          <mask id="d" fill="#fff">
            <use xlinkHref="#c" />
          </mask>
          <use fill="#1A2C38" xlinkHref="#c" />
          <ellipse
            fill="#263349"
            mask="url(#d)"
            cx={16.1253252}
            cy={30.021996}
            rx={33.4900295}
            ry={27.1108933}
          />
        </g>
      </g>
    </svg>
  );
}
