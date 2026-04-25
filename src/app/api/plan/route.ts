import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: NextRequest) {
  try {
    const {
      platforms,
      budget,
      budgetPeriod,
      industry,
      campaignGoal,
      goalName,
      productDescription,
      targetAudience,
      tone,
    } = await req.json();

    const platformList = platforms.join(', ');
    const budgetDisplay = budgetPeriod === 'monthly' ? `$${budget.toLocaleString()}/month` : `$${budget.toLocaleString()}/week`;

    const systemPrompt = `You are an expert digital advertising strategist. Generate a comprehensive, actionable campaign plan based on the user's inputs. Be specific with numbers, targeting options, and actionable recommendations. Use clear formatting with headers, bullet points, and bold text. Do NOT use any markdown headers (no # or ##). Use bold (**text**) for section titles instead. The plan should feel professional, structured, and immediately useful.`;

    const userPrompt = `Create a detailed ad campaign plan with the following details:

**Platform(s):** ${platformList}
**Budget:** ${budgetDisplay}
**Industry:** ${industry}
**Campaign Goal:** ${goalName}
**Product/Service:** ${productDescription || 'Not specified — provide general recommendations'}
**Target Audience:** ${targetAudience || 'Not specified — suggest based on industry and goal'}
**Tone:** ${tone}

Generate the plan with these sections:

1. **Campaign Overview** — Brief summary and strategy direction
2. **Budget Allocation** — How to split the ${budgetDisplay} budget across platforms, ad sets, and stages
3. **Targeting Strategy** — Detailed audience targeting for each platform (demographics, interests, behaviors, lookalikes)
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

    const plan = completion.choices[0]?.message?.content || 'Failed to generate campaign plan. Please try again.';

    return NextResponse.json({ plan });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
