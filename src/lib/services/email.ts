import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Missing RESEND_API_KEY');
  _resend = new Resend(key);
  return _resend;
}

const FROM = 'UK Business Intel <noreply@ukbusinessintel.com>';

export async function sendApiKeyEmail(
  to: string,
  apiKey: string,
  plan: string
): Promise<boolean> {
  try {
    const resend = getResend();
    const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

    await resend.emails.send({
      from: FROM,
      to,
      subject: `Your UK Business Intel API Key (${planLabel} Plan)`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
      <div style="width: 32px; height: 32px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold; font-size: 12px;">UK</div>
      <span style="font-weight: 600; font-size: 14px;">Business Intel API</span>
    </div>

    <h1 style="font-size: 24px; margin-bottom: 8px;">Welcome to the ${planLabel} Plan</h1>
    <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">Your API key is ready. Store it somewhere safe — this is the only time we'll send it.</p>

    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Your API Key</p>
      <code style="color: #34d399; font-size: 14px; word-break: break-all;">${apiKey}</code>
    </div>

    <div style="background: #1c1917; border: 1px solid #7f1d1d33; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #f87171; font-size: 13px; font-weight: 500; margin: 0 0 4px 0;">Keep this key secure</p>
      <p style="color: #a1a1aa; font-size: 12px; margin: 0;">Do not share it publicly. If compromised, revoke it via the API and create a new one.</p>
    </div>

    <h2 style="font-size: 16px; margin-bottom: 12px;">Quick Start</h2>
    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <pre style="margin: 0; font-size: 12px; color: #d4d4d8; white-space: pre-wrap; word-break: break-all;">curl -X POST https://ukbusinessintel.com/api/v1/enrich \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"business_name": "Greggs", "location": "Newcastle"}'</pre>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <a href="https://ukbusinessintel.com/#docs" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">View API Documentation</a>
    </div>

    <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;">
    <p style="color: #52525b; font-size: 11px; text-align: center;">
      UK Business Intel API &mdash; <a href="https://ukbusinessintel.com" style="color: #52525b;">ukbusinessintel.com</a>
    </p>
  </div>
</body>
</html>`,
    });

    return true;
  } catch (err) {
    console.error('[email] Failed to send API key email:', err);
    return false;
  }
}

export async function sendWelcomeEmail(
  to: string,
  plan: string
): Promise<boolean> {
  try {
    const resend = getResend();
    const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

    await resend.emails.send({
      from: FROM,
      to,
      subject: `Welcome to UK Business Intel (${planLabel} Plan)`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
      <div style="width: 32px; height: 32px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold; font-size: 12px;">UK</div>
      <span style="font-weight: 600; font-size: 14px;">Business Intel API</span>
    </div>

    <h1 style="font-size: 24px; margin-bottom: 8px;">Thanks for subscribing!</h1>
    <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">You're now on the <strong style="color: #34d399;">${planLabel}</strong> plan. Your API key was shown on the checkout success page — check there if you haven't saved it yet.</p>

    <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">Need help getting started? Check out the docs or reply to this email.</p>

    <div style="text-align: center; margin-bottom: 32px;">
      <a href="https://ukbusinessintel.com/#docs" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">View Documentation</a>
    </div>

    <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;">
    <p style="color: #52525b; font-size: 11px; text-align: center;">
      UK Business Intel API &mdash; <a href="https://ukbusinessintel.com" style="color: #52525b;">ukbusinessintel.com</a>
    </p>
  </div>
</body>
</html>`,
    });

    return true;
  } catch (err) {
    console.error('[email] Failed to send welcome email:', err);
    return false;
  }
}
