## Design Spec: Session Expiration Handling with User Notification

### Component Hierarchy
```
RootLayout
└── SessionProvider
    └── ABTestProvider
        ├── ...app content...
        └── SessionExpirationDetector
            └── SessionExpirationModal
                ├── Extend Button
                └── Logout Button
```

### Screen States

#### SessionExpirationDetector
- **Empty state**: Not authenticated - renders nothing
- **Loading state**: Checking session status - renders nothing
- **Partial data state**: Session detected but >5 minutes until expiry - renders nothing
- **Full data state**: Session detected and ≤5 minutes until expiry - renders SessionExpirationModal
- **Error state**: Authentication error - renders nothing (handled by NextAuth)

#### SessionExpirationModal
- **Empty state**: Initial render with timeUntilExpiry=0 - displays 00:00 countdown
- **Loading state**: During session extension request - shows "Extending..." button state
- **Partial data state**: Countdown timer actively counting down - displays dynamic time
- **Full data state**: Modal fully rendered with all controls - displays formatted time and buttons
- **Error state**: Session extension failed - shows error message below title

### Responsive Behavior
- **Mobile (< 640px)**: 
  - Modal takes full width with 1rem padding on sides
  - Buttons stack vertically
  - Font sizes slightly reduced for better fit
  
- **Tablet (640-1024px)**: 
  - Modal maintains max-width of 30rem
  - Buttons remain side-by-side
  - Standard font sizing
  
- **Desktop (> 1024px)**: 
  - Same as tablet but with potential for larger max-width if needed
  - Consistent styling across devices

### Interactive Elements

#### SessionExpirationDetector
- **Session polling**: Checks session expiry every 30 seconds
- **Modal trigger**: Automatically shows modal when session expires in ≤5 minutes

#### SessionExpirationModal
- **Extend Button**:
  - Click: Calls parent's onExtend handler
  - Hover: Background darkens slightly
  - Focus: Visible focus ring
  - Disabled state: Shows "Extending..." text and disabled cursor
  - Loading state: Shows spinner animation
  - Error state: Returns to enabled state after error

- **Logout Button**:
  - Click: Calls signOut and redirects to login
  - Hover: Background lightens slightly
  - Focus: Visible focus ring

- **Modal Container**:
  - Click outside: Does NOT close modal (security consideration)
  - Escape key: Does NOT close modal (security consideration)
  - Auto-close: Modal automatically closes after 60 seconds of inactivity

- **Countdown Timer**:
  - Updates every second
  - Auto-logout triggers at 0 seconds
  - Visual feedback decreases as time approaches 0

#### Animations
- **Modal entrance**: Fade in with slight scale transform (200ms ease-out)
- **Button interactions**: Subtle background color transitions (150ms ease-in-out)
- **Countdown urgency**: Text color changes to red when under 60 seconds
- **Error display**: Slide down animation when appearing (300ms ease-out)

### Accessibility Requirements

#### Keyboard Navigation
- Modal traps focus on open
- Extend button is first focusable element
- Tab order: Extend button → Logout button → Close (implicit)
- Escape key does NOT close modal (security requirement)
- Enter key triggers focused button

#### Screen Reader Support
- Modal has proper role="dialog" and aria-modal="true"
- Title referenced by aria-labelledby
- Description referenced by aria-describedby
- Live region announces countdown every minute
- Error messages announced via aria-live="assertive"
- All buttons have descriptive aria-labels

#### Color Contrast
- Text: Minimum 4.5:1 contrast ratio against backgrounds
- Buttons: Sufficient contrast for all states
- Error messages: High contrast red (#DC2626) on light background
- Focus indicators: Visible against all backgrounds

#### Focus Management
- Focus moves to modal when opened
- Focus returns to last focused element when closed
- No keyboard traps beyond modal
- Visual focus indicators on all interactive elements
