'use client';

import { useState } from 'react';
import { PlatformId, platforms, campaignGoals, CampaignGoal, industryBenchmarks } from '@/lib/ad-platforms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Facebook, Search, Youtube, Linkedin, Pin, TrendingUp,
  Users, DollarSign, Target, Eye, MousePointerClick, UserPlus,
  Smartphone, ChevronRight, Check, AlertTriangle, Info, BarChart3
} from 'lucide-react';

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

interface PlatformGuideProps {
  selectedPlatform: PlatformId | null;
  onPlatformSelect: (id: PlatformId) => void;
}

export default function PlatformGuide({ selectedPlatform, onPlatformSelect }: PlatformGuideProps) {
  const [selectedGoal, setSelectedGoal] = useState<CampaignGoal | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const platform = selectedPlatform ? platforms[selectedPlatform] : null;

  if (!selectedPlatform || !platform) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-500" />
            Platform Guide
          </h2>
          <p className="text-muted-foreground mt-1">
            Select a platform from the sidebar to see detailed guides, tips, and best practices.
          </p>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(platforms).map((p) => (
            <Card
              key={p.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-transparent hover:border-amber-200"
              onClick={() => onPlatformSelect(p.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-white',
                    `bg-gradient-to-br ${p.bgGradient}`
                  )}>
                    {platformIcons[p.icon]}
                  </div>
                  <div>
                    <CardTitle className="text-base group-hover:text-amber-600 transition-colors">
                      {p.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{p.audienceSize}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {p.description.slice(0, 120)}...
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">CPC: <strong>{p.avgCPC}</strong></span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Benchmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Industry Benchmarks
            </CardTitle>
            <CardDescription>Average performance metrics across industries to help set realistic expectations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(industryBenchmarks).map(([industry, data]) => (
                <div key={industry} className="p-4 rounded-xl border bg-card">
                  <h4 className="font-semibold text-sm mb-2">{industry}</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. CPA</span>
                      <span className="font-medium">{data.avgCPA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. ROAS</span>
                      <span className="font-medium text-emerald-600">{data.avgROAS}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. CTR</span>
                      <span className="font-medium">{data.avgCTR}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Header */}
      <div className={cn(
        'rounded-2xl p-6 text-white bg-gradient-to-br',
        platform.bgGradient
      )}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
            {platformIcons[platform.icon]}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{platform.name}</h2>
            <p className="text-white/80 text-sm">{platform.audienceSize}</p>
          </div>
        </div>
        <p className="text-white/90 text-sm leading-relaxed">{platform.description}</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
            CPC: {platform.avgCPC}
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
            CPM: {platform.avgCPM}
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
            Min Budget: {platform.minBudget}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
          <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {platform.bestFor.map((item) => (
                    <Badge key={item} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ad Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {platform.adFormats.map((item) => (
                    <Badge key={item} variant="outline">{item}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {platform.keyFeatures.map((item) => (
                    <li key={item} className="text-sm flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Target Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {platform.targetDemographics.map((item) => (
                    <li key={item} className="text-sm flex items-start gap-2">
                      <Users className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-base text-emerald-700">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {platform.pros.map((item) => (
                    <li key={item} className="text-sm flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-red-700">Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {platform.cons.map((item) => (
                    <li key={item} className="text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                Expert Tips for {platform.name}
              </CardTitle>
              <CardDescription>Proven strategies to get the most out of your campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {platform.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mistakes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from others&apos; failures to save time and money.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {platform.commonMistakes.map((mistake, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm">{mistake}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                Pre-Launch Checklist
              </CardTitle>
              <CardDescription>Complete every item before launching your {platform.name} campaign.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChecklistItems items={platform.checklist} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Campaign Goals</CardTitle>
                <CardDescription>
                  Choose a goal to see specific strategy recommendations for {platform.name}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.values(campaignGoals).map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all hover:shadow-md',
                        selectedGoal === goal.id
                          ? 'border-amber-400 bg-amber-50 shadow-md'
                          : 'border-border hover:border-amber-200'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-amber-500">{goalIcons[goal.icon]}</div>
                        <span className="font-medium text-sm">{goal.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{goal.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedGoal && (
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {goalIcons[campaignGoals[selectedGoal].icon]}
                    <span className="text-amber-600">{campaignGoals[selectedGoal].name} Strategy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Metrics to Track</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaignGoals[selectedGoal].keyMetrics.map((metric) => (
                        <Badge key={metric} variant="outline">{metric}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Strategy Tips</h4>
                    <ul className="space-y-2">
                      {campaignGoals[selectedGoal].tips.map((tip, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChecklistItems({ items }: { items: string[] }) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const toggleItem = (item: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };
  const progress = items.length > 0 ? (checkedItems.size / items.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{checkedItems.size} of {items.length} completed</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="space-y-2 mt-4">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggleItem(item)}
            className="flex items-start gap-3 p-3 rounded-xl border w-full text-left transition-all hover:bg-muted/50"
          >
            <div className={cn(
              'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
              checkedItems.has(item)
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-muted-foreground/30'
            )}>
              {checkedItems.has(item) && <Check className="w-3 h-3" />}
            </div>
            <span className={cn(
              'text-sm',
              checkedItems.has(item) && 'line-through text-muted-foreground'
            )}>
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
