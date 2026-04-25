'use client';

import { platforms } from '@/lib/ad-platforms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Scale, Check, X, Star } from 'lucide-react';

const platformList = Object.values(platforms);

export default function PlatformComparison() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Scale className="w-6 h-6 text-amber-500" />
          Platform Comparison
        </h2>
        <p className="text-muted-foreground mt-1">
          Compare advertising platforms side-by-side to find the best fit for your campaign goals.
        </p>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[140px]">Metric</TableHead>
                {platformList.map((p) => (
                  <TableHead key={p.id} className="min-w-[130px] text-center">
                    <span className="font-semibold">{p.name}</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Avg. CPC</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">{p.avgCPC}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Avg. CPM</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">{p.avgCPM}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Min. Budget</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">{p.minBudget}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Audience Size</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center text-sm">{p.audienceSize}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Best For B2B</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">
                    {p.id === 'linkedin' ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : p.id === 'google' ? <Star className="w-5 h-5 text-amber-500 mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Best For B2C</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">
                    {['meta', 'tiktok', 'pinterest', 'google'].includes(p.id)
                      ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">E-commerce</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">
                    {['meta', 'google', 'tiktok', 'pinterest'].includes(p.id)
                      ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Brand Awareness</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">
                    {['meta', 'tiktok', 'youtube', 'pinterest'].includes(p.id)
                      ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Lead Gen</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">
                    {['linkedin', 'meta', 'google'].includes(p.id)
                      ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Video Ads</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center">
                    {['tiktok', 'youtube', 'meta'].includes(p.id)
                      ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      : <Star className="w-5 h-5 text-amber-500 mx-auto" />}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="sticky left-0 bg-background z-10 font-medium">Ad Formats</TableCell>
                {platformList.map((p) => (
                  <TableCell key={p.id} className="text-center text-xs">{p.adFormats.length} formats</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Platform Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platformList.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${p.bgGradient}`} />
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description.slice(0, 100)}...</p>
              <div className="space-y-1">
                <p className="text-xs">
                  <span className="text-muted-foreground">CPC:</span>
                  <span className="font-medium ml-1">{p.avgCPC}</span>
                </p>
                <p className="text-xs">
                  <span className="text-muted-foreground">CPM:</span>
                  <span className="font-medium ml-1">{p.avgCPM}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {p.bestFor.slice(0, 3).map((item) => (
                  <Badge key={item} variant="secondary" className="text-[10px]">{item}</Badge>
                ))}
                {p.bestFor.length > 3 && (
                  <Badge variant="outline" className="text-[10px]">+{p.bestFor.length - 3}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Recommendation Guide */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="text-base">Quick Platform Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RecommendationCard
              title="Small Budget ($100-$500/mo)"
              platforms={['Meta Ads', 'TikTok Ads']}
              reason="Best cost-efficiency with broad reach. Start with Meta for proven ROI, then test TikTok for viral potential."
            />
            <RecommendationCard
              title="B2B Lead Generation"
              platforms={['LinkedIn Ads', 'Google Ads']}
              reason="LinkedIn for direct professional targeting. Google for intent-based search leads. Combine for full funnel."
            />
            <RecommendationCard
              title="E-commerce & Retail"
              platforms={['Meta Ads', 'Google Shopping', 'TikTok Ads']}
              reason="Meta for retargeting, Google Shopping for high-intent buyers, TikTok for new customer acquisition."
            />
            <RecommendationCard
              title="Brand Launch"
              platforms={['TikTok Ads', 'YouTube Ads', 'Meta Ads']}
              reason="TikTok and YouTube for massive video-based awareness. Meta for retargeting interested users."
            />
            <RecommendationCard
              title="Local Business"
              platforms={['Google Ads', 'Meta Ads']}
              reason="Google for local search visibility and Maps integration. Meta for local awareness and community engagement."
            />
            <RecommendationCard
              title="App Installs"
              platforms={['Meta Ads', 'TikTok Ads', 'Google Ads']}
              reason="Meta and Google have mature app install infrastructure. TikTok offers lower CPI for younger demographics."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecommendationCard({
  title,
  platforms,
  reason,
}: {
  title: string;
  platforms: string[];
  reason: string;
}) {
  return (
    <div className="p-4 rounded-xl border bg-card">
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1 mb-2">
        {platforms.map((p) => (
          <Badge key={p} variant="outline" className="text-xs text-amber-600 border-amber-200">{p}</Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{reason}</p>
    </div>
  );
}
