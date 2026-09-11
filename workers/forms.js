import { EmailMessage } from 'cloudflare:email';

const ALLOWED_ORIGINS = new Set([
  'https://jointheripple.com.au',
  'https://www.jointheripple.com.au',
]);

const LIMITS = {
  name: 120,
  email: 254,
  location: 160,
  can_help: 3000,
  asked_about: 2000,
  curious: 2000,
  learning: 2000,
  need_help: 2000,
  meet: 2000,
  work: 1000,
  links: 500,
  message: 5000,
};

const json = (body, status, origin) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
  },
});

const preflight = (origin) => new Response(null, {
  status: 204,
  headers: {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  },
});

const clean = (value, max) => String(value ?? '').trim().slice(0, max);
const safeHeader = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();

async function requestKey(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const agent = request.headers.get('User-Agent') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  const input = new TextEncoder().encode(`${day}|${ip}|${agent}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function emailBody(data) {
  const lines = [
    `Submission type: ${data.type}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
  ];
  const fields = [
    ['Location', data.location],
    ['Can help with', data.can_help],
    ['People ask me about', data.asked_about],
    ['Curious about', data.curious],
    ['Currently learning', data.learning],
    ['Could use help with', data.need_help],
    ['Would like to meet or learn from', data.meet],
    ['Happy to', data.happy_to.join(', ')],
    ['What I do', data.work],
    ['Links', data.links],
    ['Message', data.message],
  ];
  for (const [label, value] of fields) if (value) lines.push(`\n${label}:\n${value}`);
  return lines.join('\n');
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.has(origin)) return json({ ok: false, message: 'Origin not allowed.' }, 403, origin);
    if (request.method === 'OPTIONS') return preflight(origin);
    if (request.method !== 'POST') return json({ ok: false, message: 'Method not allowed.' }, 405, origin);

    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > 50000) return json({ ok: false, message: 'Submission is too large.' }, 413, origin);

    let input;
    try {
      input = await request.json();
    } catch {
      return json({ ok: false, message: 'Invalid submission.' }, 400, origin);
    }

    if (input.company_website) return json({ ok: true, message: 'Thanks. Your submission has been received.' }, 200, origin);

    const data = {
      type: input.type === 'contact' ? 'contact' : 'join',
      name: clean(input.name, LIMITS.name),
      email: clean(input.email, LIMITS.email).toLowerCase(),
      location: clean(input.location, LIMITS.location),
      can_help: clean(input.can_help, LIMITS.can_help),
      asked_about: clean(input.asked_about, LIMITS.asked_about),
      curious: clean(input.curious, LIMITS.curious),
      learning: clean(input.learning, LIMITS.learning),
      need_help: clean(input.need_help, LIMITS.need_help),
      meet: clean(input.meet, LIMITS.meet),
      happy_to: Array.isArray(input.happy_to) ? input.happy_to.map((v) => clean(v, 100)).slice(0, 10) : [],
      work: clean(input.work, LIMITS.work),
      links: clean(input.links, LIMITS.links),
      message: clean(input.message, LIMITS.message),
      consent: Boolean(input.consent),
    };

    if (!data.name || !/^\S+@\S+\.\S+$/.test(data.email)) return json({ ok: false, message: 'Please provide your name and a valid email address.' }, 400, origin);
    if (data.type === 'join' && (!data.can_help || !data.consent)) return json({ ok: false, message: 'Please complete the required fields and consent checkbox.' }, 400, origin);
    if (data.type === 'contact' && !data.message) return json({ ok: false, message: 'Please enter a message.' }, 400, origin);

    const key = await requestKey(request);
    const recent = await env.DB.prepare("SELECT COUNT(*) AS total FROM submissions WHERE request_key = ? AND created_at > datetime('now', '-1 hour')").bind(key).first();
    if ((recent?.total || 0) >= 3) return json({ ok: false, message: 'Too many submissions. Please try again later.' }, 429, origin);

    await env.DB.prepare(`INSERT INTO submissions
      (type, name, email, location, can_help, asked_about, curious, learning, need_help, meet, happy_to, work_context, links, message, consent, request_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(data.type, data.name, data.email, data.location, data.can_help, data.asked_about, data.curious, data.learning, data.need_help, data.meet, JSON.stringify(data.happy_to), data.work, data.links, data.message, data.consent ? 1 : 0, key)
      .run();

    const recipient = clean(env.NOTIFICATION_TO, LIMITS.email).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(recipient)) {
      console.error('NOTIFICATION_TO is not configured with a valid email address');
      return json({ ok: false, message: 'Your submission was saved, but the notification could not be sent.' }, 500, origin);
    }

    const subject = data.type === 'join' ? `Join the Ripple: ${safeHeader(data.name)}` : `Ripples contact: ${safeHeader(data.name)}`;
    const raw = [
      'From: Ripples website <forms@jointheripple.com.au>',
      `To: ${safeHeader(recipient)}`,
      `Reply-To: ${safeHeader(data.email)}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      emailBody(data),
    ].join('\r\n');

    try {
      await env.EMAIL.send(new EmailMessage('forms@jointheripple.com.au', recipient, raw));
    } catch (error) {
      console.error('Notification email failed', error);
    }

    return json({ ok: true, message: data.type === 'join' ? 'Thanks. Your submission has been received for review.' : 'Thanks. Your message has been sent.' }, 200, origin);
  },
};
