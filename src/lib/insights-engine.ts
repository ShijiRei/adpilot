// AdPilot Insights Engine — Rule-based recommendation engine
// Generates personalized, specific ad campaign insights based on platform, goal, and budget.

import type { PlatformId, CampaignGoal } from '@/lib/ad-platforms';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InsightItem {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedImpact: string;
  platformContext: string;
  actionSteps: string[];
}

export interface QuickInsights {
  actionItems: InsightItem[];
  budgetAssessment: {
    status: 'low' | 'moderate' | 'strong';
    message: string;
    recommendation: string;
  };
  estimatedSavings: string;
  estimatedROASBoost: string;
  platformSummary: {
    name: string;
    avgCPC: string;
    avgCPM: string;
    audienceSize: string;
    minBudget: string;
  }[];
  goalMetrics: string[];
  painRemedies: { pain: string; fix: string }[];
}

export type BudgetId = 'under500' | '500to2000' | '2000to10000' | 'over10000';

export interface GenerateInsightsParams {
  platforms: PlatformId[];
  goal: CampaignGoal;
  budgetId: BudgetId;
  painPoints: string[];
}

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const BUDGET_RANGES: Record<BudgetId, { label: string; min: number; max: number; daily: number; dailyPerPlatform: number }> = {
  under500: { label: '$0–$499/mo', min: 0, max: 499, daily: 16, dailyPerPlatform: 5 },
  '500to2000': { label: '$500–$2,000/mo', min: 500, max: 2000, daily: 66, dailyPerPlatform: 20 },
  '2000to10000': { label: '$2,000–$10,000/mo', min: 2000, max: 10000, daily: 333, dailyPerPlatform: 55 },
  over10000: { label: '$10,000+/mo', min: 10000, max: 100000, daily: 667, dailyPerPlatform: 111 },
};

const PLATFORM_NAMES: Record<PlatformId, string> = {
  meta: 'Meta Ads',
  tiktok: 'TikTok Ads',
  google: 'Google Ads',
  youtube: 'YouTube Ads',
  linkedin: 'LinkedIn Ads',
  pinterest: 'Pinterest Ads',
};

const PLATFORM_MIN_DAILY: Record<PlatformId, number> = {
  meta: 5,
  tiktok: 20,
  google: 10,
  youtube: 10,
  linkedin: 30,
  pinterest: 5,
};

const GOAL_METRICS: Record<CampaignGoal, string[]> = {
  awareness: ['Impressions', 'Reach', 'CPM', 'Brand Lift', 'Video View Rate', 'Frequency'],
  traffic: ['Clicks', 'CTR', 'CPC', 'Bounce Rate', 'Pages/Session', 'Session Duration'],
  conversions: ['Conversions', 'CPA', 'ROAS', 'Conversion Rate', 'Cost per Acquisition', 'Revenue'],
  leads: ['Leads', 'CPL', 'Lead Quality Score', 'Form Completion Rate', 'Cost per Qualified Lead', 'Pipeline Value'],
  app_installs: ['Installs', 'CPI', 'Retention Rate', 'Cost per Install', 'Day-7 Retention', 'ROAS'],
  sales: ['Revenue', 'ROAS', 'AOV', 'Purchase Conversion Rate', 'Cost per Purchase', 'Return Rate'],
};

// ---------------------------------------------------------------------------
// Platform-layer recommendation pool
//
// Each platform has a pool of candidate recommendations keyed by goal.
// The scoring logic later picks the top 3 based on budget + pain points.
// ---------------------------------------------------------------------------

interface CandidateInsight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedImpact: (budget: BudgetId) => string;
  platformContext: string;
  actionSteps: string[];
  goals: CampaignGoal[];           // which goals this applies to
  primaryGoals: CampaignGoal[];    // strongest for these goals
  budgetPreference: BudgetId[];    // most relevant budget ranges (empty = all)
  painTriggers: string[];          // which pain points make this more relevant
}

// ── META ────────────────────────────────────────────────────────────────────

const META_CANDIDATES: CandidateInsight[] = [
  {
    title: 'Your Meta conversion campaign can\'t exit the learning phase',
    description: 'Your current daily budget is below the threshold Meta needs to optimize for conversions. Meta requires roughly 50 conversion events per week per ad set to exit the learning phase. With your budget spread thin, the algorithm has no signal to work with — meaning wasted spend and unpredictable results.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Exit learning phase 3× faster, save ~$150/mo on wasted spend',
        '500to2000': 'Exit learning phase 2× faster, save ~$300/mo on wasted spend',
        '2000to10000': 'Stable learning phase, improve ROAS by 15-20%',
        over10000: 'Maintain optimal learning phase across all ad sets, 10-15% better CPA',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Switch campaign objective to Traffic for 14 days to collect pixel data',
      'Install Meta Pixel & Conversions API — verify Purchase/Lead events fire in Events Manager',
      'Build a 1% Lookalike audience from your email list before switching back to Conversions',
    ],
    goals: ['conversions', 'sales', 'leads', 'app_installs'],
    primaryGoals: ['conversions', 'sales'],
    budgetPreference: ['under500', '500to2000'],
    painTriggers: ['no_conversions', 'wasted_spend', 'high_cpa'],
  },
  {
    title: 'Narrow your Meta targeting from 2M+ to 200–500K using interest stacking',
    description: 'Default Meta targeting casts a net of 2 million+ people — fine for $5,000/mo, but lethal for smaller budgets. With your budget, the algorithm can\'t learn fast enough across that many people. Interest stacking layers 3–5 interests to reach a focused 200–500K audience, giving the algorithm enough signal without burning through your budget on irrelevant clicks.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '30–40% lower CPA with focused audience',
        '500to2000': '25–35% lower CPA with focused audience',
        '2000to10000': '15–25% lower CPA with precise audience layers',
        over10000: '10–20% lower CPA — test Advantage+ alongside stacked audiences',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Layer 3–5 interests (e.g., Online Shopping + Your Niche + Competitor brands)',
      'Exclude ages 18–24 if your customers are 25+ — this alone can cut CPA by 20%',
      'Set ad scheduling to your peak purchase hours only (check Meta Insights → Audience)',
    ],
    goals: ['conversions', 'sales', 'leads', 'traffic', 'awareness', 'app_installs'],
    primaryGoals: ['conversions', 'sales', 'leads'],
    budgetPreference: ['under500', '500to2000'],
    painTriggers: ['high_cpa', 'low_ctr', 'wasted_spend'],
  },
  {
    title: 'You\'re likely using automatic placements — and wasting 15–20% on Audience Network',
    description: 'When you select automatic placements on Meta, your ads appear on Facebook Feed, Instagram, Messenger, and Audience Network. Audience Network alone typically has 3–5× lower conversion rates and 60% cheaper clicks — but those clicks don\'t convert. You\'re paying for volume, not results. Manually selecting only high-intent placements cuts wasted spend significantly.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Save ~$75–100/mo by cutting low-quality placements',
        '500to2000': 'Save ~$200–400/mo by cutting low-quality placements',
        '2000to10000': 'Save ~$800–1,500/mo by cutting low-quality placements',
        over10000: 'Save ~$3,000–5,000/mo — reallocate to Advantage+ Shopping',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Go to Ad Set → Placements → Manual Placements',
      'Select: Facebook Feed, Instagram Feed, Instagram Stories only',
      'After 3 days, check Placement breakdown in Ads Manager — disable any placement below 1% conversion rate',
    ],
    goals: ['conversions', 'sales', 'leads', 'traffic', 'app_installs'],
    primaryGoals: ['conversions', 'sales'],
    budgetPreference: ['under500', '500to2000', '2000to10000'],
    painTriggers: ['wasted_spend', 'low_roas', 'high_cpa'],
  },
  {
    title: 'Start with Advantage+ Shopping campaigns for product sales — not standard Conversions',
    description: 'Meta\'s Advantage+ Shopping campaign (ASC) uses the full power of their algorithm to find buyers across the entire funnel. In 2024, ASC consistently outperforms standard Conversion campaigns for e-commerce by 20–40% on ROAS because it can access 7+ audience signals simultaneously. If you\'re still using the legacy campaign structure, you\'re leaving money on the table.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '20–30% higher ROAS with less manual tweaking',
        '500to2000': '25–40% higher ROAS with less manual tweaking',
        '2000to10000': '30–45% higher ROAS — test 2–3 ASC campaigns with different creatives',
        over10000: '35–50% higher ROAS — run ASC alongside PMAX for full-funnel coverage',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Create a new Advantage+ Shopping campaign with your product catalog connected',
      'Upload 5–10 creative variations (mix of UGC, lifestyle, product-only)',
      'Let ASC run for 7 days minimum — do NOT edit during the learning period',
    ],
    goals: ['sales', 'conversions'],
    primaryGoals: ['sales'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['low_roas', 'no_conversions', 'bad_creatives'],
  },
  {
    title: 'Your Meta ad creatives are fatigued — you need 5–10 new variations this week',
    description: 'Meta\'s algorithm needs fresh creative to maintain performance. After 7–14 days, your audience has seen your ads multiple times and engagement drops 40–60%. For conversions and sales, ad fatigue directly kills your ROAS. The most common mistake is launching with 2–3 creatives and waiting too long to refresh.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Refresh to recover 30–40% of lost engagement',
        '500to2000': 'New creatives can reduce CPA by 25–35%',
        '2000to10000': 'Maintain peak ROAS — avoid the 14-day fatigue cliff',
        over10000: 'Test 10–15 new creatives per week via Dynamic Creative Optimization',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Create 5–10 new ad variations: change headlines, images, CTA buttons, and video thumbnails',
      'Use Dynamic Creative Optimization (DCO) to auto-test combinations — give it 3+ headlines, 3+ images, 2+ CTAs',
      'Archive ads with frequency > 3.0 and replace with fresh content',
    ],
    goals: ['conversions', 'sales', 'awareness', 'traffic', 'leads', 'app_installs'],
    primaryGoals: ['sales', 'conversions', 'awareness'],
    budgetPreference: [],
    painTriggers: ['bad_creatives', 'low_ctr', 'low_roas'],
  },
  {
    title: 'Build a retargeting funnel — 70% of buyers need 3–5 touchpoints before converting',
    description: 'You\'re likely sending cold traffic to a conversion campaign and expecting immediate sales. The reality: only 2–4% of first-time visitors convert. Meta\'s retargeting lets you create a full funnel — Top of Funnel for cold audiences, Middle for engaged visitors (website, video viewers), Bottom for cart abandoners. This multi-touch approach can double your conversion rate.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Split 40% TOFU / 60% retargeting — double your conversion rate',
        '500to2000': 'Full-funnel: 50% TOFU / 30% MOFU / 20% BOFU — 2–3× higher ROAS',
        '2000to10000': 'Run all 3 funnel stages with lookalike expansion — 3–4× higher ROAS',
        over10000: 'Add sequential messaging across funnel stages — 4–5× higher ROAS',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Create Custom Audience: Website Visitors (last 30 days) for retargeting',
      'Create Custom Audience: Video Viewers (50%+ watched) for warm audiences',
      'Set up separate ad sets with tailored messaging for each funnel stage',
    ],
    goals: ['conversions', 'sales', 'leads'],
    primaryGoals: ['sales', 'conversions'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['no_conversions', 'low_roas', 'high_cpa'],
  },
  {
    title: 'Your Meta ads are missing UTM parameters — you can\'t tell what\'s actually working',
    description: 'Without UTM parameters, Meta\'s reporting and Google Analytics will show conflicting numbers. You\'re essentially flying blind — you know you got conversions, but you can\'t tell which ad set, creative, or audience drove them. This makes optimization impossible and leads to wasted spend on underperforming combinations.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Identify your winning ad — save ~$50/mo by killing losers faster',
        '500to2000': 'Accurate attribution saves ~$200/mo on misallocated spend',
        '2000to10000': 'Data-driven optimization can improve ROAS by 20–30%',
        over10000: 'Enterprise-grade attribution unlocks 25–40% budget efficiency',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Add UTM parameters to every ad URL: utm_source=facebook, utm_medium=cpc, utm_campaign=[name], utm_content=[ad_name]',
      'Use a UTM builder tool or Meta\'s built-in URL parameters in the tracking section',
      'Cross-reference Meta Ads Manager with GA4 weekly — look for 20%+ discrepancies',
    ],
    goals: ['traffic', 'conversions', 'sales', 'leads'],
    primaryGoals: ['conversions', 'sales'],
    budgetPreference: [],
    painTriggers: ['no_strategy', 'wasted_spend', 'unsure_platform'],
  },
  {
    title: 'Use Conversions API (CAPI) alongside your Meta Pixel — iOS privacy is costing you 20–30% of data',
    description: 'Apple\'s ATT (App Tracking Transparency) blocks Meta Pixel from tracking roughly 25% of iOS users. The Conversions API sends conversion data server-to-server, bypassing browser restrictions. Without CAPI, you\'re losing up to 30% of your conversion signal — meaning worse optimization and higher CPA.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Recover 20–30% of lost conversion data for better optimization',
        '500to2000': 'Recover 20–30% of lost data — can lower CPA by 15–20%',
        '2000to10000': 'Full CAPI + Pixel deduplication improves ROAS by 15–25%',
        over10000: 'Server-side tracking is mandatory at scale — 20–30% better optimization',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Install Meta Conversions API (CAPI) via your website backend or use a CAPI gateway like Stape.io',
      'Verify deduplication is working: Events Manager → Test Events should show both Pixel and CAPI firing',
      'Set Event Match Quality to "Good" or "Great" for all key conversion events',
    ],
    goals: ['conversions', 'sales', 'leads', 'app_installs'],
    primaryGoals: ['conversions', 'sales', 'app_installs'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'high_cpa', 'low_roas'],
  },
  {
    title: 'Your Meta Lead Gen campaign should use native Lead Forms — not send people to your website',
    description: 'Meta\'s native Lead Forms auto-populate with the user\'s Facebook/Instagram profile data (name, email). This reduces friction dramatically — form completion rates are 2–4× higher than sending users to an external landing page. For lead gen campaigns, this is one of the biggest no-brainer optimizations available.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '2–3× more leads at the same spend — CPL drops 40–60%',
        '500to2000': '2–4× more leads at same cost — add CRM integration for instant follow-up',
        '2000to10000': 'Scale to 200+ leads/month with native forms + lookalike expansion',
        over10000: '500+ leads/month with Lead Forms + CRM auto-sync',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Select "Lead Generation" as campaign objective instead of "Traffic" or "Conversions"',
      'Create Lead Form with 3 fields max: Name, Email, and one qualifying question',
      'Connect to your CRM (HubSpot, Salesforce) via Zapier or native integration for instant follow-up',
    ],
    goals: ['leads'],
    primaryGoals: ['leads'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'high_cpa', 'low_ctr'],
  },
  {
    title: 'Your Meta awareness campaign is using the wrong objective — switch to Reach for true brand building',
    description: 'If your goal is pure awareness, the "Brand Awareness" objective optimizes for estimated ad recall lift — a metric you can\'t directly measure or act on. The "Reach" objective lets you set frequency caps and guarantee unique reach. For budget-conscious campaigns, this prevents showing the same ad 8+ times to the same person (which doesn\'t increase recall).',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '30% more unique people reached at same spend',
        '500to2000': 'Set frequency cap of 2–3 — 25% more efficient reach',
        '2000to10000': 'Reach 50K+ unique users with frequency managed',
        over10000: 'Reach 200K+ unique users with sequential creative rotation',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Switch campaign objective to "Reach" instead of "Brand Awareness"',
      'Set frequency cap to 2–3 impressions per person per week',
      'Use video ads (15–30 seconds) for highest engagement on Reach campaigns',
    ],
    goals: ['awareness'],
    primaryGoals: ['awareness'],
    budgetPreference: [],
    painTriggers: ['wasted_spend', 'no_strategy'],
  },
  {
    title: 'Use Dynamic Product Ads (DPA) to retarget people who viewed specific products',
    description: 'If someone viewed a $150 pair of shoes on your site, showing them a generic banner ad is a missed opportunity. Meta\'s Dynamic Product Ads automatically show the exact product someone browsed, added to cart, or purchased from — with the right price, image, and CTA. DPA campaigns typically achieve 3–5× higher ROAS than standard retargeting.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '3–5× higher ROAS on retargeting vs generic ads',
        '500to2000': '3–5× higher ROAS — recover 10–15% of abandoned carts',
        '2000to10000': 'Recover 15–25% of abandoned carts automatically',
        over10000: 'Automated DPA + cross-sell campaigns can drive 25–35% of total revenue',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'Connect your product catalog to Meta Commerce Manager',
      'Create a Dynamic Product Ad campaign targeting Cart Abandoners (last 7 days)',
      'Set up automatic discounts for abandoned carts (e.g., 10% off via promo code in ad)',
    ],
    goals: ['sales', 'conversions'],
    primaryGoals: ['sales'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['low_roas', 'no_conversions', 'bad_creatives'],
  },
  {
    title: 'Your Meta app install campaign should use AEO (App Events Optimization) — not installs alone',
    description: 'Optimizing for "installs" gets you downloads, but 60–80% of users churn within 3 days if they never take a meaningful in-app action. App Events Optimization (AEO) tells Meta to find users who not only install but also complete your key event — like signing up, adding a payment method, or making a first purchase. This dramatically improves post-install quality and LTV.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '30–50% higher Day-7 retention with AEO targeting',
        '500to2000': '40–60% better LTV — focus on signup or first purchase events',
        '2000to10000': 'Scale to 1,000+ high-quality installs/month with AEO + Value optimization',
        over10000: 'VO (Value Optimization) can find users with 2–3× higher LTV',
      };
      return map[b];
    },
    platformContext: 'Meta Ads',
    actionSteps: [
      'In your app install campaign, set the optimization event to a post-install action (e.g., "Complete Registration" or "Add Payment")',
      'Install Meta SDK and configure App Events for your key actions',
      'Build a 1% Lookalike audience from your highest-LTV users for the best seed data',
    ],
    goals: ['app_installs'],
    primaryGoals: ['app_installs'],
    budgetPreference: [],
    painTriggers: ['high_cpa', 'no_conversions', 'low_roas'],
  },
];

// ── GOOGLE ──────────────────────────────────────────────────────────────────

const GOOGLE_CANDIDATES: CandidateInsight[] = [
  {
    title: 'Your Google Search campaigns are using too many broad match keywords',
    description: 'Broad match keywords on Google can trigger your ads for searches only tangentially related to your business. For example, if you bid on "CRM software," broad match might show your ad for "free CRM alternatives" or "CRM vs spreadsheet." This burns through budget on irrelevant clicks that will never convert. Phrase and Exact match give you control while still reaching qualified searchers.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '35–50% lower CPL by filtering junk traffic immediately',
        '500to2000': '35–50% lower CPL — add 50+ negative keywords in week 1',
        '2000to10000': '25–40% lower CPL — use "Phrase match only" as your new default',
        over10000: '15–30% lower CPL with managed match types + broad match for discovery',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Audit your Search Terms report — add every irrelevant query as a negative keyword',
      'Convert your top 10 keywords from Broad to [Exact] and "Phrase" match',
      'Create a negative keyword list with 50+ terms (free, DIY, how to, jobs, salary, etc.)',
    ],
    goals: ['leads', 'sales', 'conversions', 'traffic'],
    primaryGoals: ['leads', 'sales', 'conversions'],
    budgetPreference: [],
    painTriggers: ['high_cpa', 'wasted_spend', 'low_ctr'],
  },
  {
    title: 'You\'re sending leads to your homepage instead of a dedicated landing page',
    description: 'Your homepage has 3–5× higher bounce rate than a dedicated landing page. When someone clicks a Google ad about "CRM for Small Business" and lands on a generic homepage, they have to figure out where to go. A dedicated landing page matches the ad copy exactly, has one clear CTA, and removes navigation distractions. This is the single biggest conversion killer in Google Ads.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '40–60% higher conversion rate on a dedicated landing page',
        '500to2000': '40–60% higher conversion rate — create 1 landing page per ad group',
        '2000to10000': '50–70% higher conversion rate with A/B tested landing pages',
        over10000: 'Enterprise landing page testing can improve conversion rate by 2–3×',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Create 1 dedicated landing page per ad group — headline must match ad headline',
      'Place your lead form or CTA button above the fold (visible without scrolling)',
      'Speed up page load to under 3 seconds — use Google PageSpeed Insights to audit',
    ],
    goals: ['leads', 'conversions', 'sales'],
    primaryGoals: ['leads', 'conversions'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'high_cpa', 'low_ctr'],
  },
  {
    title: 'Enable lead form extensions on your Google Search campaigns',
    description: 'Google\'s lead form extensions capture contact information directly within the search results page — the user doesn\'t even have to visit your website. This removes the biggest friction point (landing page load + form fill) and can boost lead volume by 20–30% at the same spend. It\'s available on both Search and Display campaigns.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '20–30% more leads at the same spend',
        '500to2000': '25–35% more leads — use with call-only extensions for dual capture',
        '2000to10000': '30–40% more leads with form + call extensions on every campaign',
        over10000: 'Scale to 500+ leads/month with form extensions + CRM auto-sync',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Navigate to your ad group → Ads & Extensions → Extensions → Lead Form Extension',
      'Ask for Name + Email only (minimum fields) — every extra field drops conversion by 10%',
      'Add lead form extensions to your call-only campaigns for dual capture (form + phone)',
    ],
    goals: ['leads'],
    primaryGoals: ['leads'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'high_cpa'],
  },
  {
    title: 'Your Quality Score is tanking your Google Ads — and you might not know it',
    description: 'Google\'s Quality Score (1–10) directly determines how much you pay per click. A Quality Score of 3 vs 8 can mean paying 2–3× more for the same ad position. Low Quality Score is caused by: poor ad relevance to keywords, low expected CTR, and slow landing page experience. At your budget level, even a 1-point Quality Score improvement saves meaningful money.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '1-point QS improvement = 15–20% lower CPC, saving ~$40–60/mo',
        '500to2000': '1-point QS improvement = 15–20% lower CPC, saving ~$150–300/mo',
        '2000to10000': '2-point QS improvement across account = 25–35% lower total spend',
        over10000: 'Account-wide QS optimization can save $3,000–8,000/mo at scale',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Check Quality Score for every keyword in your account — sort lowest first',
      'For keywords with QS < 5, rewrite ad copy to include the exact keyword in the headline',
      'Improve landing page experience: faster load time, relevant content, clear CTA above the fold',
    ],
    goals: ['leads', 'sales', 'conversions', 'traffic'],
    primaryGoals: ['leads', 'sales', 'conversions'],
    budgetPreference: [],
    painTriggers: ['high_cpa', 'wasted_spend', 'low_ctr'],
  },
  {
    title: 'Set up Performance Max (PMax) to unify your Google Ads across all inventory',
    description: 'Performance Max campaigns run your ads across Google Search, Display, YouTube, Gmail, Discover, and Maps from a single campaign. Google\'s AI optimizes budget allocation across all these placements in real time. For businesses with existing conversion data, PMax typically outperforms running separate Search, Display, and YouTube campaigns by 15–25%.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '15–20% more conversions with unified campaign vs separate campaigns',
        '500to2000': '20–30% more conversions — PMax finds cheap YouTube + Display placements',
        '2000to10000': '25–40% higher ROAS with PMax + audience signals from your best customers',
        over10000: '35–50% higher ROAS with PMax + asset-level creative testing',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Create a Performance Max campaign with your conversion goal set to Purchase or Lead',
      'Provide 15+ assets: 5 headlines, 5 descriptions, 5 images — Google auto-combines them',
      'Add audience signals: your customer email list, website visitors, and top-performing keywords',
    ],
    goals: ['sales', 'conversions', 'leads'],
    primaryGoals: ['sales', 'conversions'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['low_roas', 'no_conversions', 'unsure_platform'],
  },
  {
    title: 'Add all relevant ad extensions — they increase CTR by 10–15% and cost nothing extra',
    description: 'Google rewards ads with more extensions by giving them higher Ad Rank (which means lower CPC for better positions). Sitelinks, callouts, structured snippets, and call extensions make your ad take up more screen real estate. Most advertisers only use 1–2 extensions — using all 4 can significantly boost your visibility and CTR.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '10–15% higher CTR with all extensions enabled — same CPC',
        '500to2000': '15–20% higher CTR — extension-driven clicks often have lower CPA',
        '2000to10000': 'Combined extensions can improve CTR by 20–30% vs competitors',
        over10000: 'At scale, extension optimization drives 15–25% more total conversions',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Add 4 Sitelink Extensions (key pages: Pricing, About, Testimonials, Free Trial)',
      'Add 6 Callout Extensions (value props: "Free Shipping", "24/7 Support", "Money-Back Guarantee")',
      'Add Structured Snippet (e.g., Services: "Strategy, Execution, Analytics") and Call Extension',
    ],
    goals: ['traffic', 'leads', 'sales', 'conversions'],
    primaryGoals: ['traffic', 'leads'],
    budgetPreference: [],
    painTriggers: ['low_ctr', 'high_cpa'],
  },
  {
    title: 'Your Google Ads conversion tracking is broken — fix it before spending another dollar',
    description: 'Without accurate conversion tracking, Google\'s Smart Bidding algorithms are optimizing blind. If you\'re using "Maximize Clicks" or "Maximize Conversions" without verified conversion actions, you\'re telling Google to optimize for the wrong signal. This is the #1 reason Google Ads "doesn\'t work" for small businesses — it\'s not the ads, it\'s the tracking.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Accurate tracking enables 30–40% lower CPA via Smart Bidding',
        '500to2000': 'Fixed tracking + Smart Bidding can improve ROAS by 40–60%',
        '2000to10000': 'Full GA4 + Google Ads integration enables tCPA bidding at scale',
        over10000: 'Enterprise tracking (server-side) enables advanced bidding strategies',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'In Google Ads → Tools → Conversions, verify all conversion actions are counting',
      'Link GA4 to Google Ads and import conversion events (purchase, lead form, signup)',
      'Test with a real conversion — check "Recent Conversions" within 24 hours',
    ],
    goals: ['conversions', 'sales', 'leads', 'app_installs'],
    primaryGoals: ['conversions', 'sales', 'leads'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'high_cpa', 'wasted_spend'],
  },
  {
    title: 'Use Google Ads remarketing lists for search ads (RLSA) to bid differently on past visitors',
    description: 'When someone who has already visited your site searches for your keywords again, they\'re 3–5× more likely to convert. RLSA lets you create different bids for these warm prospects — you can bid 50–100% more for people who know your brand, or show them different ad copy that references their previous visit. This is a high-ROI feature that most advertisers overlook.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '30–40% higher conversion rate on warm searchers',
        '500to2000': '40–50% higher conversion rate — adjust bids +200% for cart abandoners',
        '2000to10000': 'RLSA can drive 25–35% of total conversions at 40% lower CPA',
        over10000: 'Layered RLSA (cart abandoners + brand searchers) achieves 60%+ conversion rates',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Create a Remarketing List in Google Ads: Website Visitors (last 30 days)',
      'In your Search campaign → Audiences, add the remarketing list with "Target and Bid"',
      'For cart abandoners, set bid adjustment to +100% and use ad copy like "Come back — your cart is waiting"',
    ],
    goals: ['sales', 'conversions', 'leads'],
    primaryGoals: ['sales', 'conversions'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['no_conversions', 'low_roas', 'high_cpa'],
  },
  {
    title: 'Your Google Shopping campaign is missing negative keywords — and you\'re paying for "free" clicks',
    description: 'Google Shopping campaigns pull products from your feed and match them to search queries. Without negative keywords, your $50 product can show up for "cheap [product]" or "used [product]" — clicks that will never convert. Shopping campaigns also match to unrelated long-tail queries. Adding 100+ negative keywords typically reduces CPC by 20–30% while maintaining conversion volume.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '20–30% lower CPC with 50+ negative keywords in Shopping',
        '500to2000': '25–35% lower CPC — check search terms weekly for new negatives',
        '2000to10000': '30–40% lower CPC with automated + manual negative rules',
        over10000: 'At scale, negative keyword optimization saves $2,000–5,000/mo',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Download your Shopping search terms report from the last 30 days',
      'Add all irrelevant queries as negative keywords (free, used, cheap, DIY, how to make, tutorial)',
      'Create a shared negative keyword list and apply it to all Shopping campaigns',
    ],
    goals: ['sales'],
    primaryGoals: ['sales'],
    budgetPreference: [],
    painTriggers: ['high_cpa', 'wasted_spend', 'low_roas'],
  },
  {
    title: 'Switch from Maximize Clicks to a conversion-focused Smart Bidding strategy',
    description: 'If your Google campaign is set to "Maximize Clicks," you\'re telling Google to find the cheapest clicks — not the ones that convert. Clicks from "free CRM comparison" visitors will never buy your $200/mo product. Switching to "Maximize Conversions" or "Target CPA" tells Google\'s AI to bid on people most likely to convert, not just click.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '50–70% lower CPA by switching from clicks to conversions',
        '500to2000': '40–60% lower CPA with Target CPA bidding',
        '2000to10000': '30–50% better ROAS with tROAS bidding strategy',
        over10000: 'Advanced bidding (tROAS + seasonality adjustments) maximizes revenue',
      };
      return map[b];
    },
    platformContext: 'Google Ads',
    actionSteps: [
      'Change bidding strategy from "Maximize Clicks" to "Maximize Conversions" (need 15+ conversions/month)',
      'If you have 30+ conversions/month, switch to "Target CPA" and set it 20% below your current CPA',
      'Give Smart Bidding 14 days to learn before making changes',
    ],
    goals: ['conversions', 'sales', 'leads', 'app_installs'],
    primaryGoals: ['conversions', 'sales'],
    budgetPreference: [],
    painTriggers: ['high_cpa', 'no_conversions', 'wasted_spend'],
  },
];

// ── TIKTOK ──────────────────────────────────────────────────────────────────

const TIKTOK_CANDIDATES: CandidateInsight[] = [
  {
    title: 'Your TikTok budget is below the $20/day minimum effective spend',
    description: 'TikTok\'s algorithm needs at least $20/day per ad group to enter the learning phase and optimize delivery. With your current monthly budget, you can only run 1 ad group with 1 creative — any less and the algorithm won\'t have enough data to optimize. Spreading your budget across multiple ad groups will guarantee poor performance across all of them.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Avoid learning phase reset — save $100/mo by focusing on 1 ad group',
        '500to2000': 'Run 2–3 ad groups at $20/day each for valid A/B testing',
        '2000to10000': 'Run 5+ ad groups with dedicated budgets per creative angle',
        over10000: 'Scale to 15+ ad groups with full creative testing framework',
      };
      return map[b];
    },
    platformContext: 'TikTok Ads',
    actionSteps: [
      'Pause all ad groups except 1 — set its daily budget to exactly $20',
      'Run this single ad group for 7 days minimum without any edits',
      'After 7 days, evaluate CTR and CPC — only then add a second test ad group',
    ],
    goals: ['conversions', 'sales', 'traffic', 'awareness', 'leads', 'app_installs'],
    primaryGoals: ['sales', 'conversions', 'awareness'],
    budgetPreference: ['under500'],
    painTriggers: ['wasted_spend', 'high_cpa', 'no_conversions'],
  },
  {
    title: 'Your TikTok creatives probably look too polished — use UGC-style content instead',
    description: 'TikTok users scroll past ads that look like ads. Corporate-produced videos with logos, jingles, and professional editing get 80% lower engagement than native-looking content. The winning formula is simple: phone-shot video, captions-on, first-person perspective, and a hook in the first 1 second. Think "a real person sharing something useful" — not a commercial.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '3–5× higher engagement with UGC-style content',
        '500to2000': '3–5× higher engagement + 40% lower CPC on UGC vs polished ads',
        '2000to10000': 'UGC outperforms polished by 4–6× — test 10+ creators',
        over10000: 'Build a UGC creator network — 5–8× ROAS on creator content vs brand content',
      };
      return map[b];
    },
    platformContext: 'TikTok Ads',
    actionSteps: [
      'Shoot 5–10 videos on your phone in vertical (9:16) format — no logo intro',
      'Add captions/text overlays to ALL videos (60% of users watch without sound)',
      'Hook in first 1 second — start mid-action or with a question, never with your brand name',
    ],
    goals: ['awareness', 'traffic', 'conversions', 'sales', 'leads', 'app_installs'],
    primaryGoals: ['awareness', 'sales', 'traffic'],
    budgetPreference: [],
    painTriggers: ['bad_creatives', 'low_ctr', 'low_roas'],
  },
  {
    title: 'Not using TikTok Shop or direct product links — shorten the path to purchase',
    description: 'For sales campaigns, every extra click between ad and checkout costs you conversions. Sending TikTok traffic to your homepage (where users have to search for the product) results in 60% drop-off. Link directly to the product page, or better yet, use TikTok Shop for in-app checkout. Reducing friction is the #1 lever for improving TikTok ad ROAS.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '25% higher conversion rate with direct product links',
        '500to2000': '30–40% higher conversion rate — set up TikTok Shop for in-app checkout',
        '2000to10000': '35–50% higher conversion with TikTok Shop + product showcase videos',
        over10000: 'TikTok Shop integration can drive 40–60% of total ad revenue',
      };
      return map[b];
    },
    platformContext: 'TikTok Ads',
    actionSteps: [
      'Set up TikTok Shop or link directly to the product page (not homepage) in your ad',
      'Use the "Shop Now" CTA button on all sales-oriented ads',
      'Create product showcase videos showing real use — not lifestyle B-roll',
    ],
    goals: ['sales', 'conversions'],
    primaryGoals: ['sales'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'low_roas'],
  },
  {
    title: 'Use TikTok Spark Ads to boost your best-performing organic content',
    description: 'Spark Ads let you promote organic TikTok posts (yours or creators\' posts) as ads. Spark Ads get 2–3× higher engagement than in-feed ads because they appear as native content — they keep the original creator\'s username, comments, and likes. If you have any organic posts getting traction, Spark Ads let you put fuel on the fire instead of starting from zero.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '2–3× higher engagement than standard in-feed ads',
        '500to2000': '2–3× higher engagement + 20% lower CPC',
        '2000to10000': 'Scale Spark Ads to $50–100/day on top-performing organic posts',
        over10000: 'Creator Spark Ads strategy: identify 10 creators, boost their best posts',
      };
      return map[b];
    },
    platformContext: 'TikTok Ads',
    actionSteps: [
      'Identify your top 3 organic posts by engagement rate (likes ÷ views)',
      'Use Spark Ads to boost these posts with a "Website Clicks" or "Conversions" objective',
      'Target the same demographics as your organic audience for maximum relevance',
    ],
    goals: ['awareness', 'traffic', 'sales'],
    primaryGoals: ['awareness', 'traffic'],
    budgetPreference: [],
    painTriggers: ['low_ctr', 'bad_creatives', 'no_strategy'],
  },
  {
    title: 'Your TikTok targeting is probably too narrow — let the algorithm find your buyers',
    description: 'TikTok\'s algorithm is its superpower. Unlike Meta where precise targeting matters, TikTok\'s "Interest & Behavior" targeting is actually less effective than broad targeting + strong creative. The algorithm learns from video engagement signals (watch time, shares, comments) — not demographic data. Setting targeting too narrow (e.g., "Women 25–34 interested in yoga") can actually hurt delivery.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Broad targeting + strong creative can reduce CPC by 30–40%',
        '500to2000': 'Let algorithm optimize — 25–35% lower CPA vs narrow targeting',
        '2000to10000': 'Broad targeting + UGC creative achieves 30–40% higher ROAS',
        over10000: 'Full algorithmic targeting with creative testing achieves best scale',
      };
      return map[b];
    },
    platformContext: 'TikTok Ads',
    actionSteps: [
      'Set targeting to "Broad" (18+ in relevant regions) and rely on creative to qualify',
      'Use Smart Performance Campaign for auto-optimization across placements',
      'Exclude only clearly irrelevant audiences (e.g., age 13–17 for B2B products)',
    ],
    goals: ['awareness', 'sales', 'traffic', 'conversions', 'app_installs'],
    primaryGoals: ['awareness', 'sales'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['high_cpa', 'unsure_platform'],
  },
  {
    title: 'Install the TikTok Pixel before running any conversion campaigns',
    description: 'Without the TikTok Pixel, the platform can\'t track conversions — which means it can\'t optimize your ad delivery for people likely to convert. You\'re essentially telling TikTok "just find anyone who might click" instead of "find people who will buy." The Events API adds server-side tracking for iOS users who block browser-based tracking.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Pixel + Events API enables 40–60% lower CPA on conversion campaigns',
        '500to2000': 'Full tracking enables optimized delivery — 35–50% lower CPA',
        '2000to10000': 'Server-side tracking recovers 25% of iOS conversions lost to ATT',
        over10000: 'Server-side + pixel deduplication is mandatory for scale',
      };
      return map[b];
    },
    platformContext: 'TikTok Ads',
    actionSteps: [
      'Install TikTok Pixel via TikTok Ads Manager → Tools → Pixel',
      'Set up TikTok Events API for server-side conversion tracking (iOS users)',
      'Verify Purchase/Lead events fire correctly in the Pixel Events Manager',
    ],
    goals: ['conversions', 'sales', 'leads', 'app_installs'],
    primaryGoals: ['conversions', 'sales', 'app_installs'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'high_cpa'],
  },
  {
    title: 'Use TikTok\'s "Add to Cart" and "Product Sales" objectives for e-commerce — not Traffic',
    description: 'If you\'re selling products on TikTok but using a "Traffic" objective, you\'re paying for clicks, not buyers. TikTok\'s "Product Sales" objective (powered by TikTok Shop) optimizes for completed purchases. If you don\'t have TikTok Shop, use "Add to Cart" or "Complete Payment" as your optimization event. This single change can double your ROAS.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '2× higher ROAS switching from Traffic to Product Sales objective',
        '500to2000': '2–3× higher ROAS with proper conversion objective',
        '2000to10000': '3–4× higher ROAS with TikTok Shop + Product Sales optimization',
        over10000: 'TikTok Shop campaigns can achieve 5–8× ROAS at scale',
      };
      return map[b];
    },
    platformContext: 'TikTok Ads',
    actionSteps: [
      'Switch campaign objective to "Product Sales" or "Conversions" — not "Traffic"',
      'Set optimization event to "Complete Payment" or "Add to Cart"',
      'Ensure TikTok Pixel is tracking these events before launching',
    ],
    goals: ['sales', 'conversions'],
    primaryGoals: ['sales'],
    budgetPreference: [],
    painTriggers: ['low_roas', 'no_conversions'],
  },
  {
    title: 'Test 5–10 creative variations in week one — TikTok rewards creative diversity',
    description: 'TikTok\'s algorithm distributes impressions across creatives to find winners. If you launch with only 1–2 creatives, you\'re not giving the algorithm enough options. Unlike Meta where 3–5 is fine, TikTok works best with 5–10 variations because content fatigue sets in faster (within 3–5 days vs 7–14 on Meta). More creatives = more data = faster winner identification.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '5–10 creatives in 1 ad group lets algorithm find the winner in 5–7 days',
        '500to2000': 'Test 10+ creatives across 2–3 ad groups for statistically valid results',
        '2000to10000': 'Creative testing framework: launch 15–20 creatives, kill bottom 70% weekly',
        over10000: 'Continuous creative testing pipeline: 10 new creatives per week',
      };
      return map[b];
    },
    platformContext: 'TikTok Ads',
    actionSteps: [
      'Create 5–10 video variations: different hooks, different angles, different CTAs',
      'Put ALL variations in the same ad group with "Auto" placement and budget',
      'After 5–7 days, kill anything below 1% CTR — double down on winners',
    ],
    goals: ['awareness', 'traffic', 'sales', 'conversions', 'app_installs'],
    primaryGoals: ['awareness', 'sales'],
    budgetPreference: [],
    painTriggers: ['bad_creatives', 'low_ctr'],
  },
];

// ── YOUTUBE ─────────────────────────────────────────────────────────────────

const YOUTUBE_CANDIDATES: CandidateInsight[] = [
  {
    title: 'Your YouTube ad hook is too slow — 65% of viewers skip after 5 seconds',
    description: 'On YouTube skippable in-stream ads, you have exactly 5 seconds before the "Skip Ad" button appears. If you spend those 5 seconds on a logo animation or "Hi, we\'re Company X," you\'ve already lost 65% of your audience. The hook must start immediately — with a question, a surprising statement, or mid-action footage that makes viewers want to keep watching.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Improve view-through rate from 15% to 35–45% with a strong hook',
        '500to2000': 'Better hooks = 30–40% lower CPV (cost per view)',
        '2000to10000': 'Optimized hooks + bumper ads can reduce CPV by 40–50%',
        over10000: 'Hook testing at scale can reduce CPV by 50–60%',
      };
      return map[b];
    },
    platformContext: 'YouTube Ads',
    actionSteps: [
      'Rewrite your first 5 seconds to open with: a question, surprising stat, or mid-action footage',
      'Test 3 different hooks for the same video — use YouTube\'s "Split Testing" feature',
      'Create a 6-second bumper version for retargeting people who skipped your main ad',
    ],
    goals: ['awareness', 'traffic', 'conversions', 'leads'],
    primaryGoals: ['awareness', 'traffic'],
    budgetPreference: [],
    painTriggers: ['low_ctr', 'bad_creatives', 'wasted_spend'],
  },
  {
    title: 'Use YouTube bumper ads (6 seconds) for frequency and brand recall',
    description: 'Bumper ads are non-skippable 6-second ads that are perfect for reinforcing your message. At $0.01–$0.05 per view, they\'re one of the cheapest ad formats available. Use them alongside skippable in-stream ads to catch the 65% who skip your longer ad. A well-made bumper watched 3× is more memorable than a 30-second ad watched once.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '$0.01–$0.05 per view — build brand recall 3× cheaper than in-stream',
        '500to2000': 'Bumper + in-stream combo increases ad recall by 30–40%',
        '2000to10000': 'Bumper retargeting campaign reaches 50K+ uniques at $500/mo',
        over10000: 'Multi-format YouTube strategy: bumper + in-stream + Discovery achieves 80%+ reach',
      };
      return map[b];
    },
    platformContext: 'YouTube Ads',
    actionSteps: [
      'Create a 6-second bumper with a single message and your brand name',
      'Set up a bumper campaign targeting people who skipped your in-stream ad (custom intent audience)',
      'Set frequency to 3× per user per week for optimal recall without annoyance',
    ],
    goals: ['awareness', 'traffic'],
    primaryGoals: ['awareness'],
    budgetPreference: [],
    painTriggers: ['wasted_spend', 'bad_creatives'],
  },
  {
    title: 'Use YouTube Discovery ads for intent-based traffic — not just in-stream',
    description: 'Discovery ads appear in YouTube search results, the YouTube homepage, and alongside related videos. They look like organic video thumbnails — which means users click them intentionally (high intent). Discovery ads typically get 2–3× higher CTR than in-stream ads at a fraction of the CPV cost. They\'re the closest thing to Google Search traffic but in video format.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '2–3× higher CTR than in-stream at 50% lower cost',
        '500to2000': 'Discovery ads can drive 200+ clicks/mo at $0.30–$0.60 each',
        '2000to10000': 'Discovery + in-stream combo drives full-funnel engagement',
        over10000: 'Discovery ads at scale: 1,000+ high-intent clicks/mo',
      };
      return map[b];
    },
    platformContext: 'YouTube Ads',
    actionSteps: [
      'Create a Discovery ad campaign targeting keywords related to your product/service',
      'Use custom thumbnails with bold text and a clear value proposition',
      'Set your headline to match the search query — similar to Google Ads best practices',
    ],
    goals: ['traffic', 'awareness', 'leads'],
    primaryGoals: ['traffic', 'awareness'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['low_ctr', 'high_cpa'],
  },
  {
    title: 'Use YouTube custom intent audiences to target people researching your competitors',
    description: 'YouTube\'s custom intent audiences let you target users based on their recent search behavior. If someone searched "Best CRM software alternatives" on Google, you can show them your YouTube ad even though they never visited your site. This is incredibly powerful for capturing demand you\'d otherwise lose to competitors — especially when combined with a strong hook.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Target competitor searches — capture demand you\'d otherwise lose',
        '500to2000': 'Custom intent + in-stream targeting can achieve 4–6% CTR',
        '2000to10000': 'Competitor conquesting campaign: target 50+ competitor-related keywords',
        over10000: 'Full competitive intelligence: 100+ keywords, custom intent + remarketing',
      };
      return map[b];
    },
    platformContext: 'YouTube Ads',
    actionSteps: [
      'Create a custom intent audience with keywords like "competitor name alternative," "competitor name vs"',
      'Target YouTube search results and video watch pages with in-stream or Discovery ads',
      'Create ad copy that directly addresses pain points with your competitor',
    ],
    goals: ['awareness', 'traffic', 'leads', 'conversions'],
    primaryGoals: ['awareness', 'leads'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['unsure_platform', 'low_ctr'],
  },
  {
    title: 'Set up YouTube conversion tracking before measuring ROI — view-through conversions matter',
    description: 'YouTube ads often influence conversions that happen hours or days later — someone watches your ad, doesn\'t click, but visits your site directly or searches your brand. Without view-through conversion tracking (people who saw your ad and converted within 24–72 hours), you\'re only crediting 10–20% of YouTube\'s actual impact, making the platform look much worse than it is.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'View-through tracking reveals YouTube\'s true impact — often 3–5× higher than clicks suggest',
        '500to2000': 'Accurate attribution shows 25–35% of conversions were influenced by YouTube',
        '2000to10000': 'Full attribution model (click + view-through) can justify 2× more YouTube spend',
        over10000: 'Data-driven attribution reveals YouTube\'s assist role in the full funnel',
      };
      return map[b];
    },
    platformContext: 'YouTube Ads',
    actionSteps: [
      'In Google Ads → Conversions, enable "View-through conversions" with a 24–72 hour lookback window',
      'Link your GA4 property and check Assisted Conversions report for YouTube influence',
      'Use a holdout test: pause YouTube for 2 weeks and measure the drop in branded search traffic',
    ],
    goals: ['conversions', 'sales', 'leads'],
    primaryGoals: ['conversions', 'sales'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'low_roas', 'unsure_platform'],
  },
  {
    title: 'Your YouTube video ads need captions — 85% of social video is watched without sound',
    description: 'YouTube auto-plays ads with sound off in many placements (especially on mobile). If your entire message is in your voiceover, 85% of viewers will get nothing from your ad. Adding burned-in captions or using YouTube\'s caption features ensures your message gets across regardless of audio settings. Captions also increase view-through rate by 15–25%.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '15–25% higher view-through rate with captions on all ads',
        '500to2000': '20–30% higher view-through rate + improved message comprehension',
        '2000to10000': 'Captions + sound-off optimization improves engagement across all placements',
        over10000: 'Multi-language captions unlock international markets at minimal cost',
      };
      return map[b];
    },
    platformContext: 'YouTube Ads',
    actionSteps: [
      'Add burned-in captions to all video ads (not just YouTube auto-captions)',
      'Test text-heavy thumbnails — they get 20% higher CTR on Discovery ads',
      'Ensure your key message is conveyed visually even without audio',
    ],
    goals: ['awareness', 'traffic', 'conversions', 'sales', 'leads'],
    primaryGoals: ['awareness'],
    budgetPreference: [],
    painTriggers: ['low_ctr', 'bad_creatives'],
  },
  {
    title: 'Use YouTube Shorts ads to reach the fastest-growing video audience',
    description: 'YouTube Shorts now get 70+ billion daily views — surpassing the main YouTube platform in watch time. Shorts ads are vertical (9:16), up to 60 seconds, and appear natively in the Shorts feed. They\'re significantly cheaper than in-stream ads and perfect for reaching younger demographics. If you\'re only running standard in-stream ads, you\'re missing 40% of YouTube\'s total watch time.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Reach Shorts audience at 60% lower CPM than in-stream',
        '500to2000': 'Shorts + in-stream combo maximizes YouTube reach by 40%',
        '2000to10000': 'Shorts ads drive 30–40% more views at 50% lower cost per view',
        over10000: 'Full YouTube coverage: Shorts + Discovery + in-stream + bumper',
      };
      return map[b];
    },
    platformContext: 'YouTube Ads',
    actionSteps: [
      'Repurpose your TikTok Reels/vertical videos as YouTube Shorts ads (must be under 60 seconds)',
      'Create Shorts-specific campaign with vertical (9:16) video creative',
      'Target ages 18–34 for highest Shorts engagement rates',
    ],
    goals: ['awareness', 'traffic', 'app_installs'],
    primaryGoals: ['awareness'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['unsure_platform', 'no_strategy'],
  },
  {
    title: 'Retarget YouTube ad viewers with Google Display — they\'re 4× more likely to convert',
    description: 'Someone who watched 75%+ of your YouTube ad is warm — they know your brand. Retargeting these viewers with Google Display banner ads across the web is incredibly effective because you\'re following up on brand awareness with a direct response message. This YouTube-to-Display retargeting funnel can achieve 4–6× higher conversion rates than cold Display traffic.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '4× higher conversion rate on Display retargeting of YouTube viewers',
        '500to2000': 'YouTube → Display retargeting achieves 3–5× higher ROAS',
        '2000to10000': 'Multi-platform retargeting: YouTube → Display → Search captures full funnel',
        over10000: 'Sequential retargeting across Google ecosystem maximizes conversion at scale',
      };
      return map[b];
    },
    platformContext: 'YouTube Ads',
    actionSteps: [
      'Create a remarketing list: YouTube Video Viewers (75%+ watched, last 30 days)',
      'Create a Google Display campaign targeting this list with conversion-focused banner ads',
      'Layer in Google Search remarketing for viewers who also search your brand keywords',
    ],
    goals: ['conversions', 'sales', 'leads'],
    primaryGoals: ['conversions', 'sales'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['no_conversions', 'low_roas'],
  },
];

// ── LINKEDIN ────────────────────────────────────────────────────────────────

const LINKEDIN_CANDIDATES: CandidateInsight[] = [
  {
    title: 'You\'re targeting by industry only — missing job title precision',
    description: 'LinkedIn\'s true power is professional targeting, but most advertisers only target by industry (e.g., "Marketing"). This is too broad — you\'re paying $8–15/click for people who may not be decision-makers. Adding specific job titles (e.g., "VP of Marketing" or "Head of Growth") and seniority level (Manager+, Director+) narrows your audience to the people who can actually say "yes" to your offer.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '40–60% lower CPL with precise job title targeting',
        '500to2000': '40–60% lower CPL — add seniority level and company size filters',
        '2000to10000': '50–70% lower CPL with job title + seniority + company size layering',
        over10000: 'Account-Based Marketing (ABM) on top 500 accounts achieves 70%+ lower CPL',
      };
      return map[b];
    },
    platformContext: 'LinkedIn Ads',
    actionSteps: [
      'Target specific job titles (e.g., "Marketing Manager," "VP of Sales"), not just industries',
      'Add seniority level filter: "Manager," "Director," "CXO" for decision-makers',
      'Layer company size filter (e.g., "51-200 employees" for SMB SaaS)',
    ],
    goals: ['leads', 'conversions', 'awareness'],
    primaryGoals: ['leads'],
    budgetPreference: [],
    painTriggers: ['high_cpa', 'no_conversions', 'wasted_spend'],
  },
  {
    title: 'Use LinkedIn Lead Gen Forms — they get 2–3× more submissions than landing pages',
    description: 'LinkedIn\'s native Lead Gen Forms auto-populate with the user\'s LinkedIn profile data (name, email, job title, company). This eliminates the biggest friction point — form filling. The auto-fill rate is 90%+, meaning users essentially submit with one click. For B2B lead generation, this consistently outperforms sending traffic to external landing pages by 2–3×.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '2–3× more leads at same cost — CPL drops from $80 to $30–40',
        '500to2000': '2–3× more leads — integrate with CRM for instant follow-up',
        '2000to10000': 'Lead Gen Forms + lookalike audiences can generate 100+ leads/month',
        over10000: 'Scale to 500+ leads/month with Lead Forms + ABM targeting',
      };
      return map[b];
    },
    platformContext: 'LinkedIn Ads',
    actionSteps: [
      'Create a Lead Gen Form with only 3 fields: Name, Email, and Company',
      'Add a value proposition in the form intro (e.g., "Download our free 2024 benchmark report")',
      'Connect to your CRM via LinkedIn\'s native integrations or Zapier — follow up within 5 minutes',
    ],
    goals: ['leads'],
    primaryGoals: ['leads'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'high_cpa', 'low_ctr'],
  },
  {
    title: 'Your LinkedIn ad copy reads like a brochure — make it conversational',
    description: 'LinkedIn users are in a professional mindset — they\'re scrolling between emails and articles. Ads that look like sales pitches get ignored. The best-performing LinkedIn ads start with a question or surprising statistic, feel like a thought leadership post, and position the offer as a solution to a specific problem. Single image ads with conversational copy consistently outperform carousels and PDFs.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '25–35% higher CTR with conversational, value-first ad copy',
        '500to2000': '30–40% higher CTR — test 3 copy angles: stat, question, pain point',
        '2000to10000': 'Copy testing at scale identifies winning angles with 40–50% CTR lift',
        over10000: 'Personalized copy variants by job title can achieve 50%+ CTR improvement',
      };
      return map[b];
    },
    platformContext: 'LinkedIn Ads',
    actionSteps: [
      'Start with a hook: "Did you know 73% of marketing leaders say…" or a direct question',
      'Keep the first line under 150 characters — that\'s all that shows before "See more"',
      'Use single image ads — they often outperform carousels by 20% on LinkedIn',
    ],
    goals: ['leads', 'awareness', 'traffic'],
    primaryGoals: ['leads', 'awareness'],
    budgetPreference: [],
    painTriggers: ['low_ctr', 'bad_creatives'],
  },
  {
    title: 'Your LinkedIn daily budget is below the $30–50 minimum for meaningful B2B results',
    description: 'LinkedIn\'s CPC is the highest of any platform ($5–$15/click). At $10/day, you might get 1–2 clicks — which is statistically meaningless. B2B sales cycles are long, and you need enough clicks to generate enough leads to have meaningful pipeline. With your current budget, consider LinkedIn Matched Audiences (retargeting) which has lower CPC, or increase your budget to at least $30/day.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Either increase to $30/day or pause LinkedIn and reallocate to Meta/Google',
        '500to2000': '$30–50/day generates 20–40 leads/month with proper targeting',
        '2000to10000': 'Full LinkedIn campaign with ABM generates 100+ leads/month',
        over10000: 'Enterprise LinkedIn strategy: ABM + Lead Gen + Retargeting at scale',
      };
      return map[b];
    },
    platformContext: 'LinkedIn Ads',
    actionSteps: [
      'If budget allows, increase LinkedIn daily budget to $30–50 minimum for valid data collection',
      'Alternatively, use LinkedIn Matched Audiences to retarget website visitors at lower CPC',
      'Consider splitting budget: 70% Meta/Google for volume + 30% LinkedIn for quality B2B leads',
    ],
    goals: ['leads', 'conversions', 'awareness'],
    primaryGoals: ['leads'],
    budgetPreference: ['under500'],
    painTriggers: ['wasted_spend', 'high_cpa', 'no_conversions'],
  },
  {
    title: 'Set up LinkedIn Account-Based Marketing (ABM) for your top 100 dream clients',
    description: 'Instead of casting a wide net, ABM on LinkedIn lets you target specific companies by name (e.g., "Show my ads only to people who work at Stripe, Shopify, and Notion"). When combined with job title targeting, this is the most precise B2B advertising available anywhere. ABM campaigns on LinkedIn achieve 2–3× higher engagement than industry-wide targeting because every impression reaches your ideal customer.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'ABM on 20–30 target accounts: 2× higher engagement than broad targeting',
        '500to2000': 'ABM on 50–100 accounts: 2–3× higher engagement + 40% lower CPL',
        '2000to10000': 'Full ABM program: 200+ accounts, sequential messaging, multiple touchpoints',
        over10000: 'Enterprise ABM: custom audiences, personalized ads by account, 3–5× ROAS',
      };
      return map[b];
    },
    platformContext: 'LinkedIn Ads',
    actionSteps: [
      'Upload a list of your top 50–100 dream client companies as a Company List in LinkedIn Campaign Manager',
      'Target specific job titles within those companies (e.g., "CTO" or "Head of Product")',
      'Create tailored ad copy that references each company\'s likely challenges',
    ],
    goals: ['leads', 'conversions'],
    primaryGoals: ['leads'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['high_cpa', 'unsure_platform', 'no_strategy'],
  },
  {
    title: 'Use LinkedIn Conversation Ads for multi-touch nurture — not just Sponsored Content',
    description: 'Sponsored Content shows up in the feed and is easily scrolled past. Conversation Ads appear as direct messages in the user\'s LinkedIn inbox — and they have 3–5× higher open rates than email. You can create a multi-step message flow that qualifies leads, shares resources, and asks for a meeting — all within the ad. This is LinkedIn\'s most underutilized ad format.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '3–5× higher engagement than Sponsored Content — reach leads where they read messages',
        '500to2000': 'Conversation Ads generate 2–3× more qualified leads at same cost',
        '2000to10000': 'Multi-step Conversation Ad flows nurture leads through the full B2B funnel',
        over10000: 'Conversation Ads at scale: 100+ qualified meetings per month',
      };
      return map[b];
    },
    platformContext: 'LinkedIn Ads',
    actionSteps: [
      'Create a Conversation Ad with a 3-step flow: Value message → Resource link → Calendar booking',
      'Target specific job titles (Manager+) who haven\'t engaged with your Sponsored Content',
      'Personalize the opening message: "Hi [First Name], noticed you lead [team] at [company]"',
    ],
    goals: ['leads'],
    primaryGoals: ['leads'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['low_ctr', 'no_conversions'],
  },
  {
    title: 'Your LinkedIn budget is spread too thin — focus on 1 campaign with 1 audience',
    description: 'With LinkedIn\'s high CPCs, splitting your budget across multiple campaigns means none get enough volume to optimize. At $10/click and $30/day, you get 3 clicks per day across all campaigns — not enough for any single one to learn. Consolidate to 1 campaign, 1 tightly-targeted audience, and 1 clear CTA. Once that works, expand.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Consolidating to 1 campaign saves 30–40% budget on learning efficiency',
        '500to2000': '1–2 campaigns max with $30–50/day each for reliable lead flow',
        '2000to10000': 'Run 3–4 campaigns: ABM + Retargeting + Lead Gen + Awareness',
        over10000: 'Full LinkedIn suite: ABM + Lead Gen + Conversation Ads + Retargeting',
      };
      return map[b];
    },
    platformContext: 'LinkedIn Ads',
    actionSteps: [
      'Pause all campaigns except your highest-potential one (best audience × best offer)',
      'Set daily budget to $30–50 for that single campaign',
      'Run for 14 days minimum — LinkedIn needs more data than other platforms to optimize',
    ],
    goals: ['leads', 'conversions', 'awareness', 'traffic'],
    primaryGoals: ['leads'],
    budgetPreference: ['under500', '500to2000'],
    painTriggers: ['wasted_spend', 'no_strategy'],
  },
  {
    title: 'Retarget website visitors on LinkedIn — they\'re 5× more likely to convert',
    description: 'If someone visits your pricing page from a Google search, retargeting them on LinkedIn with a case study or testimonial ad is incredibly effective. LinkedIn\'s Matched Audiences let you upload your website visitor list and show targeted ads to those people. Website retargeting on LinkedIn has 5–8× higher CTR than cold audience targeting because the user already knows your brand.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '5× higher CTR retargeting warm visitors on LinkedIn',
        '500to2000': 'Website retargeting on LinkedIn achieves 40–60% lower CPL than cold audiences',
        '2000to10000': 'Sequential retargeting: web visitors → case study → demo request achieves 3× conversion rate',
        over10000: 'Full LinkedIn retargeting funnel can drive 200+ qualified leads/month at scale',
      };
      return map[b];
    },
    platformContext: 'LinkedIn Ads',
    actionSteps: [
      'Install LinkedIn Insight Tag on your website (it\'s a simple JavaScript snippet)',
      'Create a Matched Audience: Website Visitors (last 30 days) — prioritize pricing/demo page visitors',
      'Show retargeting ads with social proof: case studies, testimonials, or G2 reviews',
    ],
    goals: ['leads', 'conversions'],
    primaryGoals: ['leads'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['high_cpa', 'no_conversions', 'low_ctr'],
  },
];

// ── PINTEREST ───────────────────────────────────────────────────────────────

const PINTEREST_CANDIDATES: CandidateInsight[] = [
  {
    title: 'Use tall (2:3) Pin images — they get 60% more engagement than square images',
    description: 'Pinterest\'s feed is optimized for vertical content. Standard square (1:1) or landscape (16:9) images get significantly less screen real estate and lower engagement. The ideal Pin image ratio is 2:3 (1000×1500px) — this takes up maximum space in the feed and mobile browsers. If you\'re using Instagram-style square images on Pinterest, you\'re losing 40–60% of potential engagement.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '60% more engagement with 2:3 vertical Pin images',
        '500to2000': '60–80% more saves and clicks with optimized Pin dimensions',
        '2000to10000': 'Consistent 2:3 format across all Pins lifts overall CTR by 30–40%',
        over10000: 'Image A/B testing across formats identifies winning dimensions by category',
      };
      return map[b];
    },
    platformContext: 'Pinterest Ads',
    actionSteps: [
      'Redesign all Pin images to 2:3 ratio (1000×1500px minimum)',
      'Add text overlays on images — Pins with text get 30% more engagement',
      'Use lifestyle imagery (product in use) rather than plain product shots',
    ],
    goals: ['awareness', 'traffic', 'sales'],
    primaryGoals: ['awareness', 'traffic', 'sales'],
    budgetPreference: [],
    painTriggers: ['low_ctr', 'bad_creatives'],
  },
  {
    title: 'Optimize Pin descriptions with keywords — Pinterest is a search engine, not just social',
    description: '50% of Pinterest usage is search-driven. Users type queries like "living room ideas" or "summer outfits 2024" — and Pins with optimized descriptions rank higher in these results. Unlike Instagram where hashtags matter more, Pinterest rewards keyword-rich descriptions with organic distribution. This means your paid Pins get a boost from SEO without extra spend.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Keyword-optimized Pins get 30–40% more organic impressions + better ad performance',
        '500to2000': 'SEO + paid promotion = 50% more distribution than paid alone',
        '2000to10000': 'Keyword strategy across all Pins doubles organic + paid combined reach',
        over10000: 'Full Pinterest SEO strategy drives 40–60% of total traffic from organic',
      };
      return map[b];
    },
    platformContext: 'Pinterest Ads',
    actionSteps: [
      'Use Pinterest Trends (trends.pinterest.com) to find high-volume keywords in your niche',
      'Write 2–3 sentence descriptions with 3–5 relevant keywords per Pin',
      'Add keyword-rich board titles: "Modern Living Room Ideas" not just "Home"',
    ],
    goals: ['awareness', 'traffic', 'sales'],
    primaryGoals: ['traffic', 'awareness'],
    budgetPreference: [],
    painTriggers: ['no_strategy', 'low_ctr', 'unsure_platform'],
  },
  {
    title: 'Connect your product catalog to Pinterest Shopping — Pins become shoppable',
    description: 'Pinterest Shopping Pins connect directly to your product catalog, showing real-time pricing, availability, and a "Shop" button. When a user saves a Shopping Pin, they get notified when the product goes on sale — creating free remarketing. Shopping Pins have 2–3× higher conversion rates than standard Pins because the purchase path is significantly shorter.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '2–3× higher conversion rate with Shopping Pins vs standard Pins',
        '500to2000': 'Shopping Pins + catalog = automated product ads at 30% lower CPA',
        '2000to10000': 'Full Pinterest Shopping integration drives 25–35% of total e-commerce revenue',
        over10000: 'Pinterest Shopping at scale: dynamic pricing, sale alerts, 4–6× ROAS',
      };
      return map[b];
    },
    platformContext: 'Pinterest Ads',
    actionSteps: [
      'Set up Pinterest Catalog via your Shopify, WooCommerce, or product feed (XML/CSV)',
      'Enable Shopping Pins for all products — they\'ll appear with pricing and "Buy" button',
      'Run a Shopping campaign targeting your top product categories with interest keywords',
    ],
    goals: ['sales', 'conversions'],
    primaryGoals: ['sales'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['no_conversions', 'low_roas'],
  },
  {
    title: 'Pinterest\'s ad lifespan is months, not days — plan for long-term content value',
    description: 'Unlike Meta and TikTok where ads stop performing after 7–14 days, Pinterest Pins can drive traffic for 3–6 months after publication. This means the content you create today will continue delivering value long after you stop paying for promotion. Treat Pinterest content as an investment, not an expense — a single well-optimized Pin can generate 1000+ clicks over its lifetime.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '1 promoted Pin can generate 300–500 clicks over 3 months',
        '500to2000': 'Monthly Pin creation compounds: 10 Pins/month = 30 active Pins driving traffic',
        '2000to10000': 'Content library of 100+ Pins drives consistent baseline traffic',
        over10000: 'Pinterest content at scale: 500+ Pins = predictable, evergreen traffic source',
      };
      return map[b];
    },
    platformContext: 'Pinterest Ads',
    actionSteps: [
      'Create 10–15 new Pins per month — mix of organic and promoted',
      'Refresh top-performing Pins with updated images/seasonal themes',
      'Use Pinterest Analytics to identify which Pins have the longest lifespan and double down',
    ],
    goals: ['awareness', 'traffic', 'sales'],
    primaryGoals: ['awareness', 'traffic'],
    budgetPreference: [],
    painTriggers: ['no_strategy', 'unsure_platform'],
  },
  {
    title: 'Your Pinterest campaigns should target seasonal trends 45–60 days early',
    description: 'Pinterest users plan ahead — searches for "Halloween decor" start in August, "summer outfits" in March. The platform\'s unique planning mindset means your ads should go live 45–60 days before the season. If you launch Christmas campaigns in December, you\'ve already missed the peak. Use Pinterest Trends to see exactly when your audience starts searching.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '45–60 days early = 3× cheaper CPC during pre-peak vs peak season',
        '500to2000': 'Early trend targeting can double your click volume at 40% lower cost',
        '2000to10000': 'Seasonal calendar planning drives 50–70% of annual revenue during peak periods',
        over10000: 'Data-driven seasonal strategy maximizes revenue per seasonal window',
      };
      return map[b];
    },
    platformContext: 'Pinterest Ads',
    actionSteps: [
      'Check Pinterest Trends for your niche — note when search volume starts rising',
      'Plan your content calendar 60 days ahead of each seasonal peak',
      'Increase budgets 45 days before the trend peaks and decrease as it fades',
    ],
    goals: ['awareness', 'sales', 'traffic'],
    primaryGoals: ['sales', 'awareness'],
    budgetPreference: ['500to2000', '2000to10000', 'over10000'],
    painTriggers: ['no_strategy', 'wasted_spend'],
  },
  {
    title: 'Install the Pinterest Tag — without it, your conversion campaigns are guessing',
    description: 'Pinterest\'s conversion optimization needs the Pinterest Tag (similar to Meta Pixel) to track actions on your website. Without it, Pinterest can\'t identify which users are most likely to convert, so it delivers your ads based on engagement (clicks, saves) rather than actual purchase behavior. This means higher CPA and lower ROAS on any conversion or sales campaign.',
    impact: 'high',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: 'Pinterest Tag enables 30–40% lower CPA on conversion campaigns',
        '500to2000': 'Full tag setup with events enables 35–50% better optimization',
        '2000to10000': 'Multi-event tracking enables advanced bidding and audience creation',
        over10000: 'Server-side Pinterest tag for enterprise accuracy at scale',
      };
      return map[b];
    },
    platformContext: 'Pinterest Ads',
    actionSteps: [
      'Install the Pinterest Tag via Pinterest Ads Manager → Conversions → Pinterest Tag',
      'Configure key events: Page Visit, Add to Cart, Checkout, Purchase',
      'Verify events fire correctly using the Pinterest Tag Helper Chrome extension',
    ],
    goals: ['conversions', 'sales', 'leads'],
    primaryGoals: ['sales', 'conversions'],
    budgetPreference: [],
    painTriggers: ['no_conversions', 'high_cpa', 'low_roas'],
  },
  {
    title: 'Use Idea Pins for organic reach — they get 5× more distribution than standard Pins',
    description: 'Idea Pins (Pinterest\'s multi-page, video, or image stories) receive significantly more organic distribution than standard Pins because Pinterest actively pushes them in the feed. They don\'t have direct links (no click-through to your site), but they build brand awareness and follower growth that compounds over time. Use Idea Pins for top-of-funnel awareness, then convert followers with standard Shopping Pins.',
    impact: 'medium',
    estimatedImpact: (b) => {
      const map: Record<BudgetId, string> = {
        under500: '5× more organic distribution builds followers for future conversion',
        '500to2000': 'Idea Pins + promoted Shopping Pins create a full-funnel Pinterest strategy',
        '2000to10000': 'Consistent Idea Pins (3–5/week) build a follower base that reduces ad costs by 20–30%',
        over10000: 'Idea Pin strategy at scale drives 100K+ monthly organic impressions',
      };
      return map[b];
    },
    platformContext: 'Pinterest Ads',
    actionSteps: [
      'Create 2–3 Idea Pins per week (5–10 pages each with tips, tutorials, or behind-the-scenes)',
      'End every Idea Pin with a CTA to follow your profile or visit your site',
      'Repurpose Idea Pins into standard Promoted Pins with direct links for conversion',
    ],
    goals: ['awareness', 'traffic'],
    primaryGoals: ['awareness'],
    budgetPreference: [],
    painTriggers: ['no_strategy', 'low_ctr'],
  },
];

// ---------------------------------------------------------------------------
// Assemble all candidates by platform
// ---------------------------------------------------------------------------

const ALL_CANDIDATES: Record<PlatformId, CandidateInsight[]> = {
  meta: META_CANDIDATES,
  google: GOOGLE_CANDIDATES,
  tiktok: TIKTOK_CANDIDATES,
  youtube: YOUTUBE_CANDIDATES,
  linkedin: LINKEDIN_CANDIDATES,
  pinterest: PINTEREST_CANDIDATES,
};

// ---------------------------------------------------------------------------
// Pain-point remedies
// ---------------------------------------------------------------------------

const PAIN_REMEDIES: Record<string, Record<PlatformId, { pain: string; fix: string }[]>> = {
  high_cpa: {
    meta: [
      { pain: 'High CPA on Meta', fix: 'Build 1% Lookalike audiences from your top 20% of customers — they convert at 2–3× lower CPA than cold interest targeting.' },
      { pain: 'High CPA on Meta', fix: 'Switch to Advantage+ Shopping campaigns which auto-optimize across placements and audiences — typically 20–30% lower CPA than standard campaigns.' },
    ],
    google: [
      { pain: 'High CPA on Google', fix: 'Add 100+ negative keywords and switch all top keywords from Broad to [Exact] match — this typically cuts CPA by 35–50% in the first week.' },
      { pain: 'High CPA on Google', fix: 'Switch from Maximize Clicks to Target CPA bidding — let Google\'s AI find cheap conversions instead of cheap clicks.' },
    ],
    tiktok: [
      { pain: 'High CPA on TikTok', fix: 'Use UGC-style creative (phone-shot, captions-on) — polished ads get 3–5× higher CPA because they don\'t fit the native feed.' },
      { pain: 'High CPA on TikTok', fix: 'Increase daily budget to $20+ per ad group — below this threshold, the algorithm can\'t optimize delivery effectively.' },
    ],
    youtube: [
      { pain: 'High CPA on YouTube', fix: 'Improve your 5-second hook — 65% of viewers skip. A better hook can double your view-through rate and halve your CPV.' },
      { pain: 'High CPA on YouTube', fix: 'Add bumper ads (6 sec, non-skippable) for retargeting — they\'re 5× cheaper per impression than in-stream and reinforce your message.' },
    ],
    linkedin: [
      { pain: 'High CPA on LinkedIn', fix: 'Target specific job titles + seniority level instead of broad industries — this alone cuts CPL by 40–60%.' },
      { pain: 'High CPA on LinkedIn', fix: 'Use LinkedIn Lead Gen Forms with auto-fill — they get 2–3× more leads at the same spend vs. landing pages.' },
    ],
    pinterest: [
      { pain: 'High CPA on Pinterest', fix: 'Connect your product catalog for Shopping Pins — the direct "Buy" button shortens the path to purchase and 2–3× higher conversion rate.' },
      { pain: 'High CPA on Pinterest', fix: 'Use 2:3 vertical images with text overlays — they get 60% more engagement than standard formats.' },
    ],
  },
  low_ctr: {
    meta: [
      { pain: 'Low CTR on Meta', fix: 'Refresh your creatives — ad fatigue sets in after 7–14 days. Rotate 5–10 new variations and archive ads with frequency > 3.0.' },
      { pain: 'Low CTR on Meta', fix: 'Test different ad formats: Carousel for product features, Reels for engagement, Stories for urgency.' },
    ],
    google: [
      { pain: 'Low CTR on Google', fix: 'Add all 4 ad extension types (Sitelinks, Callouts, Structured Snippets, Call) — they increase CTR by 10–15% at no extra cost.' },
      { pain: 'Low CTR on Google', fix: 'Include the exact search keyword in your ad headline — relevance boosts Quality Score and ad position.' },
    ],
    tiktok: [
      { pain: 'Low CTR on TikTok', fix: 'Hook in the first 1 second — start with action, a question, or a bold claim. "POV:" and "Wait for it:" hooks get 3–5× higher engagement.' },
      { pain: 'Low CTR on TikTok', fix: 'Add text overlays to ALL videos — 60% of users watch without sound.' },
    ],
    youtube: [
      { pain: 'Low CTR on YouTube', fix: 'Rewrite your hook — start with a surprising stat or question, not a logo. "85% of businesses waste half their ad budget…" works better than "Hi, I\'m John."' },
      { pain: 'Low CTR on YouTube', fix: 'Use YouTube Discovery ads with custom thumbnails featuring bold text — they get 2–3× higher CTR than in-stream.' },
    ],
    linkedin: [
      { pain: 'Low CTR on LinkedIn', fix: 'Start ad copy with a stat or question, not a sales pitch. "73% of CMOs say…" outperforms "Our software helps…"' },
      { pain: 'Low CTR on LinkedIn', fix: 'Use single image ads — they often outperform carousels on LinkedIn by 20%.' },
    ],
    pinterest: [
      { pain: 'Low CTR on Pinterest', fix: 'Use 2:3 vertical images with text overlays describing the content — text-heavy Pins get 30% more clicks.' },
      { pain: 'Low CTR on Pinterest', fix: 'Optimize Pin descriptions with keywords — Pinterest is a search engine first, social network second.' },
    ],
  },
  low_roas: {
    meta: [
      { pain: 'Low ROAS on Meta', fix: 'Switch to Advantage+ Shopping campaigns and add Dynamic Product Ads for retargeting — this combination typically achieves 3–5× ROAS.' },
      { pain: 'Low ROAS on Meta', fix: 'Install Conversions API (CAPI) alongside your Pixel — iOS privacy is costing you 20–30% of conversion data.' },
    ],
    google: [
      { pain: 'Low ROAS on Google', fix: 'Create dedicated landing pages per ad group — homepage sends have 3–5× higher bounce rate.' },
      { pain: 'Low ROAS on Google', fix: 'Switch bidding from Maximize Clicks to tROAS (Target ROAS) — let Google optimize for revenue, not volume.' },
    ],
    tiktok: [
      { pain: 'Low ROAS on TikTok', fix: 'Set up TikTok Shop for in-app checkout — the shortest path to purchase gives 25–40% higher conversion rates.' },
      { pain: 'Low ROAS on TikTok', fix: 'Switch from Traffic objective to Product Sales or Conversions — don\'t optimize for clicks when you want purchases.' },
    ],
    youtube: [
      { pain: 'Low ROAS on YouTube', fix: 'Enable view-through conversion tracking — YouTube\'s impact is often 3–5× higher than click-through data suggests.' },
      { pain: 'Low ROAS on YouTube', fix: 'Retarget YouTube viewers (75%+ watched) with Google Display ads — warm audience converts at 4× higher rate.' },
    ],
    linkedin: [
      { pain: 'Low ROAS on LinkedIn', fix: 'LinkedIn is a quality-over-quantity platform. Measure ROAS by pipeline value, not immediate revenue — B2B sales cycles are 30–90 days.' },
      { pain: 'Low ROAS on LinkedIn', fix: 'Use ABM targeting on your top 50 accounts — focused targeting achieves 2–3× higher engagement than broad campaigns.' },
    ],
    pinterest: [
      { pain: 'Low ROAS on Pinterest', fix: 'Connect your full product catalog for Shopping Pins — direct purchase links give 2–3× higher conversion rates.' },
      { pain: 'Low ROAS on Pinterest', fix: 'Target seasonal trends 45–60 days early — pre-peak CPC is 3× cheaper than peak-season rates.' },
    ],
  },
  no_conversions: {
    meta: [
      { pain: 'No conversions on Meta', fix: 'Verify your Pixel is firing correctly — check Events Manager. If Purchase events aren\'t tracking, Meta can\'t optimize for conversions.' },
      { pain: 'No conversions on Meta', fix: 'You may need more budget to exit the learning phase. Meta needs 50 conversions/week per ad set to optimize effectively.' },
    ],
    google: [
      { pain: 'No conversions on Google', fix: 'Check conversion tracking — go to Tools → Conversions. If your conversion actions show 0 recorded, your tracking is broken.' },
      { pain: 'No conversions on Google', fix: 'Match your landing page to your ad copy. If your ad says "Free CRM Trial" but the landing page says "Book a Demo," visitors leave.' },
    ],
    tiktok: [
      { pain: 'No conversions on TikTok', fix: 'Install TikTok Pixel + Events API before running conversion campaigns — without tracking, TikTok can\'t optimize.' },
      { pain: 'No conversions on TikTok', fix: 'Link directly to your product page, not homepage. Every extra click between ad and checkout costs you 40–60% of potential conversions.' },
    ],
    youtube: [
      { pain: 'No conversions on YouTube', fix: 'Enable view-through conversion tracking — many YouTube-influenced conversions happen 24–72 hours after viewing, not from immediate clicks.' },
      { pain: 'No conversions on YouTube', fix: 'Add a clear CTA in your video and overlay — "Click the link below to start your free trial" with a visible card/end screen.' },
    ],
    linkedin: [
      { pain: 'No conversions on LinkedIn', fix: 'Use native Lead Gen Forms instead of sending to a landing page — they get 2–3× more submissions because of auto-fill.' },
      { pain: 'No conversions on LinkedIn', fix: 'Narrow your audience: target specific job titles + seniority. "Marketing" is too broad — "VP of Marketing at 50–200 person companies" converts.' },
    ],
    pinterest: [
      { pain: 'No conversions on Pinterest', fix: 'Install the Pinterest Tag and verify Purchase/Checkout events are firing in the Conversions dashboard.' },
      { pain: 'No conversions on Pinterest', fix: 'Use Shopping Pins with direct product links — standard Pins that link to blog posts don\'t drive purchases.' },
    ],
  },
  wasted_spend: {
    meta: [
      { pain: 'Wasted spend on Meta', fix: 'Switch from automatic to manual placements — disable Audience Network which typically converts at 1/5 the rate of Feed placements.' },
      { pain: 'Wasted spend on Meta', fix: 'Set ad scheduling to your peak hours only — if your buyers shop between 6–10pm, don\'t show ads at 3am.' },
    ],
    google: [
      { pain: 'Wasted spend on Google', fix: 'Audit Search Terms weekly and add 20+ negative keywords. "Free," "jobs," "salary," "DIY" clicks never convert.' },
      { pain: 'Wasted spend on Google', fix: 'Pause keywords with Quality Score < 4 — they cost 2–3× more per click and rarely convert.' },
    ],
    tiktok: [
      { pain: 'Wasted spend on TikTok', fix: 'Don\'t spread budget across multiple ad groups — with under $500/mo, focus on 1 ad group at $20/day minimum.' },
      { pain: 'Wasted spend on TikTok', fix: 'Kill creatives with CTR < 1% after 3 days — don\'t wait for statistical significance on obviously bad ads.' },
    ],
    youtube: [
      { pain: 'Wasted spend on YouTube', fix: 'Set frequency caps to 3 impressions per user per week — paying for 10+ impressions on the same person has diminishing returns.' },
      { pain: 'Wasted spend on YouTube', fix: 'Use target CPV bidding instead of target CPM — only pay for views, not impressions where users skip at 1 second.' },
    ],
    linkedin: [
      { pain: 'Wasted spend on LinkedIn', fix: 'Consolidate to 1 campaign — splitting budget across multiple campaigns means none get enough data to optimize at LinkedIn\'s high CPCs.' },
      { pain: 'Wasted spend on LinkedIn', fix: 'Target job titles + seniority, not just industries. Industry-only targeting wastes 40–60% of budget on non-decision-makers.' },
    ],
    pinterest: [
      { pain: 'Wasted spend on Pinterest', fix: 'Use keyword-targeted campaigns instead of interest-only — intent-based targeting is 2× more efficient on Pinterest.' },
      { pain: 'Wasted spend on Pinterest', fix: 'Set start/end dates on campaigns aligned with seasonal trends — don\'t run evergreen campaigns during off-season.' },
    ],
  },
  unsure_platform: {
    meta: [
      { pain: 'Unsure if Meta is right', fix: 'Meta Ads are best for direct response (conversions, sales, leads) and retargeting. If you sell physical products or B2C services, Meta should be your #1 platform.' },
    ],
    google: [
      { pain: 'Unsure if Google is right', fix: 'Google Ads capture intent — people actively searching for your solution. If your product solves a specific problem people search for, Google should be your #1 platform.' },
    ],
    tiktok: [
      { pain: 'Unsure if TikTok is right', fix: 'TikTok is best for brand awareness and reaching Gen Z/Millennials (ages 16–34). It works exceptionally well for visually appealing products, e-commerce, and viral-style content.' },
    ],
    youtube: [
      { pain: 'Unsure if YouTube is right', fix: 'YouTube excels at top-of-funnel awareness and consideration. If your product needs explanation, demo, or visual proof, YouTube ads outperform text-based platforms.' },
    ],
    linkedin: [
      { pain: 'Unsure if LinkedIn is right', fix: 'LinkedIn is #1 for B2B lead generation. If you sell to businesses (SaaS, services, consulting) and need to reach decision-makers by job title, LinkedIn is your best bet — despite higher CPCs.' },
    ],
    pinterest: [
      { pain: 'Unsure if Pinterest is right', fix: 'Pinterest is ideal for e-commerce in visual niches: fashion, home decor, food, DIY, beauty. Users are in a planning/purchase mindset, and content has a 3–6 month lifespan.' },
    ],
  },
  bad_creatives: {
    meta: [
      { pain: 'Poor creatives on Meta', fix: 'Use Dynamic Creative Optimization (DCO) — give Meta 3+ headlines, 3+ images, 2+ CTAs and let it auto-test combinations to find winners.' },
      { pain: 'Poor creatives on Meta', fix: 'Test video ads — Meta Reels ads get 2× higher engagement than static images. Shoot vertical (9:16) content on your phone.' },
    ],
    google: [
      { pain: 'Poor creatives on Google', fix: 'Use Responsive Search Ads with 15 headlines and 4 descriptions — Google auto-tests to find the best combination.' },
      { pain: 'Poor creatives on Google', fix: 'Include numbers in headlines: "$49/mo" or "Join 10,000+ businesses" gets 15–20% higher CTR than generic copy.' },
    ],
    tiktok: [
      { pain: 'Poor creatives on TikTok', fix: 'Shoot UGC-style videos on your phone. Never use logos in the first second. Use trending sounds and add text overlays to ALL videos.' },
      { pain: 'Poor creatives on TikTok', fix: 'Test 5–10 creative variations in week 1. Kill anything below 1% CTR after 3 days. Double down on winners.' },
    ],
    youtube: [
      { pain: 'Poor creatives on YouTube', fix: 'The first 5 seconds are everything. Start with action, a question, or a bold statement — never with a logo animation or "Hi, we\'re..."' },
      { pain: 'Poor creatives on YouTube', fix: 'Use captions on all videos (85% watch without sound) and create text-heavy thumbnails for Discovery ads.' },
    ],
    linkedin: [
      { pain: 'Poor creatives on LinkedIn', fix: 'Use professional, clean design with data or social proof. Case study screenshots and testimonial quotes outperform stock images by 30%.' },
      { pain: 'Poor creatives on LinkedIn', fix: 'Single image ads with conversational copy often outperform carousels and video on LinkedIn.' },
    ],
    pinterest: [
      { pain: 'Poor creatives on Pinterest', fix: 'Use 2:3 vertical images (1000×1500px minimum) with lifestyle photography and text overlays describing the content.' },
      { pain: 'Poor creatives on Pinterest', fix: 'Create multiple Pin formats: standard, video, and carousel. Video Pins on Pinterest get 2× engagement vs static.' },
    ],
  },
  no_strategy: {
    meta: [
      { pain: 'No clear Meta strategy', fix: 'Build a full-funnel campaign structure: TOFU (Awareness) → MOFU (Consideration) → BOFU (Conversion). Budget split: 40% / 30% / 30%.' },
    ],
    google: [
      { pain: 'No clear Google strategy', fix: 'Start with Search campaigns for high-intent keywords, then expand to Performance Max for full-funnel coverage. Structure: 1 campaign per product/service, 1 ad group per keyword theme.' },
    ],
    tiktok: [
      { pain: 'No clear TikTok strategy', fix: 'Focus on 1 platform at a time. For TikTok: Week 1–2 = creative testing (5–10 videos). Week 3–4 = scale winners. Don\'t spread budget thin.' },
    ],
    youtube: [
      { pain: 'No clear YouTube strategy', fix: 'Use YouTube for top-of-funnel awareness (in-stream) + mid-funnel consideration (Discovery). Don\'t expect direct conversions — measure view-through conversions and brand search lift.' },
    ],
    linkedin: [
      { pain: 'No clear LinkedIn strategy', fix: 'For B2B: Start with Lead Gen Forms → Retarget with case studies → Nurture via Conversation Ads. Track pipeline value, not immediate ROAS.' },
    ],
    pinterest: [
      { pain: 'No clear Pinterest strategy', fix: 'Plan content 45–60 days ahead of seasonal trends. Create 10–15 Pins/month with keyword-optimized descriptions. Pinterest is a marathon, not a sprint — results compound over 3–6 months.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Budget assessment logic
// ---------------------------------------------------------------------------

function getBudgetAssessment(
  platforms: PlatformId[],
  budgetId: BudgetId,
): QuickInsights['budgetAssessment'] {
  const { daily, dailyPerPlatform } = BUDGET_RANGES[budgetId];
  const platformCount = platforms.length;
  const perPlatformDaily = Math.floor(daily / platformCount);
  const minPlatformDaily = Math.min(...platforms.map((p) => PLATFORM_MIN_DAILY[p]));

  // Check each platform against minimum effective daily spend
  const failingPlatforms = platforms.filter((p) => perPlatformDaily < PLATFORM_MIN_DAILY[p]);
  const allAbove = failingPlatforms.length === 0;
  const mostAbove = failingPlatforms.length <= Math.ceil(platformCount * 0.25);

  if (allAbove && perPlatformDaily >= 30) {
    return {
      status: 'strong',
      message: `At ${BUDGET_RANGES[budgetId].label} across ${platformCount} platform${platformCount > 1 ? 's' : ''}, you're spending ~$${perPlatformDaily}/day per platform — enough for the 60/30/10 testing framework (60% proven winners, 30% new tests, 10% experiments).`,
      recommendation: 'Allocate 60% of budget to your top-performing campaigns, 30% to scaling tests, and 10% to wild experiments. Run 3–5 ad sets per platform with dedicated daily budgets.',
    };
  }

  if (allAbove || mostAbove) {
    return {
      status: 'moderate',
      message: `At ${BUDGET_RANGES[budgetId].label} across ${platformCount} platform${platformCount > 1 ? 's' : ''}, you're spending ~$${perPlatformDaily}/day per platform — enough for 1–2 ad sets per platform with basic testing, but not enough for full A/B testing across audiences and creatives.`,
      recommendation: `Focus on 1–2 platforms maximum until you hit $${BUDGET_RANGES['2000to10000'].min.toLocaleString()}/mo. ${failingPlatforms.length > 0 ? `${PLATFORM_NAMES[failingPlatforms[0]]} needs $${PLATFORM_MIN_DAILY[failingPlatforms[0]]}/day minimum — consider pausing it.` : 'Ensure each platform gets at least $20/day.'}`,
    };
  }

  return {
    status: 'low',
    message: `At ${BUDGET_RANGES[budgetId].label} across ${platformCount} platform${platformCount > 1 ? 's' : ''}, you're only spending ~$${perPlatformDaily}/day per platform — below the minimum effective daily spend for ${failingPlatforms.map((p) => PLATFORM_NAMES[p]).join(', ')}. You'll struggle to exit the learning phase on any platform.`,
    recommendation: `Pick 1 platform: ${PLATFORM_NAMES[platforms[0]]}. Allocate your entire budget there ($${daily}/day). Don't split budget until you hit $${BUDGET_RANGES['500to2000'].min.toLocaleString()}/mo on a single platform. ${platforms.includes('tiktok') ? 'TikTok needs $20/day minimum — reduce to 1 ad group.' : ''}${platforms.includes('linkedin') ? ' LinkedIn needs $30–50/day for meaningful B2B results.' : ''}`,
  };
}

// ---------------------------------------------------------------------------
// Estimated savings & ROAS
// ---------------------------------------------------------------------------

function getEstimatedSavings(budgetId: BudgetId): string {
  const { min, max } = BUDGET_RANGES[budgetId];
  const mid = Math.round((min + max) / 2);
  const ranges: Record<BudgetId, [number, number]> = {
    under500: [0.3, 0.5],
    '500to2000': [0.25, 0.4],
    '2000to10000': [0.2, 0.35],
    over10000: [0.15, 0.3],
  };
  const [lo, hi] = ranges[budgetId];
  const savingsLow = Math.round(mid * lo);
  const savingsHigh = Math.round(mid * hi);
  if (mid < 100) return `$${savingsLow}–${savingsHigh}/mo`;
  return `$${savingsLow.toLocaleString()}–${savingsHigh.toLocaleString()}/mo`;
}

function getEstimatedROASBoost(budgetId: BudgetId): string {
  const ranges: Record<BudgetId, string> = {
    under500: '1.5–2× ROAS improvement',
    '500to2000': '2–3× ROAS improvement',
    '2000to10000': '2.5–4× ROAS improvement',
    over10000: '3–5× ROAS improvement',
  };
  return ranges[budgetId];
}

// ---------------------------------------------------------------------------
// Platform summary
// ---------------------------------------------------------------------------

function getPlatformSummary(
  platforms: PlatformId[],
): QuickInsights['platformSummary'] {
  const summaries: Record<PlatformId, { name: string; avgCPC: string; avgCPM: string; audienceSize: string; minBudget: string }> = {
    meta: { name: 'Meta Ads', avgCPC: '$0.50–$2.00', avgCPM: '$5–$15', audienceSize: '3B+ users', minBudget: '$5/day' },
    google: { name: 'Google Ads', avgCPC: '$1.00–$5.00', avgCPM: '$2–$20', audienceSize: '8.5B searches/day', minBudget: '$10/day' },
    tiktok: { name: 'TikTok Ads', avgCPC: '$0.20–$1.50', avgCPM: '$2–$10', audienceSize: '1.5B+ users', minBudget: '$20/day' },
    youtube: { name: 'YouTube Ads', avgCPC: '$0.30–$3.00', avgCPM: '$6–$30', audienceSize: '2.5B+ monthly users', minBudget: '$10/day' },
    linkedin: { name: 'LinkedIn Ads', avgCPC: '$5.00–$15.00', avgCPM: '$30–$80', audienceSize: '900M+ users', minBudget: '$10/day ($30–50 recommended for B2B)' },
    pinterest: { name: 'Pinterest Ads', avgCPC: '$0.10–$1.50', avgCPM: '$2–$10', audienceSize: '500M+ users', minBudget: '$5/day' },
  };
  return platforms.map((p) => summaries[p]);
}

// ---------------------------------------------------------------------------
// Pain remedies selection
// ---------------------------------------------------------------------------

function getPainRemedies(
  painPoints: string[],
  platforms: PlatformId[],
): QuickInsights['painRemedies'] {
  const remedies: QuickInsights['painRemedies'] = [];

  for (const pain of painPoints) {
    const platformRemedies = PAIN_REMEDIES[pain];
    if (!platformRemedies) continue;

    for (const platform of platforms) {
      const fixes = platformRemedies[platform];
      if (fixes) {
        // Take the first fix per platform per pain
        remedies.push(fixes[0]);
      }
    }

    // If no platform-specific fixes, try a generic one
    if (remedies.length === 0 || !remedies.some((r) => r.pain.toLowerCase().includes(pain))) {
      for (const platform of platforms) {
        const fixes = platformRemedies[platform];
        if (fixes && fixes.length > 0) {
          remedies.push(fixes[0]);
          break;
        }
      }
    }
  }

  return remedies.slice(0, 6);
}

// ---------------------------------------------------------------------------
// Scoring & selection logic
// ---------------------------------------------------------------------------

function scoreCandidate(
  candidate: CandidateInsight,
  goal: CampaignGoal,
  budgetId: BudgetId,
  painPoints: string[],
): number {
  let score = 0;

  // Goal match (0–60 points)
  if (candidate.primaryGoals.includes(goal)) {
    score += 60;
  } else if (candidate.goals.includes(goal)) {
    score += 35;
  } else {
    score += 5;
  }

  // Budget preference (0–25 points)
  if (candidate.budgetPreference.length === 0) {
    score += 15; // applicable to all budgets
  } else if (candidate.budgetPreference.includes(budgetId)) {
    score += 25;
  } else {
    score += 5;
  }

  // Pain point triggers (0–15 points)
  const matchingPains = candidate.painTriggers.filter((p) => painPoints.includes(p)).length;
  score += matchingPains * 5;

  return score;
}

function selectTopInsights(
  platforms: PlatformId[],
  goal: CampaignGoal,
  budgetId: BudgetId,
  painPoints: string[],
): InsightItem[] {
  // Gather all candidates from selected platforms
  const allCandidates: { candidate: CandidateInsight; platform: PlatformId }[] = [];
  for (const platform of platforms) {
    for (const candidate of ALL_CANDIDATES[platform]) {
      allCandidates.push({ candidate, platform });
    }
  }

  // Score and rank
  const scored = allCandidates
    .map(({ candidate, platform }) => ({
      candidate,
      platform,
      score: scoreCandidate(candidate, goal, budgetId, painPoints),
    }))
    .sort((a, b) => b.score - a.score);

  // Deduplicate: skip candidates with very similar titles (fuzzy)
  const seen = new Set<string>();
  const unique: typeof scored = [];
  for (const item of scored) {
    const titleKey = item.candidate.title.toLowerCase().slice(0, 30);
    let isDuplicate = false;
    for (const s of Array.from(seen)) {
      if (titleKey.includes(s) || s.includes(titleKey)) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      seen.add(titleKey);
      unique.push(item);
    }
  }

  // Convert top 3 to InsightItem
  return unique.slice(0, 3).map(({ candidate }) => ({
    title: candidate.title,
    description: candidate.description,
    impact: candidate.impact,
    estimatedImpact: candidate.estimatedImpact(budgetId),
    platformContext: candidate.platformContext,
    actionSteps: candidate.actionSteps,
  }));
}

// ---------------------------------------------------------------------------
// Main exported function
// ---------------------------------------------------------------------------

export function generateInsights(params: GenerateInsightsParams): QuickInsights {
  const { platforms, goal, budgetId, painPoints } = params;

  const actionItems = selectTopInsights(platforms, goal, budgetId, painPoints);
  const budgetAssessment = getBudgetAssessment(platforms, budgetId);
  const estimatedSavings = getEstimatedSavings(budgetId);
  const estimatedROASBoost = getEstimatedROASBoost(budgetId);
  const platformSummary = getPlatformSummary(platforms);
  const goalMetrics = GOAL_METRICS[goal];
  const painRemedies = getPainRemedies(painPoints, platforms);

  return {
    actionItems,
    budgetAssessment,
    estimatedSavings,
    estimatedROASBoost,
    platformSummary,
    goalMetrics,
    painRemedies,
  };
}
