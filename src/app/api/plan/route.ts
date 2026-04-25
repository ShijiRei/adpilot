import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      platforms,
      budget,
      budgetPeriod,
      industry,
      campaignGoal,
      goalName,
      productDescription,
      targetAudience,
      location,
      tone,
    } = body;

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: 'Please select at least one platform.' }, { status: 400 });
    }

    if (!budget || budget < 50) {
      return NextResponse.json({ error: 'Budget must be at least $50.' }, { status: 400 });
    }

    if (!location || location.trim().length === 0) {
      return NextResponse.json({ error: 'Please select a target country.' }, { status: 400 });
    }

    const platformList = Array.isArray(platforms) ? platforms.join(', ') : String(platforms);
    const budgetDisplay = budgetPeriod === 'monthly' ? `$${Number(budget).toLocaleString()}/month` : `$${Number(budget).toLocaleString()}/week`;
    const safeGoalName = goalName || campaignGoal || 'Not specified';
    const safeIndustry = industry || 'General';
    const safeLocation = location || 'Not specified';
    const safeProduct = productDescription || 'A general product or service';
    const safeAudience = targetAudience || 'General audience based on the selected industry and location';
    const safeTone = tone || 'professional';

    const systemPrompt = `You are an expert digital advertising strategist. Generate a comprehensive, actionable campaign plan based on the user's inputs. Be specific with numbers, targeting options, and actionable recommendations. Use clear formatting with bold text, bullet points, and numbered lists. Do NOT use any markdown headers (no # or ## symbols). Use bold (**text**) for section titles instead. The plan should feel professional, structured, and immediately useful. Keep the total length under 2000 words.`;

    const userPrompt = `Create a detailed ad campaign plan with the following details:

**Platform(s):** ${platformList}
**Budget:** ${budgetDisplay}
**Industry:** ${safeIndustry}
**Campaign Goal:** ${safeGoalName}
**Location / Geo-Targeting:** ${safeLocation}
**Product/Service:** ${safeProduct}
**Target Audience:** ${safeAudience}
**Tone:** ${safeTone}

Generate the plan with these sections:

1. **Campaign Overview** — Brief summary and strategy direction
2. **Budget Allocation** — How to split the ${budgetDisplay} budget across platforms, ad sets, and stages
3. **Targeting Strategy** — Detailed audience targeting for each platform (demographics, interests, behaviors, lookalikes). Include location-specific targeting recommendations (geo-targeting, radius targeting, language settings, local vs national reach).
4. **Ad Creative Strategy** — Recommended ad formats, creative angles, and content ideas for each platform
5. **Campaign Structure** — How to organize campaigns, ad sets, and ads (suggested naming and grouping)
6. **Timeline & Milestones** — Week-by-week plan for the first 4 weeks
7. **Key Metrics & KPIs** — Exactly which metrics to track and what benchmarks to aim for
8. **Optimization Playbook** — When and how to optimize (day 3, day 7, day 14, day 30 actions)
9. **Pre-Launch Checklist** — Complete checklist of everything to set up before going live
10. **Common Pitfalls to Avoid** — Platform-specific mistakes to watch out for

Make every recommendation specific to the selected platforms. Include dollar amounts where relevant for budget allocation. Keep the plan actionable and practical — no fluff.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const plan = completion.choices?.[0]?.message?.content;

    if (!plan) {
      return NextResponse.json({ error: 'AI returned an empty response. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ plan });
  } catch (error: unknown) {
    console.error('[Plan API Error]', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
