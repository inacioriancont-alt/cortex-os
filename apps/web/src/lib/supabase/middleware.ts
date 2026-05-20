import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { getSupabaseEnv, hasMockAuthCookie, isSupabaseConfigured } from './config';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup');
  const isCallback = request.nextUrl.pathname.startsWith('/auth/');

  if (!isSupabaseConfigured()) {
    const mockAuth = hasMockAuthCookie(request.headers.get('cookie'));

    if (!mockAuth && !isAuthPage && !isCallback) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = '/login';
      redirect.searchParams.set('setup', '1');
      return NextResponse.redirect(redirect);
    }

    if (mockAuth && isAuthPage) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = '/';
      redirect.searchParams.delete('setup');
      return NextResponse.redirect(redirect);
    }

    return supabaseResponse;
  }

  const env = getSupabaseEnv()!;
  const url = env.url;
  const key = env.anonKey;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isAuthPage && !isCallback) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/login';
    return NextResponse.redirect(redirect);
  }

  if (user && isAuthPage) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/';
    return NextResponse.redirect(redirect);
  }

  return supabaseResponse;
}
