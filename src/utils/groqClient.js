import { challenges, rewards, faqs } from './data';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-20b';

function buildSystemPrompt() {
  const challengeLines = challenges
    .map((c) => `- ${c.title}: ${c.difficulty} difficulty, ${c.points} pts, ${c.progress}% community progress`)
    .join('\n');

  const rewardLines = rewards
    .map((r) => `- ${r.title}: ${r.cost} — ${r.desc}`)
    .join('\n');

  const faqLines = faqs
    .map((f) => `Q: ${f.q}\nA: ${f.a}`)
    .join('\n\n');

  return `You are the CivicPlay Assistant, a friendly in-app helper for CivicPlay, \
a gamified civic-engagement app where citizens report issues, complete challenges, \
and redeem points for rewards.

Current challenges:
${challengeLines}

Available rewards:
${rewardLines}

Frequently asked questions:
${faqLines}

Guidelines:
- When asked to compare challenges, reason using the difficulty/points/progress figures above.
- Keep answers short (2-4 sentences) and specific to CivicPlay.
- If asked something you have no data for, say so honestly instead of guessing.`;
}

export async function askAIHelp(userMessage, history = []) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('MISSING_KEY');
  }

  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.5,
      max_tokens: 400,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('Groq API error:', res.status, body);
    throw new Error('API_ERROR');
  }

  const data = await res.json();
  return data.choices[0].message.content;
}