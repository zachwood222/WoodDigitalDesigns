const test = require('node:test');
const assert = require('node:assert/strict');
const { deliverInquiry } = require('../server');

const inquiry = {
  name: 'Test Person',
  email: 'person@example.com',
  service: 'Website Design'
};

test('falls back to the next configured server provider when Resend fails', { concurrency: false }, async (t) => {
  const originalFetch = global.fetch;
  const originalKey = process.env.RESEND_API_KEY;
  const originalWebhook = process.env.CONTACT_WEBHOOK_URL;
  process.env.RESEND_API_KEY = 'invalid-test-key';
  process.env.CONTACT_WEBHOOK_URL = 'https://example.com/contact';

  t.after(() => {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    if (originalWebhook === undefined) delete process.env.CONTACT_WEBHOOK_URL;
    else process.env.CONTACT_WEBHOOK_URL = originalWebhook;
  });

  const requests = [];
  global.fetch = async (url) => {
    requests.push(url);
    if (url.includes('api.resend.com')) {
      return new Response('Invalid API key', { status: 401 });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const result = await deliverInquiry(inquiry);
  assert.equal(result.sent, true);
  assert.equal(result.provider, 'contact webhook');
  assert.equal(requests.length, 2);
});

test('reports failure only after every available provider has been tried', { concurrency: false }, async (t) => {
  const originalFetch = global.fetch;
  const originalKey = process.env.RESEND_API_KEY;
  const originalWebhook = process.env.CONTACT_WEBHOOK_URL;
  process.env.RESEND_API_KEY = 'invalid-test-key';
  process.env.CONTACT_WEBHOOK_URL = 'https://example.com/contact';

  t.after(() => {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    if (originalWebhook === undefined) delete process.env.CONTACT_WEBHOOK_URL;
    else process.env.CONTACT_WEBHOOK_URL = originalWebhook;
  });

  let attempts = 0;
  global.fetch = async () => {
    attempts += 1;
    return new Response('Unavailable', { status: 503 });
  };

  const result = await deliverInquiry(inquiry);
  assert.equal(result.sent, false);
  assert.equal(attempts, 2);
  assert.equal(result.errors.length, 2);
});
