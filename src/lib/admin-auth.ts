import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest } from 'next/server';

const sessionCookie = 'snoopy_admin_session';
const sessionLifetimeSeconds = 60 * 60 * 12;

function signature(timestamp: string) {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!).update(timestamp).digest('hex');
}

export function createAdminSession() {
  const timestamp = String(Date.now());
  return `${timestamp}.${signature(timestamp)}`;
}

export function hasAdminSession(request: NextRequest) {
  const token = request.cookies.get(sessionCookie)?.value;
  if (!token) return false;
  const [timestamp, receivedSignature] = token.split('.');
  if (!timestamp || !receivedSignature || Date.now() - Number(timestamp) > sessionLifetimeSeconds * 1000) return false;
  const expected = signature(timestamp);
  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export const adminSessionCookie = sessionCookie;
export const adminSessionLifetimeSeconds = sessionLifetimeSeconds;
