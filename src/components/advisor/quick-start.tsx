'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PlatformId, platforms, campaignGoals, CampaignGoal } from '@/lib/ad-platforms';
import SampleReportDialog from '@/components/sample-report-dialog';
import {
  ArrowRight, Check, Sparkles, Target, DollarSign,
  AlertTriangle, Zap, TrendingUp, BarChart3, Lightbulb,
  Facebook, Search, Youtube, Linkedin, Pin, RotateCcw,
  CheckCircle2, XCircle, Clock, Shield, Eye, MousePointerClick,
  UserPlus, Smartphone, Flame, PiggyBank, Rocket, Star,
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
  { id: 'high_cpa', label: 'High CPA', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'text-red-500' },
  { id: 'low_ctr', label: 'Low CTR', icon: <MousePointerClick className="w-3.5 h-3.5" />, color: 'text-orange-500' },
  { id: 'low_roas', label: 'Low ROAS', icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-amber-500' },
  { id: 'no_conversions', label: 'No conversions', icon: <Target className="w-3.5 h-3.5" />, color: 'text-rose-500' },
  { id: 'wasted_spend', label: 'Wasted spend', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-600' },
  { id: 'unsure_platform', label: 'Wrong platform', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-blue-500' },
  { id: 'bad_creatives', label: 'Poor creatives', icon: <Lightbulb className="w-3.5 h-3.5" />, color: 'text-yellow-500' },
  { id: 'no_strategy', label: 'No strategy', icon: <BarChart3 className="w-3.5 h-3.5" />, color: 'text-purple-500' },
];

interface ActionItem {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedImpact: string;
  icon: React.ReactNode;
}

interface QuickInsights {
  actionItems: ActionItem[];
  budgetAssessment: { status: 'low' | 'moderate' | 'strong'; message: string; recommendation: string };
  estimatedSavings: string;
  estimatedROASBoost: string;
  platformSummary: { name: string; avgCPC: string; avgCPM: string; audienceSize: string; minBudget: string }[];
  goalMetrics: string[];
  painRemedies: { pain: string; fix: string }[];
}

/* ───── Main Quick Checkup Component ───── */
export default function QuickStart({ onGoToPlanner, onDismiss }: { onGoToPlanner: () => void; onDismiss: () => void }) {
  const [step, setStep] = useState<QuickStep>('details');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<CampaignGoal | ''>('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedPains, setSelectedPains] = useState<string[]>([]);

  const selectedGoals = campaignGoals as unknown as Record<string, (typeof campaignGoals)[CampaignGoal]>;

  const canGetInsights = selectedPlatforms.length > 0 && selectedGoal !== '' && selectedBudget !== '';

  const insights = useMemo<QuickInsights | null>(() => {
    if (!canGetInsights) return null;

    const selectedPlatformData = selectedPlatforms.map(id => platforms[id]);
    const goalData = selectedGoals[selectedGoal as CampaignGoal];
    const budgetRange = budgetRanges.find(b => b.id === selectedBudget)!;
    const budgetMid = Math.round((budgetRange.min + budgetRange.max) / 2);
    const dailyBudget = Math.round(budgetMid / 30);
    const perPlatformDaily = Math.round(dailyBudget / selectedPlatforms.length);
    const minDailyFromPlatforms = Math.min(...selectedPlatformData.map(p => {
      const match = p.minBudget.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 5;
    }));

    const platformSummary = selectedPlatformData.map(p => ({
      name: p.name,
      avgCPC: p.avgCPC,
      avgCPM: p.avgCPM,
      audienceSize: p.audienceSize,
      minBudget: p.minBudget,
    }));

    const goalMetrics = goalData.keyMetrics;

    let budgetStatus: 'low' | 'moderate' | 'strong';
    let budgetMessage: string;
    let budgetRecommendation: string;

    if (perPlatformDaily < minDailyFromPlatforms) {
      budgetStatus = 'low';
      budgetMessage = `~$${perPlatformDaily}/day per platform is below the $${minDailyFromPlatforms}/day minimum.`;
      budgetRecommendation = `Start with ${selectedPlatforms.length === 1 ? 'a higher budget' : 'fewer platforms'} to concentrate spend.`;
    } else if (perPlatformDaily < minDailyFromPlatforms * 3) {
      budgetStatus = 'moderate';
      budgetMessage = `~$${perPlatformDaily}/day per platform is workable for testing.`;
      budgetRecommendation = 'Start with 1-2 ad sets, run 7 days, then optimize.';
    } else {
      budgetStatus = 'strong';
      budgetMessage = `~$${perPlatformDaily}/day per platform — great for testing multiple strategies.`;
      budgetRecommendation = 'Allocate 60% to winners, 30% to new tests, 10% to experiments.';
    }

    const monthlyBudget = budgetMid;
    let estimatedSavings: string;
    let estimatedROASBoost: string;

    if (monthlyBudget < 500) {
      estimatedSavings = `$${Math.round(monthlyBudget * 0.3)}–$${Math.round(monthlyBudget * 0.5)}`;
      estimatedROASBoost = '1.5x–2x';
    } else if (monthlyBudget < 2000) {
      estimatedSavings = `$${Math.round(monthlyBudget * 0.25)}–$${Math.round(monthlyBudget * 0.4)}`;
      estimatedROASBoost = '2x–3x';
    } else if (monthlyBudget < 10000) {
      estimatedSavings = `$${Math.round(monthlyBudget * 0.2)}–$${Math.round(monthlyBudget * 0.35)}`;
      estimatedROASBoost = '2.5x–4x';
    } else {
      estimatedSavings = `$${Math.round(monthlyBudget * 0.15)}–$${Math.round(monthlyBudget * 0.3)}`;
      estimatedROASBoost = '3x–5x';
    }

    const actionItems: ActionItem[] = [];

    if (budgetStatus === 'low') {
      actionItems.push({
        title: 'Consolidate your budget',
        description: `Drop to ${selectedPlatforms.length > 1 ? '1 platform' : 'a higher budget tier'} to hit the minimum effective spend. Spread too thin = no data, no learning.`,
        impact: 'high',
        estimatedImpact: `Save ${estimatedSavings}/mo from eliminated waste`,
        icon: <PiggyBank className="w-5 h-5" />,
      });
    } else if (perPlatformDaily >= minDailyFromPlatforms * 3) {
      actionItems.push({
        title: 'Launch a 60/30/10 test framework',
        description: '60% budget to proven creatives, 30% to new angles, 10% to wild experiments. This structure alone improves ROAS by 30-40%.',
        impact: 'high',
        estimatedImpact: `${estimatedROASBoost} potential ROAS improvement`,
        icon: <Rocket className="w-5 h-5" />,
      });
    } else {
      actionItems.push({
        title: 'Set up conversion tracking before spending',
        description: `${selectedPlatformData.map(p => p.name).join(', ')} — install the pixel/tag and verify events fire. Without this, the platform algorithm is blind.`,
        impact: 'high',
        estimatedImpact: `${estimatedSavings}/mo wasted without tracking`,
        icon: <Target className="w-5 h-5" />,
      });
    }

    const creativeTip = selectedPlatformData[0]?.tips?.[2] || 'Test 5+ ad creatives per campaign to find winners';
    actionItems.push({
      title: 'Fix your creative strategy',
      description: creativeTip.split('.').slice(0, 2).join('.') + '. Most advertisers test too few creatives — aim for 5-10 variations per campaign.',
      impact: 'medium',
      estimatedImpact: '20-35% lower CPA with better creatives',
      icon: <Lightbulb className="w-5 h-5" />,
    });

    const goalName = goalData.name;
    const relevantMetrics = goalData.keyMetrics.slice(0, 2).join(' and ');
    actionItems.push({
      title: `Optimize for ${relevantMetrics} weekly`,
      description: `For ${goalName}, focus on ${relevantMetrics}. Let campaigns run 7 days before making changes — premature optimization kills performance.`,
      impact: 'low',
      estimatedImpact: '15-25% improvement over 30 days',
      icon: <TrendingUp className="w-5 h-5" />,
    });

    const painRemedies = selectedPains.map(painId => {
      const pain = painPoints.find(p => p.id === painId)!;
      switch (painId) {
        case 'high_cpa':
          return { pain: pain.label, fix: 'Use lookalike audiences from best customers, tighten targeting, switch to conversion-optimized bidding.' };
        case 'low_ctr':
          return { pain: pain.label, fix: 'Refresh creatives — UGC content, stronger hooks in first 1-2 seconds, clear CTAs. Test different headlines.' };
        case 'low_roas':
          return { pain: pain.label, fix: 'Audit targeting for waste, add retargeting for warm audiences, optimize landing pages.' };
        case 'no_conversions':
          return { pain: pain.label, fix: 'Verify tracking is installed. Match landing pages to ad promises. Use lead forms to reduce friction.' };
        case 'wasted_spend':
          return { pain: pain.label, fix: 'Add negative keywords, set frequency caps, exclude converted audiences, audit overlap.' };
        case 'unsure_platform':
          return { pain: pain.label, fix: selectedPlatformData.map(p => `${p.name}: best for ${p.bestFor.slice(0, 3).join(', ')}`).join('. ') + '.' };
        case 'bad_creatives':
          return { pain: pain.label, fix: 'Use native formats (UGC for TikTok, carousels for Meta). Test 5-10 per campaign, refresh every 2-3 weeks.' };
        case 'no_strategy':
          return { pain: pain.label, fix: 'Build a funnel: awareness → consideration → conversion. Set KPIs per stage. Use the Campaign Planner for details.' };
        default:
          return { pain: pain.label, fix: 'Use the Campaign Planner for a personalized strategy.' };
      }
    });

    return {
      actionItems,
      budgetAssessment: { status: budgetStatus, message: budgetMessage, recommendation: budgetRecommendation },
      estimatedSavings,
      estimatedROASBoost,
      platformSummary,
      goalMetrics,
      painRemedies,
    };
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
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-3 tracking-wide uppercase">
                <Clock className="w-3 h-3" />
                Takes 15 seconds
              </div>
              <h1 className="text-section-title sm:text-xl mb-1">
                Quick Campaign Checkup
              </h1>
              <p className="text-caption">
                3 questions. Instant results. No sign-up.
              </p>
            </div>

            {/* Progress Indicator — 3 steps */}
            <div className="flex items-center justify-center mb-6">
              {[
                { done: selectedPlatforms.length > 0, label: 'Platform' },
                { done: selectedGoal !== '', label: 'Objective' },
                { done: selectedBudget !== '', label: 'Budget' },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className={cn('step-circle', s.done ? 'step-circle-done' : 'step-circle-pending')}>
                    {s.done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={cn('text-[11px] font-medium hidden sm:block mx-1.5', s.done ? 'text-emerald-600' : 'text-muted-foreground')}>
                    {s.label}
                  </span>
                  {i < 2 && <div className={cn('step-line', s.done ? 'step-line-active' : '')} />}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {/* 1. Platform */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                    selectedPlatforms.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    1
                  </div>
                  <h2 className="font-semibold text-sm">Which platform(s)?</h2>
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
                  <h2 className="font-semibold text-sm">Primary objective?</h2>
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
                  <h2 className="font-semibold text-sm">Monthly ad budget?</h2>
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

              {/* CTA + Sample Report */}
              <div className="flex flex-col items-center pt-2 pb-6 gap-3">
                {/* Back link */}
                <button onClick={onDismiss} className="text-xs text-muted-foreground hover:text-foreground transition-colors self-start">
                  &larr; Back to home
                </button>

                {/* CTA + Sample side by side */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGetInsights}
                    disabled={!canGetInsights}
                    className="btn-primary gap-2 px-8 h-11 text-sm rounded-xl inline-flex items-center disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4" />
                    Get My Quick Insights
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <SampleReportDialog>
                    <button className="gap-1.5 px-3 h-11 text-xs font-medium rounded-xl inline-flex items-center border border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">See sample</span>
                    </button>
                  </SampleReportDialog>
                </div>
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
            className="space-y-5 pb-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3 tracking-wide uppercase">
                <CheckCircle2 className="w-3 h-3" />
                Results ready
              </div>
              <h1 className="text-section-title sm:text-xl mb-1">
                Your Campaign Insights
              </h1>
              <p className="text-caption">
                {insights.platformSummary.map(p => p.name).join(', ')} &middot; {selectedGoals[selectedGoal as CampaignGoal]?.name} &middot; {budgetRanges.find(b => b.id === selectedBudget)?.label}
              </p>
            </div>

            {/* Impact Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-4 text-center">
                <PiggyBank className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Est. Monthly Savings</p>
                <p className="text-lg font-bold text-emerald-700 mt-0.5">{insights.estimatedSavings}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 text-center">
                <TrendingUp className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
                <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">ROAS Improvement</p>
                <p className="text-lg font-bold text-amber-700 mt-0.5">{insights.estimatedROASBoost}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 text-center col-span-2 sm:col-span-1">
                <Flame className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                <p className="text-[10px] text-blue-600 font-medium uppercase tracking-wider">Top Priority</p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">{insights.actionItems[0]?.title}</p>
              </div>
            </div>

            {/* 3 Prioritized Action Items */}
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-500" />
                3 Actions to Improve Now — Ranked by Impact
              </h3>
              <div className="space-y-3">
                {insights.actionItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all',
                      item.impact === 'high' && 'border-amber-300 bg-amber-50/50',
                      item.impact === 'medium' && 'border-blue-200 bg-blue-50/50',
                      item.impact === 'low' && 'border-muted bg-muted/30',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        item.impact === 'high' && 'bg-amber-100 text-amber-600',
                        item.impact === 'medium' && 'bg-blue-100 text-blue-600',
                        item.impact === 'low' && 'bg-muted text-muted-foreground',
                      )}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold">{`#${i + 1}`}</span>
                          <Badge variant="secondary" className={cn('text-[9px] border-0 font-semibold',
                            item.impact === 'high' && 'bg-amber-100 text-amber-700',
                            item.impact === 'medium' && 'bg-blue-100 text-blue-700',
                            item.impact === 'low' && 'bg-muted text-muted-foreground',
                          )}>
                            {item.impact.toUpperCase()} IMPACT
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold mb-0.5">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{item.description}</p>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          {item.estimatedImpact}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Budget Assessment — compact */}
            <div className={cn(
              'p-4 rounded-xl border-2',
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
                <h2 className="font-bold text-sm">Budget Check</h2>
                <Badge variant="secondary" className={cn('text-[10px] border-0',
                  insights.budgetAssessment.status === 'low' && 'bg-red-100 text-red-700',
                  insights.budgetAssessment.status === 'moderate' && 'bg-amber-100 text-amber-700',
                  insights.budgetAssessment.status === 'strong' && 'bg-emerald-100 text-emerald-700',
                )}>
                  {insights.budgetAssessment.status === 'low' ? 'Needs Attention' : insights.budgetAssessment.status === 'moderate' ? 'Workable' : 'Strong'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1.5">{insights.budgetAssessment.message}</p>
              <div className="flex items-start gap-2 bg-white/60 rounded-lg p-2.5 border">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed">{insights.budgetAssessment.recommendation}</p>
              </div>
            </div>

            {/* Platform Benchmarks + Goal Metrics — Side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border p-4">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  Platform Benchmarks
                </h3>
                <div className="space-y-2.5">
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border p-4">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Track These Metrics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {insights.goalMetrics.map(metric => (
                    <Badge key={metric} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      {metric}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-[11px] text-blue-700 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>Focus on 2-3 metrics. More dilutes optimization.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Optional: Pain Point Refiner */}
            <div className="bg-white rounded-2xl border p-4">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Also struggling with?
                <span className="text-[11px] font-normal text-muted-foreground">(optional — tap to refine)</span>
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
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

              <AnimatePresence>
                {insights.painRemedies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {insights.painRemedies.map((remedy, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/50 border border-red-100">
                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                          <XCircle className="w-3 h-3" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-red-700 block">{remedy.pain}</span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{remedy.fix}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Full Plan CTA */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1.5 mb-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-base">Want the full strategy?</h3>
                </div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  The Quick Checkup shows the tip of the iceberg. Unlock a complete AI-generated campaign plan with targeting, creatives, timeline &amp; budget allocation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onGoToPlanner}
                  className="btn-primary gap-2 flex-1 h-12 text-sm rounded-xl inline-flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Full AI Campaign Plan
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary gap-2 h-12 text-sm rounded-xl inline-flex items-center justify-center bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
