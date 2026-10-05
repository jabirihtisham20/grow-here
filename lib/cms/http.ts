import { NextResponse } from 'next/server';
import { CmsAuthError } from './auth';

export function cmsErrorResponse(error: unknown) {
  if (error instanceof CmsAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof Error && error.message === 'CMS_DATABASE_NOT_CONFIGURED') {
    return NextResponse.json({ error: 'CMS database is not configured on this server.' }, { status: 503 });
  }
  if (error instanceof Error && error.message === 'CMS_SESSION_SECRET_NOT_CONFIGURED') {
    return NextResponse.json({ error: 'CMS session security is not configured on this server.' }, { status: 503 });
  }
  if (error instanceof Error) {
    const diagnostic = error as Error & {
      code?: string;
      constraint?: string;
      schema?: string;
      table?: string;
      column?: string;
      position?: string;
    };
    console.error('[CMS API] Request failed.', {
      name: diagnostic.name,
      message: diagnostic.message,
      code: diagnostic.code,
      constraint: diagnostic.constraint,
      schema: diagnostic.schema,
      table: diagnostic.table,
      column: diagnostic.column,
      position: diagnostic.position,
    });
  } else {
    console.error('[CMS API] Request failed with a non-Error value.');
  }
  return NextResponse.json({ error: 'The CMS request could not be completed.' }, { status: 500 });
}

export function assertSameOrigin(request: Request) {
  const originHeader = request.headers.get('origin');
  if (!originHeader || originHeader === 'null') {
    throw new CmsAuthError(403, 'A valid Origin header is required for this CMS action.');
  }

  let requestOrigin: URL;
  let adminUrl: URL;
  try {
    requestOrigin = new URL(originHeader);
    const configuredAdminUrl = process.env.ADMIN_URL;
    if (!configuredAdminUrl) throw new Error('ADMIN_URL is not configured');
    adminUrl = new URL(configuredAdminUrl);
  } catch {
    throw new CmsAuthError(403, 'The CMS origin is not configured correctly.');
  }

  // Compare only scheme + host + port. ADMIN_URL includes the /admin path,
  // while the browser's Origin header contains only the origin.
  if (requestOrigin.origin === adminUrl.origin) return;

  // During local development, localhost and 127.0.0.1 are the same loopback
  // machine. Permit only that explicit alias, with the same protocol and port.
  const isDevelopmentLoopbackAlias = process.env.NODE_ENV !== 'production'
    && requestOrigin.protocol === 'http:'
    && adminUrl.protocol === 'http:'
    && requestOrigin.port === adminUrl.port
    && new Set([requestOrigin.hostname, adminUrl.hostname]).size === 2
    && [requestOrigin.hostname, adminUrl.hostname].every((host) => host === 'localhost' || host === '127.0.0.1');

  if (!isDevelopmentLoopbackAlias) {
    throw new CmsAuthError(403, 'Cross-origin CMS requests are not allowed.');
  }
}

export function parseJsonObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new CmsAuthError(400, 'A JSON object is required.');
  }
  return value as Record<string, unknown>;
}

export function boundedString(value: unknown, name: string, maxLength: number, required = false): string | null {
  if (value == null && !required) return null;
  if (typeof value !== 'string') throw new CmsAuthError(400, `${name} must be a string.`);
  const normalized = value.trim();
  if (required && !normalized) throw new CmsAuthError(400, `${name} is required.`);
  if (normalized.length > maxLength) throw new CmsAuthError(400, `${name} is too long.`);
  return normalized;
}

export function postStatus(value: unknown): 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' {
  if (value === 'DRAFT' || value === 'PUBLISHED' || value === 'ARCHIVED') return value;
  throw new CmsAuthError(400, 'Post status must be DRAFT, PUBLISHED, or ARCHIVED.');
}

export function slugValue(value: unknown): string {
  const slug = boundedString(value, 'slug', 120, true)!;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new CmsAuthError(400, 'Slug must contain lowercase letters, numbers, and single hyphens.');
  }
  return slug;
}

export function stringList(value: unknown, name: string): string[] {
  if (value == null) return [];
  if (!Array.isArray(value) || value.length > 50 || value.some((item) => typeof item !== 'string' || item.length > 80)) {
    throw new CmsAuthError(400, `${name} must be a list of up to 50 strings.`);
  }
  return [...new Set(value.map((item) => item.trim()).filter(Boolean))];
}
