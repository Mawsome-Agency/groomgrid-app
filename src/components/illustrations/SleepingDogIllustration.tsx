export function SleepingDogIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-32 h-32 mx-auto"
    >
      {/* Sleeping Z's */}
      <text x="150" y="50" fill="#9ca3af" fontSize="20" fontWeight="bold">Z</text>
      <text x="165" y="40" fill="#9ca3af" fontSize="16" fontWeight="bold">z</text>
      <text x="175" y="30" fill="#9ca3af" fontSize="12" fontWeight="bold">z</text>

      {/* Dog body - sleeping position */}
      <ellipse cx="100" cy="120" rx="50" ry="30" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />

      {/* Head */}
      <ellipse cx="60" cy="100" rx="25" ry="22" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />

      {/* Ears */}
      <ellipse cx="40" cy="85" rx="12" ry="18" transform="rotate(-20 40 85)" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />
      <ellipse cx="80" cy="85" rx="12" ry="18" transform="rotate(20 80 85)" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />

      {/* Eye closed */}
      <path d="M 50 100 Q 55 95 60 100" stroke="#5c4033" strokeWidth="2" fill="none" />
      <path d="M 65 100 Q 70 95 75 100" stroke="#5c4033" strokeWidth="2" fill="none" />

      {/* Nose */}
      <ellipse cx="60" cy="108" rx="6" ry="5" fill="#5c4033" />

      {/* Front legs folded under */}
      <ellipse cx="70" cy="135" rx="10" ry="8" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />
      <ellipse cx="130" cy="135" rx="10" ry="8" fill="#f5d0a9" stroke="#d97706" strokeWidth="2" />

      {/* Tail curled */}
      <path d="M 145 120 Q 160 115 155 125" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
