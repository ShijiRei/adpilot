'use client';

import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Star, PiggyBank, TrendingUp, Flame, CheckCircle2, Target, Lightbulb, Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const sampleActions = [
  {
    title: 'Install Meta Pixel & verify events',
    description: 'Set up the pixel on your site and confirm Purchase, AddToCart, and Lead events fire correctly. Without this, the algorithm can\'t optimize.',
    impact: 'high' as const,
    estimatedImpact: 'Save $500–$2,800/mo wasted without tracking',
    icon: <Target className="w-5 h-5" />,
  },
  {
    title: 'Test 5-10 UGC-style creatives',
    description: 'Use authentic, user-generated style content. Hook viewers in the first 1-2 seconds. Most advertisers test too few.',
    impact: 'medium' as const,
    estimatedImpact: '20-35% lower CPA with better creatives',
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    title: 'Optimize for CPA & ROAS weekly',
    description: 'Focus on conversions and return on ad spend. Let campaigns run 7 days before making changes.',
    impact: 'low' as const,
    estimatedImpact: '15-25% improvement over 30 days',
    icon: <TrendingUp className="w-5 h-5" />,
  },
];

export default function SampleReportDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto p-0">
        <div className="p-5 pb-2">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Sample Report Preview
            </DialogTitle>
            <DialogDescription className="text-xs">
              Here&apos;s what your personalized report looks like. Interactive — try checking off the actions.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-5 pb-5">
          <SampleReportContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SampleReportContent() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggleCheck = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Sample context badge */}
      <div className="flex items-center justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-semibold">
          Meta Ads &middot; Conversions &middot; $2,000 – $10,000/mo
        </span>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-3 text-center">
          <PiggyBank className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-[9px] text-emerald-600 font-medium uppercase tracking-wider">Est. Savings</p>
          <p className="text-base font-bold text-emerald-700">$500–$2,800</p>
          <p className="text-[9px] text-emerald-500">per month</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-3 text-center">
          <TrendingUp className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-[9px] text-amber-600 font-medium uppercase tracking-wider">ROAS Boost</p>
          <p className="text-base font-bold text-amber-700">2x–3x</p>
          <p className="text-[9px] text-amber-500">improvement</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-3 text-center">
          <Flame className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-[9px] text-blue-600 font-medium uppercase tracking-wider">Top Fix</p>
          <p className="text-[11px] font-bold text-blue-700 mt-0.5">Install Pixel</p>
          <p className="text-[9px] text-blue-500">tracking first</p>
        </div>
      </div>

      {/* Action Items with checkboxes */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="font-bold text-xs flex items-center gap-2 mb-3 text-gray-700">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          3 Actions — Ranked by Impact
          <span className="text-[9px] font-normal text-gray-400 ml-auto">tap checkboxes to try</span>
        </h3>
        <div className="space-y-2.5">
          {sampleActions.map((item, i) => (
            <div
              key={i}
              className={cn(
                'p-3 rounded-xl border-2 transition-all',
                checked.has(i)
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : item.impact === 'high'
                    ? 'border-amber-300 bg-amber-50/50'
                    : item.impact === 'medium'
                      ? 'border-blue-200 bg-blue-50/50'
                      : 'border-gray-200 bg-gray-50/50',
              )}
            >
              <div className="flex items-start gap-2.5">
                {/* Checkbox */}
                <button
                  onClick={() => toggleCheck(i)}
                  className="mt-0.5 shrink-0 transition-transform active:scale-90"
                >
                  {checked.has(i) ? (
                    <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-gray-300 hover:border-amber-400 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Badge variant="secondary" className={cn('text-[8px] border-0 font-semibold',
                      item.impact === 'high' && 'bg-amber-100 text-amber-700',
                      item.impact === 'medium' && 'bg-blue-100 text-blue-700',
                      item.impact === 'low' && 'bg-gray-100 text-gray-500',
                    )}>
                      {item.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                  <h4 className={cn('text-xs font-bold mb-0.5', checked.has(i) && 'line-through text-gray-400')}>
                    {item.title}
                  </h4>
                  <p className={cn('text-[10px] leading-relaxed mb-1', checked.has(i) ? 'text-gray-300' : 'text-gray-500')}>
                    {item.description}
                  </p>
                  <div className={cn('flex items-center gap-1 text-[10px] font-semibold',
                    checked.has(i) ? 'text-emerald-400' : 'text-emerald-600',
                  )}>
                    <CheckCircle2 className="w-3 h-3" />
                    {item.estimatedImpact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-xl border p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-gray-500">
            {checked.size === 3 ? 'All done! Great progress.' : checked.size === 0 ? 'Start checking off actions' : `${checked.size} of 3 completed`}
          </span>
          <span className="text-[10px] font-bold text-emerald-600">{Math.round((checked.size / 3) * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(checked.size / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Note */}
      <p className="text-center text-[10px] text-gray-400 italic">
        This is a sample report. Yours will be personalized to your inputs.
      </p>
    </div>
  );
}
