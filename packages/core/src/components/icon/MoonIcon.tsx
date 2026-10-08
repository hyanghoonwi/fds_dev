import React from "react";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
}

export function MoonIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 20.9987C16.9706 20.9987 21 16.9692 21 11.9987C21 11.9143 20.9988 11.8302 20.9965 11.7464C19.8634 12.5358 18.4857 12.9987 17 12.9987C13.134 12.9987 10 9.86467 10 5.99867C10 4.96596 10.2236 3.98549 10.6251 3.10303C6.30715 3.76493 3 7.49559 3 11.9987C3 16.9692 7.02944 20.9987 12 20.9987Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
