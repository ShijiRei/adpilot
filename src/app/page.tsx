'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PlatformId } from '@/lib/ad-platforms';
import AIAdvisor, { Message } from '@/components/advisor/ai-advisor';
import PlatformGuide from '@/components/advisor/platform-guide';
import BudgetCalculator from '@/components/advisor/budget-calc';
import AdCopyGenerator from '@/components/advisor/ad-copy';
import PlatformComparison from '@/components/advisor/comparison';
import GuidedPlanner from '@/components/advisor/guided-planner';
import QuickStart from '@/components/advisor/quick-start';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare, BookOpen, Calculator, Sparkles, Scale, Wand2,
  Menu, X, Zap, Target, TrendingUp, ArrowRight, CheckCircle2, Shield, Clock,
  Facebook, Search, Youtube, Linkedin, Pin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'home' | 'quickstart' | 'planner' | 'advisor' | 'guide' | 'budget' | 'copy' | 'comparison';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Zap className="w-4 h-4" />, description: 'AI ad campaign advisor for smarter spending' },
  { id: 'quickstart', label: 'Quick Checkup', icon: <Target className="w-4 h-4" />, description: '30-second campaign health check' },
  { id: 'planner', label: 'Campaign Planner', icon: <Wand2 className="w-4 h-4" />, description: 'Step-by-step guided campaign builder' },
  { id: 'advisor', label: 'AI Advisor', icon: <MessageSquare className="w-4 h-4" />, description: 'Chat with AI for campaign tips' },
  { id: 'guide', label: 'Platform Guide', icon: <BookOpen className="w-4 h-4" />, description: 'Detailed platform guides & tips' },
  { id: 'budget', label: 'Budget Calculator', icon: <Calculator className="w-4 h-4" />, description: 'Estimate costs and performance' },
  { id: 'copy', label: 'Ad Copy Generator', icon: <Sparkles className="w-4 h-4" />, description: 'Generate compelling ad copy' },
  { id: 'comparison', label: 'Compare Platforms', icon: <Scale className="w-4 h-4" />, description: 'Side-by-side platform analysis' },
];

const platformSidebarItems: { id: PlatformId; name: string; icon: React.ReactNode }[] = [
  { id: 'meta', name: 'Meta Ads', icon: <Facebook className="w-4 h-4" /> },
  { id: 'tiktok', name: 'TikTok Ads', icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15v-3.44a4.85 4.85 0 01-4.84-1.47l-.16-.16z"/></svg> },
  { id: 'google', name: 'Google Ads', icon: <Search className="w-4 h-4" /> },
  { id: 'youtube', name: 'YouTube Ads', icon: <Youtube className="w-4 h-4" /> },
  { id: 'linkedin', name: 'LinkedIn Ads', icon: <Linkedin className="w-4 h-4" /> },
  { id: 'pinterest', name: 'Pinterest Ads', icon: <Pin className="w-4 h-4" /> },
];

/* ───── Hero / Landing Section ───── */
function HeroSection({ onGetStarted, onChat }: { onGetStarted: () => void; onChat: () => void }) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Value Prop — The One-Liner */}
      <div className="text-center pt-8 sm:pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          AI-Powered Ad Campaign Advisor
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4">
          Stop wasting ad spend. Get a{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            5-minute AI campaign plan
          </span>{' '}
          with clear fixes to{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            boost ROAS
          </span>{' '}
          and{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            lower CPA
          </span>.
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          For founders, ecommerce brands, and marketers — plan, optimize, and troubleshoot ad campaigns across Meta, TikTok, Google, YouTube, LinkedIn &amp; Pinterest.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-amber-200/50"
          >
            <Wand2 className="w-5 h-5" />
            Get Quick Campaign Insights
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onChat}
            className="gap-2 h-12 px-8 text-base border-2 hover:bg-muted/50"
          >
            <MessageSquare className="w-5 h-5" />
            Chat with AI Advisor
          </Button>
        </div>

        {/* Trust Signals — Platform Logos */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10">
          {platformSidebarItems.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5 text-muted-foreground/60 text-sm">
              {p.icon}
              <span className="hidden sm:inline text-xs font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <OutcomeCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Lower Your CPA"
          description="Get platform-specific budget allocation and bidding strategies that cut cost-per-acquisition by targeting the right audience segments from day one."
          gradient="from-emerald-50 to-teal-50"
          iconBg="bg-emerald-100 text-emerald-600"
        />
        <OutcomeCard
          icon={<Shield className="w-6 h-6" />}
          title="Boost ROAS"
          description="AI-generated campaign plans with creative strategies, ad formats, and optimization playbooks tailored to maximize your return on every dollar spent."
          gradient="from-amber-50 to-orange-50"
          iconBg="bg-amber-100 text-amber-600"
        />
        <OutcomeCard
          icon={<Clock className="w-6 h-6" />}
          title="Save Hours"
          description="Skip the guesswork and research. Get a complete, actionable plan in 5 minutes — targeting, timeline, budget split, creative ideas, and optimization steps."
          gradient="from-blue-50 to-indigo-50"
          iconBg="bg-blue-100 text-blue-600"
        />
      </div>

      {/* What You Get — Feature Grid */}
      <div className="bg-white rounded-2xl border p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-6 text-center">Everything you need to launch smarter campaigns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <Wand2 className="w-5 h-5" />, title: 'Guided Campaign Planner', desc: '5-step wizard that builds a full AI campaign plan tailored to your platform, budget, industry, and country.' },
            { icon: <MessageSquare className="w-5 h-5" />, title: 'AI Campaign Advisor', desc: 'Chat with AI about targeting, bidding, creative strategy, and troubleshooting — get instant expert answers.' },
            { icon: <BookOpen className="w-5 h-5" />, title: 'Platform Deep Dives', desc: 'Detailed guides for Meta, TikTok, Google, YouTube, LinkedIn & Pinterest — tips, mistakes, and checklists.' },
            { icon: <Calculator className="w-5 h-5" />, title: 'Budget Calculator', desc: 'Estimate CPC, CTR, and expected results per platform. See how far your budget goes before spending a cent.' },
            { icon: <Sparkles className="w-5 h-5" />, title: 'Ad Copy Generator', desc: 'Generate headlines, body copy, and CTAs in multiple tones — professional, casual, bold, or inspirational.' },
            { icon: <Scale className="w-5 h-5" />, title: 'Platform Comparison', desc: 'Side-by-side comparison of costs, audience sizes, strengths, and weaknesses to pick the right platform.' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-0.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Trust Signals */}
      <div className="text-center pb-8">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Free to use
          <span className="mx-1">·</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          No sign-up required
          <span className="mx-1">·</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Results in under 5 minutes
        </div>
      </div>
    </div>
  );
}

function OutcomeCard({ icon, title, description, gradient, iconBg }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
}) {
  return (
    <div className={cn('p-5 rounded-2xl border bg-gradient-to-br', gradient)}>
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-3', iconBg)}>
        {icon}
      </div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chat state lives here so it persists across tab switches
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm **AdBot**, your personal ad campaign advisor. I can help you plan, optimize, and troubleshoot campaigns across all major platforms.

**Ask me anything about:**
- Setting up your first campaign
- Platform selection and strategy
- Budget planning and optimization
- Targeting and audience strategies
- Ad creative best practices
- Common mistakes to avoid

How can I help you today?`,
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const handlePlatformSelect = (id: PlatformId) => {
    setSelectedPlatform(id);
    setActiveTab('guide');
  };

  const currentPlatformName = platformSidebarItems.find(p => p.id === selectedPlatform)?.name;

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r flex flex-col transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">AdPilot</h1>
              <p className="text-xs text-muted-foreground">Campaign Advisor</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden p-1 rounded-md hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Tools
            </p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  activeTab === item.id
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  activeTab === item.id
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {item.icon}
                </span>
                <div className="text-left">
                  <span className="block">{item.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{item.description}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Quick Select Platform
            </p>
            {platformSidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePlatformSelect(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  selectedPlatform === item.id
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.icon}
                <span>{item.name}</span>
                {selectedPlatform === item.id && (
                  <Badge variant="secondary" className="ml-auto text-[10px] bg-amber-100 text-amber-700 border-0">Active</Badge>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold">Pro Tip</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select a platform above to get personalized tips, checklists, and AI-powered advice.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <h2 className="font-semibold text-sm">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {navItems.find((n) => n.id === activeTab)?.description}
                {selectedPlatform && ` — ${currentPlatformName}`}
              </p>
            </div>

            {/* Chat message count badge */}
            {chatMessages.length > 1 && activeTab !== 'advisor' && (
              <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200 cursor-pointer" onClick={() => setActiveTab('advisor')}>
                <MessageSquare className="w-3 h-3 mr-1" />
                {chatMessages.length - 1} messages
              </Badge>
            )}

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                6 Platforms
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium">
                <Zap className="w-3.5 h-3.5" />
                AI-Powered
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'home' && (
                <HeroSection onGetStarted={() => setActiveTab('quickstart')} onChat={() => setActiveTab('advisor')} />
              )}

              {activeTab === 'quickstart' && (
                <QuickStart
                  onGoToPlanner={() => setActiveTab('planner')}
                  onDismiss={() => setActiveTab('home')}
                />
              )}

              {activeTab === 'planner' && (
                <GuidedPlanner />
              )}

              {activeTab === 'advisor' && (
                <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border shadow-sm">
                  {/* AI Advisor Header */}
                  <div className="px-4 py-3 border-b flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">AdBot — AI Campaign Advisor</h3>
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Online — Ready to help
                      </p>
                    </div>
                    {selectedPlatform && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {currentPlatformName}
                      </Badge>
                    )}
                  </div>
                  <AIAdvisor
                    selectedPlatform={currentPlatformName}
                    campaignGoal="conversions"
                    messages={chatMessages}
                    setMessages={setChatMessages}
                    isLoading={chatLoading}
                    setIsLoading={setChatLoading}
                  />
                </div>
              )}

              {activeTab === 'guide' && (
                <PlatformGuide
                  selectedPlatform={selectedPlatform}
                  onPlatformSelect={setSelectedPlatform}
                />
              )}

              {activeTab === 'budget' && (
                <BudgetCalculator selectedPlatform={selectedPlatform} />
              )}

              {activeTab === 'copy' && (
                <AdCopyGenerator selectedPlatform={selectedPlatform} />
              )}

              {activeTab === 'comparison' && (
                <PlatformComparison />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
