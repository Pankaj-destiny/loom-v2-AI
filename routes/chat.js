const express = require('express');
const router = express.Router();
const { spendCredits } = require('../db');

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.MODEL || 'openrouter/free';
const CHAT_COST = 1;

function languageInstruction(lang) {
  switch (lang) {
    case 'hindi':
      return 'Reply only in Hindi (Devanagari script).';
    case 'hinglish':
      return 'Reply in Hinglish — Hindi words written in Roman/English script, mixed naturally with English as Indian users typically type.';
    case 'marathi':
      return 'Reply only in Marathi (Devanagari script).';
    case 'english':
      return 'Reply only in English.';
    default:
      return 'Reply in the same language and script the user used in their message. If they mix Hindi and English (Hinglish), match that style.';
  }
}

router.post('/chat', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server is missing OPENROUTER_API_KEY. Add it to your .env file.' });
  }
  const { messages, lang } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const userId = req.userId;
  if (!spendCredits(userId, CHAT_COST, 'chat')) {
    return res.status(402).json({ error: 'Not enough credits. Please upgrade your plan.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': process.env.APP_NAME || 'Loom V2'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        stream: true,
        messages: [
          { role: 'system', content: languageInstruction(lang) },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ]
      })
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text();
      console.error('OpenRouter API error:', errText);
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'Upstream API error' })}\n\n`);
      return res.end();
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6);
        if (payload === '[DONE]') continue;
        try {
          const json = JSON.parse(payload);
          const text = json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        } catch (e) { /* ignore parse errors on partial chunks */ }
      }
    }

    res.write('event: done\ndata: {}\n\n');
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

module.exports = router;
