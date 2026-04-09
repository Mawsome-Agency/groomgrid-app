'use client';

import { Brain, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AISuggestion } from '@/types';
import { cn } from '@/lib/utils';

interface AIMagicCardProps {
  petName: string;
  breed: string;
  suggestion: AISuggestion;
  onAccept: () => void;
  onEdit: () => void;
  className?: string;
}

export default function AIMagicCard({
  petName,
  breed,
  suggestion,
  onAccept,
  onEdit,
  className,
}: AIMagicCardProps) {
  const getRiskConfig = (risk: AISuggestion['noShowRisk']) => {
    switch (risk) {
      case 'low':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Low',
          description: 'Client has excellent attendance',
        };
      case 'med':
        return {
          icon: TrendingUp,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Medium',
          description: 'Consider sending a reminder',
        };
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'High',
          description: 'Send reminder 24h before',
        };
    }
  };

  const riskConfig = getRiskConfig(suggestion.noShowRisk);
  const RiskIcon = riskConfig.icon;

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-lg border-2 p-6 space-y-6",
      suggestion.noShowRisk === 'low' ? "border-green-200" :
      suggestion.noShowRisk === 'med' ? "border-yellow-200" : "border-red-200",
      className
    )}>
      {/* AI Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Brain className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-bold text-stone-900">AI Recommendation</h3>
          <p className="text-sm text-stone-500">
            {Math.round(suggestion.confidence * 100)}% confidence based on similar appointments
          </p>
        </div>
      </div>

      {/* Duration Recommendation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-stone-600">Recommended Duration</span>
          <span className="font-bold text-stone-900">{suggestion.durationLabel}</span>
        </div>
        <div className="bg-stone-50 rounded-lg p-3">
          <p className="text-sm text-stone-600">
            For <strong>{breed}</strong>: {suggestion.durationLabel}
          </p>
        </div>
      </div>

      {/* No-Show Risk */}
      <div className={cn(
        "rounded-xl p-4 border",
        riskConfig.bgColor,
        riskConfig.borderColor
      )}>
        <div className="flex items-start gap-3">
          <RiskIcon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", riskConfig.color)} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900">No-show Risk:</span>
              <span className={cn("font-bold uppercase text-sm", riskConfig.color)}>
                {riskConfig.label}
              </span>
            </div>
            <p className="text-sm text-stone-600 mt-1">{riskConfig.description}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-stone-100">
        <button
          onClick={onEdit}
          className="px-6 py-3 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors font-medium"
        >
          Edit Details
        </button>
        <button
          onClick={onAccept}
          className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          Accept & Book
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        AI recommends {suggestion.durationLabel} for {petName}. No-show risk is {riskConfig.label}.
      </div>
    </div>
  );
}
