'use client';

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  MessageSquare, BookOpen, Calculator, Sparkles, Scale, Wand2,
  Menu, X, Zap, Target, TrendingUp, ArrowRight, CheckCircle2, Shield, Clock, Eye,
  Globe, Search, Youtube, Linkedin, MapPin, Music2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabId = 'home' | 'quickstart' | 'planner' | 'advisor' | 'guide' | 'budget' | 'copy' | 'comparison';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Zap className="w-4 h-4" />, description: 'Dashboard' },
  { id: 'quickstart', label: 'Quick Checkup', icon: <Target className="w-4 h-4" />, description: '30-sec health check' },
  { id: 'planner', label: 'Campaign Planner', icon: <Wand2 className="w-4 h-4" />, description: 'AI plan builder' },
  { id: 'advisor', label: 'AI Advisor', icon: <MessageSquare className="w-4 h-4" />, description: 'Chat with AI' },
  { id: 'guide', label: 'Platform Guide', icon: <BookOpen className="w-4 h-4" />, description: 'Tips & checklists' },
  { id: 'budget', label: 'Budget Calculator', icon: <Calculator className="w-4 h-4" />, description: 'Cost estimates' },
  { id: 'copy', label: 'Ad Copy Generator', icon: <Sparkles className="w-4 h-4" />, description: 'Generate copy' },
  { id: 'comparison', label: 'Compare Platforms', icon: <Scale className="w-4 h-4" />, description: 'Side-by-side' },
];

const platformSidebarItems: { id: PlatformId; name: string; icon: React.ReactNode }[] = [
  { id: 'meta', name: 'Meta Ads', icon: <Globe className="w-4 h-4" /> },
{ id: 'pinterest', name: 'Pinterest Ads', icon: <MapPin className="w-4 h-4" /> },
  { id: 'tiktok', name: 'TikTok Ads', icon: <Music2 className="w-4 h-4" /> },
  { id: 'google', name: 'Google Ads', icon: <Search className="w-4 h-4" /> },
  { id: 'youtube', name: 'YouTube Ads', icon: <Youtube className="w-4 h-4" /> },
  { id: 'linkedin', name: 'LinkedIn Ads', icon: <Linkedin className="w-4 h-4" /> },
  { id: 'pinterest', name: 'Pinterest Ads', icon: <MapPin className="w-4 h-4" /> },
];

/* ───── Hero / Landing Section ───── */
function HeroSection({ onGetStarted, onChat }: { onGetStarted: () => void; onChat: () => void }) {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Value Prop */}
      <div className="text-center pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-6 tracking-wide uppercase">
          <Zap className="w-3.5 h-3.5" />
          AI-Powered Ad Campaign Advisor
        </div>

        <h1 className="text-hero mb-4">
          Stop wasting ad spend. Get a{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            5-minute AI plan
          </span>{' '}
          to{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            boost ROAS &amp; lower CPA
          </span>.
        </h1>

        <p className="text-body text-muted-foreground max-w-xl mx-auto mb-8">
          For founders &amp; marketers. Plan, optimize, and troubleshoot ads across Meta, TikTok, Google, YouTube, LinkedIn &amp; Pinterest.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onGetStarted}
              className="btn-primary gap-2 px-8 h-12 text-sm rounded-xl inline-flex items-center"
            >
              <Wand2 className="w-5 h-5" />
              Get Quick Insights — 15 sec
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onChat}
              className="btn-secondary gap-2 px-8 h-12 text-sm rounded-xl inline-flex items-center bg-transparent"
            >
              <MessageSquare className="w-4 h-4" />
              Chat with AI
            </button>
          </div>
          <SampleReportDialog>
            <button className="gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors inline-flex items-center">
              <Eye className="w-3.5 h-3.5" />
              See a sample report first
            </button>
          </SampleReportDialog>
        </div>

        {/* Platform Logos */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
          {platformSidebarItems.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5 text-muted-foreground/50">
              <span className="[&>svg]:w-4 [&>svg]:h-4 [&>svg]:w-auto">{p.icon}</span>
              <span className="text-xs font-medium hidden sm:inline">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <OutcomeCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Lower CPA"
          description="Platform-specific budget splits &amp; bidding to target the right segments from day one."
          gradient="from-emerald-50 to-teal-50"
          iconBg="bg-emerald-100 text-emerald-600"
        />
        <OutcomeCard
          icon={<Shield className="w-5 h-5" />}
          title="Boost ROAS"
          description="AI-generated creative strategies &amp; optimization playbooks to maximize every dollar."
          gradient="from-amber-50 to-orange-50"
          iconBg="bg-amber-100 text-amber-600"
        />
        <OutcomeCard
          icon={<Clock className="w-5 h-5" />}
          title="Save Hours"
          description="Complete actionable plan in 5 min — targeting, timeline, budget, creatives &amp; next steps."
          gradient="from-blue-50 to-indigo-50"
          iconBg="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Feature Grid */}
      <div className="bg-white rounded-2xl border p-5 sm:p-6">
        <h2 className="text-section-title mb-5 text-center">6 tools. One mission: smarter ad spend.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: <Target className="w-4 h-4" />, title: 'Quick Checkup', desc: '3 questions. Instant results with action items &amp; savings estimate.' },
            { icon: <Wand2 className="w-4 h-4" />, title: 'Campaign Planner', desc: '5-step AI wizard — full plan tailored to your platform, budget &amp; country.' },
            { icon: <MessageSquare className="w-4 h-4" />, title: 'AI Advisor', desc: 'Ask anything. Get expert answers on targeting, bidding &amp; creative.' },
            { icon: <BookOpen className="w-4 h-4" />, title: 'Platform Guides', desc: 'Deep dives with tips, mistakes &amp; pre-launch checklists.' },
            { icon: <Calculator className="w-4 h-4" />, title: 'Budget Calculator', desc: 'Estimate CPC, CTR &amp; results before you spend a cent.' },
            { icon: <Sparkles className="w-4 h-4" />, title: 'Ad Copy Generator', desc: 'Headlines, body copy &amp; CTAs in 5 tones.' },
          ].map((f) => (
           <div
  key={f.title}
  className="flex items-start gap-3 p-3 rounded-xl card-interactive cursor-pointer"
  onClick={
    f.title === "Quick Checkup"
      ? onGetStarted
      : f.title === "AI Advisor"
      ? onOpenChat
      : undefined
  }
             >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-card-title">{f.title}</h3>
                <p className="text-caption mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Signals */}
      <div className="text-center pb-6">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Free
          <span className="text-border">|</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          No sign-up
          <span className="text-border">|</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Results in &lt;5 min
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
    <div className={cn('p-4 rounded-xl border bg-gradient-to-br card-interactive', gradient)}>
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', iconBg)}>
        {icon}
      </div>
      <h3 className="text-card-title">{title}</h3>
      <p className="text-caption mt-1">{description}</p>
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
      content: `Hi! I'm **BoosterBot**, your personal ad campaign advisor. I can help you plan, optimize, and troubleshoot campaigns across all major platforms.

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
              <h1 className="font-bold text-lg leading-tight">BoosterBuzz</h1>
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
        <div className="p-3 border-t">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-semibold">Pro Tip</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Pick a platform below for personalized tips &amp; checklists.
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
                      <h3 className="font-semibold text-sm">BoosterBot — AI Campaign Advisor</h3>
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
