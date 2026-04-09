export function PawPrintsIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-32 h-32 mx-auto"
    >
      {/* Large main pad */}
      <ellipse cx="100" cy="130" rx="35" ry="25" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />

      {/* Toe pads */}
      <ellipse cx="60" cy="80" rx="15" ry="12" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />
      <ellipse cx="85" cy="65" rx="14" ry="11" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />
      <ellipse cx="115" cy="65" rx="14" ry="11" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />
      <ellipse cx="140" cy="80" rx="15" ry="12" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />

      {/* Pad details - small circles on each toe */}
      <circle cx="60" cy="80" r="5" fill="#d97706" opacity="0.3" />
      <circle cx="85" cy="65" r="4" fill="#d97706" opacity="0.3" />
      <circle cx="115" cy="65" r="4" fill="#d97706" opacity="0.3" />
      <circle cx="140" cy="80" r="5" fill="#d97706" opacity="0.3" />

      {/* Main pad detail */}
      <circle cx="100" cy="130" r="10" fill="#d97706" opacity="0.3" />
    </svg>
  );
}
