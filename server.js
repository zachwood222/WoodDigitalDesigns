const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_BODY_SIZE = 50 * 1024;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
const submissions = new Map();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function securityHeaders(contentType = 'text/plain; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  };
}

function sendJson(res, status, data) {
  res.writeHead(status, securityHeaders('application/json; charset=utf-8'));
  res.end(JSON.stringify(data));
}

function clean(value, maxLength = 500) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function rateLimited(req) {
  const now = Date.now();
  const key = getClientIp(req);
  const recent = (submissions.get(key) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length) submissions.set(key, recent);
  else submissions.delete(key);
  return recent.length >= MAX_SUBMISSIONS;
}

function recordSubmission(req) {
  const now = Date.now();
  const key = getClientIp(req);
  const recent = (submissions.get(key) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  submissions.set(key, recent);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(new Error('Request is too large.'));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid request data.'));
      }
    });

    req.on('error', reject);
  });
}

async function sendWithResend(inquiry) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) return false;

  const details = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Service: ${inquiry.service}`,
    inquiry.business && `Business: ${inquiry.business}`,
    inquiry.businessType && `Business type: ${inquiry.businessType}`,
    inquiry.location && `Location/service area: ${inquiry.location}`,
    inquiry.budget && `Budget: ${inquiry.budget}`,
    inquiry.timeline && `Timeline: ${inquiry.timeline}`
  ].filter(Boolean);
  if (inquiry.message) details.push('', 'Project details:', inquiry.message);
  const text = details.join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || 'Wood Digital Designs <onboarding@resend.dev>',
      to: [process.env.OWNER_EMAIL],
      reply_to: inquiry.email,
      subject: `New Wood Digital Designs inquiry from ${inquiry.name}`,
      text
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend rejected the message: ${message.slice(0, 300)}`);
  }

  return true;
}

async function sendWithWebhook(inquiry) {
  if (!process.env.CONTACT_WEBHOOK_URL) return false;

  const response = await fetch(process.env.CONTACT_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(inquiry)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Contact service rejected the message: ${message.slice(0, 300)}`);
  }

  return true;
}

async function handleContact(req, res) {
  if (rateLimited(req)) {
    sendJson(res, 429, {
      ok: false,
      message: 'Too many submissions. Please try again in a few minutes.'
    });
    return;
  }

  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    sendJson(res, 415, { ok: false, message: 'Contact requests must use JSON.' });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { ok: false, message: error.message });
    return;
  }

  const inquiry = {
    name: clean(body.name, 100),
    email: clean(body.email, 200).toLowerCase(),
    service: clean(body.service, 100),
    business: clean(body.business, 150),
    businessType: clean(body.businessType, 150),
    location: clean(body.location, 200),
    budget: clean(body.budget, 100),
    timeline: clean(body.timeline, 100),
    message: clean(body.message, 2000),
    website: clean(body.website, 200)
  };

  if (inquiry.website) {
    sendJson(res, 200, { ok: true, message: 'Thank you. Your inquiry was received.' });
    return;
  }

  if (!inquiry.name || !validEmail(inquiry.email) || !inquiry.service) {
    sendJson(res, 400, {
      ok: false,
      message: 'Please enter your name, a valid email, and select a service.'
    });
    return;
  }

  recordSubmission(req);

  try {
    const sentByResend = await sendWithResend(inquiry);
    const sentByWebhook = sentByResend ? false : await sendWithWebhook(inquiry);

    if (sentByResend || sentByWebhook) {
      sendJson(res, 200, { ok: true, message: 'Thank you. Your inquiry has been sent.' });
      return;
    }

    sendJson(res, 503, {
      ok: false,
      fallback: true,
      ownerEmail: process.env.OWNER_EMAIL || '',
      message: 'Contact delivery is not configured yet.'
    });
  } catch (error) {
    console.error('Contact form error:', error.message);
    sendJson(res, 500, {
      ok: false,
      message: 'Your inquiry could not be sent. Please try again or email us directly.'
    });
  }
}

function safeFilePath(urlPath) {
  try {
    const decoded = decodeURIComponent(urlPath);
    if (decoded.includes('\0')) return null;
    const candidate = path.resolve(PUBLIC_DIR, `.${decoded}`);
    return candidate === PUBLIC_DIR || candidate.startsWith(`${PUBLIC_DIR}${path.sep}`)
      ? candidate
      : null;
  } catch {
    return null;
  }
}

function serveFile(req, res, filePath) {
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      res.writeHead(404, securityHeaders());
      res.end(req.method === 'HEAD' ? undefined : 'Not found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || 'application/octet-stream';
    const headers = securityHeaders(contentType);
    headers['Cache-Control'] = extension === '.html' ? 'no-cache' : 'public, max-age=86400';
    res.writeHead(200, headers);
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && parsedUrl.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, app: 'Wood Digital Designs' });
    return;
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/contact') {
    await handleContact(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { ok: false, message: 'Method not allowed.' });
    return;
  }

  const requestPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  const filePath = safeFilePath(requestPath);

  if (!filePath) {
    res.writeHead(400, securityHeaders());
    res.end('Bad request');
    return;
  }

  serveFile(req, res, filePath);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Wood Digital Designs running on port ${PORT}`);
});
