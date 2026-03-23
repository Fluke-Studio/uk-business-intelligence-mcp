import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  const email = request.nextUrl.searchParams.get('email');

  if (!sessionId) {
    return Response.json({ success: false, error: 'Missing session_id' }, { status: 400 });
  }

  if (!email) {
    return Response.json({ success: false, error: 'Missing email' }, { status: 400 });
  }

  // Look up the cached API key data from the webhook handler
  const { data: cached } = await supabase
    .from('cache')
    .select('data')
    .eq('cache_key', `checkout:${sessionId}`)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (!cached) {
    return Response.json({ success: false, error: 'Key not ready yet' }, { status: 202 });
  }

  const keyData = cached.data as { api_key: string; plan: string; email: string };

  // Verify the email matches — prevents session ID enumeration attacks
  if (email.toLowerCase() !== keyData.email?.toLowerCase()) {
    return Response.json({ success: false, error: 'Key not ready yet' }, { status: 202 });
  }

  // Delete the cached key after retrieval (one-time use)
  await supabase.from('cache').delete().eq('cache_key', `checkout:${sessionId}`);

  return Response.json({ success: true, data: keyData });
}
