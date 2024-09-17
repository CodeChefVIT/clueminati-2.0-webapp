import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = 5;
const timeWindow = 10 * 60 * 1000;

const ipRequestMap = new Map<string, { count: number, startTime: number }>();

const rateLimitExceededResponse = () => 
  new NextResponse('Rate limit exceeded', { status: 429 });

export function middleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const currentTime = Date.now();
  const hit = ipRequestMap.get(ip);

  if (!hit) {
    ipRequestMap.set(ip, { count: 1, startTime: currentTime });
  } else {
    const { count, startTime } = hit;

    if (currentTime - startTime > timeWindow) {
      ipRequestMap.set(ip, { count: 1, startTime: currentTime });
    } else {
      if (count >= rateLimit) {
        return rateLimitExceededResponse();
      }
      ipRequestMap.set(ip, { count: count + 1, startTime });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/login', '/api/auth/update'],
};
