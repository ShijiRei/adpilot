'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlatformId, platforms, industryBenchmarks } from '@/lib/ad-platforms';
import { Calculator, TrendingUp, TrendingDown, Info, Lightbulb } from 'lucide-react';

interface BudgetCalcProps {
  selectedPlatform: PlatformId | null;
}

const parseRange = (range: string): [number, number] => {
  const parts = range.split('-').map((s) => parseFloat(s.replace(/[^0-9.]/g, '')));
  return [parts[0], parts[1]];
};

export default function BudgetCalculator({ selectedPlatform }: BudgetCalcProps) {
  const [platform, setPlatform] = useState<string>(selectedPlatform || '');
  const [industry, setIndustry] = useState<string>('E-commerce');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(500);
  const [campaignGoal, setCampaignGoal] = useState<string>('conversions');
  const [audienceSize, setAudienceSize] = useState<number>(50000);

  const effectivePlatform = platform || selectedPlatform || 'meta';
  const platformData = platforms[effectivePlatform as PlatformId];
  const cpcRange = parseRange(platformData.avgCPC);
  const avgCpc = (cpcRange[0] + cpcRange[1]) / 2;
  const benchmarks = industryBenchmarks[industry];

  const estimates = useMemo(() => {
    const dailyBudget = monthlyBudget / 30;
    const estimatedClicks = Math.floor(dailyBudget / avgCpc * 30);
    const estimatedImpressions = Math.floor(estimatedClicks / 0.02); // ~2% avg CTR
    const ctrRange = benchmarks.avgCTR.split('-').map((s) => parseFloat(s.replace('%', '').trim()));
    const avgCtr = ((ctrRange[0] + ctrRange[1]) / 2) / 100;
    const betterClicks = Math.floor(dailyBudget / avgCpc * 30 * 1.3);
    const worseClicks = Math.floor(dailyBudget / avgCpc * 30 * 0.7);

    return {
      dailyBudget: Math.round(dailyBudget * 100) / 100,
      estimatedClicks,
      estimatedImpressions,
      betterClicks,
      worseClicks,
      estimatedCTR: avgCtr * 100,
      weeklyClicks: Math.floor(estimatedClicks / 4.3),
    };
  }, [monthlyBudget, avgCpc, benchmarks, audienceSize]);

  const recs = useMemo(() => {
    const result: string[] = [];

    if (monthlyBudget < 100) {
      result.push('Consider starting with at least $100/month for meaningful results across any platform.');
    }
    if (monthlyBudget >= 100 && monthlyBudget < 500) {
      result.push('Focus on 1-2 platforms maximum. Quality over quantity at this budget level.');
    }
    if (monthlyBudget >= 500 && monthlyBudget < 2000) {
      result.push('Good budget for testing. Allocate 70% to proven campaigns, 30% to experiments.');
    }
    if (monthlyBudget >= 2000) {
      result.push('At this level, consider multi-platform strategy with dedicated landing pages per campaign.');
    }

    if (campaignGoal === 'awareness') {
      result.push('For awareness campaigns, expect higher impressions but lower direct conversions.');
    }
    if (campaignGoal === 'conversions') {
      result.push('Conversion campaigns require proper pixel/tag setup. Budget at least $300/month.');
    }
    if (audienceSize < 10000) {
      result.push('Your target audience is quite small. Consider broadening targeting or lookalike audiences.');
    }

    const dailyBudget = monthlyBudget / 30;
    const minBudget = parseFloat(platformData.minBudget.replace(/[^0-9.]/g, ''));
    if (dailyBudget < minBudget) {
      result.push(`${platformData.name} recommends a minimum of ${platformData.minBudget} per day for optimal results.`);
    }

    return result;
  }, [monthlyBudget, campaignGoal, audienceSize, platformData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="w-6 h-6 text-amber-500" />
          Budget Calculator
        </h2>
        <p className="text-muted-foreground mt-1">
          Estimate your campaign performance based on platform, industry, and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={effectivePlatform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(platforms).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(industryBenchmarks).map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Campaign Goal</Label>
                <Select value={campaignGoal} onValueChange={setCampaignGoal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Website Traffic</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="sales">Sales & Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Monthly Budget</Label>
                  <span className="text-sm font-bold text-amber-600">${monthlyBudget.toLocaleString()}</span>
                </div>
                <Slider
                  value={[monthlyBudget]}
                  onValueChange={([val]) => setMonthlyBudget(val)}
                  min={50}
                  max={10000}
                  step={50}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$50</span>
                  <span>$10,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Target Audience Size</Label>
                  <span className="text-sm font-medium">{audienceSize.toLocaleString()}</span>
                </div>
                <Slider
                  value={[audienceSize]}
                  onValueChange={([val]) => setAudienceSize(val)}
                  min={1000}
                  max={1000000}
                  step={1000}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1K</span>
                  <span>1M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Estimated Performance
              </CardTitle>
              <CardDescription>
                Based on {platformData.name} benchmarks for the {industry} industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl bg-background">
                  <p className="text-2xl font-bold text-amber-600">${estimates.dailyBudget}</p>
                  <p className="text-xs text-muted-foreground mt-1">Daily Budget</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-background">
                  <p className="text-2xl font-bold">{estimates.estimatedClicks.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly Clicks</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-background">
                  <p className="text-2xl font-bold">{estimates.estimatedImpressions.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Est. Impressions</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-background">
                  <p className="text-2xl font-bold text-emerald-600">{estimates.estimatedCTR.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg. CTR</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl border bg-background">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Optimistic
                  </div>
                  <p className="text-lg font-bold text-emerald-600">{estimates.betterClicks.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">clicks/month</p>
                </div>
                <div className="p-3 rounded-xl border bg-background">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <Info className="w-4 h-4 text-blue-500" />
                    Expected
                  </div>
                  <p className="text-lg font-bold">{estimates.estimatedClicks.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">clicks/month</p>
                </div>
                <div className="p-3 rounded-xl border bg-background">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    Conservative
                  </div>
                  <p className="text-lg font-bold text-red-600">{estimates.worseClicks.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">clicks/month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{industry} Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">{benchmarks.avgCPA}</p>
                  <p className="text-xs text-muted-foreground">Avg. CPA</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-600">{benchmarks.avgROAS}</p>
                  <p className="text-xs text-muted-foreground">Avg. ROAS</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{benchmarks.avgCTR}</p>
                  <p className="text-xs text-muted-foreground">Avg. CTR</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recs.length > 0 && (
            <Card className="border-amber-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recs.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="flex-shrink-0 text-xs">{i + 1}</Badge>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
