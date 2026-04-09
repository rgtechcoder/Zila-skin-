// Premium style user/dashboard icon (SVG)
export default function PremiumUserIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="12" r="6" fill="#fff" stroke="#9B59B6" strokeWidth="2.2" />
      <path d="M6 26c0-4.418 4.477-8 10-8s10 3.582 10 8" fill="#F1267A" fillOpacity=".08" stroke="#F1267A" strokeWidth="2.2" />
      <circle cx="16" cy="12" r="2.2" fill="#F1267A" />
    </svg>
  );
}
