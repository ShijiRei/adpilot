import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: NextRequest) {
  try {
    const { messages, selectedPlatform, campaignGoal } = await req.json();

    const platformContext = selectedPlatform
      ? `The user is asking about ${selectedPlatform} ad campaigns.`
      : 'The user is asking about ad campaigns in general.';

    const goalContext = campaignGoal
      ? `Their campaign goal is: ${campaignGoal}.`
      : '';

    const systemPrompt = `You are AdBot, an expert digital advertising campaign advisor. You have deep knowledge of all major advertising platforms including Meta (Facebook/Instagram), TikTok Ads, Google Ads, YouTube Ads, LinkedIn Ads, and Pinterest Ads.

${platformContext} ${goalContext}

Your role is to help users:
1. Understand which platform is best for their campaign goals
2. Set up campaigns correctly with best practices
3. Optimize their ad spend and targeting
4. Avoid common mistakes and pitfalls
5. Create effective ad copy and creative strategies
6. Estimate budgets and expected performance

Guidelines:
- Be specific and actionable with your advice
- Include concrete numbers, benchmarks, and data when relevant
- Tailor recommendations based on the selected platform and campaign goal
- Warn about common mistakes specific to the platform
- Suggest specific targeting options, budget ranges, and optimization strategies
- Format responses with clear sections, bullet points, and bold text for readability
- Keep responses concise but comprehensive (aim for 200-400 words)
- Always end with a clear next step or recommendation`;

    const conversationMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.';

    return NextResponse.json({ message: aiResponse });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
