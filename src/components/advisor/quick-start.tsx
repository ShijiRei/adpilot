'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PlatformId, platforms, campaignGoals, CampaignGoal } from '@/lib/ad-platforms';
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Target, DollarSign,
  AlertTriangle, Zap, TrendingUp, BarChart3, Lightbulb, ChevronRight,
  Facebook, Search, Youtube, Linkedin, Pin, RotateCcw,
  CheckCircle2, XCircle, Clock, Shield, Eye, MousePointerClick,
  UserPlus, Smartphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type QuickStep = 'details' | 'insights';

const platformIcons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="w-5 h-5" />,
  TikTok: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15v-3.44a4.85 4.85 0 01-4.84-1.47l-.16-.16z"/></svg>,
  Search: <Search className="w-5 h-5" />,
  Youtube: <Youtube className="w-5 h-5" />,
  Linkedin: <Linkedin className="w-5 h-5" />,
  Pin: <Pin className="w-5 h-5" />,
};

const goalIcons: Record<string, React.ReactNode> = {
  Eye: <Eye className="w-5 h-5" />,
  MousePointerClick: <MousePointerClick className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  UserPlus: <UserPlus className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
};

const budgetRanges = [
  { id: 'under500', label: 'Under $500/mo', min: 0, max: 499, icon: <DollarSign className="w-4 h-4" />, desc: 'Testing the waters' },
  { id: '500to2000', label: '$500 – $2,000/mo', min: 500, max: 2000, icon: <DollarSign className="w-4 h-4" />, desc: 'Growing campaigns' },
  { id: '2000to10000', label: '$2,000 – $10,000/mo', min: 2000, max: 10000, icon: <DollarSign className="w-4 h-4" />, desc: 'Scaling up' },
  { id: 'over10000', label: '$10,000+/mo', min: 10000, max: 999999, icon: <DollarSign className="w-4 h-4" />, desc: 'Enterprise level' },
];

const painPoints = [
  { id: 'high_cpa', label: 'High CPA (cost per acquisition)', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'text-red-500' },
  { id: 'low_ctr', label: 'Low CTR (click-through rate)', icon: <MousePointerClick className="w-3.5 h-3.5" />, color: 'text-orange-500' },
  { id: 'low_roas', label: 'Low ROAS (return on ad spend)', icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-amber-500' },
  { id: 'no_conversions', label: 'Not getting conversions', icon: <Target className="w-3.5 h-3.5" />, color: 'text-rose-500' },
  { id: 'wasted_spend', label: 'Wasted ad spend', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-600' },
  { id: 'unsure_platform', label: 'Unsure which platform to use', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-blue-500' },
  { id: 'bad_creatives', label: 'Poor ad creative performance', icon: <Lightbulb className="w-3.5 h-3.5" />, color: 'text-yellow-500' },
  { id: 'no_strategy', label: 'No clear strategy', icon: <BarChart3 className="w-3.5 h-3.5" />, color: 'text-purple-500' },
];

interface QuickInsights {
  platformSummary: { name: string; avgCPC: string; avgCPM: string; audienceSize: string; minBudget: string }[];
  goalMetrics: string[];
  topTips: string[];
  topMistakes: string[];
  budgetAssessment: { status: 'low' | 'moderate' | 'strong'; message: string; recommendation: string };
  painRemedies: { pain: string; fix: string }[];
  recommendedNextSteps: string[];
}

export default function QuickStart({ onGoToPlanner, onDismiss }: { onGoToPlanner: () => void; onDismiss: () => void }) {
  const [step, setStep] = useState<QuickStep>('details');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<CampaignGoal | ''>('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedPains, setSelectedPains] = useState<string[]>([]);

  const canGetInsights = selectedPlatforms.length > 0 && selectedGoal !== '' && selectedBudget !== '' && selectedPains.length > 0;

  const insights = useMemo<QuickInsights | null>(() => {
    if (!canGetInsights) return null;

    const selectedPlatformData = selectedPlatforms.map(id => platforms[id]);
    const goalData = selectedGoals[selectedGoal as CampaignGoal];
    const budgetRange = budgetRanges.find(b => b.id === selectedBudget)!;
    const budgetMid = Math.round((budgetRange.min + budgetRange.max) / 2);
    const dailyBudget = Math.round(budgetMid / 30);

    // Platform summary
    const platformSummary = selectedPlatformData.map(p => ({
      name: p.name,
      avgCPC: p.avgCPC,
      avgCPM: p.avgCPM,
      audienceSize: p.audienceSize,
      minBudget: p.minBudget,
    }));

    // Goal metrics
    const goalMetrics = goalData.keyMetrics;

    // Gather all tips and filter relevance
    const allTips = selectedPlatformData.flatMap(p => p.tips);
    const goalTips = goalData.tips;
    const topTips = [...goalTips.slice(0, 2), ...allTips.slice(0, 3)];

    // Common mistakes
    const allMistakes = selectedPlatformData.flatMap(p => p.commonMistakes);
    const topMistakes = allMistakes.slice(0, 4);

    // Budget assessment
    const minDailyFromPlatforms = Math.min(...selectedPlatformData.map(p => {
      const match = p.minBudget.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 5;
    }));
    const perPlatformDaily = Math.round(dailyBudget / selectedPlatforms.length);

    let budgetStatus: 'low' | 'moderate' | 'strong';
    let budgetMessage: string;
    let budgetRecommendation: string;

    if (perPlatformDaily < minDailyFromPlatforms) {
      budgetStatus = 'low';
      budgetMessage = `Your estimated daily budget (~$${perPlatformDaily}/day split across ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}) is below the recommended minimum of $${minDailyFromPlatforms}/day per platform.`;
      budgetRecommendation = `Consider starting with ${selectedPlatforms.length === 1 ? 'a higher budget' : 'fewer platforms'} to concentrate spend, or increase your budget to at least $${minDailyFromPlatforms * selectedPlatforms.length * 30}/mo for meaningful results.`;
    } else if (perPlatformDaily < minDailyFromPlatforms * 3) {
      budgetStatus = 'moderate';
      budgetMessage = `Your estimated daily budget (~$${perPlatformDaily}/day per platform) is within a workable range for testing and optimization.`;
      budgetRecommendation = `Start with 1-2 ad sets per platform and let campaigns run for at least 7 days before optimizing. Focus on finding winning creatives before scaling.`;
    } else {
      budgetStatus = 'strong';
      budgetMessage = `Great budget level (~$${perPlatformDaily}/day per platform) — you have enough room to test multiple creatives, audiences, and strategies simultaneously.`;
      budgetRecommendation = `Allocate 60% of budget to proven winners, 30% to testing new angles, and 10% to experimental campaigns. Use A/B testing liberally.`;
    }

    // Pain remedies
    const painRemedies = selectedPains.map(painId => {
      const pain = painPoints.find(p => p.id === painId)!;
      switch (painId) {
        case 'high_cpa':
          return { pain: pain.label, fix: 'Use lookalike audiences from your best customers, tighten targeting, and switch to conversion-optimized bidding. Test 5+ creatives to find lower-cost winners.' };
        case 'low_ctr':
          return { pain: pain.label, fix: 'Refresh ad creatives — use UGC-style content, stronger hooks in the first 1-2 seconds, and add clear CTAs. Test different headlines and imagery.' };
        case 'low_roas':
          return { pain: pain.label, fix: 'Audit your targeting for waste, implement retargeting for warm audiences, and optimize landing pages. Consider shifting budget to your best-performing platform.' };
        case 'no_conversions':
          return { pain: pain.label, fix: 'Verify conversion tracking is properly installed. Ensure landing pages match ad promises and load fast. Use lead forms to reduce friction.' };
        case 'wasted_spend':
          return { pain: pain.label, fix: 'Add negative keywords regularly, set frequency caps, exclude converted audiences, and audit audience overlap between ad sets.' };
        case 'unsure_platform':
          return { pain: pain.label, fix: selectedPlatformData.map(p => `${p.name}: best for ${p.bestFor.slice(0, 3).join(', ')}`).join('. ') + '.' };
        case 'bad_creatives':
          return { pain: pain.label, fix: 'Use platform-native formats (UGC for TikTok, carousels for Meta, text overlays on all). Test 5-10 creatives per campaign and refresh every 2-3 weeks.' };
        case 'no_strategy':
          return { pain: pain.label, fix: 'Start with a clear funnel: awareness → consideration → conversion. Set KPIs for each stage. Use the full Campaign Planner for a detailed strategy.' };
        default:
          return { pain: pain.label, fix: 'Use the full Campaign Planner to get a personalized strategy.' };
      }
    });

    // Recommended next steps
    const recommendedNextSteps = [
      'Set up conversion tracking (pixel/tag) before launching',
      'Create 3-5 ad creative variations per platform',
      'Start with 1-2 tight ad sets per platform, not broad testing',
      'Let campaigns run 7 days minimum before making changes',
      'Use the full Campaign Planner for a detailed, AI-generated strategy',
    ];

    return { platformSummary, goalMetrics, topTips, topMistakes, budgetAssessment: { status: budgetStatus, message: budgetMessage, recommendation: budgetRecommendation }, painRemedies, recommendedNextSteps };
  }, [selectedPlatforms, selectedGoal, selectedBudget, selectedPains, canGetInsights]);

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const togglePain = (id: string) => {
    setSelectedPains(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleGetInsights = () => {
    if (canGetInsights) setStep('insights');
  };

  const handleReset = () => {
    setStep('details');
    setSelectedPlatforms([]);
    setSelectedGoal('');
    setSelectedBudget('');
    setSelectedPains([]);
  };

  const selectedGoals = campaignGoals as unknown as Record<string, typeof campaignGoals[CampaignGoal]>;

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'details' ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium mb-3">
                <Clock className="w-3 h-3" />
                Takes 30 seconds
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                Quick Campaign Checkup
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Answer 4 quick questions and get instant, actionable insights — no sign-up needed.
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[
                { done: selectedPlatforms.length > 0, label: 'Platform' },
                { done: selectedGoal !== '', label: 'Objective' },
                { done: selectedBudget !== '', label: 'Budget' },
                { done: selectedPains.length > 0, label: 'Pain' },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    s.done ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                  )}>
                    {s.done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={cn('text-xs font-medium hidden sm:block', s.done ? 'text-emerald-600' : 'text-muted-foreground')}>
                    {s.label}
                  </span>
                  {i < 3 && <div className="w-6 h-0.5 bg-muted rounded-full" />}
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {/* 1. Platform */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                    selectedPlatforms.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    1
                  </div>
                  <h2 className="font-semibold text-sm">Which platform(s) are you running ads on?</h2>
                  {selectedPlatforms.length > 0 && <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-0">{selectedPlatforms.length} selected</Badge>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {Object.values(platforms).map(p => {
                    const isSelected = selectedPlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={cn(
                          'p-3 rounded-xl border-2 text-center transition-all',
                          isSelected
                            ? 'border-amber-400 bg-amber-50/80 shadow-sm'
                            : 'border-transparent bg-muted/30 hover:border-amber-200'
                        )}
                      >
                        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-white mx-auto mb-1.5', `bg-gradient-to-br ${p.bgGradient}`)}>
                          {platformIcons[p.icon]}
                        </div>
                        <span className="text-xs font-medium">{p.name.replace(' Ads', '')}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 2. Objective */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                    selectedGoal !== '' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    2
                  </div>
                  <h2 className="font-semibold text-sm">What&apos;s your primary objective?</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(campaignGoals).map(goal => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={cn(
                          'p-3 rounded-xl border-2 text-left transition-all',
                          isSelected
                            ? 'border-amber-400 bg-amber-50/80 shadow-sm'
                            : 'border-transparent bg-muted/30 hover:border-amber-200'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center mb-1.5',
                          isSelected ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'
                        )}>
                          {goalIcons[goal.icon] || <Target className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-semibold block">{goal.name}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-2">{goal.description.split('.')[0]}.</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 3. Budget Range */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                    selectedBudget !== '' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    3
                  </div>
                  <h2 className="font-semibold text-sm">What&apos;s your monthly ad budget?</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {budgetRanges.map(b => {
                    const isSelected = selectedBudget === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBudget(b.id)}
                        className={cn(
                          'p-3 rounded-xl border-2 text-center transition-all',
                          isSelected
                            ? 'border-amber-400 bg-amber-50/80 shadow-sm'
                            : 'border-transparent bg-muted/30 hover:border-amber-200'
                        )}
                      >
                        <div className={cn('mb-1', isSelected ? 'text-amber-600' : 'text-muted-foreground')}>
                          {b.icon}
                        </div>
                        <span className="text-xs font-semibold block">{b.label}</span>
                        <span className="text-[10px] text-muted-foreground">{b.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 4. Pain Points */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                    selectedPains.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    4
                  </div>
                  <h2 className="font-semibold text-sm">What&apos;s your biggest challenge right now?</h2>
                  {selectedPains.length > 0 && <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700 border-0">{selectedPains.length} selected</Badge>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {painPoints.map(pain => {
                    const isSelected = selectedPains.includes(pain.id);
                    return (
                      <button
                        key={pain.id}
                        onClick={() => togglePain(pain.id)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                          isSelected
                            ? 'border-amber-400 bg-amber-50 text-amber-700'
                            : 'border-border hover:border-amber-200 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span className={isSelected ? 'text-amber-500' : pain.color}>{pain.icon}</span>
                        {pain.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 pb-8 gap-3">
                <button onClick={onDismiss} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  &larr; Back to home
                </button>
                <Button
                  onClick={handleGetInsights}
                  disabled={!canGetInsights}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 text-base font-semibold shadow-lg shadow-amber-200/50"
                >
                  <Sparkles className="w-4 h-4" />
                  Get My Quick Insights
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : insights ? (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pb-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-3">
                <CheckCircle2 className="w-3 h-3" />
                Personalized insights ready
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                Your Quick Campaign Insights
              </h1>
              <p className="text-muted-foreground text-sm">
                Based on: {insights.platformSummary.map(p => p.name).join(', ')} &middot; {selectedGoals[selectedGoal as CampaignGoal]?.name} &middot; {budgetRanges.find(b => b.id === selectedBudget)?.label}
              </p>
            </div>

            {/* Budget Assessment — Top Priority */}
            <div className={cn(
              'p-5 rounded-2xl border-2',
              insights.budgetAssessment.status === 'low' && 'border-red-200 bg-red-50/50',
              insights.budgetAssessment.status === 'moderate' && 'border-amber-200 bg-amber-50/50',
              insights.budgetAssessment.status === 'strong' && 'border-emerald-200 bg-emerald-50/50',
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  insights.budgetAssessment.status === 'low' && 'bg-red-100 text-red-600',
                  insights.budgetAssessment.status === 'moderate' && 'bg-amber-100 text-amber-600',
                  insights.budgetAssessment.status === 'strong' && 'bg-emerald-100 text-emerald-600',
                )}>
                  {insights.budgetAssessment.status === 'low' ? <AlertTriangle className="w-4 h-4" /> : insights.budgetAssessment.status === 'moderate' ? <Shield className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <h2 className="font-bold text-sm">Budget Assessment</h2>
                <Badge variant="secondary" className={cn('text-[10px] border-0',
                  insights.budgetAssessment.status === 'low' && 'bg-red-100 text-red-700',
                  insights.budgetAssessment.status === 'moderate' && 'bg-amber-100 text-amber-700',
                  insights.budgetAssessment.status === 'strong' && 'bg-emerald-100 text-emerald-700',
                )}>
                  {insights.budgetAssessment.status === 'low' ? 'Needs Attention' : insights.budgetAssessment.status === 'moderate' ? 'Workable' : 'Strong'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{insights.budgetAssessment.message}</p>
              <div className="flex items-start gap-2 bg-white/60 rounded-lg p-3 border">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed"><strong>Recommendation:</strong> {insights.budgetAssessment.recommendation}</p>
              </div>
            </div>

            {/* Platform Benchmarks + Goal Metrics — Side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Platform Benchmarks */}
              <div className="bg-white rounded-2xl border p-5">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  Your Platform Benchmarks
                </h3>
                <div className="space-y-3">
                  {insights.platformSummary.map(p => (
                    <div key={p.name} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30">
                      <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-[10px] font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold block">{p.name}</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground mt-0.5">
                          <span>CPC: <strong className="text-foreground">{p.avgCPC}</strong></span>
                          <span>CPM: <strong className="text-foreground">{p.avgCPM}</strong></span>
                          <span>Min: <strong className="text-foreground">{p.minBudget}</strong></span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{p.audienceSize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white rounded-2xl border p-5">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Key Metrics to Track
                </h3>
                <p className="text-[11px] text-muted-foreground mb-3">
                  For {selectedGoals[selectedGoal as CampaignGoal]?.name} campaigns
                </p>
                <div className="flex flex-wrap gap-2">
                  {insights.goalMetrics.map(metric => (
                    <Badge key={metric} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      {metric}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-[11px] text-blue-700 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>Focus on 2-3 key metrics. Tracking too many dilutes optimization efforts.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Pain Point Fixes */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Fixes for Your Challenges
              </h3>
              <div className="space-y-3">
                {insights.painRemedies.map((remedy, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                      <XCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-red-700 block">{remedy.pain}</span>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{remedy.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips + Mistakes — Side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border p-5">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Quick Tips
                </h3>
                <ul className="space-y-2">
                  {insights.topTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl border p-5">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Common Mistakes to Avoid
                </h3>
                <ul className="space-y-2">
                  {insights.topMistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                      <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                <ChevronRight className="w-4 h-4 text-amber-600" />
                Recommended Next Steps
              </h3>
              <ol className="space-y-2 mb-5">
                {insights.recommendedNextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-white text-amber-700 flex items-center justify-center text-[10px] font-bold shrink-0 border border-amber-200">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={onGoToPlanner}
                  size="lg"
                  className="gap-2 flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-200/50"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Full AI Campaign Plan
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  size="lg"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
