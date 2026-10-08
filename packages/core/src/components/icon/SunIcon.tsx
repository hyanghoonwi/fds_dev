import type { IconProps } from "./MoonIcon";

export function SunIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12.0008 18.4984C15.5906 18.4984 18.5008 15.5883 18.5008 11.9984C18.5008 8.40859 15.5906 5.49844 12.0008 5.49844C8.41093 5.49844 5.50078 8.40859 5.50078 11.9984C5.50078 15.5883 8.41093 18.4984 12.0008 18.4984Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.1392 19.1416L19.0092 19.0116M19.0092 4.99156L19.1392 4.86156L19.0092 4.99156ZM4.85922 19.1416L4.98922 19.0116L4.85922 19.1416ZM11.9992 2.08156V2.00156V2.08156ZM11.9992 22.0016V21.9216V22.0016ZM2.07922 12.0016H1.99922H2.07922ZM21.9992 12.0016H21.9192H21.9992ZM4.98922 4.99156L4.85922 4.86156L4.98922 4.99156Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
