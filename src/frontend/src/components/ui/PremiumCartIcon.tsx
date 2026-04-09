// Premium style cart icon (SVG)
export default function PremiumCartIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="3" y="8" width="26" height="16" rx="6" fill="#fff" stroke="#F1267A" strokeWidth="2.2" />
      <circle cx="11" cy="24" r="2.2" fill="#fff" stroke="#9B59B6" strokeWidth="1.5" />
      <circle cx="21" cy="24" r="2.2" fill="#fff" stroke="#9B59B6" strokeWidth="1.5" />
      <path d="M8 12h16l-2 8H10l-2-8z" fill="#F1267A" fillOpacity=".08" stroke="#F1267A" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1.2" fill="#F1267A" />
    </svg>
  );
}
