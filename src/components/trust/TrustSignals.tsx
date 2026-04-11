"use client";

import { cn } from "@/lib/utils";
import SecureHeader from "./SecureHeader";
import PciBadge from "./PciBadge";
import PaymentMethods from "./PaymentMethods";
import CancelAnytimeBadge from "./CancelAnytimeBadge";
import { BillingSummaryData } from "./BillingSummary";
import BillingSummary from "./BillingSummary";

interface TrustSignalsProps {
  showBillingSummary?: boolean;
  billingData?: BillingSummaryData;
  location?: "plans" | "success" | "billing";
  compact?: boolean;
}

export default function TrustSignals({ 
  showBillingSummary = false,
  billingData,
  location = "plans",
  compact = false 
}: TrustSignalsProps) {
  return (
    <div className="space-y-6">
      {/* Top row: Secure Header + PCI Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <SecureHeader />
        <PciBadge location={location} />
      </div>

      {/* Payment Methods */}
      <div className="flex justify-center md:justify-start">
        <PaymentMethods compact={compact} />
      </div>

      {/* Cancel Anytime Badge */}
      <div className="flex justify-center md:justify-start">
        <CancelAnytimeBadge size="sm" />
      </div>

      {/* Billing Summary (optional) */}
      {showBillingSummary && billingData && (
        <div className="max-w-md">
          <BillingSummary data={billingData} compact={compact} />
        </div>
      )}
    </div>
  );
}
