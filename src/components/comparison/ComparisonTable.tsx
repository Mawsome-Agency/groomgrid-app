import React from "react";
import { Competitor } from "@/lib/comparison-data";

export interface ComparisonTableProps {
  /** Sub-set of competitors to display – usually 2-4 items */
  competitors: Competitor[];
}

/**
 * Render a responsive comparison table.
 * - First column is the feature name.
 * - Each subsequent column is a competitor.
 * - Highlighted competitor (highlight === true) gets a distinct background.
 */
export default function ComparisonTable({ competitors }: ComparisonTableProps) {
  // Build a union set of all feature strings
  const allFeatures = Array.from(
    new Set(competitors.flatMap((c) => c.features))
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-green-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-stone-700">
              Feature
            </th>
            {competitors.map((c) => (
              <th
                key={c.id}
                className={`px-4 py-3 font-medium text-stone-700 ${
                  c.highlight ? "bg-green-100" : ""
                }`}
              >
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Pricing row */}
          <tr className="bg-white">
            <td className="px-4 py-2 font-semibold">Pricing (Solo)</td>
            {competitors.map((c) => (
              <td key={c.id} className="px-4 py-2 text-center">
                {c.pricing.solo}
              </td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-2 font-semibold">Pricing (Salon)</td>
            {competitors.map((c) => (
              <td key={c.id} className="px-4 py-2 text-center">
                {c.pricing.salon}
              </td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-2 font-semibold">Pricing (Enterprise)</td>
            {competitors.map((c) => (
              <td key={c.id} className="px-4 py-2 text-center">
                {c.pricing.enterprise}
              </td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-2 font-semibold">AI-Powered Features</td>
            {competitors.map((c) => (
              <td key={c.id} className="px-4 py-2 text-center">
                {c.hasAI ? "Yes" : "No"}
              </td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-2 font-semibold">Mobile App Available</td>
            {competitors.map((c) => (
              <td key={c.id} className="px-4 py-2 text-center">
                {c.mobileApp ? "Yes" : "No"}
              </td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-2 font-semibold">QuickBooks Integration</td>
            {competitors.map((c) => (
              <td key={c.id} className="px-4 py-2 text-center">
                {c.integrations?.includes("QuickBooks") ? "Yes" : "No"}
              </td>
            ))}
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-2 font-semibold">Support Level</td>
            {competitors.map((c) => (
              <td key={c.id} className="px-4 py-2 text-center">
                {c.support || "Not specified"}
              </td>
            ))}
          </tr>
          {/* Features rows */}
          {allFeatures.map((feature) => (
            <tr key={feature} className="bg-white">
              <td className="px-4 py-2 font-medium text-stone-700">{feature}</td>
              {competitors.map((c) => (
                <td key={`${c.id}-${feature}`} className="px-4 py-2 text-center">
                  {c.features.includes(feature) ? "✓" : "✗"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
