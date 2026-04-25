'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { PlatformId, platforms } from '@/lib/ad-platforms';

interface AdCopyProps {
  selectedPlatform: PlatformId | null;
}

interface GeneratedCopy {
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
}

const ctaOptions: Record<string, string[]> = {
  meta: ['Shop Now', 'Learn More', 'Sign Up', 'Get Started', 'Book Now', 'Download', 'Contact Us', 'Get Offer'],
  tiktok: ['Shop Now', 'Learn More', 'Download Now', 'Sign Up', 'See More', 'Get Started'],
  google: ['Buy Now', 'Get a Quote', 'Sign Up', 'Learn More', 'Contact Us', 'Apply Now', 'Get Started'],
  youtube: ['Learn More', 'Shop Now', 'Sign Up', 'Visit Website', 'Download', 'Get Started'],
  linkedin: ['Learn More', 'Register', 'Request Demo', 'Contact Us', 'Sign Up', 'Get Started'],
  pinterest: ['Shop Now', 'Discover', 'Get Inspired', 'Buy Now', 'Save', 'Explore'],
};

const toneStyles = [
  { id: 'professional', name: 'Professional', description: 'Formal, authoritative tone' },
  { id: 'casual', name: 'Casual', description: 'Friendly, conversational tone' },
  { id: 'urgent', name: 'Urgent', description: 'Time-limited, fomo-driven' },
  { id: 'emotional', name: 'Emotional', description: 'Story-driven, empathy-based' },
  { id: 'humorous', name: 'Humorous', description: 'Light, witty, entertaining' },
];

export default function AdCopyGenerator({ selectedPlatform }: AdCopyProps) {
  const [platform, setPlatform] = useState<string>(selectedPlatform || 'meta');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [offer, setOffer] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const platformData = platforms[platform as PlatformId];

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Generate ad copy for a ${platformData.name} campaign with the following details:
- Product/Service Name: ${productName}
- Product Description: ${productDescription || 'Not specified'}
- Special Offer: ${offer || 'None'}
- Tone: ${tone}
- Platform: ${platformData.name}

Please provide the ad copy in the following exact JSON format (no markdown, just plain JSON):
{
  "headline": "A compelling headline (max 40 characters for search, 125 for social)",
  "primaryText": "The main ad body text (2-3 sentences, include benefits and CTA)",
  "description": "Short description for below the headline (max 80 chars)",
  "cta": "Best call-to-action button text for this platform and offer"
}

Make it ${tone}, attention-grabbing, and platform-appropriate. Include specific benefits, not just features.`,
            },
          ],
          selectedPlatform: platformData.name,
          campaignGoal: 'conversions',
        }),
      });

      const data = await response.json();

      try {
        // Try to extract JSON from the response
        const jsonMatch = data.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setGeneratedCopy(parsed);
        } else {
          // Fallback: create a structured copy from the text
          setGeneratedCopy({
            headline: productName,
            primaryText: data.message,
            description: data.message.slice(0, 80),
            cta: ctaOptions[platform]?.[0] || 'Learn More',
          });
        }
      } catch {
        setGeneratedCopy({
          headline: productName,
          primaryText: data.message,
          description: data.message.slice(0, 80),
          cta: ctaOptions[platform]?.[0] || 'Learn More',
        });
      }
    } catch {
      // Generate a fallback copy
      const tonePrefix = tone === 'urgent' ? 'Limited Time!' : tone === 'casual' ? 'Hey!' : tone === 'humorous' ? 'Seriously...' : '';
      setGeneratedCopy({
        headline: `${tonePrefix} ${productName} — ${offer || 'Try it today'}`,
        primaryText: `${productDescription || productName} is here to transform the way you work. ${offer ? `Special offer: ${offer}.` : ''} Don't miss out on this incredible opportunity to upgrade your experience. Join thousands of satisfied customers who have already made the switch.`,
        description: `${productName} | ${offer || 'Special offer available now'}`,
        cta: ctaOptions[platform]?.[0] || 'Learn More',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          Ad Copy Generator
        </h2>
        <p className="text-muted-foreground mt-1">
          Generate compelling ad copy tailored to your platform and audience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Details</CardTitle>
            <CardDescription>Fill in the details about your product and campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
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
              <Label htmlFor="product-name">Product / Service Name *</Label>
              <input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., FitTrack Pro Smartwatch"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-desc">Product Description</Label>
              <Textarea
                id="product-desc"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your product, its benefits, and what makes it unique..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer">Special Offer / Discount</Label>
              <input
                id="offer"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="e.g., 30% off, Free trial, Buy one get one free"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {toneStyles.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`p-2 rounded-lg border text-left transition-all text-xs ${
                      tone === t.id
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-border hover:border-amber-200'
                    }`}
                  >
                    <span className="font-medium block">{t.name}</span>
                    <span className="text-muted-foreground">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!productName.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Ad Copy
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Output */}
        <div className="space-y-4">
          {generatedCopy ? (
            <>
              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Generated Copy
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">{platformData.name}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview Card */}
                  <div className="rounded-xl border p-4 bg-background space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {platformData.name.charAt(0)}
                      </span>
                      <span>{platformData.name} Sponsored</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm">{generatedCopy.headline}</p>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">{generatedCopy.cta}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{generatedCopy.primaryText}</p>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{platformData.name.toLowerCase()}.com</p>
                        <p className="text-xs text-muted-foreground">{generatedCopy.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Copy Sections */}
                  <div className="space-y-3">
                    <CopyField
                      label="Headline"
                      value={generatedCopy.headline}
                      fieldId="headline"
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                    <CopyField
                      label="Primary Text"
                      value={generatedCopy.primaryText}
                      fieldId="primaryText"
                      copiedField={copiedField}
                      onCopy={handleCopy}
                      isLong
                    />
                    <CopyField
                      label="Description"
                      value={generatedCopy.description}
                      fieldId="description"
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                    <CopyField
                      label="CTA Button"
                      value={generatedCopy.cta}
                      fieldId="cta"
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                onClick={handleGenerate}
                className="w-full"
                disabled={isGenerating}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No Copy Generated Yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Fill in your campaign details and click &quot;Generate&quot; to create compelling ad copy tailored to your platform.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyField({
  label,
  value,
  fieldId,
  copiedField,
  onCopy,
  isLong = false,
}: {
  label: string;
  value: string;
  fieldId: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
  isLong?: boolean;
}) {
  return (
    <div className="p-3 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <button
          onClick={() => onCopy(value, fieldId)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copiedField === fieldId ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <p className={`text-sm ${isLong ? 'leading-relaxed' : ''}`}>{value}</p>
    </div>
  );
}
