/**
 * Centralised data for BOFU comparison pages.
 * Keep this file lightweight – only static data required for rendering.
 * If pricing changes, edit this file and redeploy – no DB migration needed.
 */

export interface PricingTier {
  solo: string;      // e.g. "$29/mo"
  salon: string;      // e.g. "$79/mo"
  enterprise: string; // e.g. "$149/mo"
}

export interface Competitor {
  id: string;               // stable identifier (e.g. "moego")
  name: string;             // display name
  pricing: PricingTier;      // monthly price strings
  features: string[];        // bullet list of core features
  hasAI?: boolean;          // true for GroomGrid only
  highlight?: boolean;       // true for GroomGrid (to style first column)
  integrations?: string[];   // List of integrations (QuickBooks, etc.)
  support?: string;          // Support level (24/7, email-only, etc.)
  mobileApp?: boolean;       // Whether they have a mobile app
}

/**
 * Exported constant used by the ComparisonTable component.
 */
export const COMPETITORS: Competitor[] = [
  {
    id: "groomgrid",
    name: "GroomGrid",
    pricing: { solo: "$29/mo", salon: "$79/mo", enterprise: "$149/mo" },
    features: [
      "AI-driven scheduling",
      "Automated reminders",
      "Mobile-first UI",
      "Client & pet profiles",
      "Secure payments",
      "Real-time analytics",
    ],
    hasAI: true,
    highlight: true,
    integrations: ["QuickBooks", "Square", "Stripe"],
    support: "24/7 chat and email",
    mobileApp: true,
  },
  {
    id: "moego",
    name: "MoeGo",
    pricing: { solo: "$99/mo", salon: "$199/mo", enterprise: "$299/mo" },
    features: [
      "Standard scheduling",
      "Email reminders",
      "Web-only UI",
      "Basic client database",
      "Stripe integration",
    ],
    integrations: ["QuickBooks"],
    support: "Email only",
    mobileApp: false,
  },
  {
    id: "daysmart",
    name: "DaySmart Pet",
    pricing: { solo: "$79/mo", salon: "$149/mo", enterprise: "$249/mo" },
    features: [
      "Calendar sync",
      "Reminder emails",
      "Multi-location support",
      "Reporting dashboard",
      "Phone support",
    ],
    integrations: ["QuickBooks", "Xero"],
    support: "Phone and email",
    mobileApp: true,
  },
  {
    id: "pawfinity",
    name: "Pawfinity",
    pricing: { solo: "$59/mo", salon: "$119/mo", enterprise: "$199/mo" },
    features: [
      "Simple booking",
      "SMS reminders",
      "Pet notes",
      "Basic reporting",
      "Community forum",
    ],
    integrations: [],
    support: "Community forum only",
    mobileApp: false,
  },
];
