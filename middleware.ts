import { NextRequest, NextResponse } from 'next/server';
import {
  canUserAccessPath,
  getDefaultAuthorizedRedirect,
  getRouteAccessRule,
  isProtectedPath,
} from './src/lib/routeAccess';

// Функция для проверки валидности JWT токена
function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    // Разбиваем токен на части (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false; // Некорректный формат токена
    }

    // Декодируем payload (вторая часть)
    const payload = JSON.parse(atob(parts[1]));

    // Проверяем, не истек ли токен (exp - время истечения в секундах)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return false;
  }
}

// Функция для получения типа пользователя из токена
function getUserTypeFromToken(token: string | null): string | null {
  if (!token) return null;

  try {
    // Разбиваем токен на части (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null; // Некорректный формат токена
    }

    // Декодируем payload (вторая часть)
    const payload = JSON.parse(atob(parts[1]));

    // Возвращаем тип пользователя из токена
    return payload.user_type || payload.type || null;
  } catch (error) {
    console.error('Ошибка при получении типа пользователя из токена:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = isProtectedPath(pathname);
  const routeRule = getRouteAccessRule(pathname);

  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value;

    if (token && !isTokenValid(token)) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const userType = getUserTypeFromToken(token) as 'client' | 'trainer' | null;
    if (!canUserAccessPath(pathname, userType)) {
      return NextResponse.redirect(
        new URL(getDefaultAuthorizedRedirect(userType), request.url),
      );
    }
  }

  if (!isProtectedRoute && routeRule?.prefix === '/auth') {
    const token = request.cookies.get('token')?.value;
    if (token && isTokenValid(token)) {
      const userType = getUserTypeFromToken(token) as 'client' | 'trainer' | null;
      return NextResponse.redirect(
        new URL(getDefaultAuthorizedRedirect(userType), request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
