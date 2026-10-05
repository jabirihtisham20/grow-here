import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '@/keystatic.config';

export const runtime = 'nodejs';

type KeystaticHandlers = ReturnType<typeof makeRouteHandler>;

let handlers: KeystaticHandlers | undefined;

function redactSecrets(message: string) {
  for (const secret of [
    process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    process.env.KEYSTATIC_SECRET,
  ]) {
    if (secret) message = message.replaceAll(secret, '[REDACTED]');
  }

  return message
    .replace(/(?:gh[pousr]_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+|Bearer\s+\S+)/gi, '[REDACTED]')
    .slice(0, 1000);
}

async function handleKeystaticRequest(request: Request) {
  const pathname = new URL(request.url).pathname;

  try {
    handlers ??= makeRouteHandler({ config });
    const handler = request.method === 'GET' ? handlers.GET : handlers.POST;
    const response = await handler(request);

    if (response.status >= 500) {
      console.error(`[Keystatic API] ${request.method} ${pathname} returned ${response.status}`);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(
      `[Keystatic API] ${request.method} ${pathname} failed: ${redactSecrets(message)}`
    );

    return new Response('Keystatic request failed. Review server logs for details.', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
}

export const GET = handleKeystaticRequest;
export const POST = handleKeystaticRequest;
