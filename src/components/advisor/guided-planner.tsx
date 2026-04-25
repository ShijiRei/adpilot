'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { PlatformId, platforms, campaignGoals } from '@/lib/ad-platforms';
import ReactMarkdown from 'react-markdown';
import {
  ArrowRight, ArrowLeft, Check, Loader2, Sparkles,
  Target, DollarSign, Users, Wand2, ClipboardList,
  Facebook, Search, Youtube, Linkedin, Pin, RotateCcw,
  FileText, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 1 | 2 | 3 | 4 | 5;

const platformIcons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="w-5 h-5" />,
  TikTok: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15v-3.44a4.85 4.85 0 01-4.84-1.47l-.16-.16z"/></svg>,
  Search: <Search className="w-5 h-5" />,
  Youtube: <Youtube className="w-5 h-5" />,
  Linkedin: <Linkedin className="w-5 h-5" />,
  Pin: <Pin className="w-5 h-5" />,
};

const industries = [
  'E-commerce & Retail', 'SaaS / B2B', 'Real Estate', 'Education',
  'Healthcare', 'Finance', 'Restaurants & Food', 'Fashion & Beauty',
  'Technology', 'Travel & Hospitality', 'Fitness & Wellness', 'Other',
];

const tones = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'casual', label: 'Casual', emoji: '👋' },
  { id: 'aggressive', label: 'Aggressive / Bold', emoji: '🔥' },
  { id: 'inspirational', label: 'Inspirational', emoji: '✨' },
  { id: 'educational', label: 'Educational', emoji: '📚' },
];

const stepConfig = [
  { num: 1, title: 'Choose Platform', icon: <Target className="w-4 h-4" /> },
  { num: 2, title: 'Budget & Details', icon: <DollarSign className="w-4 h-4" /> },
  { num: 3, title: 'Campaign Goal', icon: <Users className="w-4 h-4" /> },
  { num: 4, title: 'Final Details', icon: <ClipboardList className="w-4 h-4" /> },
  { num: 5, title: 'Your Campaign Plan', icon: <FileText className="w-4 h-4" /> },
];

export default function GuidedPlanner() {
  const [step, setStep] = useState<Step>(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [budget, setBudget] = useState(500);
  const [budgetPeriod, setBudgetPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [industry, setIndustry] = useState('');
  const [goalId, setGoalId] = useState<string>('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedGoalData = goalId ? campaignGoals[goalId as keyof typeof campaignGoals] : null;

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return selectedPlatforms.length > 0;
      case 2: return budget >= 50 && industry !== '';
      case 3: return goalId !== '';
      case 4: return productDescription.trim().length > 0;
      case 5: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (step < 5) setStep((step + 1) as Step);
  };

  const prevStep = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setStep(5);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms.map((id) => platforms[id].name),
          budget,
          budgetPeriod,
          industry,
          campaignGoal: goalId,
          goalName: selectedGoalData?.name || goalId,
          productDescription,
          targetAudience,
          tone,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);
      setGeneratedPlan(data.plan);
    } catch {
      setGeneratedPlan('An error occurred while generating your plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedPlatforms([]);
    setBudget(500);
    setIndustry('');
    setGoalId('');
    setProductDescription('');
    setTargetAudience('');
    setTone('professional');
    setGeneratedPlan('');
  };

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-amber-500" />
          Guided Campaign Planner
        </h2>
        <p className="text-muted-foreground mt-1">
          Follow the steps to get a personalized, AI-generated campaign plan.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {stepConfig.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => {
                  // Only allow going back to completed steps
                  if (s.num < step || s.num === step) setStep(s.num as Step);
                }}
                className="flex flex-col items-center gap-1.5 relative z-10"
                disabled={s.num > step}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2',
                    s.num < step
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : s.num === step
                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200'
                        : 'bg-white border-muted-foreground/20 text-muted-foreground'
                  )}
                >
                  {s.num < step ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-medium text-center',
                    s.num <= step ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {s.title}
                </span>
              </button>
              {i < stepConfig.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-18px]">
                  <div
                    className={cn(
                      'h-full rounded-full transition-colors duration-500',
                      s.num < step ? 'bg-emerald-400' : 'bg-muted-foreground/15'
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && (
            <Step1
              selectedPlatforms={selectedPlatforms}
              onToggle={togglePlatform}
            />
          )}
          {step === 2 && (
            <Step2
              budget={budget}
              setBudget={setBudget}
              budgetPeriod={budgetPeriod}
              setBudgetPeriod={setBudgetPeriod}
              industry={industry}
              setIndustry={setIndustry}
              selectedPlatforms={selectedPlatforms}
            />
          )}
          {step === 3 && (
            <Step3
              goalId={goalId}
              setGoalId={setGoalId}
            />
          )}
          {step === 4 && (
            <Step4
              productDescription={productDescription}
              setProductDescription={setProductDescription}
              targetAudience={setTargetAudience}
              tone={tone}
              setTone={setTone}
            />
          )}
          {step === 5 && (
            <Step5
              plan={generatedPlan}
              isGenerating={isGenerating}
              onReset={reset}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step < 5 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {step === 4 ? (
            <Button
              onClick={generatePlan}
              disabled={!canProceed() || isGenerating}
              className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Campaign Plan
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ───── Step 1: Choose Platform ───── */
function Step1({
  selectedPlatforms,
  onToggle,
}: {
  selectedPlatforms: PlatformId[];
  onToggle: (id: PlatformId) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-500" />
          Choose Your Platform(s)
        </CardTitle>
        <CardDescription>
          Select one or more platforms. We will tailor the plan to each selected platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(platforms).map((p) => {
            const isSelected = selectedPlatforms.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => onToggle(p.id)}
                className={cn(
                  'relative p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md',
                  isSelected
                    ? 'border-amber-400 bg-amber-50/80 shadow-md shadow-amber-100'
                    : 'border-transparent bg-muted/30 hover:border-amber-200'
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center text-white mb-3',
                  `bg-gradient-to-br ${p.bgGradient}`
                )}>
                  {platformIcons[p.icon]}
                </div>
                <h3 className="font-semibold text-sm mb-0.5">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.audienceSize}</p>
                <p className="text-xs text-muted-foreground mt-1">CPC: {p.avgCPC}</p>
              </button>
            );
          })}
        </div>
        {selectedPlatforms.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Selected:</span>
            {selectedPlatforms.map((id) => (
              <Badge key={id} variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                {platforms[id].name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ───── Step 2: Budget & Details ───── */
function Step2({
  budget, setBudget,
  budgetPeriod, setBudgetPeriod,
  industry, setIndustry,
  selectedPlatforms,
}: {
  budget: number;
  setBudget: (v: number) => void;
  budgetPeriod: 'monthly' | 'weekly';
  setBudgetPeriod: (v: 'monthly' | 'weekly') => void;
  industry: string;
  setIndustry: (v: string) => void;
  selectedPlatforms: PlatformId[];
}) {
  const minBudget = selectedPlatforms.length > 0
    ? Math.max(...selectedPlatforms.map((id) => parseFloat(platforms[id].minBudget.replace(/[^0-9.]/g, ''))))
    : 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-500" />
          Budget & Industry
        </CardTitle>
        <CardDescription>
          Set your budget and tell us about your industry for tailored recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Period */}
        <div className="space-y-3">
          <Label>Budget Period</Label>
          <div className="flex gap-3">
            {(['monthly', 'weekly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBudgetPeriod(period)}
                className={cn(
                  'flex-1 p-3 rounded-xl border text-center transition-all text-sm font-medium',
                  budgetPeriod === period
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-border hover:border-amber-200'
                )}
              >
                {period === 'monthly' ? 'Monthly' : 'Weekly'}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>
              {budgetPeriod === 'monthly' ? 'Monthly' : 'Weekly'} Budget
            </Label>
            <span className="text-xl font-bold text-amber-600">
              ${budget.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[budget]}
            onValueChange={([val]) => setBudget(val)}
            min={50}
            max={budgetPeriod === 'monthly' ? 25000 : 10000}
            step={50}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$50</span>
            <span>${budgetPeriod === 'monthly' ? '25,000' : '10,000'}</span>
          </div>
          {budgetPeriod === 'monthly' && selectedPlatforms.length > 0 && (
            <p className="text-xs text-muted-foreground">
              That&apos;s about <strong>${Math.round(budget / 30)}/day</strong> across {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''}
              {Math.round(budget / 30) < minBudget && (
                <span className="text-red-500 ml-1"> — below recommended minimum of ${minBudget}/day</span>
              )}
            </p>
          )}
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label>Industry</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={cn(
                  'p-2.5 rounded-xl border text-left transition-all text-sm',
                  industry === ind
                    ? 'border-amber-400 bg-amber-50 text-amber-700 font-medium'
                    : 'border-border hover:border-amber-200'
                )}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───── Step 3: Campaign Goal ───── */
function Step3({
  goalId, setGoalId,
}: {
  goalId: string;
  setGoalId: (v: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-500" />
          Campaign Goal
        </CardTitle>
        <CardDescription>
          What is the primary objective of your campaign?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(campaignGoals).map((goal) => {
            const isSelected = goalId === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setGoalId(goal.id)}
                className={cn(
                  'p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md',
                  isSelected
                    ? 'border-amber-400 bg-amber-50/80 shadow-md shadow-amber-100'
                    : 'border-transparent bg-muted/30 hover:border-amber-200'
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                  {goal.id === 'awareness' && <Target className="w-5 h-5" />}
                  {goal.id === 'traffic' && <Search className="w-5 h-5" />}
                  {goal.id === 'conversions' && <Target className="w-5 h-5" />}
                  {goal.id === 'leads' && <Users className="w-5 h-5" />}
                  {goal.id === 'app_installs' && <ChevronRight className="w-5 h-5" />}
                  {goal.id === 'sales' && <DollarSign className="w-5 h-5" />}
                </div>
                <h3 className="font-semibold text-sm mb-1">{goal.name}</h3>
                <p className="text-xs text-muted-foreground">{goal.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ───── Step 4: Final Details ───── */
function Step4({
  productDescription, setProductDescription,
  targetAudience, tone, setTone,
}: {
  productDescription: string;
  setProductDescription: (v: string) => void;
  targetAudience: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-amber-500" />
          Final Details
        </CardTitle>
        <CardDescription>
          Tell us about your product and audience for a more personalized plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="product">Product / Service Description *</Label>
          <Textarea
            id="product"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Describe what you're promoting. Include key features, benefits, and what makes it unique..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            The more detail you provide, the better your campaign plan will be.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Textarea
            id="audience"
            onChange={(e) => targetAudience(e.target.value)}
            placeholder="Who are you trying to reach? (e.g., women 25-34 interested in fitness, small business owners in the US...)"
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Campaign Tone</Label>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={cn(
                  'px-4 py-2 rounded-xl border text-sm transition-all',
                  tone === t.id
                    ? 'border-amber-400 bg-amber-50 text-amber-700 font-medium'
                    : 'border-border hover:border-amber-200'
                )}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold">Almost there!</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Click &quot;Generate Campaign Plan&quot; to get a comprehensive, AI-powered strategy tailored to your inputs. This includes budget allocation, targeting, creative ideas, timeline, and optimization tips.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───── Step 5: Generated Plan ───── */
function Step5({
  plan, isGenerating, onReset,
}: {
  plan: string;
  isGenerating: boolean;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold mb-2">Generating Your Campaign Plan</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Analyzing your inputs and crafting a personalized strategy...
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">Something went wrong. Please try again.</p>
          <Button onClick={onReset} className="mt-4 gap-2">
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-amber-200 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Your Campaign Plan
              </CardTitle>
              <CardDescription className="mt-1">
                AI-generated strategy tailored to your requirements
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button size="sm" onClick={onReset} className="gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                New Plan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="plan-content">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-amber-700">{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
                ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                h1: ({ children }) => <h1 className="text-lg font-bold mb-3 text-amber-700">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-amber-700">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-1.5">{children}</h3>,
                a: ({ children, href }) => <a href={href} className="underline text-amber-600 hover:text-amber-800">{children}</a>,
                blockquote: ({ children }) => <blockquote className="border-l-3 border-amber-300 pl-4 italic my-3 bg-amber-50/50 py-2 pr-3 rounded-r-lg">{children}</blockquote>,
              }}
            >
              {plan}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <NextStepCard num={1} title="Review & Refine" description="Go through the plan and adjust anything that doesn't fit your needs." />
            <NextStepCard num={2} title="Set Up Tracking" description="Install pixels and tracking tags on your website before launching." />
            <NextStepCard num={3} title="Create Ad Creatives" description="Design your ad visuals and copy based on the creative strategy." />
            <NextStepCard num={4} title="Launch & Monitor" description="Go live and check performance daily for the first two weeks." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NextStepCard({ num, title, description }: { num: number; title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mb-2">
        {num}
      </div>
      <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
